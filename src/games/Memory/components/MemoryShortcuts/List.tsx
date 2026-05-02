
import { ShortcutKey, ShortcutsList } from "~/components/ShortcutsList";

const moves = new Map<ShortcutKey, string>([
  ["Enter", "Start game"],
  ["ArrowUp", "Move up"],
  ["ArrowDown", "Move down"],
  ["ArrowLeft", "Move left"],
  ["ArrowRight", "Move right"],
  ["Space", "Reveal card"],
  [["A", "1"], "Reveal card A1"],
  ["Mod+Shift+D", "Debug mode"],
]);

const shortcuts = new Map<string, Map<ShortcutKey, string>>([
  ["Game Controls", moves],
]);

export function MemoryShortcutList() {
  return <ShortcutsList shortcutsMap={shortcuts} />;
}
