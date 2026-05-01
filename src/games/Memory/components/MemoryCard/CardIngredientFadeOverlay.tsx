import { ClassValue } from "clsx";
import { cn } from "~/utils/cn";

type CardFadeOverlayProps = {
  class?: () => ClassValue;
};

export function CardFadeOverlay({ class: className }: CardFadeOverlayProps) {
  return (
    <div
      aria-hidden="true"
      class={cn("absolute inset-0", "z-20 bg-background bg-texture opacity-0", className?.())}
    />
  );
}
