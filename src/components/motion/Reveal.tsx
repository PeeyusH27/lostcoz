"use client";
import { useRef, type ElementType } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  /** distance in px the element rises from */
  y?: number;
  /** stagger direct children instead of animating the wrapper */
  stagger?: number;
  delay?: number;
  /** ScrollTrigger start (default: element top hits 85% of viewport) */
  start?: string;
  /** scrub instead of play-once */
  scrub?: boolean;
  scale?: number;
  rotate?: number;
  /** anything else (data-* attributes, aria-*) is forwarded to the rendered element */
  [key: `data-${string}`]: unknown;
};

/** Fade + rise into view on scroll. With `stagger`, animates the element's children one by one. */
export default function Reveal({
  children, as: Tag = "div", className, y = 48, stagger, delay = 0, start = "top 85%", scrub = false, scale, rotate, ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (reducedMotion() || !ref.current) return;
    const targets = stagger != null ? Array.from(ref.current.children) : ref.current;
    gsap.from(targets, {
      y, opacity: 0, scale, rotation: rotate,
      duration: 1.1, ease: "expo.out", delay, stagger,
      scrollTrigger: scrub
        ? { trigger: ref.current, start: "top 95%", end: "top 55%", scrub: 0.6 }
        : { trigger: ref.current, start, toggleActions: "play none none none", once: true },
    });
  }, { scope: ref });
  return <Tag ref={ref} className={cn(className)} {...rest}>{children}</Tag>;
}
