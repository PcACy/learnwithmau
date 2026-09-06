import { describe, expect, it } from 'vitest';
import {
  REQUIRED_CONSECUTIVE_CORRECT,
  applyDrillResult,
  createOrUpdateMistakeRecord,
  filterActiveMistakes,
  filterResolvedMistakes,
  generateMistakeDrillBatch,
  isPinyinAnswerCorrect,
} from './mistakeBank';
import type { MistakeRecord } from '../types/mistake';
import { VOCAB, VOCAB_BY_ID } from '../data';

describe('mistakeBank logic', () => {
  it('creates a new mistake record on first failure', () => {
    const record = createOrUpdateMistakeRecord(undefined, 'hsk1-nihao', 'blitz', new Date('2026-09-06T10:00:00Z'));
    expect(record.itemId).toBe('hsk1-nihao');
    expect(record.totalMistakes).toBe(1);
    expect(record.consecutiveCorrect).toBe(0);
    expect(record.isResolved).toBe(false);
    expect(record.lastSourceMode).toBe('blitz');
    expect(record.firstFailedAt).toBe('2026-09-06T10:00:00.000Z');
  });

  it('increments mistakes and resets streak on subsequent failure', () => {
    const existing: MistakeRecord = {
      itemId: 'hsk1-nihao',
      firstFailedAt: '2026-09-06T10:00:00.000Z',
      lastFailedAt: '2026-09-06T10:00:00.000Z',
      lastSourceMode: 'blitz',
      totalMistakes: 1,
      consecutiveCorrect: 1,
      isResolved: false,
    };

    const updated = createOrUpdateMistakeRecord(existing, 'hsk1-nihao', 'exam', new Date('2026-09-06T11:00:00Z'));
    expect(updated.totalMistakes).toBe(2);
    expect(updated.consecutiveCorrect).toBe(0);
    expect(updated.lastSourceMode).toBe('exam');
    expect(updated.lastFailedAt).toBe('2026-09-06T11:00:00.000Z');
  });

  it('resolves mistake only after 2 consecutive correct answers', () => {
    const initial: MistakeRecord = {
      itemId: 'hsk1-nihao',
      firstFailedAt: '2026-09-06T10:00:00.000Z',
      lastFailedAt: '2026-09-06T10:00:00.000Z',
      lastSourceMode: 'blitz',
      totalMistakes: 2,
      consecutiveCorrect: 0,
      isResolved: false,
    };

    // First correct answer
    const step1 = applyDrillResult(initial, true, new Date('2026-09-06T12:00:00Z'));
    expect(step1.consecutiveCorrect).toBe(1);
    expect(step1.isResolved).toBe(false);
    expect(step1.resolvedAt).toBeUndefined();

    // Second correct answer
    const step2 = applyDrillResult(step1, true, new Date('2026-09-06T12:05:00Z'));
    expect(step2.consecutiveCorrect).toBe(REQUIRED_CONSECUTIVE_CORRECT);
    expect(step2.isResolved).toBe(true);
    expect(step2.resolvedAt).toBe('2026-09-06T12:05:00.000Z');
  });

  it('resets streak if answered incorrectly during drill', () => {
    const withOneStreak: MistakeRecord = {
      itemId: 'hsk1-nihao',
      firstFailedAt: '2026-09-06T10:00:00.000Z',
      lastFailedAt: '2026-09-06T10:00:00.000Z',
      lastSourceMode: 'blitz',
      totalMistakes: 1,
      consecutiveCorrect: 1,
      isResolved: false,
    };

    const failed = applyDrillResult(withOneStreak, false, new Date('2026-09-06T12:10:00Z'));
    expect(failed.consecutiveCorrect).toBe(0);
    expect(failed.totalMistakes).toBe(2);
    expect(failed.isResolved).toBe(false);
  });

  it('filters and sorts active mistakes by priority', () => {
    const mistakes: Record<string, MistakeRecord> = {
      itemA: {
        itemId: 'itemA',
        firstFailedAt: '2026-09-06T10:00:00.000Z',
        lastFailedAt: '2026-09-06T10:00:00.000Z',
        lastSourceMode: 'blitz',
        totalMistakes: 1,
        consecutiveCorrect: 0,
        isResolved: false,
      },
      itemB: {
        itemId: 'itemB',
        firstFailedAt: '2026-09-06T09:00:00.000Z',
        lastFailedAt: '2026-09-06T11:00:00.000Z',
        lastSourceMode: 'exam',
        totalMistakes: 3,
        consecutiveCorrect: 1,
        isResolved: false,
      },
      itemC: {
        itemId: 'itemC',
        firstFailedAt: '2026-09-06T08:00:00.000Z',
        lastFailedAt: '2026-09-06T08:00:00.000Z',
        lastSourceMode: 'typeracer',
        totalMistakes: 2,
        consecutiveCorrect: 2,
        isResolved: true,
        resolvedAt: '2026-09-06T09:00:00.000Z',
      },
    };

    const active = filterActiveMistakes(mistakes);
    expect(active.length).toBe(2);
    expect(active[0].itemId).toBe('itemB'); // Higher mistake count
    expect(active[1].itemId).toBe('itemA');

    const resolved = filterResolvedMistakes(mistakes);
    expect(resolved.length).toBe(1);
    expect(resolved[0].itemId).toBe('itemC');
  });

  it('validates flexible pinyin answers correctly', () => {
    const nihao = VOCAB.find((v) => v.hanzi === '你好')!;
    expect(isPinyinAnswerCorrect('nǐ hǎo', nihao)).toBe(true);
    expect(isPinyinAnswerCorrect('ni hao', nihao)).toBe(true);
    expect(isPinyinAnswerCorrect('nihao', nihao)).toBe(true);
    expect(isPinyinAnswerCorrect('ni3hao3', nihao)).toBe(true);
    expect(isPinyinAnswerCorrect('ni3 hao3', nihao)).toBe(true);
    expect(isPinyinAnswerCorrect('xièxie', nihao)).toBe(false);
  });

  it('generates a multi-modal drill batch with options and distractors', () => {
    const active: MistakeRecord[] = VOCAB.slice(0, 3).map((v) => ({
      itemId: v.id,
      firstFailedAt: '2026-09-06T10:00:00.000Z',
      lastFailedAt: '2026-09-06T10:00:00.000Z',
      lastSourceMode: 'blitz',
      totalMistakes: 2,
      consecutiveCorrect: 0,
      isResolved: false,
    }));

    const batch = generateMistakeDrillBatch(active, VOCAB_BY_ID, 3);
    expect(batch.length).toBe(3);
    expect(batch[0].type).toBe('meaning_choice');
    expect(batch[0].options?.length).toBe(4);
    expect(batch[0].options).toContain(batch[0].correctAnswer);

    expect(batch[1].type).toBe('audio_listening');
    expect(batch[1].options?.length).toBe(4);
    expect(batch[1].options).toContain(batch[1].correctAnswer);

    expect(batch[2].type).toBe('pinyin_input');
    expect(batch[2].correctAnswer).toBeDefined();
  });
});
