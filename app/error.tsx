"use client";

import { useEffect } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Error Boundary]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 mx-auto mb-6 border border-line rounded-sm flex items-center justify-center bg-bg-2">
          <span className="font-mono text-lg text-muted/40">!</span>
        </div>

        <h1 className="font-heading text-2xl font-bold tracking-tight mb-3">
          Something went wrong
        </h1>
        <p className="text-sm text-muted mb-8">
          An unexpected error occurred. Try refreshing the page or head back
          home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="font-mono text-xs uppercase tracking-[0.15em] px-6 py-3 border border-orange text-orange hover:bg-orange hover:text-white transition-colors rounded-sm interactable"
          >
            Try Again
          </button>
          <MagneticButton href="/" variant="secondary">
            Back to Home
          </MagneticButton>
        </div>
      </div>
    </main>
  );
}
