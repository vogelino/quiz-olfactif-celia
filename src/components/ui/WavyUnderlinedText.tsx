import { ClassValue } from "clsx";
import { JSXElement } from "solid-js";
import { cn } from "~/utils/cn";

type WavyUnderlinedTextProps = {
  children: JSXElement;
  class?: ClassValue;
};

export function WavyUnderlinedText(props: WavyUnderlinedTextProps) {
  return (
    <span
      class={cn(
        "no-underline relative overflow-clip whitespace-nowrap",
        "underline-offset-4 pb-3",
        props.class,
      )}
    >
      {props.children}
      <span
        class={cn(
          "underline decoration-wavy decoration-foreground-muted/30",
          "absolute top-0 left-0 text-transparent animate-marquee",
          "pointer-events-none select-none",
        )}
        aria-hidden="true"
      >
        {props.children}
        {props.children}
      </span>
    </span>
  );
}
