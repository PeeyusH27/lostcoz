"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { site } from "@/data/site";
import { cards } from "@/data/dharma";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import Tilt from "@/components/motion/Tilt";

const fanSlugs = ["surya", "bhasm", "dyut", "yudh", "chandra"];

export default function FeaturedGame() {
  const ref = useRef<HTMLElement>(null);
  const fan = cards.filter((c) => fanSlugs.includes(c.slug)).sort((a, b) => fanSlugs.indexOf(a.slug) - fanSlugs.indexOf(b.slug));

  useGSAP(() => {
    if (reducedMotion() || !ref.current) return;
    const items = gsap.utils.toArray<HTMLElement>("[data-fan]", ref.current);
    gsap.fromTo(items, { rotation: 0, xPercent: 0, y: 60 }, {
      rotation: (i) => (i - 2) * 11, xPercent: (i) => (i - 2) * 48, y: (i) => Math.abs(i - 2) * 16,
      ease: "power2.out",
      scrollTrigger: { trigger: "[data-fan-wrap]", start: "top 80%", end: "center 45%", scrub: 0.5 },
    });
    gsap.to("[data-fan-glow]", { rotation: 360, duration: 40, repeat: -1, ease: "none" });
  }, { scope: ref });

  return (
    <section ref={ref} className="theme-dharma relative overflow-hidden px-gutter py-section">
      <div aria-hidden="true" className="absolute inset-0">
        <Image src="/textures/velvet-emerald.jpg" alt="" fill sizes="100vw" className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_50%,rgb(201_162_78/0.16),transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dharma-gold-500/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-dharma-gold-500/60 to-transparent" />
      </div>

      <div className="relative z-[2] mx-auto grid max-w-content items-center gap-16 lg:grid-cols-[1fr_1fr]">
        <div>
          <Reveal as="p" y={16} className="eyebrow mb-6 text-dharma-gold-400">{site.featured.eyebrow}</Reveal>
          <SplitReveal as="h2" className="font-dharma-display text-display-xl text-gradient-gold">{site.featured.title}</SplitReveal>
          <Reveal as="p" y={24} className="mt-8 max-w-prose text-body-xl text-fg-muted text-pretty">{site.featured.body}</Reveal>
          <Reveal stagger={0.08} y={16} className="mt-8 flex flex-wrap gap-2">
            {site.featured.facts.map((f) => <span key={f} className="rounded-pill border border-line px-4 py-2 font-body text-caption uppercase tracking-widest text-fg-muted">{f}</span>)}
          </Reveal>
          <Reveal y={20} className="mt-10"><Button href={site.featured.cta.href} size="lg">{site.featured.cta.label}</Button></Reveal>
        </div>

        <div data-fan-wrap className="relative mx-auto flex h-[24rem] w-full max-w-[34rem] items-center justify-center sm:h-[30rem]">
          <div data-fan-glow aria-hidden="true" className="absolute size-[30rem] rounded-full arc-ring opacity-20 blur-3xl" />
          {fan.map((c) => (
            <div key={c.slug} data-fan className="absolute w-[9.5rem] origin-[50%_120%] sm:w-[12rem]" style={{ zIndex: 1 }}>
              <Tilt max={14} className="card-ratio rounded-card">
                <div className="size-full overflow-hidden rounded-card shadow-card-lift" data-cursor="text" data-cursor-text="Play">
                  <Image src={c.image.src} width={c.image.w} height={c.image.h} alt={c.name} sizes="12rem" className="size-full object-cover" draggable={false} />
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
