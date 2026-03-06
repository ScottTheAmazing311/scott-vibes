"use client";

import HubLayout from "@/components/HubLayout";
import { useState, useEffect, useRef } from "react";

const PROJECTS = [
  {
    name: "project_01",
    desc: "A vibe-coded creation",
    tech: ["Next.js", "AI"],
    url: "#",
    status: "live",
  },
  {
    name: "project_02",
    desc: "Another experiment",
    tech: ["React", "Canvas"],
    url: "#",
    status: "dev",
  },
  {
    name: "scottvibes.com",
    desc: "This very site",
    tech: ["Next.js", "Sanity"],
    url: "https://www.scottvibes.com",
    status: "live",
  },
];

function BlinkingCursor() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className="inline-block w-2 h-4 bg-[#EBD999] ml-1 align-middle"
      style={{ opacity: visible ? 1 : 0 }}
    />
  );
}

export default function CodedCreationsPage() {
  return (
    <HubLayout hubId="coded-creations">
      {/* Full terminal window */}
      <div className="border-[3px] border-[#111] bg-[#1B3644] text-[#FAF9F6] font-mono text-sm min-h-[60vh]">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b-[3px] border-[#111] bg-[#111]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-[2px] border-[#A32100]" />
            <div className="w-3 h-3 border-[2px] border-[#EBD999]" />
            <div className="w-3 h-3 border-[2px] border-[#FAF9F6]/30" />
          </div>
          <span className="text-[10px] text-[#FAF9F6]/30 tracking-widest uppercase">
            ~/coded-creations
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Directory listing */}
          <div>
            <div className="text-[#EBD999]/60 mb-3">$ ls -la projects/</div>
            <div className="text-[#FAF9F6]/25 text-xs mb-4">
              total {PROJECTS.length}
            </div>

            {PROJECTS.map((project, i) => (
              <a
                key={i}
                href={project.url}
                target={project.url.startsWith("http") ? "_blank" : undefined}
                rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block py-3 border-b border-[#FAF9F6]/5 last:border-0 hover:bg-[#FAF9F6]/5 -mx-2 px-2 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-[#FAF9F6]/15 text-xs shrink-0 mt-0.5">
                    drwxr-xr-x
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[#EBD999] font-bold group-hover:text-[#EBD999] transition-colors">
                        {project.name}/
                      </span>
                      <span
                        className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 border"
                        style={{
                          borderColor: project.status === "live" ? "#A32100" : "#FAF9F6",
                          color: project.status === "live" ? "#A32100" : "#FAF9F6",
                          opacity: 0.5,
                        }}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div className="text-[#FAF9F6]/30 text-xs mt-1">
                      {project.desc}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[9px] text-[#FAF9F6]/20"
                        >
                          [{t}]
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[#FAF9F6]/10 text-xs group-hover:text-[#EBD999]/40 transition-colors">
                    {"->"}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Prompt */}
          <div className="text-[#EBD999]/60 pt-2">
            $ <BlinkingCursor />
          </div>
        </div>
      </div>
    </HubLayout>
  );
}
