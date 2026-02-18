"use client";

import { useReducedMotion as useMotionReducedMotion } from "motion/react";

export function useReducedMotion(): boolean {
  const shouldReduce = useMotionReducedMotion();
  return shouldReduce ?? false;
}
