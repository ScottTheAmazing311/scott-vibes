"use client";

import { useEffect, useMemo, useState } from "react";
import { countdownEvents, type CountdownEvent } from "@/lib/kidzone";

interface CustomEvent {
  id: string;
  title: string;
  date: string; // MM-DD if yearly, else YYYY-MM-DD
  accent: CountdownEvent["accent"];
}

const DAY = 86400000;
const STORE = "kz-countdown-custom";
const ACCENTS: CountdownEvent["accent"][] = ["marigold", "brick", "leaf", "cobalt"];

function nextOccurrence(date: string, today: Date): Date | null {
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (date.length === 5) {
    const [m, d] = date.split("-").map(Number);
    const thisYear = new Date(today.getFullYear(), m - 1, d);
    return thisYear >= midnight ? thisYear : new Date(today.getFullYear() + 1, m - 1, d);
  }
  const [y, m, d] = date.split("-").map(Number);
  const when = new Date(y, m - 1, d);
  return when >= midnight ? when : null; // one-time date that already passed
}

function sleepsUntil(when: Date, today: Date): number {
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((when.getTime() - midnight.getTime()) / DAY);
}

function Ring({ fraction, accent }: { fraction: number; accent: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--kz-line)" strokeWidth="10" />
      <circle
        cx="60" cy="60" r={r} fill="none"
        stroke={`var(--kz-${accent})`} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - fraction)}
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }}
      />
    </svg>
  );
}

export default function CountdownGame() {
  const [custom, setCustom] = useState<CustomEvent[]>([]);
  const [today, setToday] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [yearly, setYearly] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setToday(new Date());
    try {
      setCustom(JSON.parse(localStorage.getItem(STORE) || "[]"));
    } catch {}
  }, []);

  const events = useMemo(() => {
    if (!today) return [];
    return [...countdownEvents, ...custom.map((c) => ({ ...c, custom: true as const }))]
      .map((e) => {
        const when = nextOccurrence(e.date, today);
        return when ? { ...e, when, sleeps: sleepsUntil(when, today) } : null;
      })
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .sort((a, b) => a.sleeps - b.sleeps);
  }, [custom, today]);

  if (!today) return <div className="kz-panel h-64 animate-pulse" aria-label="Loading countdowns" />;

  const save = (list: CustomEvent[]) => {
    setCustom(list);
    try {
      localStorage.setItem(STORE, JSON.stringify(list));
    } catch {}
  };

  const addEvent = () => {
    if (!title.trim() || !date) return;
    const stored = yearly ? date.slice(5) : date;
    save([...custom, { id: `c-${Date.now()}`, title: title.trim().slice(0, 40), date: stored, accent: ACCENTS[custom.length % 4] }]);
    setTitle("");
    setDate("");
    setAdding(false);
  };

  const [next, ...rest] = events;
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div>
      {/* Next up */}
      {next && (
        <div className="kz-tile flex flex-col items-center gap-6 p-8 sm:flex-row sm:gap-10 sm:p-10" style={{ background: `var(--kz-${next.accent}-soft)` }}>
          <div className="relative h-40 w-40 shrink-0">
            <Ring fraction={Math.max(0.02, 1 - Math.min(next.sleeps, 365) / 365)} accent={next.accent} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold leading-none tracking-tight">{next.sleeps === 0 ? "0" : next.sleeps}</span>
              <span className="mt-1 text-xs font-bold" style={{ color: "var(--kz-ink-soft)" }}>
                {next.sleeps === 1 ? "sleep" : "sleeps"}
              </span>
            </div>
          </div>
          <div className="text-center sm:text-left">
            {next.sleeps === 0 ? (
              <>
                <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">It's {next.title} today!</h2>
                <p className="mt-2 text-lg font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
                  Hooray! Go celebrate!
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>Next up</p>
                <h2 className="mt-1 text-4xl font-extrabold tracking-tight md:text-5xl">{next.title}</h2>
                <p className="mt-2 text-lg font-semibold" style={{ color: "var(--kz-ink-soft)" }}>{fmt(next.when)}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* The rest */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((e) => (
          <div key={e.id} className="kz-panel relative flex items-center gap-5 p-5">
            <div className="relative h-20 w-20 shrink-0">
              <Ring fraction={Math.max(0.02, 1 - Math.min(e.sleeps, 365) / 365)} accent={e.accent} />
              <div className="absolute inset-0 flex items-center justify-center text-xl font-extrabold">{e.sleeps}</div>
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-xl font-extrabold tracking-tight">{e.title}</h3>
              <p className="text-sm font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
                {e.sleeps === 0 ? "Today!" : `${e.sleeps} ${e.sleeps === 1 ? "sleep" : "sleeps"}`}
              </p>
              {"custom" in e && (
                <button
                  onClick={() => save(custom.filter((c) => c.id !== e.id))}
                  className="mt-1 text-xs font-bold underline decoration-2 underline-offset-2"
                  style={{ color: "var(--kz-ink-soft)" }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add your own */}
        {adding ? (
          <div className="kz-panel p-5">
            <label className="block text-sm font-bold" htmlFor="cd-title">What are we counting down to?</label>
            <input
              id="cd-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Mia's birthday"
              className="mt-1.5 w-full rounded-xl border-[1.5px] px-3 py-2.5 text-base font-semibold outline-none focus:border-[var(--kz-cobalt)]"
              style={{ borderColor: "var(--kz-line)", background: "var(--kz-ground)" }}
            />
            <label className="mt-3 block text-sm font-bold" htmlFor="cd-date">When is it?</label>
            <input
              id="cd-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border-[1.5px] px-3 py-2.5 text-base font-semibold outline-none focus:border-[var(--kz-cobalt)]"
              style={{ borderColor: "var(--kz-line)", background: "var(--kz-ground)" }}
            />
            <label className="mt-3 flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={yearly} onChange={(e) => setYearly(e.target.checked)} />
              It happens every year
            </label>
            <div className="mt-4 flex gap-2">
              <button onClick={addEvent} className="kz-btn !min-h-[2.5rem] !text-sm">Start counting</button>
              <button onClick={() => setAdding(false)} className="kz-btn-ghost !min-h-[2.5rem] !text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="kz-tile flex min-h-[7.5rem] items-center justify-center border-dashed p-5 text-lg font-extrabold"
            style={{ background: "transparent", borderWidth: "2px", color: "var(--kz-ink-soft)" }}
          >
            + Count down to something new
          </button>
        )}
      </div>
    </div>
  );
}
