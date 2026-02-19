"use client";

import { useState, useRef, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { motion } from "motion/react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Defaults used while loading
const DEFAULT_ACTIVE = ["Missouri", "Georgia", "Tennessee", "Alabama", "Florida"];
const DEFAULT_PAST = ["Texas", "Iowa", "Kansas", "Michigan", "Louisiana"];

type StateStatus = "active" | "past" | "none";

const STATUS_LABEL: Record<StateStatus, string> = {
  active: "Recent Deployment",
  past: "Previous Deployment",
  none: "",
};

const STATUS_COLOR: Record<StateStatus, string> = {
  active: "#2563EB",
  past: "#60A5FA",
  none: "",
};

const STYLES: Record<
  StateStatus,
  {
    default: Record<string, string | number>;
    hover: Record<string, string | number>;
  }
> = {
  active: {
    default: {
      fill: "rgba(37, 99, 235, 0.35)",
      stroke: "#2563EB",
      strokeWidth: 1.5,
    },
    hover: {
      fill: "rgba(37, 99, 235, 0.55)",
      stroke: "#60A5FA",
      strokeWidth: 2,
    },
  },
  past: {
    default: {
      fill: "rgba(96, 165, 250, 0.15)",
      stroke: "rgba(96, 165, 250, 0.4)",
      strokeWidth: 1,
    },
    hover: {
      fill: "rgba(96, 165, 250, 0.3)",
      stroke: "rgba(96, 165, 250, 0.7)",
      strokeWidth: 1.5,
    },
  },
  none: {
    default: {
      fill: "rgba(255, 255, 255, 0.04)",
      stroke: "rgba(255, 255, 255, 0.1)",
      strokeWidth: 0.5,
    },
    hover: {
      fill: "rgba(255, 255, 255, 0.08)",
      stroke: "rgba(255, 255, 255, 0.2)",
      strokeWidth: 0.75,
    },
  },
};

interface USCoverageMapProps {
  className?: string;
  compact?: boolean;
  activeStates?: string[];
  pastStates?: string[];
}

export function USCoverageMap({
  className = "",
  compact = false,
  activeStates: propActive,
  pastStates: propPast,
}: USCoverageMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState<Set<string>>(
    new Set(propActive || DEFAULT_ACTIVE)
  );
  const [past, setPast] = useState<Set<string>>(
    new Set(propPast || DEFAULT_PAST)
  );
  const mapRef = useRef<HTMLDivElement>(null);

  // Fetch dynamic data if props not provided
  useEffect(() => {
    if (propActive && propPast) return;

    fetch("/api/content/map")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          if (!propActive && data.activeStates)
            setActive(new Set(data.activeStates));
          if (!propPast && data.pastStates) setPast(new Set(data.pastStates));
        }
      })
      .catch(() => {});
  }, [propActive, propPast]);

  // Update from props
  useEffect(() => {
    if (propActive) setActive(new Set(propActive));
  }, [propActive]);

  useEffect(() => {
    if (propPast) setPast(new Set(propPast));
  }, [propPast]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => observer.disconnect();
  }, []);

  function getStateStatus(name: string): StateStatus {
    if (active.has(name)) return "active";
    if (past.has(name)) return "past";
    return "none";
  }

  const hoveredStatus = hoveredState ? getStateStatus(hoveredState) : "none";

  return (
    <div ref={mapRef} className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 1000 }}
          width={800}
          height={500}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name as string;
                const status = getStateStatus(stateName);
                const s = STYLES[status];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredState(stateName)}
                    onMouseLeave={() => setHoveredState(null)}
                    style={{
                      default: {
                        ...s.default,
                        outline: "none",
                        transition: "all 300ms ease",
                      },
                      hover: {
                        ...s.hover,
                        outline: "none",
                        cursor: "default",
                      },
                      pressed: {
                        ...s.hover,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </motion.div>

      {/* Tooltip */}
      {hoveredState && (
        <div className="absolute top-4 right-4 pointer-events-none z-10">
          <div className="bg-[#0a0a0a] border border-white/10 px-3 py-1.5 rounded">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              {hoveredState}
              {hoveredStatus !== "none" && (
                <span
                  className="ml-2"
                  style={{ color: STATUS_COLOR[hoveredStatus] }}
                >
                  {STATUS_LABEL[hoveredStatus]}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      {!compact && (
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm border border-[#2563EB]"
              style={{ backgroundColor: "rgba(37, 99, 235, 0.35)" }}
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Recent Deployments
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm border"
              style={{
                backgroundColor: "rgba(96, 165, 250, 0.15)",
                borderColor: "rgba(96, 165, 250, 0.4)",
              }}
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Previous Deployments
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-white/[0.04] border border-white/[0.1]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
              Available
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
