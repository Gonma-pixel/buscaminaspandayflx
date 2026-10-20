import React from 'react';
import { Trophy, Clock, Zap, RotateCcw, Home, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface VictoryModalProps {
  timeElapsed: number;
  isNewRecord: boolean;
  bestTime: number | null;
  difficultyName: string;
  totalMines: number;
  onPlayAgain: () => void;
  onReturnToTitle: () => void;
}

export function VictoryModal({
  timeElapsed,
  isNewRecord,
  bestTime,
  difficultyName,
  totalMines,
  onPlayAgain,
  onReturnToTitle,
}: VictoryModalProps) {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-md bg-slate-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] relative overflow-hidden text-center">
        {/* Top celebratory halo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Victory Badge */}
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-400/50 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
          <Trophy className="w-8 h-8 text-emerald-400" />
          <Sparkles className="w-4 h-4 text-emerald-300 absolute -top-1 -right-1 animate-pulse" />
        </div>

        <span className="block text-xs font-mono tracking-widest text-emerald-400 uppercase mb-1">
          MISIÓN CUMPLIDA · FLX & PANDA
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-2">
          SECTOR ASEGURADO
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mb-6">
          ¡Excelente trabajo de equipo! Junto a <span className="text-purple-300 font-medium">Flx</span> y al <span className="text-cyan-300 font-medium">Comandante Panda</span> has neutralizado todas las anomalías en el <span className="text-cyan-400 font-medium">{difficultyName}</span>.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tiempo de Misión</span>
            </div>
            <div className="font-mono text-2xl font-bold text-white tabular-nums">
              {formatTime(timeElapsed)}
            </div>
            {isNewRecord && (
              <span className="inline-block mt-1 text-[10px] font-mono tracking-wider text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-500/40">
                ¡NUEVO RÉCORD!
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Minas Neutralizadas</span>
            </div>
            <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
              {totalMines} / {totalMines}
            </div>
            {bestTime !== null && !isNewRecord && (
              <span className="block mt-1 text-[10px] font-mono text-slate-400 tabular-nums">
                Mejor: {formatTime(bestTime)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>JUGAR DE NUEVO [Espacio]</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onReturnToTitle();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Menú de Misiones</span>
          </button>
        </div>
      </div>
    </div>
  );
}
