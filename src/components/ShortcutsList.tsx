import { HotkeySequence, RegisterableHotkey } from "@omniaura/solid-hotkeys";
import { For, Show } from "solid-js";

import { isMacOS } from "~/games/Memory/utils/isMacOS";

import { KeyIndicator } from "./ui/KeyIndicator";

export type ShortcutKey = RegisterableHotkey | HotkeySequence;

export function ShortcutsList(props: {
  shortcutsMap: Map<string, Map<ShortcutKey, string>>;
}) {
  return (
    <div class="grid gap-x-6 gap-y-2 grid-cols-[1fr_auto] pt-4">
      <For each={Array.from(props.shortcutsMap.entries())}>
        {([groupTitle, shortcuts]) => (
          <>
            <h3 class="font-bold col-span-2 text-lg font-headline py-2 border-b border-border texture-mask">{groupTitle}</h3>
            <div class="grid grid-cols-subgrid col-span-full pb-2 border-b border-border leading-tight text-xs text-muted-foreground uppercase tracking-wide">
              <span>Description</span>
              <span>Hotkey</span>
            </div>

            <Show when={shortcuts.size > 0} fallback={<p class="col-span-2 text-sm text-muted-foreground">No shortcuts available.</p>}>
              <div class="col-span-full grid grid-cols-subgrid pb-4 gap-y-2">
                <For each={Array.from(shortcuts.entries())}>
                  {([hotkey, description]) => (
                    <>
                      <p>{description}</p>
                      <div class="flex items-center w-full gap-1">
                        <For each={parseHotKey(hotkey)}>
                          {(part, index) => (
                            <>
                              <Show when={index() > 0 && part.type === "hotkey"}>
                                <span class="font-mono text-sm px-2">+</span>
                              </Show>
                              <KeyIndicator key={part.hotkeyPart}>
                                {part.part}
                              </KeyIndicator>
                              <Show when={part.type === "sequence" && index() < parseHotKey(hotkey).length - 1}>
                                <span class="mx-1">then</span>
                              </Show>
                            </>
                          )}
                        </For>
                      </div>
                    </>
                  )}
                </For>
              </div>
            </Show>
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
    case "Tab":
      return "Tab ⇥";
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
