import React, { useState } from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface CustomDifficultyModalProps {
  initialRows: number;
  initialCols: number;
  initialMines: number;
  onConfirm: (rows: number, cols: number, mines: number) => void;
  onClose: () => void;
}

export function CustomDifficultyModal({
  initialRows,
  initialCols,
  initialMines,
  onConfirm,
  onClose,
}: CustomDifficultyModalProps) {
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const maxMines = Math.floor(rows * cols * 0.85);
  const [mines, setMines] = useState(Math.min(initialMines, maxMines));

  const totalCells = rows * cols;
  const density = Math.round((mines / totalCells) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    onConfirm(rows, cols, Math.min(mines, maxMines));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-md bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg text-white">Configurar Sector Personalizado</h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 my-5">
          {/* Rows Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
              <span>Filas Orbitales (Altura)</span>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">{rows}</span>
            </div>
            <input
              type="range"
              min="8"
              max="24"
              value={rows}
              onChange={(e) => {
                const newR = parseInt(e.target.value, 10);
                setRows(newR);
                const newMax = Math.floor(newR * cols * 0.85);
                if (mines > newMax) setMines(newMax);
              }}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>8</span>
              <span>24</span>
            </div>
          </div>

          {/* Cols Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
              <span>Columnas Orbitales (Anchura)</span>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">{cols}</span>
            </div>
            <input
              type="range"
              min="8"
              max="30"
              value={cols}
              onChange={(e) => {
                const newC = parseInt(e.target.value, 10);
                setCols(newC);
                const newMax = Math.floor(rows * newC * 0.85);
                if (mines > newMax) setMines(newMax);
              }}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>8</span>
              <span>30</span>
            </div>
          </div>

          {/* Mines Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
              <span>Anomalías de Antimateria</span>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">{mines}</span>
            </div>
            <input
              type="range"
              min="5"
              max={maxMines}
              value={mines}
              onChange={(e) => setMines(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>5</span>
              <span>{maxMines}</span>
            </div>
          </div>

          {/* Summary Preview Box */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Densidad del Campo</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-white font-semibold tabular-nums">{totalCells} casillas</span>
              <span>·</span>
              <span className="font-mono text-cyan-300 font-bold tabular-nums">{density}% peligro</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Aplicar Sector</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
