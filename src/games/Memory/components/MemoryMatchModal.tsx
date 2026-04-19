import confetti from "@hiseb/confetti";
import { MemoryMatchModalCard } from "@memory/components/MemoryMatchModalCard";
import { ShardUnderlinedText } from "@memory/components/ui/ShardUnderlinedText";
import { idToIngredient } from "@memory/data/ingredients";
import { idToMemoryPair } from "@memory/data/memoryPairs";
import { idToMolecule } from "@memory/data/molecules";
import { useMemorySounds } from "@memory/memorySounds";
import { useMemoryStore } from "@memory/memoryStore";
import { createHotkey } from "@omniaura/solid-hotkeys";
import { createEffect, Match, Show, Switch } from "solid-js";
import { Button } from "~/components/ui/Button";
import { TextReveal } from "~/components/ui/TextReveal";
import { cn } from "~/utils/cn";

export function MemoryMatchModal() {
  const [store, setStore] = useMemoryStore();
  const sounds = useMemorySounds();

  const pairMatch = () => {
    const pairMatchId = store.pairMatchId;
    return pairMatchId ? idToMemoryPair[pairMatchId] : null;
  };

  const isLastMatch = () => {
    if (!pairMatch()) return false;
    const discoveredPairsCount = store.discoveredPairs.length;
    const totalPairsCount = Object.keys(idToMemoryPair).length;
    return discoveredPairsCount === totalPairsCount;
  };

  const onContinue = () => {
    document.startViewTransition(() => {
      setStore("pairMatchId", null);
      sounds.playUISound("click1", { volume: 0.5 });
      sounds.playUISound("close");
    });
  };

  createHotkey("Enter", onContinue);
  createHotkey("Space", onContinue);

  createEffect(() => {
    if (!pairMatch()) return;
    sounds.playUISound("close");
    setTimeout(() => {
      sounds.playUISound(["match1", "match2", "match3"]);
    }, 50);
    setTimeout(() => {
      confetti({});
      sounds.playUISound("firework");
    }, 250);
    setTimeout(() => {
      sounds.playUISound("particles1", { volume: 0.3 });
    }, 280);
  });

  return (
    <Show when={pairMatch()}>
      {(pair) => {
        const ingredientA = () => idToIngredient[pair().ingredients[0]];
        const ingredientB = () => idToIngredient[pair().ingredients[1]];
        const molecule = () => idToMolecule[pair().molecule];

        return (
          <dialog
            id="memory-match-modal"
            class={cn(
              "w-screen h-screen fixed inset-0 z-10 bg-background-muted bg-texture",
              "overflow-y-auto flex flex-col text-foreground justify-center",
            )}
          >
            <div class="fixed inset-6 border-shards dark:invert rounded-full" />
            <div
              class={cn(
                "w-screen h-fit flex flex-col justify-center items-center gap-12",
                "relative",
              )}
            >
              <div class="flex flex-col items-center shrink-0 gap-3">
                <div
                  class={cn("starting:opacity-0 delay-800 transition-opacity")}
                >
                  <img
                    src={`/memory/molecules/${molecule().id}.webp`}
                    aria-title={molecule().title}
                    class={cn(
                      "h-12 dark:invert dark:mix-blend-screen mix-blend-multiply mb-4",
                    )}
                  />
                </div>
                <h2 class="text-7xl font-bold text-center font-headline w-4xl texture-mask">
                  <TextReveal
                    text="It's a Match!"
                    fontFamily="Pouler"
                    fontSize={72}
                    class="[--start-delay:500ms]"
                  />
                </h2>
                <h3
                  class={cn(
                    "text-xl flex flex-col gap-5 items-center transition",
                    "slide-up delay-700 uppercase tracking-widest font-headline",
                  )}
                >
                  <ShardUnderlinedText>{molecule().title}</ShardUnderlinedText>
                </h3>
                <p class="mt-4 w-full max-w-prose text-center text-lg text-balance">
                  <TextReveal
                    text={pair().description}
                    fontFamily="Martian Grotesk"
                    fontSize={18}
                    class="[--stagger-unit:1ms] [--start-delay:600ms] ease-out-smooth"
                  />
                </p>
              </div>
              <div class="flex flex-col relative items-center">
                <section
                  class={cn(
                    "grid grid-cols-[1fr_auto_1fr] gap-x-8 gap-y-4 items-start",
                  )}
                >
                  <MemoryMatchModalCard
                    ingredientId={ingredientA().id}
                    className={cn("-rotate-1 size-[25vmin]")}
                  />
                  <div
                    class={cn(
                      "text-4xl font-headline translate-y-[13vmin]",
                      "delay-100 slide-up",
                    )}
                  >
                    &
                  </div>
                  <MemoryMatchModalCard
                    ingredientId={ingredientB().id}
                    className={cn("rotate-1 size-[25vmin]")}
                  />
                </section>
              </div>
              <footer
                class={cn(
                  "flex justify-center shrink-0 pb-16",
                  "delay-1300 duration-[2s] slide-up",
                )}
              >
                <Button
                  onClick={onContinue}
                  class="text-lg uppercase"
                  onMouseEnter={() => {
                    sounds.playUISound(["sniff1", "sniff2", "sniff3"], {
                      volume: 0.2,
                    });
                  }}
                >
                  <Switch>
                    <Match when={isLastMatch()}>
                      Well{" "}
                      <span class="font-headline tracking-wider">Done</span>!
                    </Match>
                    <Match when={!isLastMatch()}>
                      Find{" "}
                      <span class="font-headline tracking-wider">More</span>!
                    </Match>
                  </Switch>
                </Button>
              </footer>
            </div>
          </dialog>
        );
      }}
    </Show>
  );
}
