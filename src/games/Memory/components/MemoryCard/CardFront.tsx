import { ClassValue } from "clsx";
import { ComponentProps, splitProps } from "solid-js";
import { CardColorOverlay } from "~/games/Memory/components/MemoryCard/CardColorOverlay";
import { CardFrontImage } from "~/games/Memory/components/MemoryCard/CardFrontImage";
import { CardIllustration } from "~/games/Memory/components/MemoryCard/CardIllustration";
import { CardFadeOverlay } from "~/games/Memory/components/MemoryCard/CardIngredientFadeOverlay";
import { CardIngredientTitle } from "~/games/Memory/components/MemoryCard/CardIngredientTitle";
import { IngredientId } from "~/games/Memory/data/ingredients";
import { cn } from "~/utils/cn";

type CardFrontProps = Omit<ComponentProps<"div">, "id" | "title" | "class"> & {
  id: () => IngredientId;
  title: () => string;
  class?: () => ClassValue;
  colorClass?: () => ClassValue;
  fadeWithBgClass?: () => ClassValue;
};

export function CardFront(_props: CardFrontProps) {
  const [props, rest] = splitProps(_props, [
    "class",
    "fadeWithBgClass",
    "id",
    "colorClass",
    "title",
  ]);

  return (
    <div
      {...rest}
      class={cn(
        "w-full rounded aspect-square max-w-full max-h-full",
        "transition-transform backface-hidden relative",
        "pointer-events-none select-none absolute top-1/2 left-1/2 -translate-1/2",
        "light:texture-mask",
        props.class?.(),
      )}
    >
      <div
        class={cn(
          "w-full aspect-square relative rounded-lg contain-size",
          "flex justify-center max-w-full max-h-full",
          "mask-[url('/memory/card-front.webp')] mask-cover",
        )}
      >
        <CardColorOverlay class={props.colorClass} />
        <CardIllustration id={props.id} title={props.title} />
        <CardFrontImage />
        <CardIngredientTitle title={props.title} />
        <CardFadeOverlay class={props.fadeWithBgClass} />
      </div>
    </div>
  );
}
