import { Fragment } from "react";

/** Renders spoken lines (text between curly quotes) in italic, per the spec's Monopoly rule. */
export function withSpokenLines(text: string): React.ReactNode {
  const parts = text.split(/(“[^”]*”)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part.startsWith("“") ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>
  );
}
