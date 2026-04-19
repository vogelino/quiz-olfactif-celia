import { ClassValue } from "clsx";
import { JSXElement } from "solid-js";
import { cn } from "~/utils/cn";

export function ShardUnderlinedText(props: {
  children: JSXElement;
  class?: ClassValue;
}) {
  return (
    <span
      class={cn(
        "inline-block relative whitespace-nowrap pb-5",
        "transition starting:translate-y-2 starting:opacity-0",
        "duration-[3s] ease-[cubic-bezier(0,1.01,0,1)]",
        props.class,
      )}
    >
      {props.children}
      <span
        class={cn(
          "absolute w-full h-4 left-0 bottom-0 overflow-clip",
          "mask-[url('/images/bleed-mask-x.webp')] mask-size-[100%_100%]",
          "starting:opacity-0 transition-opacity delay-500 duration-700 ease-in-out",
        )}
      >
        <span
          aria-hidden="true"
          class={cn(
            "absolute w-456.75 h-full left-0 bottom-0",
            "bg-[url('/images/shards-frame.webp')] bg-repeat-x bg-size-[auto_100%]",
            "bg-center animate-marquee dark:invert",
          )}
        />
      </span>
    </span>
  );
}
