"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Mark from "./Mark";
import { worldCountries } from "@/lib/worldFacts";
import world from "./worldPaths.json";

const STORE = "kz-map-v1";

interface MapCountry {
  id: string;
  name: string;
  continent: string;
  d: string;
}

const countries = (world as { w: number; h: number; countries: MapCountry[] }).countries;
const W = (world as { w: number }).w;
const H = (world as { h: number }).h;

const FEATURED = new Map(worldCountries.map((c) => [c.id, c]));

/* each continent gets one toy color, chosen so neighbors differ */
const CONTINENT_ACCENT: Record<string, string> = {
  "North America": "leaf",
  "South America": "marigold",
  Europe: "cobalt",
  Africa: "brick",
  Asia: "leaf",
  Oceania: "marigold",
  "Seven seas (open ocean)": "cobalt",
};

/* viewBox presets in projected coordinates */
const VIEWS: { id: string; label: string; box: string }[] = [
  { id: "world", label: "Whole world", box: `0 0 ${W} ${H}` },
  { id: "na", label: "North America", box: "25 0 340 225" },
  { id: "sa", label: "South America", box: "250 190 180 199" },
  { id: "eu", label: "Europe", box: "420 20 215 125" },
  { id: "af", label: "Africa", box: "435 120 220 215" },
  { id: "as", label: "Asia", box: "560 0 440 270" },
  { id: "oc", label: "Oceania", box: "795 245 205 130" },
];

