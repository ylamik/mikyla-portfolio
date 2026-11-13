import { seeded } from "@/lib/random";

// Builds the rose as one SVG string. Each petal is a <g class="petal"> that CSS
// rotates/scales from a closed bud (default) to a full bloom (when .rose-sec has .bloom).
function buildRose(): string {
  const rnd = seeded(7);
  const PETAL = "M0 0C-34-8-60-50-54-90C-50-114-28-124-12-116C-6-124 6-124 12-116C28-124 50-114 54-90C60-50 34-8 0 0Z";
  const SHINE = "M-6-14C-26-30-40-62-36-88C-34-102-22-108-14-104C-18-80-14-44-6-14Z";
  const CURL = "M-48-88C-46-108-26-118-12-110M12-110C26-118 46-108 48-88";
  const VEIN = "M0-6C-2-40 0-70 0-104";
  const rings = [
    { n: 5, s: 1.22, off: 0, c: ["#5A2794", "#A273DD", "#DCC7F8"] },
    { n: 5, s: 1.02, off: 36, c: ["#4F2189", "#9364D4", "#D0B5F4"] },
    { n: 5, s: 0.82, off: 12, c: ["#47207E", "#8858CA", "#C7A8F0"] },
    { n: 4, s: 0.62, off: 55, c: ["#3E1B70", "#7D4CBF", "#BC99EB"] },
  ];

  let s = `<defs>
<radialGradient id="halo"><stop offset="0" stop-color="#FFF3C4" stop-opacity=".9"/><stop offset=".4" stop-color="#E9D9FC" stop-opacity=".75"/><stop offset="1" stop-color="#E9D9FC" stop-opacity="0"/></radialGradient>
<radialGradient id="core"><stop offset="0" stop-color="#2A1046"/><stop offset=".7" stop-color="#4A2276"/><stop offset="1" stop-color="#6A3FA0"/></radialGradient>
<radialGradient id="shine" cx=".3" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="leafG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#5E9C7A"/><stop offset="1" stop-color="#B9E0C4"/></linearGradient>
<linearGradient id="cupG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#3A176A"/><stop offset=".6" stop-color="#8352C4"/><stop offset="1" stop-color="#D4B8F5"/></linearGradient>
<filter id="pshadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#2A1046" flood-opacity=".32"/></filter>
<filter id="soft"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2.5"/></filter>`;
  rings.forEach((r, i) => {
    s += `<linearGradient id="pg${i}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${r.c[0]}"/><stop offset=".5" stop-color="${r.c[1]}"/><stop offset="1" stop-color="${r.c[2]}"/></linearGradient>`;
  });
  s += `</defs>`;

  // stem + leaves (visible while it's a bud)
  s += `<g class="stem"><path d="M0 20C-8 80 10 130 0 210" stroke="#7DB892" stroke-width="9" fill="none" stroke-linecap="round"/>
<path d="M2 110C30 88 62 94 72 110C52 128 22 128 2 110Z" fill="url(#leafG)"/><path d="M4 110C30 106 50 108 70 110" stroke="#4E8A65" stroke-width="1.5" fill="none" opacity=".6"/>
<path d="M-2 150C-30 130 -60 136 -68 152C-48 168 -20 166 -2 150Z" fill="url(#leafG)"/><path d="M-4 150C-28 148 -48 150 -66 152" stroke="#4E8A65" stroke-width="1.5" fill="none" opacity=".6"/>
<g transform="translate(0 6)"><path d="M0 0C-14 6-22 18-20 30L0 14Z" fill="#7DB892"/><path d="M0 0C14 6 22 18 20 30L0 14Z" fill="#6FA584"/></g></g>`;

  // light rays + glow
  s += `<g class="rose-rays">${Array.from({ length: 12 }, (_, i) => `<ellipse rx="6" ry="170" fill="#fff" opacity=".18" transform="rotate(${i * 30})"/>`).join("")}</g>`;
  s += `<circle class="rose-halo" r="175" fill="url(#halo)"/>`;
  s += `<g class="rose-flower">`;
  s += `<g class="bloom-leaves">${[[205, 1], [335, 1], [270, 0.8]].map(([a, sc]) => `<g transform="rotate(${a}) scale(${sc})"><path d="M0 60C-30 90-30 140 0 170C30 140 30 90 0 60Z" fill="url(#leafG)" opacity=".92"/><path d="M0 66V166M0 100L-14 88M0 120L14 106M0 140L-12 130" stroke="#4E8A65" stroke-width="1.6" fill="none" opacity=".55"/></g>`).join("")}</g>`;

  rings.forEach((r, ri) => {
    s += `<g filter="url(#pshadow)">`;
    for (let k = 0; k < r.n; k++) {
      const a = (360 / r.n) * k + r.off - 180 + rnd(-9, 9);
      const d = (0.05 * k + ri * 0.12).toFixed(2);
      s += `<g class="petal" style="--a:${a.toFixed(1)}deg;--s:${(r.s * rnd(0.93, 1.06)).toFixed(3)};--d:${d}s"><g filter="url(#soft)">
<path d="${PETAL}" fill="url(#pg${ri})"/><path d="${SHINE}" fill="url(#shine)"/>
<path d="${VEIN}" stroke="${r.c[0]}" stroke-opacity=".25" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="${CURL}" stroke="#fff" stroke-opacity=".38" stroke-width="2.5" fill="none" stroke-linecap="round"/></g></g>`;
    }
    s += `</g>`;
  });

  // curled centre + golden stamens
  const cup = [[1, 0], [0.82, 100], [0.66, 200], [0.5, 300], [0.36, 40]]
    .map(([sc, rot]) => `<g transform="rotate(${rot}) scale(${sc})"><path d="M-30 4C-34-22-12-38 10-34C28-30 36-12 30 6C18-4 2-8-12-4C-20-2-26 2-30 4Z" fill="url(#cupG)"/><path d="M-26-6C-22-26-2-34 14-30" stroke="#fff" stroke-opacity=".65" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`)
    .join("");
  const stamens = Array.from({ length: 22 }, (_, i) => {
    const rr = 2 + i * 0.42;
    const t = i * 2.4;
    return `<circle cx="${(Math.cos(t) * rr).toFixed(1)}" cy="${(Math.sin(t) * rr).toFixed(1)}" r="${(1.9 - i * 0.04).toFixed(2)}" fill="${i % 3 ? "#F2C75C" : "#FFE9A8"}"/>`;
  }).join("");
  s += `<g class="rose-core" filter="url(#pshadow)"><g transform="scale(1.55)">${cup}<circle r="11" fill="url(#core)"/>${stamens}</g></g>`;

  // dewdrops
  s += `<g class="dew">${[[-70, -40, 4], [52, -78, 3.2], [88, 22, 3.6], [-30, 78, 3], [16, -112, 2.6]]
    .map(([x, y, r]) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#fff" fill-opacity=".55" stroke="#fff" stroke-width="1"/><circle cx="${-r * 0.35}" cy="${-r * 0.35}" r="${r * 0.35}" fill="#fff"/></g>`)
    .join("")}</g>`;
  s += `</g>`;

  // little magenta bud sprig
  s += `<g class="sprig" transform="translate(-118 -122) rotate(-20)"><path d="M0 0C6 18 14 30 30 44" stroke="#8A6A9E" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="-2" cy="-4" rx="7" ry="10" fill="#C2559E"/><ellipse cx="-4" cy="-8" rx="2.5" ry="4" fill="#fff" opacity=".4"/><ellipse cx="14" cy="22" rx="8" ry="11" fill="#A9408A" transform="rotate(-30 14 22)"/><path d="M-7 4L-2 -1L3 4" fill="#6FA584"/></g>`;
  return s;
}

const ROSE = buildRose();

export default function Rose() {
  return <svg viewBox="-170 -170 340 390" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ROSE }} />;
}
