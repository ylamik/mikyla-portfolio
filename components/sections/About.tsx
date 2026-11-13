"use client";

import { useEffect, useRef, useState } from "react";
import Rose from "@/components/ui/Rose";
import Image from "next/image";
import { burst } from "@/lib/flutter";
import { rand } from "@/lib/butterfly";
import { sfx } from "@/lib/sfx";
import { profile } from "@/data/components/profile";

/** Chapter one: click the rose → it blooms → the about window pops out. */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [bloom, setBloom] = useState(false);
  const [showWindow, setShowWindow] = useState(false);

  // while the rose is open, petals keep drifting down
  useEffect(() => {
    const sec = sectionRef.current;
    if (!bloom || !sec || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const phone = window.matchMedia("(hover: none), (max-width: 760px)").matches;
    const id = setInterval(() => {
      for (let i = 0; i < (phone ? 1 : 3); i++) {
        const p = document.createElement("span");
        p.className = "fall-petal";
        p.style.left = `${rand(5, 95)}%`;
        p.style.setProperty("--dx", `${rand(-120, 120)}px`);
        p.style.animationDuration = `${rand(4, 7)}s`;
        p.style.transform = `scale(${rand(0.6, 1.2)})`;
        p.addEventListener("animationend", () => p.remove());
        sec.appendChild(p);
      }
    }, phone ? 900 : 500);
    return () => clearInterval(id);
  }, [bloom]);

  // the window appears a moment after the bloom starts
  useEffect(() => {
    if (!bloom) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => {
      setShowWindow(true);
      sfx.sparkle();
    }, reduce ? 0 : 1300);
    return () => clearTimeout(t);
  }, [bloom]);

  const open = (x: number, y: number) => {
    if (bloom) return;
    setBloom(true);
    sfx.chime();
    burst(x, y, 14);
  };

  const close = () => {
    setShowWindow(false);
    sfx.pop();
    setTimeout(() => setBloom(false), 300);
  };

  return (
    <section ref={sectionRef} className={`rose-sec${bloom ? " bloom" : ""}`} id="about">
      <div className="wrap rose-head rv">
        <p className="eyebrow">chapter one ~ a little about me</p>
        <h2 className="h2">Tap the rose to open my story</h2>
      </div>

      <div className="rose-stage">
        <div className="ring-pulse" />
        <button
          className="rose-btn"
          type="button"
          aria-label="Open the rose to read about Mikyla"
          aria-expanded={showWindow}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            open(r.left + r.width / 2, r.top + r.height * 0.45);
          }}
        >
          <Rose />
        </button>
        <span className="rose-hint">click me ✦</span>

        <div className={`about-win win${showWindow ? " show" : ""}`} role="dialog" aria-label="About Mikyla" aria-hidden={!showWindow}>
          <div className="win-bar">
            <span className="dots">
              <i style={{ background: "var(--pink)" }} />
              <i style={{ background: "var(--butter)" }} />
              <i style={{ background: "var(--mint)" }} />
            </span>
            <span className="title">about_mikyla.txt</span>
            <button className="win-x" type="button" aria-label="Close" onClick={close} tabIndex={showWindow ? 0 : -1}>
              ×
            </button>
          </div>
          <div className="win-body">
            <div className="mirror">
              <Image src="/images/profile-2.jpg" alt="Mikyla Caras" fill sizes="120px" className="photo photo-mirror" />
            </div>
            <p className="eyebrow" style={{ fontSize: 40 }}>Hi, I&apos;m {profile.firstName} ♡︎</p>
            <h3 style={{ fontFamily: "var(--font-cute)", fontWeight: 600, fontSize: "clamp(22px,2.4vw,28px)", margin: "6px 0 12px", lineHeight: 1.25 }}>
              {profile.aboutHeadline}
            </h3>
            {profile.aboutParagraphs.map((p, i) => (
              <p key={i} className="lead" style={{ margin: i === 0 ? "0 0 10px" : 0, fontSize: 17 }}>
                {p}
              </p>
            ))}
            <div className="facts">
              {profile.facts.map((f) => (
                <div key={f.label} className="fact" style={{ background: f.bg }}>
                  <b>{f.label}</b>
                  <span>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
