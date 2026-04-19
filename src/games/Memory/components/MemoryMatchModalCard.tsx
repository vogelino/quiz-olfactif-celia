import { idToIngredient, IngredientId } from "@memory/data/ingredients";
import { idToMemoryPair } from "@memory/data/memoryPairs";
import { idToMolecule } from "@memory/data/molecules";
import { useMemoryStore } from "@memory/memoryStore";
import { ClassValue } from "clsx";
import { cn } from "~/utils/cn";

type MemoryMatchModalCardProps = {
  ingredientId: IngredientId;
  className?: ClassValue;
  titleClass?: ClassValue;
};

export function MemoryMatchModalCard(props: MemoryMatchModalCardProps) {
  const [store] = useMemoryStore();
  const pair = () => store.pairMatchId && idToMemoryPair[store.pairMatchId];
  const ingredient = () => idToIngredient[props.ingredientId];
  const molecule = () => {
    const p = pair();
    if (!p) return;
    return idToMolecule[p.molecule];
  };
  return (
    <div
      class={cn(
        "aspect-square rounded-xl relative",
        "flex items-center justify-center",
        "light:texture-mask",
        props.className,
      )}
      style={{
        "view-transition-name": `memory-card-${ingredient().id}`,
      }}
    >
      <img
        src={`/memory/ingredients/${ingredient().id}.webp`}
        aria-title={ingredient().title}
        class={cn(
          "absolute inset-x-0 top-0 scale-35 w-full h-6/7",
          "object-contain opacity-70",
        )}
      />
      <img
        src="/memory/card-front.webp"
        aria-hidden="true"
        class={cn(
          "absolute-full w-auto rounded-xl object-cover",
          "-z-10 pointer-events-auto select-none",
          "glow-ring",
        )}
      />
      <div
        aria-hidden="true"
        class={cn(
          "absolute inset-px rounded-xl",
          "z-10 mix-blend-color",
          molecule()?.colorClass,
        )}
        style={{
          "mask-image": `url('/memory/card-front.webp')`,
          "mask-size": "cover",
        }}
      />
      <span
        class={cn(
          "absolute bottom-0 h-1/2 left-1/2 -translate-x-1/2 font-headline",
          "text-xl md:text-2xl lg:text-3xl uppercase font-bold whitespace-nowrap opacity-90",
          "text-black/90 flex items-center",
        )}
      >
        <span class={cn("inline-block tracking-widest", props.titleClass)}>
          {ingredient().title}
        </span>
      </span>
    </div>
  );
}
