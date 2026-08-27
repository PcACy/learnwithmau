import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS } from '../config/achievements';
import sentences from '../data/sentences.json';
import { MASTERY_LEVELS, getMasteryLevel } from './mastery';
import type { SrsCard } from '../types/srs';

describe('Sentence Builder dataset', () => {
  it('contains valid sentence items with non-empty tokens and explanations', () => {
    expect(sentences.length).toBeGreaterThanOrEqual(20);
    for (const s of sentences) {
      expect(s.id).toBeDefined();
      expect(s.german.length).toBeGreaterThan(0);
      expect(s.tokens.length).toBeGreaterThan(1);
      expect(s.pinyin.length).toBeGreaterThan(0);
      expect(s.explanation.length).toBeGreaterThan(0);
    }
  });
});

describe('Mastery Levels', () => {
  const createCard = (intervalDays: number): SrsCard => ({
    itemId: 'hsk1-ni',
    easiness: 2.5,
    intervalDays,
    repetitions: intervalDays > 0 ? 1 : 0,
    lapses: 0,
    dueDate: '2026-08-30',
    lastReviewedAt: null,
  });

  it('correctly maps SM-2 interval days to mastery tiers', () => {
    expect(getMasteryLevel(undefined).level).toBe(0); // Neu
    expect(getMasteryLevel(createCard(0)).level).toBe(0);
    expect(getMasteryLevel(createCard(2)).level).toBe(1); // Bronze
    expect(getMasteryLevel(createCard(7)).level).toBe(2); // Silber
    expect(getMasteryLevel(createCard(18)).level).toBe(3); // Gold
    expect(getMasteryLevel(createCard(35)).level).toBe(4); // Platin
    expect(getMasteryLevel(createCard(70)).level).toBe(5); // Diamant
  });

  it('has 6 distinct mastery levels', () => {
    expect(MASTERY_LEVELS.length).toBe(6);
  });
});

describe('Achievements configuration', () => {
  it('calculates progress accurately for streaks and vocab counts', () => {
    const firstStep = ACHIEVEMENTS.find((a) => a.id === 'first-step')!;
    expect(firstStep.calculateProgress({ cards: {}, streak: { current: 0, longest: 0 }, stats: {} }).unlocked).toBe(false);

    const cards: Record<string, SrsCard> = {
      'hsk1-ni': {
        itemId: 'hsk1-ni',
        easiness: 2.5,
        intervalDays: 1,
        repetitions: 1,
        lapses: 0,
        dueDate: '2026-08-30',
        lastReviewedAt: null,
      },
    };
    expect(firstStep.calculateProgress({ cards, streak: { current: 0, longest: 0 }, stats: {} }).unlocked).toBe(true);
  });
});
