"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pianoSongs, type PianoSong } from "@/lib/kidzone";

const WHITE = ["C", "D", "E", "F", "G", "A", "B"];
const HAS_SHARP = new Set(["C", "D", "F", "G", "A"]);
const OCTAVES = [4, 5];
const KEYMAP: Record<string, string> = {
  a: "C4", w: "C#4", s: "D4", e: "D#4", d: "E4", f: "F4", t: "F#4", g: "G4",
  y: "G#4", h: "A4", u: "A#4", j: "B4", k: "C5", o: "C#5", l: "D5", p: "D#5", ";": "E5",
};
const SEMITONE: Record<string, number> = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };

function freq(note: string): number {
  const name = note.slice(0, -1);
  const octave = Number(note.slice(-1));
  const midi = (octave + 1) * 12 + SEMITONE[name];
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export default function PianoLab() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [labels, setLabels] = useState(true);
  const [song, setSong] = useState<PianoSong | null>(null);
  const [pos, setPos] = useState(0);

  const play = useCallback((note: string) => {
    type AC = typeof AudioContext;
    const Ctor: AC | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: AC }).webkitAudioContext;
    if (!Ctor) return;
    if (!ctxRef.current) ctxRef.current = new Ctor();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc2.type = "sine";
    osc.frequency.value = freq(note);
    osc2.frequency.value = freq(note) * 2;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    const g2 = ctx.createGain();
    g2.gain.value = 0.12;
    osc.connect(gain);
    osc2.connect(g2);
    g2.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + 1.2);
    osc2.stop(t + 1.2);
  }, []);

  const press = useCallback(
    (note: string) => {
      play(note);
      setActive(note);
      window.setTimeout(() => setActive((a) => (a === note ? null : a)), 180);
      if (song) {
        if (note === song.notes[pos]) {
          setPos((p) => p + 1);
        }
      }
    },
    [play, song, pos],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = KEYMAP[e.key.toLowerCase()];
      if (note) press(note);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [press]);

  useEffect(() => () => void ctxRef.current?.close(), []);

  const expected = song && pos < song.notes.length ? song.notes[pos] : null;
  const done = song !== null && pos >= song.notes.length;

  const whiteKeys = OCTAVES.flatMap((o) => WHITE.map((n) => `${n}${o}`)).concat(["C6"]);

  return (
    <div>
      {/* song picker */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => { setSong(null); setPos(0); }}
          className="rounded-full border-2 border-[#2B2440] px-4 py-1.5 text-sm font-bold"
          style={{ background: song === null ? "#06D6A0" : "white" }}
        >
          Free play
        </button>
        {pianoSongs.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSong(s); setPos(0); }}
            className="rounded-full border-2 border-[#2B2440] px-4 py-1.5 text-sm font-bold"
            style={{ background: song?.id === s.id ? "#06D6A0" : "white" }}
          >
            {s.title}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={labels} onChange={(e) => setLabels(e.target.checked)} />
          Note names
        </label>
      </div>

      {/* lesson strip */}
      {song && (
        <div className="mt-4 rounded-2xl border-[3px] border-[#2B2440] bg-white p-4" style={{ boxShadow: "4px 4px 0 #2B2440" }}>
          {done ? (
            <div className="flex items-center justify-between">
              <span className="text-xl font-extrabold">You played {song.title}! 🎉🎹</span>
              <button onClick={() => setPos(0)} className="rounded-full border-2 border-[#2B2440] px-4 py-1.5 text-sm font-bold" style={{ background: "#06D6A0" }}>
                Play it again
              </button>
            </div>
          ) : (
            <div>
              <span className="text-sm font-bold opacity-60">
                Press the glowing key · note {pos + 1} of {song.notes.length}
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {song.notes.map((n, i) => (
                  <span
                    key={i}
                    className="rounded-md border-2 border-[#2B2440] px-2 py-0.5 text-sm font-bold"
                    style={{
                      background: i < pos ? "#9BE8A8" : i === pos ? "#FFD166" : "white",
                      opacity: i < pos ? 0.6 : 1,
                    }}
                  >
                    {n.slice(0, -1)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* keyboard */}
      <div className="mt-5 overflow-x-auto rounded-3xl border-[3px] border-[#2B2440] bg-white p-4" style={{ boxShadow: "6px 6px 0 #2B2440" }}>
        <div className="relative flex h-52 min-w-[640px] select-none">
          {whiteKeys.map((note) => (
            <button
              key={note}
              onPointerDown={() => press(note)}
              className="relative flex-1 rounded-b-lg border-2 border-[#2B2440] text-xs font-bold"
              style={{
                background: active === note ? "#9BE8A8" : expected === note ? "#FFD166" : "white",
                boxShadow: expected === note ? "0 0 0 3px #FFD166 inset" : undefined,
              }}
              aria-label={`Piano key ${note}`}
            >
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-60">{labels ? note.slice(0, -1) : ""}</span>
            </button>
          ))}
          {/* black keys overlay */}
          {whiteKeys.slice(0, -1).map((note, i) => {
            const name = note.slice(0, -1);
            const octave = note.slice(-1);
            if (!HAS_SHARP.has(name)) return null;
            const sharp = `${name}#${octave}`;
            const left = `${((i + 1) / whiteKeys.length) * 100}%`;
            return (
              <button
                key={sharp}
                onPointerDown={(e) => { e.stopPropagation(); press(sharp); }}
                className="absolute top-0 z-10 h-[58%] w-[4.2%] -translate-x-1/2 rounded-b-md border-2 border-[#2B2440]"
                style={{ left, background: active === sharp ? "#06D6A0" : expected === sharp ? "#FFD166" : "#2B2440" }}
                aria-label={`Piano key ${sharp}`}
              />
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-bold opacity-70">
        Play with your mouse, touch, or the A S D F row on a keyboard
      </p>
    </div>
  );
}
