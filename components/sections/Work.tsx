"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Lightbox from "@/components/ui/Lightbox";
import ProjectWindow from "@/components/ui/ProjectWindow";
import { projects, type Project } from "@/data/components/project";
import { useInView } from "@/hooks/useInView";
import { burst } from "@/lib/flutter";
import { sfx } from "@/lib/sfx";

const BULB_COLORS = ["#FFE49A", "#F7B6D2", "#A9DDF5", "#C9A9EE"];

/** A little stack of screenshots. Click it to open the full photo collection. */
function Screens({ project }: { project: Project }) {
  const [open, setOpen] = useState<number | null>(null);
  const shots = project.shots;
  const move = useCallback((d: number) => setOpen((n) => (n === null ? n : (n + d + shots.length) % shots.length)), [shots.length]);
  const cover = shots[0];

  return (
    <div className="screens">
      <button
        type="button"
        className={`album-cover${shots.length > 1 ? " stacked" : ""}`}
        onClick={() => {
          setOpen(0);
          sfx.sparkle();
        }}
        aria-label={`Open ${project.name} screenshots (${shots.length})`}
      >
        {shots.length > 1 && <span className="cover-back b2" aria-hidden="true" />}
        {shots.length > 1 && <span className="cover-back b1" aria-hidden="true" />}
        <span className="cover-front">
          <span className="cover-bar" aria-hidden="true"><i /><i /><i /></span>
          <span className={`cover-img ${project.fit}`}>
            <Image src={cover.src} alt={`${project.name} — ${cover.label}`} fill sizes="(max-width: 860px) 90vw, 520px" style={{ objectFit: project.fit, objectPosition: "top center" }} />
          </span>
        </span>
        <span className="cover-badge">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><circle cx="9" cy="10" r="2" /><path d="M21 16L15 11L6 19" /></svg>
          {shots.length > 1 ? `view ${shots.length} screens` : "view screen"}
        </span>
      </button>
      {project.shotsNote && <p className="shots-note">{project.shotsNote}</p>}
      {open !== null && (
        <Lightbox
          images={shots.map((sh) => ({ src: sh.src, caption: sh.label }))}
          index={open}
          title={`${project.name} — screens`}
          note={project.shotsNote}
          onClose={() => setOpen(null)}
          onMove={move}
        />
      )}
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="tags">
      {tags.map((t) => (
        <span key={t} className="tag">{t}</span>
      ))}
    </div>
  );
}

function Links({ project }: { project: Project }) {
  return (
    <>
      {project.status && <span className="status-pill">{project.status}</span>}
      {project.links.map((l) => (
        <a key={l.href} className="btn primary" href={l.href} target="_blank" rel="noreferrer">
          {l.label}
          <svg className="ext-arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 17L17 7M9 7H17V15" />
          </svg>
        </a>
      ))}
    </>
  );
}

/** Chapter two: a little street of windows. Open one → its story appears in the book below. */
export default function Work() {
  const streetRef = useRef<HTMLDivElement>(null);
  const inView = useInView(streetRef, 0.4);
  const [picked, setPicked] = useState(0);
  const [opened, setOpened] = useState(false); // has any window been opened yet

  // gently open the first window the first time the street scrolls into view
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setOpened(true), 500);
    return () => clearTimeout(t);
  }, [inView]);

  const pick = (i: number) => {
    setPicked(i);
    setOpened(true);
    sfx.chime();
    const r = streetRef.current?.querySelectorAll(".wwin")[i]?.getBoundingClientRect();
    if (r) burst(r.left + r.width / 2, r.top + r.height * 0.3, 8);
  };

  const p = projects[picked];

  return (
    <section className="work" id="work">
      <div className="wrap">
        <div className="work-head rv">
          <div>
            <p className="eyebrow">chapter two ~ selected work</p>
            <h2 className="h2">Projects I&apos;ve designed &amp; built</h2>
          </div>
          <p style={{ margin: 0, maxWidth: 380, lineHeight: 1.6, color: "var(--text)" }}>
            Every window on this little street holds a story. Click one to open its shutters.
          </p>
        </div>

        <div className="street rv" ref={streetRef}>
          <div className="awn" aria-hidden="true"><div className="awning" /></div>
          <div className="bulbs" aria-hidden="true">
            {Array.from({ length: 26 }, (_, i) => {
              const c = BULB_COLORS[i % 4];
              return <i key={i} style={{ left: `${(i / 25) * 96 + 2}%`, background: c, boxShadow: `0 0 8px ${c}`, animationDelay: `${(i % 5) * -0.5}s` }} />;
            })}
          </div>
          <div className="wwins">
            {projects.map((proj, i) => (
              <ProjectWindow
                key={proj.id}
                project={proj}
                index={i}
                open={opened && picked === i}
                onOpen={() => pick(i)}
                onHover={() => { if (!(opened && picked === i)) sfx.click(1.6); }}
              />
            ))}
          </div>
          <div className="ground" aria-hidden="true" />
        </div>

        {/* the open "book": key={picked} replays the page-turn animation on every change */}
        <div className="story" aria-live="polite" key={p.id}>
          <div className="pg left">
            <p className="eyebrow" style={{ fontSize: 34 }}>page {picked + 1} of {projects.length}</p>
            <Screens key={p.id} project={p} />
            <div style={{ marginTop: 20 }}><Tags tags={p.tags} /></div>
          </div>
          <div className="pg right">
            <div className="pc-top">
              <h3>{p.name}</h3>
              <span>{p.date}</span>
            </div>
            <p className="pc-role" style={{ marginTop: 4 }}>{p.role}</p>
            <ul className="sbul">
              {p.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Links project={p} />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
