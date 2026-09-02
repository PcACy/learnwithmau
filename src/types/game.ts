import type { SrsGrade } from './srs';

/** Die Lernmodi der Plattform. */
export type ModeId =
  | 'ear-trainer'
  | 'typeracer'
  | 'alchemy'
  | 'number-drill'
  | 'review'
  | 'sentences'
  | 'exam'
  | 'blitz';

export interface StreakData {
  current: number;
  longest: number;
  /** Lokaler Datumsschlüssel (YYYY-MM-DD) des letzten Lerntags. */
  lastActiveDate: string | null;
}

export interface DailyGoal {
  date: string;
  targetReviews: number;
  completedReviews: number;
}

export interface SessionStat {
  id?: number;
  mode: ModeId;
  finishedAt: string;
  answered: number;
  correct: number;
  durationMs: number;
}

/** Ergebnis einer einzelnen Antwort innerhalb eines Modus. */
export interface AnswerResult {
  itemId: string;
  grade: SrsGrade;
}
