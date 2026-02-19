"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>[]{}";

interface TextScrambleProps {
  text: string;
  className?: string;
  as?: "span" | "h3" | "p";
  /** Scramble on hover (default) or on mount */
  trigger?: "hover" | "mount";
  /** Duration in ms for the full scramble-to-settle cycle */
  duration?: number;
}

export function TextScramble({
  text,
  className = "",
  as: Tag = "span",
  trigger = "hover",
  duration = 600,
}: TextScrambleProps) {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef<number | null>(null);
  const isScrambling = useRef(false);

  const scramble = useCallback(() => {
    if (isScrambling.current) return;
    isScrambling.current = true;

    const length = text.length;
    const steps = Math.max(8, Math.floor(duration / 40));
    let step = 0;

    const tick = () => {
      step++;
      const progress = step / steps;

      // Characters settle left-to-right as progress increases
      const settled = Math.floor(progress * length);
      let result = "";

      for (let i = 0; i < length; i++) {
        if (i < settled) {
          result += text[i];
        } else if (text[i] === " ") {
          result += " ";
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplayed(result);

      if (step < steps) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(text);
        isScrambling.current = false;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [text, duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Mount trigger
  useEffect(() => {
    if (trigger === "mount") {
      const timeout = setTimeout(scramble, 200);
      return () => clearTimeout(timeout);
    }
  }, [trigger, scramble]);

  // Update displayed text if prop changes
  useEffect(() => {
    if (!isScrambling.current) setDisplayed(text);
  }, [text]);

  const handlers =
    trigger === "hover" ? { onMouseEnter: scramble } : {};

  return (
    <Tag className={className} {...handlers}>
      {displayed}
    </Tag>
  );
}
