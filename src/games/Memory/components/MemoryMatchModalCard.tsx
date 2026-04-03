import { ClassValue } from "clsx";
import { Ingredient } from "~/data/ingredients";
import { cn } from "~/utils/cn";

type MemoryMatchModalCardProps = Ingredient & {
  colorClass: ClassValue;
  className: ClassValue;
};

export function MemoryMatchModalCard({
  illustration,
  title,
  colorClass,
  className,
}: MemoryMatchModalCardProps) {
  return (
    <div
      class={cn(
        "aspect-square rounded shadow relative overflow-clip",
        "shrink flex items-center justify-center",
        className,
      )}
    >
      <img
        src={illustration}
        aria-title={title}
        class={cn("absolute-full", "size-full scale-50 opacity-70")}
      />
      <img
        src="/memory/card-front.webp"
        aria-hidden="true"
        class={cn("absolute-full", "-z-10 pointer-events-auto select-none")}
      />
      <div
        aria-hidden="true"
        class={cn("absolute-full", "z-10 mix-blend-color", colorClass)}
      />
    </div>
  );
}
