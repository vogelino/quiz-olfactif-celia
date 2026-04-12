import confetti from "@hiseb/confetti";
import { cn } from "~/utils/cn";
import { Button } from "../../../components/ui/Button";
import { useMemoryStore } from "../store";
import { batch, onMount } from "solid-js";
import { getShuffledCards } from "../utils/cards";
import { WavyUnderlinedText } from "~/components/ui/WavyUnderlinedText";
import { useMemorySounds } from "../memorySounds";

export function MemoryEnd() {
  const [, setStore] = useMemoryStore();
  const sounds = useMemorySounds();

  onMount(() => {
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
    }
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
          "flex items-center justify-center flex-col gap-4",
          "py-16 px-20 rounded-lg",
        )}
      >
        <h1 class="text-7xl font-bold text-center font-headline max-w-lg">
          <span>You found</span>
          <span> </span>
          <span>them all!</span>
        </h1>
        <p class="text-2xl max-w-xl text-center text-balance leading-normal">
          Well done! You've beaten the game like a professional perfumer.
        </p>
        <span class="flex gap-2">
          <WavyUnderlinedText class="text-lg text-foreground-muted">
            Can you finish faster?
          </WavyUnderlinedText>
        </span>
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
              setStore("status", "initial");
            });
            sounds.playUISound("click");
          }}
          class="text-lg uppercase mt-6"
        >
          Play <span class="tracking-wider font-headline text-base">again</span>
          !
        </Button>
      </div>
    </div>
  );
}
