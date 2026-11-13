import { profile } from "@/data/components/profile";

function WinBar({ title, bg }: { title: string; bg?: string }) {
  return (
    <div className="win-bar" style={bg ? { background: bg } : undefined}>
      <span className="dots">
        <i style={{ background: "var(--pink)" }} />
        <i style={{ background: "var(--butter)" }} />
        <i style={{ background: "var(--mint)" }} />
      </span>
      <span className="title">{title}</span>
      <span style={{ width: 30 }} />
    </div>
  );
}

const h3Style = { fontFamily: "var(--font-cute)", fontWeight: 600, fontSize: 24, margin: "4px 0 22px" } as const;

/** Leadership timeline + certifications, as two little windows. */
export default function Leadership() {
  return (
    <section className="wrap lc">
      <div className="win rv">
        <WinBar title="leadership.txt" />
        <div className="win-body">
          <p className="eyebrow" style={{ fontSize: 40 }}>leadership</p>
          <h3 style={h3Style}>{profile.leadership.org}</h3>
          <div className="tl">
            {profile.leadership.roles.map((r) => (
              <div key={r.role}>
                <p style={{ fontSize: 14, color: "#6B5590" }}>{r.when}</p>
                <p style={{ fontFamily: "var(--font-cute)", fontWeight: 600, fontSize: 19 }}>{r.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="win rv">
        <WinBar title="certificates.txt" bg="#FDE6F2" />
        <div className="win-body">
          <p className="eyebrow" style={{ fontSize: 40 }}>certifications</p>
          <h3 style={h3Style}>Always learning</h3>
          {profile.certifications.map((c) => (
            <div key={c.name} className="cert" style={{ background: c.bg }}>
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#7B2D8E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none" }}>
                <circle cx="12" cy="9" r="6" />
                <path d="M8.5 14L7 22L12 19L17 22L15.5 14" />
              </svg>
              <div>
                <p style={{ margin: 0, fontFamily: "var(--font-cute)", fontWeight: 600, fontSize: 18 }}>{c.name}</p>
                <p style={{ margin: "2px 0 0", fontSize: 14, color: "#6B5590" }}>{c.from}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
