import React from 'react';
import { GameStats, DIFFICULTIES } from '../types/game';
import { BarChart2, Trophy, Flame, RotateCcw, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface StatsModalProps {
  stats: GameStats;
  onClose: () => void;
  onResetStats: () => void;
}

export function StatsModal({ stats, onClose, onResetStats }: StatsModalProps) {
  const formatTime = (secs: number | null) => {
    if (secs === null) return '--:--';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalPlayed = Object.values(stats.gamesPlayed).reduce((a, b) => a + b, 0);
  const totalWon = Object.values(stats.gamesWon).reduce((a, b) => a + b, 0);
  const winRate = totalPlayed > 0 ? Math.round((totalWon / totalPlayed) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-lg bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg text-white">Telemetría de la Flota</h3>
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

        {/* Global Summary KPI strip */}
        <div className="grid grid-cols-4 gap-2 my-5">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="block text-[10px] uppercase text-slate-400 mb-0.5">Misiones</span>
            <span className="font-mono text-xl font-bold text-white tabular-nums">{totalPlayed}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="block text-[10px] uppercase text-slate-400 mb-0.5">Victorias</span>
            <span className="font-mono text-xl font-bold text-emerald-400 tabular-nums">{totalWon}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="block text-[10px] uppercase text-slate-400 mb-0.5">% Éxito</span>
            <span className="font-mono text-xl font-bold text-cyan-400 tabular-nums">{winRate}%</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] uppercase text-slate-400 mb-0.5">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Racha</span>
            </div>
            <span className="font-mono text-xl font-bold text-amber-400 tabular-nums">{stats.currentStreak}</span>
          </div>
        </div>

        {/* Breakdown by difficulty */}
        <div className="space-y-3 mb-6">
          <div className="text-xs uppercase tracking-wider text-slate-400">Récords por Sector</div>
          {Object.entries(DIFFICULTIES).map(([key, diff]) => {
            const played = stats.gamesPlayed[key as keyof typeof stats.gamesPlayed] || 0;
            const won = stats.gamesWon[key as keyof typeof stats.gamesWon] || 0;
            const best = stats.bestTime[key as keyof typeof stats.bestTime];
            const pct = played > 0 ? Math.round((won / played) * 100) : 0;

            return (
              <div
                key={key}
                className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{diff.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/40">
                      {diff.code}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {won} victorias de {played} jugadas ({pct}%)
                  </span>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-slate-400 justify-end">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mejor Tiempo</span>
                  </div>
                  <span className="font-mono text-base font-bold text-cyan-300 tabular-nums">
                    {formatTime(best)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-900">
          <button
            onClick={() => {
              if (window.confirm('¿Deseas restablecer todos los registros de telemetría y récords?')) {
                onResetStats();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400/80 hover:text-rose-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Borrar Telemetría</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
