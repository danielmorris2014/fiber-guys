"use client";

import { useState, useMemo } from "react";
import { LocationFilter } from "@/components/careers/LocationFilter";
import { PositionCard, type SerializablePosition } from "@/components/careers/PositionCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface PositionsWithFilterProps {
  positions: SerializablePosition[];
}

export function PositionsWithFilter({ positions }: PositionsWithFilterProps) {
  const [locationFilter, setLocationFilter] = useState<string | null>(null);

  const locations = useMemo(
    () => positions.map((p) => p.location).filter(Boolean) as string[],
    [positions]
  );

  const filtered = useMemo(
    () =>
      locationFilter
        ? positions.filter((p) => p.location === locationFilter)
        : positions,
    [positions, locationFilter]
  );

  if (positions.length === 0) {
    return (
      <ScrollReveal>
        <div className="border border-white/[0.06] rounded-sm bg-white/[0.01] p-12 lg:p-16 text-center">
          <div className="w-12 h-12 mx-auto mb-6 border border-white/[0.08] rounded-sm flex items-center justify-center bg-white/[0.02]">
            <span className="font-mono text-lg text-white/20">&mdash;</span>
          </div>
          <h3 className="font-heading text-xl font-bold text-white mb-3">
            No Open Positions Right Now
          </h3>
          <p className="font-mono text-sm text-white/40 max-w-md mx-auto mb-2">
            All crews are currently staffed. We post new roles as projects
            come in — jetting operators, splicers, and CDL drivers.
          </p>
          <p className="font-mono text-xs text-white/25 max-w-sm mx-auto">
            Drop your email in the Talent Network below and we will reach
            out when something opens up.
          </p>
        </div>
      </ScrollReveal>
    );
  }

  return (
    <>
      <LocationFilter locations={locations} onFilter={setLocationFilter} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((pos, i) => (
          <ScrollReveal key={pos.title} delay={i * 0.1}>
            <PositionCard pos={pos} />
          </ScrollReveal>
        ))}
      </div>

      {filtered.length === 0 && locationFilter && (
        <div className="text-center py-12">
          <p className="font-mono text-sm text-white/30">
            No positions in this location.{" "}
            <button
              type="button"
              onClick={() => setLocationFilter(null)}
              className="text-blue-400 hover:text-blue-300 transition-colors interactable"
            >
              View all
            </button>
          </p>
        </div>
      )}
    </>
  );
}
