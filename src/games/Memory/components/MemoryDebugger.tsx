import { batch, createEffect, For } from "solid-js";
import { MemoryPair, MemoryPairId, memoryPairs } from "~/data/memory";
import { statuses, useMemoryStore } from "../store";
import { getShuffledCards } from "../utils/cards";
import { cn } from "~/utils/cn";

export function MemoryDebugger() {
  const [store, setStore] = useMemoryStore();
  const isActive = (pairId: MemoryPairId) =>
    store.pairMatch && store.pairMatch.id === pairId;
  const onPairClick = (pair: MemoryPair) => {
    batch(() => {
      setStore("cards", () => getShuffledCards());
      setStore("currentTurn", []);
      setStore("discoveredPairs", []);
      setStore("status", "started");
      setStore("pairMatch", isActive(pair.id) ? null : pair);
    });
  };

  createEffect(() => {
    memoryPairs.forEach((pair) => console.log(pair.id, pair.title));
  });

  return (
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 rounded-xl border border-gray-300 bg-background/90 p-3 text-xs shadow-lg backdrop-blur-sm w-52">
      <div class="font-bold text-gray-500 uppercase tracking-wide">
        🛠 Debug
      </div>

      <div>
        <div class="mb-1 text-gray-400">Status</div>
        <div class="flex gap-1">
          <For each={statuses}>
            {(s) => (
              <button
                class={`flex-1 rounded px-1 py-0.5 border text-[10px] font-medium transition-colors ${
                  store.status === s
                    ? "bg-black text-background border-black"
                    : "bg-background text-gray-600 border-gray-300 hover:border-gray-500"
                }`}
                onClick={() => {
                  batch(() => {
                    setStore("cards", () => getShuffledCards());
                    setStore("currentTurn", []);
                    setStore("discoveredPairs", []);
                    setStore("pairMatch", null);
                    setStore("status", s);
                  });
                }}
              >
                {s}
              </button>
            )}
          </For>
        </div>
      </div>

      <div>
        <div class="mb-1 text-gray-400">Modal</div>
        <div class="flex flex-col gap-1">
          <For each={memoryPairs}>
            {(pair) => {
              return (
                <button
                  class={cn(
                    "rounded px-2 py-0.5 border text-left text-[10px] transition-colors truncate",
                    "bg-background text-gray-600 border-gray-300 hover:border-gray-500",
                    isActive(pair.id) &&
                      "bg-black text-background border-black",
                  )}
                  onClick={() => onPairClick(pair)}
                >
                  {pair.title}
                </button>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
}
