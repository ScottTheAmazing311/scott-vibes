"use client";

import HubLayout from "@/components/HubLayout";

const PROJECTS = [
  { name: "project_01", desc: "A vibe-coded creation", tech: ["Next.js", "AI"], url: "#" },
  { name: "project_02", desc: "Another experiment", tech: ["React", "Canvas"], url: "#" },
  { name: "scottvibes.com", desc: "This very site", tech: ["Next.js", "Sanity"], url: "https://www.scottvibes.com" },
];

export default function CodedCreationsPage() {
  return (
    <HubLayout hubId="coded-creations">
      <div className="border-[3px] border-[#111]">
        <div className="bg-[#1B3644] text-[#EBD999] px-4 py-2 font-mono text-xs flex items-center justify-between">
          <span>~/coded-creations</span>
        </div>

        <div className="bg-[#FAF9F6] divide-y-[3px] divide-[#111]">
          <div className="px-4 py-3 font-mono text-xs text-[#111]/40">
            $ ls -la projects/
          </div>

          {PROJECTS.map((project, i) => (
            <a
              key={i}
              href={project.url}
              target={project.url.startsWith("http") ? "_blank" : undefined}
              rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="block px-4 py-5 hover:bg-[#1B3644] hover:text-[#FAF9F6] transition-colors duration-200 group"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono font-bold">
                  {project.name}
                </span>
                <span className="font-mono text-xs text-[#111]/30 group-hover:text-[#FAF9F6]/50">
                  — {project.desc}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[9px] uppercase tracking-wider border-[2px] border-[#111]/20 group-hover:border-[#FAF9F6]/20 px-2 py-0.5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </HubLayout>
  );
}
