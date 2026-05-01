import { createHotkey } from "@omniaura/solid-hotkeys";
import { onMount } from "solid-js";

import { useMemorySounds } from "@memory/memorySounds";
import { useMemoryStore } from "@memory/memoryStore";
import { MegaphoneOn } from "~/components/icons";
import { Button } from "~/components/ui/Button";
import { TextReveal } from "~/components/ui/TextReveal";
import { ShardUnderlinedText } from "~/games/Memory/components/ui/ShardUnderlinedText";
import { cn } from "~/utils/cn";

export function MemoryStart() {
  const [, setStore] = useMemoryStore();
  const sounds = useMemorySounds();

  onMount(() => {
    sounds.stopAllMusicLoops();
    const startButton = document.getElementById("start-button");
    startButton?.focus();
  });

  const onStart = () => {
    document.startViewTransition(() => {
      setStore("status", "started");
      sounds.playUISound("click1");
      sounds.playMusicLoop("mainTheme", { volume: 0.5 });
    });
  };

  createHotkey("Enter", onStart);
  createHotkey("Space", onStart);

  return (
    <div
      class={cn(
        "fixed inset-0 w-screen h-screen contain-size pb-16",
        "flex items-center justify-center flex-col gap-6",
        "bg-background bg-texture",
      )}
    >
      <div
        class={cn(
          "flex items-center justify-center flex-col gap-4",
          "py-16 rounded-lg w-[90vw]",
        )}
      >
        <h1 class="text-7xl font-bold text-center font-headline w-full texture-mask">
          <TextReveal
            text={`The Olfactive
Memory Game!`}
            fontFamily="Pouler"
            fontSize={72}
            class="[--stagger-unit:10ms]"
          />
        </h1>
        <div class="text-2xl w-full max-w-2xl text-center text-balance leading-normal">
          <TextReveal
            text="Find pairs of raw material cards and discover what they have in common!"
            fontFamily="Martian Grotesk"
            fontSize={24}
            class="[--stagger-unit:2ms] [--start-delay:250ms] max-w-2xl"
          />
        </div>
        <ShardUnderlinedText class="flex gap-2 text-lg text-foreground delay-500 transition-all">
          Turn you sound on!
          <MegaphoneOn
            aria-hidden="true"
            class={cn(
              "animate-wiggle text-foreground",
              "starting:opacity-0 transition starting:-rotate-90 delay-500",
              "duration-700 ease-in-out",
            )}
          />
        </ShardUnderlinedText>
        <div class={cn("delay-1300 duration-[2s] slide-up mt-6")}>
          <Button
            id="start-button"
            onMouseEnter={() => {
              sounds.playUISound(["sniff1", "sniff2", "sniff3"], {
                volume: 0.2,
              });
            }}
            onClick={onStart}
          >
            Play <span class="font-headline tracking-wide">Now</span>!
          </Button>
        </div>
      </div>
    </div>
  );
}
