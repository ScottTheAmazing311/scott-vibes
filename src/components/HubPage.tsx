import Image from "next/image";
import Link from "next/link";
import { nextDomain, type Domain } from "@/lib/content";
import { groupBySeries, type SanityPhoto } from "@/sanity/lib/photos";
import Lines from "./Lines";
import PillButton from "./PillButton";
import Reveal from "./Reveal";

/** Shared editorial template for the five section hubs. */
export default function HubPage({ domain, gallery }: { domain: Domain; gallery?: SanityPhoto[] }) {
  const next = nextDomain(domain.id);
  const seriesGroups = gallery && gallery.length > 0 ? groupBySeries(gallery) : null;

  return (
    <main>
      {/* Hero block in the domain color; image hangs below into the ivory */}
      <Reveal as="section" className="relative pt-24 md:pt-28" style={{ background: domain.bg }} delay={200} amount={0.01}>
        <div className="wrap grid gap-10 pb-16 md:grid-cols-12 md:gap-8 md:pb-0">
          <div className="md:col-span-7 md:pb-24">
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
          <div className="md:col-span-4 md:col-start-9 md:translate-y-24">
            <div className="mask-in">
              {domain.imageFull ? (
                <div className="plx">
                  <Image
                    src={domain.image.src}
                    alt={domain.image.alt}
                    width={domain.image.width}
                    height={domain.image.height}
                    priority
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="h-auto w-full"
                  />
                </div>
              ) : (
                <div className="plx relative aspect-[3/4] w-full">
                  <Image
                    src={domain.image.src}
                    alt={domain.image.alt}
                    fill
                    priority
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover object-[70%_50%]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Gallery (from Sanity) or static index */}
      {seriesGroups ? (
        <section className="wrap pb-24 pt-16 md:pb-32 md:pt-48">
          {seriesGroups.map((group, gi) => (
            <Reveal key={group.series} className="grid gap-10 pb-20 md:grid-cols-12 md:gap-8 md:pb-28" amount={0.05}>
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
      <Reveal as="section" className="wrap pb-24 pt-16 md:pb-32 md:pt-48">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3">
            <h2 className="display display-md">
              <Lines lines={["Index"]} />
            </h2>
            <p className="label fade mt-4" style={{ ["--i" as string]: 1 }}>
              {domain.entries.length} {domain.entries.length === 1 ? "entry" : "entries"}
            </p>
          </div>
          <div className="md:col-span-9">
            <div className="rule-strong rule-x" />
            {domain.entries.map((e, i) => {
              const row = (
                <div className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-2 py-6 md:grid-cols-[3rem_1fr_10rem_6rem] md:items-baseline md:py-8">
                  <span className="label pt-1 tabular-nums">0{i + 1}</span>
                  <span className="display display-sm block transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2">
                    {e.title}
                  </span>
                  <span className="label col-start-2 md:col-start-3">{e.kind}</span>
                  <span className="label col-start-2 md:col-start-4 md:text-right">{e.year}</span>
                </div>
              );
              return (
                <div key={e.title} className="fade" style={{ ["--i" as string]: i + 1 }}>
                  {e.href ? (
                    e.href.startsWith("http") ? (
                      <a href={e.href} target="_blank" rel="noreferrer" className="group block">
                        {row}
                      </a>
                    ) : (
                      <Link href={e.href} className="group block">
                        {row}
                      </Link>
                    )
                  ) : (
                    <div className="group">{row}</div>
                  )}
                  <div className="rule" />
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
      )}

      {/* Next */}
      <Reveal as="section" className="wrap pb-24 md:pb-32" amount={0.3}>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label num-in">Next</span>
            <Link href={next.path} className="display display-lg mt-4 block">
              <Lines lines={[next.name]} offset={1} />
            </Link>
          </div>
          <div className="fade" style={{ ["--i" as string]: 2 }}>
            <PillButton href={next.path}>Open {next.name}</PillButton>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
