"use client";

import ContentLoader from "react-content-loader";

export function GallerySkeleton() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="break-inside-avoid">
          <ContentLoader
            speed={1.5}
            width="100%"
            height={i % 3 === 0 ? 300 : i % 3 === 1 ? 220 : 260}
            viewBox={`0 0 400 ${i % 3 === 0 ? 300 : i % 3 === 1 ? 220 : 260}`}
            backgroundColor="#0a0a0a"
            foregroundColor="#1E293B"
            uniqueKey={`skeleton-${i}`}
          >
            <rect x="0" y="0" rx="0" ry="0" width="400" height={i % 3 === 0 ? 250 : i % 3 === 1 ? 170 : 210} />
            <rect x="0" y={i % 3 === 0 ? 260 : i % 3 === 1 ? 180 : 220} rx="2" ry="2" width="200" height="12" />
            <rect x="0" y={i % 3 === 0 ? 280 : i % 3 === 1 ? 200 : 240} rx="2" ry="2" width="120" height="10" />
          </ContentLoader>
        </div>
      ))}
    </div>
  );
}
