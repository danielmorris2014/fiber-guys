"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import galleryData from "@/content/gallery.json";
import type { GalleryItem } from "@/lib/types";

const projects = [
  {
    items: (galleryData as GalleryItem[]).slice(0, 2),
    layout: "normal" as const,
  },
  {
    items: (galleryData as GalleryItem[]).slice(2, 4),
    layout: "reversed" as const,
  },
];

function ProjectRow({
  items,
  layout,
  index,
  reduced,
}: {
  items: GalleryItem[];
  layout: "normal" | "reversed";
  index: number;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const mainItem = items[0];
  const sideItem = items[1];

  return (
    <motion.div
      ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${
        layout === "reversed" ? "lg:direction-rtl" : ""
      }`}
      initial={reduced ? {} : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : reduced ? {} : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 2/3 image */}
      <div className={`lg:col-span-2 ${layout === "reversed" ? "lg:order-2" : ""}`}>
        <Link
          href="/gallery"
          className="interactable group relative block aspect-[16/10] overflow-hidden bg-bg-2"
          data-cursor="View"
        >
          <Image
            src={mainItem.src}
            alt={mainItem.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          <div className="absolute inset-0 bg-bg/10 group-hover:bg-transparent transition-colors duration-500" />

          {/* Category badge */}
          <span className="absolute top-4 left-4 font-mono text-[10px] text-white uppercase tracking-widest bg-orange/80 px-2 py-1">
            {mainItem.category}
          </span>

          {/* Caption on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h4 className="font-heading text-lg font-bold text-white">{mainItem.title}</h4>
            <p className="font-mono text-xs text-white/60 mt-1">{mainItem.location}</p>
          </div>
        </Link>
      </div>

      {/* 1/3 text + secondary image */}
      <div className={`flex flex-col gap-6 ${layout === "reversed" ? "lg:order-1" : ""}`}>
        {sideItem && (
          <Link
            href="/gallery"
            className="interactable group relative block aspect-[4/3] overflow-hidden bg-bg-2"
            data-cursor="View"
          >
            <Image
              src={sideItem.src}
              alt={sideItem.title}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-bg/10 group-hover:bg-transparent transition-colors duration-500" />
            <span className="absolute top-4 left-4 font-mono text-[10px] text-white uppercase tracking-widest bg-orange/80 px-2 py-1">
              {sideItem.category}
            </span>
          </Link>
        )}

        <div className="flex-1 flex flex-col justify-end">
          <p className="font-mono text-xs text-muted leading-relaxed">
            {mainItem.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function GalleryTeaser() {
  const reduced = useReducedMotion();

  return (
    <section className="py-section-sm lg:py-section border-b border-line">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16">
          <div>
            <ScrollReveal>
              <span className="font-mono text-xs text-orange uppercase tracking-[0.2em]">
                [Live Site Documentation]
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 className="font-heading text-5xl lg:text-7xl font-bold tracking-tighter mt-4">
                Field Report
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2} className="hidden lg:block">
            <MagneticButton href="/gallery" variant="secondary">
              View All
            </MagneticButton>
          </ScrollReveal>
        </div>

        {/* Project rows */}
        <div className="space-y-8">
          {projects.map((project, i) => (
            <ProjectRow
              key={i}
              items={project.items}
              layout={project.layout}
              index={i}
              reduced={reduced}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="lg:hidden mt-12 text-center">
          <MagneticButton href="/gallery" variant="secondary">
            View All Field Work
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
