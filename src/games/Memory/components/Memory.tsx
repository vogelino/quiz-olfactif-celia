import { MemoryGrid } from "./MemoryGrid";
import {
  createSignal,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from "solid-js";
import { MemoryMatchModal } from "./MemoryMatchModal";
import { MemoryStart } from "./MemoryStart";
import { MemoryEnd } from "./MemoryEnd";
import {
  createMemoryStore,
  MemoryStoreProvider,
  useMemoryStore,
} from "../store";
import { MemoryDebugger } from "./MemoryDebugger";
import { LoadProgress, useSoundManager } from "~/utils/SoundManager";
import { MemoryLoading } from "./MemoryLoading";
import { GeneralControls } from "~/components/GeneralControls";
import { MemoryRestartButton } from "./MemoryRestartButton";

function MemoryInner() {
  const [store, setStore] = useMemoryStore();
  const manager = useSoundManager();
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
          click: "/sounds/click-1.mp3",
          close: "/sounds/close-1.m4a",
          match: "/sounds/match-1.mp3",
          success: "/sounds/success-1.mp3",
          flip: "/sounds/flip-1.m4a",
          music: "/sounds/music-1.mp3",
        },
        (loadProgress) =>
          setProgress((prev) => ({
            ...loadProgress,
            percentage: Math.max(prev.percentage, loadProgress.percentage),
          })),
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setStore("error", errorMessage);
    } finally {
      setStore("status", "initial");
    }
  });

  onCleanup(() => manager.dispose());

  return (
    <>
      <GeneralControls>
        <Show when={["started", "complete"].includes(store.status)}>
          <MemoryRestartButton />
        </Show>
      </GeneralControls>
      <Show when={!!store.error}>{store.error}</Show>
      <Switch>
        <Match when={store.status === "loading"}>
          <MemoryLoading percentage={progress().percentage} />
        </Match>
        <Match when={store.status === "initial"}>
          <MemoryStart />
        </Match>
        <Match when={store.status === "started" && !store.pairMatchId}>
          <MemoryGrid />
        </Match>
        <Match when={store.status !== "initial" && store.pairMatchId}>
          <MemoryMatchModal />
        </Match>
        <Match when={store.status === "complete" && !store.pairMatchId}>
          <MemoryEnd />
        </Match>
      </Switch>
      <Show when={import.meta.env.DEV}>
        <MemoryDebugger />
      </Show>
    </>
  );
}

export function Memory() {
  return (
    <MemoryStoreProvider value={createMemoryStore()}>
      <MemoryInner />
    </MemoryStoreProvider>
  );
}
