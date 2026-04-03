import { cn } from "~/utils/cn";
import { Button } from "../../../components/ui/Button";
import { useMemoryStore } from "../store";
import { useSoundManager } from "~/utils/SoundManager";
import { onMount } from "solid-js";

export function MemoryStart() {
  const [, setStore] = useMemoryStore();
  const soundManager = useSoundManager();

  onMount(() => soundManager.stopAllLoops());

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
          "py-16 px-20 rounded-lg",
        )}
      >
        <h1 class="text-7xl font-bold text-center font-headline">
          The Olfactive Memory Game!
        </h1>
        <p class="text-4xl max-w-xl leading-snug mb-12 text-center text-balance">
          Find pairs of raw material cards and discover what they have in
          common!
        </p>
        <Button
          onClick={() => {
            setStore("status", "started");
            soundManager.play("click");
            soundManager.play("match");
            soundManager.playLoop("music", { volume: 0.4 });
          }}
          class="text-lg"
        >
          Start Finding Matches
        </Button>
      </div>
    </div>
  );
}
