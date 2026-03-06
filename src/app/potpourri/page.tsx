"use client";

import HubLayout from "@/components/HubLayout";

const ITEMS = [
  { type: "RECIPE", title: "Something delicious", icon: "~" },
  { type: "THOUGHT", title: "A random reflection", icon: "?" },
  { type: "FAVORITE", title: "A thing I love", icon: "*" },
  { type: "LINK", title: "Something interesting", icon: ">" },
  { type: "RECIPE", title: "Another recipe", icon: "~" },
  { type: "THOUGHT", title: "Another musing", icon: "?" },
];

export default function PotpourriPage() {
  return (
    <HubLayout hubId="potpourri">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className="border-[3px] border-[#111] -ml-[3px] first:ml-0 sm:first:ml-0 -mt-[3px] first:mt-0 p-5 cursor-pointer hover:bg-[#EBD999] transition-colors duration-200 group"
            style={{ minHeight: `${130 + (i % 3) * 30}px` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-lg text-[#A32100]">
                [{item.icon}]
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#111]/25 border-[2px] border-[#111]/15 px-1.5 py-0.5">
                {item.type}
              </span>
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold uppercase">
              {item.title}
            </h3>
            <p className="font-mono text-xs text-[#111]/25 mt-2">
              Content coming soon...
            </p>
          </div>
        ))}
      </div>
    </HubLayout>
  );
}
