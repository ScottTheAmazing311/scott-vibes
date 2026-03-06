"use client";

import HubLayout from "@/components/HubLayout";

const ITEMS = [
  { type: "RECIPE", title: "Something delicious", icon: "~", size: "large" },
  { type: "THOUGHT", title: "A random reflection", icon: "?", size: "small" },
  { type: "FAVORITE", title: "A thing I love", icon: "*", size: "medium" },
  { type: "LINK", title: "Something interesting", icon: ">", size: "small" },
  { type: "RECIPE", title: "Another recipe", icon: "~", size: "medium" },
  { type: "THOUGHT", title: "Another musing", icon: "?", size: "large" },
  { type: "FAVORITE", title: "Best album of the year", icon: "*", size: "small" },
  { type: "LINK", title: "A rabbit hole", icon: ">", size: "medium" },
];

const SIZE_CLASSES: Record<string, string> = {
  large: "sm:col-span-2 sm:row-span-2",
  medium: "sm:col-span-1 sm:row-span-2",
  small: "sm:col-span-1 sm:row-span-1",
};

const BG_CYCLE = ["transparent", "#EBD999", "transparent", "#1B3644", "transparent", "transparent", "#A32100", "transparent"];
const TEXT_DARK = [true, true, true, false, true, true, false, true];

export default function PotpourriPage() {
  return (
    <HubLayout hubId="potpourri">
      {/* Collage grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[3px] bg-[#111] p-[3px]">
        {ITEMS.map((item, i) => {
          const hasBg = BG_CYCLE[i] !== "transparent";
          const isDark = TEXT_DARK[i];

          return (
            <div
              key={i}
              className={`relative p-5 sm:p-6 cursor-pointer transition-all duration-300 group min-h-[140px] ${SIZE_CLASSES[item.size]}`}
              style={{
                backgroundColor: hasBg ? BG_CYCLE[i] : "#FAF9F6",
              }}
            >
              {/* Corner decoration */}
              <div
                className="absolute top-3 right-3 font-mono text-3xl sm:text-4xl font-bold select-none leading-none transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12"
                style={{
                  color: isDark ? "rgba(17,17,17,0.06)" : "rgba(255,255,255,0.12)",
                }}
              >
                {item.icon}
              </div>

              {/* Type label */}
              <span
                className="font-mono text-[9px] uppercase tracking-[0.25em]"
                style={{
                  color: isDark ? "rgba(17,17,17,0.2)" : "rgba(255,255,255,0.3)",
                }}
              >
                {item.type}
              </span>

              {/* Title */}
              <h3
                className="font-[family-name:var(--font-playfair)] text-base sm:text-lg font-bold uppercase mt-2 transition-colors duration-300"
                style={{
                  color: isDark ? "#111" : "#FAF9F6",
                }}
              >
                {item.title}
              </h3>

              {/* Placeholder text */}
              <p
                className="font-mono text-xs mt-2 leading-relaxed"
                style={{
                  color: isDark ? "rgba(17,17,17,0.2)" : "rgba(255,255,255,0.25)",
                }}
              >
                Content coming soon...
              </p>

              {/* Hover bar */}
              <div
                className="absolute bottom-0 left-0 w-full h-[3px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{
                  backgroundColor: hasBg
                    ? isDark ? "#111" : "#FAF9F6"
                    : "#A32100",
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-6">
        <p className="font-mono text-[10px] text-[#111]/20 uppercase tracking-widest">
          {"// a bit of everything"}
        </p>
        <p className="font-mono text-[10px] text-[#111]/20 uppercase tracking-widest">
          {ITEMS.length} items
        </p>
      </div>
    </HubLayout>
  );
}
