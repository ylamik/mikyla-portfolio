"use client";

import { type CSSProperties, type MouseEvent } from "react";
import Image from "next/image";
import Butterfly from "@/components/ui/Butterfly";
import Button from "@/components/ui/Button";
import { burst } from "@/lib/flutter";
import { sfx } from "@/lib/sfx";
import { profile } from "@/data/components/profile";

const SPARKLE = "M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z";
const STAR = "M0-7L1.8-1.8L7 0L1.8 1.8L0 7L-1.8 1.8L-7 0L-1.8-1.8Z";

const FLOWERS = [
  { left: "6%", top: "62%", size: 30, color: "#F7B6D2", delay: 0 },
  { left: "14%", top: "18%", size: 22, color: "#C9A9EE", delay: -2 },
  { left: "3%", top: "84%", size: 20, color: "#FFE49A", delay: -4 },
  { left: "92%", top: "74%", size: 28, color: "#A9DDF5", delay: -1 },
  { left: "85%", top: "30%", size: 20, color: "#F7B6D2", delay: -3 },
  { left: "47%", top: "8%", size: 16, color: "#B5EDE4", delay: -5 },
  { left: "62%", top: "90%", size: 22, color: "#C9A9EE", delay: -2.5 },
];
const SPARKS = [
  ["9%", "34%", 26, 0], ["22%", "8%", 14, -1], ["40%", "52%", 12, -2], ["55%", "16%", 18, -0.5], ["76%", "12%", 14, -1.5],
  ["96%", "52%", 22, -2.2], ["30%", "92%", 16, -0.8], ["70%", "60%", 12, -2.6], ["2%", "48%", 14, -1.2],
] as const;
const PETALS = [0, 1, 2, 3, 4].map((a) => [12 + 7 * Math.cos(a * 1.2566 - 1.5708), 12 + 7 * Math.sin(a * 1.2566 - 1.5708)]);
const KEYCAPS = [
  { label: "Design", color: "var(--pink)", depth: 40, style: { top: "-6%", right: "2%", animationDelay: "-1s" } },
  { label: "Build", color: "var(--sky)", depth: -35, style: { top: "44%", right: "-4%", animationDelay: "-2s" } },
  { label: "Test", color: "var(--butter)", depth: 30, style: { bottom: "-4%", left: "8%", animationDelay: "-3s" } },
];

