"use client";
import { useRef, type ElementType } from "react";
import { gsap, useGSAP, SplitText, reducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  /** "lines" slides masked lines up; "chars" pops characters; "words-scrub" brightens words as you scroll */
  mode?: "lines" | "chars" | "words" | "words-scrub";
  delay?: number;
  /** play immediately on mount (hero) instead of on scroll */
  immediate?: boolean;
  stagger?: number;
};

/** SplitText-powered text reveals. Falls back to static text when motion is reduced. */
export default function SplitReveal({
  children, as: Tag = "div", className, mode = "lines", delay = 0, immediate = false, stagger,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reducedMotion() || !ref.current) return;
    const el = ref.current;
    const trigger = immediate ? undefined : { trigger: el, start: "top 85%", once: true };

    if (mode === "words-scrub") {
      SplitText.create(el, {
        type: "words", autoSplit: true, wordsClass: "split-word",
        onSplit: (self) => gsap.fromTo(self.words, { opacity: 0.14 }, {
          opacity: 1, ease: "none", stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 45%", scrub: 0.4 },
        }),
      });
      return;
    }
    if (mode === "chars") {
      SplitText.create(el, {
        type: "chars,words", autoSplit: true, wordsClass: "split-word", charsClass: "split-char",
        onSplit: (self) => gsap.from(self.chars, {
          yPercent: 120, opacity: 0, rotation: 6, transformOrigin: "0% 100%", force3D: false,
          duration: 1, ease: "expo.out", stagger: stagger ?? 0.03, delay, scrollTrigger: trigger,
        }),
      });
      return;
    }
    if (mode === "words") {
      SplitText.create(el, {
        type: "words", autoSplit: true, wordsClass: "split-word",
        onSplit: (self) => gsap.from(self.words, {
          y: 30, opacity: 0, duration: 0.9, ease: "expo.out", stagger: stagger ?? 0.05, delay, scrollTrigger: trigger,
        }),
      });
      return;
    }
    SplitText.create(el, {
      type: "lines,words", mask: "lines", autoSplit: true, linesClass: "split-line", wordsClass: "split-word",
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 110, duration: 1.2, ease: "expo.out", stagger: stagger ?? 0.09, delay, force3D: false, scrollTrigger: trigger,
      }),
    });
  }, { scope: ref });

  return <Tag ref={ref} className={cn(className)}>{children}</Tag>;
}
