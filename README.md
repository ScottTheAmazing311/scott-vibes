# scottvibes.com

Personal portfolio for Scott Knudson. Next.js 16 (App Router), Tailwind v4, no animation libraries: reveals use IntersectionObserver plus CSS, parallax uses CSS scroll-driven animations where supported.

## Run

```bash
npm install
npm run dev
```

## Where things live

- `src/lib/content.ts` - all copy, links, images, and section data. Edit this first.
  Wrap a phrase in `*asterisks*` inside a headline to set it in the italic serif.
- `src/app/page.tsx` - home page (hero, positioning, five work spreads, about, capabilities, process, proof, notes, contact).
- `src/components/HubPage.tsx` - shared template for the five hubs: `/theology`, `/photography`, `/creative`, `/professional`, `/other`.
- `src/app/globals.css` - design tokens, type scale, reveal and parallax utilities, reduced-motion overrides.
- `src/app/studio` and `src/sanity` - Sanity Studio and schemas (not yet wired to the pages).

Old routes (`/coded-creations`, `/writing`, `/work`, `/potpourri`) redirect to the new hubs in `next.config.ts`.

## Images

Placeholders come from `picsum.photos` in grayscale. Replace each `image.src` in `content.ts` with a real asset and, if hosting elsewhere, add the host to `images.remotePatterns` in `next.config.ts`.
