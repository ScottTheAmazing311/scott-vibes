"use client";

import HubLayout from "@/components/HubLayout";
import { motion } from "framer-motion";

const PLACEHOLDER_LESSONS = [
  { title: "Lesson Title", source: "Church Recording", medium: "Video" },
  { title: "Video Essay", source: "Coming Soon", medium: "Video" },
];

export default function TheologyPage() {
  return (
    <HubLayout hubId="theology">
      <div className="max-w-4xl space-y-6">
        {PLACEHOLDER_LESSONS.map((lesson, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-6 p-6 rounded-lg bg-white/[0.02] border border-white/5 group hover:border-[#FDE68A]/20 transition-colors cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * i }}
          >
            {/* Play icon placeholder */}
            <div
              className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: "rgba(253, 230, 138, 0.2)" }}
            >
              <svg
                className="w-5 h-5 ml-0.5"
                fill="#FDE68A"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold text-white/80 group-hover:text-white transition-colors">
                {lesson.title}
              </h3>
              <p className="font-[family-name:var(--font-space-grotesk)] text-white/30 text-sm mt-1">
                {lesson.source} &middot; {lesson.medium}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-white/20 text-sm mt-12 font-[family-name:var(--font-space-grotesk)]">
        Recordings and video essays will be embedded here.
      </p>
    </HubLayout>
  );
}
