"use client";

import { useEffect, useState } from "react";
import Mark from "./Mark";

interface Wish {
  text: string;
  stars: number;
}

interface SentLetter {
  id: string;
  kid: string;
  wishes: Wish[];
  note: string;
  sentAt: number;
}

const STORE = "kz-santa-letters";
const DAY = 86400000;

function christmasSleeps(): number {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let xmas = new Date(now.getFullYear(), 11, 25);
  if (xmas < midnight) xmas = new Date(now.getFullYear() + 1, 11, 25);
  return Math.round((xmas.getTime() - midnight.getTime()) / DAY);
}

/** Santa's reply, picked deterministically so it never changes once written. */
function santaReply(letter: SentLetter): string {
  const first = letter.wishes[0]?.text ?? "your wishes";
  const openers = [
    `Ho ho ho, ${letter.kid}!`,
    `Merry greetings from the North Pole, ${letter.kid}!`,
    `Well hello there, ${letter.kid}!`,
  ];
  const middles = [
    `The elves read your list twice, and everyone agrees "${first}" is a wonderful wish.`,
    `Mrs. Claus pinned your letter right next to the hot cocoa pot. We especially liked "${first}".`,
    `A reindeer looked over my shoulder while I read about "${first}" and nodded very seriously.`,
  ];
  const closers = [
    "Keep being kind to your family, and keep an eye on the sky.",
    "Remember: good helpers at home make the nice list sparkle.",
    "Stay cozy, do your best listening, and leave a carrot out for Blitzen.",
  ];
  const h = letter.id.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return `${openers[h % 3]} ${middles[(h >> 2) % 3]} ${closers[(h >> 4) % 3]}\n\nLove, Santa`;
}

function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3].map((n) => (
        <button
          key={n}
          type="button"
          onClick={onChange ? () => onChange(n) : undefined}
          disabled={!onChange}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Mark shape="star" size={18} style={{ color: n <= value ? "var(--kz-marigold)" : "var(--kz-line)" }} />
        </button>
      ))}
    </span>
  );
}

