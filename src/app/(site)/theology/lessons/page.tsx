import type { Metadata } from "next";
import Link from "next/link";
import Lines from "@/components/Lines";
import PillButton from "@/components/PillButton";
import Reveal from "@/components/Reveal";
import { domains, sundayLessons } from "@/lib/content";

const theology = domains.find((d) => d.id === "theology")!;

export const metadata: Metadata = {
  title: "Sunday School lessons",
  description: "Gospel Doctrine lessons with slides and audio recordings.",
};

const courses = [...new Set(sundayLessons.map((l) => l.course))];

export default function LessonsPage() {
  return (
    <main>
      {/* Hero */}
      <Reveal as="section" className="pt-24 md:pt-28" style={{ background: theology.bg }} delay={200} amount={0.01}>
        <div className="wrap pb-16 md:pb-24">
          <p className="label fade">
            <Link href="/theology" className="hover:text-charcoal transition-colors">
              Theology
            </Link>
          </p>
          <h1 className="display display-lg mt-8">
            <Lines lines={["Sunday", "School"]} offset={1} />
          </h1>
          <p className="body fade mt-6" style={{ ["--i" as string]: 3 }}>
            Gospel Doctrine lessons, with the slides and the recording where they exist.
          </p>
        </div>
      </Reveal>

      {/* Lessons grouped by course */}
      {courses.map((course, ci) => {
        const lessons = sundayLessons.filter((l) => l.course === course);
        return (
          <Reveal key={course} as="section" className="wrap pb-16 pt-10 md:pb-20 md:pt-14" amount={0.1}>
            <div className="grid gap-10 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-3">
                <span className="label num-in tabular-nums">0{ci + 1}</span>
                <h2 className="display display-md mt-4">{course}</h2>
              </div>
              <div className="md:col-span-9">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {lessons.map((lesson, i) => (
                    <Link
                      key={lesson.slug}
                      href={`/theology/lessons/${lesson.slug}`}
                      className="group fade block h-full"
                      style={{ ["--i" as string]: i + 1 }}
                    >
                      <span className="flex h-full flex-col justify-between border border-charcoal/20 p-6 transition-colors duration-500 ease-[var(--ease-out)] group-hover:border-charcoal md:p-8">
                        <span>
                          <span className="label tabular-nums">0{i + 1}</span>
                          <span className="display display-sm mt-4 block transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1">
                            {lesson.title}
                          </span>
                          {lesson.line && <span className="body mt-3 block text-sm">{lesson.line}</span>}
                        </span>
                        <span className="mt-10 flex items-baseline justify-between gap-4">
                          <span className="label">
                            {[lesson.slidesId && "Slides", lesson.audioId && "Audio", lesson.links?.length && "Extras"]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                          <span className="label">
                            Open <span aria-hidden="true">&rarr;</span>
                          </span>
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}

      {/* Back to top */}
      <Reveal as="section" className="wrap flex justify-center pb-24 pt-8 md:pb-32" amount={0.3}>
        <PillButton href="#" up>Back to top</PillButton>
      </Reveal>
    </main>
  );
}
