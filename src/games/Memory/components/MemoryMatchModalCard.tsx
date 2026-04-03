import { ClassValue } from "clsx";
import { idToIngredient, IngredientId } from "~/data/ingredients";
import { cn } from "~/utils/cn";
import { useMemoryStore } from "../store";
import { idToMemoryPair } from "~/data/memory";
import { idToMolecule } from "~/data/molecules";

type MemoryMatchModalCardProps = {
  ingredientId: IngredientId;
  className?: ClassValue;
};

export function MemoryMatchModalCard(props: MemoryMatchModalCardProps) {
  const [store] = useMemoryStore();
  const pair = () => store.pairMatchId && idToMemoryPair[store.pairMatchId];
  const ingredient = () => idToIngredient[props.ingredientId];
  const illustration = () => ingredient().illustration;
  const molecule = () => {
    const p = pair();
    if (!p) return;
    return idToMolecule[p.molecule];
  };
  return (
    <div
      class={cn(
        "aspect-square rounded-xl shadow relative overflow-clip",
        "shrink flex items-center justify-center",
        props.className,
      )}
    >
      <img
        src={illustration()}
        aria-title={ingredient().title}
        class={cn("absolute-full", "size-full scale-50 opacity-70")}
      />
      <img
        src="/memory/card-front.webp"
        aria-hidden="true"
        class={cn(
          "absolute-full rounded-xl",
          "-z-10 pointer-events-auto select-none",
        )}
      />
      <div
        aria-hidden="true"
        class={cn(
          "absolute-full rounded-xl",
          "z-10 mix-blend-color",
          molecule()?.colorClass,
        )}
      />
    </div>
  );
}
