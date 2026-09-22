# Disabled assets

Source kept out of `src/app/` and `public/` so Next.js does not build or ship it.

> The **Brand & design tokens** page that used to live here is back at
> `src/app/brand/page.tsx`. It builds and serves at `/brand`, but is intentionally
> unlinked — no nav, footer or sitemap entry, and `robots: noindex` in its
> metadata. Reach it by typing the URL. To surface it again, add
> `{ label: "Brand & tokens", href: "/brand" }` to `site.footer.explore` in
> `src/data/site.ts` and drop the `robots` key.

## original-photos/

Full-resolution originals of the real Lostcoz photos. Kept out of `public/` so the
12 MB source JPG is never shipped to a browser; the optimised versions live at
`public/photos/lostcoz-gamenight.jpg` and `public/photos/lostcoz-team.jpg`.

| original | used as | notes |
|---|---|---|
| `IMG20260823132320.jpg` (4096×3072, 12 MB) | `lostcoz-gamenight.jpg` (2400×1800, 1.2 MB) | resized + recompressed |
| `7D92BBAB-….png` (1254×1254) | `lostcoz-team.jpg` (1254×760, 205 KB) | cropped to the faces so the tile label does not sit over the wordmark |
