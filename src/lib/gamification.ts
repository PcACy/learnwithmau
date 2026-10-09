import { ACHIEVEMENTS } from '../config/achievements';
import type { SrsCard } from '../types/srs';
import type { StreakData } from '../types/game';
import type { AchievementSessionStats } from './achievementStats';

/** IDs der Erfolge, die aktuell erfüllt sind, aber noch nicht in `already` stehen. */
export function findNewUnlocks(
  cards: Record<string, SrsCard>,
  streak: StreakData,
  stats: AchievementSessionStats,
  already: Record<string, string>,
): string[] {
  const ids: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (already[ach.id]) continue;
    if (ach.calculateProgress({ cards, streak, stats }).unlocked) ids.push(ach.id);
  }
  return ids;
}

/** Gibt `already` zusammen mit den neuen IDs (Zeitstempel `at`) als neue Map zurück. */
export function withUnlocks(
  already: Record<string, string>,
  ids: readonly string[],
  at: Date,
): Record<string, string> {
  const next = { ...already };
  for (const id of ids) next[id] = at.toISOString();
  return next;
}
