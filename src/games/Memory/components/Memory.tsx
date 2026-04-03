import { MemoryGrid } from "./MemoryGrid";
import { Match, Switch } from "solid-js";
import { MemoryMatchModal } from "./MemoryMatchModal";
import { MemoryStart } from "./MemoryStart";
import { MemoryEnd } from "./MemoryEnd";
import { MemoryStoreProvider, useMemoryStore } from "../store";

function MemoryInner() {
  const [store] = useMemoryStore();
  return (
    <Switch>
      <Match when={store.status === "initial"}>
        <MemoryStart />
      </Match>
      <Match when={store.status === "started" && !store.pairMatch}>
        <MemoryGrid />
      </Match>
      <Match when={store.status !== "initial" && store.pairMatch}>
        <MemoryMatchModal />
      </Match>
      <Match when={store.status === "complete" && !store.pairMatch}>
        <MemoryEnd />
      </Match>
    </Switch>
  );
}

export function Memory() {
  return (
    <MemoryStoreProvider>
      <MemoryInner />
    </MemoryStoreProvider>
  );
}
