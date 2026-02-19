"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextScramble } from "@/components/ui/TextScramble";

const bullets = [
  "Geo-tagged As-Builts & Splice Maps",
  "End-to-End OTDR Traces (.sor & PDF)",
  "Clean Redline Markup",
];

const files = [
  { name: "route_redlines_v2.pdf", size: "4.2 MB", type: "pdf" },
  { name: "OTDR_Trace_Span4.sor", size: "1.8 MB", type: "sor" },
  { name: "splice_map_144ct.pdf", size: "2.1 MB", type: "pdf" },
  { name: "tray_photos_144ct.zip", size: "38.6 MB", type: "zip" },
  { name: "as_built_route_7.dwg", size: "6.4 MB", type: "dwg" },
];

function FileIcon({ type }: { type: string }) {
  const colors: Record<string, string> = {
    pdf: "text-red-400/70",
    sor: "text-cyan-400/70",
    zip: "text-amber-400/70",
    dwg: "text-violet-400/70",
  };
  return (
    <span className={`font-mono text-[10px] font-bold uppercase ${colors[type] || "text-white/40"}`}>
      .{type}
    </span>
  );
}

export function ProofModule() {
  return (
    <section className="bg-bg-2 border-y border-line">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-section-sm lg:py-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column — Text */}
          <ScrollReveal>
            <p className="caption-lg text-orange mb-4">The Proof</p>
            <h2 className="font-heading text-h2 lg:text-h1 font-bold tracking-tighter">
              Audit-Ready Handoffs
            </h2>
            <p className="mt-2 text-lg text-orange/80 font-medium">
              Data built for the prime contractor.
            </p>
            <p className="mt-6 text-muted leading-relaxed">
              We don&apos;t just leave you with a physical build; we hand over
              the exact data you need for seamless internal tracking and prime
              contractor invoicing. Our closeout packages are formatted,
              verified, and ready for submission the moment we step off site.
            </p>
            <ul className="mt-8 space-y-3">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange mt-2 shrink-0" />
                  <span className="text-sm text-text leading-relaxed font-medium">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Right Column — Terminal File Explorer Mockup */}
          <ScrollReveal delay={0.15}>
            <div className="relative">
              {/* Terminal window */}
              <div className="rounded-lg border border-line bg-bg overflow-hidden shadow-2xl shadow-black/40">
                {/* Title bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-line">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    </div>
                    <span className="font-mono text-[10px] text-white/30 ml-2 uppercase tracking-widest">
                      closeout_pkg
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-white/20">
                    5 items
                  </span>
                </div>

                {/* Path bar */}
                <div className="px-4 py-2 border-b border-line/50 bg-white/[0.01]">
                  <span className="font-mono text-[10px] text-white/25">
                    <span className="text-orange/50">~/</span>
                    projects/
                    <span className="text-white/40">metro_east_144ct</span>
                    /closeout
                  </span>
                </div>

                {/* File listing */}
                <div className="divide-y divide-line/30">
                  {files.map((file, i) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileIcon type={file.type} />
                        <span className="font-mono text-xs text-white/60 group-hover:text-white/90 transition-colors truncate">
                          <TextScramble text={file.name} duration={400} />
                        </span>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                        <span className="font-mono text-[10px] text-white/20">
                          {file.size}
                        </span>
                        {i < 3 && (
                          <span className="w-1 h-1 rounded-full bg-emerald-500/60" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-line bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[10px] text-emerald-500/70 uppercase tracking-widest">
                      All files verified
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-white/15">
                    53.1 MB total
                  </span>
                </div>
              </div>

              {/* VERIFIED CLOSEOUT stamp */}
              <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-10">
                <div className="relative">
                  {/* Glow */}
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-lg" />
                  {/* Badge */}
                  <div className="relative border-2 border-emerald-500/60 bg-bg/90 backdrop-blur-sm px-4 py-2 rounded-sm rotate-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">
                        Verified Closeout
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle scan line effect */}
              <div
                className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
                  }}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
