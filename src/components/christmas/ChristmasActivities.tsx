"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import { activities } from "@/data/christmas";
import { activityIcons } from "@/components/christmas/ActivityIcons";
import ActivityDeck from "@/components/christmas/ActivityDeck";

const hues = ["#f2427d", "#29a8e0", "#f9a825", "#f2427d", "#8e4fc9", "#29a8e0"];

/**
 * Six flip cards. Front: illustration + title. Back: photo + what happens.
 * Phones: one big card at a time in a swipe row, tap to flip.
 * Desktop: grid; hover (mouse) or focus (keyboard) flips.
 */
export default function ChristmasActivities() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  
  const toggle = (key: string) => {
    // On a mouse device hover already does the flipping; a click must not latch it.
    if (window.matchMedia("(hover: hover)").matches) return;
    setOpen((o) => ({ ...o, [key]: !o[key] }));
  };

  return (
    <div className="mt-8 sm:mt-12">
      {/* phones: stacked swipe deck, no flipping */}
      <ActivityDeck />

      {/* tablet and desktop: flip cards */}
      <Reveal y={48} scale={0.96} className="hidden sm:block">
        <ol className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {activities.map((a, i) => {
            const Icon = activityIcons[a.key];
            const hue = hues[i];
            const title = `${a.name} ${a.accent}`.trim();
            return (
              <li key={a.key}>
                <div
                  role="button" tabIndex={0} aria-pressed={!!open[a.key]} aria-label={`${title}. Flip for details.`}
                  onClick={() => toggle(a.key)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => ({ ...o, [a.key]: !o[a.key] })); } }}
                  className={`flip aspect-[4/4.4] w-full cursor-pointer outline-none lg:aspect-[5/5.4] ${open[a.key] ? "is-flipped" : ""}`}
                >
                  <div className="flip-inner">
                    {/* front */}
                    <div className="flip-face flex flex-col items-center border bg-[#150f1f] px-6 pb-6 pt-8 text-center" style={{ borderColor: `${hue}66` }}>
                      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-3/5 opacity-90" style={{ background: "linear-gradient(180deg, rgb(249 168 37 / 0.3), transparent)", clipPath: "polygon(35% 0, 65% 0, 100% 100%, 0 100%)" }} />
                      <div aria-hidden="true" className="absolute left-1/2 top-0 h-5 w-px bg-[#f6e9d4]/50" />
                      <div aria-hidden="true" className="absolute left-1/2 top-5 h-2 w-10 -translate-x-1/2 rounded-t-full bg-[#f9a825]" />
                      <span className="relative font-mono text-caption tracking-[0.28em] text-[#f9a825]">0{i + 1} / 06</span>
                      <Icon className="relative mt-3 h-32 w-auto lg:h-36" />
                      <h3 className="relative mt-auto font-display text-[1.75rem] font-extrabold uppercase leading-[0.95] tracking-tight text-[#fff6e6]">
                        {a.name}
                        {a.accent && <span className="block" style={{ color: hue }}>{a.accent}</span>}
                      </h3>
                      <p className="relative mt-2 font-[family-name:var(--font-garamond)] text-[1.1rem] italic text-[#f6c96b]">{a.tagline}</p>
                      <span className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-[#f6e9d4]/25 px-3.5 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#f6e9d4]/70">
                        <span aria-hidden="true">↻</span>Hover to flip
                      </span>
                    </div>

                    {/* back */}
                    <div className="flip-face flip-back border bg-[#150f1f]" style={{ borderColor: `${hue}99` }}>
                      <Image src={a.image} alt="" fill sizes="(min-width: 1024px) 26rem, 80vw" className="object-cover" />
                      <div aria-hidden="true" className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgb(13 10 20 / 0.3) 0%, rgb(13 10 20 / 0.82) 45%, rgb(13 10 20 / 0.96) 100%), linear-gradient(135deg, ${hue}33, transparent 60%)` }} />
                      <div className="relative flex h-full flex-col justify-end p-6 text-left">
                        <span className="font-mono text-caption tracking-[0.28em]" style={{ color: hue }}>0{i + 1} / 06</span>
                        <h3 className="mt-1 font-display text-[1.5rem] font-extrabold uppercase leading-none text-[#fff6e6]">{title}</h3>
                        <p className="mt-2 font-[family-name:var(--font-garamond)] text-[1.1rem] italic leading-tight text-[#f6c96b]">{a.tagline}</p>
                        <p className="mt-3 text-body-sm leading-snug text-pretty text-[#f6e9d4]/85">{a.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Reveal>

    </div>
  );
}
