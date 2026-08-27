import type { SrsCard } from '../types/srs';
import { isDue } from './srs';
import { shuffled } from './shuffle';

export interface ReviewQueue {
  /** Überfällige Gelernte nach dueDate aufsteigend (Ältestes zuerst). */
  overdueStudied: string[];
  /** Nie gelernte Items, durchmischt. */
  fresh: string[];
}

/**
 * Baut die anfängliche Warteschlange: überfällige Karten zuerst (das
 * längst Fälligste ganz vorn), nie Gelernte dahinter in zufälliger Ordnung.
 */
export function buildReviewQueue(
  cards: Record<string, SrsCard>,
  allItemIds: readonly string[],
  now: Date,
): ReviewQueue {
  const overdue: { id: string; dueDate: string }[] = [];
  const fresh: string[] = [];

  for (const id of allItemIds) {
    const card = cards[id];
    if (!card) {
      fresh.push(id);
    } else if (isDue(card, now)) {
      overdue.push({ id, dueDate: card.dueDate });
    }
  }

  overdue.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return { overdueStudied: overdue.map((entry) => entry.id), fresh: shuffled(fresh) };
}

export interface QueueSummary {
  totalItems: number;
  /** Überfällig gelernte Karten. */
  dueCount: number;
  /** Nie gelernte Items. */
  freshCount: number;
  /** Früheste künftige Fälligkeit (nur relevant, wenn nichts fällig ist). */
  nextDueDate: string | null;
}

/** Zählt die Warteschlange für Intro-/Empty-State. */
export function summarizeQueue(
  cards: Record<string, SrsCard>,
  allItemIds: readonly string[],
  now: Date,
): QueueSummary {
  let dueCount = 0;
  let freshCount = 0;
  let nextDueDate: string | null = null;

  for (const id of allItemIds) {
    const card = cards[id];
    if (!card) {
      freshCount++;
      continue;
    }
    if (isDue(card, now)) {
      dueCount++;
    } else if (nextDueDate === null || card.dueDate < nextDueDate) {
      nextDueDate = card.dueDate;
    }
  }

  return { totalItems: allItemIds.length, dueCount, freshCount, nextDueDate };
}
