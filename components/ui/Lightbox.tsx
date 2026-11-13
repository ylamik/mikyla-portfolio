"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import { createPortal } from "react-dom";
import { sfx } from "@/lib/sfx";

export type LightboxImage = { src: string; caption: string };

const MIN = 1;
const MAX = 4;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Photo collection dialog: big zoomable viewer + thumbnail strip.
 * Zoom: + / − buttons, mouse wheel, double-click, or pinch. Drag to move around when zoomed.
 */
export default function Lightbox({
  images,
  index,
  onClose,
  onMove,
  title = "photo collection",
  note,
}: {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onMove: (step: number) => void;
  title?: string;
  note?: string;
  label?: string;
}) {
  const img = images[index];
  const many = images.length > 1;
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const last = useRef<{ x: number; y: number; dist: number } | null>(null);

  const reset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // new photo → zoom back out and keep its thumbnail in view
  useEffect(() => {
    reset();
    thumbsRef.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index, reset]);

  useEffect(() => {
    closeRef.current?.focus();
    document.body.classList.add("locked");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (many && e.key === "ArrowRight") onMove(1);
      if (many && e.key === "ArrowLeft") onMove(-1);
      if (e.key === "+" || e.key === "=") setZoom((z) => clamp(z + 0.5, MIN, MAX));
      if (e.key === "-") setZoom((z) => clamp(z - 0.5, MIN, MAX));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (document.body.classList.contains("entered")) document.body.classList.remove("locked");
    };
  }, [onClose, onMove, many]);

  const zoomBy = (d: number) => {
    setZoom((z) => {
      const nz = clamp(z + d, MIN, MAX);
      if (nz === 1) setPan({ x: 0, y: 0 });
      return nz;
    });
    sfx.click(1.4);
  };

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    const nz = clamp(zoom - e.deltaY * 0.0015, MIN, MAX);
    setZoom(nz);
    if (nz === 1) setPan({ x: 0, y: 0 });
  };

  // drag to pan (1 finger / mouse) and pinch to zoom (2 fingers)
  // clicks on the arrow buttons must reach the buttons, not the zoom/drag area
  const onButton = (e: { target: EventTarget }) => !!(e.target as HTMLElement).closest("button");

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (onButton(e)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    last.current = null;
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    const dist = pts.length > 1 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0;
    const prev = last.current;
    last.current = { x: cx, y: cy, dist };
    if (!prev) return;
    if (pts.length > 1 && prev.dist > 0) {
      setZoom((z) => clamp(z * (dist / prev.dist), MIN, MAX));
    }
    if (zoom > 1 || pts.length > 1) setPan((p) => ({ x: p.x + (cx - prev.x), y: p.y + (cy - prev.y) }));
  };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    last.current = null;
    if (zoom <= 1.01) reset();
  };

  // rendered straight into <body> so no animated parent can trap or clip it
  return createPortal(
    <div className="lightbox" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="win album" role="dialog" aria-modal="true" aria-label={title}>
        <div className="win-bar">
          <span className="dots">
            <i style={{ background: "var(--pink)" }} />
            <i style={{ background: "var(--butter)" }} />
            <i style={{ background: "var(--mint)" }} />
          </span>
          <span className="title">{title}</span>
          <button ref={closeRef} className="win-x" type="button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="album-body">
          <div
            className={`album-stage${zoom > 1 ? " zoomed" : ""}`}
            onWheel={onWheel}
            onDoubleClick={(e) => {
              if (onButton(e)) return;
              if (zoom > 1) reset();
              else setZoom(2);
            }}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
          >
            <div className="album-img" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
              <Image key={img.src} src={img.src} alt={img.caption} fill sizes="(max-width: 900px) 96vw, 960px" style={{ objectFit: "contain" }} draggable={false} />
            </div>
            {many && (
              <>
                <button type="button" className="album-arrow left" aria-label="Previous" onClick={() => { onMove(-1); sfx.click(1.3); }}>‹</button>
                <button type="button" className="album-arrow right" aria-label="Next" onClick={() => { onMove(1); sfx.click(1.3); }}>›</button>
              </>
            )}
            <span className="album-count">{index + 1} / {images.length}</span>
          </div>

          <div className="album-tools">
            <p className="album-cap">{img.caption}</p>
            <div className="zoom-ctrl" aria-label="Zoom">
              <button type="button" aria-label="Zoom out" onClick={() => zoomBy(-0.5)} disabled={zoom <= MIN}>−</button>
              <button type="button" className="zoom-val" aria-label="Reset zoom" onClick={reset}>{Math.round(zoom * 100)}%</button>
              <button type="button" aria-label="Zoom in" onClick={() => zoomBy(0.5)} disabled={zoom >= MAX}>+</button>
            </div>
          </div>

          {many && (
            <div className="album-thumbs" ref={thumbsRef}>
              {images.map((t, i) => (
                <button
                  key={t.src}
                  type="button"
                  data-i={i}
                  className={i === index ? "on" : undefined}
                  aria-label={`Show ${t.caption}`}
                  aria-current={i === index}
                  onClick={() => onMove(i - index)}
                >
                  <Image src={t.src} alt="" fill sizes="110px" style={{ objectFit: "cover", objectPosition: "top" }} />
                </button>
              ))}
            </div>
          )}
          {note && <p className="album-note">{note}</p>}
          <p className="album-hint">scroll, pinch or double-click to zoom · drag to move around</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
