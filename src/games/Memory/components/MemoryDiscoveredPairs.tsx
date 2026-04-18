import { For } from "solid-js";
import { useMemoryStore } from "../store";
import { idToMemoryPair, memoryPairs } from "~/data/memory";
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
      <div class="absolute size-[97vmin] left-1/2 top-1/2 -translate-1/2 aspect-square max-w-full max-h-full">
        <For each={pairGroups()}>
          {(pairGroup, pairGroupIndex) => (
            <div
              class={cn(
                "absolute",
                [
                  "top-0 left-0 -translate-full rotate-3",
                  "top-0 left-1/2 -translate-full -rotate-2",
                  "top-0 right-0 translate-x-full -translate-y-full rotate-6",
                  "top-1/2 -translate-y-full right-0 translate-x-full -rotate-6",
                  "bottom-0 right-0 translate-full rotate-1",
                  "bottom-0 left-1/2 -translate-x-full translate-y-2/3 -rotate-3",
                  "bottom-0 left-0 -translate-x-full translate-y-full rotate-6",
                  "left-0 top-1/2 -translate-full -rotate-3",
                ][pairGroupIndex()],
                store.status === "complete" &&
                  [
                    "translate-x-0 translate-y-1/2",
                    "-translate-y-1/2 -translate-x-1/2",
                    "translate-y-1/3 translate-x-0",
                    ,
                    "translate-x-0 -translate-y-1/2",
                    "-translate-x-1/3 translate-y-0",
                    "translate-x-0 -translate-y-1/2",
                  ][pairGroupIndex()],
              )}
            >
              <For each={pairGroup}>
                {(cards) => (
                  <div class="size-[15vmin] relative">
                    <For each={cards}>
                      {(card, cardIdx) => (
                        <MemoryCard
                          {...card.ingredient}
                          colorClass={() => card.colorClass}
                          isRevealed={() => true}
                          pairIsDiscovered={() => true}
                          onToggleReveal={() => {}}
                          rotateLeft={card.rotateLeft}
                          class={() =>
                            cn(
                              "size-[15vmin] absolute top-1/2 left-1/2 -translate-1/2",
                              store.status === "complete" && "dark:glow-ring",
                              cardIdx() === 0
                                ? "translate-x-[calc(-50%-4vmin)] -rotate-4"
                                : "translate-x-[calc(-50%+4vmin)] translate-y-[calc(-50%+4vmin)]",
                            )
                          }
                          fadeWithBgClass={() =>
                            store.status !== "complete" && "opacity-80"
                          }
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
    </div>
  );
}
