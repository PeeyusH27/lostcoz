"use client";
import { useRef } from "react";
import { gsap, useGSAP, finePointer, reducedMotion } from "@/lib/gsap";
import { site } from "@/data/site";
import Button from "@/components/ui/Button";
import SplitReveal from "@/components/motion/SplitReveal";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reducedMotion() || !ref.current) return;
    const root = ref.current;
    // intro
    gsap.timeline({ delay: 0.15 })
      .from("[data-hero-eyebrow]", { y: 20, opacity: 0, duration: 0.8 })
      .from("[data-hero-line2]", { clipPath: "inset(0 0 100% 0)", y: 40, duration: 1.3, ease: "expo.out" }, 0.45)
      .from("[data-hero-lead] > *", { y: 30, opacity: 0, stagger: 0.12, duration: 1 }, 0.9)
      .from("[data-hero-hint]", { opacity: 0, duration: 1 }, 1.4);
    // scroll: hero content drifts up and fades while leaving
    gsap.to("[data-hero-content]", {
      yPercent: -18, opacity: 0, ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to("[data-depth]", {
      yPercent: (i, el) => -30 * Number((el as HTMLElement).dataset.depth), ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
    });
    // pointer parallax on the light layers
    if (finePointer()) {
      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", root);
      const xs = layers.map((l) => gsap.quickTo(l, "x", { duration: 1.4, ease: "power2" }));
      const ys = layers.map((l) => gsap.quickTo(l, "y", { duration: 1.4, ease: "power2" }));
      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l, i) => { const d = Number(l.dataset.depth); xs[i](nx * d * 90); ys[i](ny * d * 90); });
      };
      window.addEventListener("pointermove", move, { passive: true });
      return () => window.removeEventListener("pointermove", move);
    }
  }, { scope: ref });

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-canvas-deep grain">
      {/* light layers — deeper values move more */}
      <div aria-hidden="true" className="absolute inset-0">
        <div data-depth="0.15" className="absolute inset-x-0 top-0 h-[80vh] lamp-glow" />
        <div data-depth="0.5" className="absolute -left-[12%] top-[14%] size-[58vw] rounded-full bg-brand-purple/35 blur-[130px]" />
        <div data-depth="0.7" className="absolute -bottom-[12%] -right-[10%] size-[50vw] rounded-full bg-brand-magenta/30 blur-[150px]" />
        <div data-depth="0.4" className="absolute bottom-[12%] left-[38%] size-[32vw] rounded-full bg-brand-cyan/25 blur-[120px]" />
        <div data-depth="0.3" className="absolute left-1/2 top-[52%] size-[118vmin] -translate-x-1/2 -translate-y-1/2 rounded-full arc-ring opacity-25 animate-spin-slow [mask-image:radial-gradient(circle,transparent_63%,black_64%,black_66.5%,transparent_67.5%)]" />
        <div data-depth="0.2" className="absolute left-1/2 top-[52%] size-[86vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line" />
      </div>

      <div data-hero-content className="relative z-[2] mx-auto flex min-h-[100svh] max-w-wide flex-col justify-end px-gutter pb-[10vh] pt-36">
        <p data-hero-eyebrow className="eyebrow mb-8 text-brand-orange">{site.hero.eyebrow}</p>
        <h1 className="font-display text-display-2xl uppercase">
          <SplitReveal as="span" mode="chars" immediate delay={0.3} className="block">{site.hero.line1}</SplitReveal>
          <span data-hero-line2 className="block text-gradient-arc pb-[0.12em]">{site.hero.line2}</span>
        </h1>
        <div data-hero-lead className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[46ch] text-body-xl text-fg-muted text-pretty">{site.hero.lead}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button href={site.hero.primary.href} size="lg">{site.hero.primary.label}</Button>
            <Button href={site.hero.secondary.href} variant="ghost" size="lg">{site.hero.secondary.label}</Button>
          </div>
        </div>
      </div>

      <div data-hero-hint aria-hidden="true" className="absolute bottom-8 left-1/2 z-[2] hidden -translate-x-1/2 flex-col items-center gap-3 text-fg-subtle md:flex">
        <span className="eyebrow text-[0.6rem]">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-line"><span className="absolute inset-x-0 top-0 h-1/2 animate-[float_1.6s_ease-in-out_infinite] bg-brand-orange" /></span>
      </div>
    </section>
  );
}
