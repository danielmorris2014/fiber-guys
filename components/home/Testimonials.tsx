"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import type { SanityTestimonial } from "@/lib/sanity.queries";

function TestimonialCard({ t, index }: { t: SanityTestimonial; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.1 }}
      className="border border-white/[0.08] rounded-sm bg-white/[0.02] p-8 lg:p-10 flex flex-col justify-between min-w-[320px] snap-start"
    >
      {/* Metric badge */}
      {t.metric && (
        <div className="mb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-blue-400 bg-blue-500/[0.08] border border-blue-500/[0.12] px-3 py-1 rounded-sm">
            {t.metric}
          </span>
        </div>
      )}

      {/* Quote */}
      <blockquote className="font-mono text-sm text-white/60 leading-relaxed mb-8 flex-1">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      {/* Attribution */}
      <div className="border-t border-white/[0.06] pt-5">
        <p className="font-heading text-sm font-bold text-white">{t.name}</p>
        <p className="font-mono text-[10px] text-white/30 mt-1">
          {[t.jobTitle, t.company].filter(Boolean).join(" — ")}
        </p>
      </div>
    </motion.div>
  );
}

export function Testimonials({ items }: { items: SanityTestimonial[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  return (
    <section className="py-32 bg-[#050505] relative border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <span className="font-mono text-blue-600 text-sm uppercase tracking-[0.2em]">
            [Testimonials]
          </span>
          <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mt-4 text-white">
            From the<br />Field
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl">
            What contractors and project managers say after working with our crews.
          </p>
        </div>

        {/* Mobile: horizontal scroll / Desktop: 2-col grid */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide md:grid md:grid-cols-2 md:overflow-visible md:pb-0"
        >
          {items.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
