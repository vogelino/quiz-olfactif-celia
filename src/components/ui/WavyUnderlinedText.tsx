import { ClassValue } from "clsx";

import { cn } from "~/utils/cn";

type WavyUnderlinedTextProps = {
  children: string;
  class?: ClassValue;
  underlineClass?: ClassValue;
};

export function WavyUnderlinedText(props: WavyUnderlinedTextProps) {
  return (
    <span
      class={cn(
        "no-underline relative overflow-clip whitespace-nowrap",
        "underline-offset-4 pb-3 decoration-foreground-muted",
        "transition starting:translate-y-2 starting:opacity-0",
        "duration-[3s] ease-[cubic-bezier(0,1.01,0,1)]",
        props.class,
      )}
    >
      {props.children}
      <span
        class={cn(
          "underline decoration-wavy opacity-30 decoration-inherit",
          "absolute top-0 left-0 text-transparent animate-marquee",
          "pointer-events-none select-none transition-opacity",
          "starting:opacity-0",
          props.underlineClass,
        )}
        aria-hidden="true"
      >
        {`${props.children}`.repeat(2)}
      </span>
    </span>
  );
}
