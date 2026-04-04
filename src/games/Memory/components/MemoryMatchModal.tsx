import { Show } from "solid-js";
import { idToIngredient } from "~/data/ingredients";
import { idToMemoryPair } from "~/data/memory";
import { idToMolecule } from "~/data/molecules";
import { cn } from "~/utils/cn";
import { MemoryMatchModalCard } from "./MemoryMatchModalCard";
import { Button } from "../../../components/ui/Button";
import { useMemoryStore } from "../store";
import { useSoundManager } from "~/utils/SoundManager";
import { WavyUnderlinedText } from "~/components/ui/WavyUnderlinedText";

export function MemoryMatchModal() {
  const [store, setStore] = useMemoryStore();
  const soundManager = useSoundManager();

  const pairMatch = () => {
    const pairMatchId = store.pairMatchId;
    return pairMatchId ? idToMemoryPair[pairMatchId] : null;
  };

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
              "w-screen h-screen fixed inset-0 z-10 bg-background-muted text-foreground pt-12 pb-16 px-12",
              "grid grid-rows-[auto_1fr_auto] justify-center items-center gap-12",
            )}
          >
            <div class="flex flex-col items-center shrink-0 gap-3">
              <img
                src={`/memory/molecules/${molecule().id}.webp`}
                aria-title={molecule().title}
                class="h-12 dark:invert dark:mix-blend-screen mix-blend-multiply mb-4"
              />
              <h2 class="text-7xl font-bold text-center font-headline">
                It's a Match!
              </h2>
              <h3 class="text-2xl flex flex-col gap-5 items-center">
                <WavyUnderlinedText class="underline-offset-8 pb-4">
                  {molecule().title}
                </WavyUnderlinedText>
              </h3>
              <p class="mt-4 max-w-prose text-center text-lg text-balance">
                {pair().description}
              </p>
            </div>
            <div class="grow flex flex-col self-stretch h-full contain-size relative">
              <section
                class={cn(
                  "absolute-full",
                  "grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] gap-x-8 gap-y-4 items-center contain-size",
                )}
              >
                <div class="size-full contain-size flex items-end justify-center relative">
                  <MemoryMatchModalCard
                    ingredientId={ingredientA().id}
                    className="-rotate-1 w-full max-w-full max-h-full"
                  />
                </div>
                <div class="text-4xl font-headline translate-y-2">&</div>
                <div class="h-full contain-size flex items-end justify-center relative">
                  <MemoryMatchModalCard
                    ingredientId={ingredientB().id}
                    className="rotate-1 w-full max-w-full max-h-full"
                  />
                </div>
                <span class="text-2xl text-center uppercase font-medium">
                  {ingredientA().title}
                </span>
                <div />
                <span class="text-2xl text-center uppercase font-medium">
                  {ingredientB().title}
                </span>
              </section>
            </div>
            <footer class="flex justify-center shrink-0">
              <Button
                onClick={() => {
                  setStore("pairMatchId", null);
                  soundManager.play("click", { volume: 0.5 });
                  soundManager.play("close", { volume: 1.5 });
                }}
                class="text-lg uppercase"
              >
                Find{" "}
                <span class="text-base font-headline tracking-wider">More</span>
                !
              </Button>
            </footer>
          </dialog>
        );
      }}
    </Show>
  );
}
