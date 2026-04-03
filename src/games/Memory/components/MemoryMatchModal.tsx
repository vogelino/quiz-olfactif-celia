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
        "w-screen h-screen fixed inset-0 z-10 bg-white pt-12 pb-16 px-12",
        "grid grid-rows-[auto_1fr_auto] justify-center items-center gap-12",
      )}
    >
      <div class="flex flex-col items-center shrink-0 gap-4">
        <h2 class="text-7xl font-bold">It's a Match!</h2>
        <h3 class="text-5xl flex gap-5 items-center">
          <span>{molecule.title}</span>
          <img
            src={`/memory/molecules/${molecule.id}.webp`}
            aria-title={molecule.title}
            class="h-12"
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
            "grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto] gap-8 items-center contain-size",
          )}
        >
          <div class="h-full contain-size flex items-center justify-center">
            <MemoryMatchModalCard
              {...ingredientA}
              className="-rotate-1 h-full"
              colorClass={molecule.colorClass}
            />
          </div>
          <div class="text-4xl">&</div>
          <div class="h-full contain-size flex items-center justify-center">
            <MemoryMatchModalCard
              {...ingredientB}
              className="rotate-1 h-full"
              colorClass={molecule.colorClass}
            />
          </div>
          <strong class="text-4xl text-center">{ingredientA.title}</strong>
          <div />
          <strong class="text-4xl text-center">{ingredientB.title}</strong>
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
