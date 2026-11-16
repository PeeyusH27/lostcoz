"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHRISTMAS, activities } from "@/data/christmas";
import { Confetti, SantaHat } from "./ChristmasArt";

/** Lives for one page load: a reload shows the popup again, in-app navigation does not. */
let shownThisLoad = false;
const DELAY_MS = 2000;

/** Pre-computed so the snow is identical on server and client (no hydration drift). */
const flakes = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 4 + ((i * 5) % 7),
  dur: 9 + ((i * 3) % 9),
  delay: -((i * 7) % 14),
  drift: ((i % 2 ? 1 : -1) * (12 + ((i * 11) % 28))),
}));

/** Full-screen Christmas Chaos promo. Opens 2s after first load, once per browser session. */
export default function ChristmasPromo() {
  const pathname = usePathname();
  const onEventPage = pathname.startsWith(CHRISTMAS.href);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [left, setLeft] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (shownThisLoad || onEventPage) return;
    const t = window.setTimeout(() => {
      lastFocus.current = document.activeElement as HTMLElement | null;
      shownThisLoad = true;
      setOpen(true);
    }, DELAY_MS);
    return () => window.clearTimeout(t);
  }, [onEventPage]);

  const visible = open && !onEventPage;
  useEffect(() => {
    if (!visible) return;
    let alive = true;
    fetch("/api/seats").then((r) => r.json()).then((d) => { if (alive && typeof d.left === "number") setLeft(d.left); }).catch(() => {});
    return () => { alive = false; };
  }, [visible]);
  useEffect(() => {
    if (!visible) return;
    window.__lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.__lenis?.start();
      lastFocus.current?.focus?.();
    };
  }, [visible]);

  if (onEventPage) return null;
  const close = () => { setOpen(false); setDismissed(true); };

  // Entry point once the popup has been closed: a floating pill that reopens it.
  if (!open) {
    if (!dismissed) return null;
    return (
      <button
        type="button" data-cursor="link"
        onClick={() => { lastFocus.current = document.activeElement as HTMLElement | null; setOpen(true); }}
        className="xmas-pill fixed bottom-5 left-5 z-[80] inline-flex h-12 items-center gap-2 rounded-full bg-[#8e2536] px-5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#fff6e6] shadow-[0_10px_30px_-8px_rgb(0_0_0/0.7)] ring-1 ring-[#f6c96b]/60 transition-colors hover:bg-[#f6c96b] hover:text-[#5b1220]"
      >
        <span aria-hidden="true">🎄</span> Christmas Chaos
      </button>
    );
  }

  return (
    <div
      role="dialog" aria-modal="true" aria-labelledby="xmas-title"
      className="xmas-backdrop fixed inset-0 z-[200] overflow-y-auto overflow-x-hidden"
      onClick={(e) => { if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.dismiss) close(); }}
    >
      <Confetti />
      <div data-dismiss="1" className="flex min-h-full items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="xmas-card-in relative w-full max-w-[64rem]">
          <button
            ref={closeRef} type="button" onClick={close} aria-label="Close Christmas Chaos promo" data-cursor="link"
            className="absolute right-3 top-6 z-[5] flex size-10 items-center justify-center rounded-full bg-[#3d0c16] text-xl leading-none text-[#fff6e6] shadow-lg ring-2 ring-[#f6c96b] transition-transform hover:scale-110 sm:right-5 sm:top-8"
          >
            <span aria-hidden="true">×</span>
          </button>

          <div className="xmas-ticket">
            <div className="xmas-zig">
              <div className="xmas-punch grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
                {/* art stub */}
                <div className="xmas-stub relative min-h-72 overflow-hidden lg:min-h-[34rem]">
                  <Image src="/photos/christmas-santa.jpg" alt="Santa in a mask holding a staff, lit by red fairy lights" fill priority sizes="(min-width: 1024px) 28rem, 100vw" className="object-cover object-[50%_6%] origin-[25%_30%] lg:scale-[1.18] lg:object-[50%_28%]" />
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(61_12_22/0.35)_0%,transparent_30%,transparent_65%,rgb(61_12_22/0.6)_100%)]" />
                  <div aria-hidden="true" className="xmas-snow pointer-events-none absolute inset-0">
                    {flakes.slice(0, 18).map((f, i) => (
                      <span key={i} style={{ left: `${f.left}%`, width: f.size, height: f.size, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s`, ["--drift" as string]: `${f.drift}px` }} />
                    ))}
                  </div>
                  <p className="absolute left-5 top-9 inline-flex items-center gap-2 rounded-full border border-[#f6c96b]/50 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#ffe7a8] sm:left-7 sm:top-11">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-[#f6c96b]" /> Admit one
                  </p>
                </div>

                {/* content */}
                <div className="xmas-paper relative flex flex-col justify-center px-6 pb-12 pt-10 text-[#3d0c16] sm:px-10 sm:pb-14 sm:pt-14 lg:px-12">
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.26em] text-[#b3203a]">Lostcoz presents · hosted house party</p>
                  <h2 id="xmas-title" className="mt-8 font-display text-[clamp(2.3rem,1rem+5vw,3.75rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em]">
                    <span className="relative inline-block">
                      <SantaHat className="absolute -left-[0.14em] -top-[0.4em] w-[0.58em] -rotate-[16deg] drop-shadow-[0_3px_5px_rgb(0_0_0/0.25)]" />
                      Christmas
                    </span>
                    <span className="xmas-red-text block pb-[0.06em]">Chaos</span>
                  </h2>
                  <p className="mt-5 hidden max-w-md text-body-lg text-pretty text-[#5b2a33] sm:block">
                    Games, music, food and friendly competition, plus secret missions, Christmas Mafia and karaoke till late.
                  </p>

                  <dl className="mt-7 grid grid-cols-2 rounded-2xl border border-dashed border-[#b3203a]/35 bg-[#b3203a]/[0.05] sm:grid-cols-3">
                    {[
                      { t: "Time", v: CHRISTMAS.windowLabel, mobile: true },
                      { t: "Entry", v: `₹${CHRISTMAS.price.toLocaleString("en-IN")} / person`, mobile: true },
                      { t: "When & where", v: [CHRISTMAS.dateLabel, CHRISTMAS.venue].filter(Boolean).join(" · "), mobile: false },
                    ].map((c) => (
                      <div key={c.t} className={`px-3 py-3 sm:px-4 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-dashed [&:not(:first-child)]:border-[#b3203a]/35 ${c.mobile ? "" : "hidden sm:block"}`}>
                        <dt className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-[#b3203a]">{c.t}</dt>
                        <dd className="mt-1 font-display text-[0.78rem] uppercase leading-tight sm:text-sm">{c.v}</dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="mt-6 hidden flex-wrap gap-2 sm:flex">
                    {activities.map((a) => (
                      <li key={a.key} className="rounded-full border border-[#b3203a]/35 bg-[#b3203a]/[0.05] px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#5b2a33]">
                        {a.name} {a.accent}
                      </li>
                    ))}
                  </ul>

                  {left !== null && (
                    <p className="mt-4 hidden items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#b3203a] sm:flex">
                      <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-[#b3203a]" />
                      {left === 0 ? "Sold out" : `${left} ${left === 1 ? "seat" : "seats"} left`}
                    </p>
                  )}

                  <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    <Link
                      href={CHRISTMAS.href} onClick={close} data-cursor="link"
                      className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#b3203a] px-8 text-sm font-bold uppercase tracking-[0.14em] text-[#fff6e6] shadow-[0_12px_28px_-10px_#b3203a] transition-[transform,background-color] duration-300 hover:bg-[#8e1a2f] active:scale-[0.97]"
                    >
                      See the full plan <span aria-hidden="true">→</span>
                    </Link>
                    <button type="button" onClick={close} className="h-12 px-5 text-xs font-bold uppercase tracking-[0.14em] text-[#5b2a33]/75 underline-offset-4 transition-colors hover:text-[#3d0c16] hover:underline">
                      Maybe later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
