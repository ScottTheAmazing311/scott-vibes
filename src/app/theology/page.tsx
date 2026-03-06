"use client";

import HubLayout from "@/components/HubLayout";

const ENTRIES = [
  { title: "Lesson Title", source: "Church Recording", type: "Video", date: "2026" },
  { title: "Video Essay", source: "Coming Soon", type: "Video", date: "TBD" },
];

export default function TheologyPage() {
  return (
    <HubLayout hubId="theology">
      <div className="max-w-3xl mx-auto">
        {/* Centered, contemplative layout */}
        <div className="text-center mb-16">
          <div className="inline-block relative">
            {/* Cross motif */}
            <div className="w-[2px] h-10 bg-[#111]/10 mx-auto" />
            <div className="w-8 h-[2px] bg-[#111]/10 mx-auto -mt-4 mb-4" />
          </div>
          <p className="font-mono text-xs text-[#111]/30 uppercase tracking-[0.4em] mt-4">
            Lessons & Reflections
          </p>
        </div>

        {/* Entries */}
        <div className="space-y-6">
          {ENTRIES.map((entry, i) => (
            <div
              key={i}
              className="border-[3px] border-[#111]/10 hover:border-[#111] transition-colors duration-300 cursor-pointer group"
            >
              <div className="flex">
                {/* Play column */}
                <div className="w-20 sm:w-28 border-r-[3px] border-[#111]/10 group-hover:border-[#111] group-hover:bg-[#1B3644] flex items-center justify-center shrink-0 transition-all duration-300">
                  <div className="text-center">
                    <span className="font-mono text-lg sm:text-xl text-[#111]/20 group-hover:text-[#FAF9F6] transition-colors duration-300">
                      {">>"}
                    </span>
                    <div className="font-mono text-[8px] uppercase tracking-widest text-[#111]/15 group-hover:text-[#FAF9F6]/40 transition-colors mt-1">
                      {entry.type}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 sm:p-6">
                  <div className="flex items-baseline justify-between">
                    <h3
                      className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold group-hover:text-[#1B3644] transition-colors duration-300"
                    >
                      {entry.title}
                    </h3>
                    <span className="font-mono text-[10px] text-[#111]/15 hidden sm:block">
                      {entry.date}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#111]/25 mt-2 uppercase tracking-wider">
                    {entry.source}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Spacious footer note */}
        <div className="text-center mt-20">
          <div className="w-[2px] h-6 bg-[#111]/10 mx-auto mb-4" />
          <p className="font-mono text-[10px] text-[#111]/20 uppercase tracking-[0.3em]">
            Recordings & video essays will be added here
          </p>
        </div>
      </div>
    </HubLayout>
  );
}
