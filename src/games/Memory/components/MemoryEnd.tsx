import { cn } from "~/utils/cn";
import { Button } from "../../../components/ui/Button";
import { useMemoryStore } from "../store";
import { batch, onMount } from "solid-js";
import { getShuffledCards } from "../utils/cards";
import { useSoundManager } from "~/utils/SoundManager";

export function MemoryEnd() {
  const [, setStore] = useMemoryStore();
  const soundManager = useSoundManager();

  onMount(() => {
    soundManager.stopAllLoops();
    soundManager.play("success");
  });

  return (
    <div
      class={cn(
        "w-screen h-screen contain-size p-12 pb-16",
        "flex items-center justify-center flex-col gap-6",
      )}
    >
      <div
        class={cn(
          "flex items-center justify-center flex-col gap-6",
          "bg-background py-16 px-20 rounded-lg",
        )}
      >
        <h1 class="text-7xl font-bold text-center">You found them all!</h1>
        <p class="text-4xl max-w-xl leading-snug mb-12 text-center text-balance">
          Well done! You've beaten the game like a professional perfumer.
        </p>
        <Button
          onClick={() => {
            batch(() => {
              setStore("cards", getShuffledCards());
              setStore("currentTurn", []);
              setStore("discoveredPairs", []);
              setStore("pairMatchId", null);
              setStore("status", "initial");
            });
            soundManager.play("click");
          }}
          class="text-lg"
        >
          Play again
        </Button>
      </div>
    </div>
  );
}
