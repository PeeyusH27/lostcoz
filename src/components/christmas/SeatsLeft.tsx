import type { Seats } from "@/lib/seats";

/** "{n} seats left" with a fill bar. Falls back to the cap when the live count is unavailable. */
export default function SeatsLeft({ seats, total, className = "" }: { seats: Seats | null; total: number; className?: string }) {
  if (!seats) {
    return (
      <p className={`inline-flex items-center gap-2 rounded-full bg-[#f2427d] px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white ${className}`}>
        Only {total} seats
      </p>
    );
  }
  const soldOut = seats.left === 0;
  const low = seats.left <= Math.ceil(seats.total / 3);
  const label = soldOut ? "Sold out" : seats.left === 1 ? "1 seat left" : `${seats.left} seats left`;
  return (
    <div className={`inline-flex flex-col gap-2 ${className}`} role="status" aria-live="polite">
      <p className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white ${soldOut ? "bg-[#5b5260]" : "bg-[#f2427d]"}`}>
        {!soldOut && <span aria-hidden="true" className={`size-1.5 rounded-full bg-white ${low ? "animate-pulse" : ""}`} />}
        {label}
      </p>
      <div aria-hidden="true" className="h-1.5 w-full min-w-40 overflow-hidden rounded-full bg-[#f6e9d4]/15">
        <div className="h-full rounded-full bg-gradient-to-r from-[#f6c96b] to-[#f2427d]" style={{ width: `${Math.min(100, (seats.taken / seats.total) * 100)}%` }} />
      </div>
    </div>
  );
}
