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
        "flex justify-center gap-x-2 slide-up delay-200 [corner-shape:scoop] rounded-lg",
        "bg-background bg-texture text-foreground px-6 pt-3 pb-2 texture-mask border-dashed",
        "border border-foreground max-sm:flex-col",
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
      <dt class="font-headline tracking-widest text-lg uppercase whitespace-nowrap">
        {props.label()}
      </dt>
      <dd class="text-xl -translate-y-0.5 inline-block pr-4 last-of-type:pr-0">
        {formatter.format(props.value())}
      </dd>
    </>
  );
}
