import Image from "next/image";
import Link from "next/link";
import Section from "@/components/ui/Section";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";
import Tilt from "@/components/motion/Tilt";
import { site } from "@/data/site";

/** Each pillar is a link: to the game, to the WhatsApp community, or to our inbox. */
export default function Manifesto() {
  return (
    <Section id="about" className="scroll-mt-20">
      <Reveal as="p" y={16} className="eyebrow mb-10">{site.about.eyebrow}</Reveal>
      <SplitReveal as="p" mode="words-scrub" className="max-w-[26ch] font-display text-display-md uppercase text-balance">
        {site.about.statement}
      </SplitReveal>

      <Reveal stagger={0.12} y={60} className="mt-16 grid gap-5 sm:grid-cols-2 md:mt-24 md:grid-cols-3">
        {site.about.pillars.map((p, i) => {
          const external = p.href.startsWith("http") || p.href.startsWith("mailto:");
          const Card = (
            <article className="glass-panel glass-sheen group/pillar relative flex h-full flex-col overflow-hidden rounded-2xl" data-cursor="link">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={p.image} alt="" fill sizes="(max-width: 640px) 92vw, (max-width: 768px) 46vw, 30vw"
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover/pillar:scale-105"
                />
                {/* tint the photo with the pillar's hue and fade it into the card */}
                <div aria-hidden="true" className="absolute inset-0 mix-blend-soft-light opacity-70" style={{ background: p.hue }} />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgb(11_11_15/0.85)_100%)]" />
                <span className="absolute left-5 top-4 font-display text-display-sm text-outline opacity-70">0{i + 1}</span>
              </div>

              <div className="relative z-[1] flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="font-display text-title uppercase">{p.title}</h3>
                <p className="mt-3 text-fg-muted text-pretty">{p.body}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-body text-caption font-bold uppercase tracking-widest" style={{ color: p.hue }}>
                  {p.cta}
                  <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover/pillar:translate-x-1">→</span>
                </span>
              </div>
            </article>
          );

          return (
            <Tilt key={p.title} max={8} className="rounded-2xl">
              {external ? (
                <a href={p.href} target={p.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block h-full rounded-2xl">
                  {Card}
                </a>
              ) : (
                <Link href={p.href} className="block h-full rounded-2xl">{Card}</Link>
              )}
              {"secondary" in p && p.secondary && (
                <a href={p.secondary.href} className="mt-3 inline-flex min-h-11 items-center gap-2 px-1 font-body text-caption uppercase tracking-widest text-fg-subtle transition-colors hover:text-fg">
                  <span aria-hidden="true">☎</span>{p.secondary.label}
                </a>
              )}
            </Tilt>
          );
        })}
      </Reveal>
    </Section>
  );
}
