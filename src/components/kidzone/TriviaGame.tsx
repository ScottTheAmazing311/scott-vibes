"use client";

import { useMemo, useState } from "react";
import { triviaCategories, type TriviaCategory } from "@/lib/kidzone";

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
            className="kz-tile p-6"
            style={{ background: "var(--kz-marigold-soft)" }}
          >
            <span className="block text-2xl font-extrabold tracking-tight">{c.title}</span>
            <span className="mt-1 block text-sm font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
              {c.questions.length} questions
            </span>
          </button>
        ))}
      </div>
    );
  }

  if (index >= questions.length) {
    const stars = score === questions.length ? 3 : score >= questions.length - 2 ? 2 : score >= Math.ceil(questions.length / 2) ? 1 : 0;
    return (
      <div className="kz-panel mx-auto max-w-xl p-10 text-center">
        <div className="text-5xl tracking-wide" aria-label={`${stars} of 3 stars`} style={{ color: "var(--kz-marigold)" }}>
          {"★".repeat(stars)}
          <span style={{ color: "var(--kz-line)" }}>{"★".repeat(3 - stars)}</span>
        </div>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight">
          {score} out of {questions.length}!
        </h2>
        <p className="mt-2 text-lg font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
          {stars === 3 ? "Perfect round." : stars === 2 ? "So close to three stars." : stars === 1 ? "Good run. One more try?" : "Warmed up now. Go again!"}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => start(category)} className="kz-btn">
            Play again
          </button>
          <button onClick={() => setCategory(null)} className="kz-btn-ghost">
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
      <div className="flex items-center justify-between text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
        <span>{category.title}</span>
        <span>
          Question {index + 1} of {questions.length}
        </span>
      </div>
      <div className="kz-panel mt-4 p-6 md:p-9">
        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{q.q}</h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
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
                className="rounded-[14px] border-[1.5px] px-5 py-3.5 text-left text-lg font-bold transition-transform duration-100 enabled:hover:-translate-y-0.5 enabled:active:scale-[0.99] motion-reduce:transition-none"
                style={{
                  borderColor: revealed && (isAnswer || isPicked) ? (isAnswer ? "var(--kz-leaf)" : "var(--kz-brick)") : "var(--kz-line)",
                  background: revealed ? (isAnswer ? "var(--kz-leaf-soft)" : isPicked ? "var(--kz-brick-soft)" : "transparent") : "var(--kz-ground)",
                  opacity: revealed && !isAnswer && !isPicked ? 0.45 : 1,
                }}
              >
                {choice}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xl font-extrabold">{picked === q.answer ? "Nice one!" : "Good try!"}</span>
            <button onClick={next} className="kz-btn">
              {index + 1 < questions.length ? "Next question" : "See my stars"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
