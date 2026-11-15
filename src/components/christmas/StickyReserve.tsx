"use client";

import { useEffect, useState } from "react";
import { CHRISTMAS } from "@/data/christmas";

/** Phone-only bottom bar: a one-tap route to the form until the form is on screen. */
export default function StickyReserve() {
  const [pastHero, setPastHero] = useState(false);
  const [inForm, setInForm] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const target = document.getElementById("register");
    const io = target ? new IntersectionObserver(([e]) => setInForm(e.isIntersecting), { threshold: 0.05 }) : null;
    if (target) io?.observe(target);
    return () => { window.removeEventListener("scroll", onScroll); io?.disconnect(); };
  }, []);

  const show = pastHero && !inForm;
  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-3 bottom-3 z-[60] transition-all duration-500 md:hidden ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
    >
      <a
        href="#register" tabIndex={show ? 0 : -1}
        className="flex h-14 items-center justify-between rounded-full bg-[#b3203a] px-6 text-sm font-bold uppercase tracking-[0.12em] text-[#fff6e6] shadow-[0_14px_40px_-8px_rgb(0_0_0/0.8)] ring-1 ring-[#f6c96b]/60"
      >
        <span>Reserve your spot</span>
        <span className="font-display text-[#f6c96b]">₹{CHRISTMAS.price.toLocaleString("en-IN")} →</span>
      </a>
    </div>
  );
}
