"use client";

import { motion } from "motion/react";

/**
 * IndustryMarquee — infinite-scroll strip of telecom industry brand names.
 * Uses Framer Motion for animation (immune to CSS prefers-reduced-motion
 * !important overrides that kill CSS animations).
 */

const BRANDS = [
  { name: "Corning", sub: "Fiber Optics" },
  { name: "AFL", sub: "Fiber & Cable" },
  { name: "Fujikura", sub: "Fusion Splicers" },
  { name: "CommScope", sub: "Infrastructure" },
  { name: "PLP", sub: "Closures & Hardware" },
  { name: "Sumitomo", sub: "Splicer Systems" },
  { name: "VIAVI", sub: "Test & Measurement" },
  { name: "Condux", sub: "Jetting Equipment" },
];

function BrandItem({ name, sub }: { name: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 select-none flex-shrink-0">
      <span className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-white/20">
        {name}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-widest text-white/10 hidden md:inline">
        {sub}
      </span>
    </div>
  );
}

function BrandSet({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className="flex gap-12 md:gap-20 pr-12 md:pr-20 flex-shrink-0"
      aria-hidden={duplicate}
    >
      {BRANDS.map((b) => (
        <BrandItem
          key={duplicate ? `dup-${b.name}` : b.name}
          {...b}
        />
      ))}
    </div>
  );
}

export function IndustryMarquee() {
  return (
    <section
      className="relative overflow-hidden border-b border-white/[0.06] bg-[#050505] py-5 md:py-6"
      aria-label="Industry standards and equipment partners"
    >
      {/* Left/right fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#050505] to-transparent" />

      <motion.div
        className="flex w-max"
        animate={{ x: "-50%" }}
        transition={{
          x: {
            duration: 25,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          },
        }}
      >
        <BrandSet />
        <BrandSet duplicate />
      </motion.div>
    </section>
  );
}
