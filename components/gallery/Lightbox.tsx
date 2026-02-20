"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface LightboxProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onNavigate: (item: GalleryItem) => void;
}

export function Lightbox({ item, items, onClose, onNavigate }: LightboxProps) {
  const reduced = useReducedMotion();
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const scrollYRef = useRef(0);

  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(items[currentIndex + 1]);
  }, [hasNext, currentIndex, items, onNavigate]);

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(items[currentIndex - 1]);
  }, [hasPrev, currentIndex, items, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goPrev();
          break;
        case "ArrowRight":
          goNext();
          break;
        case "Tab":
          // Focus trap
          if (lightboxRef.current) {
            const focusable = lightboxRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose, goNext, goPrev]);

  // Scroll lock & focus management
  useEffect(() => {
    if (item) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
      lightboxRef.current?.focus();
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollYRef.current);
      previousFocusRef.current?.focus();
    }
  }, [item]);

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

    // Only trigger if horizontal swipe > 50px and more horizontal than vertical
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) goNext();
      else goPrev();
    }

    touchStartRef.current = null;
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery image: ${item.title}`}
          tabIndex={-1}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center outline-none"
          initial={reduced ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Backdrop with Blur */}
          <motion.div
            className="absolute inset-0 bg-bg/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Grid Overlay on Backdrop */}
          <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />

          {/* Top Bar: Close & Counter */}
          <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start pointer-events-none">
            <div className="font-mono text-xs text-muted/50 tracking-widest">
              IMG_{item.id.toUpperCase()}
            </div>

            <button
              onClick={onClose}
              className="pointer-events-auto p-2 text-muted hover:text-orange transition-colors group"
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Main Image Container */}
          <div className="relative z-10 w-full h-[85vh] p-4 sm:p-8 flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={reduced ? {} : { opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduced ? {} : { opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full max-w-[1920px] pointer-events-auto"
              >
                <Image
                  src={item.src}
                  alt={`${item.title} — ${item.description}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom HUD: Metadata & Nav */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 bg-gradient-to-t from-bg via-bg/80 to-transparent">
            {/* Nav Arrows (Left) */}
            <div className="flex items-center gap-2 order-2 sm:order-1">
              <button
                onClick={goPrev}
                disabled={!hasPrev}
                className="p-3 border border-white/10 rounded-none hover:bg-white/5 hover:border-orange/50 disabled:opacity-20 transition-all group"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-muted group-hover:text-orange" />
              </button>
              <button
                onClick={goNext}
                disabled={!hasNext}
                className="p-3 border border-white/10 rounded-none hover:bg-white/5 hover:border-orange/50 disabled:opacity-20 transition-all group"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-muted group-hover:text-orange" />
              </button>

              <div className="ml-4 font-mono text-xs text-muted/50 hidden sm:block">
                {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </div>
            </div>

            {/* Metadata (Right) */}
            <div className="text-right max-w-lg order-1 sm:order-2">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <p className="font-mono text-xs text-orange mb-1 uppercase tracking-wider">{item.category} // {item.location}</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-medium tracking-tight text-text">{item.title}</h2>
                {item.description && <p className="text-sm text-muted mt-2 font-light">{item.description}</p>}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
