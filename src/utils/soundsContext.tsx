import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  JSXElement,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";

import { LoadProgress, SoundManager } from "~/utils/SoundManager";
import { Tail } from "~/utils/typeUtils";
import useLocalStorage from "~/utils/useLocalStorage";

export type SoundsContextType<UISoundKey extends string, MusicSoundKey extends string> = {
  isLoading: Accessor<boolean>;
  isError: Accessor<boolean>;
  manager: SoundManager;
  error: Accessor<string | null>;
  loadingProgess: Accessor<LoadProgress>;
  soundIsOn: Accessor<boolean>;
  turnOnSounds: () => void;
  turnOffSounds: () => void;
  playUISound: (
    key: UISoundKey | UISoundKey[],
    ...p: Tail<Parameters<SoundManager["play"]>>
  ) => void;
  stopUISound: (source: AudioBufferSourceNode | null) => void;
  stopAllUISounds: () => void;
  playMusicLoop: (
    key: MusicSoundKey | MusicSoundKey[],
    ...p: Tail<Parameters<SoundManager["playLoop"]>>
  ) => void;
  stopMusicLoop: (key: MusicSoundKey) => void;
  stopAllMusicLoops: () => void;
};

const SoundsContext = createContext<SoundsContextType<"A", "B"> | null>(null);

export const SoundsProvider = <UISoundKey extends string, MusicSoundKey extends string>(props: {
  children: JSXElement;
  uiSounds: Record<UISoundKey, string>;
  musicSounds: Record<MusicSoundKey, string>;
}) => {
  const manager = new SoundManager();
  const [soundOn, setSoundOn] = useLocalStorage<{
    soundOn: boolean;
  }>({
    key: "SoundsOn",
    storageType: "session",
    defaultValue: {
      soundOn: true,
    },
  });
  const [isMutedByPageVisibility, setIsMutedByPageVisibility] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [progress, setProgress] = createSignal<LoadProgress>({
    soundsCompleted: 0,
    totalSounds: 0,
    bytesLoaded: 0,
    totalBytes: 0,
    percentage: 0,
  });

  onMount(async () => {
    try {
      await manager.loadSounds(
        {
          ...props.uiSounds,
          ...props.musicSounds,
        },
        (loadProgress) => {
          setProgress((prev) => ({
            ...loadProgress,
            percentage: Math.max(prev.percentage, loadProgress.percentage),
          }));
        },
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }

    const syncPageVisibility = () => {
      setIsMutedByPageVisibility(document.visibilityState === "hidden" && soundOn().soundOn);
    };

    syncPageVisibility();
    document.addEventListener("visibilitychange", syncPageVisibility);
    onCleanup(() => document.removeEventListener("visibilitychange", syncPageVisibility));
  });

  onCleanup(() => manager.dispose());

  // Ensure a function is not executed if sounds are not loaded or if sounds are turned off
  const guard =
    <ParamT extends unknown[], ReturnT>(fn: (...p: ParamT) => ReturnT) =>
    (...params: ParamT) => {
      if (progress().percentage !== 100) return;
      return fn(...params);
    };

  createEffect(() => {
    if (soundOn().soundOn && !isMutedByPageVisibility()) {
      manager.setMasterVolume(1);
      return;
    }
    manager.setMasterVolume(0);
  });

  return (
    <SoundsContext.Provider
      value={{
        isLoading,
        error,
        isError: () => typeof error() === "string",
        manager,
        loadingProgess: progress,
        soundIsOn: () => soundOn().soundOn,
        turnOnSounds: () => setSoundOn((prev) => ({ ...prev, soundOn: true })),
        turnOffSounds: () => setSoundOn((prev) => ({ ...prev, soundOn: false })),
        playUISound: (key, ...rest) => guard(manager.play)(normalizeKey(key), ...rest),
        stopUISound: guard(manager.stop),
        stopAllUISounds: guard(manager.stopAll),
        playMusicLoop: (key, ...rest) => guard(manager.playLoop)(normalizeKey(key), ...rest),
        stopMusicLoop: guard(manager.stopAllLoops),
        stopAllMusicLoops: guard(manager.stopAllLoops),
      }}
    >
      {props.children}
    </SoundsContext.Provider>
  );

  function normalizeKey<T>(key: T) {
    if (Array.isArray(key)) {
      const randKey = key[Math.floor(Math.random() * key.length)];
      if (!randKey) throw new Error(`Could not play random sound within key: "${key}"`);
      return randKey;
    }
    return key;
  }
};

export const useSounds = () => {
  const ctx = useContext(SoundsContext);
  if (ctx === null) {
    throw new Error("The SoundsContext must be used with the SoundsProvider");
  }
  return ctx;
};
