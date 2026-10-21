"use client";

import { useEffect, useMemo, useState } from "react";
import Mark from "./Mark";
import KardArt from "./KardArt";
import { kards, kardSeries, RARITY_ODDS, type Kard, type KardRarity, type KardSeries } from "@/lib/kards";

const STORE = "kz-kards-v1";
const PACK_SIZE = 5;

interface Store {
  profiles: { id: string; name: string }[];
  /** profileId -> cardId -> copies owned */
  collections: Record<string, Record<string, number>>;
  /** profileId -> YYYY-MM-DD of last opened pack */
  lastPack: Record<string, string>;
  /** profileId -> card ids pulled in the last pack */
  lastCards: Record<string, string[]>;
}

const EMPTY: Store = { profiles: [], collections: {}, lastPack: {}, lastCards: {} };

const RARITY: Record<KardRarity, { label: string; border: string; soft: string }> = {
  common: { label: "Common", border: "var(--kz-line)", soft: "var(--kz-ground)" },
  rare: { label: "Rare", border: "var(--kz-cobalt)", soft: "var(--kz-cobalt-soft)" },
  epic: { label: "Epic", border: "var(--kz-marigold)", soft: "var(--kz-marigold-soft)" },
  legendary: { label: "Legendary", border: "var(--kz-brick)", soft: "var(--kz-brick-soft)" },
};

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

function rollPack(): Kard[] {
  const total = RARITY_ODDS.reduce((a, r) => a + r.weight, 0);
  const picks: Kard[] = [];
  for (let i = 0; i < PACK_SIZE; i++) {
    let roll = Math.random() * total;
    let rarity: KardRarity = "common";
    for (const r of RARITY_ODDS) {
      roll -= r.weight;
      if (roll <= 0) { rarity = r.rarity; break; }
    }
    const pool = kards.filter((k) => k.rarity === rarity);
    // avoid the same card twice in one pack when we can
    for (let tries = 0; tries < 8; tries++) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (!picks.includes(pick) || tries === 7) { picks.push(pick); break; }
    }
  }
  if (!picks.some((p) => p.rarity !== "common")) {
    const pool = kards.filter((k) => k.rarity === "rare");
    picks[PACK_SIZE - 1] = pool[Math.floor(Math.random() * pool.length)];
  }
  return picks;
}

/* ---------- card faces ---------- */

function KardFace({ card, mini = false, count = 0 }: { card: Kard; mini?: boolean; count?: number }) {
  const r = RARITY[card.rarity];
  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-[16px] border-[2.5px] ${card.rarity === "legendary" ? "kz-shine" : ""}`}
      style={{ borderColor: r.border, background: "var(--kz-panel)" }}
    >
      <div className={`relative w-full overflow-hidden ${mini ? "min-h-0 flex-1" : "aspect-[4/3]"}`} style={{ background: r.soft }}>
        {card.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${card.photo}?w=600&q=75&auto=format`} alt={card.name} className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 120 90" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <KardArt id={card.id} />
          </svg>
        )}
        {count > 1 && (
          <span className="absolute right-1.5 top-1.5 rounded-full px-2 py-0.5 text-xs font-extrabold" style={{ background: "var(--kz-ink)", color: "var(--kz-panel)" }}>
            x{count}
          </span>
        )}
      </div>
      <div className={mini ? "px-2 py-1.5" : "flex flex-1 flex-col px-3.5 py-3"}>
        <p className={`font-extrabold tracking-tight ${mini ? "truncate text-xs" : card.name.length > 14 ? "text-sm leading-tight" : "text-lg leading-tight"}`}>{card.name}</p>
        {!mini && (
          <>
            <p className="mt-0.5 text-xs font-bold" style={{ color: r.border === "var(--kz-line)" ? "var(--kz-ink-soft)" : r.border }}>
              {r.label} &middot; {kardSeries.find((s) => s.id === card.series)?.label}
            </p>
            <p className="mt-2 text-[13px] font-semibold leading-snug" style={{ color: "var(--kz-ink-soft)" }}>
              {card.fact}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function KardBack() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[16px] border-[2.5px]" style={{ background: "var(--kz-ink)", borderColor: "var(--kz-ink)" }}>
      <Mark shape="gem" size={40} style={{ color: "var(--kz-marigold)" }} />
      <p className="text-xs font-extrabold tracking-wide" style={{ color: "var(--kz-panel)" }}>KNUDSON KARDS</p>
      <p className="text-[11px] font-bold" style={{ color: "rgba(255,253,247,0.55)" }}>Tap to reveal</p>
    </div>
  );
}

