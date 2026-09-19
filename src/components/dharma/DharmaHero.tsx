"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { backs, facts, rulebookPdf } from "@/data/dharma";
import { links } from "@/data/links";
import Button from "@/components/ui/Button";
import Tilt from "@/components/motion/Tilt";

export default function DharmaHero() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (reducedMotion() || !ref.current) return;
    const tl = gsap.timeline({ delay: 0.2 });
    tl.from("[data-h-eyebrow]", { y: 20, opacity: 0, duration: 0.8 })
      .from("[data-h-line]", { clipPath: "inset(0 0 100% 0)", y: 50, stagger: 0.18, duration: 1.3, ease: "expo.out" }, 0.3)
      .from("[data-h-lead]", { y: 30, opacity: 0, duration: 1 }, 0.8)
      .from("[data-h-cta] > *", { y: 20, opacity: 0, stagger: 0.1, duration: 0.8 }, 1)
      .from("[data-h-card]", { y: 140, rotation: 0, opacity: 0, stagger: 0.12, duration: 1.4, ease: "expo.out" }, 0.5)
      .from("[data-h-fact]", { y: 20, opacity: 0, stagger: 0.08, duration: 0.8 }, 1.3);
    gsap.to("[data-h-cards]", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
    gsap.to("[data-h-copy]", { yPercent: -12, opacity: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
  }, { scope: ref });

  // spread/rotation scale with --fan-spread / --fan-rot so the fan stays on-screen
  // on a phone and opens up on larger viewports
  const fan = [
    { ...backs.ability, rot: -1, x: -1, z: 1 },
    { ...backs.clan, rot: 0, x: 0, z: 3 },
    { ...backs.eliminated, rot: 1, x: 1, z: 2 },
  ];

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden px-gutter pb-16 pt-28 grain sm:pt-36">
      <div aria-hidden="true" className="absolute inset-0">
        <Image src="/textures/velvet-emerald.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgb(201_162_78/0.22),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,var(--color-canvas)_100%)]" />
      </div>

      <div className="relative z-[2] mx-auto grid max-w-wide items-center gap-10 md:gap-14 lg:grid-cols-[1.25fr_1fr]">
        <div data-h-copy>
          <p data-h-eyebrow className="eyebrow mb-8 text-dharma-gold-400">A Lostcoz original · 4–11 players</p>
          <h1 className="font-dharma-display text-display-xl">
            <span data-h-line className="block text-gradient-gold pb-[0.08em]">Order of</span>
            <span data-h-line className="block text-gradient-gold pb-[0.08em]">Dharma</span>
          </h1>
          <p data-h-lead className="mt-8 max-w-[44ch] text-body-xl text-fg-muted text-pretty">
            A battle between two Clans to establish their Dharma. Outwit the rival Clan and eliminate them. The catch is, you don&apos;t know your ally or your enemies.
          </p>
          <div data-h-cta data-cta-stack className="group/stack mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button href="#rules" size="lg">How to play</Button>
            <Button href={links.prebook} variant="secondary" size="lg">Buy the game</Button>
            <Button href={rulebookPdf} variant="ghost" size="lg" download>Rulebook PDF</Button>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-x-4 gap-y-7 min-[420px]:grid-cols-3 sm:mt-14 sm:grid-cols-5">
            {facts.map((f) => (
              <div key={f.label} data-h-fact>
                <dt className="eyebrow">{f.label}</dt>
                <dd className="mt-2 font-dharma-display text-display-sm text-dharma-gold-300">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The fan reads as atmosphere behind the copy: it is held back in opacity and,
            from lg, allowed to run off the right edge so only part of it is on screen. */}
        <div
          data-h-cards
          className="relative mx-auto flex h-[19rem] w-full max-w-[36rem] items-center justify-center opacity-70 [--fan-rot:13deg] [--fan-spread:46%] sm:h-[26rem] sm:[--fan-rot:16deg] sm:[--fan-spread:58%] lg:h-[32rem] lg:-mr-[16vw] lg:max-w-none lg:opacity-60 lg:[mask-image:linear-gradient(to_right,transparent,black_18%,black_72%,transparent)]"
        >
          <div aria-hidden="true" className="absolute size-[16rem] rounded-full bg-dharma-gold-500/20 blur-[100px] animate-pulse-glow sm:size-[26rem]" />
          {fan.map((c) => (
            <div
              key={c.title}
              data-h-card
              className="absolute w-[7.5rem] sm:w-[11rem] lg:w-[14rem]"
              style={{
                transform: `translateX(calc(${c.x} * var(--fan-spread))) rotate(calc(${c.rot} * var(--fan-rot)))`,
                zIndex: c.z,
                transformOrigin: "50% 130%",
              }}
            >
              <Tilt max={16} className="card-ratio rounded-card">
                <div className="size-full overflow-hidden rounded-card shadow-card-lift" data-cursor="text" data-cursor-text="Deal">
                  <Image src={c.src} width={c.w} height={c.h} alt={c.title} sizes="(max-width: 640px) 7.5rem, 14rem" priority className="size-full object-cover" draggable={false} />
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
