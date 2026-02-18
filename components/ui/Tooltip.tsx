"use client";

import { Tooltip as ReactTooltip } from "react-tooltip";

export function TooltipProvider() {
  return (
    <ReactTooltip
      id="fiber-tooltip"
      place="top"
      style={{
        backgroundColor: "#0a0a0a",
        color: "#F5F1E8",
        border: "1px solid rgba(245, 241, 232, 0.12)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
        borderRadius: "0",
        padding: "8px 12px",
        zIndex: 9999,
      }}
    />
  );
}
