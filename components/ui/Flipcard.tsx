"use client";

import { useState, type ReactNode } from "react";
import { sfx } from "@/lib/sfx";

type Props = { title: string; back?: string; items?: string[]; icon: ReactNode };

/** A card that flips over when clicked. */
export default function FlipCard({ title, back, items, icon }: Props) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      className={`flip${flipped ? " on" : ""}`}
      aria-pressed={flipped}
      aria-label={`${title} card, flip`}
      onClick={() => {
        setFlipped((f) => !f);
        sfx.pop();
      }}
    >
      <span className="inner">
        <span className="face-f">
          {icon}
          <h3>{title}</h3>
          <span className="tap">tap to flip ✦</span>
        </span>
        <span className="face-b">
          <h3>{title}</h3>
          {items ? (
            <ul className="flip-list">
              {items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          ) : (
            <p>{back}</p>
          )}
        </span>
      </span>
    </button>
  );
}
