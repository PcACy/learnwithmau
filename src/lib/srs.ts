import type { SrsCard, SrsGrade } from '../types/srs';

/** Ein Item gilt ab 21 Tagen Intervall als gemeistert. */
export const MASTERY_INTERVAL_DAYS = 21;

const SRS_MIN_EASINESS = 1.3;

const DEFAULT_EASINESS = 2.5;

/** Lokales Datum als YYYY-MM-DD (kein UTC-Versatz). */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function createCard(itemId: string, now: Date = new Date()): SrsCard {
  return {
    itemId,
    easiness: DEFAULT_EASINESS,
    intervalDays: 0,
    repetitions: 0,
    lapses: 0,
    dueDate: toDateKey(now),
    lastReviewedAt: null,
  };
}

function nextEasiness(easiness: number, grade: SrsGrade): number {
  const q: number = grade;
  const updated = easiness + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  return Math.max(SRS_MIN_EASINESS, Math.round(updated * 100) / 100);
}

function nextInterval(card: SrsCard, easiness: number): number {
  if (card.repetitions === 0) return 1;
  if (card.repetitions === 1) return 6;
  return Math.max(1, Math.round(card.intervalDays * easiness));
}

/**
 * Reine SM-2-Anwendung: gibt eine neue Karte zurück und mutiert nichts.
 * Grade < 3 bricht die Serie ab (Repetitions auf 0, Intervall auf 1 Tag).
 */
export function applyReview(card: SrsCard, grade: SrsGrade, now: Date = new Date()): SrsCard {
  const easiness = nextEasiness(card.easiness, grade);
  const passed = grade >= 3;

  const repetitions = passed ? card.repetitions + 1 : 0;
  const intervalDays = passed ? nextInterval(card, easiness) : 1;
  const lapses = !passed && card.repetitions > 0 ? card.lapses + 1 : card.lapses;

  return {
    ...card,
    easiness,
    intervalDays,
    repetitions,
    lapses,
    dueDate: toDateKey(addDays(now, intervalDays)),
    lastReviewedAt: now.toISOString(),
  };
}

export function isDue(card: SrsCard, now: Date = new Date()): boolean {
  return card.dueDate <= toDateKey(now);
}

/** Mastery-Anteil eines Kartenbestands: Σ min(interval/21, 1) / totalItems. */
export function computeMastery(cards: SrsCard[], totalItems: number): number {
  if (totalItems <= 0) return 0;
  const sum = cards.reduce(
    (acc, card) => acc + Math.min(card.intervalDays / MASTERY_INTERVAL_DAYS, 1),
    0,
  );
  return sum / totalItems;
}
