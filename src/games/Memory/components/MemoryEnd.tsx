import confetti from "@hiseb/confetti";
import { ShardUnderlinedText } from "@memory/components/ui/ShardUnderlinedText";
import { useMemorySounds } from "@memory/memorySounds";
import { useMemoryStore } from "@memory/memoryStore";
import { getShuffledCards } from "@memory/utils/memoryCardsUtil";
import { batch, onMount } from "solid-js";
import { Button } from "~/components/ui/Button";
import { TextReveal } from "~/components/ui/TextReveal";
import { cn } from "~/utils/cn";

export function MemoryEnd() {
  const [, setStore] = useMemoryStore();
  const sounds = useMemorySounds();

  onMount(() => {
    sounds.stopAllMusicLoops();
    sounds.playUISound("success");
    let positionList = [
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.6 },
      { x: window.innerWidth * 0.25, y: window.innerHeight * 0.4 },
      { x: window.innerWidth * 0.75, y: window.innerHeight * 0.3 },
    ];
    for (let i = 0; i < positionList.length; i++) {
      setTimeout(() => {
        confetti({ position: positionList[i] });
        sounds.playUISound("firework");
      }, i * 250);
      setTimeout(() => {
        sounds.playUISound("particles1", { volume: 0.3 });
      }, 300);
    }
  });

  return (
    <div
      class={cn(
        "w-screen h-screen inset-0 contain-size pb-16 fixed z-10",
        "flex items-center justify-center flex-col gap-6",
      )}
    >
      <div
        class={cn(
          "flex items-center justify-center flex-col gap-4",
          "py-16 rounded-lg",
        )}
      >
        <h1 class="text-7xl font-bold text-center font-headline w-4xl max-w-[calc(100vw-10rem)] texture-mask">
          <TextReveal
            text={`You Found
Them All!`}
            fontFamily="Pouler"
            fontSize={72}
            class="[--stagger-unit:10ms]"
          />
        </h1>
        <div class="text-2xl w-2xl max-w-[calc(100vw-10rem)] text-center text-balance leading-normal">
          <TextReveal
            text="Well done! You've beaten the game like a professional perfumer."
            fontFamily="Martian Grotesk"
            fontSize={24}
            class="[--stagger-unit:2ms] [--start-delay:250ms]"
          />
        </div>
        <span class="flex gap-2">
          <ShardUnderlinedText class="text-lg text-foreground-muted starting:decoration-transparent delay-500 transition-all">
            Can you finish faster?
          </ShardUnderlinedText>
        </span>
        <div class={cn("delay-1300 duration-[2s] slide-up mt-6")}>
          <Button
            onMouseEnter={() => {
              sounds.playUISound(["sniff1", "sniff2", "sniff3"], {
                volume: 0.2,
              });
            }}
            onClick={() => {
              batch(() => {
                setStore("cards", getShuffledCards());
                setStore("currentTurn", []);
                setStore("discoveredPairs", []);
                setStore("pairMatchId", null);
                setStore("status", "started");
              });
              sounds.playUISound("click1");
            }}
          >
            Play <span class="tracking-wider font-headline">again</span>!
          </Button>
        </div>
      </div>
    </div>
  );
}
