"use client";

import { useInView } from "react-intersection-observer";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface UseInViewportOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

export function useInViewport(options: UseInViewportOptions = {}) {
  const { threshold = 0.2, triggerOnce = true, rootMargin = "0px" } = options;
  const reduced = useReducedMotion();

  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin,
  });

  return {
    ref,
    inView: reduced ? true : inView,
    reduced,
  };
}
