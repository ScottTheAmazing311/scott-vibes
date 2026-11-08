"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Mark from "./Mark";
import { brew, ingredient, INGREDIENTS, KINDS, kindLabel, MAX_PICKS, potColor, TOTAL_KINDS, type Ingredient, type Recipe } from "./cauldronData";
import { loadEngine, makeCreature, thumbnail, type Sprite } from "./creatureEngine";

const STORE = "kz-cauldron-v1";
const BOOK_LIMIT = 120;
const BREW_MS = 1100;

interface Saved {
  id: string;
  name: string;
  family: string;
  archetype: string;
  recipe: Recipe;
  picks: string[];
  thumb: string;
  at: number;
}

interface Store {
  book: Saved[];
  /** "family/archetype" of every kind ever brewed */
  found: string[];
}

const EMPTY: Store = { book: [], found: [] };

/* ---------- pixel art ---------- */

/** 12×12 ingredient art (or any grid) as crisp SVG, one path per color. */
function PixelArt({ art, palette, size = 48, className = "" }: { art: string[]; palette: Record<string, string>; size?: number; className?: string }) {
  const paths = useMemo(() => {
    const d: Record<string, string> = {};
    art.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === "." || !palette[ch]) continue;
        d[ch] = (d[ch] ?? "") + `M${x} ${y}h1v1h-1z`;
      }
    });
    return Object.entries(d);
  }, [art, palette]);
  const w = Math.max(...art.map((r) => r.length));
  return (
    <svg width={size} height={(size * art.length) / w} viewBox={`0 0 ${w} ${art.length}`} shapeRendering="crispEdges" aria-hidden="true" className={className}>
      {paths.map(([ch, d]) => (
        <path key={ch} d={d} fill={palette[ch]} />
      ))}
    </svg>
  );
}

// The pot, drawn on the same pixel grid as everything else. "c"/"h" take the brew color.
const POT = [
  "." + ".".repeat(22) + ".",
  ".." + "k".repeat(20) + "..",
  ".k" + "l".repeat(20) + "k.",
  ".ki" + "ccchcccccccchccccc" + "ik.",
  ".k" + "l".repeat(20) + "k.",
  "..k" + "i".repeat(18) + "k..",
  ".k" + "i".repeat(20) + "k.",
  ".k" + "l" + "i".repeat(19) + "k.",
  ".k" + "l" + "i".repeat(19) + "k.",
  ".k" + "i".repeat(20) + "k.",
  "..k" + "i".repeat(18) + "k..",
  "...k" + "i".repeat(16) + "k...",
  "...." + "k".repeat(16) + "....",
  "....kk" + ".".repeat(12) + "kk....",
  "...kk" + ".".repeat(14) + "kk...",
];

const FLAME = ingredient("ember")!;

/* ---------- the creature ---------- */

/** Plays a creature's sprite-sheet clips on a canvas at a whole-number pixel scale. */
function CreatureCanvas({ sprite, scale, clip, onClipEnd }: { sprite: Sprite; scale: number; clip: "idle" | "action"; onClipEnd?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const end = useRef(onClipEnd);
  useEffect(() => {
    end.current = onClipEnd;
  }, [onClipEnd]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.max(1, Math.round(window.devicePixelRatio || 1));
    const { frameWidth: fw, frameHeight: fh } = sprite;
    canvas.width = fw * scale * dpr;
    canvas.height = fh * scale * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    const frames = (sprite.clips.find((c) => c.name.startsWith(clip)) ?? sprite.clips[0]).frames;
    const loop = clip === "idle";
    let i = 0;
    let due = performance.now() + frames[0][2];
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const [x, y] = frames[i];
      ctx.drawImage(sprite.sheet, x, y, fw, fh, 0, 0, canvas.width, canvas.height);
    };
    const tick = (now: number) => {
      if (now >= due) {
        if (i === frames.length - 1 && !loop) {
          end.current?.();
          return;
        }
        i = (i + 1) % frames.length;
        due = now + frames[i][2];
        draw();
      }
      raf = requestAnimationFrame(tick);
    };
    draw();
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sprite, scale, clip]);

  return <canvas ref={ref} style={{ width: sprite.frameWidth * scale, height: sprite.frameHeight * scale, imageRendering: "pixelated" }} />;
}

const fitScale = (s: Sprite, w: number, h: number) => Math.max(1, Math.min(6, Math.floor(Math.min(w / s.frameWidth, h / s.frameHeight))));

