import { For, batch, createEffect } from "solid-js";
import { ingredientIdToPair, memoryPairs } from "~/data/memory";
import { MemoryCard } from "./MemoryCard";
import { IngredientId } from "~/data/ingredients";
import { useMemoryStore } from "../store";
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
        batch(() => {
          setStore("discoveredPairs", (prev) => [...prev, pair1.id]);
          setStore("currentTurn", []);
          setStore("pairMatchId", pair1.id);
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
      class="flex h-screen w-screen items-center justify-center perspective-midrange bg-background-muted"
      inert={!!store.pairMatchId}
    >
      <div class="grid grid-cols-4 gap-6 size-[70vh]">
        <For each={store.cards}>
          {(card) => (
            <MemoryCard
              {...card.ingredient}
              colorClass={card.colorClass}
              isRevealed={() =>
                store.currentTurn.includes(card.ingredient.id) ||
                store.discoveredPairs.includes(card.pairId)
              }
              pairIsDiscovered={() =>
                store.discoveredPairs.includes(card.pairId)
              }
              onToggleReveal={() => onCardRevealToggle(card.ingredient.id)}
              rotateLeft={card.rotateLeft}
            />
          )}
        </For>
      </div>
    </div>
  );
}
