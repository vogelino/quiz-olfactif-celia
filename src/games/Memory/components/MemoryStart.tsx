import { cn } from "~/utils/cn";
import { Button } from "~/components/ui/Button";
import { useMemoryStore } from "@memory/memoryStore";
import { onMount } from "solid-js";
import { WavyUnderlinedText } from "~/components/ui/WavyUnderlinedText";
import { MegaphoneOn } from "~/components/icons";
import { useMemorySounds } from "@memory/memorySounds";
import { createHotkey } from "@omniaura/solid-hotkeys";
import { TextReveal } from "~/components/ui/TextReveal";

export function MemoryStart() {
  const [, setStore] = useMemoryStore();
  const sounds = useMemorySounds();

  onMount(() => sounds.stopAllMusicLoops());

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
        "fixed inset-0 w-screen h-screen contain-size p-12 pb-16",
        "flex items-center justify-center flex-col gap-6",
        "bg-background bg-texture",
      )}
    >
      <div
        class={cn(
          "flex items-center justify-center flex-col gap-4",
          "py-16 px-20 rounded-lg",
        )}
      >
        <h1 class="text-7xl font-bold text-center font-headline w-4xl max-w-[calc(100vw-10rem)] texture-mask">
          <TextReveal
            text={`The Olfactive
Memory Game!`}
            fontFamily="Pouler"
            fontSize={72}
            class="[--stagger-unit:10ms]"
          />
        </h1>
        <p class="text-2xl w-2xl max-w-[calc(100vw-10rem)] text-center text-balance leading-normal">
          <TextReveal
            text="Find pairs of raw material cards and discover what they have in common!"
            fontFamily="Martian Grotesk"
            fontSize={24}
            class="[--stagger-unit:2ms] [--start-delay:250ms]"
          />
        </p>
        <span class="flex gap-2">
          <WavyUnderlinedText class="text-lg text-foreground-muted starting:decoration-transparent delay-500 transition-all">
            Turn you sound on!
          </WavyUnderlinedText>
          <MegaphoneOn
            class={cn(
              "animate-wiggle translate-y-1 text-foreground-muted",
              "starting:opacity-0 transition starting:-rotate-90 delay-500",
              "duration-700 ease-in-out",
            )}
          />
        </span>
        <div class={cn("delay-1300 duration-[2s] slide-up")}>
          <Button
            onMouseEnter={() => {
              sounds.playUISound(["sniff1", "sniff2", "sniff3"], {
                volume: 0.2,
              });
            }}
            onClick={onStart}
            class="text-lg uppercase mt-6"
          >
            Get <span class="font-headline tracking-wide">Started</span>!
          </Button>
        </div>
      </div>
    </div>
  );
}