export default function SantaLetter() {
  const [letters, setLetters] = useState<SentLetter[]>([]);
  const [writing, setWriting] = useState(false);
  const [kid, setKid] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [draft, setDraft] = useState("");
  const [draftStars, setDraftStars] = useState(2);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState<"idle" | "flying" | "failed">("idle");
  const [justSent, setJustSent] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    try {
      setLetters(JSON.parse(localStorage.getItem(STORE) || "[]"));
    } catch {}
  }, []);

  const save = (list: SentLetter[]) => {
    setLetters(list);
    try {
      localStorage.setItem(STORE, JSON.stringify(list));
    } catch {}
  };

  const addWish = () => {
    if (!draft.trim() || wishes.length >= 10) return;
    setWishes([...wishes, { text: draft.trim().slice(0, 120), stars: draftStars }]);
    setDraft("");
    setDraftStars(2);
  };

  const send = async () => {
    if (!kid.trim() || wishes.length === 0) return;
    setSending("flying");
    try {
      const res = await fetch("/api/santa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kid: kid.trim(), wishes, note }),
      });
      if (!res.ok) throw new Error();
      save([{ id: `l-${Date.now()}`, kid: kid.trim(), wishes, note, sentAt: Date.now() }, ...letters]);
      setWishes([]);
      setNote("");
      setWriting(false);
      setJustSent(true);
      setSending("idle");
    } catch {
      setSending("failed");
    }
  };

  const sleeps = now ? christmasSleeps() : null;

  /* ---------- compose ---------- */
  if (writing) {
    return (
      <div className="kz-panel mx-auto max-w-2xl p-7 md:p-9">
        <h2 className="text-3xl font-extrabold tracking-tight">Dear Santa...</h2>

        <label className="mt-5 block text-sm font-bold" htmlFor="santa-name">My name is</label>
        <input
          id="santa-name"
          value={kid}
          onChange={(e) => setKid(e.target.value)}
          placeholder="Write your name"
          className="mt-1.5 w-full rounded-xl border-[1.5px] px-4 py-3 text-lg font-bold outline-none focus:border-[var(--kz-brick)]"
          style={{ borderColor: "var(--kz-line)", background: "var(--kz-ground)" }}
        />

        <p className="mt-6 text-sm font-bold">This year I am wishing for</p>
        {wishes.length > 0 && (
          <ul className="mt-2 space-y-2">
            {wishes.map((w, i) => (
              <li key={i} className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5" style={{ background: "var(--kz-brick-soft)" }}>
                <span className="font-bold">{w.text}</span>
                <span className="flex items-center gap-3">
                  <Stars value={w.stars} />
                  <button
                    onClick={() => setWishes(wishes.filter((_, j) => j !== i))}
                    className="text-xs font-bold underline decoration-2 underline-offset-2"
                    style={{ color: "var(--kz-ink-soft)" }}
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addWish()}
            placeholder="A wish goes here"
            className="min-w-0 flex-1 rounded-xl border-[1.5px] px-4 py-3 text-base font-bold outline-none focus:border-[var(--kz-brick)]"
            style={{ borderColor: "var(--kz-line)", background: "var(--kz-ground)" }}
          />
          <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
            How much?
            <Stars value={draftStars} onChange={setDraftStars} />
          </span>
          <button onClick={addWish} className="kz-btn-ghost !min-h-[2.75rem]">Add wish</button>
        </div>

        <label className="mt-6 block text-sm font-bold" htmlFor="santa-note">Anything else to tell Santa?</label>
        <textarea
          id="santa-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="How are the reindeer doing?"
          className="mt-1.5 w-full rounded-xl border-[1.5px] px-4 py-3 text-base font-bold outline-none focus:border-[var(--kz-brick)]"
          style={{ borderColor: "var(--kz-line)", background: "var(--kz-ground)" }}
        />

        {sending === "failed" && (
          <p className="mt-4 rounded-xl p-3 text-sm font-bold" style={{ background: "var(--kz-brick-soft)" }}>
            The owl carrying your letter got lost in a snowstorm. Ask Dad for help and try again.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={send} disabled={sending === "flying" || !kid.trim() || wishes.length === 0} className="kz-btn disabled:opacity-40">
            {sending === "flying" ? "Flying to the North Pole..." : "Send to Santa"}
          </button>
          <button onClick={() => setWriting(false)} className="kz-btn-ghost">Not yet</button>
        </div>
      </div>
    );
  }

  /* ---------- mailbox ---------- */
  return (
    <div>
      <div className="kz-tile flex flex-col items-start gap-5 p-8 sm:flex-row sm:items-center sm:justify-between md:p-10" style={{ background: "var(--kz-brick-soft)" }}>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            {justSent ? "Delivered to the North Pole!" : "Santa's mailbox is open"}
          </h2>
          <p className="mt-2 max-w-md text-base font-semibold" style={{ color: "var(--kz-ink-soft)" }}>
            {justSent
              ? "The elves stamped it with frost. Check back tomorrow, Santa writes back!"
              : sleeps !== null
                ? `${sleeps} sleeps until Christmas. Plenty of time to send a wish list.`
                : "Write your wish list and send it straight to Santa."}
          </p>
        </div>
        <button onClick={() => { setWriting(true); setJustSent(false); }} className="kz-btn shrink-0">
          Write a letter
        </button>
      </div>

      {letters.length > 0 && (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {letters.map((l) => {
            const replied = now - l.sentAt > DAY;
            return (
              <div key={l.id} className="kz-panel p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold tracking-tight">{l.kid}'s letter</h3>
                  <span className="text-xs font-bold" style={{ color: "var(--kz-ink-soft)" }}>
                    {new Date(l.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {l.wishes.map((w, i) => (
                    <li key={i} className="flex items-center justify-between text-[15px] font-semibold">
                      {w.text}
                      <Stars value={w.stars} />
                    </li>
                  ))}
                </ul>
                {replied ? (
                  <div className="mt-4 whitespace-pre-line rounded-xl p-4 text-[15px] font-semibold leading-relaxed" style={{ background: "var(--kz-leaf-soft)" }}>
                    {santaReply(l)}
                  </div>
                ) : (
                  <p className="mt-4 flex items-center gap-2 text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
                    <Mark shape="star" size={15} style={{ color: "var(--kz-marigold)" }} />
                    On its way to Santa. A reply usually comes by tomorrow!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
