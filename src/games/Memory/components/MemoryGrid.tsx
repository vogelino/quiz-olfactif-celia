import { MemoryCard } from "@memory/components/MemoryCard";
import { MemoryDiscoveredPairs } from "@memory/components/MemoryDiscoveredPairs";
import { IngredientId } from "@memory/data/ingredients";
import { ingredientIdToPair, memoryPairs } from "@memory/data/memoryPairs";
import { useMemorySounds } from "@memory/memorySounds";
import { useMemoryStore } from "@memory/memoryStore";
import { For, Show, batch, createEffect } from "solid-js";
import { cn } from "~/utils/cn";

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
      setStore("pairsStreak", 0);
      return;
    }

    const newTurn = [...store.currentTurn, ingredientId];
    setStore("currentTurn", newTurn);

    if (newTurn.length === 2) {
      setStore("turnsCount", (prev) => prev + 1);
      const pair1 = ingredientIdToPair(newTurn[0]);
      const pair2 = ingredientIdToPair(newTurn[1]);

      if (pair1 && pair2 && pair1.id === pair2.id) {
        document.startViewTransition(() => {
          batch(() => {
            setStore("discoveredPairs", (prev) => [...prev, pair1.id]);
            setStore("currentTurn", []);
            setStore("pairMatchId", pair1.id);
            setStore("pairsStreak", (prev) => prev + 1);
            setStore("pairsBestStreak", (prev) =>
              Math.max(prev, store.pairsStreak),
            );
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
        "fixed z-0 inset-0 flex h-screen w-screen items-center",
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
              class={cn("aspect-square relative w-full flex")}
              style={{ "transition-delay": `${index() * 10 + 500}ms` }}
              onTransitionStart={(evt) => {
                if (evt.propertyName !== "opacity") return;
                if (index() % 4 === 0) {
                  sounds.playUISound("close", { volume: 0.3 });
                }
              }}
            >
              <img
                aria-hidden="true"
                src="/memory/card-shadow.webp"
                class={cn(
                  "absolute inset-0 size-full transition opacity-0 pointer-events-none",
                  store.discoveredPairs.includes(card.pairId) &&
                    store.status !== "complete" &&
                    cn(
                      "mix-blend-multiply dark:invert dark:mix-blend-screen",
                      [
                        "opacity-10 rotate-0",
                        "opacity-13 rotate-12",
                        "opacity-11 rotate-45",
                        "opacity-8 rotate-90",
                        "opacity-9 rotate-125",
                        "opacity-12 rotate-180",
                      ][index() % 6],
                    ),
                )}
              />
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
                  class={() =>
                    cn(
                      "w-full starting:opacity-0 starting:translate-y-4 starting:-rotate-5 transition",
                    )
                  }
                />
              </Show>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
