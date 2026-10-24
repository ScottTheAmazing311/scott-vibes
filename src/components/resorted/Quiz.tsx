"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { houses } from "@/lib/resorted/houses";
import { readingOrder, type Key } from "@/lib/resorted/model";
import { blends, questions, relations } from "@/lib/resorted/quiz-data";
import {
  blindSpot,
  growthEdge,
  isNearTie,
  mapPosition,
  percents,
  rank,
  readout,
  relationKey,
  score,
  type Answer,
  type Scores,
} from "@/lib/resorted/scoring";
import Bars from "./Bars";
import Chip from "./Chip";
import Compass from "./Compass";
import Glyph from "./Glyph";
import { hv } from "./hv";

const STORAGE_KEY = "resorted-last-result";
const ROOM_HEX: Record<Key | "none", string> = { none: "#6f7890", g: "#f0694f", r: "#86a5ff", h: "#ecbf57", s: "#55cf97" };
const TOTAL = questions.length;

type Saved = { sc: Scores; fc: Scores; t: number };

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const freshAnswers = (): Answer[] => Array.from({ length: TOTAL }, () => ({ first: null, second: null }));
const shuffledOrder = () => questions.map((q) => shuffle(Object.keys(q.options) as Key[]));

function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Saved;
    return parsed && typeof parsed === "object" && parsed.sc && parsed.fc ? parsed : null;
  } catch {
    return null;
  }
}

