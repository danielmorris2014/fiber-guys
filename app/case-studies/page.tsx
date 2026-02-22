import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { getCaseStudies } from "@/lib/sanity.queries";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Performance-driven case studies from Fiber Guys fiber jetting and splicing projects. Real metrics, real results.",
};

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <main className="pt-20 lg:pt-24">
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
        <ScrollReveal>
          <p className="caption-lg text-orange mb-4">Case Studies</p>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter">
            Measured results.
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            Every project is tracked by footage, splice counts, and timelines.
            No fluff — just performance data from the field.
          </p>
        </ScrollReveal>

        {caseStudies.length === 0 ? (
          <ScrollReveal>
            <div className="mt-16 text-center py-20 border border-line rounded-2xl bg-bg-2">
              <p className="text-muted font-mono text-sm">
                Case studies coming soon.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {caseStudies.map((study, i) => (
              <ScrollReveal key={study._id} delay={i * 0.08}>
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="group block rounded-2xl border border-line bg-bg-2 overflow-hidden hover:border-orange/30 transition-colors"
                >
                  {/* Image */}
                  {study.featuredImageUrl && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={study.featuredImageUrl}
                        alt={study.title}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        {...(study.featuredImageLqip
                          ? {
                              placeholder: "blur" as const,
                              blurDataURL: study.featuredImageLqip,
                            }
                          : {})}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted mb-3">
                      {(study.location || study.state) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {[study.location, study.state].filter(Boolean).join(", ")}
                        </span>
                      )}
                      {study.completionDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(study.completionDate)}
                        </span>
                      )}
                      {study.clientType && (
                        <span className="font-mono uppercase tracking-wider text-orange/70">
                          {study.clientType}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="font-heading text-lg font-bold tracking-tight group-hover:text-orange transition-colors">
                      {study.title}
                    </h2>

                    {/* Metrics Grid */}
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {study.totalFootage != null && (
                        <div className="bg-bg rounded-lg p-3 border border-line">
                          <p className="font-heading text-xl font-bold text-orange">
                            {formatNumber(study.totalFootage)}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mt-1">
                            Feet
                          </p>
                        </div>
                      )}
                      {study.spliceCount != null && (
                        <div className="bg-bg rounded-lg p-3 border border-line">
                          <p className="font-heading text-xl font-bold text-orange">
                            {formatNumber(study.spliceCount)}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mt-1">
                            Splices
                          </p>
                        </div>
                      )}
                      {study.duration && (
                        <div className="bg-bg rounded-lg p-3 border border-line">
                          <p className="font-heading text-xl font-bold text-orange">
                            {study.duration}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mt-1">
                            Timeline
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className="mt-4 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted group-hover:text-orange transition-colors">
                      View Details
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 lg:mt-24 text-center">
          <ScrollReveal>
            <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
              Ready to add your project?
            </h2>
            <p className="mt-4 text-lg text-muted max-w-lg mx-auto">
              Send us your scope and let our crews deliver measurable results.
            </p>
            <div className="mt-8">
              <MagneticButton href="/request" size="large">
                Request a Crew
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
