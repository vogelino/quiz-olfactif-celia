import { JSXElement, Show } from "solid-js";

import { GeneralControls } from "~/components/GeneralControls";
import { SoundControl } from "~/components/SoundControl";

import { useMemorySounds } from "../memorySounds";
import { useMemoryStore } from "../memoryStore";
import { MemoryDebugger } from "./MemoryDebugger";
import { MemoryRestartButton } from "./MemoryRestartButton";
import { MemoryScore } from "./MemoryScore";
import { MemoryShortcutsButton } from "./MemoryShortcuts";

type MemoryLayoutProps = {
  children: JSXElement;
};

export function MemoryLayout(props: MemoryLayoutProps) {
  const [store] = useMemoryStore();
  const sounds = useMemorySounds();
  return (
    <main class="contents">
      <Show when={store.status === "started" && !store.pairMatchId}>
        <MemoryScore class={() => "absolute top-4 left-1/2 -translate-x-1/2 z-10"} />
      </Show>
      <Show when={["started", "complete"].includes(store.status)}>
        <GeneralControls>
          <li class="contents">
            <MemoryRestartButton
              onMouseEnter={() =>
                sounds.playUISound(["sniff1", "sniff2", "sniff3"], {
                  volume: 0.2,
                })
              }
            />
          </li>
          <li class="contents">
            <SoundControl
              soundIsOn={sounds.soundIsOn}
              onSoundOnChange={(isNowOn) => {
                if (isNowOn) return sounds.turnOnSounds();
                sounds.turnOffSounds();
              }}
              onMouseEnter={() =>
                sounds.playUISound(["sniff1", "sniff2", "sniff3"], {
                  volume: 0.2,
                })
              }
            />
          </li>
          <li class="contents">
            <MemoryShortcutsButton />
          </li>
        </GeneralControls>
      </Show>
      {props.children}
      <Show when={import.meta.env.DEV}>
        <MemoryDebugger />
      </Show>
    </main>
  );
}
