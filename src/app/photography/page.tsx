"use client";

import HubLayout from "@/components/HubLayout";
import { useState } from "react";

// Staggered gallery wall — varied aspect ratios
const SLOTS = [
  { span: "col-span-2 row-span-2", aspect: "", label: "01" },
  { span: "col-span-1 row-span-1", aspect: "aspect-square", label: "02" },
  { span: "col-span-1 row-span-2", aspect: "", label: "03" },
  { span: "col-span-1 row-span-1", aspect: "aspect-square", label: "04" },
  { span: "col-span-2 row-span-1", aspect: "aspect-[2/1]", label: "05" },
  { span: "col-span-1 row-span-1", aspect: "aspect-square", label: "06" },
  { span: "col-span-1 row-span-1", aspect: "aspect-[4/3]", label: "07" },
  { span: "col-span-1 row-span-1", aspect: "aspect-square", label: "08" },
];

export default function PhotographyPage() {
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  return (
    <HubLayout hubId="photography">
      {/* Gallery wall */}
      <div className="bg-[#111] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[3px] p-[3px]">
        {SLOTS.map((slot, i) => (
          <div
            key={i}
            className={`relative bg-[#FAF9F6] overflow-hidden cursor-pointer group ${slot.span} ${slot.aspect || "aspect-[3/4]"}`}
            onMouseEnter={() => setHoveredSlot(i)}
            onMouseLeave={() => setHoveredSlot(null)}
          >
            {/* Viewfinder brackets — appear on hover */}
            <div
              className="absolute inset-3 pointer-events-none transition-opacity duration-300 z-10"
              style={{ opacity: hoveredSlot === i ? 1 : 0 }}
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-l-[2px] border-t-[2px] border-[#A32100]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r-[2px] border-t-[2px] border-[#A32100]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-[2px] border-b-[2px] border-[#A32100]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-[2px] border-b-[2px] border-[#A32100]" />
            </div>

            {/* Number */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl font-black text-[#111]/[0.04] group-hover:text-[#A32100]/[0.12] transition-colors duration-300 select-none"
              >
                {slot.label}
              </span>
            </div>

            {/* Film strip perforation marks */}
            <div className="absolute top-2 left-2 flex gap-1">
              <div className="w-1.5 h-1.5 border border-[#111]/[0.06]" />
              <div className="w-1.5 h-1.5 border border-[#111]/[0.06]" />
            </div>

            {/* Hover overlay */}
            <div
              className="absolute inset-0 transition-colors duration-300"
              style={{
                backgroundColor: hoveredSlot === i ? "rgba(163, 33, 0, 0.04)" : "transparent",
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8">
        <p className="font-mono text-[10px] text-[#111]/25 uppercase tracking-widest">
          {"// awaiting uploads"}
        </p>
        <p className="font-mono text-[10px] text-[#111]/25 uppercase tracking-widest">
          {SLOTS.length} slots
        </p>
      </div>
    </HubLayout>
  );
}
