// Placeholder sounds made with the Web Audio API + a global mute switch.
// To use real sound files later, replace a function body with e.g.
//   new Audio("/sounds/click.mp3").play();

let ctx: AudioContext | null = null;
let muted = false;
const listeners = new Set<() => void>();

/** Tiny store so any component can read/flip the mute switch. */
export const soundStore = {
  get: () => muted,
  set(value: boolean) {
    muted = value;
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

function audio(): AudioContext | null {
  if (typeof window === "undefined" || muted) return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.15, delay = 0) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(dur: number, vol = 0.12, highpass = 2000) {
  const a = audio();
  if (!a) return;
  const len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = a.createBufferSource();
  const f = a.createBiquadFilter();
  const g = a.createGain();
  f.type = "highpass";
  f.frequency.value = highpass;
  g.gain.value = vol;
  src.buffer = buf;
  src.connect(f).connect(g).connect(a.destination);
  src.start();
}

export const sfx = {
  /** keyboard click; pitch > 1 = higher */
  click(pitch = 1) {
    noise(0.03, 0.18, 1800);
    tone(180 * pitch, 0.06, "triangle", 0.12);
  },
  pop() {
    tone(520, 0.08, "sine", 0.14);
    tone(780, 0.1, "sine", 0.1, 0.05);
  },
  chime() {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.7, "sine", 0.08, i * 0.09));
  },
  whoosh() {
    noise(0.6, 0.08, 600);
    [392, 523, 659, 784].forEach((f, i) => tone(f, 1.2, "triangle", 0.05, i * 0.12));
  },
  sparkle() {
    [1568, 2093, 2637].forEach((f, i) => tone(f, 0.25, "sine", 0.05, i * 0.05));
  },
};
