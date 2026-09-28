# Form submissions → Supabase → Google Sheet

How the pieces fit:

```
/prebook form ─▶ Server Action ─▶ Supabase `prebookings`          ─▶ "Pre-bookings" tab
/meet form    ─▶ Server Action ─▶ Supabase `meet_registrations`   ─▶ "Meet registrations" tab
                                  unique index = the dedup            (mirror, keyed by id)
```

Supabase is the source of truth. The Sheet is a mirror you can sort, filter and
share; nothing depends on it. Dedup happens in Postgres, not in the Sheet, so
two people cannot race past each other:

| Table | One row per |
| --- | --- |
| `prebookings` | phone number |
| `meet_registrations` | WhatsApp number, per event |

[`lostcoz-sync.gs`](./lostcoz-sync.gs) keeps each tab an exact copy of its
table, matched on the Supabase `id`: new rows are appended, changed rows are
updated in place, deleted rows are removed, and a row can never appear twice.
Columns you add **to the right** of the mirrored ones (notes, "added to group ✓")
are left alone and travel with their row.

---

## 1. Create the table

Supabase Dashboard → **SQL Editor** → **New query** → paste
[`supabase/schema.sql`](../../supabase/schema.sql) → **Run**.

It is idempotent, so re-running is safe. It creates `public.prebookings` and
`public.meet_registrations` with their unique indexes, the private
`meet-payments` Storage bucket for payment screenshots, turns on row-level
security, and gives the anonymous role insert-and-nothing-else.

Check it worked: **Table Editor** lists both tables with *RLS enabled*, and
**Storage** lists `meet-payments` (private).

## 2. Point the site at the project

`.env.local` in the repo root (already gitignored):

```
SUPABASE_URL=https://dkvgewowukpqetboqxmd.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_zv4fK8aQn76VZq2s1ul_PQ_X4rI6B9A
```

Add the same two variables to your host (Vercel → Settings → Environment
Variables, or equivalent) before deploying. Restart `next dev` after editing
`.env.local` — Next only reads it at boot.

Test: `npm run dev`, open <http://localhost:3000/prebook>, submit once. The row
appears in the Table Editor. Submit again with the same number and the page says
*"You've already pre-booked."* — that is the unique index doing its job. Same
for <http://localhost:3000/meet> (*"You're already registered."*).

## 3. Get a secret key for the Sheet

The Sheet needs to **read** rows and sign screenshot links, which the
publishable key cannot do.

Supabase Dashboard → **Project Settings → API Keys** → copy the **secret**
key (`sb_secret_…`, shown as `service_role` on older projects).

> This key bypasses RLS. It goes in Apps Script Script Properties and nowhere
> else — never in the website, never in the repo.

## 4. Create the Apps Script

1. Make a Google Sheet (name it whatever you like).
2. **Extensions → Apps Script**.
3. Delete the stub `Code.gs` contents and paste all of
   [`lostcoz-sync.gs`](./lostcoz-sync.gs). Already running the older
   `prebook-sync.gs`? Replace it with this — the "Pre-bookings" tab keeps its
   columns, and the script properties stay as they are.
4. **Project Settings** (gear icon) → **Script Properties** → **Add script
   property**, three times:

   | Property | Value |
   | --- | --- |
   | `SUPABASE_URL` | `https://dkvgewowukpqetboqxmd.supabase.co` |
   | `SUPABASE_SECRET_KEY` | the `sb_secret_…` key from step 3 |
   | `WEBHOOK_SECRET` | any long random string you invent — e.g. `openssl rand -hex 24` |

5. Save.

## 5. First sync + auto-sync

Back on the Sheet, reload the tab. A **Lostcoz** menu appears.

- **Lostcoz → Sync now** — authorise when Google asks (it is your own script, so
  click *Advanced → Go to … (unsafe)*). It creates both tabs with their header
  rows and backfills everything already in Supabase.
- **Lostcoz → Turn on auto-sync (every 5 minutes)** — adds a time trigger that
  re-mirrors both tables, so new rows, edits and deletions in Supabase show up
  within five minutes. It replaces the old hourly trigger if you had one.

Syncing twice never duplicates a line. The first sync after upgrading from
`prebook-sync.gs` reports every pre-booking as *updated*: the Phone column
becomes a WhatsApp link. That is a one-off.

