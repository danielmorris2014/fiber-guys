"use client";

/**
 * SmoothScroll wrapper — Lenis removed for performance.
 * GSAP ScrollTrigger works natively with the browser's scroll.
 * CSS scroll-behavior: smooth handles the rest.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
