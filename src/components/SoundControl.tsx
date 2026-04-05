import {
  Accessor,
  ComponentProps,
  createEffect,
  createSignal,
  Show,
} from "solid-js";
import { cn } from "~/utils/cn";
import { MegaphoneOff, MegaphoneOn } from "./icons";
import { ClassValue } from "clsx";
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
      <Show when={props.soundIsOn()}>
        <MegaphoneOn />
      </Show>
      <Show when={!props.soundIsOn()}>
        <MegaphoneOff />
      </Show>
    </Button>
  );
}
