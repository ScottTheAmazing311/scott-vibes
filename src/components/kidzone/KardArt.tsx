/**
 * Drawn card art for Knudson Kards: flat toy-style SVG, one scene per card id.
 * Animal cards use photos instead (see kards.ts), so they never reach here.
 * viewBox is 120x90; the parent crops with preserveAspectRatio slice.
 */

const SPACE_BG = "#323b52";
const SPACE_STARS = [
  [12, 10], [104, 14], [22, 74], [96, 70], [58, 6], [8, 44], [112, 42], [78, 82],
] as const;

function Space({ children }: { children: React.ReactNode }) {
  return (
    <>
      <rect width="120" height="90" fill={SPACE_BG} />
      {SPACE_STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.4 : 0.9} fill="#fffdf7" opacity={0.7} />
      ))}
      {children}
    </>
  );
}

function Dino({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <>
      <rect width="120" height="90" fill={bg} />
      <ellipse cx="60" cy="82" rx="46" ry="6" fill="#323b52" opacity="0.08" />
      {children}
    </>
  );
}

function Snack({ children }: { children: React.ReactNode }) {
  return (
    <>
      <rect width="120" height="90" fill="#f3efe6" />
      <circle cx="60" cy="46" r="36" fill="#fffdf7" />
      {children}
    </>
  );
}

const EYE = "#fffdf7";
const PUPIL = "#323b52";

