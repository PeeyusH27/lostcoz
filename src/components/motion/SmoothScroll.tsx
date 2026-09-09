"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

declare global {
  interface Window { __lenis?: Lenis }
}

/**
 * Lenis smooth scrolling synced to GSAP's ticker + ScrollTrigger.
 * Also resets scroll and refreshes ScrollTrigger on route changes, and
 * drives the scroll-velocity skew on any element carrying `data-skew`.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: { offset: -80 } });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // route change: back to top, re-measure triggers, re-bind skew targets
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    if (reducedMotion()) return;
    const proxy = { skew: 0 };
    const clamp = gsap.utils.clamp(-10, 10);
    let setter: ((v: number) => void) | null = null;
    const bind = () => {
      const targets = document.querySelectorAll<HTMLElement>("[data-skew]");
      setter = targets.length ? gsap.quickSetter(targets, "skewY", "deg") as (v: number) => void : null;
    };
    const timer = window.setTimeout(() => { bind(); ScrollTrigger.refresh(); }, 400);
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        if (!setter) return;
        const skew = clamp(self.getVelocity() / -350);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, { skew: 0, duration: 0.7, ease: "power3", overwrite: true, onUpdate: () => setter?.(proxy.skew) });
        }
      },
    });
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => { window.clearTimeout(timer); st.kill(); window.removeEventListener("load", onLoad); };
  }, [pathname]);

  return <>{children}</>;
}
