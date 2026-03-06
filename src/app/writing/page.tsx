"use client";

import HubLayout from "@/components/HubLayout";
import { motion } from "framer-motion";

const PLACEHOLDER_PIECES = [
  {
    title: "Untitled Screenplay",
    type: "Screenplay",
    excerpt: "A story waiting to be told...",
  },
  {
    title: "Future Fiction",
    type: "Novel",
    excerpt: "Worlds yet to be built...",
  },
];

export default function WritingPage() {
  return (
    <HubLayout hubId="writing">
      <div className="max-w-3xl">
        {PLACEHOLDER_PIECES.map((piece, i) => (
          <motion.article
            key={i}
            className="py-10 border-b border-white/5 group cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 * i }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.25em] font-[family-name:var(--font-space-grotesk)]"
              style={{ color: "#A78BFA" }}
            >
              {piece.type}
            </span>
            <h2 className="font-[family-name:var(--font-syne)] text-2xl md:text-3xl font-semibold text-white/80 mt-2 group-hover:text-white transition-colors">
              {piece.title}
            </h2>
            <p className="font-[family-name:var(--font-space-grotesk)] text-white/30 mt-3 text-lg italic">
              {piece.excerpt}
            </p>
          </motion.article>
        ))}
      </div>
      <p className="text-white/20 text-sm mt-12 font-[family-name:var(--font-space-grotesk)]">
        Pieces will be published here for reading on-site.
      </p>
    </HubLayout>
  );
}
