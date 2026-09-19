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


-- ---------------------------------------------------------------------------
-- Optional: push each new row to the Google Sheet the moment it lands.
-- Needs the Apps Script web app URL + shared secret from
-- scripts/google-apps-script/README.md. Skip this block if you would rather let
-- the Apps Script time trigger pull every few minutes.
-- ---------------------------------------------------------------------------
--
-- pg_net is non-relocatable: it always installs into its own `net` schema, so
-- do NOT add `with schema extensions` here.
-- create extension if not exists pg_net;
--
-- create or replace function public.notify_sheet_of_prebooking()
-- returns trigger
-- language plpgsql
-- security definer
-- set search_path = public, net
-- as $$
-- begin
--   perform net.http_post(
--     url     := 'https://script.google.com/macros/s/PASTE_DEPLOYMENT_ID/exec?secret=PASTE_SHARED_SECRET',
--     headers := '{"Content-Type": "application/json"}'::jsonb,
--     body    := to_jsonb(new)
--   );
--   return new;
-- end;
-- $$;
--
-- drop trigger if exists prebookings_to_sheet on public.prebookings;
-- create trigger prebookings_to_sheet
--   after insert on public.prebookings
--   for each row execute function public.notify_sheet_of_prebooking();
