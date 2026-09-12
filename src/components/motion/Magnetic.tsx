"use client";
import { useRef } from "react";
import { gsap, useGSAP, finePointer, reducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** Pulls its child toward the pointer while hovering (magnetic button). */
export default function Magnetic({
  children, strength = 0.35, className,
}: { children: React.ReactNode; strength?: number; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!finePointer() || reducedMotion() || !wrap.current || !inner.current) return;
    const el = wrap.current;
    const xTo = gsap.quickTo(inner.current, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(inner.current, "y", { duration: 0.6, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { gsap.to(inner.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" }); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, { scope: wrap });

  return (
    <div ref={wrap} className={cn("inline-block p-3 -m-3 group-data-[cta-stack]/stack:max-sm:w-full", className)}>
      <div ref={inner} className="inline-block will-change-transform group-data-[cta-stack]/stack:max-sm:block group-data-[cta-stack]/stack:max-sm:w-full">{children}</div>
    </div>
  );
}
