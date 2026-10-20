export type DifficultyLevel = 'cadet' | 'pilot' | 'commander' | 'custom';

export interface DifficultyConfig {
  id: DifficultyLevel;
  name: string;
  code: string;
  rows: number;
  cols: number;
  mines: number;
  description: string;
}

export const DIFFICULTIES: Record<Exclude<DifficultyLevel, 'custom'>, DifficultyConfig> = {
  cadet: {
    id: 'cadet',
    name: 'Cadete Espacial',
    code: 'SECTOR-09',
    rows: 9,
    cols: 9,
    mines: 10,
    description: 'Reconocimiento inicial. 9x9 con 10 anomalías gravitacionales.',
  },
  pilot: {
    id: 'pilot',
    name: 'Piloto Orbital',
    code: 'SECTOR-16',
    rows: 16,
    cols: 16,
    mines: 40,
    description: 'Campo de asteroides denso. 16x16 con 40 minas de antimateria.',
  },
  commander: {
    id: 'commander',
    name: 'Comandante del Vacío',
    code: 'SECTOR-30',
    rows: 16,
    cols: 30,
    mines: 99,
    description: 'Zona de guerra cósmica. 16x30 con 99 núcleos inestables.',
  },
};

export interface CellData {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestion: boolean;
  neighborMines: number;
  isDetonated?: boolean;
  isScanned?: boolean;
  explodedAt?: number;
}

export type GameStatus = 'TITLE' | 'PLAYING' | 'WON' | 'LOST' | 'PAUSED';

export type InputMode = 'reveal' | 'flag';

export interface GameStats {
  gamesPlayed: Record<DifficultyLevel, number>;
  gamesWon: Record<DifficultyLevel, number>;
  bestTime: Record<DifficultyLevel, number | null>;
  currentStreak: number;
  bestStreak: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxLife: number;
  life: number;
}
