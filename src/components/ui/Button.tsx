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
        "px-4 py-2 rounded cursor-pointer",
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