export default function KardArt({ id }: { id: string }) {
  switch (id) {
    /* ---------------- Outer Space ---------------- */
    case "sun":
      return (
        <Space>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line key={i} x1={60 + Math.cos(a) * 26} y1={45 + Math.sin(a) * 26} x2={60 + Math.cos(a) * 34} y2={45 + Math.sin(a) * 34}
                stroke="#e8a33d" strokeWidth="3.4" strokeLinecap="round" />
            );
          })}
          <circle cx="60" cy="45" r="22" fill="#e8a33d" />
          <circle cx="60" cy="45" r="15" fill="#f0bc63" />
        </Space>
      );
    case "mercury":
      return (
        <Space>
          <circle cx="60" cy="45" r="20" fill="#b9b2a6" />
          <circle cx="52" cy="38" r="4" fill="#a39c8f" />
          <circle cx="67" cy="50" r="5.5" fill="#a39c8f" />
          <circle cx="58" cy="56" r="2.6" fill="#a39c8f" />
        </Space>
      );
    case "venus":
      return (
        <Space>
          <circle cx="60" cy="45" r="21" fill="#e8c27d" />
          <path d="M42 40c8 5 28 5 36-2" stroke="#d9a855" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M44 53c8 4 24 4 32-1" stroke="#d9a855" strokeWidth="3" fill="none" strokeLinecap="round" />
        </Space>
      );
    case "earth":
      return (
        <Space>
          <circle cx="60" cy="45" r="21" fill="#4467c9" />
          <path d="M48 32c6-3 12 1 10 6s-9 4-12 1 -2-5 2-7Z" fill="#4f9c63" />
          <path d="M66 48c7-2 12 2 10 7s-10 5-13 1c-2-3-1-6 3-8Z" fill="#4f9c63" />
          <path d="M52 56c3-1 6 0 5 3s-7 2-7-1c0-1 0-1 2-2Z" fill="#4f9c63" />
          <ellipse cx="68" cy="34" rx="6" ry="2.4" fill="#fffdf7" opacity="0.85" />
        </Space>
      );
    case "moon":
      return (
        <Space>
          <circle cx="60" cy="45" r="20" fill="#d8d4c9" />
          <circle cx="53" cy="39" r="4.6" fill="#bdb8ab" />
          <circle cx="66" cy="50" r="6" fill="#bdb8ab" />
          <circle cx="62" cy="34" r="2.4" fill="#bdb8ab" />
          <circle cx="50" cy="52" r="2.8" fill="#bdb8ab" />
        </Space>
      );
    case "mars":
      return (
        <Space>
          <circle cx="60" cy="45" r="20" fill="#d95b43" />
          <path d="M48 31a20 20 0 0 1 24 0c-4 4-20 4-24 0Z" fill="#f4e4c3" />
          <circle cx="54" cy="48" r="4" fill="#b84a35" />
          <circle cx="68" cy="42" r="2.8" fill="#b84a35" />
        </Space>
      );
    case "jupiter":
      return (
        <Space>
          <clipPath id="jup"><circle cx="60" cy="45" r="22" /></clipPath>
          <circle cx="60" cy="45" r="22" fill="#e0b184" />
          <g clipPath="url(#jup)">
            <rect x="36" y="32" width="48" height="5.5" fill="#c98f5d" />
            <rect x="36" y="42" width="48" height="7" fill="#f0d7b7" />
            <rect x="36" y="54" width="48" height="5" fill="#c98f5d" />
          </g>
          <ellipse cx="69" cy="52" rx="6.4" ry="4" fill="#d95b43" />
        </Space>
      );
    case "saturn":
      return (
        <Space>
          <circle cx="60" cy="45" r="16" fill="#e8c27d" />
          <ellipse cx="60" cy="45" rx="30" ry="9" fill="none" stroke="#d9a855" strokeWidth="4" transform="rotate(-18 60 45)" />
          <path d="M46 38a16 16 0 0 1 28 0" fill="none" stroke="#d9a855" strokeWidth="2.6" opacity="0.6" />
        </Space>
      );
    case "uranus":
      return (
        <Space>
          <circle cx="60" cy="45" r="18" fill="#a8d5cf" />
          <ellipse cx="60" cy="45" rx="7" ry="26" fill="none" stroke="#7fb8b0" strokeWidth="3" transform="rotate(14 60 45)" />
        </Space>
      );
    case "neptune":
      return (
        <Space>
          <circle cx="60" cy="45" r="19" fill="#3a56a8" />
          <path d="M45 40c8 4 22 4 29-1" stroke="#5d7bd0" strokeWidth="4" fill="none" strokeLinecap="round" />
          <ellipse cx="54" cy="52" rx="5" ry="3" fill="#2d4486" />
        </Space>
      );
    case "comet":
      return (
        <Space>
          <path d="M14 76 60 44l8 10Z" fill="#e8a33d" opacity="0.5" />
          <path d="M22 84 62 50l5 6Z" fill="#fffdf7" opacity="0.35" />
          <circle cx="68" cy="40" r="10" fill="#f4e4c3" />
          <circle cx="65" cy="37" r="3" fill="#fffdf7" />
        </Space>
      );
    case "black-hole":
      return (
        <Space>
          <ellipse cx="60" cy="45" rx="30" ry="10" fill="none" stroke="#e8a33d" strokeWidth="3.4" transform="rotate(-14 60 45)" />
          <circle cx="60" cy="45" r="14" fill="#14172a" />
          <circle cx="60" cy="45" r="14" fill="none" stroke="#f0bc63" strokeWidth="2.4" />
        </Space>
      );

    /* ---------------- Dino Squad ---------------- */
    case "trex":
      return (
        <Dino bg="#f3d7cd">
          <path d="M10 70c14-4 24-8 32-18l10 6c-6 10-24 18-40 16Z" fill="#c0533d" />
          <ellipse cx="62" cy="52" rx="20" ry="16" fill="#d95b43" />
          <path d="M70 18h20c6 0 8 8 4 12l2 8-8-2-2 6-6-4c-10-2-14-8-10-20Z" fill="#d95b43" />
          <rect x="72" y="22" width="18" height="6" rx="3" fill="#d95b43" />
          <path d="M66 46c4 0 7 3 6 6l-6-2Z" fill="#c0533d" />
          <rect x="52" y="62" width="8" height="18" rx="4" fill="#c0533d" />
          <rect x="66" y="62" width="8" height="18" rx="4" fill="#c0533d" />
          <circle cx="82" cy="24" r="3.4" fill={EYE} />
          <circle cx="83" cy="24" r="1.6" fill={PUPIL} />
          <path d="M80 34l3 3 3-3 3 3 3-3" stroke="#fffdf7" strokeWidth="2" fill="none" />
        </Dino>
      );
    case "triceratops":
      return (
        <Dino bg="#d9e9d6">
          <ellipse cx="48" cy="56" rx="26" ry="17" fill="#4f9c63" />
          <path d="M14 58c-6-2-8 4-4 7l8 2Z" fill="#3f7d4f" />
          <circle cx="82" cy="44" r="16" fill="#3f7d4f" />
          <ellipse cx="90" cy="52" rx="12" ry="9" fill="#4f9c63" />
          <path d="M88 40l4-12 4 12Z" fill="#f4e4c3" />
          <path d="M78 42l2-10 5 9Z" fill="#f4e4c3" />
          <path d="M98 52l10-2-7 7Z" fill="#f4e4c3" />
          <rect x="36" y="64" width="8" height="15" rx="4" fill="#3f7d4f" />
          <rect x="54" y="64" width="8" height="15" rx="4" fill="#3f7d4f" />
          <circle cx="88" cy="48" r="3" fill={EYE} />
          <circle cx="89" cy="48" r="1.5" fill={PUPIL} />
        </Dino>
      );
    case "stegosaurus":
      return (
        <Dino bg="#f4e4c3">
          {[30, 44, 58, 72].map((x, i) => (
            <path key={i} d={`M${x} ${i % 2 ? 30 : 34} l7 -12 7 12Z`} fill="#d95b43" />
          ))}
          <ellipse cx="58" cy="54" rx="30" ry="17" fill="#e8a33d" />
          <path d="M26 58c-8 2-14 8-16 14l12-2c2-4 4-8 8-10Z" fill="#d78f2a" />
          <ellipse cx="90" cy="60" rx="9" ry="6" fill="#e8a33d" />
          <rect x="44" y="64" width="8" height="15" rx="4" fill="#d78f2a" />
          <rect x="64" y="64" width="8" height="15" rx="4" fill="#d78f2a" />
          <circle cx="92" cy="58" r="2.6" fill={PUPIL} />
        </Dino>
      );
    case "brachiosaurus":
      return (
        <Dino bg="#dbe2f5">
          <path d="M66 58C66 40 72 16 84 10c6-3 12 1 10 7-6 2-10 20-10 42Z" fill="#4467c9" />
          <ellipse cx="88" cy="12" rx="8" ry="6" fill="#4467c9" />
          <ellipse cx="54" cy="62" rx="26" ry="15" fill="#4467c9" />
          <path d="M30 66c-8 0-14 5-16 10l12-1c1-3 2-6 4-9Z" fill="#3854a4" />
          <rect x="44" y="68" width="8" height="14" rx="4" fill="#3854a4" />
          <rect x="62" y="68" width="8" height="14" rx="4" fill="#3854a4" />
          <circle cx="91" cy="11" r="2.4" fill={EYE} />
          <circle cx="92" cy="11" r="1.3" fill={PUPIL} />
        </Dino>
      );
    case "velociraptor":
      return (
        <Dino bg="#d9e9d6">
          <path d="M8 46c12 2 22 0 30 6l-4 8c-10-4-20-4-26-14Z" fill="#3f7d4f" />
          <ellipse cx="54" cy="54" rx="18" ry="11" fill="#4f9c63" />
          <path d="M64 48c4-10 12-16 22-16 6 0 8 6 3 9l-13 3-4 8Z" fill="#4f9c63" />
          <path d="M60 62l10 14 5-3-8-13Z" fill="#3f7d4f" />
          <path d="M48 64l-4 14 6 1 4-13Z" fill="#3f7d4f" />
          <path d="M72 78l6-4 2 5Z" fill="#323b52" />
          <circle cx="82" cy="36" r="2.6" fill={EYE} />
          <circle cx="83" cy="36" r="1.4" fill={PUPIL} />
        </Dino>
      );
    case "pteranodon":
      return (
        <Dino bg="#dbe2f5">
          <path d="M12 38C28 22 46 20 58 32l-8 12C40 38 26 40 12 38Z" fill="#4467c9" />
          <path d="M108 38C92 22 74 20 62 32l8 12c10-6 24-4 38-6Z" fill="#4467c9" />
          <ellipse cx="60" cy="46" rx="10" ry="14" fill="#3854a4" />
          <path d="M56 30l4-14 6 4-4 12Z" fill="#3854a4" />
          <path d="M58 58l2 14 4-1-2-13Z" fill="#3854a4" />
          <circle cx="63" cy="34" r="2.2" fill={EYE} />
          <circle cx="64" cy="34" r="1.2" fill={PUPIL} />
        </Dino>
      );
    case "spinosaurus":
      return (
        <Dino bg="#f3d7cd">
          <path d="M34 52c2-18 16-30 30-30 12 0 22 10 24 26Z" fill="#e8a33d" />
          <path d="M38 50c2-12 12-22 24-22" fill="none" stroke="#d78f2a" strokeWidth="2.4" />
          <ellipse cx="58" cy="56" rx="28" ry="14" fill="#d95b43" />
          <path d="M12 62c8 0 14-2 20-6l4 8c-6 4-14 6-24 4Z" fill="#c0533d" />
          <path d="M84 50h18c5 0 6 6 2 8l-4 6-6-4c-6 0-10-4-10-10Z" fill="#d95b43" />
          <rect x="48" y="64" width="8" height="15" rx="4" fill="#c0533d" />
          <rect x="66" y="64" width="8" height="15" rx="4" fill="#c0533d" />
          <circle cx="96" cy="54" r="2.6" fill={EYE} />
          <circle cx="97" cy="54" r="1.4" fill={PUPIL} />
        </Dino>
      );
    case "ankylosaurus":
      return (
        <Dino bg="#f4e4c3">
          <ellipse cx="56" cy="56" rx="32" ry="16" fill="#8a7a52" />
          {[36, 50, 64, 78].map((x) => (
            <circle key={x} cx={x} cy="46" r="4" fill="#6e6141" />
          ))}
          <path d="M8 56l14-4 2 8-14 2Z" fill="#8a7a52" />
          <circle cx="10" cy="57" r="7" fill="#6e6141" />
          <ellipse cx="92" cy="58" rx="10" ry="8" fill="#8a7a52" />
          <rect x="42" y="66" width="8" height="13" rx="4" fill="#6e6141" />
          <rect x="62" y="66" width="8" height="13" rx="4" fill="#6e6141" />
          <circle cx="95" cy="56" r="2.6" fill={EYE} />
          <circle cx="96" cy="56" r="1.4" fill={PUPIL} />
        </Dino>
      );
    case "parasaurolophus":
      return (
        <Dino bg="#d9e9d6">
          <path d="M78 34c4-10 12-18 20-20 5-1 8 4 5 8-8 4-14 10-17 18Z" fill="#3f7d4f" />
          <ellipse cx="80" cy="42" rx="11" ry="9" fill="#4f9c63" />
          <ellipse cx="56" cy="58" rx="26" ry="15" fill="#4f9c63" />
          <path d="M30 62c-8 1-14 6-17 11l13-1c1-4 2-7 4-10Z" fill="#3f7d4f" />
          <rect x="46" y="66" width="8" height="14" rx="4" fill="#3f7d4f" />
          <rect x="64" y="66" width="8" height="14" rx="4" fill="#3f7d4f" />
          <circle cx="84" cy="40" r="2.6" fill={EYE} />
          <circle cx="85" cy="40" r="1.4" fill={PUPIL} />
        </Dino>
      );
    case "mosasaurus":
      return (
        <Dino bg="#dbe2f5">
          <path d="M0 70c10-6 22-6 32 0s22 6 32 0 22-6 32 0 16 4 24 0v20H0Z" fill="#4467c9" opacity="0.35" />
          <path d="M14 52c16-14 44-18 64-8l16-10-2 14 8 10-14 2c-18 10-50 8-72-8Z" fill="#3854a4" />
          <path d="M40 60l8 10 8-8Z" fill="#2d4486" />
          <path d="M60 58l6 8 7-7Z" fill="#2d4486" />
          <circle cx="86" cy="44" r="2.8" fill={EYE} />
          <circle cx="87" cy="44" r="1.5" fill={PUPIL} />
        </Dino>
      );
    case "diplodocus":
      return (
        <Dino bg="#f3d7cd">
          <path d="M4 44c10 6 18 10 26 18l8-6c-8-8-20-14-34-12Z" fill="#c0533d" />
          <ellipse cx="54" cy="60" rx="22" ry="12" fill="#d95b43" />
          <path d="M70 56C74 40 84 26 98 22c6-2 10 3 7 7-10 4-18 16-21 31Z" fill="#d95b43" />
          <ellipse cx="102" cy="24" rx="7" ry="5" fill="#d95b43" />
          <rect x="44" y="66" width="7" height="13" rx="3.5" fill="#c0533d" />
          <rect x="60" y="66" width="7" height="13" rx="3.5" fill="#c0533d" />
          <circle cx="104" cy="23" r="2" fill={EYE} />
          <circle cx="105" cy="23" r="1.1" fill={PUPIL} />
        </Dino>
      );
    case "pachy":
      return (
        <Dino bg="#f4e4c3">
          <circle cx="82" cy="34" r="12" fill="#d9a855" />
          <circle cx="82" cy="28" r="9" fill="#f0d7b7" />
          {[70, 76, 88, 94].map((x) => (
            <circle key={x} cx={x} cy={x < 82 ? 22 : 23} r="2" fill="#c98f5d" />
          ))}
          <ellipse cx="56" cy="58" rx="24" ry="14" fill="#e8a33d" />
          <path d="M32 62c-8 0-15 4-18 9l13 0c1-3 2-6 5-9Z" fill="#d9a855" />
          <path d="M74 44c4 2 6 6 5 10l-8-4Z" fill="#e8a33d" />
          <rect x="46" y="66" width="8" height="14" rx="4" fill="#d9a855" />
          <rect x="62" y="66" width="8" height="14" rx="4" fill="#d9a855" />
          <circle cx="86" cy="36" r="2.6" fill={EYE} />
          <circle cx="87" cy="36" r="1.4" fill={PUPIL} />
        </Dino>
      );

    /* ---------------- Snack Shack ---------------- */
    case "burger":
      return (
        <Snack>
          <path d="M36 38a24 14 0 0 1 48 0Z" fill="#e8a33d" />
          <circle cx="48" cy="31" r="1.4" fill="#fffdf7" />
          <circle cx="60" cy="28" r="1.4" fill="#fffdf7" />
          <circle cx="72" cy="31" r="1.4" fill="#fffdf7" />
          <path d="M36 40h48l-5 6 -8-4-8 4-8-4-8 4-8-4Z" fill="#4f9c63" />
          <rect x="36" y="46" width="48" height="8" rx="4" fill="#8a5a3b" />
          <path d="M38 54h44v2a10 6 0 0 1-6 6H44a10 6 0 0 1-6-6Z" fill="#e8a33d" />
          <path d="M40 44l6 6M56 44l6 6M72 44l6 6" stroke="#f4cf5d" strokeWidth="4" strokeLinecap="round" />
        </Snack>
      );
    case "pizza":
      return (
        <Snack>
          <path d="M60 76 36 24h48Z" fill="#f4cf5d" />
          <path d="M34 20h52l-3 8H37Z" fill="#e8a33d" />
          <circle cx="55" cy="38" r="5" fill="#d95b43" />
          <circle cx="68" cy="46" r="4.4" fill="#d95b43" />
          <circle cx="58" cy="56" r="3.8" fill="#d95b43" />
        </Snack>
      );
    case "taco":
      return (
        <Snack>
          <path d="M28 60a32 32 0 0 1 64 0Z" fill="#e8a33d" />
          <path d="M34 60c4-6 8-12 14-12s8 8 14 8 8-10 14-8 8 8 10 12Z" fill="#4f9c63" />
          <circle cx="50" cy="54" r="2.6" fill="#d95b43" />
          <circle cx="66" cy="52" r="2.6" fill="#d95b43" />
          <circle cx="78" cy="56" r="2.4" fill="#d95b43" />
          <path d="M28 60h64v3H28Z" fill="#d9a855" />
        </Snack>
      );
    case "ice-cream":
      return (
        <Snack>
          <path d="M48 48h24L60 82Z" fill="#c98f5d" />
          <path d="M50 52l20 0M52 58l16 0M54 64l12 0M57 70l6 0" stroke="#a9754a" strokeWidth="1.6" />
          <circle cx="53" cy="40" r="10" fill="#f3d7cd" />
          <circle cx="67" cy="40" r="10" fill="#fffdf7" stroke="#f3efe6" strokeWidth="1" />
          <circle cx="60" cy="31" r="10" fill="#d95b43" />
          <circle cx="60" cy="24" r="2.2" fill="#8a2f1e" />
        </Snack>
      );
    case "donut":
      return (
        <Snack>
          <circle cx="60" cy="46" r="24" fill="#e0b184" />
          <path d="M38 44c4-10 14-16 22-16s18 6 22 16c-2 6-8 4-12 2s-8 4-12 2-6 4-10 2-8 0-10-6Z" fill="#d95b43" />
          <circle cx="60" cy="48" r="8" fill="#fffdf7" />
          <path d="M50 36l4 2M64 32l4 2M74 42l4-2M56 28l-2 3" stroke="#f4cf5d" strokeWidth="2.4" strokeLinecap="round" />
        </Snack>
      );
    case "hot-dog":
      return (
        <Snack>
          <path d="M26 52a34 14 0 0 1 68 0l-6 6H32Z" fill="#e8a33d" />
          <rect x="30" y="38" width="60" height="12" rx="6" fill="#c0533d" />
          <path d="M34 44l8-3 8 3 8-3 8 3 8-3 8 3" stroke="#f4cf5d" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </Snack>
      );
    case "cake":
      return (
        <Snack>
          <rect x="34" y="52" width="52" height="20" rx="4" fill="#f3d7cd" />
          <rect x="42" y="38" width="36" height="16" rx="4" fill="#fffdf7" stroke="#f3d7cd" strokeWidth="1.5" />
          <path d="M34 54c4 4 8 0 12 2s8-2 12 0 8 2 12 0 8 2 12-2v4H34Z" fill="#d95b43" opacity="0.85" />
          {[50, 60, 70].map((x) => (
            <g key={x}>
              <rect x={x - 1.5} y="24" width="3" height="12" rx="1.5" fill="#4467c9" />
              <ellipse cx={x} cy="21" rx="2.2" ry="3.2" fill="#e8a33d" />
            </g>
          ))}
        </Snack>
      );
    case "watermelon":
      return (
        <Snack>
          <path d="M26 46a34 34 0 0 0 68 0Z" fill="#4f9c63" />
          <path d="M31 46a29 29 0 0 0 58 0Z" fill="#f4e4c3" />
          <path d="M35 46a25 25 0 0 0 50 0Z" fill="#d95b43" />
          <ellipse cx="50" cy="56" rx="1.8" ry="2.8" fill="#323b52" transform="rotate(20 50 56)" />
          <ellipse cx="62" cy="62" rx="1.8" ry="2.8" fill="#323b52" />
          <ellipse cx="72" cy="54" rx="1.8" ry="2.8" fill="#323b52" transform="rotate(-20 72 54)" />
        </Snack>
      );
    case "fries":
      return (
        <Snack>
          {[46, 53, 60, 67, 74].map((x, i) => (
            <rect key={x} x={x - 2.5} y={22 + (i % 2) * 4} width="5" height="30" rx="2.5" fill="#f4cf5d" />
          ))}
          <path d="M40 44h40l-5 32H45Z" fill="#d95b43" />
          <path d="M40 44h40l-1.2 8H41.2Z" fill="#c0533d" />
        </Snack>
      );
    case "pancakes":
      return (
        <Snack>
          <ellipse cx="60" cy="62" rx="28" ry="8" fill="#c98f5d" />
          <ellipse cx="60" cy="54" rx="26" ry="8" fill="#e0b184" />
          <ellipse cx="60" cy="46" rx="24" ry="8" fill="#c98f5d" />
          <ellipse cx="60" cy="40" rx="22" ry="7" fill="#e0b184" />
          <path d="M44 40c0 3 4 5 4 8m12-9c0 3 4 5 4 9m10-10c0 3 3 5 3 8" stroke="#a9754a" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="54" y="30" width="12" height="7" rx="1.5" fill="#f4cf5d" />
        </Snack>
      );
    case "sushi":
      return (
        <Snack>
          <circle cx="60" cy="46" r="24" fill="#323b52" />
          <circle cx="60" cy="46" r="18" fill="#fffdf7" />
          <circle cx="60" cy="46" r="9" fill="#d95b43" />
          <path d="M54 42l4 4-4 4M66 42l-4 4 4 4" stroke="#4f9c63" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </Snack>
      );
    case "popcorn":
      return (
        <Snack>
          <path d="M42 46h36l-4 30H46Z" fill="#fffdf7" />
          {[46, 54, 62, 70].map((x) => (
            <path key={x} d={`M${x} 46l3 30`} stroke="#d95b43" strokeWidth="4" />
          ))}
          <path d="M42 46h36v4H42Z" fill="#d95b43" />
          {[[48, 38], [58, 32], [68, 38], [53, 28], [63, 26], [74, 32]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="5.4" fill="#fffdf7" stroke="#f4e4c3" strokeWidth="1.4" />
              <circle cx={x - 2} cy={y - 1.5} r="2" fill="#f4e4c3" />
            </g>
          ))}
        </Snack>
      );

    default:
      return <rect width="120" height="90" fill="#f3efe6" />;
  }
}
