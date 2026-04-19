import { Ingredient } from "@memory/data/ingredients";
import { useMemorySounds } from "@memory/memorySounds";
import { ClassValue } from "clsx";
import { createEffect, onCleanup, Show } from "solid-js";
import { cn } from "~/utils/cn";

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
    "transition-transform backface-hidden relative",
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
      <div
        class={cn(
          innerCommonClasses,
          "light:texture-mask",
          !turnAround() && "rotate-y-180",
          !pairIsDiscovered() && "glow-ring",
        )}
      >
        <div
          class={cn(
            "w-full aspect-square relative rounded-lg contain-size",
            "flex justify-center max-w-full max-h-full",
            "mask-[url('/memory/card-front.webp')] mask-cover",
          )}
        >
          <div
            data-id="card-front-color"
            aria-hidden="true"
            class={cn(
              "absolute inset-0 aspect-square rounded-lg",
              "z-0 mix-blend-screen mask-cover",
              colorClass?.(),
            )}
          />
          <img
            data-id="card-front-illustration"
            src={`/memory/ingredients/${id}.webp`}
            aria-label={`Illustration of ${title}`}
            class={cn(
              "absolute inset-x-0 top-0 w-full scale-35 h-6/7",
              "object-contain",
            )}
          />
          <img
            data-id="card-front-image"
            src="/memory/card-front.webp"
            class={cn("absolute-full aspect-square rounded-lg", "-z-20")}
            aria-hidden="true"
          />
          <span
            data-id="card-front-title"
            class={cn(
              "absolute inset-x-0 bottom-0 h-1/2 flex items-center",
              "justify-center text-xl font-bold text-black font-headline tracking-widest",
              "text-xs md:text-sm lg:text-base",
            )}
          >
            {title}
          </span>
          <div
            data-id="fade-out-overlay"
            aria-hidden="true"
            class={cn(
              "absolute inset-0",
              "z-20 bg-background bg-texture opacity-0",
              fadeWithBgClass?.(),
            )}
          />
        </div>
      </div>
      <img
        data-id="card-back-image"
        src="/memory/card-back.webp"
        class={cn(
          innerCommonClasses,
          "glow-ring texture-mask",
          turnAround() && "rotate-y-180",
        )}
      />
    </button>
  );
}
