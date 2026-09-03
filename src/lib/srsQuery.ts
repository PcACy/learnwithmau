import type { SrsCard } from '../types/srs';
import { isDue, MASTERY_INTERVAL_DAYS } from './srs';

/** Item-IDs fällig heute (nie Gelerntes gilt als sofort fällig). */
export function selectDueItemIds(
  cards: Record<string, SrsCard>,
  allItemIds: readonly string[],
  now: Date,
): string[] {
  return allItemIds.filter((itemId) => {
    const card = cards[itemId];
    return !card || isDue(card, now);
  });
}

/** Mastery-Score 0..1 über alle Items des Katalogs. */
export function selectMastery(cards: Record<string, SrsCard>, totalItems: number): number {
  if (totalItems <= 0) return 0;
  const sum = Object.values(cards).reduce(
    (acc, card) => acc + Math.min(card.intervalDays / MASTERY_INTERVAL_DAYS, 1),
    0,
  );
  return sum / totalItems;
}

