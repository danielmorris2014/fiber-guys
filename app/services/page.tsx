import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { BaselineComparison } from "@/components/services/BaselineComparison";
import { ProofModule } from "@/components/services/ProofModule";
import { getServices } from "@/lib/sanity.queries";
import servicesJsonFallback from "@/content/services.json";
import type { ServiceData } from "@/lib/types";
import type { Metadata } from "next";
import { Cable, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Fiber jetting for long-run production placement and precision fiber splicing with closeout-ready documentation.",
};

const iconMap: Record<string, typeof Cable> = {
  cable: Cable,
  zap: Zap,
};

export default async function ServicesPage() {
  const sanityServices = await getServices();

  // Use Sanity data if available, otherwise fall back to JSON
  const services: ServiceData[] =
    sanityServices.length > 0
      ? sanityServices.map((s) => ({
          id: s._id,
          title: s.title,
          slug: s.slug,
          tagline: s.tagline || "",
          description: s.description || "",
          features: s.features || [],
          icon: s.icon || "cable",
        }))
      : (servicesJsonFallback as ServiceData[]);

  return (
    <main className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pt-section-sm lg:pt-section pb-12">
        <ScrollReveal>
          <p className="caption-lg text-orange mb-4">Services</p>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter max-w-3xl">
            Two things.{" "}
            <span className="text-muted">Done exceptionally well.</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl">
            We don&apos;t try to be everything to everyone. We place fiber and we
            splice fiber — and we do both at a level that closes out clean.
          </p>
        </ScrollReveal>
      </section>

      {/* Services */}
      {services.map((service, i) => {
        const Icon = iconMap[service.icon] || Cable;
        return (
          <section
            key={service.id}
            id={service.slug}
            className={i % 2 === 1 ? "bg-bg-2 border-y border-line" : ""}
          >
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                <ScrollReveal>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-orange-soft">
                      <Icon className="w-7 h-7 text-orange" />
                    </div>
                    <span className="caption text-orange">0{i + 1}</span>
                  </div>
                  <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
                    {service.title}
                  </h2>
                  <p
                    className="mt-2 text-lg text-orange font-medium"
                    data-tooltip-id="fiber-tooltip"
                    data-tooltip-content={i === 0 ? "Fiber blown through conduit using compressed air at high velocity" : "Precision fusion of individual fiber strands using arc welding"}
                  >
                    {service.tagline}
                  </p>
                  <p className="mt-6 text-muted leading-relaxed">
                    {service.description}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 mt-6 text-orange hover:text-orange-hard transition-colors font-mono text-xs uppercase tracking-widest interactable"
                  >
                    View Full Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </ScrollReveal>

                <ScrollReveal delay={0.15}>
                  <div className="space-y-4">
                    <h3 className="caption-lg text-text font-semibold">
                      Capabilities
                    </h3>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange mt-2 shrink-0" />
                          <span className="text-sm text-muted leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        );
      })}

      <TooltipProvider />

      {/* Baseline vs. Standard */}
      <BaselineComparison />

      {/* The Proof Module */}
      <ProofModule />

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section text-center">
        <ScrollReveal>
          <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-muted max-w-lg mx-auto">
            Send us your prints and project details. We&apos;ll get back to you
            with crew availability.
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
