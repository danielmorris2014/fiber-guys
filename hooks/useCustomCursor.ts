"use client";

import { useEffect, useRef, useCallback } from "react";

interface CursorElements {
  dot: HTMLDivElement | null;
  ring: HTMLDivElement | null;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function useCustomCursor() {
  const elements = useRef<CursorElements>({ dot: null, ring: null });
  const mouse = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const isHovering = useRef(false);
  const isTouch = useRef(false);

  const animate = useCallback(() => {
    const { dot, ring } = elements.current;
    if (!dot || !ring) {
      rafId.current = requestAnimationFrame(animate);
      return;
    }

    // Dot follows directly
    dotPos.current.x = lerp(dotPos.current.x, mouse.current.x, 1);
    dotPos.current.y = lerp(dotPos.current.y, mouse.current.y, 1);

    // Ring follows with lag
    ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.15);
    ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.15);

    dot.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;

    // Expand ring on hover
    const size = isHovering.current ? 80 : 40;
    const bg = isHovering.current ? "rgba(37,99,235,0.1)" : "transparent";
    ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
    ring.style.width = `${size}px`;
    ring.style.height = `${size}px`;
    ring.style.backgroundColor = bg;

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const touchQuery = window.matchMedia("(pointer: coarse)");
    if (touchQuery.matches) {
      isTouch.current = true;
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [data-cursor], [role='button'], input, textarea, select, .magnetic-button, .interactable"
      );
      isHovering.current = !!interactive;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId.current);
    };
  }, [animate]);

  return { elements, isTouch };
}
