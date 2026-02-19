"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";

const safetyColumns = [
  {
    title: "Daily JSAs & OSHA",
    desc: "Strict PPE protocols, daily Job Safety Analyses, and comprehensive hazard mitigation before a single handhole is opened.",
    num: "01",
  },
  {
    title: "Asset Protection",
    desc: "Regulated tension monitoring, bend radius compliance, and pressure verification to ensure zero damage to your conduit or fiber.",
    num: "02",
  },
  {
    title: "Zero-Incident Culture",
    desc: "Safety isn't a checklist — it's our baseline. We protect our crews, your job site, and your production timeline.",
    num: "03",
  },
];

export function SafetyGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
      <ScrollReveal>
        <p className="caption-lg text-orange mb-4">Built on Safety & Compliance</p>
        <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
          The non-negotiables.
        </h2>
      </ScrollReveal>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {safetyColumns.map((item, i) => (
          <ScrollReveal key={item.title} delay={i * 0.1}>
            <div className="border-l-2 border-orange/30 pl-6">
              <span className="font-mono text-xs text-orange/50 tracking-widest">
                [{item.num}]
              </span>
              <h3 className="font-heading text-lg font-bold tracking-tight mt-3 mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
