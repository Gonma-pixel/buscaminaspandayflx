import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  DifficultyLevel,
  DIFFICULTIES,
  DifficultyConfig,
  CellData,
  GameStatus,
  GameStats,
  InputMode,
} from './types/game';
import {
  createEmptyBoard,
  populateMines,
  revealCell,
  chordCell,
  checkVictory,
  flagAllMinesOnWin,
} from './utils/gameLogic';
import { sound } from './utils/audio';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { TitleScreen } from './components/TitleScreen';
import { HUD } from './components/HUD';
import { Board } from './components/Board';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { StatsModal } from './components/StatsModal';
import { CustomDifficultyModal } from './components/CustomDifficultyModal';

const DEFAULT_STATS: GameStats = {
  gamesPlayed: { cadet: 0, pilot: 0, commander: 0, custom: 0 },
  gamesWon: { cadet: 0, pilot: 0, commander: 0, custom: 0 },
  bestTime: { cadet: null, pilot: null, commander: null, custom: null },
  currentStreak: 0,
  bestStreak: 0,
};

export default function App() {
  // Game state machine
  const [gameStatus, setGameStatus] = useState<GameStatus>('TITLE');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('cadet');
  const [customConfig, setCustomConfig] = useState<DifficultyConfig>({
    id: 'custom',
    name: 'Sector Personalizado',
    code: 'CUSTOM-SEC',
    rows: 10,
    cols: 10,
    mines: 15,
    description: 'Cuadrícula orbital a medida.',
  });

  // Current active configuration
  const activeConfig = difficulty === 'custom' ? customConfig : DIFFICULTIES[difficulty];

  // Board state
  const [board, setBoard] = useState<CellData[][]>(() =>
    createEmptyBoard(activeConfig.rows, activeConfig.cols)
  );
  const [isFirstClick, setIsFirstClick] = useState<boolean>(true);
  const [flagsPlaced, setFlagsPlaced] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Powerups & modes
  const [sonarCharges, setSonarCharges] = useState<number>(2);
  const [isSonarActive, setIsSonarActive] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<InputMode>('reveal');
  const [zoom, setZoom] = useState<number>(1);
  const [isDetonating, setIsDetonating] = useState<boolean>(false);

  // Visual burst for canvas starfield
  const [burstTrigger, setBurstTrigger] = useState<{
    x: number;
    y: number;
    type: 'explosion' | 'victory';
  } | null>(null);

  // Modals
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Sound settings
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());

  // Statistics persisted in localStorage
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const stored = localStorage.getItem('astromines_stats');
      if (stored) {
        return { ...DEFAULT_STATS, ...JSON.parse(stored) };
      }
    } catch {}
    return DEFAULT_STATS;
  });

  // Save stats to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('astromines_stats', JSON.stringify(stats));
    } catch {}
  }, [stats]);

  // Mission timer interval
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerActive && gameStatus === 'PLAYING') {
      timerRef.current = window.setInterval(() => {
        setTimeElapsed((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive, gameStatus]);

  // Start new game setup
  const initGame = useCallback(
    (cfg: DifficultyConfig = activeConfig) => {
      const newBoard = createEmptyBoard(cfg.rows, cfg.cols);
      setBoard(newBoard);
      setIsFirstClick(true);
      setFlagsPlaced(0);
      setTimeElapsed(0);
      setTimerActive(false);
      setSonarCharges(2);
      setIsSonarActive(false);
      setIsDetonating(false);
      setIsNewRecord(false);
      setGameStatus('PLAYING');
    },
    [activeConfig]
  );

  // Handle difficulty selection
  const handleSelectDifficulty = (diff: DifficultyLevel) => {
    setDifficulty(diff);
    const cfg = diff === 'custom' ? customConfig : DIFFICULTIES[diff];
    initGame(cfg);
  };

  // Restart current board
  const handleRestart = () => {
    initGame(activeConfig);
  };

  // Return to Title Menu
  const handleReturnToTitle = () => {
    setTimerActive(false);
    setGameStatus('TITLE');
  };

  // Toggle audio mute
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Trigger Victory state
  const handleVictory = useCallback(
    (finalTime: number) => {
      setTimerActive(false);
      setGameStatus('WON');
      sound.playVictory();

      // Trigger victory burst in center of screen
      setBurstTrigger({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        type: 'victory',
      });

      // Automatically flag all remaining mines
      setBoard((prev) => flagAllMinesOnWin(prev));

      // Update telemetry & check for new personal record
      setStats((prev) => {
        const currentBest = prev.bestTime[difficulty];
        const recordBroken = currentBest === null || finalTime < currentBest;
        setIsNewRecord(recordBroken);

        const newBest = recordBroken ? finalTime : currentBest;
        const newStreak = prev.currentStreak + 1;
        const newBestStreak = Math.max(prev.bestStreak, newStreak);

        return {
          ...prev,
          gamesPlayed: {
            ...prev.gamesPlayed,
            [difficulty]: (prev.gamesPlayed[difficulty] || 0) + 1,
          },
          gamesWon: {
            ...prev.gamesWon,
            [difficulty]: (prev.gamesWon[difficulty] || 0) + 1,
          },
          bestTime: {
            ...prev.bestTime,
            [difficulty]: newBest,
          },
          currentStreak: newStreak,
          bestStreak: newBestStreak,
        };
      });
    },
    [difficulty]
  );

  // Trigger Defeat state
  const handleDefeat = useCallback(
    (detCoord?: [number, number]) => {
      setTimerActive(false);
      setGameStatus('LOST');
      setIsDetonating(true);
      sound.playExplosion();

      // Particle explosion at screen location of the detonated mine
      if (detCoord) {
        const [r, c] = detCoord;
        const cellEl = document.querySelector(`button[data-row="${r}"][data-col="${c}"]`);
        if (cellEl) {
          const rect = cellEl.getBoundingClientRect();
          setBurstTrigger({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            type: 'explosion',
          });
        }
      }

      setTimeout(() => {
        setIsDetonating(false);
      }, 500);

      // Reset streak and increment games played
      setStats((prev) => ({
        ...prev,
        gamesPlayed: {
          ...prev.gamesPlayed,
          [difficulty]: (prev.gamesPlayed[difficulty] || 0) + 1,
        },
        currentStreak: 0,
      }));
    },
    [difficulty]
  );

  // Cell left-click handler
  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'PLAYING') return;

    const cell = board[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    // Sonar scan mode
    if (isSonarActive) {
      sound.playSonar();
      setIsSonarActive(false);
      setSonarCharges((c) => Math.max(0, c - 1));

      // If clicked on a mine, safely flag it!
      if (cell.isMine) {
        const newBoard = board.map((r) => r.map((c) => ({ ...c })));
        newBoard[row][col].isFlagged = true;
        newBoard[row][col].isScanned = true;
        setBoard(newBoard);
        setFlagsPlaced((f) => f + 1);
        sound.playFlag();
        if (checkVictory(newBoard, activeConfig.mines)) {
          handleVictory(timeElapsed);
        }
        return;
      }
    }

    let currentBoard = board;

    // Guaranteed first-click safety
    if (isFirstClick) {
      currentBoard = populateMines(board, row, col, activeConfig.mines);
      setIsFirstClick(false);
      setTimerActive(true);
    }

    const result = revealCell(currentBoard, row, col);
    setBoard(result.newBoard);

    if (result.hitMine) {
      handleDefeat(result.detonatedCoord);
    } else {
      if (result.cascadeSteps > 1) {
        sound.playCascade(Math.min(result.cascadeSteps, 8));
      } else {
        sound.playReveal(result.newBoard[row][col].neighborMines);
      }

      if (checkVictory(result.newBoard, activeConfig.mines)) {
        handleVictory(timeElapsed);
      }
    }
  };

  // Cell right-click handler (Flag / Quantum Beacon)
  const handleCellRightClick = (row: number, col: number) => {
    if (gameStatus !== 'PLAYING') return;
    const cell = board[row][col];
    if (cell.isRevealed) return;

    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    const target = newBoard[row][col];

    if (!target.isFlagged && !target.isQuestion) {
      target.isFlagged = true;
      setFlagsPlaced((f) => f + 1);
      sound.playFlag();
    } else if (target.isFlagged) {
      target.isFlagged = false;
      target.isQuestion = true;
      setFlagsPlaced((f) => Math.max(0, f - 1));
      sound.playUnflag();
    } else {
      target.isQuestion = false;
      sound.playClick();
    }

    setBoard(newBoard);

    if (checkVictory(newBoard, activeConfig.mines)) {
      handleVictory(timeElapsed);
    }
  };

  // Chord action (clearing around a revealed number)
  const handleCellChord = (row: number, col: number) => {
    if (gameStatus !== 'PLAYING') return;
    const cell = board[row][col];
    if (!cell.isRevealed || cell.neighborMines === 0) return;

    sound.playChord();
    const result = chordCell(board, row, col);
    setBoard(result.newBoard);

    if (result.hitMine) {
      handleDefeat(result.detonatedCoord);
    } else if (result.cascadeSteps > 0) {
      if (result.cascadeSteps > 1) {
        sound.playCascade(Math.min(result.cascadeSteps, 8));
      } else {
        sound.playReveal(0);
      }
      if (checkVictory(result.newBoard, activeConfig.mines)) {
        handleVictory(timeElapsed);
      }
    }
  };

  // Activate / Deactivate Sonar Scanner
  const handleActivateSonar = () => {
    if (sonarCharges <= 0 || gameStatus !== 'PLAYING') return;
    sound.playClick();
    setIsSonarActive(!isSonarActive);
  };

  // Zoom helpers
  const handleZoomIn = () => setZoom((z) => Math.min(1.4, Math.round((z + 0.1) * 10) / 10));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, Math.round((z - 0.1) * 10) / 10));
  const handleResetZoom = () => setZoom(1);

  // Custom difficulty modal confirm
  const handleConfirmCustom = (rows: number, cols: number, mines: number) => {
    const newCfg: DifficultyConfig = {
      id: 'custom',
      name: `Sector ${rows}x${cols}`,
      code: 'CUSTOM-SEC',
      rows,
      cols,
      mines,
      description: `Sector espacial personalizado ${rows}x${cols} con ${mines} minas.`,
    };
    setCustomConfig(newCfg);
    setDifficulty('custom');
    setShowCustomModal(false);
    initGame(newCfg);
  };

  // Reset telemetry stats
  const handleResetStats = () => {
    setStats(DEFAULT_STATS);
    try {
      localStorage.removeItem('astromines_stats');
    } catch {}
  };

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when modal forms or inputs are focused
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        if (showStatsModal) setShowStatsModal(false);
        else if (showCustomModal) setShowCustomModal(false);
        else if (gameStatus === 'PLAYING') setGameStatus('PAUSED');
        else if (gameStatus === 'PAUSED') setGameStatus('PLAYING');
      } else if (e.key === 'r' || e.key === 'R') {
        if (gameStatus === 'PLAYING' || gameStatus === 'WON' || gameStatus === 'LOST') {
          handleRestart();
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (gameStatus === 'TITLE') {
          initGame();
        } else if (gameStatus === 'WON' || gameStatus === 'LOST') {
          handleRestart();
        }
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, showStatsModal, showCustomModal, initGame]);

  const remainingMines = Math.max(0, activeConfig.mines - flagsPlaced);

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans">
      {/* 60fps Starfield Canvas & Particle Explosion Engine */}
      <StarfieldCanvas burstTrigger={burstTrigger} />

      {/* Main View Router */}
      {gameStatus === 'TITLE' ? (
        <TitleScreen
          currentDifficulty={difficulty}
          onSelectDifficulty={handleSelectDifficulty}
          onStartGame={() => initGame()}
          onOpenStats={() => setShowStatsModal(true)}
          onOpenCustomModal={() => setShowCustomModal(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-between min-h-screen pb-4">
          {/* Tactical Space HUD */}
          <HUD
            difficulty={difficulty}
            remainingMines={remainingMines}
            timeElapsed={timeElapsed}
            status={gameStatus}
            sonarCharges={sonarCharges}
            isSonarActive={isSonarActive}
            onActivateSonar={handleActivateSonar}
            onRestart={handleRestart}
            onTogglePause={() => setGameStatus((s) => (s === 'PAUSED' ? 'PLAYING' : 'PAUSED'))}
            onReturnToTitle={handleReturnToTitle}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            inputMode={inputMode}
            onToggleInputMode={() => setInputMode((m) => (m === 'reveal' ? 'flag' : 'reveal'))}
          />

          {/* Low-Occlusion Space Playfield Viewport */}
          <main className="w-full flex-1 flex flex-col items-center justify-center px-2 py-1">
            {gameStatus === 'PAUSED' ? (
              <div className="p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 text-center shadow-2xl backdrop-blur-md">
                <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
                  BARRIDO DETENIDO
                </span>
                <h3 className="text-2xl font-black text-white mt-1 mb-4">MISIÓN EN PAUSA</h3>
                <p className="text-xs text-slate-400 mb-6 max-w-xs">
                  Sensores en reposo temporal. Pulsa para reanudar el barrido orbital.
                </p>
                <button
                  onClick={() => {
                    sound.playClick();
                    setGameStatus('PLAYING');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg"
                >
                  Reanudar Operación [Esc]
                </button>
              </div>
            ) : (
              <Board
                board={board}
                onCellClick={handleCellClick}
                onCellRightClick={handleCellRightClick}
                onCellChord={handleCellChord}
                inputMode={inputMode}
                isDetonating={isDetonating}
                zoom={zoom}
              />
            )}
          </main>

          {/* Minimal Bottom Control Hint Bar */}
          <footer className="w-full max-w-xl mx-auto px-4 text-center">
            <div className="text-[11px] text-slate-400 font-mono tracking-tight bg-slate-950/60 py-1 px-3 rounded-full border border-slate-900 inline-flex items-center gap-2">
              <span>Clic: Revelar</span>
              <span>·</span>
              <span>Clic Der / Mantener: Baliza</span>
              <span>·</span>
              <span>Clic Número: Chord</span>
              <span>·</span>
              <span>R: Reiniciar</span>
            </div>
          </footer>
        </div>
      )}

      {/* Victory Modal */}
      {gameStatus === 'WON' && (
        <VictoryModal
          timeElapsed={timeElapsed}
          isNewRecord={isNewRecord}
          bestTime={stats.bestTime[difficulty]}
          difficultyName={activeConfig.name}
          totalMines={activeConfig.mines}
          onPlayAgain={handleRestart}
          onReturnToTitle={handleReturnToTitle}
        />
      )}

      {/* Game Over Modal */}
      {gameStatus === 'LOST' && (
        <GameOverModal
          timeElapsed={timeElapsed}
          difficultyName={activeConfig.name}
          minesFlagged={flagsPlaced}
          totalMines={activeConfig.mines}
          onRetry={handleRestart}
          onReturnToTitle={handleReturnToTitle}
        />
      )}

      {/* Statistics Modal */}
      {showStatsModal && (
        <StatsModal
          stats={stats}
          onClose={() => setShowStatsModal(false)}
          onResetStats={handleResetStats}
        />
      )}

      {/* Custom Difficulty Modal */}
      {showCustomModal && (
        <CustomDifficultyModal
          initialRows={customConfig.rows}
          initialCols={customConfig.cols}
          initialMines={customConfig.mines}
          onConfirm={handleConfirmCustom}
          onClose={() => setShowCustomModal(false)}
        />
      )}
    </div>
  );
}
