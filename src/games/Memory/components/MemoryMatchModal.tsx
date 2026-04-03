import { idToIngredient } from "~/data/ingredients";
import { idToMolecule } from "~/data/molecules";
import { cn } from "~/utils/cn";
import { MemoryMatchModalCard } from "./MemoryMatchModalCard";
import { Button } from "../../../components/ui/Button";
import { useMemoryStore } from "../store";

export function MemoryMatchModal() {
  const [store, setStore] = useMemoryStore();

  if (store.pairMatch === null) return;

  let modal!: HTMLDialogElement;
  const ingredientA = idToIngredient[store.pairMatch.ingredients[0]];
  const ingredientB = idToIngredient[store.pairMatch.ingredients[1]];
  const molecule = idToMolecule[store.pairMatch.molecule];

  return (
    <dialog
      id="memory-match-modal"
      ref={modal!}
      class={cn(
        "w-screen h-screen fixed inset-0 z-10 bg-muted text-foreground pt-12 pb-16 px-12",
        "grid grid-rows-[auto_1fr_auto] justify-center items-center gap-12",
      )}
    >
      <div class="flex flex-col items-center shrink-0 gap-4">
        <h2 class="text-7xl font-bold text-center">It's a Match!</h2>
        <h3 class="text-5xl flex flex-col gap-5 items-center">
          <span>{molecule.title}</span>
          <img
            src={`/memory/molecules/${molecule.id}.webp`}
            aria-title={molecule.title}
            class="h-12 dark:invert dark:mix-blend-screen mix-blend-multiply"
          />
        </h3>
        <p class="mt-4 max-w-prose text-center text-lg">
          {store.pairMatch.description}
        </p>
      </div>
      <div class="grow flex flex-col self-stretch h-full contain-size relative">
        <section
          class={cn(
            "absolute-full",
            "grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] gap-x-8 gap-y-4 items-center contain-size",
          )}
        >
          <div class="size-full contain-size overflow-clip flex items-center justify-center relative">
            <MemoryMatchModalCard
              {...ingredientA}
              className="-rotate-1 w-full max-w-full max-h-full"
              colorClass={molecule.colorClass}
            />
          </div>
          <div class="text-4xl">&</div>
          <div class="h-full contain-size overflow-clip flex items-center justify-center relative">
            <MemoryMatchModalCard
              {...ingredientB}
              className="rotate-1 w-full max-w-full max-h-full"
              colorClass={molecule.colorClass}
            />
          </div>
          <strong class="text-3xl text-center">{ingredientA.title}</strong>
          <div />
          <strong class="text-3xl text-center">{ingredientB.title}</strong>
        </section>
      </div>
      <footer class="flex justify-center shrink-0">
        <Button onClick={() => setStore("pairMatch", null)}>
          Fing other matches →
        </Button>
      </footer>
    </dialog>
  );
}
