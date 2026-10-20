import React, { useState } from 'react';
import { DIFFICULTIES, DifficultyLevel } from '../types/game';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, BarChart2, HelpCircle, Play, Shield, Compass, Zap } from 'lucide-react';
import { PandaAstronautBadge, FlxPilotBadge } from './Icons';

interface TitleScreenProps {
  currentDifficulty: DifficultyLevel;
  onSelectDifficulty: (diff: DifficultyLevel) => void;
  onStartGame: () => void;
  onOpenStats: () => void;
  onOpenCustomModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function TitleScreen({
  currentDifficulty,
  onSelectDifficulty,
  onStartGame,
  onOpenStats,
  onOpenCustomModal,
  isMuted,
  onToggleMute,
}: TitleScreenProps) {
  const [showManual, setShowManual] = useState(false);

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-screen px-4 py-8 max-w-5xl mx-auto select-none">
      {/* Top utility row */}
      <div className="w-full flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-mono tracking-widest text-[11px] uppercase">
            BUSCAMINAS · FLX & PANDA
          </span>
          <span>·</span>
          <span>MISIÓN ORBITAL</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setShowManual(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Manual Táctico</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenStats();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Telemetría</span>
          </button>

          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Hero Centerpiece: Flx & Panda Bespoke Title Lockup */}
      <div className="flex flex-col items-center text-center my-auto py-6">
        
        {/* Crew Avatars Header */}
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-purple-500/30">
            <FlxPilotBadge className="w-6 h-6" />
            <span className="text-xs font-mono font-semibold text-purple-300">Piloto Flx</span>
          </div>

          <span className="text-cyan-400 font-bold text-xs">⚡</span>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30">
            <PandaAstronautBadge className="w-6 h-6" />
            <span className="text-xs font-mono font-semibold text-cyan-300">Comandante Panda</span>
          </div>
        </div>

        {/* Bespoke inline SVG Title Lockup */}
        <div className="relative mb-3 flex items-center justify-center">
          <svg viewBox="0 0 540 140" className="w-[330px] sm:w-[480px] h-auto drop-shadow-[0_0_30px_rgba(56,189,248,0.35)]">
            <defs>
              <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="subGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="50%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Orbit Ellipse */}
            <ellipse cx="270" cy="72" rx="250" ry="46" stroke="url(#ringGrad)" strokeWidth="1.6" fill="none" transform="rotate(-6 270 72)" strokeDasharray="6 4" />
            
            {/* Small satellite / beacon nodes */}
            <circle cx="490" cy="56" r="3.5" fill="#38bdf8" className="animate-ping-slow" />
            <circle cx="490" cy="56" r="2" fill="#ffffff" />
            <circle cx="50" cy="88" r="2.5" fill="#c084fc" />

            {/* Line 1: BUSCAMINAS */}
            <text
              x="270"
              y="60"
              textAnchor="middle"
              fill="url(#titleGrad)"
              style={{
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: '44px',
                fontWeight: '900',
                letterSpacing: '0.14em',
              }}
            >
              BUSCAMINAS
            </text>

            {/* Line 2: DE FLX Y PANDA */}
            <text
              x="270"
              y="102"
              textAnchor="middle"
              fill="url(#subGrad)"
              style={{
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: '26px',
                fontWeight: '800',
                letterSpacing: '0.22em',
              }}
            >
              DE FLX Y PANDA
            </text>

            {/* Subtle Crosshair Reticles */}
            <line x1="270" y1="10" x2="270" y2="24" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />
            <line x1="270" y1="116" x2="270" y2="130" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />
          </svg>
        </div>

        <p className="text-cyan-300/80 text-sm sm:text-base font-light tracking-wide max-w-lg mb-8">
          Acompaña a <span className="text-purple-300 font-medium">Flx</span> y al <span className="text-cyan-300 font-medium">Astronauta Panda</span> a despejar anomalías de antimateria en el espacio profundo.
        </p>

        {/* Sector / Difficulty Selector */}
        <div className="w-full max-w-2xl mb-8">
          <div className="text-xs uppercase tracking-widest text-slate-400 mb-3 text-center">
            Selecciona el Sector de Misión
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.values(DIFFICULTIES).map((diff) => {
              const isSelected = currentDifficulty === diff.id;
              return (
                <button
                  key={diff.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectDifficulty(diff.id);
                  }}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_20px_rgba(56,189,248,0.25)] ring-1 ring-cyan-400/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] tracking-wider text-cyan-400">{diff.code}</span>
                    <span className="text-xs font-mono tabular-nums text-slate-400">{diff.mines} Minas</span>
                  </div>
                  <h3 className="font-semibold text-white text-base mb-1">{diff.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{diff.description}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-center">
            <button
              onClick={() => {
                sound.playClick();
                onOpenCustomModal();
              }}
              className={`text-xs px-4 py-2 rounded-lg border transition-colors ${
                currentDifficulty === 'custom'
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              Configurar Sector Personalizado (Filas, Columnas y Minas)
            </button>
          </div>
        </div>

        {/* Primary Start CTA */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            className="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-base tracking-wider uppercase shadow-[0_0_25px_rgba(56,189,248,0.45)] hover:shadow-[0_0_35px_rgba(56,189,248,0.65)] active:scale-95 transition-all duration-200 flex items-center gap-3"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>INICIAR MISIÓN</span>
            <span className="hidden sm:inline font-mono text-[11px] bg-slate-950/20 px-2 py-0.5 rounded text-slate-950/80">
              [Enter / Espacio]
            </span>
          </button>

          {/* Flat control-hint line */}
          <div className="text-xs text-slate-400 font-mono tracking-tight text-center">
            Click Revelar · Click Derecho / Barra Baliza · Esc Pausa
          </div>
        </div>
      </div>

      {/* Footer minimal info */}
      <div className="w-full flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-900">
        <div>Primer clic 100% seguro con apertura de zona</div>
        <div className="font-mono text-[11px]">Soporte táctil y ratón</div>
      </div>

      {/* Tactical Manual Modal */}
      {showManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-950 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-lg text-white">Manual Táctico de Reconocimiento</h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowManual(false);
                }}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm text-slate-300 max-h-[60vh] overflow-y-auto pr-2">
              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 shrink-0 h-fit">
                  <Compass className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Detección Gravitacional</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Cada número indica exactamente cuántas anomalías de antimateria orbitan en las 8 casillas circundantes.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/30 shrink-0 h-fit">
                  <Shield className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Balizas Cuánticas (Banderas)</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Haz clic derecho (o mantén pulsado en móvil) para desplegar una baliza holográfica y proteger la casilla de detonaciones accidentales.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/30 shrink-0 h-fit">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Maniobra Chord (Despeje Rápido)</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Si un número ya tiene todas sus balizas marcadas, haz clic en él para despejar instantáneamente las casillas adyacentes restantes.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 shrink-0 h-fit">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Escáner Sonar Orbital</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Dispones de pulsos de escáner táctico limitados por partida para verificar casillas dudosas sin detonar minas.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setShowManual(false);
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-sm transition-colors"
            >
              Entendido, volver a la cabina
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
