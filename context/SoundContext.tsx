"use client";

import { useSyncExternalStore } from "react";
import { soundStore } from "@/lib/sfx";

/** Is sound muted? Re-renders the component whenever the mute switch changes. */
export function useMuted() {
  return useSyncExternalStore(soundStore.subscribe, soundStore.get, () => false);
}
