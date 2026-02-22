import { Suspense } from "react";
import { ApplicationForm, type PositionOption } from "@/components/forms/ApplicationForm";
import { JobAlertForm } from "@/components/forms/JobAlertForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { BenefitsSection } from "@/components/careers/BenefitsSection";
import { PositionsWithFilter } from "@/components/careers/PositionsWithFilter";
import { ReferralSection } from "@/components/careers/ReferralSection";
import { CareersFAQ } from "@/components/careers/CareersFAQ";
import type { SerializablePosition } from "@/components/careers/PositionCard";
import { getActiveJobs, getSiteSettings } from "@/lib/sanity.queries";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the Fiber Guys LLC field crews. Hiring experienced fiber jetting operators, precision splicers, and OSP laborers for nationwide fiber optic construction projects.",
};

/* ── Helpers for mapping Sanity jobs to card data ── */

const ICON_NAME_MAP: Record<string, string> = {
  jetting: "Zap",
  splicer: "Wrench",
  splicing: "Wrench",
  laborer: "Truck",
  driver: "Truck",
  cdl: "Truck",
};

function pickIconName(title: string): string {
  const lower = title.toLowerCase();
  for (const [keyword, name] of Object.entries(ICON_NAME_MAP)) {
    if (lower.includes(keyword)) return name;
  }
  return "Zap";
}

function titleToSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function CareersPage() {
  /* Fetch from Sanity (returns [] if not configured) */
  const [sanityJobs, siteSettings] = await Promise.all([
    getActiveJobs(),
    getSiteSettings(),
  ]);

  const careersEmail = siteSettings?.careersEmail ?? "careers@fiberguysllc.com";

  const POSITIONS: SerializablePosition[] = sanityJobs.map((job) => ({
    title: job.title,
    slug: job.slug || titleToSlug(job.title),
    iconName: pickIconName(job.title),
    tags: job.tags ?? [],
    description:
      job.requirements?.join(" · ") ||
      `${job.type ?? "Full-time"} — ${job.location ?? "Nationwide"}`,
    location: job.location ?? undefined,
    type: job.type ?? undefined,
    requirements: job.requirements ?? undefined,
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    salaryType: job.salaryType ?? undefined,
  }));

  const hasPositions = POSITIONS.length > 0;

  // Build dropdown options for the application form from Sanity jobs
  const positionOptions: PositionOption[] = sanityJobs.map((job) => ({
    value: job.slug || titleToSlug(job.title),
    label: job.title,
  }));

  const showReferral = siteSettings?.referralActive === true;

  return (
    <main className="pt-20 lg:pt-24">
      {/* ================================================================
          Header
          ================================================================ */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pt-section-sm lg:pt-section pb-12">
        <ScrollReveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange mb-4">
            [Recruiting]
          </p>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter max-w-3xl">
            Join the Crews
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            We are looking for experienced operators and splicers who can handle
            the heavy lift. If you know Outside Plant builds and have time on
            the iron, we want to talk.
          </p>
        </ScrollReveal>
      </section>

      {/* ================================================================
          Benefits Section
          ================================================================ */}
      <BenefitsSection benefits={siteSettings?.careersBenefits} />

      {/* ================================================================
          Open Positions (with Location Filter)
          ================================================================ */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-section-sm lg:pb-section">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-10">
            <span className="font-mono text-[10px] text-blue-600 uppercase tracking-[0.2em]">
              Open Roles
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.15em]">
              {hasPositions ? `${POSITIONS.length} Position${POSITIONS.length === 1 ? "" : "s"}` : "Checking availability"}
            </span>
          </div>
        </ScrollReveal>

        <PositionsWithFilter positions={POSITIONS} />
      </section>

      {/* ================================================================
          Referral Program (only if active in CMS)
          ================================================================ */}
      {showReferral && (
        <ReferralSection
          bonusAmount={siteSettings?.referralBonusAmount}
          description={siteSettings?.referralDescription}
          positions={positionOptions}
        />
      )}

      {/* ================================================================
          Careers FAQ
          ================================================================ */}
      <CareersFAQ items={siteSettings?.careersFAQ} />

      {/* ================================================================
          Talent Network
          ================================================================ */}
      <section className="border-t-2 border-white/[0.1] bg-[#060606]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28">
          <ScrollReveal>
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-500 mb-4">
                [Talent Network]
              </p>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold tracking-tighter text-white mb-4">
                Join the Talent Network
              </h2>
              <p className="font-mono text-sm text-white/40 leading-relaxed mb-10 max-w-lg">
                Not looking to jump ship today? Drop your email. We&apos;ll ping you
                when we spin up new jetting and splicing crews for major projects.
              </p>
              <JobAlertForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================
          Application Form
          ================================================================ */}
      <section id="apply" className="border-t border-white/[0.06] scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">
            {/* Left — Form */}
            <ScrollReveal>
              <div className="mb-8">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange mb-4">
                  [Apply]
                </p>
                <h2 className="font-heading text-h2 font-bold tracking-tighter">
                  The Filter
                </h2>
                <p className="mt-3 text-sm text-muted max-w-lg">
                  Fill out the application below. We review submissions on a
                  rolling basis and reach out directly if your experience
                  matches what we need in the field.
                </p>
              </div>

              <div className="border border-white/[0.06] rounded-sm bg-white/[0.01] p-6 md:p-10">
                <Suspense fallback={null}>
                  <ApplicationForm positions={positionOptions} />
                </Suspense>
              </div>
            </ScrollReveal>

            {/* Right — Sidebar */}
            <ScrollReveal delay={0.15}>
              <div className="lg:sticky lg:top-32 space-y-6">
                {/* What We Value */}
                <div className="border border-white/[0.06] rounded-sm bg-white/[0.02] p-6">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-6">
                    What We Look For
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        label: "OSP Field Time",
                        detail: "Actual time on builds — not just training hours",
                      },
                      {
                        label: "Equipment Knowledge",
                        detail: "Name the machines you've run, not the brands you've heard of",
                      },
                      {
                        label: "Documentation Standards",
                        detail: "Clean trays, labeled enclosures, complete OTDR traces",
                      },
                      {
                        label: "Travel Ready",
                        detail: "Nationwide mobilization — 2+ week deployments are standard",
                      },
                    ].map((item, i) => (
                      <div key={i}>
                        <p className="font-mono text-xs text-white/70 mb-0.5">{item.label}</p>
                        <p className="font-mono text-[10px] text-white/30 leading-relaxed">
                          {item.detail}
                        </p>
                        {i < 3 && <div className="h-px bg-white/[0.04] mt-4" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="border border-white/[0.06] rounded-sm bg-white/[0.02] p-6">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">
                    Questions?
                  </h3>
                  <a
                    href={`mailto:${careersEmail}`}
                    className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors interactable"
                  >
                    {careersEmail}
                  </a>
                </div>

                {/* Status Lookup Link */}
                <div className="border border-white/[0.06] rounded-sm bg-white/[0.02] p-6">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">
                    Already Applied?
                  </h3>
                  <a
                    href="/careers/status"
                    className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors interactable"
                  >
                    Check Application Status &rarr;
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
