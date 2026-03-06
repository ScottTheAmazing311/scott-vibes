"use client";

import HubLayout from "@/components/HubLayout";

export default function WorkPage() {
  return (
    <HubLayout hubId="work">
      <div className="max-w-3xl">
        {/* Name header — CV style */}
        <div className="mb-12">
          <h2
            className="font-[family-name:var(--font-playfair)] text-4xl sm:text-6xl font-black uppercase tracking-tight"
            style={{ textShadow: "3px 3px 0 rgba(163, 33, 0, 0.08)" }}
          >
            Scott
          </h2>
          <div className="w-full h-[4px] bg-[#A32100] mt-4" />
          <p className="font-mono text-xs text-[#111]/30 mt-3 uppercase tracking-widest">
            Builder / Creator / Professional
          </p>
        </div>

        {/* About */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-black uppercase tracking-tight">
              About
            </h3>
            <div className="flex-1 h-[2px] bg-[#111]/5" />
          </div>
          <p className="font-mono text-sm text-[#111]/40 leading-relaxed">
            Professional summary will go here. A brief overview of career highlights,
            strengths, and what drives the work.
          </p>
        </section>

        {/* Experience */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-black uppercase tracking-tight">
              Experience
            </h3>
            <div className="flex-1 h-[2px] bg-[#111]/5" />
          </div>

          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-6 group">
                {/* Date column */}
                <div className="w-24 sm:w-32 shrink-0 text-right">
                  <span className="font-mono text-[10px] text-[#111]/20 uppercase tracking-wider">
                    20XX — {i === 1 ? "Present" : "20XX"}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 border-l-[3px] border-[#111]/5 group-hover:border-[#A32100] pl-6 pb-2 transition-colors duration-300">
                  <h4 className="font-[family-name:var(--font-playfair)] text-base sm:text-lg font-bold uppercase">
                    Role Title {i}
                  </h4>
                  <span className="font-mono text-xs text-[#A32100]/60 uppercase tracking-wider">
                    Company Name
                  </span>
                  <p className="font-mono text-xs text-[#111]/25 mt-2 leading-relaxed">
                    Responsibilities and accomplishments will be detailed here.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-black uppercase tracking-tight">
              Skills
            </h3>
            <div className="flex-1 h-[2px] bg-[#111]/5" />
          </div>
          <div className="flex flex-wrap gap-2">
            {["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"].map((s) => (
              <span
                key={s}
                className="font-mono text-xs uppercase tracking-wider border-[2px] border-[#111]/10 px-3 py-1.5 hover:border-[#A32100] hover:bg-[#A32100] hover:text-[#FAF9F6] transition-all duration-200 cursor-default"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Contact strip */}
        <div className="border-t-[3px] border-[#111]/5 pt-6">
          <div className="flex flex-wrap gap-6">
            {["Email", "LinkedIn", "GitHub"].map((link) => (
              <span
                key={link}
                className="font-mono text-[10px] text-[#111]/20 uppercase tracking-widest hover:text-[#A32100] transition-colors cursor-pointer"
              >
                {link} {" ->"}
              </span>
            ))}
          </div>
        </div>
      </div>
    </HubLayout>
  );
}
