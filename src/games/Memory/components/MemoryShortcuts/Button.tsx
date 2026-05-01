import { createHotkey } from "@omniaura/solid-hotkeys";

import { Keyboard } from "~/components/icons";
import { Button } from "~/components/ui/Button";
import Modal from "~/components/ui/Modal";

import { MemoryShortcutList } from "./List";

export function MemoryShortcutsButton() {
  const modalId = "memory-shortcuts-modal";

  createHotkey("H", () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    if (!modal) return;
    if (modal.open) {
      modal.close();
    } else {
      modal.showModal();
    }
  });

  return (
    <>
      <Button
        commandfor={modalId}
        command="show-modal"
        aria-controls={modalId}
        aria-label="View keyboard shortcuts"
        variant="ghost"
        size="icon"
      >
        <Keyboard />
      </Button>
      <Modal
        id={modalId}
        title="Keyboard Shortcuts"
        class="w-(--breakpoint-sm) max-w-[calc(100vw-2rem)]"
      >
        <MemoryShortcutList />
      </Modal>
    </>
  );
}
