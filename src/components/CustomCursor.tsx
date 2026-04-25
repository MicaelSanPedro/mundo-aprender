"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const mounted = useRef(false);

  useEffect(() => {
    // Only run on client and desktop
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (mounted.current) return;
    mounted.current = true;

    const dot = document.createElement("div");
    dot.className = "custom-cursor-dot";
    dot.innerHTML = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L1 14L5.5 9.5L9 15L11.5 13.5L8 8L14 7.5L1 1Z" fill="white" stroke="#FF922B" stroke-width="1.2" stroke-linejoin="round"/>
    </svg>`;
    const ring = document.createElement("div");
    ring.className = "custom-cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, [role='button'], input, select, textarea, label")) {
        dot.classList.add("hovering");
        ring.classList.add("hovering");
      } else {
        dot.classList.remove("hovering");
        ring.classList.remove("hovering");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleOver);
    const rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleOver);
      cancelAnimationFrame(rafId);
      dot.remove();
      ring.remove();
      mounted.current = false;
    };
  }, []);

  return null;
}
