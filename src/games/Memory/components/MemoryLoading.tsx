import { cn } from "~/utils/cn";

type MemoryLoadingProps = {
  percentage: number;
};

export function MemoryLoading(props: MemoryLoadingProps) {
  return (
    <div class={cn("fixed w-screen h-screen inset-0 bg-background-muted z-10")}>
      <div
        class={cn(
          "w-screen h-screen relative",
          "flex justify-center items-center font-headline text-9xl",
        )}
      >
        <div
          aria-hidden="true"
          class={cn(
            "size-full bg-background absolute inset-0 -z-10",
            "transition-transform origin-left",
          )}
          style={{ scale: `${props.percentage / 100} 1` }}
        />
        {props.percentage}%
      </div>
    </div>
  );
}
