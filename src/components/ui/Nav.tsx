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
          "fixed inset-x-0 top-0 border-b transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500",
          open ? "z-[90]" : "z-(--z-nav)",
          // Always frosted. At the top the pane is barely there so the hero reads
          // through it; once scrolled it firms up and gains an edge + lift.
          "nav-glass border-transparent",
          "[&.is-scrolled]:border-line [&.is-scrolled]:shadow-[0_12px_32px_-20px_rgb(0_0_0/0.9)]",
          isDharma && "theme-dharma",
        )}
      >
        {/* specular highlight along the bottom edge — the cue that reads as glass */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-line-strong),transparent)] opacity-0 transition-opacity duration-500 [.is-scrolled_&]:opacity-100"
        />
        <div className="mx-auto flex h-[calc(4.5rem+env(safe-area-inset-top))] max-w-wide items-center justify-between px-gutter pt-[env(safe-area-inset-top)]">
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
            {/* Pay CTA hidden for now — the /pay route still works if you link it directly.
                <div className="hidden md:block"><Button href="/pay" variant="ghost" size="sm" magnetic={false}>Pay</Button></div> */}
            <div className="hidden md:block"><Button href={site.cta.href} size="sm" magnetic={false}>{site.cta.label}</Button></div>
            <button
              type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu"
              className="glass-panel relative grid size-12 place-items-center rounded-pill text-fg transition-colors duration-300 active:bg-fg/10 md:hidden"
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
        className={cn(
          "invisible fixed inset-0 z-(--z-modal) flex flex-col justify-end overflow-y-auto bg-canvas-deep/85 px-gutter opacity-0 backdrop-blur-2xl backdrop-saturate-150 grain",
          "pb-[calc(env(safe-area-inset-bottom)+3rem)] pt-[calc(env(safe-area-inset-top)+6.5rem)]",
          !open && "pointer-events-none",
        )}
      >
        <div className="absolute inset-0 -z-10 lamp-glow" aria-hidden="true" />
        <nav aria-label="Mobile" className="flex flex-col gap-2">
          {[{ label: "Home", href: "/" }, ...site.nav].map((l) => (
            <div key={l.href} className="overflow-hidden">
              <Link data-menu-link href={l.href} className="block py-2 font-display text-[clamp(2rem,11vw,4rem)] uppercase leading-[1.05] text-fg" onClick={() => setOpen(false)}>{l.label}</Link>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href={site.cta.href} magnetic={false}>{site.cta.label}</Button>
          {/* <Button href="/pay" variant="ghost" magnetic={false}>Pay</Button> */}
          {site.socials.map((s) => {
            const external = s.href.startsWith("http");
            return (
              <a
                key={s.label} href={s.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className="eyebrow inline-flex min-h-11 items-center hover:text-fg"
              >
                {s.label}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
