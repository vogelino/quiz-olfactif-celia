import { ClassValue } from "clsx";

import { useMemoryStore } from "~/games/Memory/memoryStore";
import { cn } from "~/utils/cn";

type MemoryScoreProps = {
  class?: () => ClassValue;
};

export function MemoryScore(props: MemoryScoreProps) {
  const [store] = useMemoryStore();

  return (
    <dl
      aria-label="Memory game score"
      class={cn(
        "flex sm:justify-center gap-x-2 slide-up delay-200 [corner-shape:scoop] rounded-lg",
        "bg-background bg-texture text-foreground px-4 sm:px-6 pt-3 pb-2 texture-mask max-sm:w-48",
        "border-2 border-foreground max-sm:max-w-[calc(100vw-10rem)] max-sm:flex-wrap",
        props.class?.(),
      )}
    >
      <ScoreItem label={() => "Turns:"} value={() => store.turnsCount} />
      <ScoreItem
        label={() => "Best Streak:"}
        value={() => store.pairsBestStreak}
      />
      <ScoreItem
        label={() => "Discovered:"}
        value={() => store.discoveredPairs.length}
      />
    </dl>
  );
}

type ScoreItemProps = {
  label: () => string;
  value: () => number;
};

const formatter = new Intl.NumberFormat();

function ScoreItem(props: ScoreItemProps) {
  return (
    <>
      <dt class="sm:font-headline max-sm:font-bold tracking-widest sm:text-lg uppercase whitespace-nowrap">
        {props.label()}
      </dt>
      <dd class="sm:text-xl sm:-translate-y-0.5 inline-block pr-4 last-of-type:pr-0">
        {formatter.format(props.value())}
      </dd>
    </>
  );
}
