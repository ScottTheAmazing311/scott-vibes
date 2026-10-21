/**
 * Geometric game marks: simple primitives in place of icons.
 * Color comes from currentColor; size from the width/height props.
 */
export type KidShape = "circle" | "triangle" | "bars" | "cards";

export default function Mark({
  shape,
  size = 48,
  className = "",
  style,
}: {
  shape: KidShape;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {shape === "circle" && <circle cx="12" cy="12" r="9.5" />}
      {shape === "triangle" && <path d="M12 3.2 21.4 20.3 H2.6 Z" />}
      {shape === "bars" && (
        <>
          <rect x="3.2" y="5" width="4.6" height="14" rx="2.3" />
          <rect x="9.7" y="5" width="4.6" height="14" rx="2.3" />
          <rect x="16.2" y="5" width="4.6" height="14" rx="2.3" />
        </>
      )}
      {shape === "cards" && (
        <>
          <rect x="7.5" y="3" width="13.5" height="13.5" rx="3" opacity="0.45" />
          <rect x="3" y="7.5" width="13.5" height="13.5" rx="3" />
        </>
      )}
    </svg>
  );
}
