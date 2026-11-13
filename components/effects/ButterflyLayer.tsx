"use client";

import { useEffect, useRef } from "react";
import Butterfly from "@/components/ui/Butterfly";
import { burst, clearAmbient, spawnAmbient, trackMouse } from "@/lib/flutter";
import { sfx } from "@/lib/sfx";

/**
 * Page-wide effects:
 *  - soft glow that follows the cursor
 *  - scroll progress bar with a butterfly riding it
 *  - wandering butterflies (after the intro)
 *  - parallax: anything with class "par" + data-depth shifts with the mouse
 *  - clicking empty space makes a tiny butterfly puff
 */
export default function ButterflyLayer() {
  const glowRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const progress = progressRef.current;
    const touch = window.matchMedia("(hover: none)").matches;
    const mouse = { x: -999, y: -999 };
    let gx = -999;
    let gy = -999;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      trackMouse(e.clientX, e.clientY);
      if (touch) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      document.querySelectorAll<HTMLElement>(".par").forEach((el) => {
        const d = Number(el.dataset.depth) || 0;
        el.style.translate = `${nx * d}px ${ny * d}px`;
      });
    };

    const follow = () => {
      gx += (mouse.x - gx) * 0.12;
      gy += (mouse.y - gy) * 0.12;
      if (glow) {
        glow.style.left = `${gx}px`;
        glow.style.top = `${gy}px`;
      }
      raf = requestAnimationFrame(follow);
    };
    if (!touch) raf = requestAnimationFrame(follow);

    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (progress) progress.style.width = `${max > 0 ? (h.scrollTop / max) * 100 : 0}%`;
    };

    const onClick = (e: MouseEvent) => {
      if (!document.body.classList.contains("entered")) return;
      if ((e.target as HTMLElement).closest("button,a,input,textarea,.key,.env,.win,#modal,[role=button]")) return;
      burst(e.clientX, e.clientY, 4);
      sfx.sparkle();
    };

    const onIntroDone = () => spawnAmbient();
    if (document.body.classList.contains("entered")) spawnAmbient();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("intro:done", onIntroDone);
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
      window.removeEventListener("intro:done", onIntroDone);
      clearAmbient();
    };
  }, []);

  return (
    <>
      <div id="glow" ref={glowRef} aria-hidden="true" />
      <div id="progress" ref={progressRef} aria-hidden="true">
        <span className="rider">
          <Butterfly top="#fff" bottom="#F7B6D2" />
        </span>
      </div>
    </>
  );
}
