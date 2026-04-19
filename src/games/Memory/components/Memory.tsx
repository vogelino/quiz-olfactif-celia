import { MemoryDebugger } from "@memory/components/MemoryDebugger";
import { MemoryEnd } from "@memory/components/MemoryEnd";
import { MemoryGrid } from "@memory/components/MemoryGrid";
import { MemoryLoading } from "@memory/components/MemoryLoading";
import { MemoryMatchModal } from "@memory/components/MemoryMatchModal";
import { MemoryRestartButton } from "@memory/components/MemoryRestartButton";
import { MemoryStart } from "@memory/components/MemoryStart";
import { useMemorySounds } from "@memory/memorySounds";
import {
  createMemoryStore,
  MemoryStoreProvider,
  useMemoryStore,
} from "@memory/memoryStore";
import { getShuffledCards } from "@memory/utils/memoryCardsUtil";
import { createHotkey } from "@omniaura/solid-hotkeys";
import { batch, createEffect, createSignal, onCleanup, Show } from "solid-js";
import { GeneralControls } from "~/components/GeneralControls";
import { SoundControl } from "~/components/SoundControl";
import { MemoryScore } from "~/games/Memory/components/MemoryScore";

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
      <Show when={store.status === "loading" && showLoadingScreen()}>
        <MemoryLoading percentage={sounds.loadingProgess().percentage} />
      </Show>
      <Show when={store.status === "initial"}>
        <MemoryStart />
      </Show>
      <Show
        when={
          ["started", "complete"].includes(store.status) && !store.pairMatchId
        }
      >
        <MemoryGrid />
      </Show>
      <Show when={store.status !== "initial" && store.pairMatchId}>
        <MemoryMatchModal />
      </Show>
      <Show when={store.status === "complete" && !store.pairMatchId}>
        <MemoryEnd />
      </Show>
      <Show when={store.status === "started" && !store.pairMatchId}>
        <MemoryScore
          class={() => "absolute top-4 left-1/2 -translate-x-1/2 z-10"}
        />
      </Show>
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
