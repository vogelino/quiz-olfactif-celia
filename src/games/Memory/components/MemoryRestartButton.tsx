import { useMemoryStore } from "@memory/memoryStore";
import { getShuffledCards } from "@memory/utils/memoryCardsUtil";
import { batch, ComponentProps } from "solid-js";
import { RefreshCcw } from "~/components/icons";
import { Button } from "~/components/ui/Button";

export function MemoryRestartButton(props: ComponentProps<typeof Button>) {
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
          setStore("status", "started");
          setStore("turnsCount", 0);
          setStore("pairsStreak", 0);
        });
      }}
      {...props}
    >
      <span class="sr-only">Restart game</span>
      <RefreshCcw />
    </Button>
  );
}
