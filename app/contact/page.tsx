import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { USCoverageMap } from "@/components/ui/USCoverageMap";
import { Mail, MapPin } from "lucide-react";
import { getSiteSettings, getMapProjects } from "@/lib/sanity.queries";
import mapFallback from "@/content/map.json";
import siteContentFallback from "@/content/site-content.json";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Fiber Guys. Production-focused fiber jetting and splicing crews available nationwide.",
};

export default async function ContactPage() {
  const [siteSettings, mapProjects] = await Promise.all([
    getSiteSettings(),
    getMapProjects(),
  ]);

  // Only use JSON fallback when Sanity is not configured (siteSettings is null)
  const activeStates = siteSettings
    ? (siteSettings.activeStates ?? [])
    : mapFallback.activeStates;
  const pastStates = siteSettings
    ? (siteSettings.pastStates ?? [])
    : mapFallback.pastStates;

  const coverageDesc =
    siteSettings?.coverageDescription ||
    siteContentFallback.coverage?.description ||
    "Currently operating in Missouri, Georgia, Tennessee, Alabama, and Florida. Available for mobilization nationwide.";

  const email = siteSettings?.contactEmail ?? "info@fiberguysllc.com";

  return (
    <main className="pt-20 lg:pt-24">
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
        <ScrollReveal>
          <p className="caption-lg text-orange mb-4">Contact</p>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter">
            Let&apos;s talk fiber.
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            Have a question or need to scope a project? Reach out directly or
            use the form below.
          </p>
        </ScrollReveal>

        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact info */}
          <ScrollReveal>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-orange-soft shrink-0">
                  <Mail className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <h2 className="font-heading text-sm font-bold tracking-tight">Email</h2>
                  <a
                    href={`mailto:${email}`}
                    className="text-muted hover:text-orange transition-colors text-sm mt-1 block"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-orange-soft shrink-0">
                  <MapPin className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <h2 className="font-heading text-sm font-bold tracking-tight">
                    Service Area
                  </h2>
                  <p className="text-muted text-sm mt-1">
                    Crews available for deployment nationwide
                  </p>
                  <p className="text-muted/60 text-xs mt-2">
                    Standard: 5&ndash;10 business days / Emergency: same-day
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-bg-2 p-6">
                <h3 className="font-heading text-sm font-bold tracking-tight mb-2">
                  Looking to hire a crew?
                </h3>
                <p className="text-sm text-muted">
                  For project scoping and crew requests, use our{" "}
                  <a
                    href="/request"
                    className="text-orange hover:text-orange-hard transition-colors font-medium"
                  >
                    Request a Crew
                  </a>{" "}
                  form for the fastest response.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact form */}
          <ScrollReveal delay={0.15}>
            <div className="rounded-2xl border border-line bg-bg-2 p-6 md:p-8">
              <h2 className="font-heading text-lg font-bold tracking-tight mb-6">
                Send a Message
              </h2>
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>

        {/* Coverage Map */}
        <div className="mt-16 lg:mt-24">
          <ScrollReveal>
            <div className="rounded-2xl border border-line bg-bg-2 p-6 lg:p-10 overflow-hidden">
              <h2 className="font-heading text-lg font-bold tracking-tight mb-2">
                Coverage Area
              </h2>
              <p className="text-sm text-muted mb-8">{coverageDesc}</p>
              <USCoverageMap
                activeStates={activeStates}
                pastStates={pastStates}
                projects={mapProjects}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
