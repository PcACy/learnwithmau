import { describe, expect, it } from 'vitest';
import { generateBlitzQuestions } from './blitzGenerator';

describe('blitzGenerator', () => {
  it('generates the requested number of questions', () => {
    const questions = generateBlitzQuestions(12);
    expect(questions).toHaveLength(12);
  });

  it('provides 4 distinct options per question with correctAnswer present', () => {
    const questions = generateBlitzQuestions(15);
    for (const q of questions) {
      expect(q.options.length).toBeGreaterThanOrEqual(4);
      expect(q.options).toContain(q.correctAnswer);
      expect(new Set(q.options).size).toBe(q.options.length);
    }
  });

  it('cycles across meaning, pinyin, and tone question types', () => {
    const questions = generateBlitzQuestions(6);
    const types = questions.map((q) => q.type);
    expect(types).toEqual(['tone', 'meaning', 'pinyin', 'tone', 'meaning', 'pinyin']);
  });

  it('handles empty vocab safely', () => {
    const questions = generateBlitzQuestions(5, []);
    expect(questions).toEqual([]);
  });
});
