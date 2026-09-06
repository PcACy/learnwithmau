import { describe, expect, it } from 'vitest';
import {
  buildDrillQuestion,
  nearDates,
  nearNumbers,
  nearTimes,
  promptToPinyin,
  type DrillKind,
} from './numberDrill';

describe('numberDrill generator', () => {
  describe('nearDates', () => {
    it('produces at least 3 distinct distractors for edge date (12.28.)', () => {
      const distractors = nearDates(12, 28);
      expect(distractors.length).toBeGreaterThanOrEqual(3);
      expect(distractors).not.toContain('28.12.');
      for (const d of distractors) {
        expect(d).toMatch(/^\d{1,2}\.\d{1,2}\.$/);
        expect(d).not.toContain('?');
      }
      const unique = new Set(distractors);
      expect(unique.size).toBe(distractors.length);
    });

    it('produces at least 3 distinct distractors for edge date (1.1.)', () => {
      const distractors = nearDates(1, 1);
      expect(distractors.length).toBeGreaterThanOrEqual(3);
      expect(distractors).not.toContain('1.1.');
      for (const d of distractors) {
        expect(d).toMatch(/^\d{1,2}\.\d{1,2}\.$/);
      }
    });
  });

  describe('nearNumbers', () => {
    it('produces at least 3 distinct distractors for boundary number 1', () => {
      const distractors = nearNumbers(1);
      expect(distractors.length).toBeGreaterThanOrEqual(3);
      expect(distractors).not.toContain(1);
      for (const n of distractors) {
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(999);
      }
    });

    it('produces at least 3 distinct distractors for boundary number 999', () => {
      const distractors = nearNumbers(999);
      expect(distractors.length).toBeGreaterThanOrEqual(3);
      expect(distractors).not.toContain(999);
      for (const n of distractors) {
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(999);
      }
    });
  });

  describe('nearTimes', () => {
    it('produces at least 3 distinct distractors for 12:00', () => {
      const distractors = nearTimes(12, 0);
      expect(distractors.length).toBeGreaterThanOrEqual(3);
      expect(distractors).not.toContain('12:00');
      for (const t of distractors) {
        expect(t).toMatch(/^\d{1,2}:\d{2}$/);
      }
    });
  });

  describe('promptToPinyin', () => {
    it('converts numbers, times, weekdays and dates correctly to marked pinyin', () => {
      expect(promptToPinyin('三百二十五')).toBe('sān bǎi èr shí wǔ');
      expect(promptToPinyin('两点半')).toBe('liǎng diǎn bàn');
      expect(promptToPinyin('星期三')).toBe('xīng qī sān');
      expect(promptToPinyin('五月十二号')).toBe('wǔ yuè shí èr hào');
      expect(promptToPinyin('零')).toBe('líng');
    });
  });

  describe('buildDrillQuestion', () => {
    const kinds: DrillKind[] = ['number', 'time', 'date'];

    kinds.forEach((kind) => {
      it(`always builds 4 unique options with valid pinyin for kind "${kind}"`, () => {
        for (let i = 0; i < 20; i++) {
          const q = buildDrillQuestion(kind);
          expect(q.options.length).toBe(4);
          expect(new Set(q.options).size).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(4);
          expect(q.pinyin).toBeTruthy();
          expect(q.pinyin.length).toBeGreaterThan(0);
          for (const opt of q.options) {
            expect(opt).not.toContain('?');
          }
        }
      });
    });
  });
});
