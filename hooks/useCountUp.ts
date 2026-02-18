"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

interface UseCountUpOptions {
  target: number;
  duration?: number;
  delay?: number;
  suffix?: string;
}

interface UseCountUpReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  value: number;
  formattedValue: string;
}

export function useCountUp({
  target,
  duration = 2000,
  delay = 0,
  suffix = "",
}: UseCountUpOptions): UseCountUpReturn {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  const hasStarted = useRef(false);

  const animate = useCallback(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const start = performance.now() + delay;

    function tick(now: number) {
      const elapsed = now - start;
      if (elapsed < 0) {
        requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setValue(eased * target);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    }

    requestAnimationFrame(tick);
  }, [target, duration, delay]);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    if (isInView) {
      animate();
    }
  }, [isInView, reduced, target, animate]);

  return {
    ref,
    value,
    formattedValue: formatNumber(value) + suffix,
  };
}
