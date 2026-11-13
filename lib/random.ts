// A "seeded" random number generator: the same seed always gives the same numbers.
// We use it for decorations that are drawn on the server AND in the browser,
// so both sides produce identical HTML (otherwise React warns about a hydration mismatch).
export function seeded(seed: number) {
  let a = seed >>> 0;
  return (min = 0, max = 1) => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    return min + r * (max - min);
  };
}
