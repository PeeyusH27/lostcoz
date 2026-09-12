"use client";
import { useRef } from "react";
import { useGSAP, finePointer, reducedMotion } from "@/lib/gsap";
import { site } from "@/data/site";
import Button from "@/components/ui/Button";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";

export default function JoinCTA() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (!finePointer() || reducedMotion() || !ref.current) return;
    const el = ref.current;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, { scope: ref });

  return (
    <section id="join" ref={ref} className="relative scroll-mt-20 overflow-hidden bg-canvas-deep px-gutter py-section grain" style={{ ["--mx" as string]: "50%", ["--my" as string]: "40%" }}>
      <div aria-hidden="true" className="absolute inset-0 transition-opacity duration-700" style={{ background: "radial-gradient(38rem circle at var(--mx) var(--my), rgb(249 154 14 / 0.28), rgb(229 26 111 / 0.12) 40%, transparent 70%)" }} />
      <div className="relative z-[2] mx-auto max-w-wide text-center">
        <SplitReveal as="h2" mode="chars" stagger={0.02} className="font-display text-display-2xl uppercase text-balance">{site.join.title}</SplitReveal>
        <Reveal as="p" y={20} className="mx-auto mt-8 max-w-prose text-body-xl text-fg-muted text-pretty">{site.join.body}</Reveal>
        <Reveal stagger={0.1} y={20} data-cta-stack className="group/stack mt-10 flex flex-col items-stretch justify-center gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button href={site.join.primary.href} size="lg">{site.join.primary.label}</Button>
          <Button href={site.join.secondary.href} variant="ghost" size="lg">{site.join.secondary.label}</Button>
        </Reveal>
      </div>
    </section>
  );
}
