"use client";

import React, { useRef, useEffect, useCallback } from "react";
import "./AnimatedIcon.css";

type IconName =
  | "book"
  | "notebook"
  | "pencil"
  | "calculator"
  | "game"
  | "document"
  | "search"
  | "cart"
  | "heart"
  | "key"
  | "shield"
  | "download"
  | "award"
  | "star"
  | "mail"
  | "phone"
  | "sparkle"
  | "clock"
  | "copy"
  | "check"
  | "lock"
  | "credit-card"
  | "question"
  | "cloud-download"
  | "users"
  | "store"
  | "arrow-right"
  | "share"
  | "trash"
  | "package"
  | "truck";

interface AnimatedIconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  animated?: boolean;
  onClick?: () => void;
}

const iconPaths: Record<IconName, string> = {
  book:
    "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2H20V17H6.5A2.5 2.5 0 0 0 4 19.5Z",
  notebook:
    "M4 4h16v16H4zM8 2v4M8 10v4M12 2v4M12 10v4M16 2v4M16 10v4",
  pencil:
    "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z",
  calculator:
    "M4 4h16v16H4zM8 8h8M8 12h8M8 16h4",
  game:
    "M6 12h4M8 10v4M15 13h.01M17 11h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  document:
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8ZM14 2v6h6M16 13H8M16 17H8M10 9H8",
  search:
    "M11 17a6 6 0 1 0-6-6 6 6 0 0 0 6 6ZM21 21l-4.35-4.35",
  cart:
    "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6M6 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM17 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  heart:
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z",
  key:
    "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777ZM15 4H9l-3 9 3 3 9-3V7l-3-3Z",
  shield:
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
  download:
    "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  award:
    "M12 15l-2 5h-3l1-4-3-3 4-1 3-3 3 3 4 1-3 3 1 4h-3l-2-5Z",
  star:
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  mail:
    "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2ZM22 6l-10 7L2 6",
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z",
  sparkle:
    "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3ZM19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13Z",
  clock:
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2",
  copy:
    "M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2ZM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  check:
    "M20 6L9 17l-5-5",
  lock:
    "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2ZM7 11V7a5 5 0 0 1 10 0v4",
  "credit-card":
    "M1 4h22v16H1zM1 10h22",
  question:
    "M9 9a3 3 0 1 0 5.12 1.5c0-1.5-2.12-2-2.12-3.5M12 17h.01",
  "cloud-download":
    "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 13v9M8 18l4 4 4-4",
  users:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  store:
    "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2ZM9 22V12h6v10",
  "arrow-right":
    "M5 12h14M12 5l7 7-7 7",
  share:
    "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
  trash:
    "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6",
  package:
    "M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  truck:
    "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
};

export default function AnimatedIcon({
  name,
  size = 32,
  color,
  className = "",
  animated = true,
  onClick,
}: AnimatedIconProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAnimation = useCallback(() => {
    if (!svgRef.current || !animated) return;

    const svg = svgRef.current;
    svg.classList.remove("icon-animate");

    // Force reflow
    void svg.offsetWidth;

    svg.classList.add("icon-animate");

    // Also animate child paths
    const paths = svg.querySelectorAll("path, polyline, line, circle, rect");
    paths.forEach((p, i) => {
      p.classList.remove("icon-draw");
      void (p as SVGElement).offsetWidth;
      (p as SVGElement).classList.add("icon-draw");
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      svg.classList.remove("icon-animate");
      paths.forEach((p) => {
        (p as SVGElement).classList.remove("icon-draw");
      });
    }, 2000);
  }, [animated]);

  useEffect(() => {
    triggerAnimation();
  }, [name, triggerAnimation]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Viewbox based on icon
  const viewBox =
    name === "star" || name === "sparkle" || name === "check" || name === "arrow-right"
      ? "0 0 24 24"
      : "0 0 24 24";

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`animated-icon ${animated ? "icon-animate" : ""} ${className}`}
      style={{
        color: color || "inherit",
        width: size,
        height: size,
        display: "inline-block",
        verticalAlign: "middle",
        ...(onClick ? { cursor: "pointer" } : {}),
      }}
      onClick={onClick}
      onMouseEnter={animated ? triggerAnimation : undefined}
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
