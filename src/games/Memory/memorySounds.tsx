import { JSXElement } from "solid-js";
import {
  SoundsContextType,
  SoundsProvider,
  useSounds,
} from "~/utils/soundsContext";

const memoryUiSounds = {
  click1: "/sounds/click-1.mp3",
  click2: "/sounds/click-2.m4a",
  close: "/sounds/close-1.m4a",
  match1: "/sounds/match-1.mp3",
  match2: "/sounds/match-2.mp3",
  match3: "/sounds/match-3.mp3",
  success: "/sounds/success-1.mp3",
  flip: "/sounds/flip-1.m4a",
  firework: "/sounds/firework-1.mp3",
  sniff1: "/sounds/sniff-1.m4a",
  sniff2: "/sounds/sniff-2.m4a",
  sniff3: "/sounds/sniff-3.m4a",
  hover1: "/sounds/hover-1.m4a",
} as const satisfies Record<string, string>;

const memoryMusicSounds = {
  mainTheme1: "/sounds/music-1.mp3",
  mainTheme2: "/sounds/music-2.mp3",
  mainTheme3: "/sounds/music-3.mp3",
  mainTheme4: "/sounds/music-4.mp3",
} as const satisfies Record<string, string>;

type MemoryUISoundKey = keyof typeof memoryUiSounds;
type MemoryMusicSoundKey = keyof typeof memoryMusicSounds;

export const MemorySoundsProvider = (props: { children: JSXElement }) => {
  return (
    <SoundsProvider uiSounds={memoryUiSounds} musicSounds={memoryMusicSounds}>
      {props.children}
    </SoundsProvider>
  );
};

// Casting the context because of default values set in the sounds context
export const useMemorySounds = () =>
  useSounds() as unknown as SoundsContextType<
    MemoryUISoundKey,
    MemoryMusicSoundKey
  >;
