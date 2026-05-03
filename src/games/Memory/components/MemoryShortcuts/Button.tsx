import { createHotkey } from "@omniaura/solid-hotkeys";

import { Keyboard } from "~/components/icons";
import { Button } from "~/components/ui/Button";
import { KeyIndicator } from "~/components/ui/KeyIndicator";
import Modal from "~/components/ui/Modal";
import { Tooltip } from "~/components/ui/Tooltip";

import { MemoryShortcutList } from "./List";

export function MemoryShortcutsButton() {
  const modalId = "memory-shortcuts-modal";

  createHotkey({ key: "?", shift: true }, () => {
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
      <Tooltip
        id="memory-shortcuts-button-tooltip"
        text={() => (
          <>
            View keyboard shortcuts
            <KeyIndicator key="?" />
          </>
        )}
        trigger={(triggerProps) => (
          <Button
            {...triggerProps}
            commandfor={modalId}
            command="show-modal"
            aria-controls={modalId}
            variant="ghost"
            size="icon"
          >
            <span class="sr-only">View keyboard shortcuts</span>
            <Keyboard />
          </Button>
        )}
      />
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
