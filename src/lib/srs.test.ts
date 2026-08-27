import { describe, expect, it } from 'vitest';
import {
  applyReview,
  computeMastery,
  createCard,
  isDue,
  MASTERY_INTERVAL_DAYS,
  toDateKey,
} from './srs';

const NOW = new Date(2026, 7, 24, 10, 0, 0); // lokal, kein UTC-Bias

describe('toDateKey', () => {
  it('formatiert lokal ohne UTC-Versatz', () => {
    expect(toDateKey(new Date(2026, 7, 3))).toBe('2026-08-03');
    expect(toDateKey(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31');
  });

  it('polstert einstellig Monat und Tag', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('applyReview – Intervallfolge', () => {
  it('erste Wiederholung ergibt 1 Tag', () => {
    const card = applyReview(createCard('x', NOW), 4, NOW);
    expect(card.intervalDays).toBe(1);
    expect(card.repetitions).toBe(1);
  });

  it('zweite Wiederholung ergibt 6 Tage', () => {
    let card = applyReview(createCard('x', NOW), 4, NOW);
    card = applyReview(card, 4, NOW);
    expect(card.intervalDays).toBe(6);
    expect(card.repetitions).toBe(2);
  });

  it('dritte Wiederholung nutzt den aktualisierten EF', () => {
    let card = applyReview(createCard('x', NOW), 5, NOW);
    card = applyReview(card, 4, NOW);
    const ef = card.easiness; // 2.6 → q=4 hält EF bei 2.6
    card = applyReview(card, 4, NOW);
    expect(card.intervalDays).toBe(Math.round(6 * ef));
  });

  it('Grade < 3 bricht ab und zählt den Lapse', () => {
    let card = applyReview(createCard('x', NOW), 5, NOW);
    card = applyReview(card, 4, NOW);
    card = applyReview(card, 1, NOW);
    expect(card.repetitions).toBe(0);
    expect(card.lapses).toBe(1);
    expect(card.intervalDays).toBe(1);
  });

  it('Lapse zählt nicht bei nie bestandener Karte', () => {
    const card = applyReview(createCard('x', NOW), 0, NOW);
    expect(card.lapses).toBe(0);
  });

  it('setzt dueDate korrekt auf now + Intervall', () => {
    const card = applyReview(createCard('x', NOW), 4, NOW);
    expect(card.dueDate).toBe('2026-08-25');
  });
});

describe('Easiness-Faktor', () => {
  it('steigt bei Grade 5 um 0.1', () => {
    const card = applyReview(createCard('x'), 5);
    expect(card.easiness).toBeCloseTo(2.6, 5);
  });

  it('sinkt bei Grade 0 deutlich (−0.8)', () => {
    const card = applyReview(createCard('x'), 0);
    expect(card.easiness).toBeCloseTo(1.7, 5);
  });

  it('klemmt bei 1.3', () => {
    let card = createCard('x');
    for (let i = 0; i < 20; i++) {
      card = applyReview(card, 0);
    }
    expect(card.easiness).toBe(1.3);
  });
});

describe('isDue & computeMastery', () => {
  it('heute und Vergangenheit sind fällig', () => {
    expect(isDue({ ...createCard('x'), dueDate: '2026-08-24' }, NOW)).toBe(true);
    expect(isDue({ ...createCard('x'), dueDate: '2026-08-23' }, NOW)).toBe(true);
    expect(isDue({ ...createCard('x'), dueDate: '2026-08-25' }, NOW)).toBe(false);
  });

  it(`Mastery klemmt bei ${MASTERY_INTERVAL_DAYS} Tagen pro Karte`, () => {
    const cards = [
      { intervalDays: MASTERY_INTERVAL_DAYS },
      { intervalDays: 42 },
      { intervalDays: 0 },
    ].map((partial, i) => ({ ...createCard(`c${i}`), ...partial }));
    // (1 + 1 + 0) / 3
    expect(computeMastery(cards, 3)).toBeCloseTo(2 / 3, 9);
  });

  it('Mastery ist 0 bei leerem Bestand oder 0 Items', () => {
    expect(computeMastery([], 0)).toBe(0);
    expect(computeMastery([], 5)).toBe(0);
  });
});
