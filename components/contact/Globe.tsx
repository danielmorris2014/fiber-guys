"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

const PROJECT_MARKERS: [number, number][] = [
  [30.2672, -97.7431],   // Austin, TX
  [33.4484, -112.074],   // Phoenix, AZ
  [39.7392, -104.9903],  // Denver, CO
  [36.1627, -86.7816],   // Nashville, TN
  [32.7767, -96.797],    // Dallas, TX
  [40.7128, -74.006],    // New York, NY
  [34.0522, -118.2437],  // Los Angeles, CA
  [41.8781, -87.6298],   // Chicago, IL
  [29.7604, -95.3698],   // Houston, TX
  [33.749, -84.388],     // Atlanta, GA
];

function locationToAngles(lat: number, lon: number): [number, number] {
  return [
    Math.PI - ((lat * Math.PI) / 180 - Math.PI / 2),
    ((lon * Math.PI) / 180 - Math.PI / 2),
  ];
}

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 4,
      baseColor: [0.06, 0.08, 0.1],
      markerColor: [1.0, 0.35, 0.12],
      glowColor: [0.06, 0.08, 0.1],
      markers: PROJECT_MARKERS.map(([lat, lng]) => ({
        location: [lat, lng] as [number, number],
        size: 0.06,
      })),
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative aspect-square w-full max-w-[600px] mx-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ contain: "layout paint size" }}
      />
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="font-mono text-[10px] text-muted/50 uppercase tracking-widest">
          Active Project Locations
        </p>
      </div>
    </div>
  );
}
