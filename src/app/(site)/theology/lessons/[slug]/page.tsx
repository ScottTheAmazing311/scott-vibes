import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Lines from "@/components/Lines";
import PillButton from "@/components/PillButton";
import Reveal from "@/components/Reveal";
import { domains, sundayLessons } from "@/lib/content";

const theology = domains.find((d) => d.id === "theology")!;

export function generateStaticParams() {
  return sundayLessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = sundayLessons.find((l) => l.slug === slug);
  if (!lesson) return {};
  return {
    title: `${lesson.title}, Sunday School`,
    description: lesson.line ?? `Gospel Doctrine lesson on ${lesson.title}.`,
  };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = sundayLessons.find((l) => l.slug === slug);
  if (!lesson) notFound();
  let sectionIndex = 0;

  return (
    <main>
      {/* Hero */}
      <Reveal as="section" className="pt-24 md:pt-28" style={{ background: theology.bg }} delay={200} amount={0.01}>
        <div className="wrap pb-14 md:pb-20">
          <p className="label fade">
            <Link href="/theology/lessons" className="hover:text-charcoal transition-colors">
              Sunday School
            </Link>
            <span className="mx-2 opacity-50">/</span>
            {lesson.course}
          </p>
          <h1 className="display display-lg mt-8">
            <Lines lines={[lesson.title]} offset={1} />
          </h1>
          {lesson.line && (
            <p className="body fade mt-6" style={{ ["--i" as string]: 3 }}>
              {lesson.line}
            </p>
          )}
        </div>
      </Reveal>

      {/* The lesson slides */}
      {lesson.slidesId && (
        <Reveal as="section" className="wrap py-14 md:py-20" amount={0.1}>
          <span className="label num-in tabular-nums">0{++sectionIndex}</span>
          <h2 className="display display-md mt-4">The lesson</h2>
          <div className="fade mt-8" style={{ ["--i" as string]: 1 }}>
            <iframe
              src={`https://docs.google.com/presentation/d/${lesson.slidesId}/embed?start=false&loop=false`}
              className="aspect-video w-full border border-charcoal/20"
              allowFullScreen
              title={`${lesson.title} slides`}
            />
          </div>
        </Reveal>
      )}

      {/* The recording */}
      {lesson.audioId && (
        <Reveal as="section" className="wrap py-14 md:py-20" amount={0.1}>
          <span className="label num-in tabular-nums">0{++sectionIndex}</span>
          <h2 className="display display-md mt-4">The recording</h2>
          <div className="fade mt-8" style={{ ["--i" as string]: 1 }}>
            <iframe
              src={`https://drive.google.com/file/d/${lesson.audioId}/preview`}
              className="h-24 w-full border border-charcoal/20"
              title={`${lesson.title} audio recording`}
              allow="autoplay"
            />
          </div>
        </Reveal>
      )}

      {/* Extra materials */}
      {lesson.links && lesson.links.length > 0 && (
        <Reveal as="section" className="wrap py-14 md:py-20" amount={0.1}>
          <span className="label num-in tabular-nums">0{++sectionIndex}</span>
          <h2 className="display display-md mt-4">More materials</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lesson.links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group fade block h-full"
                style={{ ["--i" as string]: i + 1 }}
              >
                <span className="flex h-full flex-col justify-between border border-charcoal/20 p-6 transition-colors duration-500 ease-[var(--ease-out)] group-hover:border-charcoal md:p-8">
                  <span className="display display-sm block transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1">
                    {link.label}
                  </span>
                  <span className="label mt-10 block">
                    Open <span aria-hidden="true">&rarr;</span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      )}

      {/* All lessons + back to top */}
      <Reveal as="section" className="wrap flex flex-col items-center gap-6 pb-24 pt-8 md:pb-32" amount={0.3}>
        <PillButton href="/theology/lessons">All lessons</PillButton>
        <PillButton href="#" up outline>
          Back to top
        </PillButton>
      </Reveal>
    </main>
  );
}