/* ---------- the game ---------- */

export default function KnudsonKards() {
  const [store, setStore] = useState<Store>(EMPTY);
  const [active, setActive] = useState<string | null>(null);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");
  const [today, setToday] = useState("");
  const [reveal, setReveal] = useState<{ cards: Kard[]; newIds: string[]; flipped: boolean[] } | null>(null);
  const [seriesTab, setSeriesTab] = useState<KardSeries | "all">("all");

  useEffect(() => {
    let saved = EMPTY;
    try {
      saved = { ...EMPTY, ...JSON.parse(localStorage.getItem(STORE) || "{}") };
    } catch {}
    setStore(saved);
    setActive(saved.profiles[0]?.id ?? null);
    setToday(todayStr());
  }, []);

  const persist = (s: Store) => {
    setStore(s);
    try {
      localStorage.setItem(STORE, JSON.stringify(s));
    } catch {}
  };

  const addProfile = () => {
    if (!name.trim()) return;
    const id = `p-${Date.now()}`;
    persist({ ...store, profiles: [...store.profiles, { id, name: name.trim().slice(0, 20) }] });
    setActive(id);
    setName("");
    setNaming(false);
    setReveal(null);
  };

  const collection = active ? store.collections[active] ?? {} : {};
  const owned = Object.keys(collection).length;
  const canOpen = !!active && today !== "" && store.lastPack[active ?? ""] !== today;

  const openPack = () => {
    if (!active || !canOpen) return;
    const cards = rollPack();
    const next: Store = structuredClone(store);
    const mine = next.collections[active] ?? {};
    const newIds: string[] = [];
    for (const c of cards) {
      if (!mine[c.id]) newIds.push(c.id);
      mine[c.id] = (mine[c.id] ?? 0) + 1;
    }
    next.collections[active] = mine;
    next.lastPack[active] = today;
    next.lastCards[active] = cards.map((c) => c.id);
    persist(next);
    setReveal({ cards, newIds: [...new Set(newIds)], flipped: cards.map(() => false) });
  };

  const flip = (i: number) => {
    if (!reveal || reveal.flipped[i]) return;
    const flipped = [...reveal.flipped];
    flipped[i] = true;
    setReveal({ ...reveal, flipped });
  };

  const allFlipped = reveal?.flipped.every(Boolean) ?? false;
  const lastPulls = useMemo(
    () => (active ? (store.lastCards[active] ?? []).map((id) => kards.find((k) => k.id === id)).filter((k): k is Kard => !!k) : []),
    [active, store.lastCards]
  );

  const binderCards = seriesTab === "all" ? kards : kards.filter((k) => k.series === seriesTab);

  return (
    <div>
      {/* who's collecting */}
      <div className="flex flex-wrap items-center gap-2">
        {store.profiles.map((p) => {
          const n = Object.keys(store.collections[p.id] ?? {}).length;
          return (
            <button key={p.id} className="kz-chip" data-on={active === p.id} onClick={() => { setActive(p.id); setReveal(null); }}>
              {p.name}
              <span className="ml-2 text-xs opacity-70">{n}/{kards.length}</span>
            </button>
          );
        })}
        {naming ? (
          <span className="flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addProfile()}
              placeholder="Your name"
              autoFocus
              className="w-36 rounded-full border-[1.5px] px-4 py-1.5 text-sm font-bold outline-none focus:border-[var(--kz-marigold)]"
              style={{ borderColor: "var(--kz-line)", background: "var(--kz-panel)" }}
            />
            <button onClick={addProfile} className="kz-chip">Join</button>
          </span>
        ) : (
          <button onClick={() => setNaming(true)} className="kz-chip" style={{ borderStyle: "dashed" }}>
            + Add a collector
          </button>
        )}
      </div>

      {store.profiles.length === 0 && (
        <div className="kz-tile mt-6 p-8 text-center" style={{ background: "var(--kz-marigold-soft)" }}>
          <h2 className="text-2xl font-extrabold tracking-tight">Add a collector to start</h2>
          <p className="mt-1 text-base font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
            Every day you get one card pack. Five cards inside. Collect all {kards.length}!
          </p>
        </div>
      )}

      {/* today's pack */}
      {active && !reveal && canOpen && (
        <div className="kz-tile mt-6 flex flex-col items-center gap-5 p-8 text-center md:p-10" style={{ background: "var(--kz-marigold-soft)" }}>
          <div className="flex h-36 w-28 flex-col items-center justify-center gap-2 rounded-[16px]" style={{ background: "var(--kz-ink)", boxShadow: "var(--kz-shadow)" }}>
            <Mark shape="gem" size={38} style={{ color: "var(--kz-marigold)" }} />
            <p className="text-[11px] font-extrabold tracking-wide" style={{ color: "var(--kz-panel)" }}>KNUDSON KARDS</p>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Today&apos;s pack is here!</h2>
            <p className="mt-1 text-base font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
              Five cards inside. What will you pull?
            </p>
          </div>
          <button onClick={openPack} className="kz-btn">Rip it open</button>
        </div>
      )}

      {/* reveal */}
      {active && reveal && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
            {reveal.cards.map((c, i) => (
              <button
                key={i}
                onClick={() => flip(i)}
                className="aspect-[3/4.4] [perspective:900px]"
                aria-label={reveal.flipped[i] ? c.name : "Face down card, tap to reveal"}
              >
                <div
                  className="relative h-full w-full transition-transform duration-500 motion-reduce:transition-none"
                  style={{ transformStyle: "preserve-3d", transform: reveal.flipped[i] ? "rotateY(180deg)" : "none" }}
                >
                  <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                    <KardBack />
                  </div>
                  <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <KardFace card={c} />
                    {reveal.flipped[i] && reveal.newIds.includes(c.id) && (
                      <span className="absolute -left-1.5 -top-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold" style={{ background: "var(--kz-leaf)", color: "var(--kz-panel)" }}>
                        NEW
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          {allFlipped ? (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <p className="text-base font-bold">
                {reveal.newIds.length > 0
                  ? `${reveal.newIds.length} new card${reveal.newIds.length > 1 ? "s" : ""} for the binder!`
                  : "All doubles this time. The binder counters go up!"}
              </p>
              <button onClick={() => setReveal(null)} className="kz-btn-ghost !min-h-[2.75rem]">To my binder</button>
            </div>
          ) : (
            <p className="mt-4 text-center text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
              Tap each card to flip it over.
            </p>
          )}
        </div>
      )}

      {/* already opened today */}
      {active && !reveal && !canOpen && today !== "" && (
        <div className="kz-tile mt-6 p-6 md:p-8" style={{ background: "var(--kz-cobalt-soft)" }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Today&apos;s pack: opened!</h2>
              <p className="mt-1 text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
                A fresh pack lands in {untilTomorrow()}. Here&apos;s what you pulled today.
              </p>
            </div>
            <Mark shape="gem" size={30} style={{ color: "var(--kz-cobalt)" }} />
          </div>
          {lastPulls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
              {lastPulls.map((c, i) => (
                <div key={i} className="aspect-[3/3.6]">
                  <KardFace card={c} mini />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* binder */}
      {active && !reveal && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-2 text-2xl font-extrabold tracking-tight">My binder</h2>
            <button className="kz-chip" data-on={seriesTab === "all"} onClick={() => setSeriesTab("all")}>
              All
            </button>
            {kardSeries.map((s) => {
              const got = kards.filter((k) => k.series === s.id && collection[k.id]).length;
              const total = kards.filter((k) => k.series === s.id).length;
              return (
                <button key={s.id} className="kz-chip" data-on={seriesTab === s.id} onClick={() => setSeriesTab(s.id)}>
                  {s.label}
                  <span className="ml-2 text-xs opacity-70">{got}/{total}</span>
                </button>
              );
            })}
            <span className="ml-auto text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
              {owned}/{kards.length} collected
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {binderCards.map((c) => {
              const count = collection[c.id] ?? 0;
              return count > 0 ? (
                <div key={c.id} className="aspect-[3/3.6]">
                  <KardFace card={c} mini count={count} />
                </div>
              ) : (
                <div
                  key={c.id}
                  className="flex aspect-[3/3.6] flex-col items-center justify-center gap-1.5 rounded-[16px] border-2 border-dashed"
                  style={{ borderColor: RARITY[c.rarity].border === "var(--kz-line)" ? "var(--kz-line)" : RARITY[c.rarity].border, opacity: 0.55 }}
                >
                  <span className="text-2xl font-extrabold" style={{ color: "var(--kz-ink-soft)" }}>?</span>
                  <span className="text-[11px] font-bold" style={{ color: "var(--kz-ink-soft)" }}>{RARITY[c.rarity].label}</span>
                </div>
              );
            })}
          </div>

          {owned >= kards.length && (
            <p className="mt-5 flex items-center justify-center gap-2 text-base font-bold">
              <Mark shape="star" size={18} style={{ color: "var(--kz-marigold)" }} />
              Master collector! Every single Kard is in your binder.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
