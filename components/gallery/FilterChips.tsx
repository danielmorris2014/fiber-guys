"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { GalleryCategory } from "@/lib/types";

type FilterOption = "all" | GalleryCategory;

interface FilterChipsProps {
  active: FilterOption;
  onChange: (filter: FilterOption) => void;
}

const filters: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "jetting", label: "Jetting" },
  { value: "splicing", label: "Splicing" },
  { value: "crew", label: "Crew" },
  { value: "equipment", label: "Equipment" },
  { value: "closeout", label: "Closeout" },
  { value: "setup", label: "Setup" },
];

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter gallery by category"
    >
      {filters.map((filter) => {
        const isActive = active === filter.value;
        return (
          <button
            key={filter.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.value)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
              isActive ? "text-bg" : "text-muted hover:text-text"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="filter-chip-bg"
                className="absolute inset-0 rounded-full bg-orange"
                transition={{
                  type: "tween" as const,
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
            )}
            <span className="relative z-10">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
