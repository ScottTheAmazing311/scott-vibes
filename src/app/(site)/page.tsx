import Image from "next/image";
import Link from "next/link";
import Lines from "@/components/Lines";
import HeroVideo from "@/components/HeroVideo";
import PillButton from "@/components/PillButton";
import ProjectSpread from "@/components/ProjectSpread";
import Reveal from "@/components/Reveal";
import SocialBand from "@/components/SocialBand";
import { contact, domains, hero, site } from "@/lib/content";

const layouts = ["right", "left", "right", "left", "right"] as const;

export default function Home() {
  return (
    <main>
      {/* 1. Introduction */}
      <Reveal as="section" className="relative flex min-h-[100dvh] flex-col overflow-hidden pt-24 md:pt-28" delay={200} amount={0.01}>
        {/* Golf header video */}
        <HeroVideo
          intro="/golf-header.mp4"
          loop="/golf-loop.mp4"
          poster="/golf-poster.jpg"
          loopPoster="/golf-loop-poster.jpg"
          className="absolute inset-0 h-full w-full"
        />
        {/* ivory scrim keeps the type readable while the landscape shows through */}
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/85 via-ivory/35 to-ivory/10 md:bg-gradient-to-r md:from-ivory/90 md:via-ivory/55 md:to-transparent" />
        <div className="wrap relative flex flex-1 flex-col">
          <div className="flex flex-1 flex-col justify-center md:max-w-[60%]">
            <p className="label fade">{hero.label}</p>
            <h1 className="display display-xl hero-grow mt-6 md:mt-8">
              <span className="line">
                <span className="line-in" style={{ ["--i" as string]: 1 }}>
                  Never Stop
                </span>
              </span>
              <span className="line">
                <span className="line-in" style={{ ["--i" as string]: 2 }}>
                  <em className="em">Creating.</em>
                </span>
              </span>
            </h1>
          </div>
          <div className="fade relative flex items-end justify-between pb-8 pt-12 md:pt-6" style={{ ["--i" as string]: 6 }}>
            <div className="flex flex-col items-start gap-3">
              <span className="label">Scroll</span>
              <span className="scroll-ind" aria-hidden="true" />
            </div>
            <div className="absolute inset-x-0 bottom-8 flex justify-center">
              <PillButton href={hero.cta.href} down>{hero.cta.label}</PillButton>
            </div>
          </div>
        </div>
      </Reveal>

      {/* 2. Quick links */}
      <Reveal as="section" className="pb-10 md:pb-16" amount={0.1}>
        <div className="wrap">
          <div className="rule-strong rule-x" />
        </div>
        <nav
          aria-label="Sections"
          className="wrap mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0"
        >
          {domains.map((d, i) => (
            <Link
              key={d.id}
              href={d.path}
              className="group w-[64%] shrink-0 snap-start sm:w-[36%] md:w-auto"
            >
              <span className="fade block" style={{ ["--i" as string]: i + 1 }}>
                <span className="block overflow-hidden">
                  <Image
                    src={(d.card ?? d.image).src}
                    alt={(d.card ?? d.image).alt}
                    width={(d.card ?? d.image).width}
                    height={(d.card ?? d.image).height}
                    sizes="(min-width: 768px) 19vw, 60vw"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                  />
                </span>
                <span className="mt-4 flex items-baseline justify-between gap-3">
                  <span className="flex items-baseline gap-3">
                    <span className="label tabular-nums">{d.number}</span>
                    <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">{d.name}</span>
                  </span>
                  <span className="label transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1">&rarr;</span>
                </span>
              </span>
            </Link>
          ))}
        </nav>
      </Reveal>

      {/* 3. The Workshop */}
      <section id="work" className="scroll-mt-16">
        <Reveal className="wrap flex items-end justify-between pb-8 pt-8 md:pt-0">
          <h2 className="display display-lg">
            <Lines lines={["The Workshop"]} />
          </h2>
        </Reveal>
        {domains.map((d, i) => (
          <ProjectSpread key={d.id} domain={d} layout={layouts[i]} />
        ))}
      </section>

      {/* 3. Social */}
      <Reveal as="section" className="on-acid bg-acid py-16 md:py-24" amount={0.3}>
        <div className="wrap">
          <SocialBand />
        </div>
      </Reveal>

      {/* 5. Contact */}
      <Reveal as="section" id="contact" className="on-dark scroll-mt-16 bg-charcoal py-14 md:py-20" amount={0.15} data-header-theme="dark">
        <div className="wrap">
          <p className="label num-in">Contact</p>
          <h2 className="display display-md mt-4 [&_.em]:text-acid">
            <Lines lines={contact.lines} offset={1} />
          </h2>
          <div className="mt-8">
            <a
              href={`mailto:${site.email}`}
              className="ulink fade display display-sm break-all md:break-normal"
              style={{ ["--i" as string]: 2 }}
            >
              {site.email}
            </a>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
