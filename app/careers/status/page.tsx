import { StatusLookupForm } from "@/components/forms/StatusLookupForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Status — Careers",
  description:
    "Check the status of your Fiber Guys LLC job application. Enter the email you applied with to see your application progress.",
};

export default function ApplicationStatusPage() {
  return (
    <main className="pt-20 lg:pt-24">
      <section className="mx-auto max-w-3xl px-6 lg:px-8 pt-section-sm lg:pt-section pb-section-sm lg:pb-section">
        <ScrollReveal>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-muted hover:text-orange transition-colors font-mono text-xs uppercase tracking-widest mb-8 interactable"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Careers
          </Link>

          <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange mb-4">
            [Status Lookup]
          </p>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter max-w-2xl">
            Application Status
          </h1>
          <p className="mt-4 text-lg text-muted max-w-xl mb-12">
            Enter the email address you used when you applied. We&apos;ll show you
            the current status of all your applications.
          </p>

          <StatusLookupForm />
        </ScrollReveal>
      </section>
    </main>
  );
}
