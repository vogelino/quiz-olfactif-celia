import { cn } from "~/utils/cn";
import { Button } from "../../../components/ui/Button";
import { useMemoryStore } from "../store";
import { useSoundManager } from "~/utils/SoundManager";
import { onMount } from "solid-js";
import { WavyUnderlinedText } from "~/components/ui/WavyUnderlinedText";
import { MegaphoneOn } from "~/components/icons";

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
          "flex items-center justify-center flex-col gap-4",
          "py-16 px-20 rounded-lg",
        )}
      >
        <h1 class="text-7xl font-bold text-center font-headline max-w-xl">
          <span>The Olfactive</span>
          <span> </span>
          <span>Memory Game!</span>
        </h1>
        <p class="text-3xl max-w-xl text-center text-balance">
          Find pairs of raw material cards and discover what they have in
          common!
        </p>
        <span class="flex gap-2">
          <WavyUnderlinedText class="text-lg text-foreground-muted">
            Turn you sound on!
          </WavyUnderlinedText>
          <MegaphoneOn class="animate-wiggle translate-y-1 text-foreground-muted" />
        </span>
        <Button
          onClick={() => {
            setStore("status", "started");
            soundManager.play("click");
            soundManager.playLoop("music", { volume: 0.6 });
          }}
          class="text-lg uppercase mt-6"
        >
          Get <span class="font-headline tracking-wide text-base">Started</span>
          !
        </Button>
      </div>
    </div>
  );
}
