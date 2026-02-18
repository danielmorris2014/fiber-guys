"use client";

export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.07]"
      style={{ mixBlendMode: "overlay" }}
    >
      <svg width="100%" height="100%" className="animate-grain">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="200%"
          height="200%"
          filter="url(#grain-filter)"
        />
      </svg>
    </div>
  );
}
