"use client";

import { useEffect, useMemo, useState } from "react";
import Mark from "./Mark";
import { cfmLessons, cfmSchedule, type CfmLesson } from "@/lib/cfm2026";

const STORE = "kz-sunday-v1";
const DAY = 86400000;

/* done activity ids, keyed by week start date */
type Done = Record<string, string[]>;

function parseLocal(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function rangeLabel(start: string): string {
  const a = parseLocal(start);
  const b = new Date(a.getTime() + 6 * DAY);
  const mo = (d: Date) => d.toLocaleDateString("en-US", { month: "short" });
  return a.getMonth() === b.getMonth()
    ? `${mo(a)} ${a.getDate()} to ${b.getDate()}`
    : `${mo(a)} ${a.getDate()} to ${mo(b)} ${b.getDate()}`;
}

/** index of the schedule week containing `today`, clamped to the year */
function weekIndexFor(today: Date): number {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  for (let i = cfmSchedule.length - 1; i >= 0; i--) {
    if (t >= parseLocal(cfmSchedule[i].start).getTime()) return i;
  }
  return 0;
}

function Check({ on }: { on: boolean }) {
  return (
    <span
      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 transition-colors"
      style={{
        borderColor: on ? "var(--kz-leaf)" : "var(--kz-line)",
        background: on ? "var(--kz-leaf)" : "var(--kz-panel)",
      }}
    >
      {on && (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8.5 6.5 12 13 4.5" stroke="#fffdf7" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

export default function SundayPrep() {
  const [todayIdx, setTodayIdx] = useState<number | null>(null);
  const [viewStart, setViewStart] = useState<string | null>(null);
  const [done, setDone] = useState<Done>({});
  const [yearOpen, setYearOpen] = useState(false);

  useEffect(() => {
    const idx = weekIndexFor(new Date());
    setTodayIdx(idx);
    const current = cfmSchedule[idx].start;
    // land on the current week if we wrote a lesson for it, else the nearest one
    const match =
      cfmLessons.find((l) => l.start === current) ??
      cfmLessons.find((l) => parseLocal(l.start).getTime() >= parseLocal(current).getTime()) ??
      cfmLessons[cfmLessons.length - 1];
    setViewStart(match.start);
    try {
      setDone(JSON.parse(localStorage.getItem(STORE) || "{}"));
    } catch {}
  }, []);

  const lessonIdx = useMemo(() => cfmLessons.findIndex((l) => l.start === viewStart), [viewStart]);
  const lesson: CfmLesson | null = lessonIdx >= 0 ? cfmLessons[lessonIdx] : null;

  const toggle = (weekStart: string, actId: string) => {
    const mine = new Set(done[weekStart] ?? []);
    if (mine.has(actId)) mine.delete(actId);
    else mine.add(actId);
    const next = { ...done, [weekStart]: [...mine] };
    setDone(next);
    try {
      localStorage.setItem(STORE, JSON.stringify(next));
    } catch {}
  };

  const weeksPrepared = useMemo(
    () => cfmLessons.filter((l) => l.activities.every((a) => (done[l.start] ?? []).includes(a.id))).length,
    [done]
  );

  if (!lesson || todayIdx === null) {
    return <div className="kz-panel h-80 animate-pulse" />;
  }

  const isCurrent = cfmSchedule[todayIdx].start === lesson.start;
  const isPast = parseLocal(lesson.start).getTime() < parseLocal(cfmSchedule[todayIdx].start).getTime();
  const myDone = done[lesson.start] ?? [];
  const allDone = lesson.activities.every((a) => myDone.includes(a.id));
  const next = cfmLessons[lessonIdx + 1];
  const prev = cfmLessons[lessonIdx - 1];

  return (
    <div>
      {/* week switcher + prepared streak */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => prev && setViewStart(prev.start)} disabled={!prev} className="kz-chip disabled:opacity-35" aria-label="Previous week">
          &larr; Last week
        </button>
        <button onClick={() => next && setViewStart(next.start)} disabled={!next} className="kz-chip disabled:opacity-35" aria-label="Next week">
          Next week &rarr;
        </button>
        {weeksPrepared > 0 && (
          <span className="ml-auto flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
            <Mark shape="star" size={15} style={{ color: "var(--kz-marigold)" }} />
            {weeksPrepared} week{weeksPrepared > 1 ? "s" : ""} prepared
          </span>
        )}
      </div>

      {/* this week's lesson */}
      <div className="kz-tile mt-4 p-7 md:p-9" style={{ background: "var(--kz-leaf-soft)" }}>
        <p className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--kz-ink-soft)" }}>
          {isCurrent ? "This week in Come Follow Me" : isPast ? "An earlier week" : "Coming up"} &middot; {rangeLabel(lesson.start)}
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{lesson.kidTitle}</h2>
        <p className="mt-2 inline-block rounded-full px-4 py-1.5 text-sm font-bold" style={{ background: "var(--kz-panel)" }}>
          {cfmSchedule.find((w) => w.start === lesson.start)?.block}
        </p>
        <div className="mt-5 max-w-2xl space-y-3">
          {lesson.story.map((p, i) => (
            <p key={i} className="text-base font-semibold leading-relaxed md:text-lg">{p}</p>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {/* big idea + verse */}
        <div className="grid gap-5 content-start">
          <div className="kz-panel p-6">
            <h3 className="text-lg font-extrabold tracking-tight">The big idea</h3>
            <p className="mt-2 text-base font-semibold leading-relaxed" style={{ color: "var(--kz-ink-soft)" }}>
              {lesson.bigIdea}
            </p>
          </div>
          <div className="kz-panel p-6">
            <h3 className="text-lg font-extrabold tracking-tight">Verse of the week</h3>
            <blockquote className="mt-2 text-base font-semibold leading-relaxed">&ldquo;{lesson.verse.text}&rdquo;</blockquote>
            <p className="mt-2 text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>{lesson.verse.ref}</p>
            <p className="mt-3 text-sm font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
              Can anyone say it from memory by Sunday?
            </p>
          </div>
          <div className="kz-panel p-6">
            <h3 className="text-lg font-extrabold tracking-tight">Talk about it at dinner</h3>
            <ul className="mt-3 space-y-2.5">
              {lesson.talkAbout.map((q, i) => (
                <li key={i} className="flex gap-3 text-[15px] font-semibold leading-snug">
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-extrabold"
                    style={{ background: "var(--kz-cobalt-soft)", color: "var(--kz-cobalt)" }}
                  >
                    {i + 1}
                  </span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* activities checklist */}
        <div className="kz-panel p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-extrabold tracking-tight">Things to try this week</h3>
            <span className="text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
              {myDone.length}/{lesson.activities.length}
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {lesson.activities.map((a) => {
              const on = myDone.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggle(lesson.start, a.id)}
                  aria-pressed={on}
                  className="flex w-full items-start gap-3.5 rounded-[14px] border-2 p-4 text-left transition-transform duration-100 hover:-translate-y-0.5 motion-reduce:transition-none"
                  style={{
                    borderColor: on ? "var(--kz-leaf)" : "var(--kz-line)",
                    background: on ? "var(--kz-leaf-soft)" : "transparent",
                  }}
                >
                  <Check on={on} />
                  <span>
                    <span className="block text-base font-extrabold" style={{ textDecoration: on ? "line-through" : "none" }}>
                      {a.title}
                    </span>
                    <span className="mt-1 block text-sm font-semibold leading-relaxed" style={{ color: "var(--kz-ink-soft)" }}>
                      {a.detail}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {allDone && (
            <p className="mt-4 flex items-center gap-2 rounded-xl p-3.5 text-sm font-bold" style={{ background: "var(--kz-marigold-soft)" }}>
              <Mark shape="star" size={16} style={{ color: "var(--kz-marigold)" }} />
              All three done. You are ready for Sunday!
            </p>
          )}
        </div>
      </div>

      {/* next week peek */}
      {next && isCurrent && (
        <button
          onClick={() => setViewStart(next.start)}
          className="kz-tile mt-5 flex w-full items-center justify-between gap-4 p-6 text-left"
          style={{ background: "var(--kz-cobalt-soft)" }}
        >
          <span>
            <span className="block text-sm font-bold uppercase tracking-wide" style={{ color: "var(--kz-ink-soft)" }}>
              Next week &middot; {rangeLabel(next.start)}
            </span>
            <span className="mt-1 block text-xl font-extrabold tracking-tight">{next.kidTitle}</span>
          </span>
          <Mark shape="book" size={34} style={{ color: "var(--kz-cobalt)" }} />
        </button>
      )}

      {/* the whole year */}
      <div className="kz-panel mt-5 p-6">
        <button onClick={() => setYearOpen(!yearOpen)} className="flex w-full items-center justify-between text-left" aria-expanded={yearOpen}>
          <h3 className="text-lg font-extrabold tracking-tight">The whole year of lessons</h3>
          <span className="text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>{yearOpen ? "Hide" : "Show"}</span>
        </button>
        {yearOpen && (
          <ul className="mt-4 divide-y" style={{ borderColor: "var(--kz-line)" }}>
            {cfmSchedule.map((w, i) => {
              const hasLesson = cfmLessons.some((l) => l.start === w.start);
              const current = i === todayIdx;
              return (
                <li key={w.start} style={{ borderColor: "var(--kz-line)" }}>
                  {hasLesson ? (
                    <button
                      onClick={() => { setViewStart(w.start); window.scrollTo({ top: 0 }); }}
                      className="flex w-full items-baseline justify-between gap-4 rounded-lg px-2 py-2.5 text-left hover:bg-[var(--kz-ground)]"
                    >
                      <span className="text-[15px] font-bold">{w.block}</span>
                      <span className="shrink-0 text-xs font-bold" style={{ color: current ? "var(--kz-leaf)" : "var(--kz-ink-soft)" }}>
                        {current ? "This week" : rangeLabel(w.start)}
                      </span>
                    </button>
                  ) : (
                    <span className="flex items-baseline justify-between gap-4 px-2 py-2.5">
                      <span className="text-[15px] font-semibold" style={{ color: "var(--kz-ink-soft)" }}>{w.block}</span>
                      <span className="shrink-0 text-xs font-bold" style={{ color: current ? "var(--kz-leaf)" : "var(--kz-ink-soft)" }}>
                        {current ? "This week" : rangeLabel(w.start)}
                      </span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
