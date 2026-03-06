"use client";

import HubLayout from "@/components/HubLayout";
import { motion } from "framer-motion";

const PLACEHOLDER_PROJECTS = [
  {
    name: "project_01",
    description: "A vibe-coded creation",
    tech: ["Next.js", "AI"],
    url: "#",
  },
  {
    name: "project_02",
    description: "Another experiment",
    tech: ["React", "Canvas"],
    url: "#",
  },
  {
    name: "scottvibes.com",
    description: "This very site",
    tech: ["Next.js", "Three.js", "Sanity"],
    url: "https://www.scottvibes.com",
  },
];

export default function CodedCreationsPage() {
  return (
    <HubLayout hubId="coded-creations">
      <div className="font-mono space-y-0">
        {/* Terminal header */}
        <motion.div
          className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border border-white/5 rounded-t-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="text-white/20 text-xs ml-2">~/coded-creations</span>
        </motion.div>

        {/* Project list */}
        <div className="bg-white/[0.015] border-x border-b border-white/5 rounded-b-lg p-4 space-y-4">
          <motion.div
            className="text-[#22D3EE]/50 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            $ ls -la projects/
          </motion.div>

          {PLACEHOLDER_PROJECTS.map((project, i) => (
            <motion.a
              key={i}
              href={project.url}
              target={project.url.startsWith("http") ? "_blank" : undefined}
              rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="block pl-4 py-3 border-l-2 border-[#22D3EE]/10 hover:border-[#22D3EE]/50 transition-colors group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.15 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[#22D3EE] font-semibold group-hover:text-[#22D3EE] transition-colors">
                  {project.name}
                </span>
                <span className="text-white/20">&mdash;</span>
                <span className="text-white/40 text-sm">
                  {project.description}
                </span>
              </div>
              <div className="flex gap-2 mt-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#22D3EE]/5 text-[#22D3EE]/40"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </HubLayout>
  );
}
