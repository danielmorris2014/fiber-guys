"use client";

import NumberFlow from "@number-flow/react";
import { useInViewport } from "@/hooks/useInViewport";

const stats = [
  { value: 15, suffix: "M+", label: "Feet Placed" },
  { value: 10, suffix: "K+", label: "Splices Completed" },
  { value: 50, suffix: "+", label: "Projects Closed Out" },
  { value: 99, suffix: "%", label: "First-Pass Test Rate" },
];

export function StatsGrid() {
  const { ref, inView } = useInViewport({ threshold: 0.3 });

  return (
    <div ref={ref} className="grid grid-cols-2 gap-8">
      {stats.map((stat, i) => (
        <div key={stat.label}>
          <p className="font-heading text-h2 font-bold text-orange">
            <NumberFlow
              value={inView ? stat.value : 0}
              format={{ useGrouping: false }}
              transformTiming={{ duration: 800 + i * 200, easing: "ease-out" }}
              spinTiming={{ duration: 800 + i * 200, easing: "ease-out" }}
            />
            <span>{stat.suffix}</span>
          </p>
          <p className="caption mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
