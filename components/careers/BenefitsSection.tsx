import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const DEFAULT_BENEFITS: Benefit[] = [
  {
    icon: "🏥",
    title: "Health Coverage",
    description: "Medical, dental, and vision for full-time crew members.",
  },
  {
    icon: "💰",
    title: "Per Diem",
    description: "Daily per diem on all travel deployments — meals and lodging covered.",
  },
  {
    icon: "🚛",
    title: "Equipment Provided",
    description: "All tools, machines, and PPE provided. Show up ready to work, we handle the rest.",
  },
  {
    icon: "✈️",
    title: "Travel Pay",
    description: "Paid travel days and mileage for cross-state mobilizations.",
  },
  {
    icon: "📈",
    title: "Growth Path",
    description: "Move from operator to lead to foreman. We promote from within.",
  },
  {
    icon: "🎓",
    title: "Training & Certs",
    description: "Company-funded certifications: CDL, OSHA, fusion splicing, OTDR.",
  },
];

interface BenefitsSectionProps {
  benefits?: Benefit[] | null;
}

export function BenefitsSection({ benefits }: BenefitsSectionProps) {
  const items = benefits && benefits.length > 0 ? benefits : DEFAULT_BENEFITS;

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-section-sm lg:pb-section">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-[0.2em]">
            Benefits
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.15em]">
            What We Offer
          </span>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((benefit, i) => (
          <ScrollReveal key={benefit.title} delay={i * 0.08}>
            <div className="border border-white/[0.06] rounded-sm bg-white/[0.01] p-6 h-full hover:border-white/[0.1] transition-colors duration-300">
              <span className="text-2xl mb-4 block">{benefit.icon}</span>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="font-mono text-xs text-white/40 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
