import type { Metadata } from "next";
import Link from "next/link";
import Lines from "@/components/Lines";
import PillButton from "@/components/PillButton";
import Reveal from "@/components/Reveal";
import { domains, theologyLibrary as lib } from "@/lib/content";

const theology = domains.find((d) => d.id === "theology")!;

export const metadata: Metadata = {
  title: "Theology Library",
  description: lib.line,
};

export default function TheologyLibraryPage() {
  return (
    <main>
      {/* Hero */}
      <Reveal as="section" className="pt-24 md:pt-28" style={{ background: theology.bg }} delay={200} amount={0.01}>
        <div className="wrap pb-16 md:pb-24">
          <p className="label fade">
            <Link href={theology.path} className="hover:text-charcoal transition-colors">
              {lib.label}
            </Link>
          </p>
          <h1 className="display display-lg mt-8">
            <Lines lines={[lib.title]} offset={1} />
          </h1>
          <p className="body fade mt-6" style={{ ["--i" as string]: 3 }}>
            {lib.line}
          </p>
        </div>
      </Reveal>

      {/* Armarium */}
      <Reveal as="section" className="on-dark bg-charcoal py-20 md:py-28" amount={0.2} data-header-theme="dark">
        <div className="wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label num-in">01</span>
            <h2 className="display display-lg mt-4 [&_.em]:text-acid">
              <Lines lines={["*Armarium*"]} offset={1} />
            </h2>
            <p className="body fade mt-4" style={{ ["--i" as string]: 3 }}>
              {lib.armarium.line}
            </p>
          </div>
          <div className="fade" style={{ ["--i" as string]: 4 }}>
            <PillButton href={lib.armarium.href}>Open Armarium</PillButton>
          </div>
        </div>
      </Reveal>

      {/* Gospel Doctrine folders */}
      <Reveal as="section" className="wrap py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3">
            <span className="label num-in">02</span>
            <h2 className="display display-md mt-4">
              <Lines lines={lib.lessonsTitle.split(" ")} offset={1} />
            </h2>
            <p className="body fade mt-4 text-sm" style={{ ["--i" as string]: 3 }}>
              {lib.lessonsLine}
            </p>
          </div>
          <div className="md:col-span-9">
            <div className="grid gap-5 sm:grid-cols-2">
              {lib.folders.map((folder, i) => (
                <a
                  key={folder.title}
                  href={folder.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group fade block h-full"
                  style={{ ["--i" as string]: i + 1 }}
                >
                  <span className="flex h-full flex-col justify-between border border-charcoal/20 p-6 transition-colors duration-500 ease-[var(--ease-out)] group-hover:border-charcoal md:p-8">
                    <span>
                      <span className="label tabular-nums">0{i + 1}</span>
                      <span className="display display-sm mt-4 block transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1">
                        {folder.title}
                      </span>
                      <span className="body mt-3 block text-sm">{folder.line}</span>
                    </span>
                    <span className="label mt-12 block">
                      Open folder <span aria-hidden="true">&rarr;</span>
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Back to top */}
      <Reveal as="section" className="wrap flex justify-center pb-24 md:pb-32" amount={0.3}>
        <PillButton href="#" up>Back to top</PillButton>
      </Reveal>
    </main>
  );
}
