import { describe, expect, it } from 'vitest';
import {
  buildDrillQuestion,
  nearDates,
  nearNumbers,
  nearTimes,
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

  describe('buildDrillQuestion', () => {
    const kinds: DrillKind[] = ['number', 'time', 'date'];

    kinds.forEach((kind) => {
      it(`always builds 4 unique options without ? fallback for kind "${kind}"`, () => {
        for (let i = 0; i < 20; i++) {
          const q = buildDrillQuestion(kind);
          expect(q.options.length).toBe(4);
          expect(new Set(q.options).size).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(4);
          for (const opt of q.options) {
            expect(opt).not.toContain('?');
          }
        }
      });
    });
  });
});
