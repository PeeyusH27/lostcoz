import Image from "next/image";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Parallax from "@/components/motion/Parallax";
import Reveal from "@/components/motion/Reveal";
import Tilt from "@/components/motion/Tilt";
import { site } from "@/data/site";

export default function Community() {
  const speeds = [0.35, -0.2, 0.15, -0.35, 0.25, -0.15];
  return (
    <Section id="community" className="scroll-mt-20 overflow-hidden">
      <SectionHeading eyebrow={site.community.eyebrow} title={site.community.title} lead={site.community.body} />

      <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:mt-20 md:grid-cols-4 md:gap-6">
        <Parallax speed={0.3} className="col-span-2 row-span-2">
          <Reveal scale={0.94} y={40}>
            <Tilt max={5} className="rounded-2xl">
              {/* the real thing: an actual Lostcoz table, not the illustrated emblem */}
              <div className="group/hero relative flex aspect-square items-end overflow-hidden rounded-2xl bg-canvas-deep hairline" data-cursor="link">
                <Image
                  src="/photos/lostcoz-gamenight.jpg"
                  alt="A Lostcoz game night: seven people around a table mid-game"
                  fill priority={false}
                  sizes="(max-width: 768px) 92vw, 44vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover/hero:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgb(7_7_9/0.88)_100%)]" />
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 lamp-glow opacity-60 mix-blend-screen" />
                <p className="relative z-[1] p-5 font-display text-title uppercase leading-tight text-fg drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:p-7">
                  A real Lostcoz table
                </p>
              </div>
            </Tilt>
          </Reveal>
        </Parallax>
        {site.community.tiles.map((t, i) => (
          <Parallax key={t.label} speed={speeds[i % speeds.length]}>
            <Reveal y={40} delay={i * 0.05}>
              <Tilt max={10} className="rounded-2xl">
                <div
                  className="group/tile relative flex aspect-square items-end overflow-hidden rounded-2xl p-4 hairline sm:p-5"
                  style={{ ["--glass-border" as string]: `color-mix(in oklab, ${t.hue} 35%, transparent)` }}
                  data-cursor="link"
                >
                  <Image
                    src={t.image} alt="" fill sizes="(max-width: 768px) 46vw, 22vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover/tile:scale-105"
                  />
                  {/* hue wash + bottom scrim so the label stays legible on any photo */}
                  <div aria-hidden="true" className="absolute inset-0 mix-blend-soft-light opacity-80" style={{ background: t.hue }} />
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_7_9/0.15)_0%,rgb(7_7_9/0.82)_100%)]" />
                  <p className="relative z-[1] font-display text-[clamp(0.82rem,3.4vw,1.35rem)] uppercase leading-[1.15] text-balance text-fg drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">{t.label}</p>
                </div>
              </Tilt>
            </Reveal>
          </Parallax>
        ))}
      </div>
    </Section>
  );
}
