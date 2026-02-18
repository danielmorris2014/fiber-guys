"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HighlightConfig {
  indices: number[];
  className: string;
}

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  stagger?: number;
  delay?: number;
  duration?: number;
  highlightWords?: HighlightConfig;
}

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function TextReveal({
  text,
  as: Tag = "h2",
  className,
  stagger = 0.04,
  delay = 0,
  duration = 0.8,
  highlightWords,
}: TextRevealProps) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px -10% 0px" });
  const reduced = useReducedMotion();

  const words = text.split(" ");

  return (
    <Tag ref={containerRef} className={className}>
      {words.map((word, i) => {
        const isHighlighted = highlightWords?.indices.includes(i);
        return (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom"
          >
            <motion.span
              className={`inline-block ${isHighlighted ? highlightWords?.className : ""}`}
              initial={reduced ? { y: "0%" } : { y: "110%" }}
              animate={reduced || isInView ? { y: "0%" } : { y: "110%" }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration,
                      delay: delay + i * stagger,
                      ease: EXPO_OUT,
                    }
              }
            >
              {word}
            </motion.span>
            <span className="inline-block whitespace-pre"> </span>
          </span>
        );
      })}
    </Tag>
  );
}
