"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  HeartPulse,
  DollarSign,
  Truck,
  Plane,
  TrendingUp,
  GraduationCap,
  Shield,
  Wrench,
  Clock,
  Home,
  Users,
  Zap,
  Award,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";

/* ── Icon registry ── */

const ICON_MAP: Record<string, LucideIcon> = {
  "heart-pulse": HeartPulse,
  health: HeartPulse,
  "dollar-sign": DollarSign,
  dollar: DollarSign,
  money: DollarSign,
  truck: Truck,
  equipment: Truck,
  plane: Plane,
  travel: Plane,
  "trending-up": TrendingUp,
  growth: TrendingUp,
  "graduation-cap": GraduationCap,
  training: GraduationCap,
  shield: Shield,
  safety: Shield,
  wrench: Wrench,
  tools: Wrench,
  clock: Clock,
  time: Clock,
  home: Home,
  housing: Home,
  users: Users,
  team: Users,
  zap: Zap,
  award: Award,
  badge: BadgeCheck,
};

function resolveIcon(iconKey: string | undefined | null): LucideIcon {
  if (!iconKey) return BadgeCheck;
  const normalized = iconKey.toLowerCase().trim();
  return ICON_MAP[normalized] ?? BadgeCheck;
}

/* ── Types ── */

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  benefits?: Benefit[] | null;
}

/* ── Default benefits (used when CMS has none) ── */

const DEFAULT_BENEFITS: Benefit[] = [
  {
    icon: "health",
    title: "Health Coverage",
    description: "Medical, dental, and vision for full-time crew members.",
  },
  {
    icon: "dollar",
    title: "Per Diem",
    description:
      "Daily per diem on all travel deployments — meals and lodging covered.",
  },
  {
    icon: "equipment",
    title: "Equipment Provided",
    description:
      "All tools, machines, and PPE provided. Show up ready to work, we handle the rest.",
  },
  {
    icon: "travel",
    title: "Travel Pay",
    description:
      "Paid travel days and mileage for cross-state mobilizations.",
  },
  {
    icon: "growth",
    title: "Growth Path",
    description:
      "Move from operator to lead to foreman. We promote from within.",
  },
  {
    icon: "training",
    title: "Training & Certs",
    description:
      "Company-funded certifications: CDL, OSHA, fusion splicing, OTDR.",
  },
];

/* ── Component ── */

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
        {items.map((benefit, i) => {
          const Icon = resolveIcon(benefit.icon);
          return (
            <ScrollReveal key={benefit.title} delay={i * 0.08}>
              <div className="border border-white/[0.06] rounded-sm bg-white/[0.01] p-6 h-full hover:border-white/[0.1] transition-colors duration-300">
                <div className="w-10 h-10 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="font-mono text-xs text-white/40 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
