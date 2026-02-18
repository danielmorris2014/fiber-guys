"use client";

import { useEffect, useState } from "react";
import { useCustomCursor } from "@/hooks/useCustomCursor";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CustomCursor() {
  const { elements, isTouch } = useCustomCursor();
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reduced || isTouch.current) return null;

  return (
    <>
      <style jsx global>{`
        body, a, button {
          cursor: none;
        }
        input, textarea, select {
          cursor: text;
        }
      `}</style>

      {/* Cursor Dot — mix-blend-difference for visibility over any background */}
      <div
        ref={(el) => {
          elements.current.dot = el;
        }}
        className="cursor-dot fixed top-0 left-0 z-[10000] pointer-events-none w-2 h-2 rounded-full bg-white mix-blend-difference"
        style={{ willChange: "transform" }}
      />

      {/* Cursor Outline */}
      <div
        ref={(el) => {
          elements.current.ring = el;
        }}
        className="cursor-outline fixed top-0 left-0 z-[9999] pointer-events-none w-10 h-10 rounded-full border border-white/30 mix-blend-difference transition-[width,height,background-color] duration-200"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
