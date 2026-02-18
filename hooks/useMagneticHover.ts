"use client";

import { useRef, useState, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MagneticPosition {
  x: number;
  y: number;
}

export function useMagneticHover(strength: number = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<MagneticPosition>({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      setPosition({ x: deltaX, y: deltaY });
    },
    [strength, reduced]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return { ref, position, handleMouseMove, handleMouseLeave };
}
