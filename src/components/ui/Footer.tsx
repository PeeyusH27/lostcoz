import Link from "next/link";
import Image from "next/image";
import Section from "@/components/ui/Section";
import Reveal from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <Section as="footer" className="overflow-hidden bg-canvas-deep pb-10 pt-section" inner="max-w-wide">
      <div className="grid gap-12 border-t border-line pt-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-display-sm uppercase text-fg">{site.tagline}</p>
          <p className="mt-4 max-w-prose text-fg-muted">{site.footer.line}</p>
        </div>
        <div>
          <p className="eyebrow mb-5">Explore</p>
          <ul className="space-y-3">
            {site.footer.explore.map((l) => (
              <li key={l.href}><Link href={l.href} className="font-semibold text-fg-muted transition-colors hover:text-brand-orange">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Connect</p>
          <ul className="space-y-3">
            {site.socials.map((s) => (
              <li key={s.label}><a href={s.href} target="_blank" rel="noreferrer" className="font-semibold text-fg-muted transition-colors hover:text-brand-cyan">{s.label}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <Parallax speed={0.25} className="mt-20">
        <Reveal y={60} scrub>
          <Image src="/brand/logo-wordmark.png" alt="Lostcoz" width={2000} height={360} sizes="100vw" className="w-full" data-skew />
        </Reveal>
      </Parallax>

      <div className="mt-10 flex flex-col gap-3 text-caption text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <p>Order of Dharma™ is a Lostcoz original.</p>
      </div>
    </Section>
  );
}
