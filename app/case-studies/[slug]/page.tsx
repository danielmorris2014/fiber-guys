import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PortableText } from "@/components/sanity/PortableText";
import {
  getCaseStudyBySlug,
  getAllCaseStudySlugs,
} from "@/lib/sanity.queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return { title: "Case Study Not Found" };

  const metrics: string[] = [];
  if (study.totalFootage) metrics.push(`${formatNumber(study.totalFootage)} ft`);
  if (study.spliceCount) metrics.push(`${formatNumber(study.spliceCount)} splices`);
  if (study.duration) metrics.push(study.duration);

  return {
    title: study.title,
    description: `${study.title}${study.location || study.state ? ` — ${[study.location, study.state].filter(Boolean).join(", ")}` : ""}. ${metrics.join(", ")}.`,
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) notFound();

  const metrics = [
    study.totalFootage != null
      ? { label: "Total Footage", value: `${formatNumber(study.totalFootage)} ft` }
      : null,
    study.spliceCount != null
      ? { label: "Splice Count", value: formatNumber(study.spliceCount) }
      : null,
    study.duration ? { label: "Timeline", value: study.duration } : null,
    study.clientType ? { label: "Client Type", value: study.clientType } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <main className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pt-section-sm lg:pt-section pb-12">
        <ScrollReveal>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-muted hover:text-orange transition-colors font-mono text-xs uppercase tracking-widest mb-8 interactable"
          >
            <ArrowLeft className="w-3 h-3" /> All Case Studies
          </Link>

          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter max-w-4xl">
            {study.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted">
            {(study.location || study.state) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange" />
                {[study.location, study.state].filter(Boolean).join(", ")}
              </span>
            )}
            {study.completionDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange" />
                {formatDate(study.completionDate)}
              </span>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Metrics Strip */}
      {metrics.length > 0 && (
        <section className="bg-bg-2 border-y border-line">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
            <ScrollReveal>
              <div
                className={`grid gap-6 ${
                  metrics.length === 4
                    ? "grid-cols-2 lg:grid-cols-4"
                    : metrics.length === 3
                      ? "grid-cols-3"
                      : "grid-cols-2"
                }`}
              >
                {metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <p className="font-heading text-3xl lg:text-4xl font-bold text-orange">
                      {m.value}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted mt-2">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Featured Image */}
      {study.featuredImageUrl && (
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-8 lg:py-12">
          <ScrollReveal>
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-line">
              <Image
                src={study.featuredImageUrl}
                alt={study.title}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
                {...(study.featuredImageLqip
                  ? {
                      placeholder: "blur" as const,
                      blurDataURL: study.featuredImageLqip,
                    }
                  : {})}
              />
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Description */}
      {study.description && study.description.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-section-sm lg:pb-section">
          <div className="max-w-3xl">
            <ScrollReveal>
              <div className="prose-custom">
                <PortableText value={study.description} />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-bg-2 border-t border-line">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section text-center">
          <ScrollReveal>
            <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
              Need similar results?
            </h2>
            <p className="mt-4 text-lg text-muted max-w-lg mx-auto">
              Send us your scope. We&apos;ll put together a crew and a timeline.
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
