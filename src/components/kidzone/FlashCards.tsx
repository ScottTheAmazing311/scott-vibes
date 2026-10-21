"use client";

import { useState } from "react";
import { flashDecks, type FlashDeck } from "@/lib/kidzone";

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
            className="kz-tile p-6"
            style={{ background: "var(--kz-cobalt-soft)" }}
          >
            <span className="block text-2xl font-extrabold tracking-tight">{d.title}</span>
            <span className="mt-1 block text-sm font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
              {d.cards.length} cards
            </span>
          </button>
        ))}
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="kz-panel mx-auto max-w-xl p-10 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight">Deck finished!</h2>
        <p className="mt-2 text-lg font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
          {doneCount} cards learned{againCount > 0 ? `, ${againCount} took a second look` : ". A perfect run!"}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => start(deck)} className="kz-btn">
            Run it again
          </button>
          <button onClick={() => setDeck(null)} className="kz-btn-ghost">
            Pick another deck
          </button>
        </div>
      </div>
    );
  }

  const card = queue[0];

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
        <span>{deck.title}</span>
        <span>{queue.length} to go</span>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="mt-4 block w-full"
        style={{ perspective: "1200px" }}
        aria-label={flipped ? "Card back" : "Card front, tap to flip"}
      >
        <div
          className="relative mx-auto h-64 w-full max-w-xl transition-transform duration-500 motion-reduce:transition-none"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}
        >
          <div
            className="kz-panel absolute inset-0 flex items-center justify-center p-6 text-center text-5xl font-extrabold tracking-tight"
            style={{ backfaceVisibility: "hidden" }}
          >
            {card.front}
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center rounded-[20px] p-6 text-center text-3xl font-extrabold"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "var(--kz-cobalt)",
              color: "#fffdf7",
              boxShadow: "var(--kz-shadow)",
            }}
          >
            {card.back}
          </div>
        </div>
      </button>
      <p className="mt-3 text-center text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
        Tap the card to flip it
      </p>

      {flipped && (
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={() => answer(false)} className="kz-btn-ghost">
            Practice again
          </button>
          <button onClick={() => answer(true)} className="kz-btn">
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
