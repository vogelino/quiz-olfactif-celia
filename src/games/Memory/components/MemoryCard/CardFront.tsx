import { ClassValue } from "clsx";
import { CardColorOverlay } from "~/games/Memory/components/MemoryCard/CardColorOverlay";
import { CardFrontImage } from "~/games/Memory/components/MemoryCard/CardFrontImage";
import { CardIllustration } from "~/games/Memory/components/MemoryCard/CardIllustration";
import { CardFadeOverlay } from "~/games/Memory/components/MemoryCard/CardIngredientFadeOverlay";
import { CardIngredientTitle } from "~/games/Memory/components/MemoryCard/CardIngredientTitle";
import { IngredientId } from "~/games/Memory/data/ingredients";
import { cn } from "~/utils/cn";

type CardFrontProps = {
  id: () => IngredientId;
  title: () => string;
  class?: () => ClassValue;
  colorClass?: () => ClassValue;
  fadeWithBgClass?: () => ClassValue;
};

export function CardFront({
  class: className,
  fadeWithBgClass,
  id,
  colorClass,
  title,
}: CardFrontProps) {
  return (
    <div
      class={cn(
        "w-full rounded aspect-square max-w-full max-h-full",
        "transition-transform backface-hidden relative",
        "pointer-events-none select-none absolute top-1/2 left-1/2 -translate-1/2",
        "light:texture-mask",
        className?.(),
      )}
    >
      <div
        class={cn(
          "w-full aspect-square relative rounded-lg contain-size",
          "flex justify-center max-w-full max-h-full",
          "mask-[url('/memory/card-front.webp')] mask-cover",
        )}
      >
        <CardColorOverlay class={colorClass} />
        <CardIllustration id={id} title={title} />
        <CardFrontImage />
        <CardIngredientTitle title={title} />
        <CardFadeOverlay class={fadeWithBgClass} />
      </div>
    </div>
  );
}
