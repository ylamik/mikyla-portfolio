"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Lightbox from "@/components/ui/Lightbox";
import { memories, type Memory } from "@/data/components/gallery";
import { sfx } from "@/lib/sfx";

type Filter = "all" | Memory["tag"];
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "badminton", label: "Badminton" },
  { id: "academics", label: "Academics" },
];
// fixed tilts so server + browser render the same thing
const TILTS = [-4, 3, -2, 4, -3, 2, -5, 3];

/** Polaroids hanging from a fairy-light string. Scroll / swipe / drag sideways. */
export default function MemoryReel() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const items = filter === "all" ? memories : memories.filter((m) => m.tag === filter);

  const scrollBy = (dir: number) => {
    const reel = reelRef.current;
    if (!reel) return;
    reel.scrollBy({ left: dir * reel.clientWidth * 0.8, behavior: "smooth" });
    sfx.click(1.3);
  };

  // drag with the mouse (touch screens already swipe natively)
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !reelRef.current) return;
    drag.current = { x: e.clientX, left: reelRef.current.scrollLeft, moved: false };
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || !reelRef.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    reelRef.current.scrollLeft = d.left - dx;
  };
  const up = () => {
    setTimeout(() => (drag.current = null), 0);
  };

  const moveLightbox = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  return (
    <div className="memories">
      <div className="mem-head">
        <p className="eyebrow" style={{ color: "#FFE9A8", fontSize: "clamp(32px,4vw,42px)" }}>memory reel</p>
        <div className="mem-tabs" role="tablist" aria-label="Filter photos">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={filter === f.id ? "on" : undefined}
              onClick={() => {
                setFilter(f.id);
                reelRef.current?.scrollTo({ left: 0 });
                sfx.pop();
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="reel-wrap">
        <button type="button" className="reel-arrow left" aria-label="Scroll left" onClick={() => scrollBy(-1)}>‹</button>
        <div className="reel" ref={reelRef} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
          <div className="reel-track">
            {items.map((m, i) => (
              <button
                key={m.src}
                type="button"
                className="pol"
                style={{ "--tilt": `${TILTS[i % TILTS.length]}deg`, animationDelay: `${-i * 0.6}s` } as CSSProperties}
                aria-label={`Open photo: ${m.caption}`}
                onClick={() => {
                  if (drag.current?.moved) return;
                  setOpen(i);
                  sfx.sparkle();
                }}
              >
                <span className="pin" aria-hidden="true" />
                <span className="pol-img">
                  <Image src={m.src} alt="" fill sizes="(max-width: 600px) 70vw, 300px" style={{ objectFit: "cover" }} />
                </span>
                <span className="pol-cap">{m.caption}</span>
                <span className={`pol-tag ${m.tag}`}>{m.tag === "badminton" ? "badminton" : "academics"}</span>
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="reel-arrow right" aria-label="Scroll right" onClick={() => scrollBy(1)}>›</button>
      </div>
      <p className="reel-hint">swipe or drag to see more · tap a photo to open it</p>

      {open !== null && (
        <Lightbox images={items} index={open} title="memory collection" onClose={() => setOpen(null)} onMove={moveLightbox} />
      )}
    </div>
  );
}
