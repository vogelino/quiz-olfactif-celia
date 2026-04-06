import { For } from "solid-js";
import { useMemoryStore } from "../store";
import { idToMemoryPair, memoryPairs } from "~/data/memory";
import { createCards } from "../utils/cards";
import { idToIngredient } from "~/data/ingredients";
import { MemoryCard } from "./MemoryCard";
import { cn } from "~/utils/cn";

export function MemoryDiscoveredPairs() {
  const [store] = useMemoryStore();
  return (
    <For each={store.discoveredPairs}>
      {(pairId, pairIdx) => {
        const pair = idToMemoryPair[pairId];
        const ingredients = pair.ingredients.map((id) => idToIngredient[id]);
        const cards = createCards(ingredients);
        return (
          <div class="absolute-full flex justify-center items-center">
            <div
              class="relative"
              style={{
                "--radius": "45vmax",
                "--total": `${memoryPairs.length}`,
                width: `calc(var(--radius) * 2)`,
                height: `calc(var(--radius) * 2)`,
              }}
            >
              <div
                class="absolute left-1/2 top-1/2 size-48"
                style={{
                  "--i": `${pairIdx()}`,
                  "--angle": `calc(360deg / var(--total) * var(--i))`,
                  transform: `rotate(var(--angle)) translateX(var(--radius)) rotate(calc(-1 * var(--angle)))`,
                }}
              >
                <div class="size-48 relative">
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
                          "size-48 absolute top-1/2 left-1/2 -translate-1/2",
                          cardIdx() === 0
                            ? "translate-x-[calc(-50%-4rem)]"
                            : "translate-x-[calc(-50%+4rem)] translate-y-[calc(-50%+4rem)]",
                        )}
                      />
                    )}
                  </For>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </For>
  );
}
