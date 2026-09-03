import { describe, expect, it } from 'vitest';
import { buildReviewQueue, summarizeQueue } from './reviewQueue';
import type { SrsCard } from '../types/srs';

const NOW = new Date(2026, 7, 24, 12, 0, 0);

function card(dueDate: string): SrsCard {
  return {
    itemId: 'x',
    easiness: 2.5,
    intervalDays: 10,
    repetitions: 3,
    lapses: 0,
    dueDate,
    lastReviewedAt: null,
  };
}

const IDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

function baseCards(): Record<string, SrsCard> {
  return {
    a: card('2026-08-20'), // am weitesten überfällig
    b: card('2026-08-22'),
    c: card('2026-08-23'),
    d: card('2026-08-25'), // Zukunft
    e: card('2026-09-01'),
    // f und g: nie gelernt
  };
}

describe('buildReviewQueue', () => {
  it('sortiert Überfälliges aufsteigend nach dueDate', () => {
    const q = buildReviewQueue(baseCards(), IDS, NOW);
    expect(q.overdueStudied).toEqual(['a', 'b', 'c']);
  });

  it('nimmt zukunftsfällige Karten nicht auf', () => {
    const q = buildReviewQueue(baseCards(), IDS, NOW);
    expect(q.overdueStudied).not.toContain('d');
    expect(q.overdueStudied).not.toContain('e');
  });

  it('listet nie Gelernte als fresh (gemischt, aber vollständig)', () => {
    const q = buildReviewQueue(baseCards(), IDS, NOW);
    expect([...q.fresh].sort()).toEqual(['f', 'g']);
  });

  it('enthält jedes fällige Item genau einmal', () => {
    const q = buildReviewQueue(baseCards(), IDS, NOW);
    const all = [...q.overdueStudied, ...q.fresh];
    expect(new Set(all).size).toBe(all.length);
  });

  it('behandelt einen komplett neuen Bestand als volle fresh-Liste', () => {
    const q = buildReviewQueue({}, IDS, NOW);
    expect(q.overdueStudied).toEqual([]);
    expect(q.fresh).toHaveLength(IDS.length);
  });

  it('begrenzt neue Karten bei Angabe von maxFresh', () => {
    const q1 = buildReviewQueue(baseCards(), IDS, NOW, 1);
    expect(q1.overdueStudied).toEqual(['a', 'b', 'c']);
    expect(q1.fresh).toHaveLength(1);

    const q0 = buildReviewQueue(baseCards(), IDS, NOW, 0);
    expect(q0.overdueStudied).toEqual(['a', 'b', 'c']);
    expect(q0.fresh).toHaveLength(0);

    const qAll = buildReviewQueue(baseCards(), IDS, NOW, 100);
    expect(qAll.fresh).toHaveLength(2);
  });
});

describe('summarizeQueue', () => {
  it('zählt due/fresh und findet die früheste Zukunftsfälligkeit', () => {
    const s = summarizeQueue(baseCards(), IDS, NOW);
    expect(s.dueCount).toBe(3);
    expect(s.freshCount).toBe(2);
    expect(s.totalItems).toBe(IDS.length);
    expect(s.nextDueDate).toBe('2026-08-25');
  });

  it('liefert nextDueDate null, wenn alles fällig ist', () => {
    const s = summarizeQueue({}, IDS, NOW);
    expect(s.dueCount).toBe(0);
    expect(s.nextDueDate).toBeNull();
  });
});
