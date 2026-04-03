import { idToMemoryPair, MemoryPair, MemoryPairId } from "~/data/memory";
import { MemoryGrid } from "./MemoryGrid";
import { createStore } from "solid-js/store";
import { Match, Show, Switch } from "solid-js";
import { MemoryMatchModal } from "./MemoryMatchModal";
import { MemoryStart } from "./MemoryStart";
import { MemoryEnd } from "./MemoryEnd";
import { useNavigate } from "@solidjs/router";

type StoreType = {
  pairMatch: MemoryPair | null;
  status: "initial" | "started" | "complete";
};

export function Memory() {
  const navigate = useNavigate();
  const [store, setStore] = createStore<StoreType>({
    pairMatch: null,
    status: "initial" as const,
  });
  const onPairFound = (pairId: MemoryPairId) => {
    const pair = idToMemoryPair[pairId];
    if (!pair) return;
    setStore("pairMatch", pair);
  };
  const onGridComplete = () => {
    setStore("status", "complete");
  };
  const showMatchModal = () => store.pairMatch !== null;
  return (
    <>
      <Show when={store.status === "initial"}>
        <MemoryStart onStart={() => setStore("status", "started")} />
      </Show>
      <Show when={store.status === "started"}>
        <MemoryGrid
          onPairFound={onPairFound}
          onGridComplete={onGridComplete}
          inert={showMatchModal()}
        />
      </Show>
      <Show when={store.status !== "initial" && showMatchModal()}>
        <MemoryMatchModal
          {...store.pairMatch!}
          onClose={() => setStore("pairMatch", null)}
        />
      </Show>
      <Show when={store.status === "complete" && !showMatchModal()}>
        <MemoryEnd onReStart={() => navigate("/", { replace: true })} />
      </Show>
    </>
  );
}
