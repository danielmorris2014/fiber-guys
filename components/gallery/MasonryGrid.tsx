"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MasonryGridProps {
  items: GalleryItem[];
  onSelect: (item: GalleryItem) => void;
}

export function MasonryGrid({ items, onSelect }: MasonryGridProps) {
  const reduced = useReducedMotion();

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            layoutId={`gallery-${item.id}`}
            initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="break-inside-avoid"
          >
            <button
              onClick={() => onSelect(item)}
              className="group relative block w-full bg-bg-2 focus-visible:ring-1 focus-visible:ring-orange outline-none cursor-none"
              aria-label={`View ${item.title}`}
              data-cursor="View"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                />

                {/* Technical Overlay Grid */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {/* Corners */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-orange" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-orange" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-orange" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-orange" />

                  {/* Crosshair center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-orange/50" />
                    <div className="absolute left-1/2 top-0 h-full w-[1px] bg-orange/50" />
                  </div>
                </div>
              </div>

              {/* Minimal Meta */}
              <div className="mt-3 flex justify-between items-start text-left">
                <div>
                  <h3 className="text-sm font-medium text-text group-hover:text-orange transition-colors">{item.title}</h3>
                  <p className="text-xs font-mono text-muted uppercase tracking-wider">{item.category}</p>
                </div>
                <span className="text-[10px] font-mono text-muted/50 hidden sm:block">
                  IMG_{item.id.slice(0, 4)}
                </span>
              </div>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
