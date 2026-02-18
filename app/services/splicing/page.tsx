import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fiber Splicing",
  description:
    "Precision core-alignment fusion splicing with organized trays, labeled closures, and closeout-ready documentation. Ribbon and single-fiber capabilities.",
};

const capabilities = [
  "Core-alignment fusion splicing with sub-0.05dB average loss target",
  "Mass fusion (ribbon) and individual single-fiber splicing",
  "Fiber counts from 12 to 864 per closure",
  "Clean tray organization with color-coded routing per TIA-598",
  "Permanent labeling on every closure, tray, and buffer tube",
  "Heat shrink splice protection on every joint",
  "Sealed enclosures with strain relief and weatherproofing",
  "OTDR testing and splice loss verification on every strand",
];

const cableTypes = [
  { label: "Loose Tube", desc: "Standard OSP cable with gel-filled or dry buffer tubes" },
  { label: "Ribbon", desc: "High-density mass fusion for high fiber count applications" },
  { label: "Central Tube", desc: "Compact cable design for direct burial and duct" },
  { label: "ADSS", desc: "All-dielectric self-supporting for aerial spans" },
  { label: "Flat Drop", desc: "FTTP/FTTH distribution cable for last-mile" },
  { label: "Armored", desc: "Steel or corrugated armor for direct burial protection" },
];

const deliverables = [
  "OTDR trace documentation for every strand spliced",
  "Splice loss report organized by closure and tray",
  "Geo-tagged photos of every completed closure",
  "Tray maps showing fiber routing and color assignments",
  "Labeled enclosure photos with strand identification",
  "As-built splice records ready for closeout submission",
];

export default function SplicingPage() {
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
              <Zap className="w-7 h-7 text-orange" />
            </div>
            <span className="caption text-orange">02</span>
          </div>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter max-w-3xl">
            Fiber Splicing
          </h1>
          <p className="mt-2 text-lg text-orange font-medium">
            Clean trays, clear labeling, and organized closures ready for handoff.
          </p>
        </ScrollReveal>
      </section>

      {/* Description */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-section-sm lg:pb-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <ScrollReveal>
            <div className="space-y-6 text-muted leading-relaxed">
              <p>
                Precision matters when fibers meet. Our splicing teams deliver
                consistently low-loss fusion splices using core-alignment
                splicers that verify alignment before each arc weld. Every
                splice is protected with a heat shrink sleeve and routed cleanly
                into organized trays.
              </p>
              <p>
                We handle both mass fusion (ribbon) splicing for high-count
                applications and individual single-fiber splicing for standard
                loose-tube cable. Buffer tube identification follows TIA-598
                color coding, and every closure is permanently labeled with
                strand assignments.
              </p>
              <p>
                When we hand off a splice closure, it&apos;s ready for the next
                crew, the end client, or direct closeout submission. No
                callbacks. No rework. No loose ends.
              </p>
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

      {/* Cable Types */}
      <section className="bg-bg-2 border-y border-line">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
          <ScrollReveal>
            <p className="caption-lg text-orange mb-4">Cable Types</p>
            <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
              What we splice.
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cableTypes.map((type, i) => (
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
            Precision tools.
          </h2>
          <p className="mt-4 text-muted max-w-2xl">
            Our splicing crews use core-alignment fusion splicers with
            automated fiber alignment and real-time loss estimation. Every
            splicer is calibrated and maintained to manufacturer specifications.
            OTDR and power meter testing equipment is deployed on every job.
          </p>
          {/* Equipment details will be added when client provides specific model info */}
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
              Documentation isn&apos;t an add-on — it&apos;s part of the work.
              Every splice project includes a complete test and verification package.
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
            Need splicing done right?
          </h2>
          <p className="mt-4 text-lg text-muted max-w-lg mx-auto">
            Send us your splice plan and fiber counts. We&apos;ll scope the work
            and get back to you with availability.
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
