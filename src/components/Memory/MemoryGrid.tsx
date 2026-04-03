import { For } from "solid-js";
import { ingredientIdToPair, MemoryPairId } from "~/data/memory";
import { MemoryCard } from "./MemoryCard";
import { createStore } from "solid-js/store";
import { IngredientId, ingredients } from "~/data/ingredients";
import { idToMolecule } from "~/data/molecules";

type StoreType = {
  revealedCards: IngredientId[];
  discoveredPairs: MemoryPairId[];
};

type MemoryGridProps = {
  onPairFound: (pairId: MemoryPairId) => void;
  inert?: boolean;
};

export function MemoryGrid({ onPairFound, inert = false }: MemoryGridProps) {
  const [store, setStore] = createStore<StoreType>({
    revealedCards: [],
    discoveredPairs: [],
  });
  const onCardRevealToggle = (
    ingredientId: IngredientId,
    pairId: MemoryPairId,
  ) => {
    if (store.revealedCards.includes(ingredientId)) return;
    if (store.discoveredPairs.includes(pairId)) return;

    console.log("Revealing ingredient:", ingredientId);
    const newArr = [...store.revealedCards, ingredientId];
    const finalArr =
      newArr.length === 3 ? [ingredientId] : newArr.length > 2 ? [] : newArr;

    if (finalArr.length === 2) {
      const pair1 = ingredientIdToPair(finalArr[0]);
      const pair2 = ingredientIdToPair(finalArr[1]);

      if (pair1 && pair2 && pair1.id === pair2.id) {
        setStore("discoveredPairs", (prev) =>
          prev.includes(pair1.id) ? prev : [...prev, pair1.id],
        );
        onPairFound(pair1.id);
      }
    }
    setStore("revealedCards", finalArr);
  };

  return (
    <div
      class="flex h-screen w-screen items-center justify-center perspective-midrange"
      inert={inert}
    >
      <div class="grid grid-cols-4 gap-6 size-[70vh]">
        <For each={ingredients.sort(() => (Math.random() > 0.5 ? 1 : -1))}>
          {(item) => {
            const pair = ingredientIdToPair(item.id);
            if (!pair) return null;
            const molecule = idToMolecule[pair.molecule];
            return (
              <MemoryCard
                {...item}
                colorClass={molecule.colorClass}
                isRevealed={() =>
                  store.revealedCards.includes(item.id) ||
                  store.discoveredPairs.includes(pair.id)
                }
                pairIsDiscovered={() => store.discoveredPairs.includes(pair.id)}
                onToggleReveal={() => onCardRevealToggle(item.id, pair.id)}
                rotateLeft={Math.random() > 0.5}
              />
            );
          }}
        </For>
      </div>
    </div>
  );
}
