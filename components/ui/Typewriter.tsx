"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  className?: string;
  /** Delay before typing starts (ms) */
  delay?: number;
  /** Speed per character (ms) */
  speed?: number;
  /** Show blinking cursor */
  cursor?: boolean;
}

export function Typewriter({
  text,
  className = "",
  delay = 0,
  speed = 60,
  cursor = true,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span className={className}>
      {displayed}
      {cursor && !done && started && (
        <span className="animate-pulse text-blue-600">_</span>
      )}
      {cursor && done && (
        <span className="animate-[flicker_4s_ease-in-out_infinite] text-blue-600">_</span>
      )}
    </span>
  );
}
