"use client";

import HubLayout from "@/components/HubLayout";
import { motion } from "framer-motion";

const PLACEHOLDER_ITEMS = [
  { type: "Recipe", title: "Something delicious", icon: "~" },
  { type: "Thought", title: "A random reflection", icon: "?" },
  { type: "Favorite", title: "A thing I love", icon: "*" },
  { type: "Link", title: "Something interesting", icon: ">" },
  { type: "Recipe", title: "Another recipe", icon: "~" },
  { type: "Thought", title: "Another musing", icon: "?" },
];

export default function PotpourriPage() {
  return (
    <HubLayout hubId="potpourri">
      {/* Masonry-style grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {PLACEHOLDER_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            className="break-inside-avoid p-5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#FB7185]/20 transition-colors cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 * i }}
            style={{
              minHeight: `${120 + Math.random() * 80}px`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#FB7185] text-lg font-mono">
                {item.icon}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#FB7185]/40 font-[family-name:var(--font-space-grotesk)]">
                {item.type}
              </span>
            </div>
            <h3 className="font-[family-name:var(--font-syne)] text-white/60 font-medium group-hover:text-white/80 transition-colors">
              {item.title}
            </h3>
            <p className="font-[family-name:var(--font-space-grotesk)] text-white/20 text-sm mt-2">
              Content coming soon...
            </p>
          </motion.div>
        ))}
      </div>
    </HubLayout>
  );
}
