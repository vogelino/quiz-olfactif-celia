import { ClassValue } from "clsx";

import { cn } from "~/utils/cn";

type CardIllustrationProps = {
  id: () => ClassValue;
  title: () => ClassValue;
};

export function CardIllustration(props: CardIllustrationProps) {
  return (
    <img
      data-id="card-front-illustration"
      src={`/memory/ingredients/${props.id()}.webp`}
      alt={`Illustration of ${props.title()}`}
      class={cn(
        "absolute inset-x-0 top-0 w-full scale-35 h-6/7",
        "object-contain",
      )}
    />
  );
}
