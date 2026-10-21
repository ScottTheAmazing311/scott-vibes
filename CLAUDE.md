# scott-vibes — scottvibes.com

Scott Knudson's personal site. Next.js 16 (App Router), Tailwind v4, deployed from
`main` (every push to main goes live). Treat `main` as production.

## Map

- `src/lib/content.ts` — ALL site copy, links, images, and section data, including
  Sunday School lessons (`sundayLessons`). Edit this first for content changes.
- `src/lib/kidzone.ts` — Kid Zone registry + game data (trivia questions, flash card
  decks, piano songs). Adding content = editing this data.
- `src/app/(site)/` — the portfolio site (editorial look: Archivo/Newsreader/Space
  Grotesk, ivory/charcoal/acid tokens in `globals.css`).
- `src/app/kidzone/` — UNLISTED family games hub (own playful layout, Baloo 2,
  noindexed; not linked from the site). Games are client components in
  `src/components/kidzone/`. To add a game: registry entry in `kidzone.ts` +
  route folder + component.
- `src/app/(site)/theology/lessons/[slug]/` — per-lesson pages. A lesson renders a
  Google Slides embed (`slidesId`), a self-hosted image deck (`deck: {dir, count}`,
  images at `public/<dir>/slide-NN.jpg`), audio, songs, and links — all optional
  fields on the `sundayLessons` entry.
- `sites/relay/` — legacy copy of the Relay brand site; canonical home is the
  separate `relay` repo. Don't develop here.

## Conventions

- Self-hosted lesson decks are rendered from PowerPoint via LibreOffice → PDF →
  JPEG (1600px wide, quality 85), see the Isaiah lesson (31 slides) as the model.
- Kid Zone style ("modern toy", replaced the old hard-shadow look in Oct 2026):
  tokens live in `src/app/kidzone/kidzone.css` (ground #f3efe6, ink #323b52,
  accents marigold/brick/leaf/cobalt with -soft tints, 20px radius, soft
  shadows). Use the shared classes (.kz-panel, .kz-tile, .kz-btn, .kz-chip),
  the geometric `Mark` component instead of icons or emoji, and Bricolage
  Grotesque (set in the layout). Keep new games consistent.
- No em-dash-heavy copy; match the site's existing voice.
- Placeholder images on portfolio pages come from picsum.photos (grayscale).

## History / branch note

Development has happened on `claude/ultracosmic-repo-access-qe4eji` with
individual commits cherry-picked to `main` (the branch also carries retired
Relay-site commits that must NOT go to main). When working fresh, branch from
`main` and ignore that old working branch.
