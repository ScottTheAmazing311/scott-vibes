"use client";

import HubLayout from "@/components/HubLayout";

const PIECES = [
  {
    num: "01",
    title: "Untitled Screenplay",
    type: "Screenplay",
    excerpt: "A story waiting to be told. Characters forming in the margins. Dialogue sharpening in the quiet hours.",
    status: "In progress",
  },
  {
    num: "02",
    title: "Future Fiction",
    type: "Novel",
    excerpt: "Worlds yet to be built. The architecture of imagination, one sentence at a time.",
    status: "Coming soon",
  },
];

export default function WritingPage() {
  return (
    <HubLayout hubId="writing">
      <div className="max-w-3xl">
        {/* Table of contents style */}
        {PIECES.map((piece, i) => (
          <article key={i} className="mb-16 last:mb-0 group cursor-pointer">
            {/* Number + rule */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-[family-name:var(--font-playfair)] text-5xl sm:text-7xl font-black text-[#1B3644]/10 group-hover:text-[#1B3644]/25 transition-colors duration-300 select-none leading-none">
                {piece.num}
              </span>
              <div className="flex-1 h-[3px] bg-[#111]/5 group-hover:bg-[#1B3644]/20 transition-colors duration-300" />
            </div>

            {/* Content */}
            <div className="pl-0 sm:pl-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] border-[2px] border-[#111]/10 px-2 py-0.5 text-[#111]/40">
                  {piece.type}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#111]/20">
                  {piece.status}
                </span>
              </div>

              <h2
                className="font-[family-name:var(--font-playfair)] text-2xl sm:text-4xl font-black uppercase tracking-tight group-hover:text-[#1B3644] transition-colors duration-300"
                style={{ textShadow: "2px 2px 0 rgba(27, 54, 68, 0.06)" }}
              >
                {piece.title}
              </h2>

              <p className="font-mono text-sm text-[#111]/35 mt-4 leading-relaxed italic max-w-lg">
                {piece.excerpt}
              </p>

              {/* Read link */}
              <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-6 h-[2px] bg-[#1B3644]" />
                <span className="font-mono text-xs text-[#1B3644] uppercase tracking-widest">
                  Read
                </span>
              </div>
            </div>
          </article>
        ))}

        {/* Divider */}
        <div className="border-t-[3px] border-[#111]/5 pt-6 mt-16">
          <p className="font-mono text-[10px] text-[#111]/20 uppercase tracking-widest">
            {"// more pieces coming — the ink never dries"}
          </p>
        </div>
      </div>
    </HubLayout>
  );
}
