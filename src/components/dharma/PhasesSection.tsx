"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP, ScrollTrigger } from "@/lib/gsap";
import { backs, phases } from "@/data/dharma";
import { cn } from "@/lib/cn";

/**
 * Desktop (lg+): sticky Phases card on one side; the six phases scroll past on the
 * other and light up their glyph on the card.
 *
 * Mobile: the same idea, rebuilt as a swipeable deck — the card stays put while the
 * phases move horizontally beneath it, so the glyph lighting up always belongs to the
 * phase you're reading. Scroll-snap drives the state, so it works with a thumb, with
 * the glyph/dot buttons, and with a keyboard.
 */
export default function PhasesSection() {
  const ref = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /* ---- desktop: scroll position of each step drives the active phase ---- */
  useGSAP(() => {
    if (!ref.current) return;
    // the step list only exists at lg+; below that the swipe rail drives `active`
    if (!window.matchMedia("(min-width: 64rem)").matches) return;
    const steps = Array.from(ref.current.querySelectorAll<HTMLElement>("[data-step]"));
    const triggers = steps.map((s, i) => ScrollTrigger.create({
      trigger: s, start: "top 60%", end: "bottom 60%",
      onToggle: (self) => { if (self.isActive) setActive(i); },
    }));
    return () => triggers.forEach((t) => t.kill());
  }, { scope: ref });

  /* ---- mobile: the snapped slide is the active phase ---- */
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / el.clientWidth);
        setActive((cur) => (i !== cur && i >= 0 && i < phases.length ? i : cur));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  /** Jump the mobile rail to a phase (glyph taps, dots, arrows). */
  const goTo = useCallback((i: number) => {
    const el = rail.current;
    setActive(i);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }, []);

  const phase = phases[active];

  return (
    <section
      id="phases" ref={ref}
      /* no overflow-hidden here — it would become the scroll container for the desktop
         sticky card and stop it pinning; the swipe rail clips itself instead */
      className="relative scroll-mt-20 px-gutter py-section"
      style={{ ["--phase" as string]: phase.color }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[background] duration-1000"
        style={{ background: "radial-gradient(60% 50% at 30% 50%, color-mix(in oklab, var(--phase) 18%, transparent), transparent 70%)" }}
      />

      <div className="relative z-[2] mx-auto max-w-content">
        <p className="eyebrow mb-6 text-dharma-gold-400">The six phases</p>
        <h2 className="max-w-[18ch] font-display text-display-xl text-balance">Every round moves in six phases.</h2>
        <p className="mt-6 max-w-prose text-body-xl text-fg-muted">Ability cards are played face-up in the phase printed on them, and resolved in rank order. Skip a phase and that card is gone for the round.</p>

        {/* ================= mobile: pinned card + swipeable phase deck ================= */}
        <div className="mt-12 lg:hidden">
          <div className="glass-panel glass-sheen overflow-hidden rounded-2xl">
            {/* card: the glyph for the active phase lights up. Each glyph is a button. */}
            <div className="relative mx-auto w-[11.5rem] px-4 pt-5 min-[420px]:w-[13rem]">
              <div className="relative card-ratio overflow-hidden rounded-card shadow-card-lift">
                <Image
                  src={backs.phases.src} width={backs.phases.w} height={backs.phases.h}
                  alt="Order of Dharma phases card"
                  sizes="(max-width: 420px) 11.5rem, 13rem"
                  className="size-full object-cover"
                />
                {phases.map((p, i) => (
                  <button
                    key={p.id} type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Phase ${p.num}: ${p.name}`}
                    aria-pressed={i === active}
                    className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full [clip-path:circle(50%)]"
                    style={{ left: `${p.pos.x}%`, top: `${p.pos.y}%` }}
                  >
                    {/* the visible ring matches the glyph art; the button around it is 44px for the thumb */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block size-[1.85rem] rounded-full border-2 transition-all duration-700 ease-out-expo min-[420px]:size-[2.1rem]",
                        i === active ? "scale-100 opacity-100" : "scale-75 opacity-0",
                      )}
                      style={{ borderColor: p.color, boxShadow: `0 0 26px 3px color-mix(in oklab, ${p.color} 55%, transparent)` }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* the six phases, one per swipe */}
            <div
              ref={rail}
              className="mt-6 flex snap-x snap-mandatory overflow-x-auto no-scrollbar"
              tabIndex={0}
              role="group"
              aria-label="Phases — swipe to browse"
            >
              {phases.map((p, i) => (
                <article
                  key={p.id}
                  className="w-full shrink-0 snap-center px-5 pb-6"
                  aria-hidden={i !== active}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-dharma-display text-display-sm leading-none" style={{ color: p.color }}>
                      {String(p.num).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="h-px flex-1" style={{ background: `color-mix(in oklab, ${p.color} 45%, transparent)` }} />
                  </div>
                  <h3 className="mt-3 font-dharma-display text-display-sm">{p.name}</h3>
                  <p className="mt-1 font-body text-body-lg italic text-fg-muted">{p.tagline}</p>
                  {/* fixed min-height keeps the card from jumping between short and long summaries */}
                  <p className="mt-4 min-h-[7.5rem] text-body-lg text-pretty">{p.summary}</p>
                  <p
                    className="mt-2 inline-block rounded-pill border px-3 py-1.5 font-body text-caption uppercase tracking-widest"
                    style={{ borderColor: `color-mix(in oklab, ${p.color} 50%, transparent)`, color: p.color }}
                  >
                    {p.cards}
                  </p>
                </article>
              ))}
            </div>

            {/* progress dots double as controls */}
            <div className="flex items-center justify-center gap-2 border-t border-line px-5 py-4">
              {phases.map((p, i) => (
                <button
                  key={p.id} type="button" onClick={() => goTo(i)}
                  aria-label={`Go to phase ${p.num}: ${p.name}`} aria-pressed={i === active}
                  className="grid h-11 min-w-11 flex-1 place-items-center"
                >
                  <span
                    aria-hidden="true"
                    className="block h-1.5 w-full rounded-pill transition-all duration-500"
                    style={{ background: i === active ? p.color : "var(--color-line-strong)" }}
                  />
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 flex items-center justify-center gap-3 eyebrow text-[0.62rem]">
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
            Swipe or tap a glyph
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
          </p>
        </div>

        {/* ================= desktop: sticky card + scrolling steps ================= */}
        <div className="mt-20 hidden gap-8 lg:grid lg:grid-cols-[minmax(16rem,22rem)_1fr] lg:gap-24">
          {/* sticky card — z-2 because sticky creates its own stacking context */}
          <div className="relative z-[2] mx-auto w-full lg:sticky lg:top-[14vh] lg:self-start">
            <div className="relative card-ratio overflow-hidden rounded-card shadow-card-lift">
              <Image
                src={backs.phases.src} width={backs.phases.w} height={backs.phases.h}
                alt="Order of Dharma phases card" sizes="22rem"
                className="size-full object-cover"
              />
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
              <li key={p.id} data-step className="flex min-h-[70vh] flex-col justify-center border-t border-line py-14 first:border-t-0">
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
