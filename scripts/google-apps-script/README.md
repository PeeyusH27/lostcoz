# Pre-bookings → Supabase → Google Sheet

How the pieces fit:

```
/prebook form  ──▶  Server Action  ──▶  Supabase `prebookings`  ──▶  Google Sheet
  (browser)          (Next.js)          unique index on phone       (mirror only)
                                          = the dedup
```

Supabase is the source of truth. The Sheet is a mirror you can sort, filter and
share; nothing depends on it. Dedup happens in Postgres, not in the Sheet, so
two people cannot race past each other.

---

## 1. Create the table

Supabase Dashboard → **SQL Editor** → **New query** → paste
[`supabase/schema.sql`](../../supabase/schema.sql) → **Run**.

It is idempotent, so re-running is safe. It creates `public.prebookings`, the
unique index on `phone`, turns on row-level security, and gives the anonymous
role insert-and-nothing-else.

Check it worked: **Table Editor → prebookings** exists, and its RLS badge says
*RLS enabled*.

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
*"You've already pre-booked."* — that is the unique index doing its job.

## 3. Get a secret key for the Sheet

The Sheet needs to **read**, which the publishable key cannot do.

Supabase Dashboard → **Project Settings → API Keys** → copy the **secret**
key (`sb_secret_…`, shown as `service_role` on older projects).

> This key bypasses RLS. It goes in Apps Script Script Properties and nowhere
> else — never in the website, never in the repo.

## 4. Create the Apps Script

1. Make a Google Sheet (name it whatever you like).
2. **Extensions → Apps Script**.
3. Delete the stub `Code.gs` contents and paste all of
   [`prebook-sync.gs`](./prebook-sync.gs).
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

- **Lostcoz → Sync pre-bookings now** — authorise when Google asks (it is your
  own script, so click *Advanced → Go to … (unsafe)*), then it backfills every
  existing row and creates the header row.
- **Lostcoz → Install hourly auto-sync** — adds a time trigger so the Sheet keeps
  itself current even if nothing pushes to it.

Rows are keyed by Supabase `id`, so syncing twice never duplicates a line.

**Hourly is enough for most launches. If you want rows to land instantly, do
step 6 as well.** The two run happily side by side.

## 6. (Optional) Instant push on every new booking

### 6a. Deploy the script as a web app

In the Apps Script editor: **Deploy → New deployment** → gear → **Web app**.

- Description: `prebook webhook`
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
hook*:

| Field | Value |
| --- | --- |
| Name | `prebookings_to_sheet` |
| Table | `public.prebookings` |
| Events | `Insert` |
| Type | HTTP Request |
| Method | `POST` |
| URL | the URL from 6a, secret included |
| HTTP Headers | `Content-Type: application/json` |

**Or** via SQL — uncomment the `pg_net` block at the bottom of
`supabase/schema.sql`, paste your URL and secret into it, and run it.

The script accepts both payload shapes, so either route works.

### 6c. Re-deploy after edits

Apps Script serves the *deployed* version, not the editor's. After changing
`prebook-sync.gs`, go **Deploy → Manage deployments → ✏️ → Version: New version
→ Deploy**, and keep the same URL.

---

## Reconciling payments

`payment_status` starts at `pending`. Once you have matched the ₹499 against your
UPI statement, set it to `paid` in the Supabase Table Editor. The **UPI
reference** column is there to make that a one-glance job — it is optional on the
form, so expect some blanks.

Note that editing a row in Supabase does **not** update the Sheet: this sync only
appends rows it has never seen. If you want the Sheet to reflect edits, do the
status tracking in the Sheet instead and treat Supabase as the raw log.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| Form says "Something broke on our side" | `.env.local` missing/stale — restart `next dev`. Or RLS insert policy missing — re-run `schema.sql`. |
| Every submission says "already pre-booked" | Expected for a repeat number. To clear a test, delete the row in the Table Editor. |
| `Supabase returned 401` in Apps Script | `SUPABASE_SECRET_KEY` is the publishable key, not the secret one. |
| Webhook fires, nothing in the Sheet | Secret mismatch — check `?secret=` matches `WEBHOOK_SECRET`. Apps Script → **Executions** shows `doPost` and its return value. |
| Sheet has the rows but no header styling | The header is only written when the sheet is empty. Delete the tab and sync again. |
