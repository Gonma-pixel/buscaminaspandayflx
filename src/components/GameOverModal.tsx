import React from 'react';
import { AlertOctagon, RotateCcw, Home, Clock, Crosshair } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameOverModalProps {
  timeElapsed: number;
  difficultyName: string;
  minesFlagged: number;
  totalMines: number;
  onRetry: () => void;
  onReturnToTitle: () => void;
}

export function GameOverModal({
  timeElapsed,
  difficultyName,
  minesFlagged,
  totalMines,
  onRetry,
  onReturnToTitle,
}: GameOverModalProps) {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-md bg-slate-950 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(244,63,94,0.3)] relative overflow-hidden text-center">
        {/* Red warning aura */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Breach Alert Icon */}
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/50 mb-4 shadow-[0_0_20px_rgba(244,63,94,0.4)]">
          <AlertOctagon className="w-8 h-8 text-rose-500 animate-pulse" />
        </div>

        <span className="block text-xs font-mono tracking-widest text-rose-400 uppercase mb-1">
          FALLO CRÍTICO · CUADRILLA FLX & PANDA
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-2">
          BRECHA DE CASCO
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mb-6">
          Un núcleo de antimateria detonó en el <span className="text-rose-400 font-medium">{difficultyName}</span>. <span className="text-purple-300 font-medium">Flx</span> y el <span className="text-cyan-300 font-medium">Comandante Panda</span> activaron la cápsula de escape a tiempo.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Supervivencia</span>
            </div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
              {formatTime(timeElapsed)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>Balizas Puestas</span>
            </div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-amber-400 tabular-nums">
              {minesFlagged} / {totalMines}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onRetry();
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(244,63,94,0.35)] active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>REINTENTAR BARRIDO [R / Espacio]</span>
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
