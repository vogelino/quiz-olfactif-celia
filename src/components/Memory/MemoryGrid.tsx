import { For, createSignal, onMount } from "solid-js";
import { ingredientIdToPair, MemoryPairId } from "~/data/memory";
import { MemoryCard } from "./MemoryCard";
import { createStore } from "solid-js/store";
import { Ingredient, IngredientId, ingredients } from "~/data/ingredients";
import { idToMolecule } from "~/data/molecules";

type StoreType = {
  currentTurn: IngredientId[];
  discoveredPairs: MemoryPairId[];
};

type MemoryGridProps = {
  onPairFound: (pairId: MemoryPairId) => void;
  inert?: boolean;
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

export function MemoryGrid({ onPairFound, inert = false }: MemoryGridProps) {
  const [store, setStore] = createStore<StoreType>({
    currentTurn: [],
    discoveredPairs: [],
  });
  const [cards, setCards] = createSignal(createCards(ingredients));

  onMount(() => {
    setCards(shuffleCards(createCards(ingredients)));
  });

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
        setStore("discoveredPairs", (prev) => [...prev, pair1.id]);
        setStore("currentTurn", []);
        onPairFound(pair1.id);
      }
    }
  };

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
