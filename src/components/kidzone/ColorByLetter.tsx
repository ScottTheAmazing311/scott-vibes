"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CRAYONS, makeSheet, readPicture, type Picture, type Sheet } from "./letterSheet";

const COLORS = [6, 9, 12, 16];
const PIECES = [
  { label: "Big", cell: 36 },
  { label: "Medium", cell: 26 },
  { label: "Small", cell: 19 },
  { label: "Tiny", cell: 14 },
];
/** No i, l, o or q: too easy to mix up with 1, 0 and g. */
const POOL = "abcdefghjkmnprstuvwxyz";
const INK = "#24262d";

function shuffled(seed: number) {
  const a = POOL.split("");
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const j = seed % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function decode(file: File) {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    return { src: bmp as CanvasImageSource, w: bmp.width, h: bmp.height };
  } catch {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await img.decode();
    return { src: img as CanvasImageSource, w: img.naturalWidth, h: img.naturalHeight };
  }
}

function Choice<T extends string | number>({ label, options, value, onChange, name = String }: { label: string; options: T[]; value: T; onChange: (v: T) => void; name?: (v: T) => string }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" className="kz-chip" data-on={o === value} aria-pressed={o === value} onClick={() => onChange(o)}>
            {name(o)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function ColorByLetter() {
  const [pic, setPic] = useState<{ id: number; data: Picture } | null>(null);
  const [failed, setFailed] = useState(false);
  const [colors, setColors] = useState(12);
  const [cell, setCell] = useState(26);
  const [join, setJoin] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [seed, setSeed] = useState(31);
  const [title, setTitle] = useState("");
  const [peek, setPeek] = useState(false);
  const [drawn, setDrawn] = useState<{ key: string; sheet: Sheet } | null>(null);
  const [loading, setLoading] = useState(false);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const open = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setFailed(false);
    setLoading(true);
    try {
      const { src, w, h } = await decode(file);
      setPic({ id: Date.now(), data: readPicture(src, w, h) });
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
    } catch {
      setFailed(true);
    }
    setLoading(false);
  };

  const key = pic ? `${pic.id}/${colors}/${cell}/${join}` : "";
  const busy = loading || (!!pic && drawn?.key !== key);
  const sheet = drawn?.sheet ?? null;

  useEffect(() => {
    if (!pic) return;
    // Two frames so the "drawing" state paints before the work holds the thread.
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setDrawn({ key, sheet: makeSheet(pic.data, { colors, cell, join }) }));
    });
    return () => cancelAnimationFrame(id);
  }, [pic, key, colors, cell, join]);

  const letters = useMemo(() => shuffled(seed), [seed]);
  const keyOf = useMemo(() => {
    const m = new Map<number, string>();
    sheet?.used.forEach((c, i) => m.set(c, numbers ? String(i + 1) : letters[i]));
    return m;
  }, [sheet, numbers, letters]);

  const wide = sheet ? sheet.w > sheet.h * 1.15 : false;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[300px_1fr]">
      {/* Letter-size page, sized for whichever way the picture runs. */}
      <style>{`@page { size: letter ${wide ? "landscape" : "portrait"}; margin: 0.4in; }
@media print { .cl-paper { width: ${wide ? "10.2in" : "7.7in"}; height: ${wide ? "7.7in" : "10.2in"}; } }`}</style>

      <aside className="kz-panel flex flex-col gap-6 p-5 print:hidden">
        <div>
          <button type="button" className="kz-btn w-full" onClick={() => input.current?.click()}>
            {pic ? "Choose another picture" : "Choose a picture"}
          </button>
          <input ref={input} type="file" accept="image/*" className="sr-only" onChange={(e) => open(e.target.files?.[0])} />
          <p className="mt-2 text-xs" style={{ color: "var(--kz-ink-soft)" }}>
            Photos stay on this device. Bold, simple pictures work best.
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold" style={{ color: "var(--kz-ink-soft)" }}>
            Title
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Our Spooky Night"
            className="w-full rounded-full border-[1.5px] px-4 py-2 font-bold"
            style={{ borderColor: "var(--kz-line)", background: "var(--kz-panel)" }}
          />
        </label>

        <Choice label="Colors" options={COLORS} value={colors} onChange={setColors} />
        <Choice label="Pieces" options={PIECES.map((p) => p.cell)} value={cell} onChange={setCell} name={(c) => PIECES.find((p) => p.cell === c)!.label} />
        <Choice label="Style" options={["Mosaic", "Shapes"]} value={join ? "Shapes" : "Mosaic"} onChange={(v) => setJoin(v === "Shapes")} />
        <Choice label="Code" options={["Letters", "Numbers"]} value={numbers ? "Numbers" : "Letters"} onChange={(v) => setNumbers(v === "Numbers")} />

        <div className="flex flex-wrap gap-2">
          {!numbers && (
            <button type="button" className="kz-btn-ghost" disabled={!sheet} onClick={() => setSeed((s) => s + 1)}>
              New letters
            </button>
          )}
          <button type="button" className="kz-btn-ghost" disabled={!sheet} aria-pressed={peek} onClick={() => setPeek((p) => !p)}>
            {peek ? "Hide colors" : "Peek at colors"}
          </button>
          <button type="button" className="kz-btn" disabled={!sheet} onClick={() => window.print()}>
            Print
          </button>
        </div>
      </aside>

      <section
        className="cl-paper relative mx-auto flex w-full flex-col bg-white p-[3.5%]"
        style={{ aspectRatio: wide ? "11 / 8.5" : "8.5 / 11", maxWidth: wide ? "none" : "44rem", color: INK, boxShadow: "var(--kz-shadow)", borderRadius: 6 }}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          open(e.dataTransfer.files[0]);
        }}
      >
        {!sheet ? (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed text-center"
            style={{ borderColor: over ? "var(--kz-cobalt)" : "var(--kz-line)", background: over ? "var(--kz-cobalt-soft)" : "transparent" }}
          >
            <span className="text-2xl font-extrabold">{busy ? "Drawing your page…" : "Drop a picture here"}</span>
            <span className="max-w-xs text-sm" style={{ color: "var(--kz-ink-soft)" }}>
              {failed ? "That file wouldn't open. Try a JPG or PNG." : "A photo, a drawing, a favorite character. It becomes a page to color by letter."}
            </span>
          </button>
        ) : (
          <>
            <header className="mb-[2.5%] flex items-baseline justify-between gap-4">
              <h2 className="truncate text-[clamp(1.1rem,3.2vw,1.9rem)] font-extrabold tracking-tight print:text-[22pt]">{title || "Color by Letter"}</h2>
              <span className="shrink-0 text-xs font-semibold print:text-[9pt]">Name ____________</span>
            </header>

            <ul className="mb-[2.5%] grid grid-cols-3 border-l border-t text-[clamp(0.62rem,1.5vw,0.85rem)] sm:grid-cols-4 print:grid-cols-4 print:text-[10pt]" style={{ borderColor: INK }}>
              {sheet.used.map((c) => (
                <li key={c} className="flex items-center gap-1.5 border-b border-r px-2 py-1" style={{ borderColor: INK }}>
                  <span className="h-[0.9em] w-[0.9em] shrink-0 rounded-full border" style={{ background: CRAYONS[c].hex, borderColor: INK }} />
                  <span className="truncate">
                    {CRAYONS[c].name} = <b className="text-[1.15em]">{keyOf.get(c)}</b>
                  </span>
                </li>
              ))}
            </ul>

            <div className="relative min-h-0 flex-1">
              <svg viewBox={`-1 -1 ${sheet.w + 2} ${sheet.h + 2}`} className="absolute inset-0 h-full w-full" role="img" aria-label={`Color by letter page${title ? `: ${title}` : ""}`}>
                {peek && <image href={sheet.preview} x={0} y={0} width={sheet.w} height={sheet.h} preserveAspectRatio="none" />}
                <rect x={0} y={0} width={sheet.w} height={sheet.h} fill="none" stroke={INK} strokeWidth={1.6} />
                <path d={sheet.lines} fill="none" stroke={INK} strokeWidth={peek ? 0.7 : 1.1} strokeLinecap="round" strokeLinejoin="round" opacity={peek ? 0.6 : 1} />
                {!peek && (
                  <g fill={INK} fontWeight={600} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
                    {sheet.marks.map((m, i) => (
                      <text key={i} x={m.x} y={m.y} fontSize={m.size}>
                        {keyOf.get(m.crayon)}
                      </text>
                    ))}
                  </g>
                )}
              </svg>
              {busy && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 print:hidden">
                  <span className="kz-chip">Drawing…</span>
                </div>
              )}
            </div>

            {sheet.hasWhite && <p className="mt-[1.5%] text-xs print:text-[9pt]">Spaces with no letter stay white.</p>}
          </>
        )}
      </section>
    </div>
  );
}
