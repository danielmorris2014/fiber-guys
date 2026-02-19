"use client";

/**
 * IndustryMarquee — infinite-scroll strip of telecom industry standard logos.
 * Text-based wordmarks with monochrome treatment (no image files needed).
 * Positioned directly below the Hero for instant authority.
 */

const BRANDS = [
  { name: "Corning", sub: "Fiber Optics" },
  { name: "AFL", sub: "Fiber & Cable" },
  { name: "Fujikura", sub: "Fusion Splicers" },
  { name: "CommScope", sub: "Infrastructure" },
  { name: "PLP", sub: "Closures & Hardware" },
  { name: "Sumitomo", sub: "Splicer Systems" },
  { name: "VIAVI", sub: "Test & Measurement" },
  { name: "Condux", sub: "Jetting Equipment" },
];

function BrandItem({ name, sub }: { name: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <span className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-white/20">
        {name}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-widest text-white/10 hidden md:inline">
        {sub}
      </span>
    </div>
  );
}

export function IndustryMarquee() {
  return (
    <section
      className="relative overflow-hidden border-b border-white/[0.06] bg-[#050505] py-5 md:py-6"
      aria-label="Industry standards and equipment partners"
    >
      {/* Left/right fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#050505] to-transparent" />

      <div className="marquee-track">
        {/* First copy */}
        <div className="marquee-content" aria-hidden="false">
          {BRANDS.map((b) => (
            <BrandItem key={b.name} {...b} />
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="marquee-content" aria-hidden="true">
          {BRANDS.map((b) => (
            <BrandItem key={`dup-${b.name}`} {...b} />
          ))}
        </div>
      </div>
    </section>
  );
}
