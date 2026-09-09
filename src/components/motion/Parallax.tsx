"use client";
import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * Moves its content at a different rate than the page while it crosses the viewport.
 * speed > 0 lags behind (feels far away), speed < 0 races ahead (feels close). Range ≈ -1…1.
 */
export default function Parallax({
  children, speed = 0.3, className, rotate = 0,
}: { children: React.ReactNode; speed?: number; className?: string; rotate?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reducedMotion() || !ref.current) return;
    gsap.fromTo(ref.current, { y: () => speed * 160, rotation: -rotate }, {
      y: () => speed * -160, rotation: rotate, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
    });
  }, { scope: ref });
  return <div ref={ref} className={cn("will-change-transform", className)}>{children}</div>;
}
