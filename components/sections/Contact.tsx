"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { burst } from "@/lib/flutter";
import { sfx } from "@/lib/sfx";
import { profile } from "@/data/components/profile";

/** The ending: click the envelope and a letter with your contact links slides out. */
export default function Contact() {
  const [open, setOpen] = useState(false);
  const envRef = useRef<HTMLDivElement>(null);

  const openEnvelope = () => {
    if (open) return;
    setOpen(true);
    sfx.chime();
    const r = envRef.current?.getBoundingClientRect();
    if (r) setTimeout(() => burst(r.left + r.width / 2, r.top + 40, 12), 500);
  };

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="rv">
          <p className="eyebrow">get in touch</p>
          <h2 className="h2">Let&apos;s work together</h2>
        </div>

        <div className="env-stage rv">
          <div
            ref={envRef}
            className={`env${open ? " open" : ""}`}
            role="button"
            tabIndex={0}
            aria-label="Open the envelope"
            aria-expanded={open}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) return;
              openEnvelope();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openEnvelope();
              }
            }}
          >
            <div className="back" />
            <div className="letter">
              <h3>Hello,</h3>
              <p>
                Thank you for taking the time to view my portfolio. I am currently open to internship and junior opportunities in
                frontend development, UI/UX design and quality assurance. I would be glad to hear from you.
              </p>
              <div className="row">
                <Button href={`mailto:${profile.email}`}>Email me</Button>
                <Button href={profile.linkedin} variant="soft">LinkedIn</Button>
                <Button href={profile.github} variant="soft">GitHub</Button>
              </div>
              <p style={{ fontSize: 14 }}>{profile.email}</p>
              <p className="sig">{profile.fullName}</p>
            </div>
            <div className="front">
              <svg viewBox="0 0 560 340" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 120L280 230L560 120V322Q560 340 542 340H18Q0 340 0 322Z" fill="#DCC3F5" stroke="#5B3A86" strokeWidth="3" strokeLinejoin="round" />
                <path d="M0 340L230 200M560 340L330 200" stroke="#5B3A86" strokeWidth="3" opacity=".5" />
              </svg>
            </div>
            <div className="flap">
              <svg viewBox="0 0 560 200" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 18Q3 3 18 3H542Q557 3 557 18L280 196Z" fill="#CBA9EF" stroke="#5B3A86" strokeWidth="3" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="seal">
              <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path d="M12 21C5 15.5 2 12 2 8.3 2 5.4 4.3 3 7.2 3c1.9 0 3.6 1 4.8 2.6C13.2 4 14.9 3 16.8 3 19.7 3 22 5.4 22 8.3c0 3.7-3 7.2-10 12.7z" fill="#fff" stroke="#5B3A86" strokeWidth="1.6" />
              </svg>
            </div>
          </div>
        </div>
        <p className="env-hint">{open ? "My contact details are above." : "Click the envelope to view my contact details"}</p>
      </div>
    </section>
  );
}
