import { batch, ComponentProps } from "solid-js";

import { useMemoryStore } from "@memory/memoryStore";
import { getShuffledCards } from "@memory/utils/memoryCardsUtil";
import { RefreshCcw } from "~/components/icons";
import { Button } from "~/components/ui/Button";
import { KeyIndicator } from "~/components/ui/KeyIndicator";
import { Tooltip } from "~/components/ui/Tooltip";

export function MemoryRestartButton(props: ComponentProps<typeof Button>) {
  const [, setStore] = useMemoryStore();

  return (
    <Tooltip
      id="memory-restart-button-tooltip"
      text={() => (
        <span class="flex items-center gap-2">
          Restart game
          <KeyIndicator key="R" />
        </span>
      )}
      trigger={(triggerProps) => (
        <Button
          {...props}
          {...triggerProps}
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
        >
          <span class="sr-only">Restart game</span>
          <RefreshCcw />
        </Button>
      )}
    />
  );
}
