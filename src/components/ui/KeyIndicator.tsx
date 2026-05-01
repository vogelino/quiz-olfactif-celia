import { createHeldKeys } from "@omniaura/solid-hotkeys";
import { JSXElement } from "solid-js";

import { cn } from "~/utils/cn";

type KeyIndicatorProps = {
  key: string;
  children?: JSXElement;
};

export function KeyIndicator(props: KeyIndicatorProps) {
  const heldKeys = createHeldKeys();
  const isHeld = () => heldKeys().includes(props.key);

  return (
    <kbd
      class={cn(
        "bg-foreground/0 text-muted-foreground font-system font-medium text-sm px-1.5 rounded",
        "border border-border shadow-[0_2px_0_0_var(--color-border)] transition duration-100",
        isHeld() &&
          cn(
            "bg-foreground/5 text-foreground/80 translate-y-0.5",
            "shadow-[0_0_0_0_var(--color-border)] border-foreground/10 border-t-foreground/30",
          ),
      )}
    >
      {props.children || props.key}
    </kbd>
  );
}
