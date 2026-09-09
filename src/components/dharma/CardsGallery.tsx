"use client";
import { useState } from "react";
import { cards, cardGroups, backs, type CardGroup } from "@/data/dharma";
import GameCard from "@/components/ui/GameCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export default function CardsGallery() {
  const [group, setGroup] = useState<CardGroup | "All">("All");
  const visible = group === "All" ? cards : cards.filter((c) => c.group === group);

  return (
    <section id="cards" className="relative scroll-mt-20 px-gutter py-section">
      <div className="relative z-[2] mx-auto max-w-wide">
        <SectionHeading eyebrow="Know your cards · 55 in the box" title="Every card, explained." lead="Click a card to flip it. Ranks decide the order abilities resolve in — 1 always goes first." />

        <Reveal stagger={0.04} y={12} className="mt-12 flex flex-wrap gap-2" as="div">
          {cardGroups.map((g) => (
            <button
              key={g.id} type="button" onClick={() => setGroup(g.id)} aria-pressed={group === g.id}
              className={cn(
                "rounded-pill border px-4 py-2 font-body text-caption uppercase tracking-widest transition-all duration-300 ease-out-expo",
                group === g.id ? "border-accent bg-accent text-fg-on-accent" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
              )}
            >
              {g.label} <span className="opacity-60">{g.count}</span>
            </button>
          ))}
        </Reveal>

        <ul key={group} className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((c, i) => (
            <li key={c.slug} className="opacity-0" style={{ animation: `fade-up 0.8s var(--ease-out-expo) ${i * 60}ms forwards` }}>
              <div className="[perspective:1200px]">
                <GameCard face={c.image} back={backs[c.back]} alt={`${c.name} card`} sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 240px" />
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
