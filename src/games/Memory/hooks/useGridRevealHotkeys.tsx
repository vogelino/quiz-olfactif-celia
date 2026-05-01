import { createHotkeySequence } from "@omniaura/solid-hotkeys";

type UseGridRevealHotkeysProps = {
  onReveal: (row: number, column: number) => void;
  isCellAvailable?: (row: number, column: number) => boolean;
  gridSize?: number;
  timeout?: number;
};

const columns = ["A", "B", "C", "D"] as const;
const rows = ["1", "2", "3", "4"] as const;

export function useGridRevealHotkeys({
  onReveal,
  isCellAvailable = () => true,
  gridSize = 4,
  timeout = 1000,
}: UseGridRevealHotkeysProps) {
  const coordinateGridSize = Math.min(gridSize, columns.length);

  for (let column = 0; column < coordinateGridSize; column += 1) {
    for (let row = 0; row < coordinateGridSize; row += 1) {
      createHotkeySequence(
        [columns[column], rows[row]],
        (event) => {
          event.preventDefault();

          if (!isCellAvailable(row, column)) return;

          onReveal(row, column);
        },
        { timeout },
      );
    }
  }
}
