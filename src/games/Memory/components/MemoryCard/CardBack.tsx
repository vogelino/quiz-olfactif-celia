import { ClassValue } from "clsx";
import { cn } from "~/utils/cn";

type CardBackProps = {
  class?: () => ClassValue;
};

export function CardBack({ class: className }: CardBackProps) {
  return (
    <img
      src="/memory/card-back.webp"
      class={cn(
        "glow-ring texture-mask",
        "w-full rounded aspect-square max-w-full max-h-full",
        "transition-transform backface-hidden relative",
        "pointer-events-none absolute top-1/2 left-1/2 -translate-1/2",
        className?.(),
      )}
    />
  );
}
