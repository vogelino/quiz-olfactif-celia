import { ClassValue } from "clsx";
import { cn } from "~/utils/cn";

type CardIllustrationProps = {
  id: () => ClassValue;
  title: () => ClassValue;
};

export function CardIllustration({ id, title }: CardIllustrationProps) {
  return (
    <img
      data-id="card-front-illustration"
      src={`/memory/ingredients/${id()}.webp`}
      alt={`Illustration of ${title()}`}
      class={cn(
        "absolute inset-x-0 top-0 w-full scale-35 h-6/7",
        "object-contain",
      )}
    />
  );
}
