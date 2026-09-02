import Image from "next/image";
import type { SanityPhoto } from "@/sanity/lib/photos";

/**
 * Auto-scrolling film strip of photographs (from the bs-hero-film-strip block,
 * ported to the site's CSS-only motion): duplicated track, edge fade, pauses
 * on hover, static and scrollable under reduced motion.
 */
export default function FilmStrip({ photos }: { photos: SanityPhoto[] }) {
  if (photos.length < 4) return null;
  const frames = [...photos, ...photos];
  return (
    <div className="marquee marquee-fade" aria-label="Photograph film strip">
      <div className="marquee-track flex w-max gap-4 py-6" style={{ ["--marquee-dur" as string]: `${photos.length * 5}s` }}>
        {frames.map((p, i) => (
          <div
            key={`${p._id}-${i}`}
            className="relative aspect-[3/4] h-44 shrink-0 md:h-56"
            style={{ rotate: i % 2 === 0 ? "-1.5deg" : "1.5deg" }}
            aria-hidden={i >= photos.length}
          >
            <Image
              src={p.url}
              alt={i < photos.length ? p.title || p.series || "Photograph" : ""}
              fill
              sizes="220px"
              className="object-cover shadow-[0_10px_24px_rgba(23,27,25,0.18)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
