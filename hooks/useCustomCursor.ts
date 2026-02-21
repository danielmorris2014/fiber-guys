"use client";

import { useEffect, useRef, useCallback } from "react";

interface CursorElements {
  dot: HTMLDivElement | null;
  ring: HTMLDivElement | null;
  label: HTMLDivElement | null;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function useCustomCursor() {
  const elements = useRef<CursorElements>({ dot: null, ring: null, label: null });
  const mouse = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const isHovering = useRef(false);
  const isGallery = useRef(false);
  const isTouch = useRef(false);

  const hasMoved = useRef(false);

  const animate = useCallback(() => {
    const { dot, ring, label } = elements.current;
    if (!dot || !ring) return;

    if (!hasMoved.current) {
      rafId.current = requestAnimationFrame(animate);
      return;
    }

    // Dot follows directly
    dotPos.current.x = mouse.current.x;
    dotPos.current.y = mouse.current.y;

    // Ring follows with lag
    ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.15);
    ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.15);

    dot.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;

    // Gallery mode: large ring with DRAG label
    if (isGallery.current && !isHovering.current) {
      const size = 80;
      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.backgroundColor = "rgba(37,99,235,0.12)";
      ring.style.borderColor = "rgba(37,99,235,0.4)";
      if (label) {
        label.style.opacity = "1";
        label.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }
    } else {
      // Default + interactive hover states
      const size = isHovering.current ? 80 : 40;
      const bg = isHovering.current ? "rgba(37,99,235,0.1)" : "transparent";
      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.backgroundColor = bg;
      ring.style.borderColor = "rgba(255,255,255,0.3)";
      if (label) {
        label.style.opacity = "0";
        label.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }
    }

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
      hasMoved.current = true;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [data-cursor], [role='button'], input, textarea, select, .magnetic-button, .interactable"
      );
      isHovering.current = !!interactive;

      // Check if inside gallery zone
      const galleryZone = target.closest("[data-cursor-gallery]");
      isGallery.current = !!galleryZone && !interactive;
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
