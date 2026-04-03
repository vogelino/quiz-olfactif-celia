import { MemoryPair } from "~/data/memory";
import { cn } from "~/utils/cn";

type MemoryMatchModalProps = MemoryPair & {
  onClose: () => void;
};

export function MemoryMatchModal({ onClose }: MemoryMatchModalProps) {
  let modal!: HTMLDialogElement;
  return (
    <dialog
      id="memory-match-modal"
      ref={modal!}
      class={cn(
        "w-screen h-screen fixed inset-0 z-10 bg-white",
        "flex justify-center items-center",
      )}
    >
      <button
        onClick={() => {
          modal?.close();
          onClose();
        }}
      >
        X
      </button>
    </dialog>
  );
}
