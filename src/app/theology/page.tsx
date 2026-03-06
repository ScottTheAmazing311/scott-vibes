"use client";

import HubLayout from "@/components/HubLayout";

const LESSONS = [
  { title: "Lesson Title", source: "Church Recording", medium: "VIDEO" },
  { title: "Video Essay", source: "Coming Soon", medium: "VIDEO" },
];

export default function TheologyPage() {
  return (
    <HubLayout hubId="theology">
      <div className="space-y-0">
        {LESSONS.map((lesson, i) => (
          <div
            key={i}
            className="border-[3px] border-[#111] flex items-stretch cursor-pointer group hover:bg-[#EBD999] transition-colors duration-200 -mt-[3px] first:mt-0"
          >
            <div className="w-20 sm:w-24 border-r-[3px] border-[#111] flex items-center justify-center bg-[#111] group-hover:bg-[#1B3644] text-[#FAF9F6] shrink-0">
              <span className="font-mono text-xl">{">>"}</span>
            </div>
            <div className="p-5 sm:p-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#111]/30">
                {lesson.medium} &middot; {lesson.source}
              </span>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-black uppercase mt-1">
                {lesson.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
      <p className="font-mono text-xs text-[#111]/25 mt-6 uppercase tracking-widest">
        {"// recordings and video essays embedded here"}
      </p>
    </HubLayout>
  );
}
