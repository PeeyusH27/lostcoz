"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { flatten, group } from "@/components/brand/tokens-util";

/** Live easing comparison — press play to send every box across on its own curve. */
export default function MotionDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const eases = flatten(group("ease"), ["ease"]);
  useGSAP(() => {}, { scope: ref });
  const play = () => {
    const root = ref.current;
    if (!root) return;
    const rows = gsap.utils.toArray<HTMLElement>("[data-ease-box]", root);
    gsap.killTweensOf(rows);
    gsap.set(rows, { x: 0 });
    rows.forEach((r) => gsap.to(r, { x: () => (r.parentElement!.clientWidth - r.clientWidth), duration: 1.4, ease: r.dataset.gsap }));
  };
  const gsapName = (t: { path: string[] }) => {
    const raw = (group("ease")[t.path[1]] as { $extensions?: { gsap?: string } } | undefined)?.$extensions?.gsap;
    return raw ?? "none";
  };
  return (
    <div ref={ref}>
      <div className="grid gap-3">
        {eases.map((e) => (
          <div key={e.name} className="grid grid-cols-[9rem_1fr] items-center gap-4 sm:grid-cols-[12rem_1fr_10rem]">
            <div className="min-w-0"><p className="truncate font-mono text-xs">{e.name}</p><p className="truncate font-mono text-[0.65rem] text-fg-subtle">{e.value}</p></div>
            <div className="relative h-8 rounded-pill bg-surface-2"><div data-ease-box data-gsap={gsapName(e)} className="absolute left-0 top-0 h-8 w-8 rounded-pill bg-accent" /></div>
            <p className="hidden truncate font-mono text-[0.68rem] text-fg-muted sm:block">gsap: {gsapName(e)}</p>
          </div>
        ))}
      </div>
      <button type="button" onClick={play} className="mt-6 rounded-pill bg-fg px-6 py-3 font-body text-xs font-bold uppercase tracking-widest text-fg-inverse transition-colors hover:bg-brand-orange">Play easings</button>
    </div>
  );
}
