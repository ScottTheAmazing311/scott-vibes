"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HUBS, Hub } from "@/lib/hubs";

interface Props {
  hubId: string;
  children: React.ReactNode;
}

export default function HubLayout({ hubId, children }: Props) {
  const currentHub = HUBS.find((h) => h.id === hubId)!;
  const otherHubs = HUBS.filter((h) => h.id !== hubId);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Top navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#050505]/80 backdrop-blur-md border-b border-white/5"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Link
          href="/"
          className="font-[family-name:var(--font-syne)] text-lg font-bold text-white/80 hover:text-white transition-colors"
        >
          scottvibes
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {otherHubs.map((hub) => (
            <Link
              key={hub.id}
              href={hub.path}
              className="text-xs font-[family-name:var(--font-space-grotesk)] tracking-wide transition-colors duration-300 hover:opacity-100 opacity-40"
              style={{ color: hub.color }}
            >
              {hub.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu - hub dots */}
        <div className="flex md:hidden items-center gap-2">
          {otherHubs.map((hub) => (
            <Link key={hub.id} href={hub.path}>
              <span
                className="block w-2.5 h-2.5 rounded-full transition-transform hover:scale-150"
                style={{ backgroundColor: hub.color }}
              />
            </Link>
          ))}
        </div>
      </motion.nav>

      {/* Hub header */}
      <motion.header
        className="pt-28 pb-12 px-6 md:px-12 lg:px-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <div
            className="inline-block w-12 h-1 rounded-full mb-6"
            style={{ backgroundColor: currentHub.color }}
          />
          <h1
            className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{ color: currentHub.color }}
          >
            {currentHub.name}
          </h1>
          <p className="font-[family-name:var(--font-space-grotesk)] text-white/40 text-lg mt-3">
            {currentHub.subtitle}
          </p>
        </div>
      </motion.header>

      {/* Content */}
      <motion.main
        className="px-6 md:px-12 lg:px-20 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">{children}</div>
      </motion.main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-[family-name:var(--font-syne)] text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            back to the dial
          </Link>
          <span className="text-white/15 text-xs font-[family-name:var(--font-space-grotesk)]">
            scottvibes
          </span>
        </div>
      </footer>
    </div>
  );
}
