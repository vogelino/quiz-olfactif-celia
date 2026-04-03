import { idToMemoryPair, MemoryPair, MemoryPairId } from "~/data/memory";
import { MemoryGrid } from "./MemoryGrid";
import { createStore } from "solid-js/store";
import { Show } from "solid-js";
import { MemoryMatchModal } from "./MemoryMatchModal";

type StoreType = {
  pairMatch: MemoryPair | null;
};

export function Memory() {
  const [store, setStore] = createStore<StoreType>({
    pairMatch: null,
  });
  const onPairFound = (pairId: MemoryPairId) => {
    const pair = idToMemoryPair[pairId];
    if (!pair) return;
    setStore("pairMatch", pair);
  };
  const showModal = () => store.pairMatch !== null;
  return (
    <>
      <MemoryGrid onPairFound={onPairFound} inert={showModal()} />
      <Show when={showModal()}>
        <MemoryMatchModal
          {...store.pairMatch!}
          onClose={() => setStore("pairMatch", null)}
        />
      </Show>
    </>
  );
}
