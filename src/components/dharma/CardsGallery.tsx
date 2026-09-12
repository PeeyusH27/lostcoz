"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { cards, cardGroups, backs, type CardGroup } from "@/data/dharma";
import GameCard from "@/components/ui/GameCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export default function CardsGallery() {
  const [group, setGroup] = useState<CardGroup | "All">("All");
  const visible = group === "All" ? cards : cards.filter((c) => c.group === group);

  /* ---- mobile: one card per swipe; the snapped slide is the active card ---- */
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / el.clientWidth);
        setActive((cur) => (i !== cur && i >= 0 && i < visible.length ? i : cur));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [visible.length]);

  /** Changing filter resets the deck to the first card. */
  const pickGroup = useCallback((id: CardGroup | "All") => {
    setGroup(id);
    setActive(0);
    rail.current?.scrollTo({ left: 0, behavior: "auto" });
  }, []);

  /* The rail is a flex row, so without this it would always be as tall as the longest
     card's text, leaving ~170px of dead space under most cards. Track the active
     slide's height instead and animate between them. */
  const [railH, setRailH] = useState<number>();
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const measure = () => {
      const slide = el.children[Math.min(active, el.children.length - 1)] as HTMLElement | undefined;
      if (slide) setRailH(slide.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    Array.from(el.children).forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [active, visible.length]);

  const goTo = useCallback((i: number) => {
    const el = rail.current;
    setActive(i);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }, []);

  const card = visible[Math.min(active, visible.length - 1)] ?? visible[0];

  return (
    <section id="cards" className="relative scroll-mt-20 px-gutter py-section">
      <div className="relative z-[2] mx-auto max-w-wide">
        <SectionHeading
          eyebrow="Know your cards · 55 in the box"
          title="Every card, explained."
          lead="Tap a card to flip it. Ranks decide the order abilities resolve in — 1 always goes first."
        />

        <Reveal stagger={0.04} y={12} className="-mx-gutter mt-10 flex snap-x gap-2 overflow-x-auto px-gutter pb-1 scroll-px-gutter no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 md:mt-12" as="div">
          {cardGroups.map((g) => (
            <button
              key={g.id} type="button" onClick={() => pickGroup(g.id)} aria-pressed={group === g.id}
              className={cn(
                "inline-flex min-h-11 shrink-0 snap-start items-center whitespace-nowrap rounded-pill border px-4 font-body text-caption uppercase tracking-widest transition-all duration-300 ease-out-expo",
                group === g.id ? "border-accent bg-accent text-fg-on-accent" : "glass-soft border-line text-fg-muted hover:border-line-strong hover:text-fg",
              )}
            >
              {g.label} <span className="opacity-60">{g.count}</span>
            </button>
          ))}
        </Reveal>

        {/* ================= mobile: swipeable card deck ================= */}
        <div className="mt-8 lg:hidden">
          <div className="glass-panel glass-sheen overflow-hidden rounded-2xl">
            <div
              ref={rail}
              key={group}
              className="flex snap-x snap-mandatory items-start overflow-x-auto no-scrollbar transition-[height] duration-500 ease-out-expo"
              style={{ height: railH }}
              tabIndex={0}
              role="group"
              aria-label="Cards — swipe to browse"
            >
              {visible.map((c, i) => (
                <article
                  key={c.slug}
                  className="w-full shrink-0 snap-center px-5 pb-6 pt-6 sm:flex sm:items-start sm:gap-8 sm:px-8"
                  aria-hidden={i !== active}
                >
                  {/* the art gets the room it needs to actually be readable */}
                  <div className="mx-auto w-[11rem] [perspective:1200px] min-[420px]:w-[12.5rem] sm:mx-0 sm:w-[14rem] sm:shrink-0">
                    <GameCard
                      face={c.image} back={backs[c.back]} alt={`${c.name} card`}
                      sizes="(max-width: 420px) 11rem, (max-width: 640px) 12.5rem, 14rem"
                    />
                  </div>

                  <div className="mt-6 sm:mt-0 sm:min-w-0 sm:flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-dharma-display text-display-sm leading-none" style={{ color: c.color }}>{c.name}</h3>
                      <span className="shrink-0 font-mono text-caption text-fg-subtle">×{c.count}</span>
                    </div>
                    <p className="mt-2 eyebrow text-[0.62rem]">{c.group}{c.ranks ? ` · ${c.ranks}` : ""}</p>
                    {c.epithet && <p className="mt-3 font-dharma-body text-body-lg italic text-fg-muted">{c.epithet}</p>}
                    <p className="mt-3 text-body-sm text-fg-muted text-pretty">{c.effect}</p>
                    {c.notes?.map((n) => <p key={n} className="mt-2 text-caption text-fg-subtle">✦ {n}</p>)}
                  </div>
                </article>
              ))}
            </div>

            {/* prev / next + progress — scales to any group size (1 to 18 cards) */}
            <div className="flex items-center gap-3 border-t border-line px-3 py-2">
              <button
                type="button" onClick={() => goTo(Math.max(0, active - 1))}
                disabled={active === 0} aria-label="Previous card"
                className="grid size-11 shrink-0 place-items-center rounded-pill text-fg transition-opacity disabled:opacity-30"
              >
                <span aria-hidden="true" className="text-lg leading-none">←</span>
              </button>

              <div className="flex flex-1 items-center gap-3">
                <span className="shrink-0 font-mono text-caption text-fg-subtle tabular-nums">
                  {active + 1}/{visible.length}
                </span>
                <span aria-hidden="true" className="h-1 flex-1 overflow-hidden rounded-pill bg-line">
                  <span
                    className="block h-full rounded-pill transition-all duration-500 ease-out-expo"
                    style={{ width: `${((active + 1) / visible.length) * 100}%`, background: card.color }}
                  />
                </span>
              </div>

              <button
                type="button" onClick={() => goTo(Math.min(visible.length - 1, active + 1))}
                disabled={active === visible.length - 1} aria-label="Next card"
                className="grid size-11 shrink-0 place-items-center rounded-pill text-fg transition-opacity disabled:opacity-30"
              >
                <span aria-hidden="true" className="text-lg leading-none">→</span>
              </button>
            </div>
          </div>

          <p className="mt-4 flex items-center justify-center gap-3 eyebrow text-[0.62rem]">
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
            Swipe for the next card
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
          </p>
        </div>

        {/* ================= desktop: the full grid ================= */}
        <ul key={group} className="mt-10 hidden grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-12 lg:grid lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((c, i) => (
            <li key={c.slug} className="opacity-0" style={{ animation: `fade-up 0.8s var(--ease-out-expo) ${i * 60}ms forwards` }}>
              <div className="[perspective:1200px]">
                <GameCard face={c.image} back={backs[c.back]} alt={`${c.name} card`} sizes="(max-width: 1024px) 30vw, 240px" />
              </div>
              <div className="mt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-dharma-display text-title" style={{ color: c.color }}>{c.name}</h3>
                  <span className="font-mono text-caption text-fg-subtle">×{c.count}</span>
                </div>
                <p className="mt-1 eyebrow text-[0.62rem]">{c.group}{c.ranks ? ` · ${c.ranks}` : ""}</p>
                {c.epithet && <p className="mt-2 font-dharma-body italic text-fg-muted">{c.epithet}</p>}
                <p className="mt-2 text-body-sm text-fg-muted text-pretty">{c.effect}</p>
                {c.notes?.map((n) => <p key={n} className="mt-2 text-caption text-fg-subtle">✦ {n}</p>)}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <style>{`@keyframes fade-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }`}</style>
    </section>
  );
}
