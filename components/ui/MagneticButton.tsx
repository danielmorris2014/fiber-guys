"use client";

import { motion } from "motion/react";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "large";
  type?: "button" | "submit";
}

const sizeStyles = {
  default: "px-6 py-3 text-sm",
  large: "px-8 py-4 text-base",
};

export function MagneticButton({
  children,
  href,
  onClick,
  className,
  variant = "primary",
  size = "default",
  type = "button",
}: MagneticButtonProps) {
  const { ref, position, handleMouseMove, handleMouseLeave } =
    useMagneticHover(0.25);

  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";

  const baseClass = cn(
    "magnetic-button interactable group relative inline-flex items-center justify-center overflow-hidden transition-all duration-300",
    "font-mono uppercase tracking-widest text-xs", // Technical typography
    isPrimary && "bg-orange text-bg hover:bg-white hover:text-bg", // High contrast
    isSecondary && "border border-line text-text hover:border-orange hover:text-orange",
    isGhost && "text-muted hover:text-orange",
    sizeStyles[size],
    className
  );

  const motionProps = {
    ref: ref as React.Ref<any>,
    className: baseClass,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    animate: { x: position.x, y: position.y },
    transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 } as const,
    "data-cursor": "CLICK"
  };

  const inner = (
    <>
      {/* Tech corners for primary */}
      {isPrimary && (
        <>
          <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-bg" />
          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-bg" />
        </>
      )}

      <span className="relative z-10 flex items-center gap-2">
        {isPrimary && <span className="w-1 h-1 bg-current rounded-full" />}
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a href={href} {...motionProps}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} {...motionProps}>
      {inner}
    </motion.button>
  );
}
