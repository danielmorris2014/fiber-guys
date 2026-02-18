"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SignalLineProps {
  className?: string;
  delay?: number;
  duration?: number;
}

export function SignalLine({
  className,
  delay = 0,
  duration = 1.5,
}: SignalLineProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <motion.path
        d="M0 30 C100 30 150 10 250 10 C350 10 400 50 500 50 C600 50 650 20 750 20 C850 20 900 40 1000 40 C1100 40 1150 30 1200 30"
        stroke="url(#signal-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          isInView && !reduced
            ? { pathLength: 1, opacity: 1 }
            : reduced
              ? { pathLength: 1, opacity: 1 }
              : {}
        }
        transition={{
          pathLength: {
            duration,
            delay,
            ease: [0.25, 0.1, 0.25, 1],
          },
          opacity: { duration: 0.3, delay },
        }}
      />

      {/* Traveling Pulse */}
      <motion.circle
        r="4"
        fill="#2563EB"
        filter="url(#glow)"
        initial={!reduced ? { offsetDistance: "0%", opacity: 1 } : { opacity: 0 }}
        animate={!reduced ? { offsetDistance: "100%", opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          delay: delay + duration,
          repeatDelay: 1
        }}
        style={{
          offsetPath: `path("M0 30 C100 30 150 10 250 10 C350 10 400 50 500 50 C600 50 650 20 750 20 C850 20 900 40 1000 40 C1100 40 1150 30 1200 30")`
        }}
      />

      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient
          id="signal-gradient"
          x1="0"
          y1="30"
          x2="1200"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
          <stop offset="15%" stopColor="#2563EB" stopOpacity="1" />
          <stop offset="85%" stopColor="#2563EB" stopOpacity="1" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
