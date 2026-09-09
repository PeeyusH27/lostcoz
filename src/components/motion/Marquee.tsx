"use client";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** Infinite ticker that speeds up — and flips direction — with scroll velocity. */
export default function Marquee({
  children, speed = 70, className, reverse = false,
}: { children: React.ReactNode; speed?: number; className?: string; reverse?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reducedMotion() || !track.current) return;
    const el = track.current;
    const tween = gsap.to(el, { xPercent: -50, ease: "none", duration: () => el.scrollWidth / 2 / speed, repeat: -1 });
    const dir = reverse ? -1 : 1;
    tween.timeScale(dir);
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-3, 3, self.getVelocity() / 500);
        const target = dir * (1 + Math.abs(v)) * (v < 0 ? -1 : 1);
        gsap.to(tween, { timeScale: target, duration: 0.5, overwrite: true });
      },
    });
    return () => { st.kill(); tween.kill(); };
  }, { scope: track });

  return (
    <div className={cn("overflow-hidden", className)}>
      <div ref={track} className="marquee-track">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
