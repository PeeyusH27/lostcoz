"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { site } from "@/data/site";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function Nav() {
  const header = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // hide on scroll down, show on scroll up, glass once scrolled
  useGSAP(() => {
    if (reducedMotion() || !header.current) return;
    const el = header.current;
    const yTo = gsap.quickTo(el, "yPercent", { duration: 0.5, ease: "power3" });
    ScrollTrigger.create({
      start: "top -100", end: "max",
      onUpdate: (self) => { yTo(self.direction === 1 && !open ? -100 : 0); el.classList.add("is-scrolled"); },
      onLeaveBack: () => { yTo(0); el.classList.remove("is-scrolled"); },
    });
  }, { scope: header, dependencies: [open] });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) window.__lenis?.stop(); else window.__lenis?.start();
  }, [open]);

  useGSAP(() => {
    if (!overlay.current) return;
    const links = overlay.current.querySelectorAll("[data-menu-link]");
    if (open) {
      gsap.timeline()
        .to(overlay.current, { autoAlpha: 1, duration: 0.4, ease: "power2.out" })
        .from(links, { yPercent: 100, opacity: 0, stagger: 0.07, duration: 0.8, ease: "expo.out" }, "-=0.2");
    } else {
      gsap.to(overlay.current, { autoAlpha: 0, duration: 0.3 });
    }
  }, { dependencies: [open] });

  const isDharma = pathname.startsWith("/order-of-dharma");

  return (
    <>
      <header
        ref={header}
        className={cn(
          "fixed inset-x-0 top-0 transition-[background-color,backdrop-filter,border-color] duration-500",
          open ? "z-[90]" : "z-(--z-nav)",
          "border-b border-transparent [&.is-scrolled]:glass [&.is-scrolled]:border-line",
          isDharma && "theme-dharma bg-transparent",
        )}
        style={isDharma ? { background: "transparent" } : undefined}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-wide items-center justify-between px-gutter">
          <Link href="/" aria-label="Lostcoz — home" data-cursor="link" className="relative z-[2] block">
            <Image src="/brand/logo-wordmark-800.png" alt="Lostcoz" width={800} height={144} priority className="h-6 w-auto md:h-7" />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {site.nav.map((l) => {
              const active = pathname === l.href;
              return (
                <Link key={l.href} href={l.href} className={cn("group relative font-body text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-fg-muted transition-colors hover:text-fg", active && "text-fg")}>
                  {l.label}
                  <span className={cn("absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-x-100", active && "scale-x-100")} />
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden md:block"><Button href={site.cta.href} size="sm" magnetic={false}>{site.cta.label}</Button></div>
            <button
              type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu"
              className="relative grid size-11 place-items-center rounded-pill border border-line-strong text-fg md:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span className={cn("absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform duration-300", open && "translate-y-[5px] rotate-45")} />
                <span className={cn("absolute left-0 bottom-0 h-0.5 w-5 bg-current transition-transform duration-300", open && "-translate-y-[5px] -rotate-45")} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu" ref={overlay} aria-hidden={!open}
        className={cn("invisible fixed inset-0 z-(--z-modal) flex flex-col justify-end bg-canvas-deep px-gutter pb-16 pt-28 opacity-0 grain", !open && "pointer-events-none")}
      >
        <div className="absolute inset-0 -z-10 lamp-glow" aria-hidden="true" />
        <nav aria-label="Mobile" className="flex flex-col gap-2">
          {[{ label: "Home", href: "/" }, ...site.nav].map((l) => (
            <div key={l.href} className="overflow-hidden">
              <Link data-menu-link href={l.href} className="block font-display text-display-lg uppercase leading-none text-fg" onClick={() => setOpen(false)}>{l.label}</Link>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href={site.cta.href} magnetic={false}>{site.cta.label}</Button>
          {site.socials.map((s) => <a key={s.label} href={s.href} className="eyebrow hover:text-fg" target="_blank" rel="noreferrer">{s.label}</a>)}
        </div>
      </div>
    </>
  );
}
