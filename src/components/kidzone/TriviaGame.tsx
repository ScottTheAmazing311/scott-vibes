"use client";

import { useMemo, useState } from "react";
import { triviaCategories, type TriviaCategory } from "@/lib/kidzone";

const ACCENT = "#FFD166";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TriviaGame() {
  const [category, setCategory] = useState<TriviaCategory | null>(null);
  const [round, setRound] = useState(0); // bump to reshuffle on replay
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const questions = useMemo(
    () =>
      category
        ? shuffle(category.questions).map((q) => {
            const order = shuffle(q.choices.map((_, i) => i));
            return { ...q, choices: order.map((i) => q.choices[i]), answer: order.indexOf(q.answer) };
          })
        : [],
    [category, round],
  );

  const start = (c: TriviaCategory) => {
    setCategory(c);
    setRound((r) => r + 1);
    setIndex(0);
    setScore(0);
    setPicked(null);
  };

  if (!category) {
    return (
      <div className="grid gap-5 sm:grid-cols-3">
        {triviaCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => start(c)}
            className="rounded-3xl border-[3px] border-[#2B2440] bg-white p-6 text-left transition-transform duration-150 hover:-translate-y-1"
            style={{ boxShadow: "5px 5px 0 #2B2440" }}
          >
            <span className="text-4xl" aria-hidden="true">{c.emoji}</span>
            <span className="mt-2 block text-2xl font-extrabold">{c.title}</span>
            <span className="block text-sm font-semibold opacity-60">{c.questions.length} questions</span>
          </button>
        ))}
      </div>
    );
  }

  if (index >= questions.length) {
    const stars = score === questions.length ? 3 : score >= questions.length - 2 ? 2 : score >= Math.ceil(questions.length / 2) ? 1 : 0;
    return (
      <div className="rounded-3xl border-[3px] border-[#2B2440] bg-white p-8 text-center" style={{ boxShadow: "6px 6px 0 #2B2440" }}>
        <div className="text-6xl">{["😅", "🙂", "😃", "🤩"][stars]}</div>
        <h2 className="mt-3 text-4xl font-extrabold">
          {score} out of {questions.length}!
        </h2>
        <div className="mt-2 text-4xl" aria-label={`${stars} of 3 stars`}>
          {"★".repeat(stars)}
          <span className="opacity-20">{"★".repeat(3 - stars)}</span>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => start(category)}
            className="rounded-full border-2 border-[#2B2440] px-5 py-2 text-lg font-bold"
            style={{ background: ACCENT }}
          >
            Play again
          </button>
          <button onClick={() => setCategory(null)} className="rounded-full border-2 border-[#2B2440] bg-white px-5 py-2 text-lg font-bold">
            Pick another topic
          </button>
        </div>
      </div>
    );
  }

  const q = questions[index];
  const next = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-bold opacity-70">
        <span>
          {category.emoji} {category.title}
        </span>
        <span>
          Question {index + 1} / {questions.length} · Score {score}
        </span>
      </div>
      <div className="mt-4 rounded-3xl border-[3px] border-[#2B2440] bg-white p-6 md:p-8" style={{ boxShadow: "6px 6px 0 #2B2440" }}>
        <h2 className="text-2xl font-extrabold md:text-3xl">{q.q}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {q.choices.map((choice, i) => {
            const isAnswer = i === q.answer;
            const isPicked = picked === i;
            const revealed = picked !== null;
            return (
              <button
                key={choice}
                disabled={revealed}
                onClick={() => {
                  setPicked(i);
                  if (isAnswer) setScore((s) => s + 1);
                }}
                className="rounded-2xl border-[3px] border-[#2B2440] px-4 py-3 text-left text-lg font-bold transition-transform duration-100 enabled:hover:-translate-y-0.5"
                style={{
                  background: revealed ? (isAnswer ? "#9BE8A8" : isPicked ? "#FFB3C1" : "#F3F0E8") : "#FFF8ED",
                  opacity: revealed && !isAnswer && !isPicked ? 0.6 : 1,
                }}
              >
                {choice} {revealed && isAnswer && "✓"} {revealed && isPicked && !isAnswer && "✗"}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xl font-extrabold">{picked === q.answer ? "Nice! 🎉" : "Good try!"}</span>
            <button onClick={next} className="rounded-full border-2 border-[#2B2440] px-5 py-2 text-lg font-bold" style={{ background: ACCENT }}>
              {index + 1 < questions.length ? "Next →" : "See score →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
