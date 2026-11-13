"use client";

import { useEffect } from "react";

const COLORS = ["#F7B6D2", "#C9A9EE", "#FFE49A", "#A9DDF5", "#ffffff"];

/** Little falling sparkles that follow the mouse (desktop only). */
export default function CursorTrail() {
  useEffect(() => {
    const touch = window.matchMedia("(hover: none)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (touch || reduce) return;

    let last = 0;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - last < 28) return;
      last = now;
      const s = document.createElement("span");
      const size = 8 + Math.random() * 8;
      s.className = "trail";
      s.style.width = s.style.height = `${size}px`;
      s.style.left = `${e.clientX + (Math.random() * 12 - 6)}px`;
      s.style.top = `${e.clientY + (Math.random() * 12 - 6)}px`;
      s.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      s.addEventListener("animationend", () => s.remove());
      document.body.appendChild(s);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
