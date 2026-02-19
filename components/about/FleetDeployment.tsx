"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextScramble } from "@/components/ui/TextScramble";

const fleetItems = [
  { label: "Long-Haul", desc: "High-capacity jetting rigs for extended conduit runs and interstate corridors." },
  { label: "Metro / Urban", desc: "Compact, agile setups for congested duct paths and tight pull boxes." },
  { label: "High-Count", desc: "Mass fusion and ribbon splicing rigs for 144–864ct cable builds." },
  { label: "Emergency", desc: "Pre-staged restoration kits for same-day mobilization on outage calls." },
];

export function FleetDeployment() {
  return (
    <section className="bg-bg-2 border-y border-line">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <ScrollReveal>
            <p className="caption-lg text-orange mb-4">Tactical Fleet Deployment</p>
            <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
              Matched to the mission.
            </h2>
            <p className="mt-6 text-muted leading-relaxed">
              We match the machine to the mission. Instead of throwing blind
              resources at a project, we engineer our equipment deployment to fit
              your specific scope, timeline, and budget.
            </p>
            <p className="mt-4 text-muted leading-relaxed opacity-70">
              From high-capacity jetters for long-haul runs to agile setups for
              tight metro builds, we scale our footprint to maximize your
              project&apos;s efficiency and eliminate unnecessary overhead.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fleetItems.map((item) => (
                <div
                  key={item.label}
                  className="border border-line rounded-lg p-6 bg-bg spotlight-card relative overflow-hidden interactable"
                >
                  <h3 className="font-mono text-xs text-orange uppercase tracking-widest mb-2">
                    <TextScramble text={item.label} duration={400} />
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
