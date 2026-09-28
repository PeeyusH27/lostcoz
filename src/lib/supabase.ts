/**
 * Minimal Supabase PostgREST + Storage client.
 *
 * The site only ever inserts form rows (and uploads a payment screenshot), so the
 * full `@supabase/supabase-js` SDK would be a large dependency for two fetch calls.
 *
 * The key used here is the *publishable* key, which is safe to expose — every
 * table and bucket it can reach is protected by row-level security. See
 * supabase/schema.sql for the policies: `prebookings`, `meet_registrations` and
 * the `meet-payments` bucket are insert-only for anonymous callers, so this
 * client can add a row or a file but can never read one back.
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
  const res = await request(`/rest/v1/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw await toError(res);
}

/**
 * Uploads one file to a Storage bucket at `path`. Anon can write to the bucket
 * but never list or read it (see supabase/schema.sql), so a path is not guessable
 * and is only useful to someone holding the secret key.
 */
export async function uploadObject(bucket: string, path: string, file: Blob): Promise<void> {
  const res = await request(`/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
    body: file,
  });
  if (!res.ok) throw await toError(res);
}

async function request(path: string, init: { method: string; headers: Record<string, string>; body: BodyInit }) {
  if (!url || !key) {
    throw new SupabaseError("Supabase is not configured (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY)", 500);
  }
  return fetch(`${url}${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, ...init.headers },
    cache: "no-store",
  });
}

async function toError(res: Response): Promise<SupabaseError> {
  // PostgREST and Storage errors are JSON ({ code, message, … }), but a gateway
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
  return new SupabaseError(message, res.status, code);
}
