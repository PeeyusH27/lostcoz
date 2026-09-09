"use client";
import { useState } from "react";
import Image from "next/image";
import Tilt from "@/components/motion/Tilt";
import { cn } from "@/lib/cn";
import type { Img } from "@/data/dharma";

/** A playing card: 3D tilt on hover, flips on click / Enter to show its back. */
export default function GameCard({
  face, back, alt, sizes = "(max-width: 640px) 45vw, 240px", className, flippable = true, priority = false, max = 10,
}: { face: Img; back?: Img; alt: string; sizes?: string; className?: string; flippable?: boolean; priority?: boolean; max?: number }) {
  const [flipped, setFlipped] = useState(false);
  const Inner = flippable ? "button" : "div";
  return (
    <Tilt max={max} className={cn("card-ratio rounded-card", className)}>
      <Inner
        {...(flippable ? { type: "button", onClick: () => setFlipped((f) => !f), "aria-pressed": flipped } : {})}
        aria-label={flippable ? `${alt} — click to flip` : undefined}
        data-cursor="text" data-cursor-text={flippable ? "Flip" : "View"}
        className="card3d relative block size-full rounded-card transition-transform duration-[1000ms] ease-in-out-quart shadow-card"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div className="face front bg-dharma-night">
          <Image src={face.src} width={face.w} height={face.h} alt={alt} sizes={sizes} priority={priority} className="size-full object-cover" draggable={false} />
        </div>
        {back && (
          <div className="face back bg-dharma-night">
            <Image src={back.src} width={back.w} height={back.h} alt="" sizes={sizes} className="size-full object-cover" draggable={false} />
          </div>
        )}
      </Inner>
    </Tilt>
  );
}
