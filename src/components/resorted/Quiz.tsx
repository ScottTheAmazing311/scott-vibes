"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { houses } from "@/lib/resorted/houses";
import { diagonal, readingOrder, type Key } from "@/lib/resorted/model";
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
import Glyph from "./Glyph";

const STORAGE_KEY = "resorted-last-result";
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

function freshAnswers(): Answer[] {
  return Array.from({ length: TOTAL }, () => ({ first: null, second: null }));
}

function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Saved;
    if (!parsed || typeof parsed !== "object" || !parsed.sc) return null;
    return parsed;
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
    // storage unavailable: the result still renders
    return null;
  }
}

export default function Quiz() {
  // Deterministic order for the server render; shuffled per-question on mount and on retake.
  const [order, setOrder] = useState<Key[][]>(() => questions.map(() => readingOrder));
  const [answers, setAnswers] = useState<Answer[]>(freshAnswers);
  const [idx, setIdx] = useState(0);
  const [view, setView] = useState<"quiz" | "result">("quiz");
  const [result, setResult] = useState<{ sc: Scores; fc: Scores } | null>(null);
  const [saved, setSaved] = useState<Saved | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idxRef = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOrder(questions.map((q) => shuffle(Object.keys(q.options) as Key[])));
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

  const answered = answers.filter((a) => a.first).length;
  const current = answers[idx];
  const q = questions[idx];

  function goTo(next: number) {
    cancelAdvance();
    setIdx(next);
  }

  function finish(finalAnswers: Answer[]) {
    cancelAdvance();
    const res = score(finalAnswers);
    setResult(res);
    setView("result");
    const record = persistResult(res);
    if (record) setSaved(record);
    panelRef.current?.scrollIntoView({ block: "start" });
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
      // unpick first, promote second
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
        if (idxRef.current !== at) return; // user navigated away: cancel
        if (at < TOTAL - 1) setIdx(at + 1);
        else finish(next);
      }, 420);
    }
  }

  function retake() {
    cancelAdvance();
    setOrder(questions.map((qq) => shuffle(Object.keys(qq.options) as Key[])));
    setAnswers(freshAnswers());
    setIdx(0);
    setResult(null);
    setView("quiz");
    panelRef.current?.scrollIntoView({ block: "start" });
  }

  function showSaved() {
    if (!saved) return;
    setResult({ sc: saved.sc, fc: saved.fc });
    setView("result");
  }

  const savedRanked = useMemo(() => (saved ? rank(saved.sc, saved.fc) : null), [saved]);

  const hint =
    !current.first
      ? "Tap the answer that sounds most like you."
      : !current.second
        ? "Got it. Tap a second answer if one also fits, or move on."
        : "First and second choice saved.";

  const primaryLabel =
    idx === TOTAL - 1 ? "See my result →" : current.first && !current.second ? "Skip 2nd choice →" : "Next →";

  return (
    <div ref={panelRef} style={{ scrollMarginTop: 76 }}>
      {view === "quiz" ? (
        <div className="rs-quiz-panel">
          <div className="rs-quiz-head">
            <span>
              Question <b>{idx + 1}</b> of {TOTAL}
            </span>
            <span className="rs-num">{answered} answered</span>
          </div>
          <div className="rs-progress" aria-hidden="true">
            <div className="rs-progress-fill" style={{ transform: `scaleX(${(idx + 1) / TOTAL})` }} />
          </div>
          <div aria-live="polite">
            <p className="rs-quiz-prompt">{q.prompt}</p>
            <div className="rs-options">
              {order[idx].map((k, i) => {
                const pickNo = current.first === k ? 1 : current.second === k ? 2 : 0;
                return (
                  <button
                    key={k}
                    className="rs-option"
                    aria-pressed={pickNo > 0}
                    data-pick={pickNo || undefined}
                    onClick={() => pick(k)}
                  >
                    <span className="rs-opt-badge">{pickNo === 1 ? "1st" : pickNo === 2 ? "2nd" : "ABCD"[i]}</span>
                    <span>{q.options[k]}</span>
                  </button>
                );
              })}
            </div>
            <p className="rs-quiz-hint">{hint}</p>
          </div>
          <div className="rs-quiz-nav">
            <button className="rs-btn rs-btn-ghost" disabled={idx === 0} onClick={() => goTo(idx - 1)}>
              ← Back
            </button>
            <button className="rs-btn rs-btn-primary" disabled={!current.first} onClick={advance}>
              {primaryLabel}
            </button>
          </div>
          {saved && savedRanked && (
            <p className="rs-lastresult">
              Your last result:
              <Chip k={savedRanked[0]}>{houses[savedRanked[0]].name}</Chip>
              <Chip k={savedRanked[1]}>{houses[savedRanked[1]].name}</Chip>
              <button className="rs-linkbtn" onClick={showSaved}>
                Show it
              </button>
            </p>
          )}
        </div>
      ) : (
        result && <QuizResult sc={result.sc} fc={result.fc} onRetake={retake} />
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
  const blindIsEdge = blind === diagonal[dom];
  const [copied, setCopied] = useState(false);
  const copyRef = useRef<HTMLTextAreaElement>(null);

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
          // leave the textarea selected so the user can copy manually
        }
      }
    }
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="rs-quiz-panel rs-result">
      <div className="rs-result-head">
        <div className="rs-result-dom" style={{ "--house": `var(--${dom})` } as React.CSSProperties}>
          <span className="rs-eyebrow">Your dominant house</span>
          <div className="rs-result-domname">{houses[dom].name}</div>
          <p className="rs-house-driverline">
            <b>{houses[dom].driverLong}</b> · {pct[dom]}%
          </p>
          <p className="rs-result-q">“{houses[dom].firstQuestion}”</p>
        </div>
        <div className="rs-result-secondary" style={{ "--house": `var(--${sec})` } as React.CSSProperties}>
          <span className="rs-eyebrow">Secondary</span>
          <span className="rs-sec-name">{houses[sec].name}</span>
          <span className="rs-house-driverline" style={{ margin: 0 }}>
            <b>{houses[sec].driverLong}</b> · {pct[sec]}%
          </span>
        </div>
      </div>

      {nearTie && (
        <p className="rs-neartie">
          <b>Near tie.</b> Your top two are within a few points of each other, so they trade the lead depending on the situation. Read
          both house sections.
        </p>
      )}

      <div className="rs-blend">
        <span className="rs-eyebrow">
          Your blend · {houses[dom].name} / {houses[sec].name}
        </span>
        <div className="rs-blend-name">{blend.name}</div>
        <p>{blend.description}</p>
        <dl>
          <dt>Strength</dt>
          <dd>{blend.strength}</dd>
          <dt>Watch for</dt>
          <dd>{blend.watchFor}</dd>
        </dl>
        <p className="rs-relation">{relation}</p>
      </div>

      <div className="rs-result-cols">
        <div>
          <p className="rs-eyebrow" style={{ marginBottom: 14 }}>
            All four drivers
          </p>
          <Bars data={ranked.map((k) => ({ k, value: sc[k], display: `${pct[k]}%` }))} big />
          <p className="rs-raw">
            Raw points: {ranked.map((k) => sc[k]).join(" / ")}. First choices: {ranked.map((k) => fc[k]).join(" / ")}.
          </p>
        </div>
        <div>
          <p className="rs-eyebrow" style={{ marginBottom: 14 }}>
            Where you land on the map
          </p>
          <div className="rs-minimap">
            {(["g", "s", "h", "r"] as Key[]).map((k) => (
              <div key={k} className="rs-minimap-cell" style={{ "--house": `var(--${k})` } as React.CSSProperties}>
                <span>{houses[k].name}</span>
              </div>
            ))}
            <div className="rs-minimap-cross" aria-hidden="true" />
            <div className="rs-minimap-dot" style={{ left: `${pos.left}%`, top: `${pos.top}%` }} aria-hidden="true" />
          </div>
          <p className="rs-readout">
            heart <b>{halves.heart}</b> / head <b>{halves.head}</b>
            <br />
            self <b>{halves.self}</b> / beyond <b>{halves.beyond}</b>
          </p>
        </div>
      </div>

      <div className="rs-growth" style={{ "--edge": `var(--${edge})` } as React.CSSProperties}>
        <div className="rs-growth-head">
          <Glyph active={[dom, edge]} size={16} />
          Growth edge · borrow from {houses[edge].name}
        </div>
        <p>{houses[dom].growth}</p>
      </div>

      <div className="rs-misread">
        <span className="rs-mis-head">Blind spot · lowest driver is {houses[blind].driver}</span>
        <p>
          {blindIsEdge && "Your lowest driver is also the one across your diagonal, so this is the clearest growth edge you have. "}
          {houses[blind].low}
        </p>
      </div>

      <div className="rs-result-actions">
        <button className="rs-btn rs-btn-primary" onClick={copy}>
          {copied ? "Copied" : "Copy my result"}
        </button>
        <a className="rs-btn rs-btn-ghost" href={`#${houses[dom].id}`}>
          Read about {houses[dom].name}
        </a>
        <a className="rs-btn rs-btn-ghost" href={`#${houses[sec].id}`}>
          Read about {houses[sec].name}
        </a>
        <button className="rs-btn rs-btn-ghost" onClick={onRetake}>
          Retake the quiz
        </button>
      </div>
      <textarea ref={copyRef} className="rs-copyarea" readOnly aria-hidden="true" tabIndex={-1} />
    </div>
  );
}
