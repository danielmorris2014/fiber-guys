import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your request has been submitted. We'll be in touch shortly.",
};

export default function ThankYouPage() {
  return (
    <main className="pt-20 lg:pt-24">
      <section className="mx-auto max-w-2xl px-6 lg:px-8 py-section-sm lg:py-section text-center">
        <ScrollReveal>
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-orange-soft">
              <CheckCircle className="w-12 h-12 text-orange" />
            </div>
          </div>

          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter">
            Request received.
          </h1>

          <p className="mt-6 text-lg text-muted max-w-lg mx-auto">
            We&apos;ve got your project details and will review them shortly.
            Expect to hear from us within one business day with crew
            availability and next steps.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton href="/">
              Back to Home
            </MagneticButton>
            <MagneticButton href="/gallery" variant="secondary">
              View Our Work
            </MagneticButton>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
