import { Ingredient, ingredients } from "~/data/ingredients";
import { ingredientIdToPair, MemoryPairId } from "~/data/memory";
import { idToMolecule } from "~/data/molecules";

export type Card = {
  ingredient: Ingredient;
  pairId: MemoryPairId;
  colorClass: string;
  rotateLeft: boolean;
};

export const createCards = (source: Ingredient[]) =>
  source.flatMap((ingredient, index) => {
    const pair = ingredientIdToPair(ingredient.id);
    if (!pair) return [];

    return [
      {
        ingredient,
        pairId: pair.id,
        colorClass: String(idToMolecule[pair.molecule].colorClass),
        rotateLeft: index % 2 === 0,
      } satisfies Card,
    ];
  });

const shuffleCards = (source: Card[]) => {
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

export const getShuffledCards = () => shuffleCards(createCards(ingredients));
