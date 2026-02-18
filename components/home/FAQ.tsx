"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import faqData from "@/content/faq.json";
import type { FAQItem } from "@/lib/types";

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen(!open)}
        className="interactable w-full flex items-center justify-between py-6 text-left group"
        aria-expanded={open}
      >
        <span className="font-heading text-xl md:text-2xl font-bold text-text group-hover:text-orange transition-colors pr-8">
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-orange text-2xl font-light flex-shrink-0 w-8 h-8 flex items-center justify-center"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="text-muted leading-relaxed pb-6 max-w-2xl">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const items = faqData as FAQItem[];

  return (
    <section className="py-section-sm lg:py-section bg-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <ScrollReveal>
            <span className="font-mono text-xs text-orange uppercase tracking-[0.2em]">
              [FAQ]
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter mt-4">
              Common
              <br />
              Questions
            </h2>
          </ScrollReveal>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl">
          {items.map((item) => (
            <FAQAccordionItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
