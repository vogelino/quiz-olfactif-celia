import { Accessor, ComponentProps, Show } from "solid-js";

import { cn } from "~/utils/cn";

import { MegaphoneOff, MegaphoneOn } from "./icons";
import { Button } from "./ui/Button";
import { KeyIndicator } from "./ui/KeyIndicator";
import { Tooltip } from "./ui/Tooltip";

type SoundControlProps = ComponentProps<typeof Button> & {
  soundIsOn: Accessor<boolean>;
  onSoundOnChange: (isOn: boolean) => void;
};

export function SoundControl(props: SoundControlProps) {
  return (
    <Tooltip
      id="sound-control-tooltip"
      text={() => (
        <>
          Toggle sound
          <KeyIndicator key="M" />
        </>
      )}
      trigger={(triggerProps) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => props.onSoundOnChange(!props.soundIsOn())}
          {...props}
          {...triggerProps}
          class={cn("cursor-pointer", props.class, triggerProps.class)}
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
      )}
    />
  );
}
