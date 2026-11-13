import type { ReactNode } from "react";
import FlipCard from "@/components/ui/Flipcard";
import MemoryReel from "@/components/ui/MemoryReel";
import Butterfly from "@/components/ui/Butterfly";
import { highlights, type Highlight } from "@/data/components/sports";
import { seeded } from "@/lib/random";

const ICON_PROPS = { viewBox: "0 0 48 48", width: 74, height: 74, fill: "none", stroke: "#FFE9A8", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

const ICONS: Record<Highlight["id"], ReactNode> = {
  badminton: (
    <svg {...ICON_PROPS}>
      <path d="M17 8L24 30L31 8" /><path d="M10 12L22 30" /><path d="M38 12L26 30" /><path d="M14 10C20 6 28 6 34 10" /><circle cx="24" cy="36" r="6" />
    </svg>
  ),
  academics: (
    <svg {...ICON_PROPS}>
      <path d="M4 18L24 9L44 18L24 27Z" /><path d="M12 22V32C16 36 32 36 36 32V22" /><path d="M44 18V30" /><circle cx="44" cy="32" r="2" />
    </svg>
  ),
};

// twinkling gold stars scattered over the night sky (seeded = same on server and browser)
const rnd = seeded(2026);
const STARS = Array.from({ length: 26 }, () => ({ left: rnd(2, 98), top: rnd(3, 85), size: rnd(6, 16), delay: rnd(-3, 0) }));

/** Chapter four: night sky + sports flip cards. */
export default function Beyond() {
  return (
    <section className="night" id="beyond">
      <svg className="wave-top" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0V40C200 90 420 90 720 50C1000 12 1240 20 1440 60V0Z" fill="#FFFBF2" />
      </svg>
      {STARS.map((s, i) => (
        <span key={i} className="nstar" aria-hidden="true" style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
      ))}

      <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
        <span className="gold-bf" aria-hidden="true">
          <Butterfly top="#FFF3C4" bottom="#FFE596" body="#C9963B" />
        </span>
        <p className="eyebrow" style={{ color: "#FFE9A8", fontSize: "clamp(40px,5vw,58px)" }}>chapter four ~ beyond the screen</p>
        <h2 className="h2" style={{ color: "#fff" }}>On the court and in the classroom</h2>
        <p className="lead" style={{ color: "#F1E8FF", maxWidth: 560, margin: "12px auto 0" }}>
          Away from Figma and the terminal, this is where you&apos;ll find me. Flip a card.
        </p>
        <div className="flips" style={{ maxWidth: 680, marginInline: "auto" }}>
          {highlights.map((s) => (
            <FlipCard key={s.id} title={s.name} back={s.line} items={s.items} icon={ICONS[s.id]} />
          ))}
        </div>
        <MemoryReel />
      </div>

      <svg className="wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 120V60C240 0 480 0 720 40C960 80 1200 80 1440 30V120Z" fill="#F8F3FC" />
      </svg>
    </section>
  );
}
