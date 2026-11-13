// The butterfly "engine" for the whole page (outside the intro):
//  - burst(x, y): a puff of butterflies flying out from a point (clicks, rose, space bar…)
//  - spawnAmbient(): a few butterflies that wander the screen and flee from the cursor
// It moves plain DOM elements in one requestAnimationFrame loop — much faster than React state.
import { PALETTES, butterflySVG, rand, type Palette } from "./butterfly";

type Fly = {
  el: HTMLDivElement;
  size: number;
  x: number; y: number; px: number; py: number; ang: number; op: number;
  kind: "pop" | "ambient";
  vx: number; vy: number; life: number; max: number; // pop
  heading: number; speed: number;                      // ambient
};

const flies: Fly[] = [];
const mouse = { x: -999, y: -999 };
let running = false;
let last = 0;
let ambientOn = false;

const isPhone = () => typeof window !== "undefined" && window.matchMedia("(hover: none), (max-width: 760px)").matches;

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function trackMouse(x: number, y: number) {
  mouse.x = x;
  mouse.y = y;
}

function make(size: number, pal: Palette, z: number, kind: Fly["kind"]): Fly {
  const el = document.createElement("div");
  el.className = "bf";
  el.style.width = `${size}px`;
  el.style.zIndex = String(z);
  el.style.setProperty("--fl", `${rand(0.18, 0.34).toFixed(2)}s`);
  if (!isPhone()) el.style.filter = `drop-shadow(0 0 ${size / 4}px ${pal[2]})`; // glow is costly on phones
  el.innerHTML = butterflySVG(pal[0], pal[1]);
  document.body.appendChild(el);
  return { el, size, x: 0, y: 0, px: 0, py: 0, ang: 0, op: 1, kind, vx: 0, vy: 0, life: 0, max: 2, heading: 0, speed: 0 };
}

function place(b: Fly) {
  const dx = b.x - b.px;
  const dy = b.y - b.py;
  if (dx * dx + dy * dy > 0.2) {
    let diff = Math.atan2(dy, dx) + Math.PI / 2 - b.ang;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    b.ang += diff * 0.15;
  }
  b.px = b.x;
  b.py = b.y;
  b.el.style.transform = `translate3d(${b.x - b.size / 2}px,${b.y - b.size * 0.4}px,0) rotate(${b.ang}rad)`;
  b.el.style.opacity = String(b.op);
}

function loop(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const W = window.innerWidth;
  const H = window.innerHeight;

  for (let i = flies.length - 1; i >= 0; i--) {
    const b = flies[i];
    if (b.kind === "pop") {
      b.life += dt;
      b.vx *= 0.97;
      b.vy = b.vy * 0.97 - 30 * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.op = Math.max(0, 1 - b.life / b.max);
      place(b);
      if (b.life > b.max) {
        b.el.remove();
        flies.splice(i, 1);
      }
    } else {
      b.heading += rand(-1.2, 1.2) * dt * 2;
      let vx = Math.cos(b.heading) * b.speed;
      let vy = Math.sin(b.heading) * b.speed + Math.sin(now / 300 + b.size) * 12;
      const dx = b.x - mouse.x;
      const dy = b.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < 170 && d > 0) {
        const push = ((170 - d) / 170) * 520;
        vx += (dx / d) * push;
        vy += (dy / d) * push;
        b.heading = Math.atan2(dy, dx);
      }
      b.x += vx * dt;
      b.y += vy * dt;
      let wrapped = false;
      if (b.x < -60) { b.x = W + 50; wrapped = true; }
      if (b.x > W + 60) { b.x = -50; wrapped = true; }
      if (b.y < -60) { b.y = H + 50; wrapped = true; }
      if (b.y > H + 60) { b.y = -50; wrapped = true; }
      if (wrapped) { b.px = b.x; b.py = b.y; }
      place(b);
    }
  }

  if (flies.length) requestAnimationFrame(loop);
  else running = false;
}

function start() {
  if (running) return;
  running = true;
  last = performance.now();
  requestAnimationFrame(loop);
}

/** Puff of butterflies flying out of a point on the screen. */
export function burst(x: number, y: number, n = 12) {
  if (prefersReduced()) return;
  if (isPhone()) n = Math.ceil(n / 2);
  for (let i = 0; i < n; i++) {
    const b = make(rand(18, 34), PALETTES[Math.floor(rand(0, PALETTES.length))], 95, "pop");
    const a = rand(0, Math.PI * 2);
    const s = rand(260, 520);
    b.x = b.px = x;
    b.y = b.py = y;
    b.vx = Math.cos(a) * s;
    b.vy = Math.sin(a) * s - 120;
    b.max = rand(1.4, 2.2);
    flies.push(b);
  }
  start();
}

/** A few butterflies that wander around and avoid the cursor. Safe to call more than once. */
export function spawnAmbient() {
  if (ambientOn || prefersReduced()) return;
  ambientOn = true;
  const n = window.innerWidth < 700 ? 3 : 6;
  for (let i = 0; i < n; i++) {
    const b = make(rand(26, 40), PALETTES[[0, 2, 3, 4][i % 4]], 4, "ambient");
    b.x = b.px = rand(0, window.innerWidth);
    b.y = b.py = rand(0, window.innerHeight);
    b.heading = rand(0, Math.PI * 2);
    b.speed = rand(40, 70);
    b.op = 0.9;
    flies.push(b);
  }
  start();
}

/** Remove the wandering butterflies (used when the effects layer unmounts). */
export function clearAmbient() {
  for (let i = flies.length - 1; i >= 0; i--) {
    if (flies[i].kind === "ambient") {
      flies[i].el.remove();
      flies.splice(i, 1);
    }
  }
  ambientOn = false;
}
