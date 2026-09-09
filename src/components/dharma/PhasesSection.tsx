"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP, ScrollTrigger } from "@/lib/gsap";
import { backs, phases } from "@/data/dharma";
import { cn } from "@/lib/cn";

/** Sticky Phases card on one side; the six phases scroll past on the other and light up their glyph on the card. */
export default function PhasesSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    if (!ref.current) return;
    const steps = Array.from(ref.current.querySelectorAll<HTMLElement>("[data-step]"));
    const triggers = steps.map((s, i) => ScrollTrigger.create({
      trigger: s, start: "top 60%", end: "bottom 60%",
      onToggle: (self) => { if (self.isActive) setActive(i); },
    }));
    return () => triggers.forEach((t) => t.kill());
  }, { scope: ref });

  const phase = phases[active];

  return (
    <section
      id="phases" ref={ref}
      className="relative scroll-mt-20 px-gutter py-section"
      style={{ ["--phase" as string]: phase.color }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-[background] duration-1000" style={{ background: "radial-gradient(60% 50% at 30% 50%, color-mix(in oklab, var(--phase) 18%, transparent), transparent 70%)" }} />

      <div className="relative z-[2] mx-auto max-w-content">
        <p className="eyebrow mb-6 text-dharma-gold-400">The six phases</p>
        <h2 className="max-w-[18ch] font-display text-display-xl text-balance">Every round moves in six phases.</h2>
        <p className="mt-6 max-w-prose text-body-xl text-fg-muted">Ability cards are played face-up in the phase printed on them, and resolved in rank order. Skip a phase and that card is gone for the round.</p>

        <div className="mt-20 grid gap-16 lg:grid-cols-[minmax(16rem,22rem)_1fr] lg:gap-24">
          {/* sticky card — z-2 because sticky creates its own stacking context */}
          <div className="relative z-[2] mx-auto w-[15rem] sm:w-[18rem] lg:sticky lg:top-[14vh] lg:w-full lg:self-start">
            <div className="relative card-ratio overflow-hidden rounded-card shadow-card-lift">
              <Image src={backs.phases.src} width={backs.phases.w} height={backs.phases.h} alt="Order of Dharma phases card" sizes="(max-width: 1024px) 18rem, 22rem" className="size-full object-cover" />
              {phases.map((p, i) => (
                <span
                  key={p.id} aria-hidden="true"
                  className={cn("absolute size-[19%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-700 ease-out-expo", i === active ? "scale-110 opacity-100" : "scale-75 opacity-0")}
                  style={{ left: `${p.pos.x}%`, top: `${p.pos.y}%`, borderColor: p.color, boxShadow: `0 0 34px 4px color-mix(in oklab, ${p.color} 55%, transparent)` }}
                />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-center gap-2" aria-hidden="true">
              {phases.map((p, i) => <span key={p.id} className="h-1.5 rounded-pill transition-all duration-500" style={{ width: i === active ? 28 : 8, background: i === active ? p.color : "var(--color-line-strong)" }} />)}
            </div>
          </div>

          <ol className="relative">
            {phases.map((p, i) => (
              <li key={p.id} data-step className="flex min-h-[60vh] flex-col justify-center border-t border-line py-14 first:border-t-0 lg:min-h-[70vh]">
                <div className={cn("transition-opacity duration-500", i === active ? "opacity-100" : "opacity-40")}>
                  <p className="font-dharma-display text-display-lg leading-none" style={{ color: p.color }}>{String(p.num).padStart(2, "0")}</p>
                  <h3 className="mt-4 font-dharma-display text-display-md">{p.name}</h3>
                  <p className="mt-1 font-body text-body-lg italic text-fg-muted">{p.tagline}</p>
                  <p className="mt-6 max-w-[48ch] text-body-xl text-pretty">{p.summary}</p>
                  <p className="mt-6 inline-block rounded-pill border px-4 py-2 font-body text-caption uppercase tracking-widest" style={{ borderColor: `color-mix(in oklab, ${p.color} 50%, transparent)`, color: p.color }}>{p.cards}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
