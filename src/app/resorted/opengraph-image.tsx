import { ImageResponse } from "next/og";

export const alt = "Re-Sorted: every house runs on one driver";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const QUADS = [
  { name: "Gryffindor", driver: "Boldness", color: "#f0694f" },
  { name: "Slytherin", driver: "Strategy", color: "#55cf97" },
  { name: "Hufflepuff", driver: "Relationships", color: "#ecbf57" },
  { name: "Ravenclaw", driver: "Code", color: "#86a5ff" },
];

/** Satori needs TTF/OTF, which Google Fonts serves when no modern user agent is sent. */
async function googleFont(family: string, text: string) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  const headline = "Every house runs on one driver.";
  const serifText = headline + QUADS.map((q) => q.name).join("");
  const [serif, mono] = await Promise.all([
    googleFont("Bodoni+Moda:ital,opsz,wght@1,6..96,500", serifText),
    googleFont("Geist+Mono:wght@500", "RE-SORTEDTAKETHEQUIZ·" + QUADS.map((q) => q.driver.toUpperCase()).join("")),
  ]);

  const fonts = [
    serif && { name: "Bodoni", data: serif, style: "italic" as const, weight: 500 as const },
    mono && { name: "Mono", data: mono, style: "normal" as const, weight: 500 as const },
  ].filter((f) => !!f);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 72px",
          gap: 64,
          background: "#0b0d12",
          backgroundImage: "radial-gradient(circle at 78% 30%, rgba(240,105,79,0.22), transparent 55%)",
          color: "#ede7db",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", fontFamily: "Mono", fontSize: 22, letterSpacing: 4, color: "rgba(237,231,219,0.6)" }}>
            RE-SORTED
          </div>
          <div style={{ display: "flex", fontFamily: "Bodoni", fontStyle: "italic", fontSize: 84, lineHeight: 1.05, marginTop: 28 }}>
            {headline}
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 44,
              padding: "14px 28px",
              borderRadius: 999,
              background: "#ede7db",
              color: "#0b0d12",
              fontFamily: "Mono",
              fontSize: 20,
              letterSpacing: 2,
            }}
          >
            TAKE THE QUIZ
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 440,
            height: 440,
            borderRadius: 18,
            border: "1px solid rgba(237,231,219,0.14)",
            overflow: "hidden",
          }}
        >
          {[QUADS.slice(0, 2), QUADS.slice(2)].map((row, r) => (
            <div key={r} style={{ display: "flex", flex: 1, borderTop: r ? "1px solid rgba(237,231,219,0.1)" : "none" }}>
              {row.map((q, c) => (
                <div
                  key={q.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: r ? "flex-end" : "flex-start",
                    flex: 1,
                    padding: 22,
                    backgroundImage: `radial-gradient(circle at ${c ? "0%" : "100%"} ${r ? "0%" : "100%"}, ${q.color}38, transparent 75%)`,
                    borderLeft: c ? "1px solid rgba(237,231,219,0.1)" : "none",
                  }}
                >
                  <div style={{ display: "flex", fontFamily: "Bodoni", fontStyle: "italic", fontSize: 35, color: q.color }}>{q.name}</div>
                  <div style={{ display: "flex", fontFamily: "Mono", fontSize: 14, letterSpacing: 2, color: q.color, opacity: 0.75, marginTop: 6 }}>
                    {q.driver.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
