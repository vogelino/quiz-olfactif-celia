import { cva, VariantProps } from "class-variance-authority";
import { children, ComponentProps, mergeProps, Show, splitProps } from "solid-js";

import { cn } from "~/utils/cn";

import styles from "./Button.module.css";

const buttonVariants = cva(
  cn(
    "rounded cursor-pointer border border-transparent",
    "focus-visible:outline focus-visible:outline-2",
    "focus-visible:outline-foreground focus-visible:rounded-xl",
    "hover:bg-foreground/5 relative text-2xl uppercase",
    styles.btnTransition,
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "bg-transparent text-foreground hover:bg-transparent",
          "hover:scale-105 active:scale-95 w-[195px] h-[80px]",
          "focus-visible:outline-none focus-visible:glow-ring-double",
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

export function Button(_props: ButtonProps) {
  const mergedProps = mergeProps({ variant: "primary" } satisfies ButtonProps, _props);
  const [props, rest] = splitProps(mergedProps, ["children", "class", "variant", "size"]);
  const safeChildren = children(() => props.children);

  return (
    <button
      {...rest}
      class={cn(
        buttonVariants({
          variant: props.variant,
          size: props.size,
        }),
        props.class,
      )}
    >
      <Show when={props.variant === "primary"}>
        <img
          alt=""
          src="/images/button.webp"
          class={cn("absolute size-full inset-0", "pointer-events-none dark:invert")}
          aria-hidden="true"
        />
      </Show>
      <span class={cn("relative z-10")}>{safeChildren()}</span>
    </button>
  );
}
