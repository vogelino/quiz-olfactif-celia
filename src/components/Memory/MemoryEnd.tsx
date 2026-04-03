import { cn } from "~/utils/cn";
import { Button } from "../ui/Button";

type MemoryEndProps = {
  onReStart: () => void;
};
export function MemoryEnd({ onReStart }: MemoryEndProps) {
  return (
    <div
      class={cn(
        "w-screen h-screen contain-size p-12 pb-16",
        "flex items-center justify-center flex-col gap-6",
      )}
    >
      <div
        class={cn(
          "flex items-center justify-center flex-col gap-6",
          "bg-white py-16 px-20 rounded-lg",
        )}
      >
        <h1 class="text-7xl font-bold text-center">You found them all!</h1>
        <p class="text-4xl max-w-xl leading-snug mb-12 text-center text-balance">
          Well done! You've beaten the game like a professional perfumer.
        </p>
        <Button onClick={onReStart} class="text-lg">
          Play again
        </Button>
      </div>
    </div>
  );
}
