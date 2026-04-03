import { createContext, JSXElement, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IngredientId } from "~/data/ingredients";
import { MemoryPair, MemoryPairId } from "~/data/memory";
import { Card, getShuffledCards } from "./utils/cards";

type StoreType = {
  cards: Card[];
  pairMatch: MemoryPair | null;
  status: "initial" | "started" | "complete";
  currentTurn: IngredientId[];
  discoveredPairs: MemoryPairId[];
};

const memoryStore = createStore<StoreType>({
  pairMatch: null,
  status: "initial" as const,
  currentTurn: [],
  discoveredPairs: [],
  cards: getShuffledCards(),
});

const MemoryStoreContext = createContext<typeof memoryStore>();

export const MemoryStoreProvider = (props: { children: JSXElement }) => (
  <MemoryStoreContext.Provider value={memoryStore}>
    {props.children}
  </MemoryStoreContext.Provider>
);

export const useMemoryStore = () => useContext(MemoryStoreContext)!;
