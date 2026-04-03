import { MemoryGrid } from "./MemoryGrid";
import { createSignal, Match, Show, Switch } from "solid-js";
import { MemoryMatchModal } from "./MemoryMatchModal";
import { MemoryStart } from "./MemoryStart";
import { MemoryEnd } from "./MemoryEnd";
import {
  createMemoryStore,
  MemoryStoreProvider,
  useMemoryStore,
} from "../store";
import { MemoryDebugger } from "./MemoryDebugger";

function MemoryInner() {
  const [store] = useMemoryStore();
  return (
    <>
      <Switch>
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
