import type { SrsCard } from '../types/srs';
import { computeMastery, isDue } from './srs';

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
  return computeMastery(Object.values(cards), totalItems);
}

