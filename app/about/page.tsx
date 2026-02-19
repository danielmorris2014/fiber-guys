import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { StatsGrid } from "@/components/about/StatsGrid";
import { FleetDeployment } from "@/components/about/FleetDeployment";
import { SafetyGrid } from "@/components/about/SafetyGrid";
import { ShieldCheck, Truck, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Fiber Guys is a fiber construction company specializing in production-scale jetting and precision splicing across the US.",
};

const values = [
  {
    title: "Production Over Promises",
    description:
      "We measure success in footage placed and splices closed out — not in slide decks or sales calls. Our crews show up equipped, briefed, and ready to produce.",
  },
  {
    title: "Documentation Is the Deliverable",
    description:
      "A splice without test data is unfinished work. Every strand gets tested, every closure gets labeled, and every project gets a package that passes review.",
  },
  {
    title: "Crew Quality Is Everything",
    description:
      "We hire experienced fiber technicians, not warm bodies. Our teams are trained on our standards, equipped with production-grade tools, and held to consistent quality.",
  },
  {
    title: "Straightforward Communication",
    description:
      "You'll know what we can do, when we can start, and what it takes to get there. No runaround, no over-promising, no surprises in the field.",
  },
];

const safetyItems = [
  "Daily tailboard safety briefings before work begins",
  "Job Hazard Analysis (JHA) for every work site",
  "Proper PPE requirements enforced on all projects",
  "Traffic control and work zone safety compliance",
  "Confined space entry protocols for vault and manhole work",
  "Equipment inspection and maintenance documentation",
];

export default function AboutPage() {
  return (
    <main className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
        <ScrollReveal>
          <p className="caption-lg text-orange mb-4">About Us</p>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter max-w-4xl">
            We build fiber networks.{" "}
            <span className="text-muted">Not excuses.</span>
          </h1>
        </ScrollReveal>

        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <ScrollReveal>
            <div className="space-y-6 text-muted leading-relaxed">
              <p>
                Fiber Guys was built by people who&apos;ve spent their careers in
                the field — pulling cable, building splices, and closing out
                projects that actually pass inspection.
              </p>
              <p>
                We saw too many crews that couldn&apos;t produce at volume without
                cutting corners, and too many closeout packages that needed to be
                redone. So we built a company around solving both problems:
                production-scale output with documentation-grade quality.
              </p>
              <p>
                Today, our jetting and splicing crews serve general
                contractors, ISPs, and municipalities who need fiber placed
                right the first time.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="rounded-2xl border border-line bg-bg-2 p-8 lg:p-10">
              <h2 className="font-heading text-h4 font-bold tracking-tight mb-6">
                Capabilities at a Glance
              </h2>
              <StatsGrid />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tactical Fleet Deployment */}
      <FleetDeployment />

      {/* Built on Safety & Compliance */}
      <SafetyGrid />

      {/* Values */}
      <section className="bg-bg-2 border-y border-line">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
          <ScrollReveal>
            <p className="caption-lg text-orange mb-4">How We Operate</p>
            <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
              Our principles.
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <div className="space-y-3">
                  <h3 className="font-heading text-lg font-bold tracking-tight">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Compliance */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-orange-soft">
                <ShieldCheck className="w-6 h-6 text-orange" />
              </div>
              <p className="caption-lg text-orange">Safety & Compliance</p>
            </div>
            <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
              Safety is the standard.
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Our crews follow documented safety protocols on every job site.
              Safety isn&apos;t a box to check — it&apos;s how we operate. We
              hold daily tailboard briefings, conduct hazard analyses, and
              maintain compliance with applicable OSHA and DOT regulations.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="space-y-4">
              <h3 className="caption-lg text-text font-semibold">
                Standard Practices
              </h3>
              <ul className="space-y-3">
                {safetyItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange mt-2 shrink-0" />
                    <span className="text-sm text-muted leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Coverage & Mobilization */}
      <section className="bg-bg-2 border-y border-line">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-orange-soft">
                  <Truck className="w-6 h-6 text-orange" />
                </div>
                <p className="caption-lg text-orange">Coverage & Mobilization</p>
              </div>
              <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
                Nationwide deployment.
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                Our crews are available for deployment across the continental
                United States. Standard mobilization takes 5–10 business days
                from signed scope. For emergency restoration and network outages,
                we can mobilize same-day.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="space-y-6">
                <div className="border border-line rounded-lg p-6 bg-bg">
                  <h3 className="font-heading text-sm font-bold tracking-tight text-text">
                    Standard Mobilization
                  </h3>
                  <p className="text-sm text-muted mt-2">
                    5–10 business days from signed scope. Equipment and crew
                    deployed to your job site, ready to produce.
                  </p>
                </div>
                <div className="border border-line rounded-lg p-6 bg-bg">
                  <h3 className="font-heading text-sm font-bold tracking-tight text-text">
                    Emergency Restoration
                  </h3>
                  <p className="text-sm text-muted mt-2">
                    Same-day mobilization for network outages and emergency fiber
                    restoration. Call us directly and we move.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Certifications placeholder */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-orange-soft">
              <Award className="w-6 h-6 text-orange" />
            </div>
            <p className="caption-lg text-orange">Standards</p>
          </div>
          <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
            Industry standards compliance.
          </h2>
          <p className="mt-4 text-muted leading-relaxed max-w-2xl">
            Our work follows established fiber optic construction and testing
            standards including applicable NECA/FOA, TIA, and BICSI guidelines.
            Specific certifications and credentials are available upon request.
          </p>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section text-center">
          <ScrollReveal>
            <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
              Work with us.
            </h2>
            <p className="mt-4 text-lg text-muted max-w-lg mx-auto">
              If you need fiber placed or spliced — on time, on spec, with clean
              documentation — let&apos;s talk.
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
