import { For } from "solid-js";
import { useMemoryStore } from "../store";
import { idToMemoryPair, MemoryPairId, memoryPairs } from "~/data/memory";
import { Card, createCards } from "../utils/cards";
import { idToIngredient } from "~/data/ingredients";
import { MemoryCard } from "./MemoryCard";
import { cn } from "~/utils/cn";

type PairEdges = [
  topLeft: Card[][],
  top: Card[][],
  topRight: Card[][],
  right: Card[][],
  bottomRight: Card[][],
  bottom: Card[][],
  bottomLeft: Card[][],
  left: Card[][],
];

export function MemoryDiscoveredPairs() {
  const [store] = useMemoryStore();
  const pairGroups = () =>
    store.discoveredPairs.reduce(
      (acc, pairId) => {
        const pair = idToMemoryPair[pairId];
        const ingredients = pair.ingredients.map((id) => idToIngredient[id]);
        const cards = createCards(ingredients);
        const originalIndex = memoryPairs.findIndex(({ id }) => id === pairId);
        const edgeIndex = originalIndex % acc.length;
        acc[edgeIndex] = [...acc[edgeIndex], cards];
        return acc;
      },
      [[], [], [], [], [], [], [], []] as PairEdges,
    );
  return (
    <div class="absolute-full overflow-clip">
      <For each={pairGroups()}>
        {(pairGroup, pairGroupIndex) => (
          <div
            class={cn(
              "absolute",
              [
                "top-16 left-16 -translate-1/2",
                "top-16 left-1/2 -translate-1/2",
                "top-16 right-16 translate-x-1/2 -translate-y-1/2",
                "top-1/2 -translate-y-1/2 right-16 translate-x-1/2",
                "bottom-16 right-16 translate-1/2",
                "bottom-16 left-1/2 -translate-x-1/2 translate-y-1/2",
                "bottom-16 left-16 -translate-x-1/2 translate-y-1/2",
                "left-16 top-1/2 -translate-1/2",
              ][pairGroupIndex()],
            )}
          >
            <For each={pairGroup}>
              {(cards) => (
                <div class="size-32 relative">
                  <For each={cards}>
                    {(card, cardIdx) => (
                      <MemoryCard
                        {...card.ingredient}
                        colorClass={card.colorClass}
                        isRevealed={() => true}
                        pairIsDiscovered={() => true}
                        onToggleReveal={() => {}}
                        rotateLeft={card.rotateLeft}
                        class={cn(
                          "size-32 absolute top-1/2 left-1/2 -translate-1/2",
                          cardIdx() === 0
                            ? "translate-x-[calc(-50%-2rem)]"
                            : "translate-x-[calc(-50%+2rem)] translate-y-[calc(-50%+2rem)]",
                        )}
                      />
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
}
