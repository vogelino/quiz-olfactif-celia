import { createEffect, createSignal, Show } from "solid-js";
import { cn } from "~/utils/cn";
import { useSoundManager } from "~/utils/SoundManager";
import { MegaphoneOff, MegaphoneOn } from "./icons";
import { ClassValue } from "clsx";
import { Button } from "./ui/Button";

type SoundControlProps = {
  className?: ClassValue;
};

export function SoundControl(props: SoundControlProps) {
  const [soundIsOn, setSoundIsOn] = createSignal(true);
  const soundManager = useSoundManager();

  createEffect(() => {
    if (soundIsOn()) soundManager.setMasterVolume(1);
    if (!soundIsOn()) soundManager.setMasterVolume(0);
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setSoundIsOn(!soundIsOn())}
      class={cn("cursor-pointer", props.className)}
    >
      <Show when={soundIsOn()}>
        <MegaphoneOn />
      </Show>
      <Show when={!soundIsOn()}>
        <MegaphoneOff />
      </Show>
    </Button>
  );
}
