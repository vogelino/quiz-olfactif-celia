import { cn } from "~/utils/cn";
import { usePreloadedMemoryImages } from "~/games/Memory/hooks/usePreloadedMemoryImages";

type MemoryLoadingProps = {
  percentage: number;
};

export function MemoryLoading(props: MemoryLoadingProps) {
  const { loadingPercentage } = usePreloadedMemoryImages();

  const combinedPercentage = Math.round(
    (loadingPercentage + props.percentage) / 2,
  );
  return (
    <div
      class={cn(
        "fixed w-screen h-screen inset-0 bg-background bg-texture z-10",
      )}
    >
      <div
        class={cn(
          "w-screen h-screen relative z-10",
          "flex justify-center items-center font-headline text-9xl",
        )}
      >
        <div
          aria-hidden="true"
          class={cn(
            "size-full bg-background absolute inset-0 -z-10",
            "transition origin-right",
          )}
          style={{ scale: `${1 - combinedPercentage / 100} 1` }}
        />
        {props.percentage}%
      </div>
    </div>
  );
}
