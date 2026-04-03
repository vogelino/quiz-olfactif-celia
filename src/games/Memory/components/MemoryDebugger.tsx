import { batch, createSignal, For, Match, Show, Switch } from "solid-js";
import { MemoryPair, MemoryPairId, memoryPairs } from "~/data/memory";
import { statuses, useMemoryStore } from "../store";
import { getShuffledCards } from "../utils/cards";
import { cn } from "~/utils/cn";

export function MemoryDebugger() {
  const [store, setStore] = useMemoryStore();
  const isDiscovered = (pairId: MemoryPairId) =>
    store.discoveredPairs.includes(pairId);
  const modalIsOpened = () => store.pairMatchId !== null;
  const isActive = (pairId: MemoryPairId) => store.pairMatchId === pairId;
  const onPairDiscoveryToggle = (pairId: MemoryPairId) => {
    batch(() => {
      setStore("status", "started");
      setStore("discoveredPairs", (prev) =>
        prev.includes(pairId)
          ? prev.filter((p) => p !== pairId)
          : [...prev, pairId],
      );
    });
  };
  return (
    <div
      class={cn(
        "fixed bottom-4 right-4 z-50 flex flex-col rounded-lg",
        "bg-background text-xs shadow-lg backdrop-blur-sm w-52",
        "p-1",
      )}
    >
      <button
        onClick={() =>
          setStore("debuggerStatus", (p) =>
            p === "expanded" ? "collapsed" : "expanded",
          )
        }
        class={cn(
          "font-bold uppercase tracking-wide cursor-pointer",
          "flex justify-between gap-4 p-2 hover:bg-muted",
          "transition",
        )}
      >
        <span>Debugger</span>
        <span>{store.debuggerStatus === "expanded" ? "–" : "+"}</span>
      </button>

      <Show when={store.debuggerStatus === "expanded"}>
        <div class="p-2">
          <div class="mb-1 text-gray-400">Status</div>
          <div class="grid grid-cols-2 gap-1">
            <For each={statuses}>
              {(s) => (
                <button
                  class={cn(
                    "flex-1 rounded px-1 py-0.5 text-xs font-medium transition-colors",
                    "cursor-pointer border border-muted",
                    store.status === s
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background hover:bg-muted",
                  )}
                  onClick={() => {
                    batch(() => {
                      setStore("cards", () => getShuffledCards());
                      setStore("currentTurn", []);
                      setStore("pairMatchId", null);
                      setStore("status", s);
                      if (s === "complete") {
                        setStore(
                          "discoveredPairs",
                          memoryPairs.map((p) => p.id),
                        );
                      } else {
                        setStore("discoveredPairs", []);
                      }
                    });
                  }}
                >
                  {s}
                </button>
              )}
            </For>
          </div>
        </div>

        <div class="p-2">
          <div class="mb-1 text-gray-400">Modal</div>
          <div class="flex flex-col gap-1">
            <For each={memoryPairs}>
              {(pair) => {
                return (
                  <div class="grid grid-cols-[1fr_auto] gap-1">
                    <button
                      class={cn(
                        "w-full border border-muted",
                        "rounded px-2 py-0.5 text-left text-xs transition-colors truncate",
                        "bg-background hover:bg-muted cursor-pointer",
                        isActive(pair.id) &&
                          "bg-foreground text-background hover:bg-foreground border-foreground",
                      )}
                      onClick={() => {
                        batch(() => {
                          setStore("status", "started");
                          setStore(
                            "pairMatchId",
                            isActive(pair.id) ? null : pair.id,
                          );
                        });
                      }}
                    >
                      {pair.title}
                    </button>
                    <Show when={!modalIsOpened()}>
                      <button
                        class={cn(
                          "w-20 border border-muted",
                          "rounded px-2 py-0.5 text-center text-xs transition-colors",
                          "bg-background hover:bg-muted cursor-pointer",
                          isDiscovered(pair.id) &&
                            "bg-foreground text-background hover:bg-foreground border-foreground",
                        )}
                        onClick={() => onPairDiscoveryToggle(pair.id)}
                      >
                        {isDiscovered(pair.id) ? "Occult" : "Discover"}
                      </button>
                    </Show>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}
