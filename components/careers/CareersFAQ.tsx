"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface FAQItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQ: FAQItem[] = [
  {
    question: "What does a typical deployment look like?",
    answer:
      "Most projects are 2–6 week deployments. We mobilize to the job site, run production during the week, and most crews get weekends. Travel, lodging, and per diem are covered by the company.",
  },
  {
    question: "Do I need a CDL?",
    answer:
      "A CDL is preferred but not required for all positions. Jetting operators and CDL drivers need one. Splicers and general laborers can work without it, but having a CDL opens up more roles.",
  },
  {
    question: "What equipment will I be working with?",
    answer:
      "Depends on the role. Jetting operators work with high-pressure fiber placement equipment. Splicers use fusion splicers, OTDR test sets, and fiber management tools. All equipment is company-provided.",
  },
  {
    question: "How fast do you respond to applications?",
    answer:
      "We review applications on a rolling basis. If your experience matches what we need, you'll hear from dispatch within 2–3 business days. During heavy hiring periods, it may take up to a week.",
  },
  {
    question: "Is there room for growth?",
    answer:
      "Yes. Operator → Lead → Foreman is a real path here. We promote from within and invest in training. If you show up, put in the work, and lead by example, there's a seat for you at the table.",
  },
];

interface CareersFAQProps {
  items?: FAQItem[] | null;
}

export function CareersFAQ({ items }: CareersFAQProps) {
  const faqItems = items && items.length > 0 ? items : DEFAULT_FAQ;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-section-sm lg:pb-section">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-[10px] text-orange uppercase tracking-[0.2em]">
            FAQ
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.15em]">
            Common Questions
          </span>
        </div>
      </ScrollReveal>

      <div className="max-w-3xl">
        {faqItems.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <ScrollReveal key={`careers-faq-${i}`} delay={i * 0.05}>
              <div className="border-b border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left interactable group"
                  aria-expanded={isOpen}
                >
                  <span className="font-mono text-sm text-white/70 group-hover:text-white transition-colors pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/20 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="font-mono text-xs text-white/40 leading-relaxed pl-0 pr-8">
                    {item.answer}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
