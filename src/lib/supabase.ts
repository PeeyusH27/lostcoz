/**
 * Minimal Supabase PostgREST client.
 *
 * The project only ever inserts a single row from a single form, so the full
 * `@supabase/supabase-js` SDK would be a large dependency for one fetch call.
 *
 * The key used here is the *publishable* key, which is safe to expose — every
 * table it can reach is protected by row-level security. See supabase/schema.sql
 * for the policies: `prebookings` is insert-only for anonymous callers, so this
 * client can add a row but can never read one back.
 */

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;

/** Thrown for anything PostgREST rejects; `code` is the Postgres SQLSTATE when there is one. */
export class SupabaseError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) {
    super(message);
    this.name = "SupabaseError";
  }
}

/** Postgres SQLSTATE for a unique-constraint violation — our "already in the list" signal. */
export const UNIQUE_VIOLATION = "23505";

/**
 * Inserts one row into `table`. Resolves on success, throws a SupabaseError otherwise.
 * Nothing is selected back: the anon role has no read access by design.
 */
export async function insertRow(table: string, row: Record<string, unknown>): Promise<void> {
  if (!url || !key) {
    throw new SupabaseError("Supabase is not configured (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY)", 500);
  }

  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });

  if (res.ok) return;

  // PostgREST errors are JSON ({ code, message, details, hint }), but a gateway
  // failure can return HTML — fall back to the status line in that case.
  let code: string | undefined;
  let message = `Supabase responded ${res.status}`;
  try {
    const body = (await res.json()) as { code?: string; message?: string };
    code = body.code;
    if (body.message) message = body.message;
  } catch {
    /* non-JSON error body */
  }
  throw new SupabaseError(message, res.status, code);
}
