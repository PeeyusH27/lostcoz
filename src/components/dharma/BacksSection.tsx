import Image from "next/image";
import { backs } from "@/data/dharma";
import SectionHeading from "@/components/ui/SectionHeading";
import Parallax from "@/components/motion/Parallax";
import Reveal from "@/components/motion/Reveal";
import Tilt from "@/components/motion/Tilt";

export default function BacksSection() {
  const list = [backs.clan, backs.ability, backs.eliminated];
  return (
    <section className="relative overflow-hidden px-gutter py-section">
      <div aria-hidden="true" className="absolute inset-0">
        <Image src="/textures/velvet-crimson.jpg" alt="" fill sizes="100vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-canvas)_0%,transparent_30%,transparent_70%,var(--color-canvas)_100%)]" />
      </div>
      <div className="relative z-[2] mx-auto max-w-content">
        <SectionHeading eyebrow="Card backs" title="Three backs. Three secrets." align="center" />
        <div className="mt-20 grid gap-14 sm:grid-cols-3 sm:gap-8">
          {list.map((b, i) => (
            <Parallax key={b.title} speed={[0.25, -0.15, 0.3][i]} rotate={[-3, 0, 3][i]}>
              <Reveal y={60} delay={i * 0.1}>
                <Tilt max={12} className="card-ratio mx-auto w-[14rem] rounded-card sm:w-full sm:max-w-[18rem]">
                  <div className="size-full overflow-hidden rounded-card shadow-card-lift" data-cursor="text" data-cursor-text="Turn">
                    <Image src={b.src} width={b.w} height={b.h} alt={b.title} sizes="18rem" className="size-full object-cover" draggable={false} />
                  </div>
                </Tilt>
                <h3 className="mt-8 text-center font-dharma-display text-display-sm text-dharma-gold-300">{b.title}</h3>
                <p className="mx-auto mt-3 max-w-[32ch] text-center text-fg-muted text-pretty">{b.blurb}</p>
              </Reveal>
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}
