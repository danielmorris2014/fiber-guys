"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Preloader() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (reduced) {
      setDone(true);
      setHidden(true);
      return;
    }

    let progress = 0;
    const duration = 2000;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * 100);

      if (counterRef.current) {
        counterRef.current.textContent = `${value}%`;
      }
      if (barRef.current) {
        barRef.current.style.width = `${eased * 100}%`;
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDone(true);
          setTimeout(() => setHidden(true), 600);
        }, 300);
      }
    }

    requestAnimationFrame(tick);
  }, [reduced]);

  if (hidden) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[50000] bg-[#050505] flex flex-col items-center justify-center transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        done ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Status text */}
      <div className="font-mono text-xs text-muted/60 uppercase tracking-[0.2em] mb-8">
        System Check: OSP/ISP Ready
      </div>

      {/* Counter */}
      <div className="text-7xl sm:text-8xl font-heading font-bold text-text tracking-tighter mb-12">
        <span ref={counterRef}>0%</span>
      </div>

      {/* Progress bar */}
      <div className="w-64 sm:w-80 h-px bg-line relative">
        <div
          ref={barRef}
          className="absolute left-0 top-0 h-full bg-orange"
          style={{ width: "0%" }}
        />
      </div>

      {/* Brand */}
      <div className="absolute bottom-8 font-mono text-[10px] text-muted/40 uppercase tracking-[0.15em]">
        Fiber Guys Inc.
      </div>
    </div>
  );
}
