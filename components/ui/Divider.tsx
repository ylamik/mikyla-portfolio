const Star = () => (
  <svg viewBox="0 0 24 24" width="18" aria-hidden="true">
    <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" fill="#FFE49A" stroke="#5B3A86" strokeWidth="1.2" />
  </svg>
);

const Rosebud = () => (
  <svg viewBox="0 0 60 40" width="58" aria-hidden="true">
    <path d="M4 30C14 26 22 26 30 30C38 26 46 26 56 30" fill="none" stroke="#7DB892" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="14" cy="26" rx="6" ry="3" fill="#A6DDB5" transform="rotate(-25 14 26)" />
    <ellipse cx="46" cy="26" rx="6" ry="3" fill="#A6DDB5" transform="rotate(25 46 26)" />
    <circle cx="30" cy="20" r="11" fill="#B07FE0" stroke="#5B3A86" strokeWidth="2.5" />
    <path d="M24 20A6 6 0 1 1 34 24A4 4 0 1 1 28 17" fill="none" stroke="#E3C8F7" strokeWidth="2" />
  </svg>
);

const Wings = () => (
  <svg viewBox="0 0 100 80" width="46" aria-hidden="true">
    <path d="M50 38C42 8 6-2 8 24C10 40 34 44 50 40Z" fill="#E6D6F8" stroke="#5B3A86" strokeWidth="3" />
    <path d="M50 42C36 46 14 58 24 72C34 82 48 62 50 44Z" fill="#F7B6D2" stroke="#5B3A86" strokeWidth="3" />
    <path d="M50 38C58 8 94-2 92 24C90 40 66 44 50 40Z" fill="#E6D6F8" stroke="#5B3A86" strokeWidth="3" />
    <path d="M50 42C64 46 86 58 76 72C66 82 52 62 50 44Z" fill="#F7B6D2" stroke="#5B3A86" strokeWidth="3" />
  </svg>
);

/** Decorative line between sections: dashes + stars + butterfly (+ roses). */
export default function Divider({ variant = "simple" }: { variant?: "simple" | "rose" }) {
  return (
    <div className="divider rv" aria-hidden="true">
      <span className="line" />
      <Star />
      {variant === "rose" && <Rosebud />}
      <Wings />
      {variant === "rose" && <Rosebud />}
      <Star />
      <span className="line" />
    </div>
  );
}
