import { callRpc } from "@/lib/supabase";
import { REGISTRATION_EVENTS } from "@/data/events";

export type Seats = { total: number; taken: number; left: number };

/**
 * Seats for a capped event, from the `event_seats_taken` database function.
 * Returns null when the event has no cap or the count can't be read (function
 * not created yet, Supabase down), so callers can fall back instead of failing.
 * `revalidate` seconds of caching for pages; pass 0 for a fresh read at submit time.
 */
export async function getSeats(slug: string, revalidate = 30): Promise<Seats | null> {
  const total = REGISTRATION_EVENTS[slug]?.seats;
  if (!total) return null;
  try {
    const taken = Number(await callRpc<number>("event_seats_taken", { event_slug: slug }, revalidate || undefined));
    if (!Number.isFinite(taken)) return null;
    return { total, taken, left: Math.max(0, total - taken) };
  } catch (err) {
    console.error("seat count unavailable", err);
    return null;
  }
}
