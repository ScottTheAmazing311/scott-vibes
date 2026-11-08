"use client";

import { useEffect, useMemo, useState } from "react";
import Mark from "./Mark";

// Sprites come straight from the PokeAPI sprites repo; names, types and Pokédex
// lines are baked into /public/kidzone/pokedex.json from PokeAPI's CSV data.
const SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const art = (id: number, shiny = false) => `${SPRITES}/other/official-artwork/${shiny ? "shiny/" : ""}${id}.png`;
const pixel = (id: number) => `${SPRITES}/${id}.png`;

const STORE = "kz-poke-v1";
const PACK_SIZE = 5;
const PACKS_PER_DAY = 3;
const SHINY_ODDS = 1 / 50;

type Rarity = "common" | "rare" | "epic" | "legendary";

interface Mon {
  id: number;
  name: string;
  gen: number;
  types: string[];
  rarity: Rarity;
  fact: string;
}

interface Pull {
  id: number;
  shiny: boolean;
}

interface Store {
  profiles: { id: string; name: string }[];
  /** profileId -> pokemon id -> copies owned */
  collections: Record<string, Record<number, number>>;
  /** profileId -> pokemon id -> shiny copies owned */
  shinies: Record<string, Record<number, number>>;
  /** profileId -> packs opened on a given day */
  packs: Record<string, { day: string; opened: number }>;
  /** profileId -> cards in the last pack */
  lastCards: Record<string, Pull[]>;
}

const EMPTY: Store = { profiles: [], collections: {}, shinies: {}, packs: {}, lastCards: {} };

const ODDS: { rarity: Rarity; weight: number }[] = [
  { rarity: "common", weight: 58 },
  { rarity: "rare", weight: 28 },
  { rarity: "epic", weight: 11 },
  { rarity: "legendary", weight: 3 },
];

const RARITY: Record<Rarity, { label: string; border: string }> = {
  common: { label: "Common", border: "var(--kz-line)" },
  rare: { label: "Rare", border: "var(--kz-cobalt)" },
  epic: { label: "Epic", border: "var(--kz-marigold)" },
  legendary: { label: "Legendary", border: "var(--kz-brick)" },
};

// Each type gets a strong chip color and a soft card tint, pulled toward the Kid Zone palette.
const TYPES: Record<string, [string, string]> = {
  normal: ["#9a9682", "#ece9df"],
  fire: ["#d95b43", "#f6dccf"],
  water: ["#4467c9", "#dbe2f5"],
  grass: ["#4f9c63", "#d9e9d6"],
  electric: ["#d9a21f", "#f6e9bf"],
  ice: ["#5ba8b5", "#d8edf0"],
  fighting: ["#b5473a", "#f0d6d1"],
  poison: ["#8d5aa6", "#eadcf0"],
  ground: ["#b88a45", "#efe2cc"],
  flying: ["#7f8fd6", "#e1e5f6"],
  psychic: ["#d4587e", "#f6d9e2"],
  bug: ["#8a9a2e", "#e6ead0"],
  rock: ["#a3904f", "#ebe4cf"],
  ghost: ["#6a5e9c", "#e0dcef"],
  dragon: ["#5a54c4", "#dedcf4"],
  dark: ["#5d5149", "#e3dfdb"],
  steel: ["#7f8ea0", "#e2e6eb"],
  fairy: ["#d47fb0", "#f6e0ec"],
};

const REGIONS = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar", "Paldea"];