// little charms that dangle from strings at the top corners
type Charm = "star" | "moon" | "heart" | "butterfly";
function CharmIcon({ type }: { type: Charm }) {
  if (type === "butterfly") return <Butterfly top="#fff" bottom="#F7B6D2" />;
  const paths: Record<Exclude<Charm, "butterfly">, [string, string]> = {
    star: ["M12 2L14.6 9.2L22 9.3L16 13.8L18.3 21L12 16.6L5.7 21L8 13.8L2 9.3L9.4 9.2Z", "#FFE49A"],
    moon: ["M15 3A9 9 0 1 0 21 15A7 7 0 1 1 15 3Z", "#FFF1C2"],
    heart: ["M12 21C5 15.5 2 12 2 8.3 2 5.4 4.3 3 7.2 3c1.9 0 3.6 1 4.8 2.6C13.2 4 14.9 3 16.8 3 19.7 3 22 5.4 22 8.3c0 3.7-3 7.2-10 12.7z", "#F7B6D2"],
  };
  const [d, fill] = paths[type];
  return (
    <svg viewBox="0 0 24 24">
      <path d={d} fill={fill} stroke="#5B3A86" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
const HANGING: { side: "left" | "right"; at: string; len: number; size: number; type: Charm; speed: number; hideOnPhone?: boolean }[] = [
  { side: "left", at: "3%", len: 110, size: 30, type: "moon", speed: 4.6 },
  { side: "left", at: "7.5%", len: 190, size: 34, type: "butterfly", speed: 5.4, hideOnPhone: true },
  { side: "left", at: "12%", len: 70, size: 22, type: "star", speed: 3.8, hideOnPhone: true },
  { side: "right", at: "3.5%", len: 160, size: 28, type: "star", speed: 4.2 },
  { side: "right", at: "8%", len: 90, size: 26, type: "heart", speed: 5, hideOnPhone: true },
  { side: "right", at: "12.5%", len: 220, size: 22, type: "star", speed: 3.6, hideOnPhone: true },
];

/** A flowering vine that climbs up from a bottom corner. */
function Vine({ side }: { side: "left" | "right" }) {
  const leaves = [[34, 200, -40], [58, 160, 35], [30, 120, -30], [56, 84, 40], [36, 50, -35]];
  const flowers: [number, number, string][] = [[46, 178, "#F7B6D2"], [40, 102, "#C9A9EE"], [52, 30, "#FFE49A"]];
  return (
    <svg className={`vine-corner ${side}`} viewBox="0 0 100 260" aria-hidden="true">
      <path d="M50 260C30 220 64 190 44 150C26 114 62 90 46 50C38 30 50 14 54 4" fill="none" stroke="#7DB892" strokeWidth="4" strokeLinecap="round" />
      {leaves.map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="13" ry="6" fill="#A6DDB5" stroke="#5B8F6A" strokeWidth="1.4" transform={`rotate(${r} ${x} ${y})`} />
      ))}
      {flowers.map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {PETALS.map(([px, py], j) => (
            <circle key={j} cx={(px - 12) * 0.9} cy={(py - 12) * 0.9} r="5" fill={c} stroke="#5B3A86" strokeWidth="1.3" />
          ))}
          <circle r="3" fill="#FFF6D6" stroke="#5B3A86" strokeWidth="1.3" />
        </g>
      ))}
      <circle cx="54" cy="4" r="4" fill="#B07FE0" stroke="#5B3A86" strokeWidth="1.3" />
    </svg>
  );
}

/** One letter of the big name: drops in on load, jiggles when hovered. */
function Letter({ ch, i }: { ch: string; i: number }) {
  const jiggle = (e: MouseEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    el.classList.remove("jelly");
    void el.offsetWidth; // restart the CSS animation
    el.classList.add("jelly");
    sfx.click(1.4 + i * 0.08);
  };
  return (
    <span className="ltr" style={{ "--i": i } as CSSProperties} aria-hidden="true" onMouseEnter={jiggle}>
      {ch}
    </span>
  );
}

