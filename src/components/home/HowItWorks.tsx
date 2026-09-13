"use client";
import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { site } from "@/data/site";
import Section from "@/components/ui/Section";
import Reveal from "@/components/motion/Reveal";

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reducedMotion() || !ref.current) return;
    gsap.from("[data-line]", { scaleX: 0, transformOrigin: "left center", ease: "none", scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 60%", scrub: 0.5 } });
  }, { scope: ref });

  return (
    <Section className="bg-surface-inverse text-fg-inverse" inner="max-w-content" dimCard>
      <div ref={ref}>
        <Reveal as="p" y={16} className="eyebrow mb-12 text-ink-500">{site.how.eyebrow}</Reveal>
        <div data-line aria-hidden="true" className="mb-10 h-px w-full bg-ink-950/25" />
        <Reveal stagger={0.12} y={50} className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {site.how.steps.map((s, i) => (
            <div key={s.title} className="group">
              <p className="mb-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-500">
                Step {i + 1} of {site.how.steps.length}
              </p>
              <span className="block font-display text-display-xl leading-none text-ink-950 transition-transform duration-700 ease-out-expo group-hover:-translate-y-2" data-skew>0{i + 1}</span>
              <h3 className="mt-6 font-display text-title uppercase">{s.title}</h3>
              <p className="mt-2 text-ink-600 text-pretty">{s.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
