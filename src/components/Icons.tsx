import React from 'react';

// Dark Antimatter Core (Space Mine)
export function AntimatterMineIcon({ isDetonated = false, className = "w-6 h-6" }: { isDetonated?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`${className} ${isDetonated ? 'animate-pulse' : ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`mineGrad-${isDetonated ? 'det' : 'safe'}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isDetonated ? '#ffffff' : '#f43f5e'} />
          <stop offset="40%" stopColor={isDetonated ? '#ef4444' : '#a855f7'} />
          <stop offset="85%" stopColor={isDetonated ? '#7f1d1d' : '#0f172a'} />
          <stop offset="100%" stopColor={isDetonated ? '#450a0a' : '#020617'} />
        </radialGradient>
        <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      {/* Orbiting gravitational ring 1 */}
      <ellipse
        cx="20"
        cy="20"
        rx="17"
        ry="7"
        transform="rotate(-25 20 20)"
        stroke={isDetonated ? '#f87171' : '#38bdf8'}
        strokeWidth="1.2"
        strokeDasharray="4 2"
        opacity="0.85"
      />
      {/* Orbiting ring 2 */}
      <ellipse
        cx="20"
        cy="20"
        rx="17"
        ry="7"
        transform="rotate(65 20 20)"
        stroke={isDetonated ? '#fbbf24' : '#c084fc'}
        strokeWidth="1.2"
        opacity="0.75"
      />

      {/* Core Body */}
      <circle
        cx="20"
        cy="20"
        r="11"
        fill={`url(#mineGrad-${isDetonated ? 'det' : 'safe'})`}
        stroke={isDetonated ? '#fca5a5' : '#818cf8'}
        strokeWidth="1.5"
        filter="url(#glowFilter)"
      />

      {/* Spikes / Energy emitters */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1="20"
          y1="20"
          x2={20 + Math.cos((angle * Math.PI) / 180) * 16}
          y2={20 + Math.sin((angle * Math.PI) / 180) * 16}
          stroke={isDetonated ? '#fca5a5' : '#60a5fa'}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.9"
        />
      ))}

      {/* Singularity Center */}
      <circle cx="20" cy="20" r="3.5" fill={isDetonated ? '#ffffff' : '#38bdf8'} />
    </svg>
  );
}

// Quantum Holographic Beacon (Flag)
export function QuantumBeaconIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="beaconPoleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="flagHoloGrad" x1="0" y1="0" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#818cf8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Base ring */}
      <ellipse cx="18" cy="30" rx="9" ry="3.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
      <ellipse cx="18" cy="30" rx="4.5" ry="1.8" fill="#0284c7" opacity="0.6" />

      {/* Vertical emitter pole */}
      <line x1="18" y1="30" x2="18" y2="7" stroke="url(#beaconPoleGrad)" strokeWidth="2.2" strokeLinecap="round" />

      {/* Emitter cap crystal */}
      <polygon points="18,3 21,7 18,10 15,7" fill="#bae6fd" stroke="#38bdf8" strokeWidth="0.8" />

      {/* Holographic Warning Banner */}
      <polygon
        points="18,7 32,12 18,18"
        fill="url(#flagHoloGrad)"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Hologram scanlines */}
      <line x1="20" y1="10" x2="28" y2="12.5" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
      <line x1="20" y1="14" x2="25" y2="15.5" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />

      {/* Signal ring pulse */}
      <circle cx="18" cy="7" r="4.5" stroke="#38bdf8" strokeWidth="0.8" opacity="0.5" strokeDasharray="2 2" />
    </svg>
  );
}

// Question Mark Probe
export function ProbeQuestionIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
    </svg>
  );
}

// Sonar Scanner Icon
export function SonarScanIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" strokeOpacity="0.3" />
      <circle cx="12" cy="12" r="6" strokeOpacity="0.5" />
      <circle cx="12" cy="12" r="3" strokeOpacity="0.9" />
      <line x1="12" y1="12" x2="19" y2="5" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Panda Astronaut Badge
