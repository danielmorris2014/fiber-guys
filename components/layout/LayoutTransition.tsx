"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSelectedLayoutSegment } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

export function LayoutTransition({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const reduced = useReducedMotion();

  const variants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={segment ?? "__home"}
        variants={!reduced ? variants : undefined}
        initial="initial"
        animate="enter"
        exit="exit"
        className="will-change-transform"
        suppressHydrationWarning
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}
