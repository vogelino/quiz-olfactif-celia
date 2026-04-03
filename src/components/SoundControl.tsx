import { createEffect, createSignal, Match, Show, Switch } from "solid-js";
import { cn } from "~/utils/cn";
import { useSoundManager } from "~/utils/SoundManager";

type SoundControlProps = {
  soundIsOn: () => boolean;
  toggleSound: () => void;
};

export function SoundControl() {
  const [soundIsOn, setSoundIsOn] = createSignal(true);
  const soundManager = useSoundManager();

  createEffect(() => {
    if (soundIsOn()) soundManager.setMasterVolume(1);
    if (!soundIsOn()) soundManager.setMasterVolume(0);
  });

  return (
    <button
      onClick={() => setSoundIsOn(!soundIsOn())}
      class={cn("fixed top-4 right-4 z-50 cursor-pointer")}
    >
      <Show when={soundIsOn()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-volume-2"
        >
          <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path>
          <path d="M16 9a5 5 0 0 1 0 6"></path>
          <path d="M19.364 18.364a9 9 0 0 0 0-12.728"></path>
        </svg>
      </Show>
      <Show when={!soundIsOn()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-volume-x"
        >
          <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path>
          <line x1="22" x2="16" y1="9" y2="15"></line>
          <line x1="16" x2="22" y1="9" y2="15"></line>
        </svg>
      </Show>
    </button>
  );
}
