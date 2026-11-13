// The clicky keyboard. Each key: what it shows, which real key triggers it,
// its color, how wide it is (1 = normal) and the message it types out.
export type SkillKey = {
  label: string;
  hotkey: string; // "Enter", " " (space) or a single letter
  color: string;
  width: number;
  info: string;
};

export const keyboard: SkillKey[][] = [
  [
    { label: "♥", hotkey: "h", color: "var(--color-pink)", width: 1, info: "Fun fact: I design every project in Figma before I write any code." },
    { label: "TS", hotkey: "t", color: "var(--color-sky)", width: 1, info: "TypeScript — my go-to for React and Next.js projects like Petalpace." },
    { label: "JS", hotkey: "j", color: "var(--color-butter)", width: 1, info: "JavaScript — the language underneath everything I build for the web." },
    { label: "PY", hotkey: "p", color: "var(--color-mint)", width: 1, info: "Python — powers VERITAS, my deepfake detection thesis." },
    { label: "SQL", hotkey: "s", color: "var(--color-lav)", width: 1, info: "SQL / PostgreSQL — certified Data Engineer Associate (DataCamp, 2026)." },
    { label: "QA", hotkey: "q", color: "#FBC8DE", width: 1, info: "Quality assurance — responsive testing, GitHub Issues, and 100+ server-side automated tests on Petalpace (logins, permissions, saving data)." },
    { label: "hi!", hotkey: "i", color: "var(--color-cream)", width: 1.6, info: "Hi! I'm Mikyla. Thanks for pressing keys on my keyboard." },
  ],
  [
    { label: "React", hotkey: "r", color: "var(--color-lav)", width: 1.2, info: "React — Petalpace and the Novateur ticketing system." },
    { label: "Next", hotkey: "n", color: "#FBC8DE", width: 1, info: "Next.js — Agila Studios, Novateur and the VERITAS web app." },
    { label: "Node", hotkey: "o", color: "var(--color-butter)", width: 1, info: "Node.js — Petalpace's backend, with real-time sync and email reminders." },
    { label: "Tailwind", hotkey: "w", color: "var(--color-sky)", width: 1.3, info: "Tailwind CSS — how I style almost everything." },
    { label: "UI/UX", hotkey: "f", color: "var(--color-mint)", width: 1.2, info: "UI/UX — user flows, wireframes and prototypes, from the Novateur ticketing system to the VERITAS web app." },
    { label: "PyTorch", hotkey: "y", color: "var(--color-pink)", width: 1.2, info: "PyTorch — training EfficientNet-B7 with ASPP segmentation." },
    { label: "Figma", hotkey: "g", color: "var(--color-lav2)", width: 1, info: "Figma — wireframes, prototypes and UI design for every project." },
  ],
  [
    { label: "Git", hotkey: "k", color: "var(--color-peach)", width: 1, info: "Git & GitHub — feature branches, pull requests and issue tracking." },
    { label: "VS Code", hotkey: "a", color: "var(--color-sky)", width: 1.1, info: "VS Code — where all my code gets written (and debugged)." },
    { label: "Vercel", hotkey: "v", color: "var(--color-lav)", width: 1, info: "Vercel — hosting for the Agila Studios redesign." },
    { label: "Linux", hotkey: "l", color: "var(--color-mint)", width: 1, info: "Ubuntu — Petalpace runs on our Vultr VPS with key-only SSH, reached through a DuckDNS domain." },
    { label: "nginx", hotkey: "x", color: "#FBC8DE", width: 1, info: "nginx — reverse proxy and HTTPS for Petalpace." },
    { label: "Kaggle", hotkey: "e", color: "var(--color-sky)", width: 1, info: "Kaggle — where I ran VERITAS experiments on OpenForensics." },
    { label: "hire me ↵", hotkey: "Enter", color: "var(--color-butter)", width: 2, info: "Open to internships and junior roles in frontend, UI/UX or QA. The envelope at the bottom is for you ✉" },
  ],
  [
    { label: "UST", hotkey: "u", color: "var(--color-lav)", width: 1, info: "University of Santo Tomas — BS Computer Science, Data Science. Expected 2027." },
    { label: "CSS", hotkey: "c", color: "#FBC8DE", width: 1, info: "Computer Science Society — Exec. Assistant to the PRO (2025–26), Academics Committee (2024–25)." },
    { label: "✦  space  ✦", hotkey: " ", color: "var(--color-cream)", width: 4.2, info: "Sparkle burst! ✦" },
    { label: "★", hotkey: "m", color: "var(--color-butter)", width: 1, info: "Certified: Data Engineer Associate (DataCamp) and Responsive Web Design (freeCodeCamp)." },
    { label: "HTML", hotkey: "z", color: "var(--color-sky)", width: 1, info: "HTML & CSS — the very first thing I learned to build with." },
  ],
];
