import { cn } from "~/utils/cn";

type CardIngredientTitleProps = {
  title: () => string;
};

export function CardIngredientTitle({ title }: CardIngredientTitleProps) {
  return (
    <span
      class={cn(
        "absolute inset-x-0 bottom-0 h-1/2 flex items-center",
        "justify-center text-xl font-bold text-black font-headline tracking-widest",
        "text-xs md:text-sm lg:text-base",
      )}
    >
      {title()}
    </span>
  );
}
