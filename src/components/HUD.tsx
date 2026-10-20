import React from 'react';
import { GameStatus, DifficultyLevel, InputMode } from '../types/game';
import { CommanderAvatar, SonarScanIcon } from './Icons';
import { Volume2, VolumeX, Pause, Play, RotateCcw, Home, ZoomIn, ZoomOut, Flag, Eye } from 'lucide-react';
import { sound } from '../utils/audio';

interface HUDProps {
  difficulty: DifficultyLevel;
  remainingMines: number;
  timeElapsed: number;
  status: GameStatus;
  sonarCharges: number;
  isSonarActive: boolean;
  onActivateSonar: () => void;
  onRestart: () => void;
  onTogglePause: () => void;
  onReturnToTitle: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  inputMode: InputMode;
  onToggleInputMode: () => void;
}

export function HUD({
  remainingMines,
  timeElapsed,
  status,
  sonarCharges,
  isSonarActive,
  onActivateSonar,
  onRestart,
  onTogglePause,
  onReturnToTitle,
  isMuted,
  onToggleMute,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  inputMode,
  onToggleInputMode,
}: HUDProps) {
  // Format time as 00:00 or 000
  const formatTime = (secs: number) => {
    const clamped = Math.min(secs, 9999);
    const m = Math.floor(clamped / 60);
    const s = clamped % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-2 select-none relative z-20">
      <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-2.5 sm:p-3 shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Left cluster: Balizas / Minas restantes */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase">
              Balizas
            </span>
            <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-lg sm:text-xl font-bold tracking-wider text-cyan-300 tabular-nums">
                {remainingMines.toString().padStart(3, '0')}
              </span>
            </div>
          </div>

          {/* Quick zoom controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                sound.playClick();
                onZoomOut();
              }}
              title="Alejar Zoom"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onResetZoom();
              }}
              title="Restablecer Zoom (100%)"
              className="px-1.5 text-[10px] font-mono tabular-nums text-slate-400 hover:text-cyan-400"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onZoomIn();
              }}
              title="Acercar Zoom"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Mission Commander Reactor Avatar */}
        <div className="flex flex-col items-center">
          <CommanderAvatar status={status} onClick={onRestart} />
          <span className="text-[9px] font-mono tracking-wider text-slate-400 mt-0.5">
            {status === 'PLAYING' && 'FLX & PANDA · ACTIVO'}
            {status === 'WON' && '¡MISIÓN CUMPLIDA!'}
            {status === 'LOST' && 'BRECHA DE CASCO'}
            {status === 'PAUSED' && 'EN PAUSA'}
          </span>
        </div>

        {/* Right cluster: Cronómetro & Tácticos */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Tactical Sonar Scanner power-up */}
          <button
            onClick={onActivateSonar}
            disabled={sonarCharges <= 0 || status !== 'PLAYING'}
            title={sonarCharges > 0 ? `Activar Pulso Sonar (${sonarCharges} disponibles)` : 'Sin cargas de pulso'}
            className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition-all ${
              isSonarActive
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/40 animate-pulse'
                : sonarCharges > 0 && status === 'PLAYING'
                ? 'bg-slate-900/90 border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:bg-slate-800'
                : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <SonarScanIcon className={`w-4 h-4 ${isSonarActive ? 'text-cyan-300 animate-spin' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline font-medium">Sonar</span>
            <span className="font-mono text-[11px] bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-500/40 tabular-nums">
              {sonarCharges}
            </span>
          </button>

          {/* Touch Mode switch for mobile / tablets */}
          <button
            onClick={onToggleInputMode}
            title={inputMode === 'reveal' ? 'Modo actual: Revelar. Clic para modo Baliza' : 'Modo actual: Baliza. Clic para modo Revelar'}
            className={`sm:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              inputMode === 'flag'
                ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                : 'bg-slate-900/90 border-cyan-500/30 text-cyan-300'
            }`}
          >
            {inputMode === 'flag' ? (
              <>
                <Flag className="w-3.5 h-3.5 text-amber-400" />
                <span>Baliza</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Revelar</span>
              </>
            )}
          </button>

          {/* Orbital Chronometer */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase">
              Tiempo
            </span>
            <div className="bg-slate-900/90 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              <span className="font-mono text-lg sm:text-xl font-bold tracking-wider text-cyan-300 tabular-nums">
                {formatTime(timeElapsed)}
              </span>
            </div>
          </div>

          {/* Utility action icons */}
          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            <button
              onClick={() => {
                sound.playClick();
                onTogglePause();
              }}
              title={status === 'PAUSED' ? 'Reanudar misión (Esc)' : 'Pausar misión (Esc)'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {status === 'PAUSED' ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onRestart();
              }}
              title="Reiniciar Sector (R)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleMute}
              title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onReturnToTitle();
              }}
              title="Regresar al Menú Principal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
