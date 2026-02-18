"use client";

import { useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();

  // Stable reference for GSAP ticker callback so we can remove it on cleanup
  const rafCallback = useCallback((time: number) => {
    lenisRef.current?.raf(time * 1000);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      autoRaf: false, // CRITICAL: prevent Lenis from running its own RAF loop
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Let GSAP's ticker drive Lenis (single source of truth for RAF)
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced, rafCallback]);

  return <>{children}</>;
}
