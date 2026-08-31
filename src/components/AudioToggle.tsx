"use client";

import { useState } from "react";

/** "Listen" link that swaps into an inline audio player on demand. */
export default function AudioToggle({ src, title }: { src: string; title: string }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" className="ulink text-sm" onClick={() => setOpen(true)}>
        Listen
      </button>
    );
  }
  return (
    <audio controls autoPlay src={src} className="h-9 w-full max-w-md" aria-label={`Recording: ${title}`}>
      Your browser does not support audio playback.
    </audio>
  );
}
