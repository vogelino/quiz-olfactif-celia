import { IngredientId } from "@memory/data/ingredients";
import { MemoryPairId } from "@memory/data/memoryPairs";
import { Card, getShuffledCards } from "@memory/utils/memoryCardsUtil";
import { createContext, JSXElement, useContext } from "solid-js";
import { createStore } from "solid-js/store";

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
  debuggerStatus: "expanded" | "collapsed";
  error?: string;
};

export const createMemoryStore = () =>
  createStore<StoreType>({
    pairMatchId: null,
    status: "loading" as const,
    currentTurn: [],
    turnsCount: 0,
    pairsStreak: 0,
    pairsBestStreak: 0,
    discoveredPairs: [],
    cards: getShuffledCards(),
    debuggerStatus: "collapsed",
    error: undefined,
  });
type StoreReturn = ReturnType<typeof createMemoryStore>;

const MemoryStoreContext = createContext<StoreReturn>();

export const MemoryStoreProvider = (props: { children: JSXElement; value: StoreReturn }) => (
  <MemoryStoreContext.Provider value={props.value}>{props.children}</MemoryStoreContext.Provider>
);

export const useMemoryStore = () => useContext(MemoryStoreContext)!;
