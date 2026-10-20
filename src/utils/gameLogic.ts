import { CellData } from '../types/game';

export function createEmptyBoard(rows: number, cols: number): CellData[][] {
  const board: CellData[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: CellData[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        isQuestion: false,
        neighborMines: 0,
        isDetonated: false,
        isScanned: false,
      });
    }
    board.push(row);
  }
  return board;
}

export function getAdjacentCoords(row: number, col: number, rows: number, cols: number): [number, number][] {
  const neighbors: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push([nr, nc]);
      }
    }
  }
  return neighbors;
}

export function populateMines(
  board: CellData[][],
  safeRow: number,
  safeCol: number,
  mineCount: number
): CellData[][] {
  const rows = board.length;
  const cols = board[0].length;
  const totalCells = rows * cols;
  const safeMines = Math.min(mineCount, totalCells - 1);

  // Set of coordinates to exclude around first click for a clean start
  const safeZone = new Set<string>();
  safeZone.add(`${safeRow},${safeCol}`);

  // In standard boards, keep the 3x3 zone clear if there's enough space
  const neighbors = getAdjacentCoords(safeRow, safeCol, rows, cols);
  if (totalCells - (neighbors.length + 1) >= safeMines) {
    neighbors.forEach(([nr, nc]) => safeZone.add(`${nr},${nc}`));
  }

  // Candidate positions
  const candidates: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!safeZone.has(`${r},${c}`)) {
        candidates.push([r, c]);
      }
    }
  }

  // Shuffle candidates
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  // Place mines
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell, isMine: false, neighborMines: 0 })));
  for (let i = 0; i < safeMines && i < candidates.length; i++) {
    const [r, c] = candidates[i];
    newBoard[r][c].isMine = true;
  }

  // Calculate neighbor counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].isMine) continue;
      let count = 0;
      const adj = getAdjacentCoords(r, c, rows, cols);
      for (const [nr, nc] of adj) {
        if (newBoard[nr][nc].isMine) {
          count++;
        }
      }
      newBoard[r][c].neighborMines = count;
    }
  }

  return newBoard;
}

export interface RevealResult {
  newBoard: CellData[][];
  hitMine: boolean;
  detonatedCoord?: [number, number];
  cascadeSteps: number;
}

export function revealCell(
  board: CellData[][],
  row: number,
  col: number
): RevealResult {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  const target = newBoard[row][col];

  if (target.isRevealed || target.isFlagged) {
    return { newBoard, hitMine: false, cascadeSteps: 0 };
  }

  // Hit a mine!
  if (target.isMine) {
    target.isRevealed = true;
    target.isDetonated = true;
    // Reveal all other mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newBoard[r][c].isMine) {
          newBoard[r][c].isRevealed = true;
        }
      }
    }
    return {
      newBoard,
      hitMine: true,
      detonatedCoord: [row, col],
      cascadeSteps: 0,
    };
  }

  // Safe cell: BFS flood fill
  const queue: [number, number][] = [[row, col]];
  target.isRevealed = true;
  let cascadeSteps = 0;

  while (queue.length > 0) {
    const [currR, currC] = queue.shift()!;
    const currCell = newBoard[currR][currC];
    cascadeSteps++;

    // Only expand neighbors if current cell has 0 neighbor mines
    if (currCell.neighborMines === 0) {
      const neighbors = getAdjacentCoords(currR, currC, rows, cols);
      for (const [nr, nc] of neighbors) {
        const neighbor = newBoard[nr][nc];
        if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
          neighbor.isRevealed = true;
          queue.push([nr, nc]);
        }
      }
    }
  }

  return { newBoard, hitMine: false, cascadeSteps };
}

export function chordCell(
  board: CellData[][],
  row: number,
  col: number
): RevealResult {
  const rows = board.length;
  const cols = board[0].length;
  const cell = board[row][col];

  if (!cell.isRevealed || cell.neighborMines === 0) {
    return { newBoard: board, hitMine: false, cascadeSteps: 0 };
  }

  const neighbors = getAdjacentCoords(row, col, rows, cols);
  let flagCount = 0;
  for (const [nr, nc] of neighbors) {
    if (board[nr][nc].isFlagged) {
      flagCount++;
    }
  }

  // Only chord if flags match the exact neighbor mine count
  if (flagCount !== cell.neighborMines) {
    return { newBoard: board, hitMine: false, cascadeSteps: 0 };
  }

  let currentBoard = board.map((r) => r.map((c) => ({ ...c })));
  let totalCascade = 0;

  // Reveal all unflagged neighbors
  for (const [nr, nc] of neighbors) {
    const neighbor = currentBoard[nr][nc];
    if (!neighbor.isRevealed && !neighbor.isFlagged) {
      const res = revealCell(currentBoard, nr, nc);
      currentBoard = res.newBoard;
      totalCascade += res.cascadeSteps;
      if (res.hitMine) {
        return {
          newBoard: currentBoard,
          hitMine: true,
          detonatedCoord: res.detonatedCoord,
          cascadeSteps: totalCascade,
        };
      }
    }
  }

  return { newBoard: currentBoard, hitMine: false, cascadeSteps: totalCascade };
}

export function checkVictory(board: CellData[][], totalMines: number): boolean {
  const rows = board.length;
  const cols = board[0].length;
  let revealedCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isRevealed && !board[r][c].isMine) {
        revealedCount++;
      }
    }
  }

  return revealedCount === rows * cols - totalMines;
}

export function flagAllMinesOnWin(board: CellData[][]): CellData[][] {
  return board.map((row) =>
    row.map((cell) => {
      if (cell.isMine) {
        return { ...cell, isFlagged: true };
      }
      return cell;
    })
  );
}
