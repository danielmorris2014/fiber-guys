"use client";

import { useState, useRef, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import type { MapProject } from "@/lib/sanity.queries";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

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

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

interface USCoverageMapProps {
  className?: string;
  compact?: boolean;
  activeStates?: string[];
  pastStates?: string[];
  projects?: MapProject[];
}

export function USCoverageMap({
  className = "",
  compact = false,
  activeStates: propActive,
  pastStates: propPast,
  projects = [],
}: USCoverageMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState<Set<string>>(
    new Set(propActive ?? [])
  );
  const [past, setPast] = useState<Set<string>>(
    new Set(propPast ?? [])
  );
  const mapRef = useRef<HTMLDivElement>(null);

  // Sync state from server-provided props
  useEffect(() => {
    setActive(new Set(propActive ?? []));
  }, [propActive]);

  useEffect(() => {
    setPast(new Set(propPast ?? []));
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

  function handleStateClick(stateName: string) {
    const status = getStateStatus(stateName);
    if (status === "none") return;
    setSelectedState((prev) => (prev === stateName ? null : stateName));
  }

  const hoveredStatus = hoveredState ? getStateStatus(hoveredState) : "none";
  const selectedProjects = selectedState
    ? projects.filter((p) => p.state === selectedState)
    : [];
  const hasProjects = selectedProjects.length > 0;

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
                const isSelected = stateName === selectedState;
                const s = STYLES[status];
                const hasClickableContent = status !== "none";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredState(stateName)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick(stateName)}
                    style={{
                      default: {
                        ...s.default,
                        ...(isSelected && {
                          fill: status === "active"
                            ? "rgba(37, 99, 235, 0.6)"
                            : "rgba(96, 165, 250, 0.4)",
                          strokeWidth: 2.5,
                          stroke: "#fff",
                        }),
                        outline: "none",
                        transition: "all 300ms ease",
                      },
                      hover: {
                        ...s.hover,
                        outline: "none",
                        cursor: hasClickableContent ? "pointer" : "default",
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
      {hoveredState && !selectedState && (
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

      {/* Selected state project panel */}
      <AnimatePresence mode="wait">
        {selectedState && (
          <motion.div
            key={selectedState}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-4 rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: STATUS_COLOR[getStateStatus(selectedState)] || "#fff",
                  }}
                />
                <h4 className="font-mono text-xs uppercase tracking-widest text-white">
                  {selectedState}
                </h4>
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  {STATUS_LABEL[getStateStatus(selectedState)]}
                </span>
              </div>
              <button
                onClick={() => setSelectedState(null)}
                className="p-1 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                aria-label="Close panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Project cards */}
            <div className="p-4">
              {hasProjects ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedProjects.map((project) => (
                    <Link
                      key={project.slug}
                      href={`/case-studies/${project.slug}`}
                      className="group block rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:bg-white/[0.05] hover:border-white/10 transition-all"
                    >
                      <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors leading-tight">
                        {project.title}
                      </p>
                      {project.location && (
                        <p className="font-mono text-[10px] text-gray-500 mt-1">
                          {project.location}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {project.totalFootage && (
                          <span className="font-mono text-[10px] text-blue-400/80">
                            {formatNumber(project.totalFootage)} ft
                          </span>
                        )}
                        {project.spliceCount && (
                          <span className="font-mono text-[10px] text-blue-400/80">
                            {formatNumber(project.spliceCount)} splices
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-gray-500 group-hover:text-blue-400 transition-colors">
                        <span className="font-mono text-[9px] uppercase tracking-widest">
                          View project
                        </span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-gray-500 text-center py-3">
                  No case studies published for {selectedState} yet.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          {projects.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600">
                Click a state to see projects
              </span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
