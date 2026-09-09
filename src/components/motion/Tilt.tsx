"use client";
import { useRef } from "react";
import { gsap, useGSAP, finePointer, reducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** 3D tilt that follows the pointer, with an optional moving shine. */
export default function Tilt({
  children, max = 12, scale = 1.03, shine = true, className, perspective = 1000,
}: { children: React.ReactNode; max?: number; scale?: number; shine?: boolean; className?: string; perspective?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!finePointer() || reducedMotion() || !ref.current) return;
    const el = ref.current;
    gsap.set(el, { transformPerspective: perspective });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 2 * max);
      rx((0.5 - py) * 2 * max);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    };
    const enter = () => gsap.to(el, { scale, duration: 0.5, ease: "power3" });
    const leave = () => { rx(0); ry(0); gsap.to(el, { scale: 1, duration: 0.7, ease: "power3" }); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave); };
  }, { scope: ref });

  return (
    <div ref={ref} className={cn("tilt relative will-change-transform [transform-style:preserve-3d]", className)}>
      {children}
      {shine && <div className="card-shine" aria-hidden="true" />}
    </div>
  );
}
