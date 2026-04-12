import { cn } from "~/utils/cn";
import { Button } from "../../../components/ui/Button";
import { useMemoryStore } from "../store";
import { onMount } from "solid-js";
import { WavyUnderlinedText } from "~/components/ui/WavyUnderlinedText";
import { MegaphoneOn } from "~/components/icons";
import { useMemorySounds } from "../memorySounds";
import { createHotkey } from "@omniaura/solid-hotkeys";

export function MemoryStart() {
  const [, setStore] = useMemoryStore();
  const sounds = useMemorySounds();

  onMount(() => sounds.stopAllMusicLoops());

  const onStart = () => {
    setStore("status", "started");
    sounds.playUISound("click");
    sounds.playMusicLoop(
      ["mainTheme1", "mainTheme2", "mainTheme3", "mainTheme4"],
      { volume: 0.6 },
    );
  };

  createHotkey("Enter", onStart);
  createHotkey("Space", onStart);

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
        <p class="text-2xl max-w-xl text-center text-balance leading-normal">
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
          onMouseEnter={() => {
            sounds.playUISound(["sniff1", "sniff2", "sniff3"], {
              volume: 0.2,
            });
          }}
          onClick={onStart}
          class="text-lg uppercase mt-6"
        >
          Get <span class="font-headline tracking-wide text-base">Started</span>
          !
        </Button>
      </div>
    </div>
  );
}
