import { getSeats } from "@/lib/seats";
import { CHRISTMAS } from "@/data/christmas";

/** Public seat counter for the promo popup. Returns numbers only. */
export async function GET() {
  const seats = await getSeats(CHRISTMAS.slug, 30);
  return Response.json(seats ?? { total: CHRISTMAS.seats, taken: null, left: null }, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });
}