const pad = (n: number) => `#${String(n).padStart(3, "0")}`;

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function untilTomorrow(): string {
  const now = new Date();
  const mid = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const mins = Math.ceil((mid.getTime() - now.getTime()) / 60000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function rollPack(dex: Mon[]): Pull[] {
  const total = ODDS.reduce((a, r) => a + r.weight, 0);
  const byRarity = (r: Rarity) => dex.filter((m) => m.rarity === r);
  const picks: Pull[] = [];
  for (let i = 0; i < PACK_SIZE; i++) {
    let roll = Math.random() * total;
    let rarity: Rarity = "common";
    for (const r of ODDS) {
      roll -= r.weight;
      if (roll <= 0) { rarity = r.rarity; break; }
    }
    // the last card is always Rare or better
    if (i === PACK_SIZE - 1 && rarity === "common") rarity = "rare";
    const pool = byRarity(rarity);
    let pick = pool[Math.floor(Math.random() * pool.length)];
    for (let tries = 0; tries < 8 && picks.some((p) => p.id === pick.id); tries++) {
      pick = pool[Math.floor(Math.random() * pool.length)];
    }
    picks.push({ id: pick.id, shiny: Math.random() < SHINY_ODDS });
  }
  return picks;
}

/** The next pack for this trainer, or null when today's packs are used up. */
function packFor(dex: Mon[] | null, s: Store, pid: string | null, day: string): Pull[] | null {
  if (!dex || !pid) return null;
  const opened = s.packs[pid]?.day === day ? s.packs[pid].opened : 0;
  return opened < PACKS_PER_DAY ? rollPack(dex) : null;
}

/* ---------- card faces ---------- */

function TypeChip({ type }: { type: string }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide"
      style={{ background: TYPES[type]?.[0] ?? "var(--kz-ink)", color: "var(--kz-panel)" }}
    >
      {type}
    </span>
  );
}

function PokeCard({ mon, shiny = false, full = false }: { mon: Mon; shiny?: boolean; full?: boolean }) {
  const r = RARITY[mon.rarity];
  const tint = TYPES[mon.types[0]]?.[1] ?? "var(--kz-ground)";
  const glow = shiny || mon.rarity === "legendary";
  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-[16px] border-[2.5px] ${glow ? "kz-shine" : ""}`}
      style={{ borderColor: shiny ? "var(--kz-marigold)" : r.border, background: "var(--kz-panel)" }}
    >
      <div className="relative aspect-[5/4] w-full" style={{ background: tint }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={art(mon.id, shiny)} alt={shiny ? `Shiny ${mon.name}` : mon.name} className="h-full w-full object-contain p-2" />
        <span className="absolute left-2 top-1.5 text-[11px] font-extrabold" style={{ color: "var(--kz-ink-soft)" }}>
          {pad(mon.id)}
        </span>
        {shiny && (
          <span
            className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold"
            style={{ background: "var(--kz-marigold)", color: "var(--kz-ink)" }}
          >
            <Mark shape="star" size={10} /> SHINY
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 py-2.5 text-left">
        <p className={`font-extrabold tracking-tight ${mon.name.length > 11 ? "text-sm leading-tight" : "text-lg leading-tight"}`}>{mon.name}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {mon.types.map((t) => (
            <TypeChip key={t} type={t} />
          ))}
        </div>
        <p className="mt-1.5 text-[11px] font-bold" style={{ color: r.border === "var(--kz-line)" ? "var(--kz-ink-soft)" : r.border }}>
          {r.label} &middot; {REGIONS[mon.gen - 1]}
        </p>
        <p className={`mt-1 ${full ? "" : "line-clamp-2"} text-[12px] font-semibold leading-snug`} style={{ color: "var(--kz-ink-soft)" }}>
          {mon.fact}
        </p>
      </div>
    </div>
  );
}

function CardBack() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[16px] border-[2.5px]"
      style={{ background: "var(--kz-ink)", borderColor: "var(--kz-ink)" }}
    >
      <Mark shape="ball" size={44} style={{ color: "var(--kz-brick)" }} />
      <p className="text-xs font-extrabold tracking-wide" style={{ color: "var(--kz-panel)" }}>POKÉ PACKS</p>
      <p className="text-[11px] font-bold" style={{ color: "rgba(255,253,247,0.55)" }}>Tap to reveal</p>
    </div>
  );
}

/** The foil pack. Its window shows a silhouette of the best card inside. */
function Pack({ tease, tearing, onOpen }: { tease: Mon | null; tearing: boolean; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      disabled={tearing}
      aria-label="Open the pack"
      className={`kz-pack relative h-64 w-44 ${tearing ? "kz-pack-tearing" : ""}`}
    >
      <span className="kz-pack-strip absolute inset-x-0 top-0 h-7 rounded-t-[16px]" style={{ background: "var(--kz-brick)" }} />
      <span
        className="absolute inset-x-0 bottom-0 top-6 flex flex-col items-center justify-between overflow-hidden rounded-b-[16px] px-3 pb-4 pt-4"
        style={{ background: "var(--kz-ink)" }}
      >
        <span className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wide" style={{ color: "var(--kz-panel)" }}>
          <Mark shape="ball" size={14} style={{ color: "var(--kz-brick)" }} /> POKÉ PACKS
        </span>
        {tease && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={art(tease.id)} alt="" className="kz-pack-tease h-32 w-32 object-contain" />
        )}
        <span className="text-[11px] font-bold" style={{ color: "rgba(255,253,247,0.6)" }}>
          {PACK_SIZE} cards &middot; Who&apos;s inside?
        </span>
      </span>
    </button>
  );
}

/* ---------- the game ---------- */

export default function PokePacks() {
  const [dex, setDex] = useState<Mon[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [store, setStore] = useState<Store>(EMPTY);
  const [active, setActive] = useState<string | null>(null);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");
  const [today, setToday] = useState("");
  const [pending, setPending] = useState<Pull[] | null>(null);
  const [tearing, setTearing] = useState(false);
  const [reveal, setReveal] = useState<{ cards: Pull[]; newIds: number[]; flipped: boolean[] } | null>(null);
  const [region, setRegion] = useState(1);
  const [show, setShow] = useState<"all" | "got" | "missing">("all");
  const [query, setQuery] = useState("");
  const [zoom, setZoom] = useState<{ mon: Mon; shiny: boolean } | null>(null);

  useEffect(() => {
    fetch("/kidzone/pokedex.json")
      .then((r) => r.json())
      .then((rows: [number, string, number, string[], Rarity, string][]) => {
        const loaded = rows.map(([id, name, gen, types, rarity, fact]) => ({ id, name, gen, types, rarity, fact }));
        let saved = EMPTY;
        try {
          saved = { ...EMPTY, ...JSON.parse(localStorage.getItem(STORE) || "{}") };
          // first visit: bring over the collectors from Knudson Kards
          if (saved.profiles.length === 0) {
            const kards = JSON.parse(localStorage.getItem("kz-kards-v1") || "{}");
            if (Array.isArray(kards.profiles)) saved.profiles = kards.profiles;
          }
        } catch {}
        const pid = saved.profiles[0]?.id ?? null;
        const day = todayStr();
        setDex(loaded);
        setStore(saved);
        setActive(pid);
        setToday(day);
        // rolled ahead of time so the pack's window can tease the best card inside
        setPending(packFor(loaded, saved, pid, day));
      })
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  const byId = useMemo(() => new Map((dex ?? []).map((m) => [m.id, m])), [dex]);

  const persist = (s: Store) => {
    setStore(s);
    try {
      localStorage.setItem(STORE, JSON.stringify(s));
    } catch {}
  };

  const addProfile = () => {
    if (!name.trim()) return;
    const id = `p-${Date.now()}`;
    const next = { ...store, profiles: [...store.profiles, { id, name: name.trim().slice(0, 20) }] };
    persist(next);
    setActive(id);
    setName("");
    setNaming(false);
    setReveal(null);
    setPending(packFor(dex, next, id, today));
  };

  const collection = active ? store.collections[active] ?? {} : {};
  const shinies = active ? store.shinies[active] ?? {} : {};
  const owned = Object.keys(collection).length;
  const openedToday = active && store.packs[active]?.day === today ? store.packs[active].opened : 0;
  const packsLeft = today ? PACKS_PER_DAY - openedToday : 0;
  const ready = !!dex && !!active && packsLeft > 0;

  const tease = useMemo(() => {
    if (!pending) return null;
    const order: Rarity[] = ["legendary", "epic", "rare", "common"];
    const mons = pending.map((p) => byId.get(p.id)).filter((m): m is Mon => !!m);
    return mons.sort((a, b) => order.indexOf(a.rarity) - order.indexOf(b.rarity))[0] ?? null;
  }, [pending, byId]);

  const openPack = () => {
    if (!active || !pending || !ready || tearing) return;
    const cards = pending;
    const next: Store = structuredClone(store);
    const mine = next.collections[active] ?? {};
    const shine = next.shinies[active] ?? {};
    const newIds: number[] = [];
    for (const c of cards) {
      if (!mine[c.id]) newIds.push(c.id);
      mine[c.id] = (mine[c.id] ?? 0) + 1;
      if (c.shiny) shine[c.id] = (shine[c.id] ?? 0) + 1;
    }
    next.collections[active] = mine;
    next.shinies[active] = shine;
    next.packs[active] = { day: today, opened: openedToday + 1 };
    next.lastCards[active] = cards;
    persist(next);

    const done = () => {
      setTearing(false);
      setPending(null);
      setReveal({ cards, newIds: [...new Set(newIds)], flipped: cards.map(() => false) });
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return done();
    setTearing(true);
    setTimeout(done, 700);
  };

  const flip = (i: number) => {
    setReveal((r) => (r && !r.flipped[i] ? { ...r, flipped: r.flipped.map((f, j) => f || j === i) } : r));
  };

  const switchTo = (id: string) => {
    setActive(id);
    setReveal(null);
    setPending(packFor(dex, store, id, today));
  };

  const allFlipped = reveal?.flipped.every(Boolean) ?? false;
  const shinyPulled = reveal?.cards.some((c) => c.shiny) ?? false;
  const lastPulls = active ? store.lastCards[active] ?? [] : [];

  const q = query.trim().toLowerCase();
  const binder = (dex ?? []).filter((m) => {
    if (q) return m.name.toLowerCase().includes(q) || String(m.id) === q.replace(/^#?0*/, "");
    if (m.gen !== region) return false;
    if (show === "got") return !!collection[m.id];
    if (show === "missing") return !collection[m.id];
    return true;
  });

  if (failed) {
    return (
      <div className="kz-panel p-8 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight">The Pokédex didn&apos;t load</h2>
        <p className="mt-1 font-semibold" style={{ color: "var(--kz-ink-soft)" }}>Check the internet and refresh the page.</p>
      </div>
    );
  }

  return (
    <div>
      {/* who's collecting */}
      <div className="flex flex-wrap items-center gap-2">
        {store.profiles.map((p) => (
          <button key={p.id} className="kz-chip" data-on={active === p.id} onClick={() => switchTo(p.id)}>
            {p.name}
            <span className="ml-2 text-xs opacity-70">
              {Object.keys(store.collections[p.id] ?? {}).length}/{dex?.length ?? 1025}
            </span>
          </button>
        ))}
        {naming ? (
          <span className="flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addProfile()}
              placeholder="Your name"
              autoFocus
              className="w-36 rounded-full border-[1.5px] px-4 py-1.5 text-sm font-bold outline-none focus:border-[var(--kz-brick)]"
              style={{ borderColor: "var(--kz-line)", background: "var(--kz-panel)" }}
            />
            <button onClick={addProfile} className="kz-chip">Join</button>
          </span>
        ) : (
          <button onClick={() => setNaming(true)} className="kz-chip" style={{ borderStyle: "dashed" }}>
            + Add a trainer
          </button>
        )}
      </div>

      {store.profiles.length === 0 && (
        <div className="kz-tile mt-6 p-8 text-center" style={{ background: "var(--kz-brick-soft)" }}>
          <h2 className="text-2xl font-extrabold tracking-tight">Add a trainer to start</h2>
          <p className="mt-1 text-base font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
            You get {PACKS_PER_DAY} packs every day, {PACK_SIZE} cards in each. There are 1,025 Pokémon to catch.
          </p>
        </div>
      )}

      {active && !dex && (
        <div className="kz-tile mt-6 h-[22rem] animate-pulse motion-reduce:animate-none" style={{ background: "var(--kz-brick-soft)" }} />
      )}

      {/* the next pack */}
      {active && dex && !reveal && pending && (
        <div className="kz-tile mt-6 flex flex-col items-center gap-6 p-8 text-center md:flex-row md:p-10 md:text-left" style={{ background: "var(--kz-brick-soft)" }}>
          <Pack tease={tease} tearing={tearing} onOpen={openPack} />
          <div>
            <p className="text-sm font-extrabold" style={{ color: "var(--kz-brick)" }}>
              Pack {openedToday + 1} of {PACKS_PER_DAY} today
            </p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight">Who&apos;s that in the window?</h2>
            <p className="mt-1 max-w-sm text-base font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
              That shadow is the best card in this pack. Guess, then tear it open to find out.
            </p>
            <button onClick={openPack} disabled={tearing} className="kz-btn mt-5">Tear it open</button>
          </div>
        </div>
      )}

      {/* reveal */}
      {active && reveal && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
            {reveal.cards.map((c, i) => {
              const mon = byId.get(c.id);
              if (!mon) return null;
              return (
                <button
                  key={i}
                  onClick={() => flip(i)}
                  className="aspect-[3/5] [perspective:900px]"
                  aria-label={reveal.flipped[i] ? mon.name : "Face down card, tap to reveal"}
                >
                  <div
                    className="relative h-full w-full transition-transform duration-500 motion-reduce:transition-none"
                    style={{ transformStyle: "preserve-3d", transform: reveal.flipped[i] ? "rotateY(180deg)" : "none" }}
                  >
                    <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                      <CardBack />
                    </div>
                    <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <PokeCard mon={mon} shiny={c.shiny} />
                      {reveal.flipped[i] && reveal.newIds.includes(c.id) && (
                        <span
                          className="absolute -left-1.5 -top-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold"
                          style={{ background: "var(--kz-leaf)", color: "var(--kz-panel)" }}
                        >
                          NEW
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {allFlipped ? (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <p className="text-base font-bold">
                {shinyPulled
                  ? "A SHINY! Those are super hard to find."
                  : reveal.newIds.length > 0
                    ? `${reveal.newIds.length} new Pokémon for the binder!`
                    : "All doubles this time. Your counters go up!"}
              </p>
              <button
                onClick={() => {
                  setReveal(null);
                  setPending(packFor(dex, store, active, today));
                }}
                className="kz-btn-ghost"
              >
                {packsLeft > 0 ? "Next pack" : "To my binder"}
              </button>
            </div>
          ) : (
            <p className="mt-4 text-center text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
              Tap each card to flip it over.
            </p>
          )}
        </div>
      )}

      {/* out of packs for today */}
      {active && dex && !reveal && packsLeft <= 0 && today !== "" && (
        <div className="kz-tile mt-6 p-6 md:p-8" style={{ background: "var(--kz-cobalt-soft)" }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">All {PACKS_PER_DAY} packs opened today!</h2>
              <p className="mt-1 text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
                New packs land in {untilTomorrow()}. Here&apos;s your last pack.
              </p>
            </div>
            <Mark shape="ball" size={30} style={{ color: "var(--kz-cobalt)" }} />
          </div>
          {lastPulls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
              {lastPulls.map((c, i) => {
                const mon = byId.get(c.id);
                return mon ? (
                  <button key={i} onClick={() => setZoom({ mon, shiny: c.shiny })} className="kz-tile flex flex-col items-center p-2" style={{ background: "var(--kz-panel)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={art(mon.id, c.shiny)} alt={mon.name} className="aspect-square w-full object-contain" />
                    <span className="truncate text-xs font-extrabold">{c.shiny ? `Shiny ${mon.name}` : mon.name}</span>
                  </button>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}

      {/* binder */}
      {active && dex && !reveal && (
        <div className="mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight">My Pokédex</h2>
            <span className="text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
              {owned}/{dex.length} caught &middot; {Object.keys(shinies).length} shiny
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {REGIONS.map((r, i) => {
              const gen = i + 1;
              const inGen = dex.filter((m) => m.gen === gen);
              const got = inGen.filter((m) => collection[m.id]).length;
              return (
                <button key={r} className="kz-chip" data-on={!q && region === gen} onClick={() => { setRegion(gen); setQuery(""); }}>
                  {r}
                  <span className="ml-2 text-xs opacity-70">{got}/{inGen.length}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(["all", "got", "missing"] as const).map((s) => (
              <button key={s} className="kz-chip" data-on={show === s} onClick={() => setShow(s)}>
                {s === "all" ? "Everyone" : s === "got" ? "Caught" : "Still looking"}
              </button>
            ))}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a Pokémon"
              aria-label="Find a Pokémon by name or number"
              className="ml-auto w-full rounded-full border-[1.5px] px-4 py-2 text-sm font-bold outline-none focus:border-[var(--kz-brick)] sm:w-56"
              style={{ borderColor: "var(--kz-line)", background: "var(--kz-panel)" }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-7">
            {binder.map((m) => {
              const count = collection[m.id] ?? 0;
              const shiny = !!shinies[m.id];
              return count > 0 ? (
                <button
                  key={m.id}
                  onClick={() => setZoom({ mon: m, shiny: false })}
                  className="kz-tile relative flex flex-col items-center px-1.5 pb-2 pt-1"
                  style={{ background: TYPES[m.types[0]]?.[1] ?? "var(--kz-panel)", borderColor: RARITY[m.rarity].border }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pixel(m.id)} alt={m.name} loading="lazy" className="aspect-square w-full object-contain [image-rendering:pixelated]" />
                  <span className="w-full truncate text-center text-[11px] font-extrabold">{m.name}</span>
                  <span className="absolute left-1.5 top-1 text-[10px] font-bold" style={{ color: "var(--kz-ink-soft)" }}>{pad(m.id)}</span>
                  {count > 1 && (
                    <span className="absolute right-1 top-1 rounded-full px-1.5 text-[10px] font-extrabold" style={{ background: "var(--kz-ink)", color: "var(--kz-panel)" }}>
                      x{count}
                    </span>
                  )}
                  {shiny && <Mark shape="star" size={14} className="absolute bottom-6 right-1.5" style={{ color: "var(--kz-marigold)" }} />}
                </button>
              ) : (
                <div
                  key={m.id}
                  className="relative flex flex-col items-center rounded-[20px] border-2 border-dashed px-1.5 pb-2 pt-1"
                  style={{ borderColor: "var(--kz-line)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pixel(m.id)} alt="" loading="lazy" className="aspect-square w-full object-contain opacity-[0.16] [filter:brightness(0)] [image-rendering:pixelated]" />
                  <span className="text-[11px] font-extrabold" style={{ color: "var(--kz-ink-soft)" }}>{pad(m.id)}</span>
                </div>
              );
            })}
          </div>
          {binder.length === 0 && (
            <p className="mt-6 text-center text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
              {q ? "No Pokémon by that name." : show === "got" ? "None caught here yet. Keep opening packs!" : "You caught every one in this region!"}
            </p>
          )}

          {owned >= dex.length && (
            <p className="mt-5 flex items-center justify-center gap-2 text-base font-bold">
              <Mark shape="star" size={18} style={{ color: "var(--kz-marigold)" }} />
              Pokémon Master! Every single one is in your Pokédex.
            </p>
          )}
        </div>
      )}

      {/* a caught card, up close */}
      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={zoom.mon.name}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(50, 59, 82, 0.55)" }}
          onClick={() => setZoom(null)}
        >
          <div className="w-full max-w-[18rem]" onClick={(e) => e.stopPropagation()}>
            <PokeCard mon={zoom.mon} shiny={zoom.shiny} full />
            <div className="mt-3 flex justify-center gap-2">
              {shinies[zoom.mon.id] && (
                <button className="kz-chip" data-on={zoom.shiny} onClick={() => setZoom({ ...zoom, shiny: !zoom.shiny })}>
                  {zoom.shiny ? "Show normal" : "Show shiny"}
                </button>
              )}
              <button className="kz-chip" onClick={() => setZoom(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
