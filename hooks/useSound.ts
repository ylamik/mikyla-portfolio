"use client";

import { useMuted } from "@/context/SoundContext";
import { sfx, soundStore } from "@/lib/sfx";

/** Sounds + the mute switch, for any component. */
export function useSound() {
  const muted = useMuted();
  return {
    sfx,
    muted,
    toggleMute: () => soundStore.set(!soundStore.get()),
  };
}
