"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Mark from "./Mark";
import PackOpening, { type Drawn } from "./PackOpening";
import { PokeCard, Tilt } from "./PokeCard";
import { fromRow, pad, pixel, points, RARITY, REGIONS, TYPES, type DexRow, type Mon, type Pull, type Rarity } from "./pokeData";

const STORE = "kz-poke-v1";
const PACK_SIZE = 5;
const PACKS_PER_DAY = 3;
const SHINY_ODDS = 1 / 50;

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
  // save the best for last, like a real pack
  const order: Rarity[] = ["common", "rare", "epic", "legendary"];
  const rank = (p: Pull) => order.indexOf(dex.find((m) => m.id === p.id)!.rarity) + (p.shiny ? 4 : 0);
  return picks.sort((a, b) => rank(a) - rank(b));
}

interface Pending {
  cards: Pull[];
  /** which of today's packs this is, 1-based */
  no: number;
}

/** The next pack for this trainer, or null when today's packs are used up. */
function packFor(dex: Mon[] | null, s: Store, pid: string | null, day: string): Pending | null {
  if (!dex || !pid) return null;
  const opened = s.packs[pid]?.day === day ? s.packs[pid].opened : 0;
  return opened < PACKS_PER_DAY ? { cards: rollPack(dex), no: opened + 1 } : null;
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
  // rolled ahead of time so the pack's window can tease the best card inside
  const [pending, setPending] = useState<Pending | null>(null);
  const [newIds, setNewIds] = useState<number[] | null>(null);
  const [region, setRegion] = useState(1);
  const [show, setShow] = useState<"all" | "got" | "missing">("all");
  const [query, setQuery] = useState("");
  const [zoom, setZoom] = useState<{ mon: Mon; shiny: boolean } | null>(null);
  const binderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/kidzone/pokedex.json")
      .then((r) => r.json())
      .then((rows: DexRow[]) => {
        const loaded = rows.map(fromRow);
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
    setNewIds(null);
    setPending(packFor(dex, next, id, today));
  };

  const collection = active ? store.collections[active] ?? {} : {};
  const shinies = active ? store.shinies[active] ?? {} : {};
  const owned = Object.keys(collection).length;
  const openedToday = active && store.packs[active]?.day === today ? store.packs[active].opened : 0;
  const packsLeft = today ? PACKS_PER_DAY - openedToday : 0;
  const score = dex
    ? dex.reduce((a, m) => a + (collection[m.id] ?? 0) * points(m, false) + (shinies[m.id] ?? 0) * points(m, false) * 4, 0)
    : 0;

  const drawn = useMemo<Drawn[]>(
    () => (pending?.cards ?? []).flatMap((p) => (byId.get(p.id) ? [{ mon: byId.get(p.id)!, shiny: p.shiny }] : [])),
    [pending, byId]
  );
  const tease = useMemo(() => drawn[drawn.length - 1]?.mon ?? null, [drawn]);

  const openPack = () => {
    if (!active || !pending || newIds) return;
    const cards = pending.cards;
    const next: Store = structuredClone(store);
    const mine = next.collections[active] ?? {};
    const shine = next.shinies[active] ?? {};
    const fresh: number[] = [];
    for (const c of cards) {
      if (!mine[c.id]) fresh.push(c.id);
      mine[c.id] = (mine[c.id] ?? 0) + 1;
      if (c.shiny) shine[c.id] = (shine[c.id] ?? 0) + 1;
    }
    next.collections[active] = mine;
    next.shinies[active] = shine;
    next.packs[active] = { day: today, opened: openedToday + 1 };
    next.lastCards[active] = cards;
    persist(next);
    setNewIds([...new Set(fresh)]);
  };

  const nextPack = () => {
    setNewIds(null);
    setPending(packFor(dex, store, active, today));
  };

  const toPokedex = () => {
    nextPack();
    requestAnimationFrame(() => binderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const switchTo = (id: string) => {
    setActive(id);
    setNewIds(null);
    setPending(packFor(dex, store, id, today));
  };

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
        <div className="kz-tile mt-6 p-8" style={{ background: "var(--kz-brick-soft)" }}>
          <h2 className="text-2xl font-extrabold tracking-tight">Add a trainer to start</h2>
          <p className="mt-1 text-base font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
            You get {PACKS_PER_DAY} packs every day, {PACK_SIZE} cards in each. There are 1,025 Pokémon to catch.
          </p>
        </div>
      )}

      {active && !dex && <div className="pk-table mt-6 h-[33rem] animate-pulse motion-reduce:animate-none" />}

      {/* the pack table */}
      {active && dex && pending && (
        <PackOpening
          key={`${active}-${today}-${pending.no}`}
          cards={drawn}
          tease={tease}
          newIds={newIds}
          label={`${store.profiles.find((p) => p.id === active)?.name ?? ""} · Pack ${pending.no} of ${PACKS_PER_DAY} today`}
          packsLeft={packsLeft}
          onOpen={openPack}
          onNext={nextPack}
          onDone={toPokedex}
          onZoom={(d) => setZoom({ mon: d.mon, shiny: d.shiny })}
        />
      )}

      {/* out of packs for today */}
      {active && dex && !pending && packsLeft <= 0 && today !== "" && (
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
            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {lastPulls.map((c, i) => {
                const mon = byId.get(c.id);
                return mon ? (
                  <button key={i} onClick={() => setZoom({ mon, shiny: c.shiny })} aria-label={`${c.shiny ? "Shiny " : ""}${mon.name}, see the card`}>
                    <PokeCard mon={mon} shiny={c.shiny} />
                  </button>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}

      {/* binder */}
      {active && dex && (
        <div ref={binderRef} className="mt-8 scroll-mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight">My Pokédex</h2>
            <span className="text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
              {owned}/{dex.length} caught &middot; {Object.keys(shinies).length} shiny &middot; {score.toLocaleString()} pts
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
                  style={{ background: TYPES[m.types[0]]?.[1] ?? "var(--kz-panel)", borderColor: m.rarity === "common" ? "var(--kz-line)" : RARITY[m.rarity].color }}
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
          <div className="w-full max-w-[20rem]" onClick={(e) => e.stopPropagation()}>
            <Tilt>
              <PokeCard mon={zoom.mon} shiny={zoom.shiny} />
            </Tilt>
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
