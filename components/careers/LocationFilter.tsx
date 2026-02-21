"use client";

import { useState, useMemo } from "react";
import { MapPin } from "lucide-react";

interface LocationFilterProps {
  locations: string[];
  onFilter: (location: string | null) => void;
}

export function LocationFilter({ locations, onFilter }: LocationFilterProps) {
  const [active, setActive] = useState<string | null>(null);

  const uniqueLocations = useMemo(() => {
    const unique = Array.from(new Set(locations.filter(Boolean)));
    unique.sort();
    return unique;
  }, [locations]);

  if (uniqueLocations.length <= 1) return null;

  function handleClick(location: string | null) {
    setActive(location);
    onFilter(location);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      <MapPin className="w-3.5 h-3.5 text-white/20 mr-1" />
      <button
        type="button"
        onClick={() => handleClick(null)}
        className={`font-mono text-[10px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-sm border transition-all duration-200 interactable ${
          active === null
            ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
            : "border-white/[0.06] bg-transparent text-white/30 hover:text-white/50 hover:border-white/[0.12]"
        }`}
      >
        All Locations
      </button>
      {uniqueLocations.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => handleClick(loc)}
          className={`font-mono text-[10px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-sm border transition-all duration-200 interactable ${
            active === loc
              ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
              : "border-white/[0.06] bg-transparent text-white/30 hover:text-white/50 hover:border-white/[0.12]"
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
