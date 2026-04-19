import { Ingredient } from "@memory/data/ingredients";
import { useMemorySounds } from "@memory/memorySounds";
import { ClassValue } from "clsx";
import { createEffect, onCleanup } from "solid-js";
import { cn } from "~/utils/cn";
import { CardBack } from "./CardBack";
import { CardFront } from "./CardFront";

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
      <CardFront
        id={() => id}
        colorClass={colorClass}
        title={() => title}
        fadeWithBgClass={fadeWithBgClass}
        class={() =>
          cn(
            !turnAround() && "rotate-y-180",
            !pairIsDiscovered() && "glow-ring",
          )
        }
      />
      <CardBack class={() => cn(turnAround() && "rotate-y-180")} />
    </button>
  );
}