/* ---------- the game ---------- */

export default function CreatureCauldron() {
  const reduce = useReducedMotion() ?? false;
  const [store, setStore] = useState<Store>(EMPTY);
  const [picks, setPicks] = useState<string[]>([]);
  const [engine, setEngine] = useState<"loading" | "ready" | "failed">("loading");
  const [brewing, setBrewing] = useState(false);
  const [creature, setCreature] = useState<{ sprite: Sprite; recipe: Recipe; picks: string[]; surprise: boolean; kept: boolean; firstOfKind: boolean } | null>(null);
  const [clip, setClip] = useState<"idle" | "action">("idle");
  const [fizzled, setFizzled] = useState(false);
  const [splash, setSplash] = useState(0);
  const [open, setOpen] = useState<Saved | null>(null);
  const storeRef = useRef(store);
  useEffect(() => {
    storeRef.current = store;
  }, [store]);

  useEffect(() => {
    let saved = EMPTY;
    try {
      saved = { ...EMPTY, ...JSON.parse(localStorage.getItem(STORE) || "{}") };
    } catch {}
    // read saved state after mount so the server render and first client render match
    const t = setTimeout(() => setStore(saved), 0);
    loadEngine()
      .then(() => setEngine("ready"))
      .catch(() => setEngine("failed"));
    return () => clearTimeout(t);
  }, []);

  const persist = (s: Store) => {
    storeRef.current = s;
    setStore(s);
    try {
      localStorage.setItem(STORE, JSON.stringify(s));
    } catch {}
  };

  const add = (id: string) => {
    if (picks.length >= MAX_PICKS || brewing) return;
    setPicks([...picks, id]);
    setSplash((n) => n + 1);
    setFizzled(false);
  };
  const removeAt = (i: number) => !brewing && setPicks(picks.filter((_, j) => j !== i));
  const empty = () => {
    setPicks([]);
    setCreature(null);
  };

  const stir = useCallback(
    async (pot: string[]) => {
      if (!pot.length || brewing || engine !== "ready") return;
      setBrewing(true);
      setFizzled(false);
      setCreature(null);
      const { recipe, surprise } = brew(pot);
      const started = performance.now();
      // two frames so the bubbling starts before the generator takes over the main thread
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      try {
        const sprite = await makeCreature(recipe);
        const wait = BREW_MS - (performance.now() - started);
        if (wait > 0 && !reduce) await new Promise((r) => setTimeout(r, wait));
        const key = `${sprite.family}/${sprite.archetype}`;
        const current = storeRef.current;
        const firstOfKind = !current.found.includes(key);
        if (firstOfKind) {
          const next = { ...current, found: [...current.found, key] };
          storeRef.current = next;
          setStore(next);
          try {
            localStorage.setItem(STORE, JSON.stringify(next));
          } catch {}
        }
        setClip("idle");
        setCreature({ sprite, recipe, picks: pot, surprise, kept: false, firstOfKind });
      } catch {
        setFizzled(true);
      } finally {
        setBrewing(false);
      }
    },
    [brewing, engine, reduce]
  );

  const keep = () => {
    if (!creature || creature.kept) return;
    const entry: Saved = {
      id: `c-${Date.now()}`,
      name: creature.sprite.name,
      family: creature.sprite.family,
      archetype: creature.sprite.archetype,
      recipe: creature.recipe,
      picks: creature.picks,
      thumb: thumbnail(creature.sprite),
      at: Date.now(),
    };
    persist({ ...store, book: [entry, ...store.book].slice(0, BOOK_LIMIT) });
    setCreature({ ...creature, kept: true });
  };

  const release = (id: string) => {
    persist({ ...store, book: store.book.filter((b) => b.id !== id) });
    setOpen(null);
  };

  const brewColor = potColor(creature ? creature.picks : picks) ?? "#4a5679";
  const counts = picks.reduce<Record<string, number>>((a, id) => ({ ...a, [id]: (a[id] ?? 0) + 1 }), {});
  const full = picks.length >= MAX_PICKS;
  const stirLabel = engine === "loading" ? "Warming up the cauldron..." : engine === "failed" ? "The cauldron won't light" : brewing ? "Bubbling..." : "Stir it up!";

  return (
    <div>
      {/* the stage: pot, creature and what's in the pot */}
      <div className="cz-stage grid gap-0 md:grid-cols-[1fr_19rem]" style={{ "--brew": brewColor } as React.CSSProperties}>
        <div className="relative flex min-h-[30rem] flex-col items-center px-4 pb-6 pt-5">
          {/* five slots for ingredients */}
          <div className="flex gap-2" aria-label="In the pot">
            {Array.from({ length: MAX_PICKS }, (_, i) => {
              const ing = ingredient(picks[i] ?? "");
              return (
                <button
                  key={i}
                  onClick={() => removeAt(i)}
                  disabled={!ing || brewing}
                  aria-label={ing ? `Take out the ${ing.name}` : "Empty slot"}
                  className="cz-slot grid h-14 w-14 place-items-center"
                  data-filled={!!ing}
                >
                  <AnimatePresence>
                    {ing && (
                      <motion.span
                        key={`${i}-${ing.id}`}
                        initial={reduce ? false : { scale: 0.3, y: -14, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.3, opacity: 0, transition: { duration: 0.15 } }}
                        transition={{ type: "spring", stiffness: 500, damping: 18 }}
                      >
                        <PixelArt art={ing.art} palette={ing.palette} size={36} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {/* where the creature appears */}
          <div className="relative flex w-full flex-1 items-end justify-center pb-1 pt-4">
            <AnimatePresence mode="wait">
              {creature ? (
                <motion.button
                  key={creature.recipe.seed}
                  onClick={() => setClip("action")}
                  aria-label={`${creature.sprite.name} the ${kindLabel(creature.sprite.family, creature.sprite.archetype)}. Tap to see what it does.`}
                  className="relative z-10 cursor-pointer"
                  initial={reduce ? false : { y: 70, scale: 0.4, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 40, scale: 0.6, opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 260, damping: 15 }}
                >
                  {!reduce && <Burst />}
                  <CreatureCanvas sprite={creature.sprite} scale={fitScale(creature.sprite, 300, 230)} clip={clip} onClipEnd={() => setClip("idle")} />
                </motion.button>
              ) : (
                <motion.p
                  key={brewing ? "brewing" : fizzled ? "fizzle" : picks.length ? "ready" : "empty"}
                  className="max-w-[16rem] pb-6 text-center text-base font-bold"
                  style={{ color: "rgba(251,246,230,0.7)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {brewing
                    ? "Something is stirring in there..."
                    : fizzled
                      ? "The cauldron fizzled. Give it another stir!"
                      : picks.length
                        ? full
                          ? "The pot is full. Stir it up!"
                          : `${MAX_PICKS - picks.length} more can fit, or stir it up now.`
                        : "Pick up to 5 ingredients from the shelf below."}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* the pot */}
          <div className={`cz-pot relative ${brewing ? "cz-brewing" : ""}`}>
            <span key={splash} className={splash && !reduce ? "cz-splash" : ""} aria-hidden="true" />
            <span className="cz-bubbles" aria-hidden="true">
              {Array.from({ length: 7 }, (_, i) => (
                <i key={i} style={{ "--i": i } as React.CSSProperties} />
              ))}
            </span>
            <PixelArt art={POT} palette={{ k: "#141826", l: "#6a7394", i: "#3a4160", c: brewColor, h: "#ffffffaa" }} size={216} className="relative" />
            <span className="cz-flames" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ "--i": i } as React.CSSProperties}>
                  <PixelArt art={FLAME.art} palette={FLAME.palette} size={30} />
                </span>
              ))}
            </span>
          </div>
        </div>

        {/* what's happening */}
        <div className="cz-side flex flex-col justify-center gap-4 p-6">
          {creature ? (
            <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
              {creature.firstOfKind && (
                <p className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold" style={{ background: "var(--kz-marigold)", color: "var(--kz-ink)" }}>
                  <Mark shape="star" size={12} /> New kind discovered!
                </p>
              )}
              <h2 className="text-4xl font-extrabold tracking-tight" style={{ color: "#fbf6e6" }}>
                {creature.sprite.name}
              </h2>
              <p className="mt-1 text-base font-bold" style={{ color: "var(--brew)" }}>
                the {kindLabel(creature.sprite.family, creature.sprite.archetype)}
              </p>
              {creature.surprise && (
                <p className="mt-2 text-sm font-semibold" style={{ color: "rgba(251,246,230,0.7)" }}>
                  No creature parts went in, so the cauldron picked a surprise.
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {creature.picks.map((id, i) => {
                  const ing = ingredient(id)!;
                  return (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full py-0.5 pl-1 pr-2.5 text-xs font-bold" style={{ background: "rgba(251,246,230,0.1)", color: "#fbf6e6" }}>
                      <PixelArt art={ing.art} palette={ing.palette} size={18} />
                      {ing.name}
                    </span>
                  );
                })}
              </div>
              <p className="mt-3 text-sm font-semibold" style={{ color: "rgba(251,246,230,0.6)" }}>
                Tap {creature.sprite.name} to see what it does.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={keep} disabled={creature.kept} className="kz-btn" style={{ background: "var(--kz-marigold)", color: "var(--kz-ink)" }}>
                  {creature.kept ? "In your book!" : "Keep it"}
                </button>
                <button onClick={() => stir(creature.picks)} className="kz-btn-ghost">
                  Mix again
                </button>
              </div>
              <button onClick={empty} className="mt-3 text-sm font-bold underline-offset-4 hover:underline" style={{ color: "rgba(251,246,230,0.65)" }}>
                Empty the pot
              </button>
            </motion.div>
          ) : (
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: "#fbf6e6" }}>
                {picks.length ? "In the pot" : "The pot is empty"}
              </h2>
              <p className="mt-1 text-sm font-semibold" style={{ color: "rgba(251,246,230,0.65)" }}>
                Creature parts decide what hatches. Magic changes its colors, size and spark. Every stir makes someone new.
              </p>
              <button
                onClick={() => stir(picks)}
                disabled={!picks.length || brewing || engine !== "ready"}
                className="kz-btn mt-5 w-full disabled:opacity-50"
                style={{ background: "var(--kz-marigold)", color: "var(--kz-ink)" }}
              >
                {stirLabel}
              </button>
              {picks.length > 0 && !brewing && (
                <button onClick={empty} className="mt-3 text-sm font-bold underline-offset-4 hover:underline" style={{ color: "rgba(251,246,230,0.65)" }}>
                  Empty the pot
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* the shelf */}
      <div className="mt-6 grid gap-6 md:grid-cols-[3fr_2fr]">
        <Shelf title="Creature parts" line="These decide what hatches." items={INGREDIENTS.filter((i) => i.kind === "body")} counts={counts} full={full || brewing} onAdd={add} />
        <Shelf title="Magic" line="Colors, size, patterns and pep." items={INGREDIENTS.filter((i) => i.kind === "magic")} counts={counts} full={full || brewing} onAdd={add} />
      </div>

      <Book store={store} onOpen={setOpen} />

      <p className="mt-10 text-xs font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
        Creatures are made by{" "}
        <a href="https://github.com/idlerunner00/procedural-pixel-creatures" className="underline">
          Procedural Pixel Creatures
        </a>{" "}
        by idlerunner00 (MIT), running right in your browser.{" "}
        <a href="/kidzone/cauldron/THIRD_PARTY_NOTICES.md" className="underline">
          Notices
        </a>
      </p>

      {open && <BookPage saved={open} onClose={() => setOpen(null)} onRelease={() => release(open.id)} />}
    </div>
  );
}

/* ---------- shelf ---------- */

function Shelf({ title, line, items, counts, full, onAdd }: { title: string; line: string; items: Ingredient[]; counts: Record<string, number>; full: boolean; onAdd: (id: string) => void }) {
  return (
    <section className="kz-panel p-5">
      <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
      <p className="text-sm font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
        {line}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
        {items.map((ing) => (
          <button
            key={ing.id}
            onClick={() => onAdd(ing.id)}
            disabled={full}
            className="kz-tile relative flex flex-col items-center gap-1.5 px-1.5 pb-2.5 pt-3 disabled:opacity-50"
            style={{ background: "var(--kz-panel)" }}
          >
            <PixelArt art={ing.art} palette={ing.palette} size={44} />
            <span className="text-center text-[13px] font-extrabold leading-tight">{ing.name}</span>
            {counts[ing.id] > 0 && (
              <span className="absolute right-1.5 top-1.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-extrabold" style={{ background: "var(--kz-ink)", color: "var(--kz-panel)" }}>
                {counts[ing.id]}
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------- creature book ---------- */

function Book({ store, onOpen }: { store: Store; onOpen: (s: Saved) => void }) {
  const found = new Set(store.found);
  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-3xl font-extrabold tracking-tight">My Creature Book</h2>
        <span className="text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
          {store.book.length} kept &middot; {found.size} of {TOTAL_KINDS} kinds found
        </span>
      </div>

      {store.book.length === 0 ? (
        <p className="kz-panel mt-4 p-6 text-base font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
          Creatures you keep live here. Stir one up and tap Keep it.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {store.book.map((b) => (
            <button key={b.id} onClick={() => onOpen(b)} className="kz-tile flex flex-col items-center gap-1 p-3" style={{ background: "var(--kz-panel)" }}>
              <span className="grid h-20 w-full place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.thumb} alt="" className="h-full w-auto max-w-full object-contain" style={{ imageRendering: "pixelated" }} />
              </span>
              <span className="w-full truncate text-center text-sm font-extrabold">{b.name}</span>
              <span className="w-full truncate text-center text-[11px] font-bold" style={{ color: "var(--kz-ink-soft)" }}>
                {kindLabel(b.family, b.archetype)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* every kind the cauldron can make */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {KINDS.map((k) => (
          <div key={k.family} className="kz-panel p-4">
            <p className="text-sm font-extrabold">
              {k.label}{" "}
              <span className="font-bold" style={{ color: "var(--kz-ink-soft)" }}>
                {k.archetypes.filter(([a]) => found.has(`${k.family}/${a}`)).length}/{k.archetypes.length}
              </span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {k.archetypes.map(([a, label]) =>
                found.has(`${k.family}/${a}`) ? (
                  <span key={a} className="kz-chip !min-h-0 !px-2.5 !py-0.5 !text-xs" data-on="true">
                    {label}
                  </span>
                ) : (
                  <span key={a} className="kz-chip !min-h-0 !px-2.5 !py-0.5 !text-xs" style={{ borderStyle: "dashed", color: "var(--kz-ink-soft)" }} aria-label="Not found yet">
                    ?
                  </span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BookPage({ saved, onClose, onRelease }: { saved: Saved; onClose: () => void; onRelease: () => void }) {
  const [sprite, setSprite] = useState<Sprite | null>(null);
  const [clip, setClip] = useState<"idle" | "action">("idle");
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    let live = true;
    makeCreature(saved.recipe)
      .then((s) => live && setSprite(s))
      .catch(() => {});
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      live = false;
      window.removeEventListener("keydown", onKey);
    };
  }, [saved, onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={saved.name} className="fixed inset-0 z-50 grid place-items-center p-5" style={{ background: "rgba(50,59,82,0.6)" }} onClick={onClose}>
      <div className="cz-stage w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="grid h-60 place-items-center">
          {sprite ? (
            <button onClick={() => setClip("action")} aria-label={`Tap ${saved.name} to see what it does`}>
              <CreatureCanvas sprite={sprite} scale={fitScale(sprite, 280, 220)} clip={clip} onClipEnd={() => setClip("idle")} />
            </button>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={saved.thumb} alt="" className="h-24 w-auto opacity-60" style={{ imageRendering: "pixelated" }} />
          )}
        </div>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight" style={{ color: "#fbf6e6" }}>
          {saved.name}
        </h2>
        <p className="text-sm font-bold" style={{ color: "rgba(251,246,230,0.7)" }}>
          the {kindLabel(saved.family, saved.archetype)}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {saved.picks.map((id, i) => {
            const ing = ingredient(id);
            return ing ? (
              <span key={i} className="inline-flex items-center gap-1 rounded-full py-0.5 pl-1 pr-2.5 text-xs font-bold" style={{ background: "rgba(251,246,230,0.1)", color: "#fbf6e6" }}>
                <PixelArt art={ing.art} palette={ing.palette} size={18} />
                {ing.name}
              </span>
            ) : null;
          })}
        </div>
        <div className="mt-5 flex justify-center gap-2">
          <button onClick={onClose} className="kz-btn-ghost">
            Close
          </button>
          {confirm ? (
            <button onClick={onRelease} className="kz-btn" style={{ background: "var(--kz-brick)" }}>
              Yes, let it go
            </button>
          ) : (
            <button onClick={() => setConfirm(true)} className="text-sm font-bold" style={{ color: "rgba(251,246,230,0.7)" }}>
              Let it go
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Pixel sparks fly out once as the creature pops out of the pot. */
function Burst() {
  return (
    <span className="pointer-events-none absolute left-1/2 top-1/2 -z-10" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <motion.i
          key={i}
          className="absolute block h-2.5 w-2.5"
          style={{ background: i % 3 ? "var(--brew)" : "#fbf6e6", rotate: (360 / 12) * i, originY: 0, marginLeft: -5 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: [20, 150], opacity: [0, 1, 0] }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}
    </span>
  );
}
