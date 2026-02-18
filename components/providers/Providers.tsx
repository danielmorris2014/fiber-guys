"use client";

import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0a0a0a",
            border: "1px solid rgba(245, 241, 232, 0.12)",
            color: "#F5F1E8",
            fontFamily: "var(--font-body)",
          },
        }}
        closeButton
      />
    </>
  );
}
