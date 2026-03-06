"use client";

import HubLayout from "@/components/HubLayout";

export default function WorkPage() {
  return (
    <HubLayout hubId="work">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] border-[3px] border-[#111]">
        {/* Section: About */}
        <div className="bg-[#FEE440] border-b-[3px] md:border-b-0 md:border-r-[3px] border-[#111] p-4 sm:p-6">
          <span className="font-[family-name:var(--font-playfair)] text-xl font-black uppercase">
            About
          </span>
        </div>
        <div className="p-4 sm:p-6 border-b-[3px] border-[#111]">
          <p className="font-mono text-sm text-[#111]/50 leading-relaxed">
            Professional experience and career highlights will be showcased here.
          </p>
        </div>

        {/* Section: Experience */}
        <div className="bg-[#FEE440] border-b-[3px] md:border-b-0 md:border-r-[3px] border-[#111] p-4 sm:p-6">
          <span className="font-[family-name:var(--font-playfair)] text-xl font-black uppercase">
            Exp.
          </span>
        </div>
        <div className="p-4 sm:p-6 border-b-[3px] border-[#111]">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="py-3 border-b border-[#111]/10 last:border-0"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-[family-name:var(--font-playfair)] font-bold uppercase">
                  Role Title {i}
                </span>
                <span className="font-mono text-[10px] text-[#111]/25 uppercase">
                  20XX–20XX
                </span>
              </div>
              <p className="font-mono text-xs text-[#111]/30 mt-1">
                Details coming soon...
              </p>
            </div>
          ))}
        </div>

        {/* Section: Skills */}
        <div className="bg-[#FEE440] md:border-r-[3px] border-[#111] p-4 sm:p-6">
          <span className="font-[family-name:var(--font-playfair)] text-xl font-black uppercase">
            Skills
          </span>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"].map(
              (s) => (
                <span
                  key={s}
                  className="font-mono text-xs uppercase tracking-wider border-[2px] border-[#111] px-3 py-1 hover:bg-[#FEE440] transition-colors cursor-default"
                >
                  {s}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </HubLayout>
  );
}
