import { createContext, JSXElement, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IngredientId } from "~/data/ingredients";
import { MemoryPairId } from "~/data/memory";
import { Card, getShuffledCards } from "./utils/cards";

export const statuses = ["initial", "started", "complete"] as const;
export type Status = (typeof statuses)[number];

type StoreType = {
  cards: Card[];
  pairMatchId: MemoryPairId | null;
  status: Status;
  currentTurn: IngredientId[];
  discoveredPairs: MemoryPairId[];
  debuggerStatus: "expanded" | "collapsed";
};

export const createMemoryStore = () =>
  createStore<StoreType>({
    pairMatchId: null,
    status: "initial" as const,
    currentTurn: [],
    discoveredPairs: [],
    cards: getShuffledCards(),
    debuggerStatus: "collapsed",
  });
type StoreReturn = ReturnType<typeof createMemoryStore>;

const MemoryStoreContext = createContext<StoreReturn>();

export const MemoryStoreProvider = (props: {
  children: JSXElement;
  value: StoreReturn;
}) => (
  <MemoryStoreContext.Provider value={props.value}>
    {props.children}
  </MemoryStoreContext.Provider>
);

export const useMemoryStore = () => useContext(MemoryStoreContext)!;
