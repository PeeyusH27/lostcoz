import { MEET_EVENT, MEET_PRICE } from "@/data/meet";
import { CHRISTMAS } from "@/data/christmas";

/**
 * Events that can take registrations through the shared form + Supabase table.
 * The server action trusts only this list for the per-person price, so a
 * tampered form can't change what a registration is worth.
 * Each slug becomes its own tab in the Sheet (see lostcoz-sync.gs).
 */
export const REGISTRATION_EVENTS: Record<string, { slug: string; price: number; couplePrice?: number; seats?: number }> = {
  [MEET_EVENT.slug]: { slug: MEET_EVENT.slug, price: MEET_PRICE },
  [CHRISTMAS.slug]: { slug: CHRISTMAS.slug, price: CHRISTMAS.price, couplePrice: CHRISTMAS.couplePrice, seats: CHRISTMAS.seats },
};

/** Per-person price for a party: the couple rate applies when exactly two register together. */
export function pricePerPerson(price: number, couplePrice: number | undefined, partySize: number): number {
  return partySize === 2 && couplePrice ? couplePrice : price;
}
