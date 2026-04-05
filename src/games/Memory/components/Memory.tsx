import { MemoryGrid } from "./MemoryGrid";
import {
  createEffect,
  createSignal,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from "solid-js";
import { MemoryMatchModal } from "./MemoryMatchModal";
import { MemoryStart } from "./MemoryStart";
import { MemoryEnd } from "./MemoryEnd";
import {
  createMemoryStore,
  MemoryStoreProvider,
  useMemoryStore,
} from "../store";
import { MemoryDebugger } from "./MemoryDebugger";
import { MemoryLoading } from "./MemoryLoading";
import { GeneralControls } from "~/components/GeneralControls";
import { MemoryRestartButton } from "./MemoryRestartButton";
import { SoundControl } from "~/components/SoundControl";
import { useMemorySounds } from "../memorySounds";

function MemoryInner() {
  const [store, setStore] = useMemoryStore();
  const sounds = useMemorySounds();

  createEffect(() => {
    if (!sounds.isError() && sounds.loadingProgess().percentage === 100) {
      setStore("status", "initial");
    }
  });

  return (
    <>
      <GeneralControls>
        <Show when={["started", "complete"].includes(store.status)}>
          <MemoryRestartButton
            onMouseEnter={() =>
              sounds.playUISound(["sniff1", "sniff2", "sniff3"], {
                volume: 0.2,
              })
            }
          />
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
        </Show>
      </GeneralControls>
      <Show when={!!store.error}>{store.error}</Show>
      <Switch>
        <Match when={store.status === "loading"}>
          <MemoryLoading percentage={sounds.loadingProgess().percentage} />
        </Match>
        <Match when={store.status === "initial"}>
          <MemoryStart />
        </Match>
        <Match when={store.status === "started" && !store.pairMatchId}>
          <MemoryGrid />
        </Match>
        <Match when={store.status !== "initial" && store.pairMatchId}>
          <MemoryMatchModal />
        </Match>
        <Match when={store.status === "complete" && !store.pairMatchId}>
          <MemoryEnd />
        </Match>
      </Switch>
      <Show when={import.meta.env.DEV}>
        <MemoryDebugger />
      </Show>
    </>
  );
}

export function Memory() {
  return (
    <MemoryStoreProvider value={createMemoryStore()}>
      <MemoryInner />
    </MemoryStoreProvider>
  );
}
