"use client";

import ReactCompareImage from "react-compare-image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextReveal } from "@/components/ui/TextReveal";

const comparePairs = [
  {
    id: "splice-before-after",
    title: "Splice Tray Organization",
    before: "/images/gallery/splicing-01.jpg",
    after: "/images/gallery/splicing-02.jpg",
    beforeLabel: "Before",
    afterLabel: "After",
  },
  {
    id: "conduit-before-after",
    title: "Conduit Cable Placement",
    before: "/images/gallery/jetting-01.jpg",
    after: "/images/gallery/jetting-02.jpg",
    beforeLabel: "Empty Conduit",
    afterLabel: "Fiber Placed",
  },
];

export function CompareSection() {
  return (
    <section className="mt-section-sm border-t border-line pt-section-sm">
      <div className="mb-12">
        <TextReveal
          text="See the Difference."
          as="h2"
          className="font-heading text-4xl lg:text-5xl font-bold tracking-tighter"
          stagger={0.05}
        />
        <p className="mt-3 text-muted font-mono text-xs uppercase tracking-widest">
          Before & After // Drag to Compare
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {comparePairs.map((pair) => (
          <ScrollReveal key={pair.id}>
            <div>
              <h3 className="font-heading text-lg font-bold tracking-tight mb-4">
                {pair.title}
              </h3>
              <div className="border border-line overflow-hidden">
                <ReactCompareImage
                  leftImage={pair.before}
                  rightImage={pair.after}
                  leftImageLabel={pair.beforeLabel}
                  rightImageLabel={pair.afterLabel}
                  sliderLineColor="#2563EB"
                  sliderLineWidth={2}
                  handle={
                    <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center shadow-lg">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 8H12M4 8L6 6M4 8L6 10M12 8L10 6M12 8L10 10" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  }
                />
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