function persistResult(res: { sc: Scores; fc: Scores }): Saved | null {
  try {
    const record: Saved = { ...res, t: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    return record;
  } catch {
    return null;
  }
}

export default function Quiz({ intro }: { intro: React.ReactNode }) {
  // Reading order for the server render; shuffled per question on mount and on every retake.
  const [order, setOrder] = useState<Key[][]>(() => questions.map(() => readingOrder));
  const [answers, setAnswers] = useState<Answer[]>(freshAnswers);
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState<{ sc: Scores; fc: Scores } | null>(null);
  const [saved, setSaved] = useState<Saved | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idxRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOrder(shuffledOrder());
    setSaved(loadSaved());
  }, []);

  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  const cancelAdvance = useCallback(() => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  useEffect(() => cancelAdvance, [cancelAdvance]);

  const current = answers[idx];
  const q = questions[idx];

  function scrollToTop() {
    const el = rootRef.current?.closest("section") ?? rootRef.current;
    el?.scrollIntoView({ block: "start" });
  }

  function goTo(next: number) {
    cancelAdvance();
    setIdx(next);
  }

  function finish(finalAnswers: Answer[]) {
    cancelAdvance();
    const res = score(finalAnswers);
    setResult(res);
    const record = persistResult(res);
    if (record) setSaved(record);
    scrollToTop();
  }

  function advance() {
    if (idx < TOTAL - 1) goTo(idx + 1);
    else finish(answers);
  }

  function pick(k: Key) {
    cancelAdvance();
    const next = answers.map((a, i) => (i === idx ? { ...a } : a));
    const a = next[idx];
    let scheduleAdvance = false;
    if (a.first === k) {
      a.first = a.second;
      a.second = null;
    } else if (a.second === k) {
      a.second = null;
    } else if (!a.first) {
      a.first = k;
    } else {
      a.second = k;
      scheduleAdvance = true;
    }
    setAnswers(next);
    if (scheduleAdvance) {
      const at = idx;
      advanceTimer.current = setTimeout(() => {
        advanceTimer.current = null;
        if (idxRef.current !== at) return;
        if (at < TOTAL - 1) setIdx(at + 1);
        else finish(next);
      }, 420);
    }
  }

  function retake() {
    cancelAdvance();
    setOrder(shuffledOrder());
    setAnswers(freshAnswers());
    setIdx(0);
    setResult(null);
    scrollToTop();
  }

  function showSaved() {
    if (!saved) return;
    setResult({ sc: saved.sc, fc: saved.fc });
    scrollToTop();
  }

  const savedRanked = useMemo(() => (saved ? rank(saved.sc, saved.fc) : null), [saved]);

  const hint = !current.first
    ? "Pick the answer most like you."
    : !current.second
      ? "Pick a second if one also fits."
      : "";

  const primaryLabel = idx === TOTAL - 1 ? "See result" : "Next";

  return (
    <div ref={rootRef} className="rs-quiz" data-view={result ? "result" : "quiz"}>
      <div className="rs-quiz-intro">
        {intro}
        {!result && saved && savedRanked && (
          <p className="rs-last">
            Your last result:
            <Chip k={savedRanked[0]}>{houses[savedRanked[0]].name}</Chip>
            <Chip k={savedRanked[1]}>{houses[savedRanked[1]].name}</Chip>
            <button className="rs-textbtn" onClick={showSaved}>
              Show it
            </button>
          </p>
        )}
      </div>

      {result ? (
        <QuizResult key={`${result.sc.g}-${result.sc.r}-${result.sc.h}-${result.sc.s}`} sc={result.sc} fc={result.fc} onRetake={retake} />
      ) : (
        <div className="rs-stage">
          <div className="rs-stage-head">
            <span>
              Question <b>{idx + 1}</b> of {TOTAL}
            </span>
          </div>
          <div className="rs-ticks" aria-hidden="true">
            {answers.map((a, i) => (
              <i key={i} data-s={i === idx ? "now" : a.first ? "done" : undefined} />
            ))}
          </div>

          <div key={idx} className="rs-qbody" aria-live="polite">
            <p className="rs-prompt">{q.prompt}</p>
            <div className="rs-options">
              {order[idx].map((k, i) => {
                const pickNo = current.first === k ? 1 : current.second === k ? 2 : 0;
                return (
                  <button key={k} className="rs-option" aria-pressed={pickNo > 0} data-pick={pickNo || undefined} onClick={() => pick(k)}>
                    <span className="rs-badge">{pickNo === 1 ? "1st" : pickNo === 2 ? "2nd" : "ABCD"[i]}</span>
                    <span>{q.options[k]}</span>
                  </button>
                );
              })}
            </div>
            <p className="rs-hint">{hint}</p>
          </div>

          <div className="rs-stage-nav">
            <button className="rs-btn rs-btn-ghost" disabled={idx === 0} onClick={() => goTo(idx - 1)}>
              Back
            </button>
            <button className="rs-btn rs-btn-primary" disabled={!current.first} onClick={advance}>
              {primaryLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuizResult({ sc, fc, onRetake }: { sc: Scores; fc: Scores; onRetake: () => void }) {
  const ranked = rank(sc, fc);
  const pct = percents(sc);
  const [dom, sec] = ranked;
  const nearTie = isNearTie(sc, ranked);
  const blend = blends[dom + sec];
  const relation = relations[relationKey(dom, sec)];
  const pos = mapPosition(sc);
  const halves = readout(sc);
  const edge = growthEdge(ranked);
  const blind = blindSpot(ranked);
  const [copied, setCopied] = useState(false);
  const copyRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // The room takes on the dominant house's light while the result is showing.
  useEffect(() => {
    const section = resultRef.current?.closest<HTMLElement>("[data-room]");
    const root = document.querySelector<HTMLElement>(".rs");
    if (!section || !root) return;
    section.dataset.room = dom;
    root.style.setProperty("--room", ROOM_HEX[dom]);
    return () => {
      section.dataset.room = "none";
      root.style.setProperty("--room", ROOM_HEX.none);
    };
  }, [dom]);

  const copyText = `My Re-Sorted result: ${houses[dom].name} (${houses[dom].driverLong}) with a ${houses[sec].name} streak. Blend: ${blend.name}. ${ranked
    .map((k) => `${houses[k].name} ${pct[k]}%`)
    .join(" · ")}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
    } catch {
      const ta = copyRef.current;
      if (ta) {
        ta.value = copyText;
        ta.select();
        try {
          document.execCommand("copy");
          setCopied(true);
        } catch {
          // the textarea stays selected for a manual copy
        }
      }
    }
    setTimeout(() => setCopied(false), 2200);
  }

  const name = houses[dom].name;

  return (
    <div ref={resultRef} className="rs-result">
      <div className="rs-result-top">
        <div className="rs-result-main" style={hv(dom)}>
          <span className="rs-label rs-enter">Your house</span>
          <h3 className="rs-result-name" aria-label={name}>
            {name.split("").map((ch, i) => (
              <span key={i} className="rs-letter" style={{ "--i": i } as React.CSSProperties} aria-hidden="true">
                {ch}
              </span>
            ))}
          </h3>
          <p className="rs-chapter-driver rs-enter" style={{ "--i": 8 } as React.CSSProperties}>
            <b>{houses[dom].driver}</b> · {pct[dom]}%
          </p>
          <p className="rs-result-q rs-enter" style={{ "--i": 9 } as React.CSSProperties}>
            “{houses[dom].firstQuestion}”
          </p>
          <div className="rs-result-sec rs-enter" style={hv(sec, { "--i": 11 })}>
            <span className="rs-label">Secondary</span>
            <span className="rs-result-secname">{houses[sec].name}</span>
            <span className="rs-chapter-driver">
              <b>{houses[sec].driver}</b> · {pct[sec]}%
            </span>
          </div>
        </div>
        <div className="rs-result-map rs-enter" style={{ "--i": 4 } as React.CSSProperties}>
          <Compass mode="result" target={pos} />
          <p className="rs-readout">
            <span>
              heart <b>{halves.heart}</b> / head <b>{halves.head}</b>
            </span>
            <span>
              self <b>{halves.self}</b> / beyond <b>{halves.beyond}</b>
            </span>
          </p>
        </div>
      </div>

      {nearTie && (
        <p className="rs-neartie">
          <b>Near tie.</b> Your top two trade the lead depending on the situation.
        </p>
      )}

      <div className="rs-blend">
        <div>
          <span className="rs-label">Blend</span>
          <p className="rs-blend-name">{blend.name}</p>
          <p className="rs-blend-desc">{blend.description}</p>
        </div>
        <dl>
          <div>
            <dt className="rs-label">Strength</dt>
            <dd>{blend.strength}</dd>
          </div>
          <div>
            <dt className="rs-label">Watch for</dt>
            <dd>{blend.watchFor}</dd>
          </div>
        </dl>
        <p className="rs-relation">{relation}</p>
      </div>

      <div className="rs-result-grid">
        <div>
          <span className="rs-label">All four</span>
          <Bars data={ranked.map((k) => ({ k, value: sc[k], display: `${pct[k]}%` }))} animate />
        </div>
        <div className="rs-result-cards">
          <div className="rs-growth" style={hv(dom, { "--edge": `var(--${edge})` })}>
            <div className="rs-growth-head">
              <Glyph active={[dom, edge]} size={14} />
              Borrow from {houses[edge].name}
            </div>
            <p>{houses[dom].growth}</p>
          </div>
          <div className="rs-note">
            <span className="rs-label">Blind spot · {houses[blind].driver}</span>
            <p>{houses[blind].low}</p>
          </div>
        </div>
      </div>

      <div className="rs-actions">
        <button className="rs-btn rs-btn-primary" onClick={copy}>
          {copied ? "Copied" : "Copy result"}
        </button>
        <a className="rs-btn rs-btn-ghost" href={`#${houses[dom].id}`}>
          Read about {houses[dom].name}
        </a>
        <button className="rs-btn rs-btn-ghost" onClick={onRetake}>
          Retake
        </button>
      </div>
      <textarea ref={copyRef} className="rs-copyarea" readOnly aria-hidden="true" tabIndex={-1} />
    </div>
  );
}
