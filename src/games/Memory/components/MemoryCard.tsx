import { ClassValue } from "clsx";
import { Show } from "solid-js";
import { Ingredient } from "~/data/ingredients";
import { cn } from "~/utils/cn";

type MemoryCardProps = Ingredient & {
  colorClass: ClassValue;
  isRevealed: () => boolean;
  pairIsDiscovered: () => boolean;
  onToggleReveal: () => void;
  rotateLeft?: boolean;
};

export function MemoryCard({
  title,
  illustration,
  colorClass,
  isRevealed,
  pairIsDiscovered,
  onToggleReveal,
  rotateLeft,
}: MemoryCardProps) {
  const innerCommonClasses = cn(
    "absolute-full rounded aspect-square",
    "transition-transform shadow backface-hidden",
    "pointer-events-none select-none",
  );
  const turnAround = () => pairIsDiscovered() || isRevealed();
  return (
    <button
      class={cn(
        "relative",
        "transition",
        !pairIsDiscovered() && "cursor-pointer",
        rotateLeft ? "-rotate-z-1" : "rotate-z-1",
        !pairIsDiscovered() && !isRevealed() && "hover:scale-105",
        rotateLeft && !pairIsDiscovered() && !isRevealed() && "hover:-rotate-2",
        !rotateLeft && !pairIsDiscovered() && !isRevealed() && "hover:rotate-2",
        pairIsDiscovered() && "grayscale-100 opacity-50",
      )}
      onClick={onToggleReveal}
    >
      <div class={cn(innerCommonClasses, !turnAround() && "rotate-y-180")}>
        <div
          class={cn(
            "size-full aspect-square relative",
            "flex items-center justify-center",
            pairIsDiscovered() && "bg-background",
          )}
        >
          <img
            src={illustration}
            aria-label={`Illustration of ${title}`}
            class="size-16 aspect-square object-contain opacity-70"
          />
          <Show when={!pairIsDiscovered()}>
            <img
              src="/memory/card-front.webp"
              class={cn("absolute-full aspect-square rounded", "-z-20")}
              aria-hidden="true"
            />
          </Show>
          <div
            aria-hidden="true"
            class={cn(
              "absolute-full aspect-square rounded",
              "z-10 mix-blend-color",
              colorClass,
            )}
          />
        </div>
      </div>
      <img
        src="/memory/card-back.webp"
        class={cn(innerCommonClasses, turnAround() && "rotate-y-180")}
      />
    </button>
  );
}
