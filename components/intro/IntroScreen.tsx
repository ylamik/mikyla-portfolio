"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PALETTES, butterflySVG, rand } from "@/lib/butterfly";
import { sfx } from "@/lib/sfx";
import { profile } from "@/data/components/profile";

/** One butterfly in the swarm. Kept in a ref (not state) because it moves 60×/second. */
type Flyer = {
  el: HTMLDivElement;
  size: number;
  startX: number; startY: number; bendX: number; bendY: number; // curved entry path
  angle: number; spin: number; radius: number; wobble: number;   // circling the name
  t: number; delay: number; dur: number;                          // entry timing
  x: number; y: number; prevX: number; prevY: number; rot: number; vx: number; vy: number; opacity: number;
  mode: "in" | "orbit" | "out";
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const curve = (a: number, bend: number, b: number, t: number) => (1 - t) ** 2 * a + 2 * (1 - t) * t * bend + t * t * b;

/** Night-sky welcome screen: butterflies, a wishing-star arc, your name, and the Enter button. */
export default function IntroScreen() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const flock = useRef<Flyer[]>([]);
  const leaving = useRef(false);

  /* Enter: butterflies burst outward, then a circle opens in the middle to reveal the site */
  const enter = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    sfx.whoosh();

    const W = window.innerWidth;
    const H = window.innerHeight;
    for (const b of flock.current) {
      const away = Math.atan2(b.y - H / 2, b.x - W / 2);
      const speed = rand(160, 300);
      b.vx = Math.cos(away) * speed;
      b.vy = Math.sin(away) * speed - 60;
      b.mode = "out";
    }

    // let the page start its own entrance (runs once)
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      // jump to the very top before showing the page, whatever the browser restored
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = "";
      document.body.classList.remove("locked");
      document.body.classList.add("entered"); // hero, navbar etc. animate in from this class
      window.dispatchEvent(new Event("intro:done"));
    };
    const finish = () => {
      reveal();
      setVisible(false);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return finish();
    setTimeout(reveal, 350); // start a little before the circle finishes opening

    const root = rootRef.current;
    const maxRadius = Math.hypot(W, H) / 2 + 60;
    const t0 = performance.now();
    const iris = (now: number) => {
      const k = Math.min(1, (now - t0) / 1300);
      const r = Math.pow(k, 2.2) * maxRadius;
      const mask = `radial-gradient(circle at 50% 50%, transparent ${r}px, #000 ${r + 50}px)`;
      if (root) {
        root.style.maskImage = mask;
        root.style.webkitMaskImage = mask;
      }
      if (k < 1) requestAnimationFrame(iris);
      else finish();
    };
    requestAnimationFrame(iris);
  }, []);

  useEffect(() => {
    const sky = skyRef.current;
    if (!sky) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = window.innerWidth;
    const H = window.innerHeight;
    document.body.classList.add("locked"); // no scrolling until the visitor enters

    // always start at the top after a refresh (browsers normally jump back to where you were)
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = "";

    for (let i = 0; i < 70; i++) {
      const s = document.createElement("span");
      s.className = "istar";
      s.style.left = `${rand(0, 100)}%`;
      s.style.top = `${rand(0, 100)}%`;
      s.style.animationDelay = `${rand(-3, 0)}s`;
      sky.appendChild(s);
    }

    const count = reduce ? 0 : W < 700 ? 16 : 30;
    flock.current = Array.from({ length: count }, (_, i) => {
      const pal = PALETTES[i % PALETTES.length];
      const size = rand(24, 52);
      const el = document.createElement("div");
      el.className = "bf";
      el.style.width = `${size}px`;
      el.style.setProperty("--fl", `${rand(0.18, 0.34).toFixed(2)}s`);
      el.style.filter = `drop-shadow(0 0 ${size / 4}px ${pal[2]})`;
      el.innerHTML = butterflySVG(pal[0], pal[1]);
      sky.appendChild(el);
      const side = Math.floor(rand(0, 4));
      const startX = side === 1 ? W + 80 : side === 3 ? -80 : rand(0, W);
      const startY = side === 0 ? -80 : side === 2 ? H + 80 : rand(0, H);
      return {
        el, size, startX, startY, bendX: rand(0, W), bendY: rand(0, H),
        angle: (i / count) * Math.PI * 2, spin: rand(0.35, 0.6) * (i % 2 ? 1 : -1),
        radius: Math.min(W, H) * rand(0.3, 0.46), wobble: rand(0, 6),
        t: 0, delay: rand(0, 1.2), dur: rand(1.6, 2.6),
        x: startX, y: startY, prevX: startX, prevY: startY, rot: 0, vx: 0, vy: 0, opacity: 1,
        mode: "in" as const,
      };
    });

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      for (const b of flock.current) {
        b.angle += b.spin * dt;
        const ox = cx + Math.cos(b.angle) * b.radius;
        const oy = cy + Math.sin(b.angle) * b.radius * 0.62 + Math.sin(now / 400 + b.wobble) * 8;
        if (b.mode === "in") {
          b.t += dt;
          const k = Math.max(0, Math.min(1, (b.t - b.delay) / b.dur));
          b.x = curve(b.startX, b.bendX, ox, ease(k));
          b.y = curve(b.startY, b.bendY, oy, ease(k));
          if (k >= 1) b.mode = "orbit";
        } else if (b.mode === "orbit") {
          b.x = ox;
          b.y = oy;
        } else {
          b.vx *= 1.05;
          b.vy *= 1.05;
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          b.opacity = Math.max(0, b.opacity - dt * 0.6);
        }
        const dx = b.x - b.prevX;
        const dy = b.y - b.prevY;
        if (dx * dx + dy * dy > 0.2) {
          let diff = Math.atan2(dy, dx) + Math.PI / 2 - b.rot;
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          b.rot += diff * 0.15;
        }
        b.prevX = b.x;
        b.prevY = b.y;
        b.el.style.transform = `translate3d(${b.x - b.size / 2}px,${b.y - b.size * 0.4}px,0) rotate(${b.rot}rad)`;
        b.el.style.opacity = String(b.opacity);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      sky.replaceChildren();
      flock.current = [];
      document.body.classList.remove("locked");
    };
  }, [enter]);

  if (!visible) return null;

  return (
    <div id="intro" ref={rootRef} role="dialog" aria-modal="true" aria-label="Welcome">
      <svg className="ribbon" viewBox="0 0 300 500" style={{ top: -80, left: -120 }} aria-hidden="true">
        <defs>
          <linearGradient id="irb" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F9C6E4" />
            <stop offset=".5" stopColor="#B9A2F0" />
            <stop offset="1" stopColor="#FFF0B8" />
          </linearGradient>
        </defs>
        <path d="M220 0C140 80 280 160 200 240C120 320 260 400 190 500" fill="none" stroke="url(#irb)" strokeWidth="60" strokeLinecap="round" />
      </svg>
      <svg className="ribbon" viewBox="0 0 300 500" style={{ bottom: -120, right: -120, transform: "rotate(180deg)" }} aria-hidden="true">
        <path d="M220 0C140 80 280 160 200 240C120 320 260 400 190 500" fill="none" stroke="url(#irb)" strokeWidth="60" strokeLinecap="round" />
      </svg>

      <div ref={skyRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true" />

      <div className="intro-center">
        <svg className="intro-arc" viewBox="0 0 900 320" aria-hidden="true">
          <defs>
            <linearGradient id="arcGrad" x1="0" x2="1">
              <stop offset="0" stopColor="#FFE9A8" stopOpacity="0" />
              <stop offset=".3" stopColor="#FFF6DA" />
              <stop offset=".7" stopColor="#FBD3F0" />
              <stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path id="arcPath" d="M40 300C180 10 720 10 860 300" />
          <circle r="7" fill="#fff" opacity="0" style={{ filter: "drop-shadow(0 0 10px #FFE38A) drop-shadow(0 0 20px #FFE38A)" }}>
            <set attributeName="opacity" to="1" begin="0.5s" />
            <animateMotion dur="2.2s" begin="0.5s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".6 0 .3 1">
              <mpath href="#arcPath" />
            </animateMotion>
            <animate attributeName="opacity" from="1" to="0" begin="2.7s" dur=".5s" fill="freeze" />
          </circle>
        </svg>
        <p className="intro-hello">welcome to the little world of</p>
        <h1 className="intro-name">{profile.fullName}</h1>
        <p className="intro-sub">{profile.tagline}</p>
        <button id="enterBtn" type="button" onClick={enter} autoFocus>
          Enter ✦
        </button>
        <p className="intro-hint">best with sound on</p>
      </div>
    </div>
  );
}
