"use client";
import { useEffect, useRef } from "react";
import { gsap, finePointer, reducedMotion } from "@/lib/gsap";

/**
 * Custom cursor: a tight dot and a lagging ring.
 * Elements opt into states with `data-cursor="link" | "text" | "hide"` and `data-cursor-text="PLAY"`.
 * Plain links/buttons get the "link" state automatically.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!finePointer() || reducedMotion() || !dot.current || !ring.current) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");
    const xDot = gsap.quickTo(dot.current, "x", { duration: 0.1, ease: "power3" });
    const yDot = gsap.quickTo(dot.current, "y", { duration: 0.1, ease: "power3" });
    const xRing = gsap.quickTo(ring.current, "x", { duration: 0.42, ease: "power3" });
    const yRing = gsap.quickTo(ring.current, "y", { duration: 0.42, ease: "power3" });
    gsap.set([dot.current, ring.current], { opacity: 0 });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) { shown = true; gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 }); }
      xDot(e.clientX); yDot(e.clientY); xRing(e.clientX); yRing(e.clientY);
    };
    const over = (e: Event) => {
      const el = e.target as Element | null;
      const tagged = el?.closest?.("[data-cursor]") as HTMLElement | null;
      const r = ring.current!;
      if (tagged) {
        r.dataset.mode = tagged.dataset.cursor ?? "link";
        label.current!.textContent = tagged.dataset.cursorText ?? "";
      } else if (el?.closest?.("a, button, [role='button'], input, select, textarea, label")) {
        r.dataset.mode = "link"; label.current!.textContent = "";
      } else {
        r.dataset.mode = ""; label.current!.textContent = "";
      }
    };
    const down = () => ring.current?.classList.add("is-down");
    const up = () => ring.current?.classList.remove("is-down");
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.25 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.25 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, true);
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over, true);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring"><span ref={label} className="cursor-label" /></div>
    </div>
  );
}
