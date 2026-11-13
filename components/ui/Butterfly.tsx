import type { CSSProperties } from "react";

type Props = {
  top?: string;
  bottom?: string;
  body?: string;
  className?: string;
  style?: CSSProperties;
};

/** A butterfly drawing. Its wings (.wl / .wr) flap when it sits inside a `.bf`-style wrapper. */
export default function Butterfly({ top = "#fff", bottom = "#F7B6D2", body = "#5B3A86", className, style }: Props) {
  return (
    <svg viewBox="0 0 100 80" aria-hidden="true" className={className} style={style}>
      <g className="wl">
        <path d="M50 38C42 8 6-2 8 24C10 40 34 44 50 40Z" fill={top} />
        <path d="M50 42C36 46 14 58 24 72C34 82 48 62 50 44Z" fill={bottom} />
      </g>
      <g className="wr">
        <path d="M50 38C58 8 94-2 92 24C90 40 66 44 50 40Z" fill={top} />
        <path d="M50 42C64 46 86 58 76 72C66 82 52 62 50 44Z" fill={bottom} />
      </g>
      <ellipse cx="50" cy="42" rx="2.2" ry="11" fill={body} opacity=".55" />
    </svg>
  );
}
