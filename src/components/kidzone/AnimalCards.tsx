"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { kidAnimals, type KidAnimal } from "@/lib/kidzone";
import Mark from "./Mark";
import { playCall } from "./animalSounds";

const FAV_KEY = "kz-animals-fav";
const BEST_KEY = "kz-safari-best";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Meet the animals: flip cards ---------- */

function AnimalCard({ animal, fav, onFav }: { animal: KidAnimal; fav: boolean; onFav: () => void }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{ perspective: "1400px" }}>
      <div
        className="relative h-[380px] transition-transform duration-500 motion-reduce:transition-none"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}
      >
        {/* front: the photograph */}
        <button
          onClick={() => setFlipped(true)}
          className="kz-tile absolute inset-0 overflow-hidden p-0 text-left"
          style={{ backfaceVisibility: "hidden", background: "var(--kz-panel)" }}
          aria-label={`${animal.name}, tap to flip`}
        >
          <Image
            src={`${animal.photo}?w=800&q=80&auto=format`}
            alt={animal.name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
          <span
            className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-3.5 text-xl font-extrabold tracking-tight"
            style={{ background: "var(--kz-panel)", borderTop: "1px solid var(--kz-line)" }}
          >
            {animal.name}
            <span className="text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>Flip</span>
          </span>
        </button>
        {/* back: facts + sound */}
        <div
          className="kz-panel absolute inset-0 flex flex-col p-6"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-2xl font-extrabold tracking-tight">{animal.name}</h3>
            <button
              onClick={onFav}
              aria-label={fav ? `Remove ${animal.name} from favorites` : `Add ${animal.name} to favorites`}
              aria-pressed={fav}
            >
              <Mark shape="star" size={26} style={{ color: fav ? "var(--kz-marigold)" : "var(--kz-line)" }} />
            </button>
          </div>
          <ul className="mt-3 space-y-2.5 text-[15px] font-semibold leading-snug">
            {animal.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p
            className="mt-3 rounded-xl p-3 text-[15px] font-bold leading-snug"
            style={{ background: "var(--kz-leaf-soft)" }}
          >
            Wow: {animal.wow}
          </p>
          <div className="mt-auto flex items-center justify-between pt-3">
            <button onClick={() => playCall(animal.call)} className="kz-btn !min-h-[2.5rem] !text-sm">
              {animal.callLabel}
            </button>
            <button onClick={() => setFlipped(false)} className="text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
              Back to photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sound Safari: guess the call ---------- */

function SoundSafari({ best, onBest }: { best: number; onBest: (n: number) => void }) {
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [played, setPlayed] = useState(false);

  const { answer, choices } = useMemo(() => {
    const pool = shuffle(kidAnimals);
    return { answer: pool[0], choices: shuffle(pool.slice(0, 3)) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const guess = (id: string) => {
    if (picked) return;
    setPicked(id);
    if (id === answer.id) {
      const s = streak + 1;
      setStreak(s);
      if (s > best) onBest(s);
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="kz-panel mx-auto max-w-2xl p-7 md:p-9">
      <div className="flex items-center justify-between text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
        <span>Streak: {streak}</span>
        <span>Best: {Math.max(best, streak)}</span>
      </div>
      <h2 className="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">Who is making this sound?</h2>
      <button
        onClick={() => {
          playCall(answer.call);
          setPlayed(true);
        }}
        className="kz-btn mt-5"
      >
        {played ? "Play it again" : "Play the sound"}
      </button>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {choices.map((a) => {
          const revealed = picked !== null;
          const isAnswer = a.id === answer.id;
          const isPicked = picked === a.id;
          return (
            <button
              key={a.id}
              onClick={() => guess(a.id)}
              disabled={revealed || !played}
              className="overflow-hidden rounded-[14px] border-2 text-left transition-transform duration-100 enabled:hover:-translate-y-0.5 disabled:cursor-default motion-reduce:transition-none"
              style={{
                borderColor: revealed ? (isAnswer ? "var(--kz-leaf)" : isPicked ? "var(--kz-brick)" : "var(--kz-line)") : "var(--kz-line)",
                opacity: !played ? 0.5 : revealed && !isAnswer && !isPicked ? 0.45 : 1,
              }}
              aria-label={a.name}
            >
              <span className="relative block aspect-square">
                <Image src={`${a.photo}?w=400&q=75&auto=format`} alt="" fill sizes="200px" className="object-cover" />
              </span>
              <span className="block px-3 py-2 text-sm font-extrabold">{a.name}</span>
            </button>
          );
        })}
      </div>
      {!played && (
        <p className="mt-4 text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
          Play the sound first, then take your guess.
        </p>
      )}
      {picked && (
        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-extrabold">
            {picked === answer.id ? "You got it!" : `It was the ${answer.name.toLowerCase()}.`}
          </span>
          <button
            onClick={() => {
              setPicked(null);
              setPlayed(false);
              setRound((r) => r + 1);
            }}
            className="kz-btn"
          >
            Next sound
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Shell ---------- */

export default function AnimalCards() {
  const [mode, setMode] = useState<"meet" | "safari">("meet");
  const [favs, setFavs] = useState<string[]>([]);
  const [best, setBest] = useState(0);

  useEffect(() => {
    try {
      setFavs(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
      setBest(Number(localStorage.getItem(BEST_KEY) || 0));
    } catch {}
  }, []);

  const toggleFav = (id: string) => {
    const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    setFavs(next);
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
    } catch {}
  };

  const saveBest = (n: number) => {
    setBest(n);
    try {
      localStorage.setItem(BEST_KEY, String(n));
    } catch {}
  };

  const ordered = [...kidAnimals].sort((a, b) => Number(favs.includes(b.id)) - Number(favs.includes(a.id)));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button className="kz-chip" data-on={mode === "meet"} onClick={() => setMode("meet")}>
          Meet the animals
        </button>
        <button className="kz-chip" data-on={mode === "safari"} onClick={() => setMode("safari")}>
          Sound Safari
        </button>
        {favs.length > 0 && mode === "meet" && (
          <span className="ml-auto flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
            <Mark shape="star" size={15} style={{ color: "var(--kz-marigold)" }} />
            {favs.length} favorite{favs.length === 1 ? "" : "s"} first
          </span>
        )}
      </div>

      {mode === "meet" ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((a) => (
            <AnimalCard key={a.id} animal={a} fav={favs.includes(a.id)} onFav={() => toggleFav(a.id)} />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <SoundSafari best={best} onBest={saveBest} />
        </div>
      )}
    </div>
  );
}
