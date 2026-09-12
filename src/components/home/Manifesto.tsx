import Section from "@/components/ui/Section";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";
import Tilt from "@/components/motion/Tilt";
import { site } from "@/data/site";

export default function Manifesto() {
  return (
    <Section id="about" className="scroll-mt-20">
      <Reveal as="p" y={16} className="eyebrow mb-10">{site.about.eyebrow}</Reveal>
      <SplitReveal as="p" mode="words-scrub" className="max-w-[26ch] font-display text-display-md uppercase text-balance">
        {site.about.statement}
      </SplitReveal>

      <Reveal stagger={0.12} y={60} className="mt-16 grid gap-5 sm:grid-cols-2 md:mt-24 md:grid-cols-3">
        {site.about.pillars.map((p, i) => (
          <Tilt key={p.title} max={8} className="rounded-2xl">
            <article className="glass-panel glass-sheen relative flex min-h-[16rem] flex-col justify-between gap-10 overflow-hidden rounded-2xl p-6 sm:p-8 md:min-h-[24rem]" data-cursor="link">
              <div aria-hidden="true" className="absolute -right-16 -top-16 size-56 rounded-full opacity-60 blur-3xl" style={{ background: p.hue }} />
              <span className="relative z-[1] font-display text-display-lg text-outline opacity-50">0{i + 1}</span>
              <div className="relative z-[1]">
                <h3 className="font-display text-title uppercase">{p.title}</h3>
                <p className="mt-3 text-fg-muted text-pretty">{p.body}</p>
              </div>
            </article>
          </Tilt>
        ))}
      </Reveal>
    </Section>
  );
}
