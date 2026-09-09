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

      <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <Parallax speed={0.3} className="col-span-2 row-span-2">
          <Reveal scale={0.94} y={40}>
            <Tilt max={5} className="rounded-2xl">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-canvas-deep p-8 hairline grain" data-cursor="link">
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2/3 lamp-glow" />
                <Image src="/brand/logo-emblem.png" alt="Four friends playing cards under a lamp — the Lostcoz emblem" width={1600} height={1034} sizes="(max-width: 768px) 90vw, 40vw" className="relative w-full animate-float" />
              </div>
            </Tilt>
          </Reveal>
        </Parallax>
        {site.community.tiles.map((t, i) => (
          <Parallax key={t.label} speed={speeds[i % speeds.length]}>
            <Reveal y={40} delay={i * 0.05}>
              <Tilt max={10} className="rounded-2xl">
                <div className="flex aspect-square items-end rounded-2xl p-5 hairline" style={{ background: `color-mix(in oklab, ${t.hue} 16%, var(--color-surface-1))` }} data-cursor="link">
                  <p className="font-display text-title uppercase leading-tight" style={{ color: t.hue }}>{t.label}</p>
                </div>
              </Tilt>
            </Reveal>
          </Parallax>
        ))}
      </div>
    </Section>
  );
}
