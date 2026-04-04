import { Button } from "~/components/ui/Button";
import { useMemoryStore } from "../store";
import { batch } from "solid-js";
import { getShuffledCards } from "../utils/cards";
import { RefreshCcw } from "~/components/icons";

export function MemoryRestartButton() {
  const [, setStore] = useMemoryStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        batch(() => {
          setStore("cards", getShuffledCards());
          setStore("currentTurn", []);
          setStore("discoveredPairs", []);
          setStore("error", undefined);
          setStore("pairMatchId", null);
          setStore("status", "initial");
        });
      }}
    >
      <RefreshCcw />
    </Button>
  );
}
