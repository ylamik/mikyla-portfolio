// Shared butterfly drawing + color palettes, for butterflies created with plain DOM
// (intro swarm, bursts, wandering butterflies). For React, use <Butterfly /> instead.

/** [wing top, wing bottom, glow] */
export type Palette = [string, string, string];

export const PALETTES: Palette[] = [
  ["#FFFFFF", "#F3E8FF", "#C9A9EE"], // white
  ["#FFF3C4", "#FFE596", "#FFD86B"], // gold
  ["#FBD3E6", "#F7B6D2", "#EC8DBA"], // pink
  ["#E6F4FD", "#BFE3F7", "#8FCDEF"], // blue
  ["#F1E6FF", "#D9C2F5", "#B79BE3"], // lavender
];

/** SVG markup for one butterfly. `.wl` / `.wr` are the wings (they flap via CSS). */
export function butterflySVG(top: string, bottom: string, body = "#5B3A86"): string {
  return `<svg viewBox="0 0 100 80" aria-hidden="true"><g class="wl"><path d="M50 38C42 8 6-2 8 24C10 40 34 44 50 40Z" fill="${top}"/><path d="M50 42C36 46 14 58 24 72C34 82 48 62 50 44Z" fill="${bottom}"/></g><g class="wr"><path d="M50 38C58 8 94-2 92 24C90 40 66 44 50 40Z" fill="${top}"/><path d="M50 42C64 46 86 58 76 72C66 82 52 62 50 44Z" fill="${bottom}"/></g><ellipse cx="50" cy="42" rx="2.2" ry="11" fill="${body}" opacity=".55"/></svg>`;
}

export const rand = (min: number, max: number) => min + Math.random() * (max - min);
