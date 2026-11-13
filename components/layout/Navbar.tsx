"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { butterflySVG } from "@/lib/butterfly";
import { useSound } from "@/hooks/useSound";
import { profile } from "@/data/components/profile";

const LINKS: { id: string; label: string; icon: ReactNode }[] = [
  { id: "about", label: "About", icon: <path d="M12 21C8 17 5 14 5 10.5 5 8 7 6 9.3 6c1.2 0 2.1.6 2.7 1.5C12.6 6.6 13.5 6 14.7 6 17 6 19 8 19 10.5c0 3.5-3 6.5-7 10.5z" /> },
  { id: "work", label: "Work", icon: <><path d="M6 21V10A6 6 0 0 1 18 10V21Z" /><path d="M12 4V21M6 14H18" /></> },
  { id: "skills", label: "Skills", icon: <><rect x="3" y="7" width="18" height="11" rx="3" /><path d="M7 11H8M11 11H13M16 11H17M8 14.5H16" /></> },
  { id: "beyond", label: "Beyond", icon: <path d="M15 3A9 9 0 1 0 21 15A7 7 0 1 1 15 3Z" /> },
  { id: "contact", label: "Contact", icon: <><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3.5 7L12 13.5L20.5 7" /></> },
];

// butterfly that sits on top of the highlight bubble, as a CSS background image
const FAIRY_IMG = `url("data:image/svg+xml,${encodeURIComponent(
  butterflySVG("#fff", "#F7B6D2").replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '),
)}")`;

export default function Navbar() {
  const { sfx, muted, toggleMute } = useSound();
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [current, setCurrent] = useState<string | null>(null); // section on screen
  const [hovered, setHovered] = useState<string | null>(null); // link under the mouse
  const [bubble, setBubble] = useState<{ x: number; w: number } | null>(null);

  // which section is in the middle of the screen right now?
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["home", ...LINKS.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // move the highlight bubble to the hovered link, or the current section's link
  useEffect(() => {
    const target = hovered ?? current;
    const i = LINKS.findIndex((l) => l.id === target);
    const el = linkRefs.current[i];
    const update = () => setBubble(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [hovered, current]);

  return (
    <nav className="top" aria-label="Main">
      <span className="nav-shine" aria-hidden="true" />
      <a className="logo" href="#home">
        <svg className="wand" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 21L14 10" stroke="#5B3A86" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M17 2L18.2 5.8L22 7L18.2 8.2L17 12L15.8 8.2L12 7L15.8 5.8Z" fill="#FFE49A" stroke="#5B3A86" strokeWidth="1.2" />
        </svg>
        {profile.firstName}
        <span className="charm" aria-hidden="true">
          <i />
          <svg viewBox="0 0 24 24">
            <path d="M12 2L14.6 9.2L22 9.3L16 13.8L18.3 21L12 16.6L5.7 21L8 13.8L2 9.3L9.4 9.2Z" fill="#FFE49A" stroke="#5B3A86" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </span>
      </a>

      <div className="nav-links" onMouseLeave={() => setHovered(null)}>
        {LINKS.map((l, i) => (
          <a
            key={l.id}
            ref={(el) => {
              linkRefs.current[i] = el;
            }}
            href={`#${l.id}`}
            className={current === l.id ? "cur" : undefined}
            aria-current={current === l.id ? "true" : undefined}
            onMouseEnter={() => {
              setHovered(l.id);
              sfx.sparkle();
            }}
            onClick={() => sfx.pop()}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">{l.icon}</svg>
            <span>{l.label}</span>
          </a>
        ))}
        <span
          className="fairy"
          aria-hidden="true"
          style={
            {
              "--bfimg": FAIRY_IMG,
              opacity: bubble ? 1 : 0,
              width: bubble?.w ?? 60,
              transform: `translateX(${bubble?.x ?? 0}px)`,
            } as CSSProperties
          }
        />
      </div>

      <button
        id="soundBtn"
        type="button"
        className={muted ? "muted" : undefined}
        aria-pressed={!muted}
        aria-label={muted ? "Sound off" : "Sound on"}
        onClick={() => {
          toggleMute();
          if (muted) setTimeout(() => sfx.pop(), 0); // was muted → now on: play a little pop
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18V5L20 3V16" fill="none" stroke="#5B3A86" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="6.5" cy="18" r="2.8" fill="#F7B6D2" stroke="#5B3A86" strokeWidth="1.8" />
          <circle cx="17.5" cy="16" r="2.8" fill="#C9A9EE" stroke="#5B3A86" strokeWidth="1.8" />
        </svg>
        <span>{muted ? "off" : "on"}</span>
      </button>
    </nav>
  );
}
