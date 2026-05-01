import { HotkeySequence, RegisterableHotkey } from "@omniaura/solid-hotkeys";

import { ShortcutsList } from "~/components/ShortcutsList";

const shortcuts = new Map<RegisterableHotkey | HotkeySequence, string>([
  ["Enter", "Start game"],
  ["ArrowUp", "Move up"],
  ["ArrowDown", "Move down"],
  ["ArrowLeft", "Move left"],
  ["ArrowRight", "Move right"],
  ["Space", "Reveal card"],
]);

export function MemoryShortcutList() {
  return <ShortcutsList shortcutsMap={shortcuts} />;
}
