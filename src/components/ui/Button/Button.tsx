import { cva, VariantProps } from "class-variance-authority";
import { children, ComponentProps, Show } from "solid-js";
import { cn } from "~/utils/cn";
import styles from "./Button.module.css";

const buttonVariants = cva(
  cn(
    "rounded cursor-pointer border border-transparent",
    "focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background focus-visible:ring-foreground",
    "hover:bg-foreground/5 relative",
    styles.btnTransition,
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "bg-foreground text-background hover:bg-foreground/80",
          "border-foreground hover:border-foreground/80",
          "hover:scale-105 active:scale-95 texture-mask",
        ),
        secondary: cn("bg-background text-foreground border-border"),
        ghost: cn("bg-transparent"),
      },
      size: {
        default: "px-4 py-2",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);
type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonProps = ComponentProps<"button"> & ButtonVariants;

export function Button({
  children: child,
  class: className,
  variant = "primary",
  size,
  ...rest
}: ButtonProps) {
  const safeChildren = children(() => child);
  return (
    <button {...rest} class={buttonVariants({ variant, size, className })}>
      {safeChildren()}
      <Show when={variant === "primary"}>
        <span
          class={cn(
            "absolute -inset-4 -translate-y-0.5",
            "pointer-events-none box-content border-shards invert z-10",
          )}
          aria-hidden="true"
        />
      </Show>
    </button>
  );
}
