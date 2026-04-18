import { ClassValue } from "clsx";
import { createEffect, onCleanup, Show } from "solid-js";
import { Ingredient } from "~/data/ingredients";
import { cn } from "~/utils/cn";
import { useMemorySounds } from "../memorySounds";

type MemoryCardProps = Ingredient & {
  colorClass: () => ClassValue;
  fadeWithBgClass?: () => ClassValue;
  isRevealed: () => boolean;
  pairIsDiscovered: () => boolean;
  onToggleReveal: () => void;
  rotateLeft?: boolean;
  class?: () => ClassValue;
};

export function MemoryCard({
  id,
  title,
  illustration,
  colorClass,
  fadeWithBgClass,
  isRevealed,
  pairIsDiscovered,
  onToggleReveal,
  rotateLeft,
  class: className,
}: MemoryCardProps) {
  const sounds = useMemorySounds();
  const innerCommonClasses = cn(
    "w-full rounded aspect-square max-w-full max-h-full",
    "transition-transform backface-hidden",
    "pointer-events-none select-none absolute top-1/2 left-1/2 -translate-1/2",
  );
  const turnAround = () => pairIsDiscovered() || isRevealed();
  let lastTurnAround: boolean | null = null;

  createEffect(() => {
    if (lastTurnAround === false && turnAround()) sounds.playUISound("flip");
    lastTurnAround = turnAround();
  });

  onCleanup(() => (lastTurnAround = null));

  return (
    <button
      onMouseEnter={() =>
        sounds.playUISound("hover1", {
          volume: 0.2,
        })
      }
      class={cn(
        "relative @container/card",
        "transition",
        !pairIsDiscovered() && "cursor-pointer",
        rotateLeft ? "-rotate-z-1" : "rotate-z-1",
        !pairIsDiscovered() && !isRevealed() && "hover:scale-105",
        rotateLeft && !pairIsDiscovered() && !isRevealed() && "hover:-rotate-2",
        !rotateLeft && !pairIsDiscovered() && !isRevealed() && "hover:rotate-2",
        pairIsDiscovered() && "cursor-default size-full",
        className?.(),
      )}
      onClick={() => {
        sounds.playUISound("click1");
        onToggleReveal();
      }}
      style={{
        "view-transition-name": `memory-card-${id}`,
      }}
    >
      <div class={cn(innerCommonClasses, !turnAround() && "rotate-y-180")}>
        <div
          class={cn(
            "w-full aspect-square relative rounded-lg contain-size",
            "flex items-center justify-center max-w-full max-h-full",
          )}
        >
          <img
            src={illustration}
            aria-label={`Illustration of ${title}`}
            class="size-[40cqw] aspect-square object-contain opacity-70 -translate-y-5"
          />
          <Show when={!pairIsDiscovered() || isRevealed()}>
            <img
              src="/memory/card-front.webp"
              class={cn(
                "absolute-full aspect-square rounded-lg",
                "-z-20",
                !pairIsDiscovered() && "drop-shadow-xl dark:glow-ring",
              )}
              aria-hidden="true"
            />
            <span class="absolute inset-x-0 bottom-0 h-1/2 flex items-center justify-center text-xl font-bold text-black/90 font-headline tracking-widest">
              {title}
            </span>
          </Show>
          <div
            aria-hidden="true"
            class={cn(
              "absolute-full aspect-square rounded-lg",
              "z-10 mix-blend-color",
              colorClass?.(),
            )}
            style={{
              "mask-image": `url('/memory/card-front.webp')`,
              "mask-size": "cover",
            }}
          />
          <div
            aria-hidden="true"
            class={cn(
              "absolute-full aspect-square rounded-lg",
              "z-10 bg-background bg-texture opacity-0",
              fadeWithBgClass?.(),
            )}
            style={{
              "mask-image": `url('/memory/card-front.webp')`,
              "mask-size": "cover",
            }}
          />
        </div>
      </div>
      <img
        src="/memory/card-back.webp"
        class={cn(
          innerCommonClasses,
          "drop-shadow-xl dark:glow-ring",
          turnAround() && "rotate-y-180",
        )}
      />
    </button>
  );
}
