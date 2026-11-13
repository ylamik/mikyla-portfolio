import { memo, type CSSProperties } from "react";
import type { SkillKey } from "@/data/components/skills";

type Props = {
  skill: SkillKey;
  row: number;
  col: number;
  down: boolean;
  onPress: (skill: SkillKey, row: number, col: number) => void;
};

/**
 * One keyboard key. Width and color come from the data file.
 * Wrapped in memo so pressing one key only redraws that key, not all 31 (much smoother on phones).
 */
function Key({ skill, row, col, down, onPress }: Props) {
  const isHeart = skill.label === "♥";
  const showHotkey = skill.hotkey.length === 1 && skill.hotkey !== " ";
  return (
    <button
      type="button"
      className={`key${isHeart ? " heart" : ""}${down ? " down" : ""}`}
      style={{ "--c": skill.color, "--w": skill.width } as CSSProperties}
      onClick={() => onPress(skill, row, col)}
      aria-label={isHeart ? "heart" : skill.label}
    >
      {showHotkey && <small>{skill.hotkey.toUpperCase()}</small>}
      {isHeart ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21C5 15.5 2 12 2 8.3 2 5.4 4.3 3 7.2 3c1.9 0 3.6 1 4.8 2.6C13.2 4 14.9 3 16.8 3 19.7 3 22 5.4 22 8.3c0 3.7-3 7.2-10 12.7z" fill="#F48FB8" stroke="#5B3A86" strokeWidth="2" />
        </svg>
      ) : (
        skill.label
      )}
    </button>
  );
}

export default memo(Key);
