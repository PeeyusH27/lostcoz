"use client";
import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { site } from "@/data/site";
import Button from "@/components/ui/Button";
import Tilt from "@/components/motion/Tilt";
import { cn } from "@/lib/cn";

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
          <div data-cta-stack className="group/stack mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button href={site.events.cta.href}>{site.events.cta.label}</Button>
            <Button href={site.events.contact.href} variant="ghost">{site.events.contact.label}</Button>
          </div>
          {/* the cue has to show on touch too: the rail scrolls sideways at every size */}
          <p className="mt-8 flex items-center gap-3 eyebrow">
            <span className="h-px w-10 bg-line-strong" />
            <span className="md:hidden">Swipe for formats</span>
            <span className="hidden md:inline">Scroll sideways</span>
          </p>
        </div>
        {site.events.formats.map((f) => {
          const soon = "comingSoon" in f && f.comingSoon;
          return (
            <div key={f.num} data-panel className="w-[86vw] shrink-0 snap-start sm:w-[26rem] md:w-[34rem]">
              <Tilt max={soon ? 0 : 6} className="rounded-2xl">
                <article
                  className={cn(
                    "glass-panel glass-sheen relative flex h-[24rem] flex-col justify-between gap-8 overflow-hidden rounded-2xl p-6 sm:h-[28rem] sm:p-8 md:h-[34rem] md:p-10",
                    soon && "opacity-70",
                  )}
                  data-cursor={soon ? undefined : "link"}
                >
                  <div aria-hidden="true" className="absolute -bottom-24 -right-24 size-72 rounded-full opacity-50 blur-3xl" style={{ background: f.hue }} />
                  <div className="relative z-[1] flex items-start justify-between gap-4">
                    <span data-panel-num className="font-display text-display-xl leading-none" style={{ color: f.hue }}>{f.num}</span>
                    <span className="glass-soft shrink-0 rounded-pill px-3 py-1.5 font-body text-caption uppercase tracking-widest text-fg-muted">{f.tag}</span>
                  </div>
                  <div className="relative z-[1]">
                    <h3 className="font-display text-display-sm uppercase">{f.title}</h3>
                    <p className="mt-4 max-w-[40ch] text-body-lg text-fg-muted text-pretty">{f.body}</p>

                    {soon ? (
                      /* Playtest Lab is invite-only: deliberately not a link */
                      <span className="mt-6 inline-flex cursor-not-allowed items-center gap-2 rounded-pill border border-line px-4 py-2.5 font-body text-caption font-bold uppercase tracking-widest text-fg-subtle select-none">
                        Coming soon
                      </span>
                    ) : "cta" in f && f.cta ? (
                      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                        <a
                          href={f.cta.href}
                          target={f.cta.href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          className="group/cta inline-flex min-h-11 items-center gap-2 font-body text-caption font-bold uppercase tracking-widest"
                          style={{ color: f.hue }}
                        >
                          {f.cta.label}
                          <span aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover/cta:translate-x-1">→</span>
                        </a>
                        {"secondary" in f && f.secondary && (
                          <a href={f.secondary.href} className="inline-flex min-h-11 items-center gap-2 font-body text-caption uppercase tracking-widest text-fg-subtle transition-colors hover:text-fg">
                            <span aria-hidden="true">☎</span>{f.secondary.label}
                          </a>
                        )}
                      </div>
                    ) : null}
                  </div>
                </article>
              </Tilt>
            </div>
          );
        })}
      </div>
    </section>
  );
}
