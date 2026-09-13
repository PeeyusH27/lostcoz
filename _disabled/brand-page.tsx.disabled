import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { Swatch } from "@/components/brand/Swatch";
import MotionDemo from "@/components/brand/MotionDemo";
import { flatten, group, sub, T } from "@/components/brand/tokens-util";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Brand & design tokens", description: "The Lostcoz design system: logo, colour, type, spacing, motion — every token, live." };

const scales = ["ink", "cream", "purple", "orange", "magenta", "cyan"];
const steps = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

export default function BrandPage() {
  const brand = flatten(sub("color", "brand"), ["color", "brand"]);
  const semantic = ["canvas", "canvas-deep", "surface", "fg", "line", "accent", "state", "focus"].flatMap((k) => flatten(sub("color", k), ["color", k]));
  const dharma = flatten(sub("color", "dharma"), ["color", "dharma"]);
  const type = flatten(group("text"), ["text"]);
  const gradients = flatten(group("gradient"), ["gradient"]);
  const shadows = flatten(group("shadow"), ["shadow"]);
  const radii = flatten(group("radius"), ["radius"]);
  const spacing = [...flatten(group("spacing"), ["spacing"]), ...flatten(group("container"), ["container"])];
  const durations = flatten(group("duration"), ["duration"]);
  const fonts = flatten(group("font"), ["font"]).filter((f) => !f.path.includes("weight"));
  const count = flatten(T).length;
  const version = String(T.$version ?? "");

  return (
    <>
      <Section className="pt-40">
        <SectionHeading eyebrow={`Design tokens · v${version} · ${count} tokens`} title="The Lostcoz system." lead="Everything on this site is drawn from one token file, derived from the logo: four players, four colours, one lamp. Tokens ship as W3C DTCG JSON and compile to Tailwind v4 theme variables." />
        <Reveal y={20} className="mt-10 flex flex-wrap gap-4">
          <Button href="/tokens/lostcoz.tokens.json" download>Download tokens.json</Button>
          <Button href="/" variant="ghost">Back to site</Button>
        </Reveal>
      </Section>

      {/* Logo */}
      <Section className="pt-0">
        <SectionHeading size="lg" eyebrow="01 · Logo" title="Four players, one lamp." />
        <Reveal stagger={0.1} y={40} className="mt-12 grid gap-6 md:grid-cols-2">
          <figure className="rounded-2xl bg-brand-black p-10 hairline"><Image src="/brand/logo-full.png" alt="Lostcoz logo on black" width={2000} height={1532} sizes="(max-width: 768px) 90vw, 45vw" /><figcaption className="mt-4 eyebrow">Primary · on black</figcaption></figure>
          <figure className="rounded-2xl bg-white p-10 hairline"><Image src="/brand/logo-full.png" alt="Lostcoz logo on white" width={2000} height={1532} sizes="(max-width: 768px) 90vw, 45vw" /><figcaption className="mt-4 eyebrow text-ink-500">Primary · on white</figcaption></figure>
          <figure className="rounded-2xl bg-surface-1 p-10 hairline"><Image src="/brand/logo-wordmark.png" alt="Lostcoz wordmark" width={2000} height={360} sizes="(max-width: 768px) 90vw, 45vw" /><figcaption className="mt-4 eyebrow">Wordmark · navigation, footer</figcaption></figure>
          <figure className="rounded-2xl bg-surface-1 p-10 hairline"><Image src="/brand/logo-emblem.png" alt="Lostcoz emblem" width={1600} height={1034} sizes="(max-width: 768px) 90vw, 45vw" className="mx-auto max-h-64 w-auto" /><figcaption className="mt-4 eyebrow">Emblem · favicon, social, merch</figcaption></figure>
        </Reveal>
        <Reveal y={20} className="mt-8 grid gap-4 text-fg-muted md:grid-cols-3">
          <p><strong className="text-fg">Clear space.</strong> Keep at least the height of the “L” free around the wordmark.</p>
          <p><strong className="text-fg">Backgrounds.</strong> Black first. Cream for print. Never on a busy photo without the lamp glow behind it.</p>
          <p><strong className="text-fg">Don’t.</strong> Recolour the arc, outline the wordmark, or separate the players from the lamp.</p>
        </Reveal>
      </Section>

      {/* Colour */}
      <Section className="pt-0">
        <SectionHeading size="lg" eyebrow="02 · Colour" title="Neon on black." lead="The brand palette is sampled directly from the logo. Scales are generated in OKLCH so every step keeps its hue; semantic tokens map the palette to jobs." />
        <Reveal stagger={0.05} y={30} className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-7">
          {brand.map((t) => <Swatch key={t.name} large {...t} />)}
        </Reveal>
        <div className="mt-16 space-y-8">
          {scales.map((s) => (
            <Reveal key={s} y={20}>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-fg-muted">{s}</p>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
                {steps.map((st) => (
                  <div key={st} className="group" data-cursor="link">
                    <div className="h-14 rounded-md transition-transform duration-500 ease-out-expo group-hover:-translate-y-1" style={{ background: `var(--color-${s}-${st})` }} />
                    <p className="mt-1 font-mono text-[0.62rem] text-fg-subtle">{st}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal y={20} className="mt-16">
          <p className="mb-4 eyebrow">Semantic</p>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-6">{semantic.map((t) => <Swatch key={t.name} {...t} />)}</div>
        </Reveal>
        <Reveal y={20} className="mt-16">
          <p className="mb-4 eyebrow">Order of Dharma sub-theme</p>
          <div className="theme-dharma rounded-2xl p-6 hairline">
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-6 lg:grid-cols-9">{dharma.map((t) => <Swatch key={t.name} {...t} />)}</div>
          </div>
        </Reveal>
        <Reveal y={20} className="mt-16">
          <p className="mb-4 eyebrow">Gradients</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gradients.map((g) => (
              <div key={g.name} className="rounded-xl p-4 hairline" data-cursor="link">
                <div className="h-24 rounded-lg bg-canvas-deep" style={{ background: `var(${g.name})` }} />
                <p className="mt-3 font-mono text-xs">{g.name}</p><p className="text-caption text-fg-muted">{g.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Type */}
      <Section className="pt-0">
        <SectionHeading size="lg" eyebrow="03 · Typography" title="Big, wide, loud." lead="Unbounded carries the headlines, Manrope the body. Order of Dharma switches to Cinzel and EB Garamond through the same tokens." />
        <Reveal stagger={0.08} y={30} className="mt-12 grid gap-5 md:grid-cols-2">
          {fonts.map((f) => (
            <div key={f.name} className="rounded-2xl bg-surface-1 p-8 hairline">
              <p className="text-display-md" style={{ fontFamily: `var(${f.name})` }}>Aa Bb Cc 0123</p>
              <p className="mt-4 font-mono text-xs">{f.name}</p>
              <p className="text-caption text-fg-muted">{f.description}</p>
            </div>
          ))}
        </Reveal>
        <div className="mt-14 divide-y divide-line">
          {type.filter((t) => !t.name.includes("--")).map((t) => (
            <Reveal key={t.name} y={16} className="grid items-baseline gap-2 py-6 md:grid-cols-[14rem_1fr]">
              <div><p className="font-mono text-xs">{t.name}</p><p className="font-mono text-[0.65rem] text-fg-subtle">{t.value}</p></div>
              <p className={cn("truncate", t.name.includes("display") ? "font-display uppercase" : t.name.includes("rule") ? "font-dharma-body" : "font-body")} style={{ fontSize: `var(${t.name})`, lineHeight: `var(${t.name}--line-height)`, letterSpacing: `var(${t.name}--letter-spacing)`, fontWeight: `var(${t.name}--font-weight)` }}>
                {t.name.includes("eyebrow") ? "GAME NIGHT · FRIDAY" : "Get lost. Find your people."}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Space, radius, shadow */}
      <Section className="pt-0">
        <SectionHeading size="lg" eyebrow="04 · Space, shape, depth" title="Rhythm and edges." />
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <Reveal y={20}>
            <p className="mb-4 eyebrow">Spacing & containers</p>
            <ul className="space-y-3">{spacing.map((s) => <li key={s.name} className="grid grid-cols-[1fr_auto] gap-3 border-b border-line pb-3"><span className="font-mono text-xs">{s.name}</span><span className="text-right font-mono text-[0.65rem] text-fg-muted">{s.value}</span></li>)}</ul>
          </Reveal>
          <Reveal y={20}>
            <p className="mb-4 eyebrow">Radius</p>
            <div className="grid grid-cols-4 gap-4">{radii.filter((r) => !r.path.includes("card")).map((r) => <div key={r.name}><div className="aspect-square bg-surface-2 hairline" style={{ borderRadius: `var(${r.name})` }} /><p className="mt-2 font-mono text-[0.65rem]">{r.path[1]} · {r.value}</p></div>)}</div>
            <div className="mt-6 flex items-end gap-4"><div className="card-ratio w-24 rounded-card bg-surface-2 hairline" /><p className="font-mono text-[0.65rem] text-fg-muted">--radius-card<br />{radii.find((r) => r.path[1] === "card")?.value}<br />9 : 14 playing card</p></div>
          </Reveal>
          <Reveal y={20}>
            <p className="mb-4 eyebrow">Shadows & glows</p>
            <div className="grid grid-cols-2 gap-6 pt-2">{shadows.map((s) => <div key={s.name}><div className="h-20 rounded-xl bg-surface-1" style={{ boxShadow: `var(${s.name})` }} /><p className="mt-3 font-mono text-[0.65rem]">{s.name}</p></div>)}</div>
          </Reveal>
        </div>
      </Section>

      {/* Motion */}
      <Section className="pt-0">
        <SectionHeading size="lg" eyebrow="05 · Motion" title="Everything moves, nothing fidgets." lead="Six durations, six easings. Scroll animations scrub on linear; entrances use out-expo; anything playful overshoots with out-back. Reduced-motion users get the finished state instantly." />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <Reveal y={20}>
            <p className="mb-4 eyebrow">Durations</p>
            <ul className="space-y-3">{durations.map((d) => <li key={d.name} className="grid grid-cols-[6rem_1fr] items-center gap-4"><span className="font-mono text-xs">{d.path[1]}</span><span className="relative h-2 rounded-pill bg-surface-2"><span className="absolute inset-y-0 left-0 rounded-pill bg-brand-cyan" style={{ width: `${Math.min(100, parseInt(d.value) / 12)}%` }} /></span><span className="col-span-2 -mt-2 text-caption text-fg-muted">{d.value} — {d.description}</span></li>)}</ul>
          </Reveal>
          <Reveal y={20}><p className="mb-4 eyebrow">Easings</p><MotionDemo /></Reveal>
        </div>
      </Section>

      {/* Components */}
      <Section className="pt-0">
        <SectionHeading size="lg" eyebrow="06 · Components" title="Built from the tokens." />
        <Reveal y={20} className="mt-12 flex flex-wrap items-center gap-4">
          <Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="inverse" arrow={false}>Inverse</Button>
          <span className="rounded-pill border border-line px-4 py-2 font-body text-caption uppercase tracking-widest text-fg-muted">Chip</span>
          <span className="eyebrow">Eyebrow label</span>
        </Reveal>
        <Reveal y={20} className="mt-10 rounded-2xl bg-surface-1 p-8 hairline">
          <p className="eyebrow mb-4">Usage</p>
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-fg-muted"><code>{`// Tailwind v4 utilities are generated from every token
<h1 className="font-display text-display-2xl uppercase text-gradient-arc">Get lost.</h1>
<button className="bg-accent text-fg-on-accent rounded-pill shadow-glow-orange ease-out-expo">Book a seat</button>

// or use the CSS variables directly (GSAP, inline styles)
gsap.to(el, { duration: 0.5, ease: "expo.out" })      // --duration-lg / --ease-out-expo
el.style.background = "var(--gradient-lamp)"

// regenerate after editing tokens/lostcoz.tokens.json
npm run tokens          // JSON -> src/styles/tokens.css
npm run tokens:scales   // also rebuild the OKLCH colour scales`}</code></pre>
        </Reveal>
      </Section>
    </>
  );
}
