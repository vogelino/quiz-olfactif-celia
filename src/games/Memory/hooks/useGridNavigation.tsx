import { createHotkey } from "@omniaura/solid-hotkeys";

type UseGridNavigationProps = {
  onNavigate: (row: number, column: number) => void;
  currentRow: () => number;
  currentColumn: () => number;
  isCellAvailable?: (row: number, column: number) => boolean;
  gridSize?: number;
};

export function useGridNavigation({
  onNavigate,
  currentRow,
  currentColumn,
  isCellAvailable = () => true,
  gridSize = 4,
}: UseGridNavigationProps) {
  const navigateBy = (rowDelta: number, columnDelta: number) => {
    const row = currentRow();
    const column = currentColumn();

    for (let step = 1; step <= gridSize; step += 1) {
      const nextRow = (row + rowDelta * step + gridSize) % gridSize;
      const nextColumn = (column + columnDelta * step + gridSize) % gridSize;

      if (isCellAvailable(nextRow, nextColumn)) {
        onNavigate(nextRow, nextColumn);
        return;
      }
    }
  };

  const goUp = () => navigateBy(-1, 0);

  const goDown = () => navigateBy(1, 0);

  const goLeft = () => navigateBy(0, -1);

  const goRight = () => navigateBy(0, 1);

  createHotkey("ArrowUp", goUp);
  createHotkey("ArrowDown", goDown);
  createHotkey("ArrowLeft", goLeft);
  createHotkey("ArrowRight", goRight);

  return {
    goUp,
    goDown,
    goLeft,
    goRight,
  };
}
