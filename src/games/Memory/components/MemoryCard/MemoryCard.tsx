import { Ingredient } from "@memory/data/ingredients";
import { useMemorySounds } from "@memory/memorySounds";
import { ClassValue } from "clsx";
import { createEffect, mergeProps, onCleanup } from "solid-js";
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
  "data-card-position"?: string;
};

export function MemoryCard(_props: MemoryCardProps) {
  const props = mergeProps({ disabled: false }, _props);
  const sounds = useMemorySounds();
  const turnAround = () => props.pairIsDiscovered() || props.isRevealed();
  let lastTurnAround: boolean | null = null;

  createEffect(() => {
    if (lastTurnAround === false && turnAround()) sounds.playUISound("flip");
    lastTurnAround = turnAround();
  });

  onCleanup(() => (lastTurnAround = null));

  return (
    <button
      onFocus={() => props.onFocus?.()}
      onMouseEnter={() =>
        sounds.playUISound("hover1", {
          volume: 0.2,
        })
      }
      class={cn(
        "relative @container/card transition",
        "focus-visible:outline-none focus-visible:glow-ring-double",
        !props.pairIsDiscovered() && "cursor-pointer",
        props.rotateLeft ? "-rotate-z-1" : "rotate-z-1",
        !props.pairIsDiscovered() && !props.isRevealed() && "hover:scale-105",
        props.rotateLeft && !props.pairIsDiscovered() && !props.isRevealed() && "hover:-rotate-2",
        !props.rotateLeft && !props.pairIsDiscovered() && !props.isRevealed() && "hover:rotate-2",
        props.pairIsDiscovered() && "cursor-default size-full",
        props.class?.(),
      )}
      onClick={() => {
        sounds.playUISound("click1");
        props.onToggleReveal();
      }}
      style={{
        "view-transition-name": `memory-card-${props.id}`,
      }}
      disabled={props.disabled}
      data-card-position={props["data-card-position"]}
    >
      <span class="sr-only">
        {getAriaLabelByState({
          title: props.title,
          isRevealed: props.isRevealed(),
          pairIsDiscovered: props.pairIsDiscovered(),
          suffix: props.ariaLabelSuffix,
        })}
      </span>
      <CardFront
        id={() => props.id}
        colorClass={props.colorClass}
        title={() => props.title}
        fadeWithBgClass={props.fadeWithBgClass}
        class={() => cn(!turnAround() && "rotate-y-180", !props.pairIsDiscovered() && "glow-ring")}
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
