import { RequestForm } from "@/components/forms/RequestForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Mail, Phone, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Crew",
  description:
    "Submit your project scope, conduit specs, or prints. Our management team will review and respond with crew availability and production timelines.",
};

export default function RequestPage() {
  return (
    <main className="pt-20 lg:pt-24">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pt-section-sm lg:pt-section pb-12">
        <ScrollReveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange mb-4">
            [Dispatch]
          </p>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter max-w-3xl">
            Dispatch &amp; Project Review
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            Submit your project scope, conduit specs, or prints. Our management
            team will review the parameters and respond with crew availability
            and production timelines.
          </p>
        </ScrollReveal>
      </section>

      {/* Two-column: Form + Sidebar */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-section-sm lg:pb-section">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">
          {/* Left — Form */}
          <ScrollReveal>
            <div className="border border-white/[0.06] rounded-sm bg-white/[0.01] p-6 md:p-10">
              <RequestForm />
            </div>
          </ScrollReveal>

          {/* Right — Direct Contact */}
          <ScrollReveal delay={0.15}>
            <div className="lg:sticky lg:top-32 space-y-6">
              {/* Direct Contact Card */}
              <div className="border border-white/[0.06] rounded-sm bg-white/[0.02] p-6">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-6">
                  Direct Contact
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 border border-white/[0.08] rounded-sm flex items-center justify-center flex-shrink-0 bg-white/[0.02]">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">
                        Email
                      </p>
                      <a
                        href="mailto:info@fiberguysllc.com"
                        className="font-mono text-sm text-white hover:text-blue-400 transition-colors interactable"
                      >
                        info@fiberguysllc.com
                      </a>
                    </div>
                  </div>

                  <div className="h-px bg-white/[0.06]" />

                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 border border-white/[0.08] rounded-sm flex items-center justify-center flex-shrink-0 bg-white/[0.02]">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">
                        Response Time
                      </p>
                      <p className="font-mono text-sm text-white/60">
                        Within 1 business day
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Note */}
              <div className="flex items-start gap-3 px-1">
                <Shield className="w-4 h-4 text-white/15 flex-shrink-0 mt-0.5" />
                <p className="font-mono text-[10px] text-white/20 leading-relaxed">
                  All submissions are encrypted in transit. Files are stored
                  securely and only accessible to our project management team.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
