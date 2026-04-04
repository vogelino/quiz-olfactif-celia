import { JSXElement } from "solid-js";
import { cn } from "~/utils/cn";
import { SoundControl } from "./SoundControl";

type GeneralControlsProps = {
  children: JSXElement;
};

export function GeneralControls(props: GeneralControlsProps) {
  return (
    <div class={cn("fixed top-4 right-4 z-50", "flex gap-2 items-center")}>
      {props.children}
      <SoundControl />
    </div>
  );
}
