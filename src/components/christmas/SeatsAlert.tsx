import type { Seats } from "@/lib/seats";

/**
 * Alert card pinned above the registration form: live seats left, a fill bar and
 * an urgency line. Falls back to the cap when the live count is unavailable.
 */
export default function SeatsAlert({ seats, total, className = "" }: { seats: Seats | null; total: number; className?: string }) {
  const left = seats?.left ?? total;
  const taken = seats?.taken ?? 0;
  const low = !!seats && left <= Math.ceil(total / 3);
  const message = !seats
    ? "First come, first served. Pay and register to hold your seat."
    : low
      ? "Almost gone. Pay and register now to hold yours."
      : "Seats are filling. Your seat is held once you register.";

  return (
    <div
      role="status" aria-live="polite"
      className={`relative overflow-hidden rounded-2xl border border-[#f6c96b]/50 bg-gradient-to-r from-[#8e1a2f] via-[#b3203a] to-[#d9365a] p-4 text-[#fff6e6] shadow-[0_18px_40px_-16px_rgb(0_0_0/0.85)] sm:p-5 ${className}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[#f6c96b]/25 blur-2xl" />
      <div className="relative flex items-center gap-4">
        <span aria-hidden="true" className="relative grid size-11 shrink-0 place-items-center rounded-full bg-[#fff6e6]/15 ring-1 ring-[#fff6e6]/30">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#f6c96b]/30 [animation-duration:2s]" />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="relative size-5 text-[#ffe7a8]">
            <path d="M12 9v4M12 17h.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-baseline gap-x-2 font-display uppercase leading-none">
            <span className="text-[0.7rem] font-bold tracking-[0.2em] text-[#ffe7a8]">Only</span>
            <span className="text-3xl font-extrabold tracking-tight sm:text-4xl">{left}</span>
            <span className="text-sm font-bold tracking-wide sm:text-base">
              {left === 1 ? "seat" : "seats"} left{seats ? ` of ${total}` : ""}
            </span>
          </p>
          <p className="mt-1.5 text-body-sm text-pretty text-[#fff6e6]/85">{message}</p>
        </div>
      </div>
      {seats && (
        <div aria-hidden="true" className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-[#3d0c16]/50">
          <div className="h-full rounded-full bg-gradient-to-r from-[#f6c96b] to-[#fff6e6]" style={{ width: `${Math.min(100, (taken / total) * 100)}%` }} />
        </div>
      )}
    </div>
  );
}
