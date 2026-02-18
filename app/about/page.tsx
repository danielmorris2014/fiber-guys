import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { StatsGrid } from "@/components/about/StatsGrid";
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
                By the Numbers
              </h2>
              <StatsGrid />
            </div>
          </ScrollReveal>
        </div>
      </section>

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

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section text-center">
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
      </section>
    </main>
  );
}
