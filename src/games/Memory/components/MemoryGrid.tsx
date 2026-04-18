import { For, Show, batch, createEffect } from "solid-js";
import { ingredientIdToPair, memoryPairs } from "~/data/memory";
import { MemoryCard } from "./MemoryCard";
import { IngredientId } from "~/data/ingredients";
import { useMemoryStore } from "../store";
import { MemoryDiscoveredPairs } from "./MemoryDiscoveredPairs";
import { cn } from "~/utils/cn";
import { useMemorySounds } from "../memorySounds";

export function MemoryGrid() {
  const [store, setStore] = useMemoryStore();
  const sounds = useMemorySounds();

  const onCardRevealToggle = (ingredientId: IngredientId) => {
    const pair = ingredientIdToPair(ingredientId);
    if (!pair) return;

    if (store.currentTurn.includes(ingredientId)) return;
    if (store.discoveredPairs.includes(pair.id)) return;

    if (store.currentTurn.length === 2) {
      setStore("currentTurn", [ingredientId]);
      return;
    }

    const newTurn = [...store.currentTurn, ingredientId];
    setStore("currentTurn", newTurn);

    if (newTurn.length === 2) {
      const pair1 = ingredientIdToPair(newTurn[0]);
      const pair2 = ingredientIdToPair(newTurn[1]);

      if (pair1 && pair2 && pair1.id === pair2.id) {
        document.startViewTransition(() => {
          batch(() => {
            setStore("discoveredPairs", (prev) => [...prev, pair1.id]);
            setStore("currentTurn", []);
            setStore("pairMatchId", pair1.id);
          });
        });
      }
    }
  };

  createEffect(() => {
    if (memoryPairs.length === store.discoveredPairs.length) {
      setStore("status", "complete");
    }
  });

  return (
    <div
      class={cn(
        "flex h-screen w-screen items-center",
        "justify-center perspective-midrange py-[15vh] px-[15vw]",
        "bg-background bg-texture",
      )}
      inert={!!store.pairMatchId}
    >
      <MemoryDiscoveredPairs />
      <div class="grid grid-cols-4 gap-[3vmin] w-[80vmin] aspect-square absolute left-1/2 top-1/2 -translate-1/2">
        <For each={store.cards}>
          {(card, index) => (
            <div
              class={cn(
                "aspect-square relative w-full flex rounded-[1vmin]",
                "starting:opacity-0 starting:translate-y-4 starting:-rotate-5 transition",
                store.discoveredPairs.includes(card.pairId) &&
                  store.status !== "complete" &&
                  "bg-foreground/3",
              )}
              style={{ "transition-delay": `${index() * 10 + 500}ms` }}
              onTransitionStart={(evt) => {
                if (evt.propertyName !== "opacity") return;
                if (index() % 4 === 0) {
                  sounds.playUISound("close", { volume: 0.3 });
                }
              }}
            >
              <Show when={!store.discoveredPairs.includes(card.pairId)}>
                <MemoryCard
                  {...card.ingredient}
                  colorClass={() => card.colorClass}
                  isRevealed={() =>
                    store.currentTurn.includes(card.ingredient.id)
                  }
                  pairIsDiscovered={() =>
                    store.discoveredPairs.includes(card.pairId)
                  }
                  onToggleReveal={() => onCardRevealToggle(card.ingredient.id)}
                  rotateLeft={card.rotateLeft}
                  class={() => "w-full"}
                />
              </Show>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
