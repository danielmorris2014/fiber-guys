"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const stats = [
  { value: "15M+", label: "Feet Placed", suffix: "" },
  { value: "10K+", label: "Splices Completed", suffix: "" },
  { value: "99%", label: "First-Pass Rate", suffix: "" },
  { value: ".03dB", label: "Avg. Loss", suffix: "" },
];

function StatItem({ stat, index, reduced }: { stat: typeof stats[0]; index: number; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative border-l-2 border-orange/30 pl-6 py-4 group hover:border-orange transition-colors duration-300"
      initial={reduced ? {} : { opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : reduced ? {} : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="font-heading text-4xl lg:text-5xl font-bold tracking-tighter text-text group-hover:text-orange transition-colors duration-300">
        {stat.value}
      </div>
      <div className="font-mono text-xs text-muted uppercase tracking-widest mt-2">
        {stat.label}
      </div>
    </motion.div>
  );
}

export function ProofStrip() {
  const reduced = useReducedMotion();

  return (
    <section className="border-y border-line bg-bg-2">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  );
}
