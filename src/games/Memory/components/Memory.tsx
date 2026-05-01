import { MemoryEnd } from "@memory/components/MemoryEnd";
import { MemoryGrid } from "@memory/components/MemoryGrid";
import { MemoryLoading } from "@memory/components/MemoryLoading";
import { MemoryMatchModal } from "@memory/components/MemoryMatchModal";
import { MemoryStart } from "@memory/components/MemoryStart";
import { useMemorySounds } from "@memory/memorySounds";
import { createMemoryStore, MemoryStoreProvider, useMemoryStore } from "@memory/memoryStore";
import { getShuffledCards } from "@memory/utils/memoryCardsUtil";
import { createHotkey } from "@omniaura/solid-hotkeys";
import { batch, createEffect, createSignal, onCleanup, Show } from "solid-js";
import { MemoryLayout } from "./MemoryLayout";

function MemoryInner() {
  const [store, setStore] = useMemoryStore();
  const sounds = useMemorySounds();
  const [showLoadingScreen, setShowLoadingScreen] = createSignal(false);

  createHotkey("M", () => (sounds.soundIsOn() ? sounds.turnOffSounds() : sounds.turnOnSounds()));
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
    <MemoryLayout>
      <Show when={!!store.error}>{store.error}</Show>
      <Show when={store.status === "loading" && showLoadingScreen()}>
        <MemoryLoading percentage={sounds.loadingProgess().percentage} />
      </Show>
      <Show when={store.status === "initial"}>
        <MemoryStart />
      </Show>
      <Show when={["started", "complete"].includes(store.status) && !store.pairMatchId}>
        <MemoryGrid />
      </Show>
      <Show when={store.status !== "initial" && store.pairMatchId}>
        <MemoryMatchModal />
      </Show>
      <Show when={store.status === "complete" && !store.pairMatchId}>
        <MemoryEnd />
      </Show>
    </MemoryLayout>
  );
}

export function Memory() {
  return (
    <MemoryStoreProvider value={createMemoryStore()}>
      <MemoryInner />
    </MemoryStoreProvider>
  );
}
