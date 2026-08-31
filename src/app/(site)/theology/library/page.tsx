import type { Metadata } from "next";
import Link from "next/link";
import AudioToggle from "@/components/AudioToggle";
import Lines from "@/components/Lines";
import PillButton from "@/components/PillButton";
import Reveal from "@/components/Reveal";
import { domains, theologyLibrary as lib } from "@/lib/content";

const theology = domains.find((d) => d.id === "theology")!;

export const metadata: Metadata = {
  title: "Theology Library",
  description: lib.line,
};

export default function TheologyLibraryPage() {
  return (
    <main>
      {/* Hero */}
      <Reveal as="section" className="pt-24 md:pt-28" style={{ background: theology.bg }} delay={200} amount={0.01}>
        <div className="wrap pb-16 md:pb-24">
          <p className="label fade">
            <Link href={theology.path} className="hover:text-charcoal transition-colors">
              {lib.label}
            </Link>
          </p>
          <h1 className="display display-lg mt-8">
            <Lines lines={[lib.title]} offset={1} />
          </h1>
          <p className="body fade mt-6" style={{ ["--i" as string]: 3 }}>
            {lib.line}
          </p>
        </div>
      </Reveal>

      {/* Armarium */}
      <Reveal as="section" className="on-dark bg-charcoal py-20 md:py-28" amount={0.2} data-header-theme="dark">
        <div className="wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label num-in">01</span>
            <h2 className="display display-lg mt-4 [&_.em]:text-acid">
              <Lines lines={["*Armarium*"]} offset={1} />
            </h2>
            <p className="body fade mt-4" style={{ ["--i" as string]: 3 }}>
              {lib.armarium.line}
            </p>
          </div>
          <div className="fade" style={{ ["--i" as string]: 4 }}>
            <PillButton href={lib.armarium.href}>Open Armarium</PillButton>
          </div>
        </div>
      </Reveal>

      {/* Sunday School lessons */}
      <Reveal as="section" className="wrap py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3">
            <span className="label num-in">02</span>
            <h2 className="display display-md mt-4">
              <Lines lines={lib.lessonsTitle.split(" ")} offset={1} />
            </h2>
            <p className="body fade mt-4 text-sm" style={{ ["--i" as string]: 3 }}>
              {lib.lessonsLine}
            </p>
          </div>
          <div className="md:col-span-9">
            <div className="rule-strong rule-x" />
            {lib.lessons.map((lesson, i) => (
              <div key={lesson.title} className="fade" style={{ ["--i" as string]: i + 1 }}>
                <div className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-3 py-6 md:grid-cols-[3rem_1fr_auto] md:items-baseline md:py-8">
                  <span className="label pt-1 tabular-nums">0{i + 1}</span>
                  <div>
                    <span className="display display-sm block">{lesson.title}</span>
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                      {lesson.pdf && (
                        <a href={lesson.pdf} className="ulink text-sm" target="_blank" rel="noreferrer">
                          PDF
                        </a>
                      )}
                      {lesson.slides && (
                        <a href={lesson.slides} className="ulink text-sm" target="_blank" rel="noreferrer">
                          Slides
                        </a>
                      )}
                      {lesson.audio && <AudioToggle src={lesson.audio} title={lesson.title} />}
                    </div>
                  </div>
                  <span className="label col-start-2 md:col-start-3 md:text-right">{lesson.date}</span>
                </div>
                <div className="rule" />
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Back */}
      <Reveal as="section" className="wrap pb-24 md:pb-32" amount={0.3}>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label num-in">Back to</span>
            <Link href={theology.path} className="display display-lg mt-4 block">
              <Lines lines={[theology.name]} offset={1} />
            </Link>
          </div>
          <div className="fade" style={{ ["--i" as string]: 2 }}>
            <PillButton href={theology.path}>Open Theology</PillButton>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
