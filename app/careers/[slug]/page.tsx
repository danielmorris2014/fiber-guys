import { notFound } from "next/navigation";
import { getJobBySlug, getAllJobSlugs } from "@/lib/sanity.queries";
import { PortableText } from "@/components/sanity/PortableText";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ArrowLeft, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllJobSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Job Not Found" };

  return {
    title: `${job.title} — Careers`,
    description: `${job.type ?? "Full-time"} position${job.location ? ` in ${job.location}` : ""}. Join the Fiber Guys field crews.`,
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) notFound();

  return (
    <main className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="mx-auto max-w-4xl px-6 lg:px-8 pt-section-sm lg:pt-section pb-12">
        <ScrollReveal>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-muted hover:text-orange transition-colors font-mono text-xs uppercase tracking-widest mb-8 interactable"
          >
            <ArrowLeft className="w-3 h-3" /> All Positions
          </Link>

          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter max-w-3xl">
            {job.title}
          </h1>

          <div className="flex items-center gap-6 mt-4">
            {job.location && (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-white/40 uppercase tracking-[0.1em]">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
            )}
            {job.type && (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-white/40 uppercase tracking-[0.1em]">
                <Briefcase className="w-3 h-3" />
                {job.type}
              </span>
            )}
          </div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] uppercase tracking-[0.1em] text-blue-400/60 bg-blue-500/[0.08] border border-blue-500/[0.12] px-2.5 py-1 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </ScrollReveal>
      </section>

      {/* Description (Portable Text) */}
      {job.description && job.description.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 lg:px-8 pb-12">
          <ScrollReveal>
            <div className="border-t border-white/[0.06] pt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-6">
                About This Role
              </p>
              <PortableText value={job.description} />
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 lg:px-8 pb-section-sm lg:pb-section">
          <ScrollReveal>
            <div className="border-t border-white/[0.06] pt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-6">
                Requirements
              </p>
              <ul className="space-y-3">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-mono text-[10px] text-blue-500 mt-1 flex-shrink-0">
                      &#9654;
                    </span>
                    <span className="font-mono text-sm text-white/50 leading-relaxed">
                      {req}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Apply CTA */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16 lg:py-20 text-center">
          <ScrollReveal>
            <h2 className="font-heading text-h2 font-bold tracking-tighter mb-4">
              Interested?
            </h2>
            <p className="font-mono text-sm text-white/40 max-w-md mx-auto mb-8">
              Fill out the application form and we&apos;ll be in touch if your experience matches what we need.
            </p>
            <Link
              href={`/careers#apply?role=${slug}`}
              className="inline-flex items-center gap-3 py-4 px-8 rounded-sm font-mono text-sm font-bold uppercase tracking-[0.15em] bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all duration-300 interactable"
            >
              Apply for this Position
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
