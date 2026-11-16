"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { activities } from "@/data/christmas";
import { activityIcons } from "@/components/christmas/ActivityIcons";

const hues = ["#f2427d", "#29a8e0", "#f9a825", "#f2427d", "#8e4fc9", "#29a8e0"];
const SWIPE_AT = 70; // px of drag that counts as a swipe

/**
 * Phone version of the activity cards: a stacked deck. Swipe the top card
 * either way and it slides off to the back, revealing the next. Everything is
 * written on the card, no flipping. Buttons do the same for non-touch use.
 */
export default function ActivityDeck() {
  const [order, setOrder] = useState(() => activities.map((_, i) => i)); // order[0] = top card
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState<0 | 1 | -1>(0);
  const startX = useRef(0);
  const busy = useRef(false);

  const next = (dir: 1 | -1) => {
    if (busy.current) return;
    busy.current = true;
    setLeaving(dir);
    window.setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setLeaving(0);
      setDx(0);
      busy.current = false;
    }, 280);
  };
  const prev = () => {
    if (busy.current) return;
    setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  };

  const onDown = (e: React.PointerEvent) => {
    if (busy.current) return;
    startX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => { if (dragging) setDx(e.clientX - startX.current); };
  const onUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(dx) > SWIPE_AT) next(dx > 0 ? 1 : -1);
    else setDx(0);
  };

  const top = order[0];

  return (
    <div className="sm:hidden">
      <div className="relative mx-auto mb-6 aspect-[4/5.1] w-[min(86vw,21.5rem)]">
        {order.map((idx, depth) => {
          const a = activities[idx];
          const Icon = activityIcons[a.key];
          const hue = hues[idx];
          const isTop = depth === 0;
          // cards behind step forward as the top one leaves
          const d = leaving && !isTop ? depth - 1 : depth;
          const style: React.CSSProperties = isTop
            ? {
                transform: leaving
                  ? `translateX(${leaving * 130}%) rotate(${leaving * 16}deg)`
                  : `translateX(${dx}px) rotate(${dx / 18}deg)`,
                opacity: leaving ? 0 : 1,
                transition: dragging ? "none" : "transform 0.28s cubic-bezier(0.22,1,0.36,1), opacity 0.28s",
                touchAction: "pan-y",
                zIndex: 20,
              }
            : {
                transform: `translateY(${d * 16}px) scale(${1 - d * 0.05}) rotate(${d === 0 ? 0 : d % 2 ? 3.5 : -3.5}deg)`,
                opacity: d < 3 ? 1 - d * 0.18 : 0,
                transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s",
                zIndex: 20 - d,
                pointerEvents: "none",
              };
          const title = `${a.name} ${a.accent}`.trim();
          return (
            <article
              key={a.key} aria-hidden={!isTop} style={{ ...style, borderColor: `${hue}88` }}
              onPointerDown={isTop ? onDown : undefined} onPointerMove={isTop ? onMove : undefined}
              onPointerUp={isTop ? onUp : undefined} onPointerCancel={isTop ? onUp : undefined}
              className="absolute inset-0 select-none overflow-hidden rounded-3xl border bg-[#150f1f] shadow-[0_24px_50px_-20px_rgb(0_0_0/0.8)]"
            >
              <Image src={a.image} alt="" fill sizes="86vw" className="pointer-events-none object-cover opacity-45" draggable={false} />
              <div aria-hidden="true" className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgb(21 15 31 / 0.45) 0%, rgb(21 15 31 / 0.88) 52%, #150f1f 100%), linear-gradient(135deg, ${hue}26, transparent 55%)` }} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-2/5" style={{ background: "linear-gradient(180deg, rgb(249 168 37 / 0.3), transparent)", clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)" }} />
              <div aria-hidden="true" className="absolute left-1/2 top-0 h-4 w-px bg-[#f6e9d4]/50" />
              <div aria-hidden="true" className="absolute left-1/2 top-4 h-2 w-9 -translate-x-1/2 rounded-t-full bg-[#f9a825]" />

              <div className="relative flex h-full flex-col items-center px-5 pb-6 pt-8 text-center">
                <span className="font-mono text-[0.65rem] tracking-[0.28em] text-[#f9a825]">0{idx + 1} / 06</span>
                <Icon className="mt-2 h-32 w-auto" />
                <h3 className="mt-3 font-display text-[1.55rem] font-extrabold uppercase leading-[0.95] tracking-tight text-[#fff6e6]">
                  {a.name}
                  {a.accent && <span className="block" style={{ color: hue }}>{a.accent}</span>}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-garamond)] text-[1.1rem] italic text-[#f6c96b]">{a.tagline}</p>
                <p className="mt-3 text-[0.9rem] leading-snug text-pretty text-[#f6e9d4]/85">{a.text}</p>
                {isTop && (
                  <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#f6e9d4]/55">
                    <span aria-hidden="true">←</span> Swipe <span aria-hidden="true">→</span>
                  </span>
                )}
              </div>
              <span className="sr-only">{title}</span>
            </article>
          );
        })}
      </div>

      <div className="mx-auto mt-12 flex w-[min(86vw,21.5rem)] items-center justify-between">
        <button type="button" onClick={prev} aria-label="Previous activity" className="grid size-11 place-items-center rounded-full border border-[#f6e9d4]/30 text-lg text-[#f6e9d4] active:scale-95">←</button>
        <p className="font-mono text-caption tracking-[0.2em] text-[#f6e9d4]/70" aria-live="polite">
          <span className="text-[#f6c96b]">0{top + 1}</span> / 06
        </p>
        <button type="button" onClick={() => next(-1)} aria-label="Next activity" className="grid size-11 place-items-center rounded-full border border-[#f6e9d4]/30 text-lg text-[#f6e9d4] active:scale-95">→</button>
      </div>
    </div>
  );
}
