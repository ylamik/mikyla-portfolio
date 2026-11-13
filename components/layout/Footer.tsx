import { profile } from "@/data/components/profile";

export default function Footer() {
  return (
    <footer>
      <span>Designed &amp; built by {profile.fullName} · 2026</span>
      <span className="script" style={{ fontSize: 24, color: "var(--accent)" }}>
        thank you for visiting
      </span>
    </footer>
  );
}
