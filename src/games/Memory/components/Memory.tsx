import { MemoryGrid } from "./MemoryGrid";
import {
  batch,
  createEffect,
  createSignal,
  Match,
  onCleanup,
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
import { MemoryLoading } from "./MemoryLoading";
import { GeneralControls } from "~/components/GeneralControls";
import { MemoryRestartButton } from "./MemoryRestartButton";
import { SoundControl } from "~/components/SoundControl";
import { useMemorySounds } from "../memorySounds";
import { createHotkey } from "@omniaura/solid-hotkeys";
import { getShuffledCards } from "../utils/cards";

function MemoryInner() {
  const [store, setStore] = useMemoryStore();
  const sounds = useMemorySounds();
  const [showLoadingScreen, setShowLoadingScreen] = createSignal(false);

  createHotkey("M", () =>
    sounds.soundIsOn() ? sounds.turnOffSounds() : sounds.turnOnSounds(),
  );
  createHotkey("R", () => {
    batch(() => {
      setStore("cards", getShuffledCards());
      setStore("currentTurn", []);
      setStore("discoveredPairs", []);
      setStore("error", undefined);
      setStore("pairMatchId", null);
      setStore("status", "initial");
    });
  });

  createEffect(() => {
    if (!sounds.isError() && sounds.loadingProgess().percentage === 100) {
      setStore("status", "initial");
    }
  });

  createEffect(() => {
    if (store.status !== "loading") {
      setShowLoadingScreen(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (store.status === "loading") {
        setShowLoadingScreen(true);
      }
    }, 500);

    onCleanup(() => window.clearTimeout(timeoutId));
  });

  return (
    <>
      <GeneralControls>
        <Show when={["started", "complete"].includes(store.status)}>
          <MemoryRestartButton
            onMouseEnter={() =>
              sounds.playUISound(["sniff1", "sniff2", "sniff3"], {
                volume: 0.2,
              })
            }
          />
          <SoundControl
            soundIsOn={sounds.soundIsOn}
            onSoundOnChange={(isNowOn) => {
              if (isNowOn) return sounds.turnOnSounds();
              sounds.turnOffSounds();
            }}
            onMouseEnter={() =>
              sounds.playUISound(["sniff1", "sniff2", "sniff3"], {
                volume: 0.2,
              })
            }
          />
        </Show>
      </GeneralControls>
      <Show when={!!store.error}>{store.error}</Show>
      <Switch>
        <Match when={store.status === "loading" && showLoadingScreen()}>
          <MemoryLoading percentage={sounds.loadingProgess().percentage} />
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
