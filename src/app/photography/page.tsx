"use client";

import HubLayout from "@/components/HubLayout";
import { motion } from "framer-motion";

export default function PhotographyPage() {
  // Placeholder grid — will be CMS-driven
  const placeholders = Array.from({ length: 8 }, (_, i) => i);

  return (
    <HubLayout hubId="photography">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {placeholders.map((i) => (
          <motion.div
            key={i}
            className="relative aspect-[4/3] bg-white/[0.03] overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * i }}
            whileHover={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="w-8 h-8 mx-auto mb-3 rounded-full border border-hub-photography/20"
                  style={{ borderColor: "rgba(245, 158, 11, 0.2)" }}
                />
                <span className="text-white/15 text-xs font-[family-name:var(--font-space-grotesk)] tracking-wider uppercase">
                  Photo {i + 1}
                </span>
              </div>
            </div>
            {/* Hover gradient */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.05), transparent)",
              }}
            />
          </motion.div>
        ))}
      </div>
      <p className="text-white/20 text-center text-sm mt-12 font-[family-name:var(--font-space-grotesk)]">
        Gallery coming soon — photos will live here.
      </p>
    </HubLayout>
  );
}
