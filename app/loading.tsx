"use client";

import { motion } from "motion/react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Pulsing signal line */}
        <div className="relative w-32 h-px">
          <div className="absolute inset-0 bg-line" />
          <motion.div
            className="absolute top-0 left-0 h-full bg-orange"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/40">
          Loading
        </span>
      </motion.div>
    </div>
  );
}
