import type { Project, ProjectId } from "@/data/components/project";
import Image from "next/image";
import { seeded } from "@/lib/random";

// little icon that floats inside the window once it opens
const ICONS: Record<ProjectId, string> = {
  pp: '<circle cx="12" cy="6.5" r="3.4"/><circle cx="17.2" cy="10.3" r="3.4"/><circle cx="15.2" cy="16.4" r="3.4"/><circle cx="8.8" cy="16.4" r="3.4"/><circle cx="6.8" cy="10.3" r="3.4"/><circle cx="12" cy="12" r="2.2" fill="#FFE49A"/>',
  ve: '<path d="M2 12C5 6 19 6 22 12C19 18 5 18 2 12Z"/><circle cx="12" cy="12" r="3.6" fill="#C9A9EE"/>',
  nv: '<path d="M3 7H21V10A2 2 0 0 0 21 14V17H3V14A2 2 0 0 0 3 10Z" fill="#A9DDF5"/><path d="M15 7.5V16.5" stroke-dasharray="2 2"/>',
  ag: '<path d="M2 9C7 5 10 7.5 12 12C14 7.5 17 5 22 9C18 10 15 12.5 12 17C9 12.5 6 10 2 9Z" fill="#F7B6D2"/>',
};

const CLOUDS = `<svg class="clouds" viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120V70C14 50 40 46 56 60C64 34 100 30 116 52C130 38 156 40 164 58C178 40 210 42 220 62C236 46 262 48 272 66C284 58 296 60 300 66V120Z" fill="#FBE3F0"/><path d="M0 120V92C20 76 46 78 58 92C74 74 104 76 116 94C132 80 160 82 172 96C188 80 220 82 232 98C250 84 280 86 300 98V120Z" fill="#F4A9BF"/></svg>`;

// terracotta flower box with magenta blooms, little purple roses and trailing vines
function flowerBox(): string {
  const blooms = [[52, 52], [74, 40], [98, 50], [122, 38], [150, 46], [178, 36], [202, 50], [228, 40], [250, 52], [86, 62], [212, 62], [134, 58], [166, 60]];
  const flowers = blooms
    .map(([x, y], i) => {
      const c = i % 3 === 0 ? "#E04FB0" : i % 3 === 1 ? "#F06FC4" : "#C93FA0";
      return `<g transform="translate(${x} ${y}) rotate(${i * 23})"><circle r="6.5" cx="0" cy="-6" fill="${c}"/><circle r="6.5" cx="5.7" cy="-1.9" fill="${c}"/><circle r="6.5" cx="3.5" cy="4.9" fill="${c}"/><circle r="6.5" cx="-3.5" cy="4.9" fill="${c}"/><circle r="6.5" cx="-5.7" cy="-1.9" fill="${c}"/><circle r="2.6" fill="#FFE49A"/></g>`;
    })
    .join("");
  const rose = (x: number, y: number, s: number) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><circle r="13" fill="#B07FE0"/><circle r="10" cx="1" cy="-1" fill="#9A62D1"/><path d="M-6 0A6 6 0 1 1 5 4A4 4 0 1 1 -1 -2" fill="none" stroke="#E3C8F7" stroke-width="2"/><circle r="2.5" fill="#4A2470"/></g>`;
  const leaves = [[40, 66, -40], [64, 70, 20], [110, 68, -20], [146, 70, 30], [190, 68, -30], [238, 66, 30], [262, 70, 50], [30, 74, -70], [272, 76, 70]]
    .map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="5.5" fill="#7DBF7A" stroke="#4E8A55" stroke-width="1.2" transform="rotate(${r} ${x} ${y})"/>`)
    .join("");
  const vine = (x: number, dir: number) =>
    `<path d="M${x} 78C${x + dir * 6} 98 ${x - dir * 4} 116 ${x + dir * 4} 140" fill="none" stroke="#5E9A62" stroke-width="2.5" stroke-linecap="round"/>` +
    [[96, 4], [112, -4], [128, 3]].map(([y, o]) => `<ellipse cx="${x + dir * o}" cy="${y}" rx="6" ry="3.5" fill="#7DBF7A" transform="rotate(${dir * 40} ${x + dir * o} ${y})"/>`).join("") +
    `<circle cx="${x + dir * 5}" cy="124" r="4.5" fill="#F06FC4"/><circle cx="${x - dir * 2}" cy="104" r="4" fill="#E04FB0"/>`;
  return `<svg class="fbox" viewBox="0 0 300 150" aria-hidden="true"><g class="bloom-sway">${leaves}${flowers}${rose(112, 54, 0.9)}${rose(196, 56, 0.8)}${rose(150, 30, 0.75)}</g>${vine(46, -1)}${vine(254, 1)}<path d="M30 70H270L258 120Q257 128 249 128H51Q43 128 42 120Z" fill="#E08E62" stroke="#5B3A86" stroke-width="3" stroke-linejoin="round"/><path d="M26 66H274V80H26Z" fill="#EFA67C" stroke="#5B3A86" stroke-width="3" stroke-linejoin="round"/><path d="M70 96H230" stroke="#C26F48" stroke-width="2.5" stroke-linecap="round" opacity=".7"/></svg>`;
}
const FLOWER_BOX = flowerBox();

type Props = { project: Project; index: number; open: boolean; onOpen: () => void; onHover: () => void };

/** One arched window on the little street. Shutters swing open when `open` is true. */
export default function ProjectWindow({ project, index, open, onOpen, onHover }: Props) {
  const rnd = seeded(100 + index);
  const stars = Array.from({ length: 9 }, () => ({ left: rnd(10, 88), top: rnd(6, 42), size: rnd(6, 14), delay: rnd(-2.6, 0) }));
  const [c1, c2, c3] = project.shutters;
  const shutter = {
    background: `repeating-linear-gradient(180deg,${c1} 0 10px,${c2} 10px 13px)`,
    boxShadow: `inset 0 0 0 7px ${c3},inset 0 0 0 9.5px #5B3A86`,
  };

  return (
    <button
      type="button"
      className={`wwin${open ? " on" : ""}`}
      aria-pressed={open}
      aria-label={`Open the ${project.name} window`}
      onClick={onOpen}
      onMouseEnter={onHover}
    >
      <span className="wframe">
        <span className="glass" style={{ background: project.sky }}>
          {stars.map((s, i) => (
            <span
              key={i}
              className="gstar"
              style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay.toFixed(2)}s` }}
            />
          ))}
          <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: CLOUDS }} />
          <span className="mul-v" />
          <span className="mul-h" />
          <span className="gico" style={project.logoBg ? { background: project.logoBg } : undefined}>
            {project.logo ? (
              <Image src={project.logo} alt="" width={36} height={36} style={{ objectFit: "contain" }} />
            ) : (
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#5B3A86" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[project.id] }} />
            )}
          </span>
        </span>
        <span className="shut l" style={shutter} />
        <span className="shut r" style={shutter} />
      </span>
      <span className="sill" />
      <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: FLOWER_BOX }} />
      <span className="sign">{project.name}</span>
    </button>
  );
}
