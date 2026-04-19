import { ClassValue } from "clsx";
import { idToIngredient, IngredientId } from "~/data/ingredients";
import { cn } from "~/utils/cn";
import { useMemoryStore } from "../store";
import { idToMemoryPair } from "~/data/memory";
import { idToMolecule } from "~/data/molecules";

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
        class={cn("absolute-full scale-35 -mt-6", "object-contain opacity-70")}
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
          "absolute bottom-12 left-1/2 -translate-x-1/2 font-headline",
          "text-3xl uppercase font-bold whitespace-nowrap opacity-90",
          "text-black/90",
        )}
      >
        <span class={cn("inline-blockt tracking-widest", props.titleClass)}>
          {ingredient().title}
        </span>
      </span>
    </div>
  );
}
