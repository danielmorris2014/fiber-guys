"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const shouldAnimate = mounted && !reduced;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#050505]"
    >
      {/* Background video with parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={shouldAnimate ? { y: bgY } : undefined}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.4 }}
        >
          <source src="/video/hero-loop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/40 to-[#050505]" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 pt-32 pb-16"
        style={shouldAnimate ? { opacity: contentOpacity } : undefined}
      >
        {/* Headline Block */}
        <div className="space-y-2 lg:space-y-4">
          {/* Line 1: "Production" — large filled, left-aligned */}
          <motion.div
            className="overflow-hidden"
            initial={shouldAnimate ? { y: "100%" } : undefined}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: EXPO_OUT }}
          >
            <h1 className="font-heading text-6xl sm:text-8xl lg:text-[10rem] xl:text-[12rem] font-bold tracking-tighter leading-[0.85] text-text">
              Production
            </h1>
          </motion.div>

          {/* Line 2: "Over" — stroke/outline + blue glow line extending right */}
          <motion.div
            className="overflow-hidden flex items-center gap-6 lg:gap-10"
            initial={shouldAnimate ? { y: "100%" } : undefined}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: EXPO_OUT }}
          >
            <span
              className="font-heading text-6xl sm:text-8xl lg:text-[10rem] xl:text-[12rem] font-bold tracking-tighter leading-[0.85] text-transparent cursor-default transition-colors duration-500 hover:text-orange animate-flicker"
              style={{
                WebkitTextStroke: "2px rgba(245, 241, 232, 0.5)",
              }}
            >
              Over
            </span>
            {/* Blue glow line */}
            <motion.div
              className="flex-1 h-[2px] bg-orange origin-left"
              initial={shouldAnimate ? { scaleX: 0 } : undefined}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.8, ease: EXPO_OUT }}
              style={{
                boxShadow: "0 0 20px rgba(37,99,235,0.5), 0 0 60px rgba(37,99,235,0.2)",
              }}
            />
          </motion.div>

          {/* Line 3: "Promises" — filled, right-aligned */}
          <motion.div
            className="overflow-hidden text-right"
            initial={shouldAnimate ? { y: "100%" } : undefined}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: EXPO_OUT }}
          >
            <span className="font-heading text-6xl sm:text-8xl lg:text-[10rem] xl:text-[12rem] font-bold tracking-tighter leading-[0.85] text-text">
              Promises
            </span>
          </motion.div>
        </div>

        {/* Description + CTA */}
        <motion.div
          className="mt-12 lg:mt-16 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8"
          initial={shouldAnimate ? { opacity: 0, y: 20 } : undefined}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EXPO_OUT }}
        >
          {/* Monospace description */}
          <div className="max-w-md">
            <p className="font-mono text-sm text-muted leading-relaxed">
              <span className="text-orange">///</span> Production-focused fiber jetting and
              precision splicing. Clean documentation. Field-ready crews. Closeout-ready results.
            </p>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-6">
            <MagneticButton href="/request" size="large">
              Request a Crew
            </MagneticButton>
            <MagneticButton href="/gallery" variant="ghost">
              <span className="font-mono text-sm tracking-wider">View Field Work</span>
            </MagneticButton>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          initial={shouldAnimate ? { opacity: 0 } : undefined}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <span className="font-mono text-[10px] text-muted/50 uppercase tracking-[0.2em]">
            Scroll
          </span>
          <div className="w-px h-12 bg-line relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-orange"
              animate={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
