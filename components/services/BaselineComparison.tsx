"use client";

import React from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextScramble } from "@/components/ui/TextScramble";

const rows = [
  { baseline: "Messy Splice Trays", standard: "Organized & Labeled Trays" },
  { baseline: "Delayed Test Results", standard: "OTDR Data Ready at Handoff" },
  { baseline: "Missing As-Builts", standard: "Clean Closeout Packages" },
  { baseline: "Surprised by Scope Changes", standard: "Pre-Deployment Scope Verification" },
  { baseline: "Generic Crew Assignments", standard: "Task-Matched Equipment & Personnel" },
  { baseline: "Unclear Documentation", standard: "Geo-Tagged Photos & Splice Maps" },
];

export function BaselineComparison() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
        <ScrollReveal>
          <p className="caption-lg text-orange mb-4">The Baseline vs. The Standard</p>
          <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter max-w-3xl">
            What you&apos;re used to getting —{" "}
            <span className="text-muted">and what we actually deliver.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-0 border border-line rounded-lg overflow-hidden">
            {/* Column headers */}
            <div className="bg-bg-2 px-8 py-4 border-b border-r border-line">
              <span className="font-mono text-xs uppercase tracking-widest text-muted/50">
                Industry Baseline
              </span>
            </div>
            <div className="bg-orange-soft/30 px-8 py-4 border-b border-line">
              <span className="font-mono text-xs uppercase tracking-widest text-orange">
                Fiber Guys Standard
              </span>
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
              <React.Fragment key={i}>
                <div
                  className={`px-8 py-5 border-r border-line flex items-center gap-3 ${
                    i < rows.length - 1 ? "border-b border-line/50" : ""
                  }`}
                >
                  <span className="text-red-500/60 font-mono text-sm flex-shrink-0">
                    &#x2717;
                  </span>
                  <span className="text-muted/50 font-mono text-sm line-through decoration-line">
                    {row.baseline}
                  </span>
                </div>
                <div
                  className={`px-8 py-5 bg-orange-soft/10 flex items-center gap-3 ${
                    i < rows.length - 1 ? "border-b border-line/50" : ""
                  }`}
                >
                  <span className="text-emerald-500 font-mono text-sm flex-shrink-0">
                    &#x2713;
                  </span>
                  <TextScramble
                    text={row.standard}
                    className="text-emerald-400/90 font-mono text-sm"
                    duration={500}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
