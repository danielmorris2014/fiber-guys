import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Cable, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { getServiceBySlug } from "@/lib/sanity.queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fiber Jetting",
  description:
    "Production-scale air-blown fiber placement through conduit systems. Mandrel-verified, tension-monitored jetting for metro, long-haul, and microduct applications.",
};

const defaultCapabilities = [
  "12 to 864 fiber count cable placement",
  "Standard HDPE, SDR-11, and microduct conduit systems",
  "Continuous blowing distances up to 15,000+ feet per setup",
  "Real-time tension and air pressure monitoring",
  "Mandrel testing and conduit pressure verification pre-placement",
  "Figure-8 management for long-haul runs to protect minimum bend radius",
  "Multi-path campus and metro distribution networks",
  "Coordinated reel staging, route planning, and logistics",
];

const deploymentTypes = [
  { label: "FTTP / FTTH", desc: "Fiber to the premises and home distribution" },
  { label: "Metro Ring", desc: "Urban backbone and ring builds" },
  { label: "Long-Haul", desc: "Extended interstate and inter-city routes" },
  { label: "Campus / MDU", desc: "Enterprise and multi-dwelling unit distribution" },
  { label: "Middle-Mile", desc: "Regional transport and interconnect" },
  { label: "BEAD / Grant", desc: "Broadband equity and expansion projects" },
];

const defaultDeliverables = [
  "Mandrel test results and conduit verification records",
  "Placement logs with footage counts per segment",
  "Tension and pressure monitoring data",
  "As-built route documentation",
  "Continuity verification for every strand placed",
  "Geo-tagged placement photos at key waypoints",
];

export default async function JettingPage() {
  const sanityService = await getServiceBySlug("jetting");

  const capabilities = sanityService?.features ?? defaultCapabilities;
  const deliverables = sanityService?.deliverables ?? defaultDeliverables;
  const tagline = sanityService?.tagline ?? "High-output air-blown fiber placement built for long runs and consistent results.";

  return (
    <main className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pt-section-sm lg:pt-section pb-12">
        <ScrollReveal>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-muted hover:text-orange transition-colors font-mono text-xs uppercase tracking-widest mb-8 interactable"
          >
            <ArrowLeft className="w-3 h-3" /> All Services
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-lg bg-orange-soft">
              <Cable className="w-7 h-7 text-orange" />
            </div>
            <span className="caption text-orange">01</span>
          </div>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter max-w-3xl">
            {sanityService?.title ?? "Fiber Jetting"}
          </h1>
          <p className="mt-2 text-lg text-orange font-medium">
            {tagline}
          </p>
        </ScrollReveal>
      </section>

      {/* Description */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-section-sm lg:pb-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <ScrollReveal>
            <div className="space-y-6 text-muted leading-relaxed">
              {sanityService?.description ? (
                <p>{sanityService.description}</p>
              ) : (
                <>
                  <p>
                    Our jetting crews specialize in production-scale fiber placement
                    through conduit systems of all sizes. We use compressed air to
                    blow fiber optic cable through pre-installed conduit — a method
                    that minimizes cable stress and allows for longer continuous runs
                    compared to traditional pulling methods.
                  </p>
                  <p>
                    Every run is monitored in real-time for air pressure and cable
                    tension to protect cable integrity from start to finish. Before
                    any fiber enters conduit, we mandrel-test and pressure-verify
                    every segment to confirm pathway continuity and identify any
                    obstructions or damage.
                  </p>
                  <p>
                    Whether it&apos;s a single-duct metro run, a multi-path campus
                    distribution, or a long-haul interstate route, we deliver cable
                    safely, efficiently, and on schedule.
                  </p>
                </>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="space-y-4">
              <h2 className="caption-lg text-text font-semibold">
                Capabilities
              </h2>
              <ul className="space-y-3">
                {capabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange mt-2 shrink-0" />
                    <span className="text-sm text-muted leading-relaxed">
                      {cap}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Deployment Types */}
      <section className="bg-bg-2 border-y border-line">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
          <ScrollReveal>
            <p className="caption-lg text-orange mb-4">Applications</p>
            <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
              Deployment types we support.
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deploymentTypes.map((type, i) => (
              <ScrollReveal key={type.label} delay={i * 0.08}>
                <div className="border border-line rounded-lg p-6 bg-bg hover:border-orange/30 transition-colors">
                  <h3 className="font-heading text-sm font-bold tracking-tight text-text">
                    {type.label}
                  </h3>
                  <p className="text-xs text-muted mt-1">{type.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Placeholder */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
        <ScrollReveal>
          <p className="caption-lg text-orange mb-4">Equipment</p>
          <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
            Production-grade rigs.
          </h2>
          <p className="mt-4 text-muted max-w-2xl">
            Our jetting fleet includes high-output compressors, calibrated
            jetting heads, and fiber management equipment sized for the job.
            All equipment is maintained and field-verified before every
            deployment.
          </p>
        </ScrollReveal>
      </section>

      {/* Deliverables */}
      <section className="bg-bg-2 border-y border-line">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
          <ScrollReveal>
            <p className="caption-lg text-orange mb-4">What You Get</p>
            <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
              Deliverables included.
            </h2>
            <p className="mt-4 text-muted max-w-2xl">
              Every jetting project includes a complete documentation package.
              No surprise charges — this is part of the scope.
            </p>
          </ScrollReveal>
          <div className="mt-12">
            <ScrollReveal delay={0.1}>
              <ul className="space-y-4 max-w-2xl">
                {deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange mt-2 shrink-0" />
                    <span className="text-sm text-muted leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section text-center">
        <ScrollReveal>
          <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
            Need fiber placed?
          </h2>
          <p className="mt-4 text-lg text-muted max-w-lg mx-auto">
            Send us your prints and conduit specs. We&apos;ll review your scope
            and respond with crew availability.
          </p>
          <div className="mt-8">
            <MagneticButton href="/request" size="large">
              Request a Crew
            </MagneticButton>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
