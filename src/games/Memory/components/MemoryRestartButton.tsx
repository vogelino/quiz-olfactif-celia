import { Button } from "~/components/ui/Button";
import { useMemoryStore } from "@memory/memoryStore";
import { batch, ComponentProps } from "solid-js";
import { getShuffledCards } from "@memory/utils/memoryCardsUtil";
import { RefreshCcw } from "~/components/icons";

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
          setStore("status", "initial");
        });
      }}
      {...props}
    >
      <RefreshCcw />
    </Button>
  );
}
