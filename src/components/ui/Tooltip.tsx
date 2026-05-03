import { Component, ComponentProps, JSXElement } from "solid-js";
import { Dynamic } from "solid-js/web";

import { cn } from "~/utils/cn";

import { Button } from "./Button";


type TooltipProps = {
  text: () => JSXElement;
  id: string;
  trigger?: Component<ComponentProps<typeof Button>>;
  class?: string;
};

export function Tooltip(props: TooltipProps) {
  let ref: HTMLSpanElement | undefined;

  return (
    <div
      class="contents"
      style={{ "--tooltip-anchor-name": `--${props.id}` }}
    >
      <Dynamic
        component={() => {
          const Trigger = props.trigger ?? Button;
          return (
            <Trigger
              class="anchor/(--tooltip-anchor-name)"
              aria-describedby={props.id}
              // @ts-expect-error - This isn't yet supported in typescript
              interestfor={props.id}
            />
          )
        }}
      />
      <span
        ref={ref}
        id={props.id}
        role="tooltip"
        popover
        class={cn(
          "px-4 py-3 m-2 bg-background border border-border shadow-lg",
          "anchored/(--tooltip-anchor-name) try-flip-all fixed",
          "rounded text-foreground",
          "opacity-0 translate-y-2 transition-[display,opacity,translate] transition-discrete",
          "hidden whitespace-nowrap pointer-events-none",
          "anchored-bottom-center/(--tooltip-anchor-name)",
          "open:opacity-100 open:translate-y-0 open:flex",
          "starting:open:opacity-0 starting:open:translate-y-2 delay-0",
          "items-center gap-2",
          props.class,
        )}
      >
        {props.text()}
      </span>
    </div>
  );
}

