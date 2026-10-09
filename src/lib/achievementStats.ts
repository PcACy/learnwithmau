import type { SessionStat } from '../types/game';
import { EXAM_FORMAT, PASS_MARK } from './mockExamEngine';

export interface AchievementSessionStats {
  alchemySolved: number;
  tonesCorrect: number;
  sentencesSolved: number;
  blitzCompleted: number;
  typeracerCorrect: number;
  numbersCorrect: number;
  reviewCount: number;
  examPassed: number;
  dialogueCompleted: number;
}

export const EMPTY_SESSION_STATS: AchievementSessionStats = {
  alchemySolved: 0,
  tonesCorrect: 0,
  sentencesSolved: 0,
  blitzCompleted: 0,
  typeracerCorrect: 0,
  numbersCorrect: 0,
  reviewCount: 0,
  examPassed: 0,
  dialogueCompleted: 0,
};

/** Verdichtet die gespeicherten Session-Zeilen zu den Zählern für die Erfolge. */
export function aggregateSessionStats(rows: readonly SessionStat[]): AchievementSessionStats {
  const s = { ...EMPTY_SESSION_STATS };
  for (const row of rows) {
    if (row.mode === 'alchemy') s.alchemySolved += row.correct;
    else if (row.mode === 'ear-trainer') s.tonesCorrect += row.correct;
    else if (row.mode === 'sentences') s.sentencesSolved += row.correct;
    else if (row.mode === 'blitz') s.blitzCompleted += 1;
    else if (row.mode === 'typeracer') s.typeracerCorrect += row.correct;
    else if (row.mode === 'number-drill') s.numbersCorrect += row.correct;
    else if (row.mode === 'review') s.reviewCount += row.answered;
    else if (row.mode === 'exam') {
      if (row.correct * EXAM_FORMAT.pointsPerQuestion >= PASS_MARK) s.examPassed += 1;
    } else if (row.mode === 'dialogue') s.dialogueCompleted += 1;
  }
  return s;
}
