import type { SessionStat } from '../types/game';

export interface LevelInfo {
  level: number;
  title: string;
  /** XP innerhalb des aktuellen Levels. */
  xpIntoLevel: number;
  /** XP-Spanne des aktuellen Levels; 0 auf der Maximalstufe. */
  xpForNext: number;
  /** 0..1 Fortschritt zum nächsten Level (1 auf der Maximalstufe). */
  progress: number;
}

export const LEVEL_TITLES: readonly string[] = [
  'Neuling',
  'Lehrling',
  'Schüler',
  'Pinsel-Träger',
  'Zeichen-Sammler',
  'Satz-Schmied',
  'Gesprächs-Partner',
  'Schrift-Gelehrter',
  'Prüfungs-Held',
  'HSK-Meister',
];

export const MAX_LEVEL = LEVEL_TITLES.length;

/** Gesamt-XP, die für den Start von `level` nötig sind (Level 1 = 0). */
export function xpToReachLevel(level: number): number {
  const l = Math.max(1, Math.min(MAX_LEVEL, Math.floor(level)));
  return 50 * (l - 1) * l;
}

export function levelFromXp(xp: number): LevelInfo {
  const total = Number.isFinite(xp) ? Math.max(0, Math.floor(xp)) : 0;
  let level = 1;
  while (level < MAX_LEVEL && total >= xpToReachLevel(level + 1)) level++;

  const title = LEVEL_TITLES[level - 1];
  if (level >= MAX_LEVEL) {
    return { level, title, xpIntoLevel: total - xpToReachLevel(level), xpForNext: 0, progress: 1 };
  }
  const start = xpToReachLevel(level);
  const span = xpToReachLevel(level + 1) - start;
  const into = total - start;
  return { level, title, xpIntoLevel: into, xpForNext: span, progress: into / span };
}

const XP_PER_CORRECT: Partial<Record<SessionStat['mode'], number>> = {
  exam: 5,
};
const DEFAULT_XP_PER_CORRECT = 10;
const XP_PER_WRONG = 2;
const COMPLETION_BONUS = 20;
const COMPLETION_MIN_ANSWERED = 5;
const FLAT_SESSION_XP: Partial<Record<SessionStat['mode'], number>> = {
  dialogue: 40,
  blitz: 30,
};

/** XP für eine abgeschlossene Session; nie negativ, 0 ohne Antworten. */
export function xpForSession(stat: Pick<SessionStat, 'mode' | 'answered' | 'correct'>): number {
  const answered = Math.max(0, stat.answered);
  const correct = Math.min(answered, Math.max(0, stat.correct));
  if (answered === 0 && !FLAT_SESSION_XP[stat.mode]) return 0;

  const perCorrect = XP_PER_CORRECT[stat.mode] ?? DEFAULT_XP_PER_CORRECT;
  let xp = correct * perCorrect + (answered - correct) * XP_PER_WRONG;
  xp += FLAT_SESSION_XP[stat.mode] ?? 0;
  if (answered >= COMPLETION_MIN_ANSWERED) xp += COMPLETION_BONUS;
  return xp;
}
