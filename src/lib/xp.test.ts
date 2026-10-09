import { describe, expect, it } from 'vitest';
import { MAX_LEVEL, levelFromXp, xpForSession, xpToReachLevel } from './xp';
import { aggregateSessionStats } from './achievementStats';

describe('levelFromXp', () => {
  it('starts at level 1 with zero progress', () => {
    const info = levelFromXp(0);
    expect(info.level).toBe(1);
    expect(info.progress).toBe(0);
    expect(info.xpForNext).toBe(100);
  });

  it('advances exactly at the level thresholds', () => {
    expect(levelFromXp(99).level).toBe(1);
    expect(levelFromXp(100).level).toBe(2);
    expect(levelFromXp(299).level).toBe(2);
    expect(levelFromXp(300).level).toBe(3);
  });

  it('caps at the max level and reports full progress', () => {
    const info = levelFromXp(xpToReachLevel(MAX_LEVEL) + 99999);
    expect(info.level).toBe(MAX_LEVEL);
    expect(info.progress).toBe(1);
    expect(info.xpForNext).toBe(0);
  });

  it('survives invalid input', () => {
    expect(levelFromXp(Number.NaN).level).toBe(1);
    expect(levelFromXp(-50).level).toBe(1);
  });
});

describe('xpForSession', () => {
  it('awards nothing for an empty session', () => {
    expect(xpForSession({ mode: 'review', answered: 0, correct: 0 })).toBe(0);
  });

  it('rewards correct answers more than wrong ones plus a completion bonus', () => {
    // 8 correct * 10 + 2 wrong * 2 + 20 bonus
    expect(xpForSession({ mode: 'review', answered: 10, correct: 8 })).toBe(104);
  });

  it('skips the completion bonus for very short sessions', () => {
    expect(xpForSession({ mode: 'review', answered: 3, correct: 3 })).toBe(30);
  });

  it('weights exam questions lower and adds flat XP for dialogues', () => {
    expect(xpForSession({ mode: 'exam', answered: 30, correct: 30 })).toBe(170);
    expect(xpForSession({ mode: 'dialogue', answered: 1, correct: 1 })).toBe(50);
  });

  it('clamps correct above answered', () => {
    expect(xpForSession({ mode: 'review', answered: 2, correct: 9 })).toBe(20);
  });
});

describe('aggregateSessionStats', () => {
  it('matches the counters used by the achievements', () => {
    const at = new Date().toISOString();
    const stats = aggregateSessionStats([
      { mode: 'alchemy', finishedAt: at, answered: 3, correct: 2, durationMs: 1 },
      { mode: 'review', finishedAt: at, answered: 12, correct: 9, durationMs: 1 },
      { mode: 'blitz', finishedAt: at, answered: 5, correct: 1, durationMs: 1 },
      { mode: 'exam', finishedAt: at, answered: 30, correct: 24, durationMs: 1 },
    ]);
    expect(stats.alchemySolved).toBe(2);
    expect(stats.reviewCount).toBe(12);
    expect(stats.blitzCompleted).toBe(1);
    expect(stats.examPassed).toBe(1);
  });
});
