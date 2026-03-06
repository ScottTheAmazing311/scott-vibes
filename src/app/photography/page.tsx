"use client";

import HubLayout from "@/components/HubLayout";

export default function PhotographyPage() {
  const placeholders = Array.from({ length: 8 }, (_, i) => i);

  return (
    <HubLayout hubId="photography">
      <div className="grid grid-cols-2 md:grid-cols-4 border-[3px] border-[#111]">
        {placeholders.map((i) => (
          <div
            key={i}
            className="aspect-square border-[1.5px] border-[#111] bg-[#FAF9F6] flex items-center justify-center cursor-pointer group hover:bg-[#FF6B35] transition-colors duration-150"
          >
            <div className="text-center transition-colors group-hover:text-white">
              <span className="font-[family-name:var(--font-playfair)] text-3xl font-black text-[#111]/10 group-hover:text-white/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="font-mono text-[8px] uppercase tracking-widest text-[#111]/20 group-hover:text-white/50 mt-1">
                photo
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="font-mono text-xs text-[#111]/25 mt-6 uppercase tracking-widest">
        {"// gallery loading — photos will live here"}
      </p>
    </HubLayout>
  );
}
