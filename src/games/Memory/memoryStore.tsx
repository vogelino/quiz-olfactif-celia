import { createContext, JSXElement, useContext } from "solid-js";
import { createStore } from "solid-js/store";

import { IngredientId } from "@memory/data/ingredients";
import { MemoryPairId } from "@memory/data/memoryPairs";
import { Card, getShuffledCards } from "@memory/utils/memoryCardsUtil";

export const statuses = ["loading", "initial", "started", "complete"] as const;
export type Status = (typeof statuses)[number];

type StoreType = {
  cards: Card[];
  pairMatchId: MemoryPairId | null;
  status: Status;
  currentTurn: IngredientId[];
  turnsCount: number;
  pairsStreak: number;
  pairsBestStreak: number;
  discoveredPairs: MemoryPairId[];
  debuggerStatus: "hidden" | "expanded" | "collapsed";
  error?: string;
};

const defaultStore = () => ({
  pairMatchId: null,
  status: "loading" as const,
  currentTurn: [],
  turnsCount: 0,
  pairsStreak: 0,
  pairsBestStreak: 0,
  discoveredPairs: [],
  cards: getShuffledCards(),
  debuggerStatus: import.meta.env.DEV ? "collapsed" : "hidden",
  error: undefined,
} satisfies StoreType);

export const createMemoryStore = () => {
  const [val, setVal] = createStore<StoreType>(defaultStore());
  return [val, setVal] as const;
}
type StoreReturn = ReturnType<typeof createMemoryStore>;

const MemoryStoreContext = createContext<StoreReturn>();

export const MemoryStoreProvider = (props: { children: JSXElement }) => (
  <MemoryStoreContext.Provider value={createMemoryStore()}>
    {props.children}
  </MemoryStoreContext.Provider>
);

export const useMemoryStore = () => useContext(MemoryStoreContext)!;
