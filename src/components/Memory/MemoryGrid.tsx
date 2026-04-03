import { For, createEffect, createSignal, onMount } from "solid-js";
import { ingredientIdToPair, MemoryPairId, memoryPairs } from "~/data/memory";
import { MemoryCard } from "./MemoryCard";
import { createStore } from "solid-js/store";
import { Ingredient, IngredientId, ingredients } from "~/data/ingredients";
import { idToMolecule } from "~/data/molecules";

type MemoryGridProps = {
  onPairFound: (pairId: MemoryPairId) => void;
  onGridComplete: () => void;
  inert?: boolean;
  currentTurn: IngredientId[];
  discoveredPairs: MemoryPairId[];
  onTurnChange: (newState: IngredientId[]) => void;
  onPairDiscovered: (newPair: MemoryPairId) => void;
};

type CardModel = {
  ingredient: Ingredient;
  pairId: MemoryPairId;
  colorClass: string;
  rotateLeft: boolean;
};

const createCards = (source: Ingredient[]) =>
  source.flatMap((ingredient, index) => {
    const pair = ingredientIdToPair(ingredient.id);
    if (!pair) return [];

    return [
      {
        ingredient,
        pairId: pair.id,
        colorClass: String(idToMolecule[pair.molecule].colorClass),
        rotateLeft: index % 2 === 0,
      } satisfies CardModel,
    ];
  });

const shuffleCards = (source: CardModel[]) => {
  const shuffled = [...source];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.map((card, index) => ({
    ...card,
    rotateLeft: index % 2 === 0,
  }));
};

export function MemoryGrid({
  onPairFound,
  onGridComplete,
  inert = false,
  currentTurn,
  discoveredPairs,
  onTurnChange,
  onPairDiscovered,
}: MemoryGridProps) {
  const [cards, setCards] = createSignal(createCards(ingredients));

  onMount(() => {
    setCards(shuffleCards(createCards(ingredients)));
  });

  const onCardRevealToggle = (ingredientId: IngredientId) => {
    const pair = ingredientIdToPair(ingredientId);
    if (!pair) return;

    if (currentTurn.includes(ingredientId)) return;
    if (discoveredPairs.includes(pair.id)) return;

    if (currentTurn.length === 2) {
      onTurnChange([ingredientId]);
      return;
    }

    const newTurn = [...currentTurn, ingredientId];
    onTurnChange(newTurn);

    if (newTurn.length === 2) {
      const pair1 = ingredientIdToPair(newTurn[0]);
      const pair2 = ingredientIdToPair(newTurn[1]);

      if (pair1 && pair2 && pair1.id === pair2.id) {
        onPairDiscovered(pair1.id);
        onTurnChange([]);
        onPairFound(pair1.id);
      }
    }
  };

  createEffect(() => {
    if (memoryPairs.length === discoveredPairs.length) {
      onGridComplete();
    }
  });

  return (
    <div
      class="flex h-screen w-screen items-center justify-center perspective-midrange"
      inert={inert}
    >
      <div class="grid grid-cols-4 gap-6 size-[70vh]">
        <For each={cards()}>
          {(card) => (
            <MemoryCard
              {...card.ingredient}
              colorClass={card.colorClass}
              isRevealed={() =>
                currentTurn.includes(card.ingredient.id) ||
                discoveredPairs.includes(card.pairId)
              }
              pairIsDiscovered={() => discoveredPairs.includes(card.pairId)}
              onToggleReveal={() => onCardRevealToggle(card.ingredient.id)}
              rotateLeft={card.rotateLeft}
            />
          )}
        </For>
      </div>
    </div>
  );
}
