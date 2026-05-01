import { HotkeySequence, RegisterableHotkey } from "@omniaura/solid-hotkeys";
import { For, Show } from "solid-js";

import { KeyIndicator } from "./ui/KeyIndicator";

export function ShortcutsList(props: {
  shortcutsMap: Map<RegisterableHotkey | HotkeySequence, string>;
}) {
  return (
    <div class="grid gap-x-6 gap-y-2 grid-cols-[1fr_auto]">
      <For each={Array.from(props.shortcutsMap.entries())}>
        {([hotkey, description]) => (
          <>
            <p>{description}</p>
            <div class="flex items-center w-full gap-1">
              <For each={parseHotKey(hotkey)}>
                {(part, index) => (
                  <>
                    <Show when={index() > 0}>
                      <span class="font-mono text-sm px-2">+</span>
                    </Show>
                    <KeyIndicator key={part.hotkeyPart}>
                      {part.part}
                    </KeyIndicator>
                    {part.type === "sequence" && <span class="mx-1">then</span>}
                  </>
                )}
              </For>
            </div>
          </>
        )}
      </For>
    </div>
  );
}

function isHotkeySequence(hotkey: RegisterableHotkey | HotkeySequence) {
  return Array.isArray(hotkey);
}

function isHotkey(hotkey: RegisterableHotkey | HotkeySequence) {
  return typeof hotkey === "string";
}

function parseHotKey(hotkey: RegisterableHotkey | HotkeySequence) {
  if (isHotkeySequence(hotkey)) {
    return hotkey.map((sequencePart) => ({
      part: sequencePart,
      type: "sequence",
      hotkeyPart: sequencePart,
    }));
  }
  if (isHotkey(hotkey)) {
    return hotkey.split("+").map((part) => ({
      part: keywordToSymbol(part.trim()),
      hotkeyPart: part.trim(),
      type: "hotkey",
    }));
  }
  return [];
}

function keywordToSymbol(key: string) {
  switch (key) {
    case "ArrowUp":
      return "↑";
    case "ArrowDown":
      return "↓";
    case "ArrowLeft":
      return "←";
    case "ArrowRight":
      return "→";
    case "Mod":
      return isMacOS() ? "Option ⌥" : "Alt";
    case "Meta":
      return isMacOS() ? "Command ⌘" : "Ctrl";
    case "Enter":
      return isMacOS() ? "Enter ⏎" : "Enter";
    case "Ctrl":
      return isMacOS() ? "Control ⌃" : "Ctrl";
    case "Shift":
      return isMacOS() ? "Shift ⇧" : "Shift";
    default:
      return key;
  }
}

function isMacOS() {
  return (
    typeof navigator !== "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  );
}
