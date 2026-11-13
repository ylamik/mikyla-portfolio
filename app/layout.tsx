import type { Metadata, Viewport } from "next";
import { Shrikhand, Great_Vibes, Fredoka, DM_Sans } from "next/font/google";
import "./globals.css";

// Big chunky name ("Mikyla Caras")
const shrikhand = Shrikhand({ variable: "--font-display", subsets: ["latin"], weight: "400" });
// Script text (chapter titles, "Hello, I'm", logo, signatures)
const greatVibes = Great_Vibes({ variable: "--font-script", subsets: ["latin"], weight: "400" });
// Cute rounded UI text (headings, buttons, nav, keys, tags)
const fredoka = Fredoka({ variable: "--font-cute", subsets: ["latin"] });
// Normal reading text (paragraphs)
const dmSans = DM_Sans({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mikyla Caras — Portfolio",
  description:
    "Mikyla Caras — Computer Science student at UST who designs, builds and tests web interfaces. UI/UX, frontend development and QA.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EFE8F8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${shrikhand.variable} ${greatVibes.variable} ${fredoka.variable} ${dmSans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
