"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger, finePointer, reducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type Face = { src: string; alt: string };

/**
 * The hero background card. Fixed to the viewport, it glides from the top edge to the bottom edge
 * as the whole page scrolls, flipping to reveal its face on the way, and leaning toward the pointer.
 * z-index 1: above section backgrounds, below section content (which sits at z-index 2).
 */
export default function TravelingCard({ front, back, className, side = "right" }: { front: Face; back: Face; className?: string; side?: "left" | "right" }) {
  const wrap = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!wrap.current || !tilt.current || !card.current) return;
    if (reducedMotion()) { gsap.set(wrap.current, { y: 120 }); return; }
    const w = wrap.current;
    gsap.fromTo(tilt.current, { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 0.4, ease: "power2.out" });
    gsap.fromTo(w, { y: 88 }, {
      y: () => window.innerHeight - w.offsetHeight - 40, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
    });
    gsap.fromTo(card.current, { rotationY: 0, rotationZ: -8 }, {
      rotationY: 900, rotationZ: 10, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1.4 },
    });
    gsap.to(card.current, { y: -14, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    // fade while overlapping a light section ([data-card-dim]) so dark text stays readable
    // note: gsap.utils.toArray is scoped by the active context, so query the document explicitly
    const dims = Array.from(document.querySelectorAll<HTMLElement>("[data-card-dim]"));
    if (dims.length) {
      const fade = gsap.quickTo(w, "opacity", { duration: 0.45, ease: "power2" });
      ScrollTrigger.create({
        onUpdate: () => {
          const r = w.getBoundingClientRect();
          const over = dims.some((sec) => { const s = sec.getBoundingClientRect(); return s.top < r.bottom && s.bottom > r.top; });
          fade(over ? 0.2 : 1);
        },
      });
    }

    if (finePointer()) {
      gsap.set(tilt.current, { transformPerspective: 1400 });
      const rx = gsap.quickTo(tilt.current, "rotationX", { duration: 1.2, ease: "power2" });
      const ry = gsap.quickTo(tilt.current, "rotationY", { duration: 1.2, ease: "power2" });
      const tx = gsap.quickTo(tilt.current, "x", { duration: 1.6, ease: "power2" });
      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
        ry(nx * 30); rx(-ny * 24); tx(nx * -40);
      };
      window.addEventListener("pointermove", move, { passive: true });
      return () => window.removeEventListener("pointermove", move);
    }
  }, { scope: wrap });

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed top-0 z-[1] card-ratio w-[30vw] max-w-[190px] sm:max-w-[230px] md:w-[17vw] md:max-w-[290px] xl:max-w-[320px]",
        side === "right" ? "right-[5vw]" : "left-[5vw]",
        className,
      )}
    >
      <div ref={tilt} className="size-full will-change-transform">
        <div ref={card} className="card3d relative size-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.65)]">
          <div className="face front">
            <Image src={front.src} alt={front.alt} width={540} height={840} sizes="(max-width: 768px) 30vw, 17vw" priority className="size-full object-cover" />
          </div>
          <div className="face back">
            <Image src={back.src} alt={back.alt} width={540} height={840} sizes="(max-width: 768px) 30vw, 17vw" className="size-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
