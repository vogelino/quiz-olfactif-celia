import { ClassValue } from "clsx";
import { Accessor, ComponentProps, Show } from "solid-js";

import { cn } from "~/utils/cn";

import { MegaphoneOff, MegaphoneOn } from "./icons";
import { Button } from "./ui/Button";

type SoundControlProps = ComponentProps<typeof Button> & {
  className?: ClassValue;
  soundIsOn: Accessor<boolean>;
  onSoundOnChange: (isOn: boolean) => void;
};

export function SoundControl(props: SoundControlProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => props.onSoundOnChange(!props.soundIsOn())}
      {...props}
      class={cn("cursor-pointer", props.className)}
    >
      <span class="sr-only">
        {props.soundIsOn() ? "Turn off sounds" : "Turn on sounds"}
      </span>
      <Show when={props.soundIsOn()}>
        <MegaphoneOn />
      </Show>
      <Show when={!props.soundIsOn()}>
        <MegaphoneOff />
      </Show>
    </Button>
  );
}
