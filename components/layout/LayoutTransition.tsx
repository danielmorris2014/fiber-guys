/**
 * LayoutTransition — pass-through wrapper.
 * motion.div wrapper removed: caused hydration mismatches in Next.js 16
 * (server renders children directly, client wraps in <div style=...>).
 * Page transitions are handled by CSS scroll-behavior and per-section
 * ScrollReveal animations instead.
 */
export function LayoutTransition({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
