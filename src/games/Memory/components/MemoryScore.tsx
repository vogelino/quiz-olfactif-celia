import { ClassValue } from "clsx";
import { useMemoryStore } from "~/games/Memory/memoryStore";
import { cn } from "~/utils/cn";

type MemoryScoreProps = {
  class?: () => ClassValue;
};

export function MemoryScore({ class: className }: MemoryScoreProps) {
  const [store] = useMemoryStore();

  return (
    <div
      class={cn(
        "flex justify-center gap-x-6 slide-up delay-200 [corner-shape:scoop] rounded-lg",
        "bg-background bg-texture text-foreground px-6 pt-3 pb-2 texture-mask border-dashed",
        "border border-foreground max-sm:flex-col",
        className?.(),
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
    </div>
  );
}

type ScoreItemProps = {
  label: () => string;
  value: () => number;
};

const formatter = new Intl.NumberFormat();

function ScoreItem({ label, value }: ScoreItemProps) {
  return (
    <div class="flex items-center justify-between gap-x-3">
      <span class="font-headline tracking-widest text-lg uppercase whitespace-nowrap">
        {label()}
      </span>
      <span class="text-xl -translate-y-0.5 inline-block">
        {formatter.format(value())}
      </span>
    </div>
  );
}
