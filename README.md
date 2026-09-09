# Lostcoz — website

Marketing site for **Lostcoz** (card games & community nights for adults) with a dedicated page for the first title, **Order of Dharma**, and a live brand / design-token reference.

Built with Next.js 16 (App Router), React 19, Tailwind v4, GSAP 3.15 (ScrollTrigger, SplitText) and Lenis smooth scrolling.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Pages

| Route | What |
| --- | --- |
| `/` | Home — hero with the travelling card, marquee, manifesto, featured game, pinned horizontal events, how-it-works, community grid, join CTA |
| `/order-of-dharma` | Game page — hero, clans (scroll-flip), six phases (sticky card), full rulebook, every card with flip, card backs, CTA |
| `/brand` | Design tokens, live: logo, colour scales, type, spacing, motion, components. Downloads `tokens.json` |

## Design tokens

`tokens/lostcoz.tokens.json` is the single source of truth (W3C DTCG format).

```bash
npm run tokens          # -> src/styles/tokens.css  (Tailwind v4 @theme static) + public/tokens/
npm run tokens:scales   # regenerate the OKLCH colour scales from the brand hues, then build
```

Every token is a CSS variable **and** a Tailwind utility: `bg-accent`, `text-display-2xl`, `font-display`, `rounded-card`, `shadow-glow-purple`, `ease-out-expo`, `py-section`, `px-gutter` …
The Order of Dharma page wraps its content in `.theme-dharma`, which re-maps the semantic tokens (canvas, fg, accent, fonts) to the emerald / gold / parchment palette — components don't change.

## Content

* `src/data/site.ts` — all Lostcoz copy, links and event formats (`TODO` marks placeholders: e-mail, Instagram, WhatsApp, booking link).
* `src/data/dharma.ts` — rules (transcribed from the v1.7 rulebook), phases, cards, facts.

## Assets

* `public/brand/` — logo (full, wordmark, emblem) cut from the v1.5 artwork.
* `public/cards/backs/` — the three card backs and the Phases face, trimmed at the print crop marks (1080×1680, plus 540 px versions).
* `public/cards/faces/` — card faces extracted from the rulebook document and de-rotated. These are the only source available (≈210–245 px wide); replace with print-resolution exports for crisper cards.
* `public/downloads/order-of-dharma-rulebook.pdf` — the full rulebook (41 MB — consider an optimised export).
* `design-source/` — copies of the original PDFs, logo PNGs and rules DOCX.

## Motion primitives (`src/components/motion`)

`SmoothScroll` (Lenis + ScrollTrigger + velocity skew on `[data-skew]`), `Cursor` (dot + ring, `data-cursor="link|text|hide"`, `data-cursor-text`), `Magnetic`, `Tilt`, `Reveal`, `SplitReveal` (lines / chars / words / words-scrub), `Parallax`, `Marquee`, `TravelingCard` (the fixed hero card that glides from the top to the bottom of the viewport across the whole page and flips on the way).

All animations are skipped when `prefers-reduced-motion` is set; pointer effects only run on fine pointers.
