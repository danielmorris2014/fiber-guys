"use client";

import { motion } from "motion/react";
import { useSelectedLayoutSegment } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Simplified page transition — enter-only fade+slide.
 * Removed FrozenRouter hack (broke navigation in Next.js 16)
 * and exit animations (added ~1s latency per click).
 */
export function LayoutTransition({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={segment ?? "__home"}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
