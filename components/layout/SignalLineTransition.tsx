"use client";

import { motion, AnimatePresence } from "motion/react";
import { useSelectedLayoutSegment } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function SignalLineTransition() {
  const segment = useSelectedLayoutSegment();
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={segment ?? "__home"}
        className="fixed top-0 left-0 right-0 h-[2px] bg-orange z-[9998]"
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: 1, transformOrigin: "left" }}
        exit={{ scaleX: 0, transformOrigin: "right" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </AnimatePresence>
  );
}
