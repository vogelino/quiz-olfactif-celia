
import { Hotkey, HotkeySequence } from "@omniaura/solid-hotkeys";

import { ShortcutKey, ShortcutsList } from "~/components/ShortcutsList";

const uiShortcuts = new Map<ShortcutKey, string>([
  ["Enter", "Confirm selection/continue action"],
  ["Escape", "Close modals or exit screen"],
  ["?" as Hotkey, "Show/hide this shortcuts list"],
  ["M", "Mute/Unmute sounds"],
  ["R", "Restart the game"],
]);

const debuggerShortcuts = new Map<ShortcutKey, string>([
  [["D", "T"], "Toggle debugger"],
  [["D", "D"], "Expand/collapse debugger"],
]);

const navigationShortcuts = new Map<ShortcutKey, string>([
  ["Tab", "Focus next interactive element"],
  ["ArrowUp", "Focus on card above"],
  ["ArrowDown", "Focus on card below"],
  ["ArrowLeft", "Focus on card to the left"],
  ["ArrowRight", "Focus on card to the right"],
  [["A-D", "1-4"] as unknown as HotkeySequence, "Reveal card A1 to D4"],
]);

const shortcuts = new Map<string, Map<ShortcutKey, string>>([
  ["Game Controls", uiShortcuts],
  ["Navigation", navigationShortcuts],
]);

if (import.meta.env.DEV) {
  shortcuts.set("Debug Controls", debuggerShortcuts);
}

export function MemoryShortcutList() {
  return <ShortcutsList shortcutsMap={shortcuts} />;
}
