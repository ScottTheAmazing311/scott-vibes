import Em from "./Em";

/** Headline lines wrapped for the clip-mask reveal. Place inside a <Reveal>. */
export default function Lines({ lines, offset = 0 }: { lines: string[]; offset?: number }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="line">
          <span className="line-in" style={{ ["--i" as string]: i + offset }}>
            <Em text={line} />
          </span>
        </span>
      ))}
    </>
  );
}
