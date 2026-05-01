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
  ariaLabelSuffix: string;
  disabled?: boolean;
  onFocus?: () => void;
  'data-card-position'?: string;
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
  ariaLabelSuffix,
  disabled = false,
  onFocus,
  'data-card-position': dataCardPosition,
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
      onFocus={onFocus}
      onMouseEnter={() =>
        sounds.playUISound("hover1", {
          volume: 0.2,
        })
      }
      class={cn(
        "relative @container/card transition",
        "focus-visible:outline-none focus-visible:glow-ring-double",
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
      disabled={disabled}
      data-card-position={dataCardPosition}
    >
      <span class="sr-only">
        {getAriaLabelByState({
          title,
          isRevealed: isRevealed(),
          pairIsDiscovered: pairIsDiscovered(),
          suffix: ariaLabelSuffix,
        })}
      </span>
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
        aria-hidden={!turnAround()}
      />
      <CardBack class={() => cn(turnAround() && "rotate-y-180")} aria-hidden={turnAround()} />
    </button>
  );
}

function getAriaLabelByState({
  title,
  isRevealed,
  pairIsDiscovered,
  suffix,
}: {
  title: string;
  isRevealed: boolean;
  pairIsDiscovered: boolean;
  suffix: string;
}) {
  if (pairIsDiscovered) return `${title} card (${suffix}): Pair discovered`;
  if (isRevealed) return `${title} card (${suffix}): Revealed`;
  return `Memory card (${suffix}): Unrevealed`;
}
