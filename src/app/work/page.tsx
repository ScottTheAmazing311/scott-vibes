"use client";

import HubLayout from "@/components/HubLayout";
import { motion } from "framer-motion";

export default function WorkPage() {
  return (
    <HubLayout hubId="work">
      <div className="max-w-3xl space-y-16">
        {/* Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-semibold text-white/80 mb-4">
            About
          </h2>
          <p className="font-[family-name:var(--font-space-grotesk)] text-white/40 text-lg leading-relaxed">
            Professional experience and career highlights will be showcased here.
          </p>
        </motion.section>

        {/* Timeline placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-semibold text-white/80 mb-8">
            Experience
          </h2>
          <div className="space-y-8 border-l border-[#34D399]/20 pl-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative">
                <div
                  className="absolute -left-[2.35rem] top-1 w-3 h-3 rounded-full border-2"
                  style={{
                    borderColor: "#34D399",
                    backgroundColor: i === 1 ? "#34D399" : "transparent",
                  }}
                />
                <div className="text-xs text-[#34D399]/50 font-[family-name:var(--font-space-grotesk)] uppercase tracking-wider">
                  Position {i}
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-lg text-white/60 font-medium mt-1">
                  Role Title
                </h3>
                <p className="font-[family-name:var(--font-space-grotesk)] text-white/25 text-sm mt-2">
                  Details coming soon...
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Skills placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-semibold text-white/80 mb-4">
            Skills & Tools
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"].map(
              (skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-sm rounded-full border border-[#34D399]/15 text-[#34D399]/40 font-[family-name:var(--font-space-grotesk)]"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </motion.section>
      </div>
    </HubLayout>
  );
}
