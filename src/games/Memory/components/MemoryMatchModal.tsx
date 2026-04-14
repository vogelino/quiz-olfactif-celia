import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import confetti from "@hiseb/confetti";
import { idToIngredient } from "~/data/ingredients";
import { idToMemoryPair } from "~/data/memory";
import { idToMolecule } from "~/data/molecules";
import { cn } from "~/utils/cn";
import { MemoryMatchModalCard } from "./MemoryMatchModalCard";
import { Button } from "../../../components/ui/Button";
import { useMemoryStore } from "../store";
import { WavyUnderlinedText } from "~/components/ui/WavyUnderlinedText";
import { useMemorySounds } from "../memorySounds";
import { createHotkey } from "@omniaura/solid-hotkeys";
import { TextReveal } from "~/components/ui/TextReveal";

export function MemoryMatchModal() {
  const [store, setStore] = useMemoryStore();
  const sounds = useMemorySounds();

  const pairMatch = () => {
    const pairMatchId = store.pairMatchId;
    return pairMatchId ? idToMemoryPair[pairMatchId] : null;
  };

  const onContinue = () => {
    document.startViewTransition(() => {
      setStore("pairMatchId", null);
      sounds.playUISound("click", { volume: 0.5 });
      sounds.playUISound("close");
    });
  };

  createHotkey("Enter", onContinue);
  createHotkey("Space", onContinue);

  createEffect(() => {
    if (!pairMatch()) return;
    sounds.playUISound(["match1", "match2", "match3"]);
    setTimeout(() => {
      confetti({});
      sounds.playUISound("firework");
    }, 250);
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
              "w-screen h-screen fixed inset-0 z-10 bg-background-muted text-foreground ",
              "overflow-y-auto flex flex-col",
            )}
          >
            <div
              class={cn(
                "w-screen h-fit flex flex-col justify-center items-center gap-12",
                "pt-12 pb-16 px-12 relative",
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
                <h2 class="text-7xl font-bold text-center font-headline w-4xl">
                  <TextReveal
                    text="It's a Match!"
                    fontFamily="Pouler"
                    fontSize={72}
                    class="[--start-delay:500ms]"
                  />
                </h2>
                <h3
                  class={cn(
                    "text-2xl flex flex-col gap-5 items-center transition",
                    "slide-up delay-700",
                  )}
                >
                  <WavyUnderlinedText class="underline-offset-8 pb-4">
                    {molecule().title}
                  </WavyUnderlinedText>
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
                    "pb-16",
                  )}
                >
                  <MemoryMatchModalCard
                    ingredientId={ingredientA().id}
                    className={cn("-rotate-1 size-[25vmin]")}
                    titleClass={cn("slide-up")}
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
                    titleClass={cn("delay-200 slide-up")}
                  />
                </section>
              </div>
              <footer
                class={cn(
                  "flex justify-center shrink-0 pb-16",
                  "delay-1300 duration-[2s] slide-up",
                )}
              >
                <Button onClick={onContinue} class="text-lg uppercase">
                  Find{" "}
                  <span class="text-base font-headline tracking-wider">
                    More
                  </span>
                  !
                </Button>
              </footer>
            </div>
          </dialog>
        );
      }}
    </Show>
  );
}
