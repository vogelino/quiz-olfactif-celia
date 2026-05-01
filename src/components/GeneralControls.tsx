import { JSXElement } from "solid-js";
import { cn } from "~/utils/cn";

type GeneralControlsProps = {
  children: JSXElement;
};

export function GeneralControls(props: GeneralControlsProps) {
  return (
    <nav
      class={cn("fixed top-4 right-4 z-50", "flex gap-2 items-center")}
      aria-label="General controls"
    >
      <ul class="contents">{props.children}</ul>
    </nav>
  );
}