export function PandaAstronautBadge({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Panda Astronaut Helmet with round ears */}
      <circle cx="14" cy="11" r="5.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      <circle cx="34" cy="11" r="5.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      <circle cx="14" cy="11" r="3" fill="#38bdf8" opacity="0.7" />
      <circle cx="34" cy="11" r="3" fill="#38bdf8" opacity="0.7" />

      {/* Main Helmet Dome */}
      <circle cx="24" cy="24" r="17" fill="#020617" stroke="#38bdf8" strokeWidth="2" />
      
      {/* Visor */}
      <rect x="11" y="15" width="26" height="18" rx="8" fill="#0369a1" fillOpacity="0.4" stroke="#7dd3fc" strokeWidth="1.5" />
      
      {/* Panda Face inside Visor: dark eye patches */}
      <ellipse cx="18" cy="23" rx="3.5" ry="4" transform="rotate(-15 18 23)" fill="#0f172a" />
      <ellipse cx="30" cy="23" rx="3.5" ry="4" transform="rotate(15 30 23)" fill="#0f172a" />
      <circle cx="19" cy="22" r="1.3" fill="#38bdf8" />
      <circle cx="29" cy="22" r="1.3" fill="#38bdf8" />
      {/* Panda nose */}
      <ellipse cx="24" cy="26" rx="2" ry="1.2" fill="#0f172a" />
      <path d="M22 28 Q 24 30 26 28" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />

      {/* Visor Glint Reflection */}
      <path d="M14 18 Q 20 16 28 17" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// Flx Pilot Badge
export function FlxPilotBadge({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pilot Helmet with antenna & communication fin */}
      <line x1="12" y1="12" x2="6" y2="4" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
      <circle cx="5" cy="3" r="2" fill="#a855f7" />

      {/* Helmet Shell */}
      <circle cx="24" cy="24" r="17" fill="#020617" stroke="#a855f7" strokeWidth="2" />
      
      {/* Tactical Goggles / Visor */}
      <path d="M12 21 Q 24 16 36 21 L 34 29 Q 24 25 14 29 Z" fill="#581c87" fillOpacity="0.5" stroke="#c084fc" strokeWidth="1.5" />
      <circle cx="19" cy="23" r="2" fill="#e879f9" />
      <circle cx="29" cy="23" r="2" fill="#e879f9" />

      {/* Headset Mic */}
      <path d="M37 25 Q 38 34 30 35" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
      <circle cx="29" cy="35" r="2.5" fill="#f43f5e" />

      {/* Glint */}
      <path d="M15 22 L 23 19" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// Holographic Space Commander Emotion Avatar (Panda Astronaut)
export function CommanderAvatar({ status, onClick }: { status: 'TITLE' | 'PLAYING' | 'WON' | 'LOST' | 'PAUSED'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Reiniciar Sector (Espacio o R) · Comandante Panda"
      aria-label="Estado de la Misión y Reinicio"
      className="relative group p-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all duration-200 active:scale-95"
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-950/80 overflow-hidden relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:6px_6px] opacity-20" />

        {status === 'PLAYING' && (
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="1.5">
            {/* Panda Ears */}
            <circle cx="8" cy="8" r="3.2" fill="#0f172a" stroke="#38bdf8" />
            <circle cx="24" cy="8" r="3.2" fill="#0f172a" stroke="#38bdf8" />
            {/* Helmet Visor */}
            <circle cx="16" cy="17" r="11" stroke="#38bdf8" fill="#020617" />
            <rect x="9" y="11" width="14" height="11" rx="4" fill="#0369a1" fillOpacity="0.45" stroke="#38bdf8" />
            {/* Panda eye patches */}
            <circle cx="12.5" cy="15.5" r="2" fill="#0f172a" />
            <circle cx="19.5" cy="15.5" r="2" fill="#0f172a" />
            <circle cx="13" cy="15.5" r="0.8" fill="#38bdf8" />
            <circle cx="19" cy="15.5" r="0.8" fill="#38bdf8" />
            {/* Mouth */}
            <path d="M14 19 Q 16 20.5 18 19" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}

        {status === 'WON' && (
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-emerald-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="3.2" fill="#064e3b" stroke="#34d399" />
            <circle cx="24" cy="8" r="3.2" fill="#064e3b" stroke="#34d399" />
            <circle cx="16" cy="17" r="11" stroke="#34d399" fill="#022c22" />
            <rect x="9" y="11" width="14" height="11" rx="4" fill="#047857" fillOpacity="0.5" stroke="#34d399" />
            {/* Victorious cool sunglasses */}
            <polygon points="9,14 15,14 14,17 10,17" fill="#10b981" />
            <polygon points="17,14 23,14 22,17 18,17" fill="#10b981" />
            <line x1="14" y1="15" x2="18" y2="15" stroke="#34d399" strokeWidth="1.5" />
            <path d="M13 19.5 Q 16 22 19 19.5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}

        {status === 'LOST' && (
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-rose-500 animate-shake" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="3.2" fill="#450a0a" stroke="#ef4444" />
            <circle cx="24" cy="8" r="3.2" fill="#450a0a" stroke="#ef4444" />
            <circle cx="16" cy="17" r="11" stroke="#ef4444" fill="#1e1b4b" />
            <rect x="9" y="11" width="14" height="11" rx="4" fill="#991b1b" fillOpacity="0.6" stroke="#ef4444" />
            {/* Dead/breached X eyes */}
            <path d="M11 14 L14 17 M14 14 L11 17" stroke="#fca5a5" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M18 14 L21 17 M21 14 L18 17" stroke="#fca5a5" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M13 20 Q 16 18 19 20" stroke="#fca5a5" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        )}

        {(status === 'TITLE' || status === 'PAUSED') && (
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="3.2" fill="#451a03" stroke="#fbbf24" />
            <circle cx="24" cy="8" r="3.2" fill="#451a03" stroke="#fbbf24" />
            <circle cx="16" cy="17" r="11" stroke="#fbbf24" fill="#0f172a" />
            <rect x="9" y="11" width="14" height="11" rx="4" fill="#78350f" fillOpacity="0.4" stroke="#fbbf24" />
            <circle cx="12.5" cy="15.5" r="1.5" fill="#fde68a" />
            <circle cx="19.5" cy="15.5" r="1.5" fill="#fde68a" />
            <line x1="13.5" y1="19" x2="18.5" y2="19" stroke="#fde68a" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        )}

        {/* Hologram scanline */}
        <div className="absolute inset-x-0 h-[2px] bg-cyan-400/30 animate-pulse pointer-events-none" />
      </div>
    </button>
  );
}

