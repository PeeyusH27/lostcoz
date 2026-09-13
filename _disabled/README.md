# Disabled pages

Source kept out of `src/app/` so Next.js does not build or serve it.

## brand-page.tsx.disabled

The internal **Brand & design tokens** reference page (colour ramps, type scale,
motion demos). Disabled on request; its footer link was removed from
`src/data/site.ts` at the same time.

To restore:

```sh
mkdir -p src/app/brand
mv _disabled/brand-page.tsx.disabled src/app/brand/page.tsx
```

then add this back to `site.footer.explore` in `src/data/site.ts`:

```ts
{ label: "Brand & tokens", href: "/brand" },
```

The components it uses (`src/components/brand/`) were left in place and are
otherwise unused.

## original-photos/

Full-resolution originals of the real Lostcoz photos. Kept out of `public/` so the
12 MB source JPG is never shipped to a browser; the optimised versions live at
`public/photos/lostcoz-gamenight.jpg` and `public/photos/lostcoz-team.jpg`.

| original | used as | notes |
|---|---|---|
| `IMG20260823132320.jpg` (4096×3072, 12 MB) | `lostcoz-gamenight.jpg` (2400×1800, 1.2 MB) | resized + recompressed |
| `7D92BBAB-….png` (1254×1254) | `lostcoz-team.jpg` (1254×760, 205 KB) | cropped to the faces so the tile label does not sit over the wordmark |
