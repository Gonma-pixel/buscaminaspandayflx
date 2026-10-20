import React, { useRef } from 'react';
import { CellData, InputMode } from '../types/game';
import { AntimatterMineIcon, QuantumBeaconIcon, ProbeQuestionIcon } from './Icons';

interface BoardProps {
  board: CellData[][];
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
  onCellChord: (row: number, col: number) => void;
  inputMode: InputMode;
  isDetonating: boolean;
  zoom: number;
}

const NUMBER_COLORS: Record<number, { text: string; shadow: string }> = {
  1: { text: 'text-sky-400', shadow: 'shadow-[0_0_8px_rgba(56,189,248,0.4)]' },
  2: { text: 'text-emerald-400', shadow: 'shadow-[0_0_8px_rgba(52,211,153,0.4)]' },
  3: { text: 'text-amber-400', shadow: 'shadow-[0_0_8px_rgba(251,191,36,0.4)]' },
  4: { text: 'text-purple-400', shadow: 'shadow-[0_0_8px_rgba(192,132,252,0.4)]' },
  5: { text: 'text-orange-500', shadow: 'shadow-[0_0_8px_rgba(249,115,22,0.4)]' },
  6: { text: 'text-teal-300', shadow: 'shadow-[0_0_8px_rgba(45,212,191,0.4)]' },
  7: { text: 'text-rose-400', shadow: 'shadow-[0_0_8px_rgba(244,63,94,0.4)]' },
  8: { text: 'text-slate-100', shadow: 'shadow-[0_0_8px_rgba(241,245,249,0.5)]' },
};

export function Board({
  board,
  onCellClick,
  onCellRightClick,
  onCellChord,
  inputMode,
  isDetonating,
  zoom,
}: BoardProps) {
  const rows = board.length;
  const cols = board[0].length;
  const longPressTimerRef = useRef<number | null>(null);
  const isLongPressRef = useRef<boolean>(false);

  // Determine base cell size based on board columns
  const getCellSizeClass = () => {
    if (cols <= 10) return 'w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg';
    if (cols <= 16) return 'w-8 h-8 sm:w-9 sm:h-9 text-sm sm:text-base';
    return 'w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm';
  };

  const cellSizeClass = getCellSizeClass();

  // Handle Touch Start for Long-press to flag
  const handleTouchStart = (row: number, col: number) => {
    isLongPressRef.current = false;
    longPressTimerRef.current = window.setTimeout(() => {
      isLongPressRef.current = true;
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(30);
        } catch {}
      }
      onCellRightClick(row, col);
    }, 380);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleCellClickAction = (cell: CellData) => {
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }

    if (cell.isRevealed) {
      if (cell.neighborMines > 0) {
        onCellChord(cell.row, cell.col);
      }
      return;
    }

    if (inputMode === 'flag') {
      onCellRightClick(cell.row, cell.col);
    } else {
      onCellClick(cell.row, cell.col);
    }
  };

  return (
    <div className={`relative flex items-center justify-center p-2 sm:p-4 transition-transform duration-200 select-none ${isDetonating ? 'animate-shake' : ''}`}>
      {/* Outer Sci-Fi Deck Frame */}
      <div
        className="relative bg-slate-950/85 backdrop-blur-md rounded-2xl p-2 sm:p-3 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-auto max-w-full max-h-[75vh]"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
      >
        {/* Subtle grid scan line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-16 pointer-events-none animate-[grid-scan_6s_linear_infinite]" />

        {/* The Grid Table */}
        <div
          className="grid gap-[2px] sm:gap-[3px] bg-slate-900/80 p-1 rounded-xl border border-slate-800"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {board.map((rowArr, r) =>
            rowArr.map((cell, c) => {
              const isDetonatedTarget = cell.isDetonated;
              const isRevealedMine = cell.isRevealed && cell.isMine;
              const isRevealedNumber = cell.isRevealed && !cell.isMine && cell.neighborMines > 0;
              const isRevealedEmpty = cell.isRevealed && !cell.isMine && cell.neighborMines === 0;

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  data-row={r}
                  data-col={c}
                  onClick={() => handleCellClickAction(cell)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onCellRightClick(r, c);
                  }}
                  onTouchStart={() => handleTouchStart(r, c)}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                  className={`relative flex items-center justify-center font-mono font-bold transition-all duration-150 rounded ${cellSizeClass} ${
                    cell.isRevealed
                      ? isDetonatedTarget
                        ? 'bg-rose-950/90 border border-rose-500/80 shadow-[0_0_15px_rgba(239,68,68,0.7)]'
                        : isRevealedMine
                        ? 'bg-slate-950/90 border border-rose-900/60'
                        : isRevealedEmpty
                        ? 'bg-slate-950/60 border border-slate-900/80 text-transparent'
                        : 'bg-slate-950/90 border border-slate-800/80 hover:bg-slate-900/90 cursor-pointer'
                      : 'bg-gradient-to-b from-slate-800/90 to-slate-900/95 border border-slate-700/60 hover:border-cyan-400/80 hover:from-slate-800 hover:to-slate-850 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)] active:scale-95 cursor-pointer'
                  } ${cell.isScanned ? 'ring-2 ring-cyan-400 animate-pulse' : ''}`}
                >
                  {/* Decorative Corner Bracket for Sci-Fi Armor Tile */}
                  {!cell.isRevealed && (
                    <>
                      <span className="absolute top-[2px] left-[2px] w-[3px] h-[3px] border-t border-l border-slate-500/40 pointer-events-none" />
                      <span className="absolute bottom-[2px] right-[2px] w-[3px] h-[3px] border-b border-r border-slate-500/40 pointer-events-none" />
                    </>
                  )}

                  {/* Flagged Beacon */}
                  {cell.isFlagged && !cell.isRevealed && (
                    <div className="flex items-center justify-center animate-fade-in drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]">
                      <QuantumBeaconIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  )}

                  {/* Question Mark */}
                  {cell.isQuestion && !cell.isRevealed && !cell.isFlagged && (
                    <div className="flex items-center justify-center">
                      <ProbeQuestionIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                    </div>
                  )}

                  {/* Mine when revealed */}
                  {isRevealedMine && (
                    <div className="flex items-center justify-center">
                      <AntimatterMineIcon
                        isDetonated={isDetonatedTarget}
                        className="w-5 h-5 sm:w-6 sm:h-6"
                      />
                    </div>
                  )}

                  {/* Number clue */}
                  {isRevealedNumber && (
                    <span
                      className={`${NUMBER_COLORS[cell.neighborMines]?.text || 'text-cyan-400'} ${
                        NUMBER_COLORS[cell.neighborMines]?.shadow || ''
                      } tracking-tighter`}
                    >
                      {cell.neighborMines}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