function sayHello(word: string, lang: string) {
  try {
    const u = new SpeechSynthesisUtterance(word);
    u.lang = lang;
    u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {}
}

export default function WorldMap() {
  const [stamps, setStamps] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState("world");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setStamps(JSON.parse(localStorage.getItem(STORE) || "[]"));
    } catch {}
  }, []);

  const save = (list: string[]) => {
    setStamps(list);
    try {
      localStorage.setItem(STORE, JSON.stringify(list));
    } catch {}
  };

  /* selection keys on name: a few territories share an ISO code */
  const sel = useMemo(() => countries.find((c) => c.name === selected) ?? null, [selected]);
  const facts = sel ? FEATURED.get(sel.id) : undefined;
  const stamped = sel ? stamps.includes(sel.id) : false;

  const pick = (name: string) => {
    setSelected(name);
    // on phones the panel sits below the map; bring it into view
    if (window.innerWidth < 768) {
      setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
    }
  };

  return (
    <div>
      {/* continent zoom + passport count */}
      <div className="flex flex-wrap items-center gap-2">
        {VIEWS.map((v) => (
          <button key={v.id} className="kz-chip" data-on={view === v.id} onClick={() => setView(v.id)}>
            {v.label}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
          <Mark shape="globe" size={16} style={{ color: "var(--kz-cobalt)" }} />
          {stamps.length} of {worldCountries.length} stamps
        </span>
      </div>

      <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,1fr)_330px]">
        {/* the map */}
        <div className="kz-panel flex items-center overflow-hidden p-2 sm:p-4">
          <svg
            viewBox={VIEWS.find((v) => v.id === view)?.box}
            className="h-auto w-full"
            role="img"
            aria-label="World map. Tap a country to learn about it."
            style={{ transition: "all 0.25s ease" }}
          >
            {countries.map((c) => {
              const accent = CONTINENT_ACCENT[c.continent] ?? "cobalt";
              const isSel = c.name === selected;
              const isStamped = FEATURED.has(c.id) && stamps.includes(c.id);
              return (
                <path
                  key={c.name}
                  d={c.d}
                  onClick={() => pick(c.name)}
                  style={{
                    fill: isStamped ? `var(--kz-${accent})` : `var(--kz-${accent}-soft)`,
                    stroke: isSel ? "var(--kz-ink)" : "var(--kz-panel)",
                    strokeWidth: isSel ? 1.4 : 0.5,
                    strokeLinejoin: "round",
                    cursor: "pointer",
                    opacity: selected && !isSel ? 0.85 : 1,
                  }}
                >
                  <title>{c.name}</title>
                </path>
              );
            })}
          </svg>
        </div>

        {/* country panel */}
        <div ref={panelRef} className="min-w-0">
          {!selected && (
            <div className="kz-tile flex h-full flex-col justify-center p-7" style={{ background: "var(--kz-cobalt-soft)" }}>
              <Mark shape="globe" size={40} style={{ color: "var(--kz-cobalt)" }} />
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Tap a country!</h2>
              <p className="mt-2 text-base font-semibold leading-relaxed" style={{ color: "var(--kz-ink-soft)" }}>
                Learn how to say hello, what to eat, and one wild fact. Every country you explore adds a stamp to your passport.
              </p>
            </div>
          )}

          {sel && (
            <div className="kz-panel p-6">
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--kz-ink-soft)" }}>
                {sel.continent}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight">{sel.name}</h2>

              {facts ? (
                <>
                  <p className="mt-1 text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
                    Capital: {facts.capital}
                  </p>

                  <div className="mt-4 rounded-[14px] p-4" style={{ background: "var(--kz-cobalt-soft)" }}>
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--kz-ink-soft)" }}>Say hello</p>
                    <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xl font-extrabold">{facts.hello.word}</p>
                      <button onClick={() => sayHello(facts.hello.word, facts.hello.lang)} className="kz-btn-ghost !min-h-[2.5rem] !px-4 text-sm">
                        Hear it
                      </button>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
                      sounds like &ldquo;{facts.hello.say}&rdquo;
                    </p>
                  </div>

                  <div className="mt-3 rounded-[14px] p-4" style={{ background: "var(--kz-marigold-soft)" }}>
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--kz-ink-soft)" }}>Famous food</p>
                    <p className="mt-1 text-lg font-extrabold">{facts.food.name}</p>
                    <p className="text-sm font-semibold leading-relaxed" style={{ color: "var(--kz-ink-soft)" }}>{facts.food.desc}</p>
                  </div>

                  <div className="mt-3 rounded-[14px] p-4" style={{ background: "var(--kz-leaf-soft)" }}>
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--kz-ink-soft)" }}>Whoa!</p>
                    <p className="mt-1 text-sm font-semibold leading-relaxed">{facts.fact}</p>
                  </div>

                  <button
                    onClick={() => sel && save(stamped ? stamps.filter((s) => s !== sel.id) : [...stamps, sel.id])}
                    className={stamped ? "kz-btn-ghost mt-4 w-full" : "kz-btn mt-4 w-full"}
                  >
                    {stamped ? "Stamped! (tap to remove)" : "Stamp my passport"}
                  </button>
                </>
              ) : (
                <p className="mt-3 text-base font-semibold leading-relaxed" style={{ color: "var(--kz-ink-soft)" }}>
                  We haven&apos;t written this country&apos;s page yet. Ask Dad to add it, or go stamp one with a story ready!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* passport */}
      {stamps.length > 0 && (
        <div className="kz-panel mt-5 p-6">
          <h3 className="text-lg font-extrabold tracking-tight">My passport</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {stamps.map((id) => {
              const c = countries.find((x) => x.id === id && FEATURED.has(x.id));
              if (!c) return null;
              const accent = CONTINENT_ACCENT[c.continent] ?? "cobalt";
              return (
                <button
                  key={id}
                  onClick={() => pick(c.name)}
                  className="rounded-full border-2 px-4 py-1.5 text-sm font-extrabold"
                  style={{ borderColor: `var(--kz-${accent})`, background: `var(--kz-${accent}-soft)` }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
          {stamps.length >= worldCountries.length && (
            <p className="mt-4 flex items-center gap-2 text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
              <Mark shape="star" size={16} style={{ color: "var(--kz-marigold)" }} />
              Every featured country stamped. You are a world explorer!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
