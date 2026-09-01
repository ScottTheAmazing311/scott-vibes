import Image from "next/image";
import Link from "next/link";
import type { Domain } from "@/lib/content";
import { groupBySeries, type SanityPhoto } from "@/sanity/lib/photos";
import Lines from "./Lines";
import PillButton from "./PillButton";
import Reveal from "./Reveal";

const seriesSlug = (series: string) => `series-${series.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/** Shared editorial template for the five section hubs. */
export default function HubPage({ domain, gallery }: { domain: Domain; gallery?: SanityPhoto[] }) {
  const seriesGroups = gallery && gallery.length > 0 ? groupBySeries(gallery) : null;

  return (
    <main>
      {/* Hero block in the domain color; narrow full-bleed image band below the copy */}
      <Reveal as="section" className="relative pt-24 md:pt-28" style={{ background: domain.bg }} delay={200} amount={0.01}>
        <div className="wrap pb-14 md:pb-20">
          <div className="flex items-baseline gap-4">
            <span className="numeral num-in text-[clamp(3.5rem,8vw,6.5rem)]">{domain.number}</span>
            <span className="label fade" style={{ ["--i" as string]: 1 }}>
              {domain.discipline}
            </span>
          </div>
          <h1 className="display display-lg mt-10 md:mt-14">
            <Lines lines={domain.name.split(" ")} offset={1} />
          </h1>
          <p className="body fade mt-6" style={{ ["--i" as string]: 4 }}>
            {domain.line}
          </p>
          {domain.subpage && (
            <div className="fade mt-10" style={{ ["--i" as string]: 5 }}>
              <PillButton href={domain.subpage.href}>{domain.subpage.label}</PillButton>
            </div>
          )}
        </div>
        <div className="mask-in">
          <div className="plx relative h-44 w-full md:h-60">
            <Image
              src={domain.image.src}
              alt={domain.image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: domain.imagePos ?? "center" }}
            />
          </div>
        </div>
      </Reveal>

      {/* Gallery (from Sanity) or static index */}
      {seriesGroups ? (
        <section className="wrap pb-24 pt-16 md:pb-32 md:pt-24">
          {/* Series quick links */}
          <Reveal
            as="nav"
            aria-label="Series"
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-16 md:grid md:overflow-visible md:pb-24"
            style={{ gridTemplateColumns: `repeat(${seriesGroups.length}, minmax(0, 1fr))` }}
            amount={0.1}
          >
            {seriesGroups.map((group, i) => {
              const thumb = group.photos.find((p) => p.featured) ?? group.photos[0];
              return (
              <a
                key={group.series}
                href={`#${seriesSlug(group.series)}`}
                className="group w-[40%] shrink-0 snap-start fade sm:w-[28%] md:w-auto"
                style={{ ["--i" as string]: i + 1 }}
              >
                <span className="block overflow-hidden">
                  <Image
                    src={thumb.url}
                    alt={`${group.series} series`}
                    width={thumb.width}
                    height={thumb.height}
                    sizes="(min-width: 768px) 13vw, 40vw"
                    className="aspect-square w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                  />
                </span>
                <span className="mt-3 flex items-baseline justify-between gap-2">
                  <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">{group.series}</span>
                  <span className="label transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-1">&darr;</span>
                </span>
              </a>
              );
            })}
          </Reveal>
          {seriesGroups.map((group, gi) => (
            <Reveal
              key={group.series}
              id={seriesSlug(group.series)}
              className="grid scroll-mt-24 gap-10 pb-20 md:grid-cols-12 md:gap-8 md:pb-28"
              amount={0.05}
            >
              <div className="md:col-span-3">
                <span className="label num-in tabular-nums">0{gi + 1}</span>
                <h2 className="display display-md mt-4">{group.series}</h2>
                <p className="label fade mt-4" style={{ ["--i" as string]: 1 }}>
                  {group.photos.length} {group.photos.length === 1 ? "frame" : "frames"}
                </p>
              </div>
              <div className="gap-5 md:col-span-9 md:columns-2 [&>figure]:mb-5 [&>figure]:break-inside-avoid">
                {group.photos.map((p, i) => (
                  <figure key={p._id} className="fade" style={{ ["--i" as string]: (i % 6) + 1 }}>
                    <Image
                      src={p.url}
                      alt={p.title || group.series}
                      width={p.width}
                      height={p.height}
                      sizes="(min-width: 768px) 38vw, 100vw"
                    />
                    {p.title && <figcaption className="label mt-3">{p.title}</figcaption>}
                  </figure>
                ))}
              </div>
            </Reveal>
          ))}
        </section>
      ) : (
      <Reveal as="section" className="wrap pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {domain.entries.map((e, i) => {
            const card = (
              <span className="flex h-full flex-col justify-between border border-charcoal/20 p-6 transition-colors duration-500 ease-[var(--ease-out)] group-hover:border-charcoal md:p-8">
                <span>
                  <span className="label tabular-nums">0{i + 1}</span>
                  <span className="display display-sm mt-4 block transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1">
                    {e.title}
                  </span>
                </span>
                <span className="mt-12 flex items-baseline justify-between gap-4">
                  <span className="label">{e.kind}</span>
                  <span className="label">
                    {e.href ? (
                      <>
                        Open <span aria-hidden="true">&rarr;</span>
                      </>
                    ) : (
                      e.year
                    )}
                  </span>
                </span>
              </span>
            );
            const cls = "group fade block h-full";
            const style = { ["--i" as string]: i + 1 };
            return e.href ? (
              e.href.startsWith("http") ? (
                <a key={e.title} href={e.href} target="_blank" rel="noreferrer" className={cls} style={style}>
                  {card}
                </a>
              ) : (
                <Link key={e.title} href={e.href} className={cls} style={style}>
                  {card}
                </Link>
              )
            ) : (
              <div key={e.title} className={cls} style={style}>
                {card}
              </div>
            );
          })}
        </div>
      </Reveal>
      )}

      {/* Back to top */}
      <Reveal as="section" className="wrap flex justify-center pb-24 md:pb-32" amount={0.3}>
        <PillButton href="#" up>Back to top</PillButton>
      </Reveal>
    </main>
  );
}
