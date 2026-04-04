import { children, ComponentProps } from "solid-js";
import { cn } from "~/utils/cn";

interface ButtonProps extends ComponentProps<"button"> {}

export function Button({
  children: child,
  class: className,
  ...rest
}: ButtonProps) {
  const safeChildren = children(() => child);
  return (
    <button
      {...rest}
      class={cn(
        "px-4 py-2 rounded cursor-pointer transition hover:scale-105 active:scale-95",
        "ease-[cubic-bezier(0.175,0.885,0.32,1.275)] duration-300",
        "bg-foreground text-background hover:bg-foreground/80",
        "focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
        className,
      )}
    >
      {safeChildren()}
    </button>
  );
}
