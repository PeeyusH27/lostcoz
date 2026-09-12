"use client";
import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { site } from "@/data/site";
import Button from "@/components/ui/Button";
import Tilt from "@/components/motion/Tilt";

/** Pinned horizontal-scroll section on desktop; native swipe row on small screens. */
export default function Events() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (reducedMotion() || !section.current || !track.current) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth;
      gsap.to(t, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", t);
      panels.forEach((p) => {
        gsap.from(p.querySelector("[data-panel-num]"), {
          xPercent: 40, opacity: 0, ease: "none",
          scrollTrigger: { trigger: p, containerAnimation: gsap.getTweensOf(t)[0], start: "left 90%", end: "left 50%", scrub: true },
        });
      });
    });
    return () => mm.revert();
  }, { scope: section });

  return (
    // z-2 on the section itself: when pinned (position: fixed) it becomes a stacking context, so it must sit above the travelling card
    <section id="events" ref={section} className="relative z-[2] scroll-mt-20 overflow-hidden py-24 md:h-svh md:py-0">
      <div ref={track} className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-gutter scroll-px-gutter no-scrollbar md:h-svh md:snap-none md:items-center md:gap-8 md:overflow-visible md:pr-[10vw]">
        <div data-panel className="flex w-[86vw] shrink-0 snap-start flex-col justify-center sm:w-[70vw] md:w-[42vw] md:min-w-[26rem]">
          <p className="eyebrow mb-6">{site.events.eyebrow}</p>
          <h2 className="font-display text-display-lg uppercase text-balance">{site.events.title}</h2>
          <p className="mt-6 max-w-prose text-body-lg text-fg-muted">{site.events.note}</p>
          <div className="mt-8"><Button href="/#join" variant="ghost">Get a seat</Button></div>
          <p className="mt-10 hidden items-center gap-3 eyebrow md:flex"><span className="h-px w-10 bg-line-strong" />Scroll sideways</p>
        </div>
        {site.events.formats.map((f) => (
          <div key={f.num} data-panel className="w-[86vw] shrink-0 snap-start sm:w-[26rem] md:w-[34rem]">
            <Tilt max={6} className="rounded-2xl">
              <article className="glass-panel glass-sheen relative flex h-[24rem] flex-col justify-between gap-8 overflow-hidden rounded-2xl p-6 sm:h-[28rem] sm:p-8 md:h-[34rem] md:p-10" data-cursor="link">
                <div aria-hidden="true" className="absolute -bottom-24 -right-24 size-72 rounded-full opacity-50 blur-3xl" style={{ background: f.hue }} />
                <div className="relative z-[1] flex items-start justify-between">
                  <span data-panel-num className="font-display text-display-xl leading-none" style={{ color: f.hue }}>{f.num}</span>
                  <span className="glass-soft rounded-pill px-3 py-1.5 font-body text-caption uppercase tracking-widest text-fg-muted">{f.tag}</span>
                </div>
                <div className="relative z-[1]">
                  <h3 className="font-display text-display-sm uppercase">{f.title}</h3>
                  <p className="mt-4 max-w-[40ch] text-body-lg text-fg-muted text-pretty">{f.body}</p>
                </div>
              </article>
            </Tilt>
          </div>
        ))}
      </div>
    </section>
  );
}
