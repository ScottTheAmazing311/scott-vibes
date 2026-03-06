"use client";

import HubLayout from "@/components/HubLayout";

const PIECES = [
  { title: "Untitled Screenplay", type: "SCREENPLAY", excerpt: "A story waiting to be told..." },
  { title: "Future Fiction", type: "NOVEL", excerpt: "Worlds yet to be built..." },
];

export default function WritingPage() {
  return (
    <HubLayout hubId="writing">
      <div className="space-y-0">
        {PIECES.map((piece, i) => (
          <article
            key={i}
            className="border-[3px] border-[#111] p-6 sm:p-8 cursor-pointer hover:bg-[#1B3644] hover:text-[#FAF9F6] transition-colors duration-200 group -mt-[3px] first:mt-0"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[10px] border-[2px] border-[#111] group-hover:border-[#FAF9F6]/30 px-2 py-0.5 uppercase tracking-widest">
                {piece.type}
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-black uppercase">
              {piece.title}
            </h2>
            <p className="font-mono text-sm text-[#111]/40 group-hover:text-[#FAF9F6]/50 mt-3 italic">
              {piece.excerpt}
            </p>
          </article>
        ))}
      </div>
      <p className="font-mono text-xs text-[#111]/25 mt-6 uppercase tracking-widest">
        {"// pieces will be published here for reading on-site"}
      </p>
    </HubLayout>
  );
}
