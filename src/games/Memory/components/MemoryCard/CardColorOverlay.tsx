import { ClassValue } from "clsx";

import { cn } from "~/utils/cn";

type CardColorOverlayProps = {
  class?: () => ClassValue;
};

export function CardColorOverlay(props: CardColorOverlayProps) {
  return (
    <div
      aria-hidden="true"
      class={cn(
        "absolute inset-0 aspect-square rounded-lg",
        "z-0 mix-blend-screen mask-cover",
        props.class?.(),
      )}
    />
  );
}
