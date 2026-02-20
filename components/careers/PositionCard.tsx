"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, X, MapPin, Briefcase, Wrench, Zap, Truck, type LucideIcon } from "lucide-react";

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
}

/* ── Detail Drawer ── */

function JobDetailDrawer({
  pos,
  onClose,
}: {
  pos: SerializablePosition;
  onClose: () => void;
}) {
  const Icon = ICON_MAP[pos.iconName] || Zap;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleApply = () => {
    onClose();
    setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set("role", pos.slug);
      window.history.replaceState({}, "", url.toString());
      document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
      window.dispatchEvent(new CustomEvent("role-selected", { detail: pos.slug }));
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border-l border-white/[0.08] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-white/30 hover:text-white transition-colors interactable z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 lg:p-10">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 border border-white/[0.08] rounded-sm flex items-center justify-center flex-shrink-0 bg-white/[0.02]">
              <Icon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-white leading-tight">
                {pos.title}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                {pos.location && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-white/40 uppercase tracking-[0.1em]">
                    <MapPin className="w-3 h-3" />
                    {pos.location}
                  </span>
                )}
                {pos.type && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-white/40 uppercase tracking-[0.1em]">
                    <Briefcase className="w-3 h-3" />
                    {pos.type}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-white/[0.06] mb-6" />

          {/* Tags */}
          {pos.tags.length > 0 && (
            <div className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">
                Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {pos.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] uppercase tracking-[0.1em] text-blue-400/60 bg-blue-500/[0.08] border border-blue-500/[0.12] px-2.5 py-1 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">
              About this Role
            </p>
            <p className="font-mono text-sm text-white/50 leading-relaxed">
              {pos.description}
            </p>
          </div>

          {/* Requirements */}
          {pos.requirements && pos.requirements.length > 0 && (
            <div className="mb-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">
                Requirements
              </p>
              <ul className="space-y-2">
                {pos.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-mono text-[10px] text-blue-500 mt-1 flex-shrink-0">&#9654;</span>
                    <span className="font-mono text-sm text-white/50 leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="h-px bg-white/[0.06] mb-6" />

          {/* Apply CTA */}
          <button
            onClick={handleApply}
            className="w-full py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-[0.15em] bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all duration-300 interactable"
          >
            [ Apply for this Position ]
          </button>

          <p className="mt-3 font-mono text-[10px] text-white/20 text-center">
            Or email{" "}
            <a href="mailto:careers@fiberguysllc.com" className="text-blue-400/50 hover:text-blue-400 transition-colors">
              careers@fiberguysllc.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Position Card ── */

export function PositionCard({ pos }: { pos: SerializablePosition }) {
  const Icon = ICON_MAP[pos.iconName] || Zap;
  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <div
        className="group relative border border-white/[0.06] rounded-sm bg-white/[0.01] p-6 lg:p-8 h-full hover:border-white/[0.12] transition-colors duration-300 cursor-pointer"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}
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
              <p className="font-mono text-[10px] text-white/30 mt-1">
                {[pos.type, pos.location].filter(Boolean).join(" · ")}
              </p>
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
      </div>

      {open && <JobDetailDrawer pos={pos} onClose={handleClose} />}
    </>
  );
}
