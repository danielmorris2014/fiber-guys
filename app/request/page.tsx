import { RequestForm } from "@/components/forms/RequestForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Crew",
  description:
    "Send us your prints and project details. We'll get back to you with crew availability and a production timeline.",
};

export default function RequestPage() {
  return (
    <main className="pt-20 lg:pt-24">
      <section className="mx-auto max-w-3xl px-6 lg:px-8 py-section-sm lg:py-section">
        <ScrollReveal>
          <p className="caption-lg text-orange mb-4">Get Started</p>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter">
            Request a Crew
          </h1>
          <p className="mt-4 text-lg text-muted max-w-xl">
            Tell us what you need placed or spliced. We&apos;ll review your scope
            and get back to you with availability.
          </p>
        </ScrollReveal>

        <div className="mt-12">
          <RequestForm />
        </div>
      </section>
    </main>
  );
}
