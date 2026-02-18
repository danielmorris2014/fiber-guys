"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import testimonials from "@/content/testimonials.json";
import type { Testimonial } from "@/lib/types";

function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden ${className}`}
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      {children}
      {/* Spotlight gradient on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 hover-parent-opacity transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(37, 99, 235, 0.08), transparent 40%)",
        }}
      />
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
  reduced,
}: {
  testimonial: Testimonial;
  index: number;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={reduced ? {} : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : reduced ? {} : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <SpotlightCard className="group border border-line bg-bg-2 p-8 lg:p-10 h-full interactable">
        <div className="relative z-10 flex flex-col h-full">
          {/* Decorative quote */}
          <span className="font-heading text-[80px] lg:text-[100px] leading-none text-orange/10 absolute -top-4 -left-2 select-none pointer-events-none">
            {"\u201C"}
          </span>

          {/* Quote */}
          <p className="text-text/80 text-lg leading-relaxed mb-8 relative z-10 pt-6 flex-1">
            {testimonial.quote}
          </p>

          {/* Divider */}
          <div className="h-px bg-line mb-6" />

          {/* Attribution */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading text-text font-bold uppercase text-sm">
                {testimonial.name}
              </p>
              <p className="font-mono text-xs text-muted mt-1">
                {testimonial.title} — {testimonial.company}
              </p>
            </div>
            <span className="font-mono text-xs text-orange uppercase tracking-wider hidden md:block">
              {testimonial.metric}
            </span>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export function Testimonials() {
  const reduced = useReducedMotion();

  return (
    <section className="py-section-sm lg:py-section bg-bg-2 border-y border-line">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <ScrollReveal>
            <span className="font-mono text-xs text-orange uppercase tracking-[0.2em]">
              [Client Testimonials]
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter mt-4">
              Straight From
              <br />
              The Field
            </h2>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(testimonials as Testimonial[]).map((t, i) => (
            <TestimonialCard
              key={t.id}
              testimonial={t}
              index={i}
              reduced={reduced}
            />
          ))}
        </div>
      </div>

      {/* Inline style for spotlight hover */}
      <style jsx global>{`
        .spotlight-card:hover .hover-parent-opacity,
        [class*="SpotlightCard"]:hover .hover-parent-opacity {
          opacity: 1;
        }
        div:hover > .hover-parent-opacity {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
