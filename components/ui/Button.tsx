import type { ReactNode } from "react";

type Props = {
  href: string;
  variant?: "primary" | "soft" | "butter";
  children: ReactNode;
};

/** The chunky "sticker" button (plum outline + hard shadow). Renders as a link. */
export default function Button({ href, variant = "primary", children }: Props) {
  // other websites and files (like the CV) open in a new tab; #section links stay on the page
  const external = href.startsWith("http") || href.endsWith(".pdf");
  return (
    <a
      className={`btn ${variant}`}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
