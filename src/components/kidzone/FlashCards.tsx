"use client";

import { useState } from "react";
import { flashDecks, type FlashDeck } from "@/lib/kidzone";

const ACCENT = "#7F9CF5";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashCards() {
  const [deck, setDeck] = useState<FlashDeck | null>(null);
  const [queue, setQueue] = useState<FlashDeck["cards"]>([]);
  const [flipped, setFlipped] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const [againCount, setAgainCount] = useState(0);

  const start = (d: FlashDeck) => {
    setDeck(d);
    setQueue(shuffle(d.cards));
    setFlipped(false);
    setDoneCount(0);
    setAgainCount(0);
  };

  const answer = (gotIt: boolean) => {
    setFlipped(false);
    setQueue((q) => {
      const [current, ...rest] = q;
      if (gotIt) return rest;
      return [...rest, current];
    });
    if (gotIt) setDoneCount((n) => n + 1);
    else setAgainCount((n) => n + 1);
  };

  if (!deck) {
    return (
      <div className="grid gap-5 sm:grid-cols-3">
        {flashDecks.map((d) => (
          <button
            key={d.id}
            onClick={() => start(d)}
            className="rounded-3xl border-[3px] border-[#2B2440] bg-white p-6 text-left transition-transform duration-150 hover:-translate-y-1"
            style={{ boxShadow: "5px 5px 0 #2B2440" }}
          >
            <span className="text-4xl" aria-hidden="true">{d.emoji}</span>
            <span className="mt-2 block text-2xl font-extrabold">{d.title}</span>
            <span className="block text-sm font-semibold opacity-60">{d.cards.length} cards</span>
          </button>
        ))}
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="rounded-3xl border-[3px] border-[#2B2440] bg-white p-8 text-center" style={{ boxShadow: "6px 6px 0 #2B2440" }}>
        <div className="text-6xl">🏆</div>
        <h2 className="mt-3 text-4xl font-extrabold">Deck finished!</h2>
        <p className="mt-2 text-lg font-semibold opacity-70">
          {doneCount} cards learned{againCount > 0 ? ` · ${againCount} needed a second look` : " · perfect run!"}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => start(deck)} className="rounded-full border-2 border-[#2B2440] px-5 py-2 text-lg font-bold" style={{ background: ACCENT, color: "white" }}>
            Run it again
          </button>
          <button onClick={() => setDeck(null)} className="rounded-full border-2 border-[#2B2440] bg-white px-5 py-2 text-lg font-bold">
            Pick another deck
          </button>
        </div>
      </div>
    );
  }

  const card = queue[0];

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-bold opacity-70">
        <span>
          {deck.emoji} {deck.title}
        </span>
        <span>{queue.length} to go</span>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="mt-4 block w-full"
        style={{ perspective: "1200px" }}
        aria-label={flipped ? "Card back" : "Card front, tap to flip"}
      >
        <div
          className="relative mx-auto h-64 w-full max-w-xl transition-transform duration-500"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center rounded-3xl border-[3px] border-[#2B2440] bg-white p-6 text-center text-5xl font-extrabold"
            style={{ backfaceVisibility: "hidden", boxShadow: "6px 6px 0 #2B2440" }}
          >
            {card.front}
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center rounded-3xl border-[3px] border-[#2B2440] p-6 text-center text-3xl font-extrabold"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: ACCENT, color: "white", boxShadow: "6px 6px 0 #2B2440" }}
          >
            {card.back}
          </div>
        </div>
      </button>
      <p className="mt-3 text-center text-sm font-bold opacity-60">Tap the card to flip it</p>

      {flipped && (
        <div className="mt-5 flex justify-center gap-4">
          <button onClick={() => answer(false)} className="rounded-full border-2 border-[#2B2440] bg-white px-6 py-2.5 text-lg font-bold">
            Practice again 🔁
          </button>
          <button onClick={() => answer(true)} className="rounded-full border-2 border-[#2B2440] px-6 py-2.5 text-lg font-bold" style={{ background: "#9BE8A8" }}>
            Got it! ✅
          </button>
        </div>
      )}
    </div>
  );
}
