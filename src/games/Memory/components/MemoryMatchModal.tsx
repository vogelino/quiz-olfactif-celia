import confetti from "@hiseb/confetti";
import { ShardUnderlinedText } from "@memory/components/ui/ShardUnderlinedText";
import { idToIngredient } from "@memory/data/ingredients";
import { idToMemoryPair } from "@memory/data/memoryPairs";
import { idToMolecule } from "@memory/data/molecules";
import { useMemorySounds } from "@memory/memorySounds";
import { useMemoryStore } from "@memory/memoryStore";
import { createHotkey } from "@omniaura/solid-hotkeys";
import { Match, onMount, Show, Switch } from "solid-js";
import { Button } from "~/components/ui/Button";
import { TextReveal } from "~/components/ui/TextReveal";
import { MemoryCard } from "~/games/Memory/components/MemoryCard";
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

  onMount(() => {
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
          <div
            class={cn(
              "w-screen h-screen fixed inset-0 z-10 bg-background-muted bg-texture",
              "overflow-y-auto text-foreground @container",
            )}
          >
            <div
              id="color-frame"
              class={cn(
                "absolute top-3 h-[calc(100%-1.5rem)] min-h-[calc(100vh-1.5rem)]",
                "border-shards dark:invert rounded-full left-1/2 w-[calc(100vw-2rem)] -translate-x-1/2",
              )}
            />
            <div
              id="color-bg"
              aria-hidden="true"
              class={cn(
                "pointer-events-none",
                "absolute inset-0 w-screen h-screen mix-blend-lighten dark:mix-blend-darken",
                molecule()?.colorClass,
              )}
            />
            <div
              id="color-stain"
              aria-hidden="true"
              class={cn(
                "pointer-events-none",
                "absolute inset-0 w-screen h-screen mix-blend-multiply dark:mix-blend-screen opacity-20 dark:opacity-10",
                "mask-[url('/memory/bg-gradient.webp')] mask-bottom mask-no-repeat mask-cover",
                molecule()?.colorClass,
              )}
            />
            <div
              class={cn(
                "w-[90vw] flex flex-col justify-center items-center gap-12",
                "relative contain-inline-size py-20 mx-auto min-h-screen",
              )}
            >
              <div class="w-full contain-inline-size flex flex-col items-center shrink-0 gap-3">
                <div
                  class={cn("starting:opacity-0 delay-800 transition-opacity")}
                >
                  <img
                    src={`/memory/molecules/${molecule().id}.webp`}
                    alt={`Molecular symbol for molecule: ${molecule().title}`}
                    class={cn(
                      "h-12 dark:invert dark:mix-blend-screen mix-blend-multiply mb-4",
                    )}
                  />
                </div>
                <h2 class="text-7xl font-bold text-center font-headline w-full texture-mask">
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
                <div class="mt-4 w-full max-w-prose text-center text-lg text-balance">
                  <TextReveal
                    text={pair().description}
                    fontFamily="Martian Grotesk"
                    fontSize={18}
                    class="[--stagger-unit:1ms] [--start-delay:600ms] ease-out-smooth"
                  />
                </div>
              </div>
              <div class="flex flex-col relative items-center">
                <section
                  class={cn(
                    "grid grid-cols-[1fr_auto_1fr] gap-x-8 gap-y-4 items-start",
                  )}
                >
                  <MemoryCard
                    {...ingredientA()}
                    colorClass={() => molecule().colorClass}
                    isRevealed={() => true}
                    pairIsDiscovered={() => false}
                    onToggleReveal={() => { }}
                    rotateLeft
                    class={() => "-rotate-1 size-[25vmin]"}
                    ariaLabelSuffix={`Card A`}
                    disabled
                  />
                  <div
                    class={cn(
                      "text-4xl font-headline translate-y-[13vmin]",
                      "delay-100 slide-up",
                    )}
                  >
                    &
                  </div>
                  <MemoryCard
                    {...ingredientB()}
                    colorClass={() => molecule().colorClass}
                    isRevealed={() => true}
                    pairIsDiscovered={() => false}
                    onToggleReveal={() => { }}
                    class={() => "-rotate-1 size-[25vmin]"}
                    ariaLabelSuffix={`Card B`}
                    disabled
                  />
                </section>
              </div>
              <footer
                class={cn(
                  "flex justify-center shrink-0",
                  "delay-1300 duration-[2s] slide-up",
                )}
              >
                <Button
                  onClick={onContinue}
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
          </div>
        );
      }}
    </Show>
  );
}
