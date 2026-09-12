"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { backs, cards } from "@/data/dharma";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Tilt from "@/components/motion/Tilt";

const clanCopy: Record<string, string> = {
  surya: "Five cards, ranks 1 to 5. Sun-born. Rank 1 is the highest.",
  chandra: "Five cards, ranks 1 to 5. Moon-born. Rank 1 is the highest.",
  maayavi: "One card, dealt only with an odd number of players. Belongs to no one — until Nirnay.",
};

/** Three clan cards flip from their shared back to their faces as they scroll into view. */
export default function ClansSection() {
  const ref = useRef<HTMLElement>(null);
  const clans = cards.filter((c) => c.group === "Clan");

  useGSAP(() => {
    if (reducedMotion() || !ref.current) return;
    gsap.utils.toArray<HTMLElement>("[data-flip]", ref.current).forEach((el, i) => {
      gsap.fromTo(el, { rotationY: 180 }, {
        rotationY: 0, ease: "none",
        scrollTrigger: { trigger: el, start: `top ${88 - i * 4}%`, end: `top ${38 - i * 4}%`, scrub: 0.4 },
      });
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative px-gutter py-section">
      <div className="relative z-[2] mx-auto max-w-content">
        <SectionHeading eyebrow="The Clans" title="Two Clans. One Dharma." lead="Every round you're dealt a Clan in secret. Your allies are at the table — you just don't know which chairs they're in." />
        <div className="mt-12 grid grid-cols-2 gap-6 sm:mt-20 sm:grid-cols-3 sm:gap-6">
          {clans.map((c, i) => (
            <Reveal key={c.slug} y={40} delay={i * 0.1} className={i === 2 ? "col-span-2 mx-auto w-1/2 sm:col-span-1 sm:w-full" : undefined}>
              <div className="mx-auto w-full max-w-[12rem] sm:max-w-[16rem] [perspective:1200px]">
                <Tilt max={10} className="card-ratio rounded-card">
                  <div data-flip className="card3d relative size-full rounded-card shadow-card-lift" data-cursor="text" data-cursor-text={c.name}>
                    <div className="face front"><Image src={c.image.src} width={c.image.w} height={c.image.h} alt={c.name} sizes="(max-width: 640px) 45vw, 16rem" className="size-full object-cover" draggable={false} /></div>
                    <div className="face back"><Image src={backs.clan.small} width={540} height={840} alt="" sizes="(max-width: 640px) 45vw, 16rem" className="size-full object-cover" draggable={false} /></div>
                  </div>
                </Tilt>
              </div>
              <div className="mt-6 text-center sm:text-left">
                <h3 className="font-dharma-display text-display-sm" style={{ color: c.color }}>{c.name}</h3>
                <p className="mt-2 text-fg-muted text-pretty">{clanCopy[c.slug]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
