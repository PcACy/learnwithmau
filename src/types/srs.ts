/** SM-2-Qualitätsurteil einer Wiederholung (0 = "vergessen" … 5 = "perfekt"). */
export type SrsGrade = 0 | 1 | 2 | 3 | 4 | 5;

export interface SrsCard {
  itemId: string;
  /** Easiness-Faktor, untere Grenze 1.3. */
  easiness: number;
  intervalDays: number;
  repetitions: number;
  lapses: number;
  /** Lokaler Datumsschlüssel (YYYY-MM-DD), ab dem das Item wieder fällig ist. */
  dueDate: string;
  lastReviewedAt: string | null;
}
