"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  tag: string;
  imageUrl?: string;
  lqip?: string;
  altText?: string;
}

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Fiber Jetting", value: "jetting" },
  { label: "Precision Splicing", value: "splicing" },
  { label: "Setup", value: "setup" },
  { label: "Closeout", value: "closeout" },
  { label: "Equipment", value: "equipment" },
  { label: "Crew", value: "crew" },
] as const;

const IMAGES: GalleryImage[] = [
  {
    id: "s-01",
    title: "144ct Ribbon Splice",
    category: "splicing",
    location: "Atlanta, GA",
    description: "Mass fusion splice — 144-count ribbon, ≤0.03dB avg loss",
    tag: "144ct Ribbon Splice",
  },
  {
    id: "j-01",
    title: "Long-Haul Jetting Setup",
    category: "jetting",
    location: "Austin, TX",
    description: "12,000ft continuous run through 2\" HDPE conduit",
    tag: "Long-Haul Jetting Setup",
  },
  {
    id: "c-01",
    title: "Verified Closeout Pkg",
    category: "closeout",
    location: "Nashville, TN",
    description: "Complete OTDR traces, splice maps, and as-builts",
    tag: "Verified Closeout",
  },
  {
    id: "s-02",
    title: "Clean Tray Organization",
    category: "splicing",
    location: "Charlotte, NC",
    description: "Color-coded tray routing with labeled buffer tubes",
    tag: "Organized Tray Routing",
  },
  {
    id: "j-02",
    title: "Metro Conduit Placement",
    category: "jetting",
    location: "Dallas, TX",
    description: "288ct placement through congested downtown conduit",
    tag: "Metro Conduit Run",
  },
  {
    id: "s-03",
    title: "Aerial Closure Build",
    category: "splicing",
    location: "Orlando, FL",
    description: "72-count aerial closure — sealed, labeled, documented",
    tag: "72ct Aerial Closure",
  },
  {
    id: "c-02",
    title: "As-Built Documentation",
    category: "closeout",
    location: "Dallas, TX",
    description: "Redline markups with splice locations and footage counts",
    tag: "As-Built Records",
  },
  {
    id: "j-03",
    title: "Campus Distribution",
    category: "jetting",
    location: "Denver, CO",
    description: "Multi-path jetting across corporate campus, tight radii",
    tag: "Campus Distribution",
  },
  {
    id: "s-04",
    title: "Underground Vault Splice",
    category: "splicing",
    location: "San Antonio, TX",
    description: "288ct vault splice with full OTDR documentation",
    tag: "288ct Vault Splice",
  },
  {
    id: "c-03",
    title: "Labeled Enclosure",
    category: "closeout",
    location: "Atlanta, GA",
    description: "Permanent labeling, strain relief, sealed entry ports",
    tag: "Labeled Enclosure",
  },
  {
    id: "j-04",
    title: "Micro-Duct FTTH",
    category: "jetting",
    location: "Portland, OR",
    description: "Precision micro-duct jetting for residential FTTH",
    tag: "Micro-Duct Placement",
  },
  {
    id: "s-05",
    title: "Multi-Tray Closure",
    category: "splicing",
    location: "Knoxville, TN",
    description: "12-tray build — express and distribution legs separated",
    tag: "12-Tray Closure Build",
  },
];

/** Deterministic gradient based on image id for visual variety */
function getPlaceholderGradient(id: string): string {
  const gradients = [
    "from-zinc-900 via-zinc-800 to-zinc-900",
    "from-neutral-900 via-stone-800 to-neutral-900",
    "from-slate-900 via-gray-800 to-slate-900",
    "from-zinc-900 via-neutral-800 to-zinc-900",
    "from-stone-900 via-zinc-800 to-stone-900",
    "from-gray-900 via-slate-800 to-gray-900",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

function getPatternStyle(id: string): React.CSSProperties {
  const patterns = [
    // Fine grid
    {
      backgroundImage:
        "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      backgroundSize: "20px 20px",
    },
    // Diagonal lines
    {
      backgroundImage:
        "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 11px)",
    },
    // Dots
    {
      backgroundImage:
        "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
      backgroundSize: "16px 16px",
    },
    // Horizontal scan lines
    {
      backgroundImage:
        "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.015) 4px, rgba(255,255,255,0.015) 5px)",
    },
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return patterns[Math.abs(hash) % patterns.length];
}

function ImageCard({ image }: { image: GalleryImage }) {
  const gradient = getPlaceholderGradient(image.id);
  const pattern = getPatternStyle(image.id);
  const hasRealImage = Boolean(image.imageUrl);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-white/[0.06] cursor-pointer"
    >
      {hasRealImage ? (
        /* Real image from Sanity */
        <Image
          src={image.imageUrl!}
          alt={image.altText || `${image.title} — ${image.description}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          placeholder={image.lqip ? "blur" : "empty"}
          blurDataURL={image.lqip || undefined}
        />
      ) : (
        <>
          {/* Placeholder background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
          {/* Pattern overlay */}
          <div className="absolute inset-0" style={pattern} />
          {/* Center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-8 h-px bg-white/[0.08]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-8 bg-white/[0.08]" />
            </div>
          </div>
        </>
      )}

      {/* Category badge — top left */}
      <div className="absolute top-3 left-3 z-10">
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/25 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-sm border border-white/[0.06]">
          {image.category}
        </span>
      </div>

      {/* Location — top right */}
      <div className="absolute top-3 right-3 z-10">
        <span className="font-mono text-[9px] text-white/15">
          {image.location}
        </span>
      </div>

      {/* Hover overlay — dark wash + terminal-green description */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 z-10" />

      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-[0.15em]">
            {image.tag}
          </span>
        </div>
        <p className="font-mono text-[10px] text-white/50 leading-relaxed">
          {image.description}
        </p>
      </div>

      {/* Scan line effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16,185,129,0.03) 2px, rgba(16,185,129,0.03) 4px)",
          }}
        />
      </div>
    </motion.div>
  );
}

interface FieldGalleryProps {
  cmsImages?: GalleryImage[];
}

export function FieldGallery({ cmsImages }: FieldGalleryProps) {
  const [active, setActive] = useState<string>("all");

  /* Use CMS images if provided, otherwise fall back to hardcoded placeholders */
  const allImages = cmsImages && cmsImages.length > 0 ? cmsImages : IMAGES;

  const filtered =
    active === "all"
      ? allImages
      : allImages.filter((img) => img.category === active);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {FILTERS.map((f) => {
          const isActive = active === f.value;
          const count =
            f.value === "all"
              ? allImages.length
              : allImages.filter((i) => i.category === f.value).length;

          return (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`
                relative font-mono text-xs uppercase tracking-[0.12em] px-5 py-2.5
                border rounded-sm transition-all duration-300 interactable
                ${
                  isActive
                    ? "border-blue-600 text-white bg-blue-600/10"
                    : "border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/20 bg-transparent"
                }
              `}
            >
              {f.label}
              <span
                className={`ml-2 text-[9px] ${
                  isActive ? "text-blue-400" : "text-white/20"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Image grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Footer note */}
      <div className="mt-12 pt-8 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <p className="font-mono text-[11px] text-white/30 uppercase tracking-widest">
            {cmsImages && cmsImages.length > 0
              ? "All shots from active field deployments"
              : "Real project photos replacing placeholders soon — all shots from active field deployments"}
          </p>
        </div>
      </div>
    </div>
  );
}
