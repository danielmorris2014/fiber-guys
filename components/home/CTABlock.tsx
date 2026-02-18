"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CTABlock() {
  const reduced = useReducedMotion();
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [form, setForm] = useState({
    contactName: "",
    email: "",
    serviceNeeded: "",
    estimatedFootage: "",
    notes: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("contactName", form.contactName);
      formData.append("email", form.email);
      formData.append("serviceNeeded", form.serviceNeeded);
      formData.append("estimatedFootage", form.estimatedFootage);
      formData.append("notes", form.notes);
      formData.append("companyName", "");
      formData.append("phone", "");
      formData.append("cityState", "");
      formData.append("website", honeypot);

      const res = await fetch("/api/lead", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/thank-you");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      ref={ref}
      className="relative bg-orange overflow-hidden py-section-sm lg:py-section"
    >
      {/* Crosshatch pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 11px
          ), repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 11px
          )`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Headline */}
          <div>
            <ScrollReveal>
              <h2 className="font-heading text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.9]">
                <span className="text-white">Send Prints.</span>
                <br />
                <span
                  className="text-transparent"
                  style={{
                    WebkitTextStroke: "2px rgba(255,255,255,0.6)",
                  }}
                >
                  Get a Schedule.
                </span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="mt-6 text-white/70 text-lg max-w-md">
                Tell us what you need placed or spliced. We&apos;ll get back with crew
                availability and a production timeline.
              </p>
            </ScrollReveal>
          </div>

          {/* Form Card */}
          <motion.div
            className="relative bg-[#050505] p-8 lg:p-10"
            initial={reduced ? {} : { opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : reduced ? {} : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-orange" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-orange" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-orange" />

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot */}
              <div className="absolute -left-[9999px]">
                <label htmlFor="cta-website">Website</label>
                <input
                  id="cta-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="cta-name" className="block font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
                  Name
                </label>
                <input
                  id="cta-name"
                  type="text"
                  required
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  className="w-full bg-transparent border-b border-line py-2 text-text font-body text-sm focus:border-orange focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="cta-email" className="block font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  id="cta-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-transparent border-b border-line py-2 text-text font-body text-sm focus:border-orange focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="cta-service" className="block font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
                  Service Type
                </label>
                <select
                  id="cta-service"
                  required
                  value={form.serviceNeeded}
                  onChange={(e) => setForm({ ...form, serviceNeeded: e.target.value })}
                  className="w-full bg-transparent border-b border-line py-2 text-text font-body text-sm focus:border-orange focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="" className="bg-bg">Select service</option>
                  <option value="jetting" className="bg-bg">Jetting</option>
                  <option value="splicing" className="bg-bg">Splicing</option>
                  <option value="both" className="bg-bg">Both</option>
                </select>
              </div>

              <div>
                <label htmlFor="cta-footage" className="block font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
                  Estimated Footage
                </label>
                <input
                  id="cta-footage"
                  type="text"
                  value={form.estimatedFootage}
                  onChange={(e) => setForm({ ...form, estimatedFootage: e.target.value })}
                  className="w-full bg-transparent border-b border-line py-2 text-text font-body text-sm focus:border-orange focus:outline-none transition-colors"
                  placeholder="e.g. 50,000 ft"
                />
              </div>

              <div>
                <label htmlFor="cta-notes" className="block font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
                  Specs / Notes
                </label>
                <textarea
                  id="cta-notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-transparent border-b border-line py-2 text-text font-body text-sm focus:border-orange focus:outline-none transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="font-mono text-xs text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="interactable w-full py-4 bg-transparent border border-orange text-orange font-mono text-sm uppercase tracking-widest hover:bg-orange hover:text-white transition-all duration-300 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Initialize Request"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
