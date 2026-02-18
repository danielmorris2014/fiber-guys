'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { FAQItem } from '@/lib/types';

interface AccordionProps {
  items: FAQItem[];
}

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  const reduced = useReducedMotion();

  return (
    <div className="border-b border-white/10">
      <button
        onClick={onToggle}
        className="interactable w-full flex items-center justify-between py-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-heading text-xl md:text-2xl font-bold text-white group-hover:text-blue-600 transition-colors pr-8">
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-blue-600 text-2xl font-light flex-shrink-0 w-8 h-8 flex items-center justify-center"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 leading-relaxed pb-6 max-w-2xl">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        />
      ))}
    </div>
  );
}
