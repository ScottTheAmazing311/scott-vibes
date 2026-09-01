import type { Metadata } from "next";
import Image from "next/image";
import Lines from "@/components/Lines";
import PillButton from "@/components/PillButton";
import Reveal from "@/components/Reveal";
import { creativeApps as apps, domains } from "@/lib/content";

const creative = domains.find((d) => d.id === "creative")!;

export const metadata: Metadata = {
  title: apps.title,
  description: apps.line,
};

export default function CreativeAppsPage() {
  return (
    <main>
      {/* Hero */}
      <Reveal as="section" className="pt-24 md:pt-28" style={{ background: creative.bg }} delay={200} amount={0.01}>
        <div className="wrap pb-14 md:pb-20">
          <p className="label fade">{apps.label}</p>
          <h1 className="display display-lg mt-8">
            <Lines lines={[apps.title]} offset={1} />
          </h1>
          <p className="body fade mt-6" style={{ ["--i" as string]: 3 }}>
            {apps.line}
          </p>
        </div>
        <div className="mask-in">
          <div className="plx relative h-44 w-full md:h-60">
            <Image
              src={apps.header.src}
              alt={apps.header.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Reveal>

      {/* Apps */}
      <section className="wrap py-20 md:py-28">
        <div className="grid gap-x-8 gap-y-20 md:grid-cols-2 md:gap-y-28">
          {apps.apps.map((app, i) => {
            const figure = (
              <span className="mask-in block overflow-hidden">
                <Image
                  src={app.image.src}
                  alt={app.image.alt}
                  width={app.image.width}
                  height={app.image.height}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="w-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                />
              </span>
            );
            const caption = (
              <span className="mt-6 block">
                <span className="flex items-baseline gap-4">
                  <span className="label tabular-nums">0{i + 1}</span>
                  <span className="display display-sm">{app.name}</span>
                  <span className="label ml-auto">{app.kind}</span>
                </span>
                <span className="body mt-3 flex items-baseline justify-between gap-4">
                  <span>{app.line}</span>
                  {app.href ? (
                    <span className="ulink shrink-0 text-sm">
                      Visit <span aria-hidden="true">&rarr;</span>
                    </span>
                  ) : (
                    <span className="label shrink-0 border border-charcoal/30 px-2 py-1">Coming soon</span>
                  )}
                </span>
              </span>
            );
            return (
              <Reveal key={app.name} className={i % 2 === 1 ? "md:mt-24" : ""} amount={0.15}>
                {app.href ? (
                  <a href={app.href} target="_blank" rel="noreferrer" className="group block">
                    {figure}
                    {caption}
                  </a>
                ) : (
                  <div className="group">
                    {figure}
                    {caption}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Back to top */}
      <Reveal as="section" className="wrap flex justify-center pb-24 md:pb-32" amount={0.3}>
        <PillButton href="#" up>Back to top</PillButton>
      </Reveal>
    </main>
  );
}