export default function Hero() {
  // split the name into letters, numbered so each one drops in a little after the last
  const [first, last] = profile.fullName.split(" ");
  const firstLetters = first.split("").map((ch, i) => ({ ch, i }));
  const lastLetters = last.split("").map((ch, i) => ({ ch, i: i + first.length + 1 }));

  return (
    <header className="hero" id="home">
      <svg className="grain" aria-hidden="true">
        <filter id="gr">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={2} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#gr)" />
      </svg>
      {/* side decorations */}
      <div className="hero-deco" aria-hidden="true">
        {HANGING.map((h, i) => (
          <span
            key={i}
            className={`hang${h.hideOnPhone ? " hide-phone" : ""}`}
            style={{ [h.side]: h.at, "--len": `${h.len}px`, "--size": `${h.size}px`, animationDuration: `${h.speed}s`, animationDelay: `${-i * 0.7}s` } as CSSProperties}
          >
            <i />
            <CharmIcon type={h.type} />
          </span>
        ))}
        <Vine side="left" />
        <Vine side="right" />
        <svg className="constel par" data-depth="-12" viewBox="0 0 200 120">
          <path d="M10 90L50 40L95 70L140 20L190 50" fill="none" stroke="#C9A9EE" strokeWidth="1.5" strokeDasharray="3 5" />
          {[[10, 90], [50, 40], [95, 70], [140, 20], [190, 50]].map(([x, y]) => (
            <path key={x} transform={`translate(${x} ${y})`} d={STAR} fill="#FFE49A" stroke="#5B3A86" strokeWidth="1" />
          ))}
        </svg>
        <div className="hcloud c1 par" data-depth="-14" />
        <div className="hcloud c2 par" data-depth="18" />
        <div className="hcloud c3 par" data-depth="10" />
        {FLOWERS.map((f, i) => (
          <svg key={i} className="hflower" style={{ left: f.left, top: f.top, width: f.size, animationDelay: `${f.delay}s` }} viewBox="0 0 24 24">
            {PETALS.map(([cx, cy], j) => (
              <circle key={j} cx={cx.toFixed(1)} cy={cy.toFixed(1)} r="5.5" fill={f.color} stroke="#5B3A86" strokeWidth="1.4" />
            ))}
            <circle cx="12" cy="12" r="3.4" fill="#FFE49A" stroke="#5B3A86" strokeWidth="1.4" />
          </svg>
        ))}
        {SPARKS.map(([left, top, size, delay], i) => (
          <svg key={i} className="hspark" style={{ left, top, width: size, animationDelay: `${delay}s` }} viewBox="0 0 24 24">
            <path d={SPARKLE} fill="#fff" />
          </svg>
        ))}
      </div>

      <div className="wrap hero-grid">
        <div className="hero-text">
          <p className="hello fade d1">Hello, I&apos;m</p>
          <h1 className="name" aria-label={profile.fullName}>
            {firstLetters.map((l) => <Letter key={l.i} ch={l.ch} i={l.i} />)}
            <br />
            {lastLetters.map((l) => <Letter key={l.i} ch={l.ch} i={l.i} />)}
          </h1>
          <p className="hero-lead fade d2">{profile.intro}</p>
          <div className="fade d3" style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Button href="#work">View my work</Button>
            <Button href="#contact" variant="soft">Say hello</Button>
            <Button href={profile.cv} variant="butter">Download CV</Button>
          </div>
        </div>

        <div className="portrait-wrap fade d2">
          <div className="portrait par" data-depth="14">
            <div className="arch">
              <Image
                src="/images/profile-1.jpg"
                alt="Mikyla Caras smiling"
                fill
                priority
                sizes="(max-width: 760px) 280px, 340px"
                className="photo photo-hero"
              />
            </div>
            <div className="orbit" aria-hidden="true">
              {[["50%", "-4%", "#F7B6D2"], ["96%", "60%", "#BFE3F7"], ["-2%", "70%", "#D9C2F5"]].map(([left, top, c]) => (
                <span key={left} className="bfo" style={{ left, top }}>
                  <Butterfly top="#fff" bottom={c} />
                </span>
              ))}
            </div>
            <div className="badge-open">
              <span className="dot" />
              Open to internships
            </div>
          </div>
          {KEYCAPS.map((k) => (
            <button
              key={k.label}
              type="button"
              className="keycap par"
              data-depth={k.depth}
              style={{ ...k.style, background: k.color }}
              onClick={(e) => {
                sfx.click(1.2);
                const el = e.currentTarget;
                el.classList.add("down");
                setTimeout(() => el.classList.remove("down"), 120);
                burst(e.clientX, e.clientY, 6);
              }}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>

      <svg className="hdivider back" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 140V78C60 38 140 38 190 68C230 18 330 16 370 64C420 28 500 32 530 74C580 34 680 38 710 78C760 38 860 42 890 82C940 42 1040 38 1080 74C1120 28 1220 28 1260 70C1310 38 1400 42 1440 68V140Z" fill="#F7DDEE" />
      </svg>
      <svg className="hdivider front" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 90V54C80 22 170 26 220 56C280 18 390 20 430 58C490 24 600 26 640 60C700 24 820 24 860 60C920 26 1030 24 1080 58C1130 22 1240 24 1280 56C1330 30 1400 32 1440 48V90Z" fill="#EFE8F8" />
      </svg>
      <div className="scroll-cue" aria-hidden="true">
        <span />
        scroll
      </div>
    </header>
  );
}
