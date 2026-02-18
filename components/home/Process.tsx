"use client";

import { useRef, useLayoutEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const steps = [
  {
    number: "01",
    title: "Scope & Verify",
    description:
      "Review prints, confirm counts, identify access points, and lock in a production plan before anyone touches the field.",
  },
  {
    number: "02",
    title: "Mobilize",
    description:
      "Crew and equipment staged on-site, calibrated and ready. No wasted days waiting on logistics or last-minute coordination.",
  },
  {
    number: "03",
    title: "Execute",
    description:
      "Cable placed or spliced with real-time monitoring, clean practices, and zero rework. Production targets met daily.",
  },
  {
    number: "04",
    title: "Certify",
    description:
      "Every strand tested. OTDR results documented, organized, and ready for immediate review. No gaps in data.",
  },
  {
    number: "05",
    title: "Closeout",
    description:
      "As-builts, test data, and photos delivered in a package that passes inspection first time. Clean handoff, no callbacks.",
  },
];

export function Process() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // For reduced motion, make all content visible and bail
    if (reduced) {
      track.style.flexDirection = "column";
      track.style.height = "auto";
      section.style.overflow = "visible";
      const panels = track.querySelectorAll<HTMLElement>(".process-panel");
      panels.forEach((p) => {
        p.style.width = "100%";
        p.style.height = "auto";
        p.style.minHeight = "50vh";
      });
      track.querySelectorAll<HTMLElement>(".process-content").forEach((el) => {
        el.style.opacity = "1";
      });
      return () => {
        track.style.flexDirection = "";
        track.style.height = "";
        section.style.overflow = "";
        panels.forEach((p) => {
          p.style.width = "";
          p.style.height = "";
          p.style.minHeight = "";
        });
      };
    }

    // Delay GSAP init so Lenis has time to connect its scroll proxy
    const timer = setTimeout(() => {
      if (!sectionRef.current || !trackRef.current) return;

      const s = sectionRef.current;
      const t = trackRef.current;
      const totalScroll = t.scrollWidth - window.innerWidth;

      if (totalScroll <= 0) return;

      const ctx = gsap.context(() => {
        // Main horizontal scroll — pin section, translate track
        const scrollTween = gsap.to(t, {
          x: -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: s,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            end: () => `+=${t.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                Math.floor(self.progress * steps.length),
                steps.length - 1
              );
              setActiveIndex(idx);
            },
          },
        });

        // Per-panel content fade-in linked to horizontal scroll
        t.querySelectorAll<HTMLElement>(".process-panel").forEach((panel) => {
          const content = panel.querySelector(".process-content");
          if (content) {
            gsap.fromTo(
              content,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: scrollTween,
                  start: "left 80%",
                  end: "left 50%",
                  scrub: true,
                },
              }
            );
          }
        });
      }, s);

      ctxRef.current = ctx;
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative bg-orange overflow-hidden"
    >
      {/* Pinned header */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-10 lg:pt-16 flex items-start justify-between">
          <div>
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em] block mb-2">
              [How We Work]
            </span>
            <h2 className="font-heading text-4xl lg:text-6xl font-bold tracking-tighter text-white">
              The Protocol
            </h2>
          </div>

          {/* Progress indicator */}
          <div className="hidden lg:flex items-center gap-4 pt-4">
            <span className="font-mono text-sm text-white/80 tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <div className="w-32 h-px bg-white/20 relative">
              <div
                className="absolute left-0 top-0 h-full bg-white transition-all duration-300 ease-out"
                style={{
                  width: `${((activeIndex + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
            <span className="font-mono text-sm text-white/40 tabular-nums">
              {String(steps.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex flex-nowrap h-screen items-center"
        style={{ width: "fit-content" }}
      >
        {steps.map((step, i) => (
          <div
            key={step.number}
            className="process-panel"
            style={{
              flexShrink: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 clamp(2rem, 5vw, 6rem)",
              position: "relative",
            }}
          >
            {/* Large faded background number */}
            <span className="process-number absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-[35vw] lg:text-[30vw] font-bold text-white/[0.04] leading-none select-none pointer-events-none">
              {step.number}
            </span>

            {/* Divider */}
            {i > 0 && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-1/3 bg-white/10" />
            )}

            {/* Content */}
            <div className="process-content relative z-10 max-w-xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs text-white/50 tracking-[0.2em]">
                  [{step.number}]
                </span>
                <div className="process-line h-px w-16 bg-white/30 origin-left" />
              </div>

              <h3 className="font-heading text-5xl lg:text-7xl font-bold text-white tracking-tighter mb-6">
                {step.title}
              </h3>

              <p className="text-white/60 text-lg lg:text-xl leading-relaxed max-w-md">
                {step.description}
              </p>
            </div>
          </div>
        ))}

        {/* End spacer */}
        <div style={{ flexShrink: 0, width: "20vw" }} />
      </div>

      {/* Step indicators — bottom left */}
      <div className="absolute bottom-0 left-0 z-20 pointer-events-none">
        <div className="px-6 lg:px-8 pb-10 lg:pb-16">
          <div className="flex gap-6">
            {steps.map((step, i) => (
              <span
                key={step.number}
                className="font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
                style={{
                  color:
                    i === activeIndex ? "white" : "rgba(255,255,255,0.2)",
                }}
              >
                {step.number}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
