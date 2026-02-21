"use client";

import { ArrowRight, MapPin, Briefcase, Zap, Wrench, Truck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { PayRange } from "@/components/careers/PayRange";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Wrench,
  Truck,
};

export interface SerializablePosition {
  title: string;
  slug: string;
  iconName: string;
  tags: string[];
  description: string;
  location?: string;
  type?: string;
  requirements?: string[];
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryType?: string | null;
}

export function PositionCard({ pos }: { pos: SerializablePosition }) {
  const Icon = ICON_MAP[pos.iconName] || Zap;

  return (
    <Link
      href={`/careers/${pos.slug}`}
      className="group relative block border border-white/[0.06] rounded-sm bg-white/[0.01] p-6 lg:p-8 h-full hover:border-white/[0.12] transition-colors duration-300"
    >
      {/* Icon + Title */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-10 h-10 border border-white/[0.08] rounded-sm flex items-center justify-center flex-shrink-0 bg-white/[0.02]">
          <Icon className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-white leading-tight">
            {pos.title}
          </h3>
          {(pos.location || pos.type) && (
            <p className="font-mono text-[10px] text-white/30 mt-1 flex items-center gap-3">
              {pos.type && (
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> {pos.type}
                </span>
              )}
              {pos.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {pos.location}
                </span>
              )}
            </p>
          )}
          {(pos.salaryMin || pos.salaryMax) && (
            <div className="mt-2">
              <PayRange
                salaryMin={pos.salaryMin}
                salaryMax={pos.salaryMax}
                salaryType={pos.salaryType}
              />
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="font-mono text-xs text-white/40 leading-relaxed mb-6 line-clamp-3">
        {pos.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {pos.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/25 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* View Details */}
      <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-blue-400 group-hover:text-blue-300 transition-colors">
        View Details
        <ArrowRight className="w-3.5 h-3.5" />
      </span>

      {/* Hover accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </Link>
  );
}
