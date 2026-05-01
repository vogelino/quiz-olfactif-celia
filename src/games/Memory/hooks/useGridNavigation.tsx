import { createHotkey } from "@omniaura/solid-hotkeys";

type GridCell = {
  row: number;
  column: number;
};

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
    const availableCells = getAvailableCells({
      gridSize,
      isCellAvailable,
      current: { row, column },
    });

    const directionalCells = availableCells.filter((cell) =>
      isCellInDirection({
        cell,
        current: { row, column },
        rowDelta,
        columnDelta,
      }),
    );
    const candidates =
      directionalCells.length > 0 ? directionalCells : availableCells;
    const [nextCell] = candidates.sort((a, b) =>
      compareCellsInDirection({
        a,
        b,
        current: { row, column },
        rowDelta,
        columnDelta,
        gridSize,
        wrapsAround: directionalCells.length === 0,
      }),
    );

    if (nextCell) onNavigate(nextCell.row, nextCell.column);
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

function getAvailableCells({
  gridSize,
  isCellAvailable,
  current,
}: {
  gridSize: number;
  isCellAvailable: (row: number, column: number) => boolean;
  current: GridCell;
}) {
  return Array.from({ length: gridSize * gridSize }, (_, index) => ({
    row: Math.floor(index / gridSize),
    column: index % gridSize,
  })).filter(
    (cell) =>
      isCellAvailable(cell.row, cell.column) &&
      (cell.row !== current.row || cell.column !== current.column),
  );
}

function isCellInDirection({
  cell,
  current,
  rowDelta,
  columnDelta,
}: {
  cell: GridCell;
  current: GridCell;
  rowDelta: number;
  columnDelta: number;
}) {
  if (columnDelta > 0) return cell.column > current.column;
  if (columnDelta < 0) return cell.column < current.column;
  if (rowDelta > 0) return cell.row > current.row;
  return cell.row < current.row;
}

function compareCellsInDirection({
  a,
  b,
  current,
  rowDelta,
  columnDelta,
  gridSize,
  wrapsAround,
}: {
  a: GridCell;
  b: GridCell;
  current: GridCell;
  rowDelta: number;
  columnDelta: number;
  gridSize: number;
  wrapsAround: boolean;
}) {
  const aIsOnSameAxis = isCellOnSameAxis(a, current, columnDelta);
  const bIsOnSameAxis = isCellOnSameAxis(b, current, columnDelta);

  if (aIsOnSameAxis !== bIsOnSameAxis) return aIsOnSameAxis ? -1 : 1;

  const aPrimaryDistance = getPrimaryDistance({
    cell: a,
    current,
    rowDelta,
    columnDelta,
    gridSize,
    wrapsAround,
  });
  const bPrimaryDistance = getPrimaryDistance({
    cell: b,
    current,
    rowDelta,
    columnDelta,
    gridSize,
    wrapsAround,
  });

  if (aPrimaryDistance !== bPrimaryDistance) {
    return aPrimaryDistance - bPrimaryDistance;
  }

  const aOffAxisDistance = getOffAxisDistance(a, current, columnDelta);
  const bOffAxisDistance = getOffAxisDistance(b, current, columnDelta);

  if (aOffAxisDistance !== bOffAxisDistance) {
    return aOffAxisDistance - bOffAxisDistance;
  }

  return a.row - b.row || a.column - b.column;
}

function isCellOnSameAxis(
  cell: GridCell,
  current: GridCell,
  columnDelta: number,
) {
  return columnDelta === 0
    ? cell.column === current.column
    : cell.row === current.row;
}

function getOffAxisDistance(
  cell: GridCell,
  current: GridCell,
  columnDelta: number,
) {
  return columnDelta === 0
    ? Math.abs(cell.column - current.column)
    : Math.abs(cell.row - current.row);
}

function getPrimaryDistance({
  cell,
  current,
  rowDelta,
  columnDelta,
  gridSize,
  wrapsAround,
}: {
  cell: GridCell;
  current: GridCell;
  rowDelta: number;
  columnDelta: number;
  gridSize: number;
  wrapsAround: boolean;
}) {
  if (!wrapsAround) {
    return columnDelta === 0
      ? Math.abs(cell.row - current.row)
      : Math.abs(cell.column - current.column);
  }

  if (columnDelta > 0) {
    return getWrappedDistance(cell.column, current.column, gridSize);
  }

  if (columnDelta < 0) {
    return getWrappedDistance(current.column, cell.column, gridSize);
  }

  if (rowDelta > 0) {
    return getWrappedDistance(cell.row, current.row, gridSize);
  }

  return getWrappedDistance(current.row, cell.row, gridSize);
}

function getWrappedDistance(target: number, current: number, gridSize: number) {
  return (target - current + gridSize) % gridSize || gridSize;
}
