import { CHRISTMAS } from "@/data/christmas";

/**
 * Christmas Chaos details shared by the promo popup (light "paper" tone) and the
 * event page hero (dark tone): a 3-up facts strip and a solo / couple price pair.
 */
type Tone = "light" | "dark";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const tones = {
  light: {
    cell: "border-[#b3203a]/15 bg-white/70 shadow-[0_8px_20px_-14px_rgb(61_12_22/0.45)]",
    icon: "bg-[#b3203a]/10 text-[#b3203a]",
    label: "text-[#b3203a]/80",
    value: "text-[#3d0c16]",
    muted: "text-[#5b2a33]/70",
  },
  dark: {
    cell: "border-[#fff6e6]/15 bg-[#2a0810]/45 backdrop-blur-md shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]",
    icon: "bg-[#f6c96b]/15 text-[#f6c96b]",
    label: "text-[#f6c96b]/85",
    value: "text-[#fff6e6]",
    muted: "text-[#f6e9d4]/65",
  },
} as const;

const icons = {
  date: "M8 2.5v3M16 2.5v3M3.5 9.5h17M5 4.5h14A1.5 1.5 0 0 1 20.5 6v13a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V6A1.5 1.5 0 0 1 5 4.5Z",
  time: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  venue: "M12 21s-7-5.6-7-11.5a7 7 0 0 1 14 0C19 15.4 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
};

export function EventFacts({ tone, className = "" }: { tone: Tone; className?: string }) {
  const t = tones[tone];
  const facts = [
    { k: "date", label: "Date", value: CHRISTMAS.dateLabel ?? "Soon" },
    { k: "time", label: "Time", value: CHRISTMAS.windowLabel.replace(/ onwards$/i, "+") },
    { k: "venue", label: "Venue", value: CHRISTMAS.venue ?? "TBA" },
  ] as const;
  return (
    <dl className={`grid grid-cols-3 gap-2 ${className}`}>
      {facts.map((f) => (
        <div key={f.k} className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center sm:flex-row sm:gap-3 sm:px-3 sm:text-left ${t.cell}`}>
          <span aria-hidden="true" className={`grid size-8 shrink-0 place-items-center rounded-full ${t.icon}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d={icons[f.k]} /></svg>
          </span>
          <div className="min-w-0">
            <dt className={`text-[0.56rem] font-bold uppercase tracking-[0.22em] ${t.label}`}>{f.label}</dt>
            <dd className={`mt-0.5 truncate font-display text-[0.82rem] uppercase leading-tight sm:text-sm ${t.value}`}>{f.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export function PriceOptions({ tone, className = "" }: { tone: Tone; className?: string }) {
  const t = tones[tone];
  const save = (CHRISTMAS.price - CHRISTMAS.couplePrice) * 2;
  return (
    <div className={`grid grid-cols-2 gap-2 pt-1.5 ${className}`}>
      <div className={`flex flex-col justify-between rounded-2xl border p-4 ${t.cell}`}>
        <p className={`text-[0.6rem] font-bold uppercase tracking-[0.22em] ${t.label}`}>Solo</p>
        <div className="mt-3">
          <p className={`font-display text-2xl font-extrabold leading-none tracking-tight sm:text-[1.75rem] ${t.value}`}>{inr(CHRISTMAS.price)}</p>
          <p className={`mt-1.5 text-[0.7rem] font-semibold ${t.muted}`}>per person</p>
        </div>
      </div>
      <div className="relative flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#d9365a] via-[#b3203a] to-[#7d1528] p-4 text-[#fff6e6] shadow-[0_14px_30px_-12px_#b3203a] ring-1 ring-[#f6c96b]/70">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -right-8 -top-8 size-24 rounded-full bg-[#f6c96b]/30 blur-2xl" />
        </div>
        <span className="absolute -top-2.5 right-3 rounded-full bg-[#f6c96b] px-2 py-0.5 text-[0.55rem] font-extrabold uppercase tracking-[0.08em] text-[#5b1220] shadow-[0_4px_10px_-4px_rgb(0_0_0/0.5)]">Save {inr(save)}</span>
        <p className="relative inline-flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[#ffe7a8]">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-3"><path d="M12 20.5s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.6a4.5 4.5 0 0 1 7.5 2.9c0 5.4-7.5 10-7.5 10Z" /></svg>
          Couple
        </p>
        <div className="relative mt-3">
          <p className="font-display text-2xl font-extrabold leading-none tracking-tight sm:text-[1.75rem]">{inr(CHRISTMAS.couplePrice)}</p>
          <p className="mt-1.5 text-[0.7rem] font-semibold text-[#fff6e6]/80">each · {inr(CHRISTMAS.couplePrice * 2)} for 2</p>
        </div>
      </div>
    </div>
  );
}
