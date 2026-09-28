-- Order of Dharma pre-bookings.
--
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query → Run).
-- Safe to re-run: every statement is idempotent.
--
-- Security model: the website holds only the *publishable* key, which acts as the
-- `anon` role. Anon may INSERT and nothing else — it cannot read, update or delete,
-- so the key being in a server bundle leaks nothing and nobody can enumerate the
-- list. Dedup therefore cannot be a SELECT-then-INSERT; it is the unique index on
-- `phone`, and the app reads SQLSTATE 23505 back as "already pre-booked".

create table if not exists public.prebookings (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  name          text        not null check (char_length(name) between 2 and 80),
  -- canonical 10-digit Indian mobile; the app strips +91/spaces before insert
  phone         text        not null check (phone ~ '^[6-9][0-9]{9}$'),
  age           integer     not null check (age between 12 and 120),
  gender        text        not null check (gender in ('female','male','non-binary','undisclosed')),

  enjoyment     integer     not null check (enjoyment between 1 and 10),
  favourite     text        not null check (char_length(favourite) between 3 and 1000),

  fulfilment    text        not null check (fulfilment in ('pickup','delivery')),
  address       text        check (char_length(address) <= 500),

  upi_reference text        check (char_length(upi_reference) <= 40),
  amount        integer     not null default 499,
  source_ip     text,

  -- set by hand once the ₹499 is reconciled against the UPI statement
  payment_status text       not null default 'pending'
                            check (payment_status in ('pending','paid','refunded')),

  -- bookkeeping for the Google Sheet sync (see scripts/google-apps-script/)
  synced_at     timestamptz,

  -- a delivery is useless without somewhere to deliver to
  constraint prebookings_delivery_needs_address
    check (fulfilment <> 'delivery' or char_length(coalesce(address, '')) >= 15)
);

-- THE dedup. One pre-booking per mobile number; a second attempt raises 23505.
create unique index if not exists prebookings_phone_key on public.prebookings (phone);

-- the Sheet sync pulls by created_at
create index if not exists prebookings_created_at_idx on public.prebookings (created_at);

alter table public.prebookings enable row level security;

-- Anonymous callers (the website) may add a row and do nothing else.
drop policy if exists "prebookings: anon can insert" on public.prebookings;
create policy "prebookings: anon can insert"
  on public.prebookings for insert
  to anon
  with check (true);

-- No select/update/delete policy for anon is intentional: with RLS on and no
-- policy, those are denied. The Apps Script sync uses the secret (service_role)
-- key, which bypasses RLS.

grant insert on public.prebookings to anon;


-- ===========================================================================
-- LostCoz community meet registrations (/meet)
-- ===========================================================================
--
-- Same security model as prebookings: anon may INSERT a row and upload a payment
-- screenshot, and nothing else. One table serves every meet; `event` is the
-- slug from src/data/meet.ts, and the dedup is one registration per number
-- *per event*.

create table if not exists public.meet_registrations (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  event           text        not null check (char_length(event) between 3 and 80),

  name            text        not null check (char_length(name) between 2 and 80),
  -- canonical 10-digit Indian mobile; the app strips +91/spaces before insert
  whatsapp        text        not null check (whatsapp ~ '^[6-9][0-9]{9}$'),
  age_range       text        not null
                              check (age_range in ('under-16','16-18','19-22','23-27','28-30','over-30')),
  organisation    text        not null check (char_length(organisation) between 2 and 120),
  heard_from      text        not null check (char_length(heard_from) between 2 and 200),
  favourite_game  text        not null check (char_length(favourite_game) between 2 and 120),
  party_size      integer     not null check (party_size between 1 and 10),

  -- rupees due = party_size × per-person price at the time of registering
  amount_due      integer     not null check (amount_due >= 0),
  -- object path inside the `meet-payments` bucket; null if they skipped the upload
  screenshot_path text        check (char_length(screenshot_path) <= 200),
  source_ip       text,

  -- set by hand once the payment is matched against the UPI statement
  payment_status  text        not null default 'pending'
                              check (payment_status in ('pending','paid','refunded'))
);

create unique index if not exists meet_registrations_event_whatsapp_key
  on public.meet_registrations (event, whatsapp);

create index if not exists meet_registrations_created_at_idx
  on public.meet_registrations (created_at);

alter table public.meet_registrations enable row level security;

drop policy if exists "meet_registrations: anon can insert" on public.meet_registrations;
create policy "meet_registrations: anon can insert"
  on public.meet_registrations for insert
  to anon
  with check (true);

grant insert on public.meet_registrations to anon;

-- Payment screenshots. Private bucket: anon can upload, never list or download.
-- View them in Dashboard → Storage → meet-payments, or with the secret key.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'meet-payments', 'meet-payments', false, 10485760,
  array['image/jpeg','image/png','image/webp','image/heic','image/heif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "meet-payments: anon can upload" on storage.objects;
create policy "meet-payments: anon can upload"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'meet-payments');


-- ---------------------------------------------------------------------------
-- Optional: push every change to the Google Sheet the moment it happens.
-- Needs the Apps Script web app URL + shared secret from
-- scripts/google-apps-script/README.md. Skip this block if the 5-minute pull
-- trigger is fast enough. Covers both tables, on insert, update and delete, so
-- a payment_status change or a deleted test row reaches the Sheet too.
-- ---------------------------------------------------------------------------
--
-- pg_net is non-relocatable: it always installs into its own `net` schema, so
-- do NOT add `with schema extensions` here.
-- create extension if not exists pg_net;
--
-- create or replace function public.notify_sheet()
-- returns trigger
-- language plpgsql
-- security definer
-- set search_path = public, net
-- as $$
-- begin
--   perform net.http_post(
--     url     := 'https://script.google.com/macros/s/PASTE_DEPLOYMENT_ID/exec?secret=PASTE_SHARED_SECRET',
--     headers := '{"Content-Type": "application/json"}'::jsonb,
--     body    := jsonb_build_object(
--       'type',       tg_op,
--       'table',      tg_table_name,
--       'record',     case when tg_op = 'DELETE' then null else to_jsonb(new) end,
--       'old_record', case when tg_op = 'INSERT' then null else to_jsonb(old) end
--     )
--   );
--   return coalesce(new, old);
-- end;
-- $$;
--
-- -- replaces the older insert-only trigger, if you installed it
-- drop trigger if exists prebookings_to_sheet on public.prebookings;
-- drop function if exists public.notify_sheet_of_prebooking();
--
-- create trigger prebookings_to_sheet
--   after insert or update or delete on public.prebookings
--   for each row execute function public.notify_sheet();
--
-- drop trigger if exists meet_registrations_to_sheet on public.meet_registrations;
-- create trigger meet_registrations_to_sheet
--   after insert or update or delete on public.meet_registrations
--   for each row execute function public.notify_sheet();
