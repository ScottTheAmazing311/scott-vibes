/**
 * Geometric game marks: simple primitives in place of icons.
 * Color comes from currentColor; size from the width/height props.
 */
export type KidShape = "circle" | "triangle" | "bars" | "cards" | "ring" | "paw" | "star" | "oval" | "book" | "globe";

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
      {shape === "ring" && <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm0 4a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z" />}
      {shape === "paw" && (
        <>
          <circle cx="6" cy="9" r="2.4" />
          <circle cx="12" cy="6.6" r="2.4" />
          <circle cx="18" cy="9" r="2.4" />
          <ellipse cx="12" cy="15.8" rx="5.6" ry="4.6" />
        </>
      )}
      {shape === "star" && <path d="M12 2.4 14.7 8.6 21.4 9.3 16.4 13.8 17.8 20.4 12 17 6.2 20.4 7.6 13.8 2.6 9.3 9.3 8.6 Z" />}
      {shape === "oval" && <ellipse cx="12" cy="12" rx="10" ry="6.4" transform="rotate(-24 12 12)" />}
      {shape === "book" && (
        <>
          <path d="M11.2 5.6C8.9 4.1 5.8 3.7 2.8 4.5c-.5.1-.8.5-.8 1v12.6c0 .7.6 1.1 1.3 1 2.6-.6 5.6-.2 7.9 1.2V5.6Z" />
          <path d="M12.8 5.6c2.3-1.5 5.4-1.9 8.4-1.1.5.1.8.5.8 1v12.6c0 .7-.6 1.1-1.3 1-2.6-.6-5.6-.2-7.9 1.2V5.6Z" />
        </>
      )}
      {shape === "globe" && (
        <g fill="none" stroke="currentColor" strokeWidth="2.4">
          <circle cx="12" cy="12" r="8.8" />
          <ellipse cx="12" cy="12" rx="4.1" ry="8.8" />
          <path d="M3.5 12h17" />
        </g>
      )}
    </svg>
  );
}
