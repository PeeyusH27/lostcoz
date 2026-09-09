"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
gsap.defaults({ ease: "expo.out", duration: 0.9 });
ScrollTrigger.config({ ignoreMobileResize: true });

/** True when the visitor prefers reduced motion — animations should be skipped (content stays visible). */
export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True on devices with a precise pointer (mouse / trackpad). Cursor & tilt effects only make sense there. */
export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };
