"use client";

import { BarLoader } from "react-spinners";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { width: 80, height: 2 },
  md: { width: 150, height: 3 },
  lg: { width: 200, height: 4 },
};

export function Spinner({ size = "md" }: SpinnerProps) {
  const { width, height } = sizeMap[size];

  return (
    <BarLoader
      color="#2563EB"
      width={width}
      height={height}
      speedMultiplier={0.8}
    />
  );
}