In the Meet tab, **WhatsApp** opens a chat with that person, and **Payment
screenshot** is a *View* link to the uploaded image. Those links are signed for
a year and work for anyone who has the Sheet, so share it only with the team.

**Five minutes is enough for most events. If you want rows to land instantly,
do step 6 as well.** The two run happily side by side.

## 6. (Optional) Instant push on every change

### 6a. Deploy the script as a web app

In the Apps Script editor: **Deploy → New deployment** → gear → **Web app**.

- Description: `lostcoz sheet webhook`
- Execute as: **Me**
- Who has access: **Anyone**  ← required; the shared secret is what protects it

**Deploy**, then copy the **Web app URL**. It looks like
`https://script.google.com/macros/s/AKfy…/exec`.

Your webhook URL is that, plus the secret from step 4:

```
https://script.google.com/macros/s/AKfy…/exec?secret=YOUR_WEBHOOK_SECRET
```

> Apps Script web apps cannot read custom request headers, which is why the
> secret rides in the query string.

### 6b. Wire Supabase to it

**Either** via the dashboard — Supabase → **Database → Webhooks** → *Create a new
hook*, once per table:

| Field | Value |
| --- | --- |
| Name | `prebookings_to_sheet` / `meet_registrations_to_sheet` |
| Table | `public.prebookings` / `public.meet_registrations` |
| Events | `Insert`, `Update`, `Delete` |
| Type | HTTP Request |
| Method | `POST` |
| URL | the URL from 6a, secret included (same URL for both) |
| HTTP Headers | `Content-Type: application/json` |

**Or** via SQL — uncomment the `pg_net` block at the bottom of
`supabase/schema.sql`, paste your URL and secret into it, and run it. It wires
both tables and replaces the older insert-only pre-booking trigger.

The script reads the table name from the payload, so one deployment serves
both tables and either route works.

### 6c. Re-deploy after edits

Apps Script serves the *deployed* version, not the editor's. After changing
`lostcoz-sync.gs`, go **Deploy → Manage deployments → ✏️ → Version: New version
→ Deploy**, and keep the same URL.

---

## Reconciling payments

`payment_status` starts at `pending`. Once you have matched the payment against
your UPI statement, set it to `paid` (or `refunded`) in the Supabase Table
Editor; the Sheet picks it up on the next sync. The **UPI reference** column
(pre-bookings) and the **Payment screenshot** link (meet) make that a
one-glance job — both are optional on the forms, so expect some blanks.

The sync is one-way. Edits typed into the mirrored columns of the Sheet are
overwritten by the next sync — make them in Supabase, or keep your own notes in
extra columns to the right.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| Form says "Something broke on our side" | `.env.local` missing/stale — restart `next dev`. Or RLS insert policy missing — re-run `schema.sql`. |
| Every submission says "already pre-booked" | Expected for a repeat number. To clear a test, delete the row in the Table Editor. |
| `Supabase returned 401` in Apps Script | `SUPABASE_SECRET_KEY` is the publishable key, not the secret one. |
| Webhook fires, nothing in the Sheet | Secret mismatch — check `?secret=` matches `WEBHOOK_SECRET`. Apps Script → **Executions** shows `doPost` and its return value. |
| Webhook log shows `302`, not `200` | Normal. Apps Script runs the script, *then* redirects to `script.googleusercontent.com` to serve the body; Supabase does not follow the redirect. The row still lands — judge it by the Sheet. |
| `Failed to create webhook: schema "supabase_functions" does not exist` | The Database Webhooks integration is off. Dashboard → **Integrations → Database Webhooks → Enable**, then create the hook again. Or skip the UI and use the `pg_net` trigger block at the bottom of `supabase/schema.sql`. |
| Sheet has the rows but no header styling | The header is only written when the sheet is empty. Delete the tab and sync again. |
| Toast says *"table not created yet"* | That table's SQL has not been run. Re-run `schema.sql`; the other tab keeps syncing meanwhile. |
| Payment screenshot shows a raw path, not *View* | Signing failed (check **Executions** for `Could not sign`). Usually the bucket is missing — re-run `schema.sql` — then clear the cell and sync. |
| *View* link says the token expired | It is over a year old. Clear the cell and sync to sign a fresh one. |
| A row you deleted in the Sheet came back | Expected: the Sheet mirrors Supabase. Delete it in Supabase instead. |
