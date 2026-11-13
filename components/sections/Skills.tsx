"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Key from "@/components/ui/Key";
import { keyboard, type SkillKey } from "@/data/components/skills";
import { burst } from "@/lib/flutter";
import { sfx } from "@/lib/sfx";

const WELCOME = "Press any key ✦ (or type on your real keyboard)";

/** Chapter three: a clicky pastel keyboard. Each key types a fact about a skill. */
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const typeTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [icon, setIcon] = useState({ text: "hi", color: "var(--color-lav)" });
  const [count, setCount] = useState(0);
  const [downKey, setDownKey] = useState<string | null>(null);

  // typewriter: writes straight into the screen text (no React re-render per letter = smooth on phones)
  const typeOut = useCallback((str: string) => {
    const el = textRef.current;
    if (!el) return;
    if (typeTimer.current) clearInterval(typeTimer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = str;
      return;
    }
    let i = 0;
    el.textContent = "";
    typeTimer.current = setInterval(() => {
      i += 2; // two letters per tick
      el.textContent = str.slice(0, i);
      if (i >= str.length && typeTimer.current) clearInterval(typeTimer.current);
    }, 24);
  }, []);

  useEffect(() => {
    typeOut(WELCOME);
    return () => {
      if (typeTimer.current) clearInterval(typeTimer.current);
    };
  }, [typeOut]);

  // stable function so the keys (memo) don't all redraw on every press
  const press = useCallback(
    (skill: SkillKey, row: number, col: number) => {
      setDownKey(skill.label);
      setTimeout(() => setDownKey((k) => (k === skill.label ? null : k)), 130);
      sfx.click(0.8 + row * 0.15 + col * 0.04);
      setCount((c) => c + 1);
      setIcon({
        text: skill.label === "♥" ? "♥︎" : skill.label.replace(/[✦↵]/g, "").trim().slice(0, 4) || "✦",
        color: skill.color,
      });
      typeOut(skill.info);

      if (skill.hotkey === " " || skill.label === "♥") {
        const el = keyboardRef.current?.querySelector<HTMLElement>(`[aria-label="${skill.label === "♥" ? "heart" : skill.label}"]`);
        const r = el?.getBoundingClientRect();
        if (r) burst(r.left + r.width / 2, r.top, skill.hotkey === " " ? 22 : 8);
        if (skill.hotkey === " ") sfx.sparkle();
      }
    },
    [typeOut],
  );

  // let people type on their real keyboard while this section is on screen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!document.body.classList.contains("entered") || document.querySelector(".lightbox")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const r = sectionRef.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return;
      const wanted = e.key === "Enter" ? "enter" : e.key.toLowerCase();
      keyboard.forEach((row, ri) =>
        row.forEach((k, ki) => {
          if (k.hotkey.toLowerCase() === wanted) {
            e.preventDefault();
            press(k, ri, ki);
          }
        }),
      );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  return (
    <section className="kb-sec" id="skills" ref={sectionRef}>
      <div className="lace" aria-hidden="true" />
      <div className="lace-dots" aria-hidden="true" />
      <div className="wrap">
        <div className="kb-head rv">
          <p className="eyebrow">chapter three ~ my toolkit</p>
          <h2 className="h2">Press a key, any key</h2>
          <p className="lead" style={{ margin: "10px auto 0", maxWidth: 560 }}>
            Each key is something I use. Click them or type on your real keyboard. Space bar is a surprise.
          </p>
        </div>

        <div className="screen rv" aria-live="polite">
          <div className="ico" style={{ background: icon.color }}>{icon.text}</div>
          <div className="txt">
            <span ref={textRef} />
            <span className="caret" />
          </div>
        </div>

        <div className="kb rv" ref={keyboardRef}>
          {keyboard.map((row, ri) => (
            <div key={ri} className="kb-row">
              {row.map((k, ki) => (
                <Key key={k.label} skill={k} row={ri} col={ki} down={downKey === k.label} onPress={press} />
              ))}
            </div>
          ))}
        </div>
        <p className="kb-foot">
          keys pressed: <b>{count}</b>
        </p>
      </div>
    </section>
  );
}
