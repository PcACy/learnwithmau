import { describe, expect, it } from 'vitest';
import { EMPTY_SESSION_STATS } from './achievementStats';
import { findNewUnlocks, withUnlocks } from './gamification';
import { importBackup } from './db';

const streak = { current: 0, longest: 0, lastActiveDate: null };

describe('findNewUnlocks', () => {
  it('returns nothing for an empty profile', () => {
    expect(findNewUnlocks({}, streak, EMPTY_SESSION_STATS, {})).toEqual([]);
  });

  it('detects a freshly earned achievement and skips already unlocked ones', () => {
    const stats = { ...EMPTY_SESSION_STATS, blitzCompleted: 1 };
    expect(findNewUnlocks({}, streak, stats, {})).toEqual(['blitz-champion']);
    expect(findNewUnlocks({}, streak, stats, { 'blitz-champion': '2026-01-01T00:00:00.000Z' })).toEqual([]);
  });

  it('detects streak achievements from the longest streak', () => {
    const ids = findNewUnlocks({}, { current: 0, longest: 7, lastActiveDate: null }, EMPTY_SESSION_STATS, {});
    expect(ids).toEqual(expect.arrayContaining(['streak-3', 'streak-7']));
  });
});

describe('withUnlocks', () => {
  it('adds timestamps without mutating the input', () => {
    const before = { a: '2026-01-01T00:00:00.000Z' };
    const after = withUnlocks(before, ['b'], new Date('2026-02-02T00:00:00.000Z'));
    expect(after).toEqual({ a: before.a, b: '2026-02-02T00:00:00.000Z' });
    expect(before).toEqual({ a: '2026-01-01T00:00:00.000Z' });
  });
});

describe('backup compatibility', () => {
  it('rejects a backup that is not an object, as before', async () => {
    const res = await importBackup('null');
    expect(res.success).toBe(false);
  });
});
