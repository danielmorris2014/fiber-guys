"use client";

import NumberFlow from "@number-flow/react";
import { useInViewport } from "@/hooks/useInViewport";

const stats = [
  { value: 864, suffix: "ct", label: "Max Fiber Count" },
  { value: 25, suffix: "K ft/day", label: "Jetting Capacity" },
  { value: 5, suffix: "–10 days", label: "Mobilization Window" },
  { value: 0.03, suffix: "dB", label: "Splice Loss Standard", isFloat: true },
];

export function StatsGrid() {
  const { ref, inView } = useInViewport({ threshold: 0.3 });

  return (
    <div ref={ref} className="grid grid-cols-2 gap-8">
      {stats.map((stat, i) => (
        <div key={stat.label}>
          <p className="font-heading text-h2 font-bold text-orange">
            {stat.isFloat ? (
              <>
                <span>&lt;</span>
                <NumberFlow
                  value={inView ? stat.value : 0}
                  format={{ useGrouping: false, minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                  transformTiming={{ duration: 800 + i * 200, easing: "ease-out" }}
                  spinTiming={{ duration: 800 + i * 200, easing: "ease-out" }}
                />
              </>
            ) : (
              <NumberFlow
                value={inView ? stat.value : 0}
                format={{ useGrouping: false }}
                transformTiming={{ duration: 800 + i * 200, easing: "ease-out" }}
                spinTiming={{ duration: 800 + i * 200, easing: "ease-out" }}
              />
            )}
            <span>{stat.suffix}</span>
          </p>
          <p className="caption mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
