import { describe, expect, it } from 'vitest';
import grammarData from '../data/grammar.json';
import type { GrammarLesson } from '../types/grammar';

const lessons = grammarData as GrammarLesson[];

describe('HSK-1 Grammar Curriculum Dataset', () => {
  it('contains exactly 12 comprehensive HSK-1 grammar lessons', () => {
    expect(lessons.length).toBe(12);
  });

  it('ensures each lesson is properly ordered from 1 to 12', () => {
    lessons.forEach((lesson, index) => {
      expect(lesson.order).toBe(index + 1);
      expect(lesson.id).toBeTruthy();
      expect(lesson.hanziTag).toBeTruthy();
    });
  });

  it('ensures every lesson has a syntax formula, key rules, and examples', () => {
    lessons.forEach((lesson) => {
      expect(lesson.title.length).toBeGreaterThan(3);
      expect(lesson.subtitle.length).toBeGreaterThan(3);
      expect(lesson.summary.length).toBeGreaterThan(15);

      expect(lesson.formula.pattern).toBeTruthy();
      expect(lesson.formula.explanation.length).toBeGreaterThan(10);

      expect(lesson.keyRules.length).toBeGreaterThanOrEqual(2);
      expect(lesson.examples.length).toBeGreaterThanOrEqual(2);

      lesson.examples.forEach((ex) => {
        expect(ex.hanzi).toBeTruthy();
        expect(ex.pinyin).toBeTruthy();
        expect(ex.german).toBeTruthy();
      });
    });
  });

  it('ensures all lesson quizzes have valid options and correctIndex bounds', () => {
    lessons.forEach((lesson) => {
      expect(lesson.quizzes.length).toBeGreaterThanOrEqual(1);

      lesson.quizzes.forEach((quiz) => {
        expect(quiz.question.length).toBeGreaterThan(5);
        expect(quiz.options.length).toBeGreaterThanOrEqual(2);
        expect(quiz.correctIndex).toBeGreaterThanOrEqual(0);
        expect(quiz.correctIndex).toBeLessThan(quiz.options.length);
        expect(quiz.explanation.length).toBeGreaterThan(5);
      });
    });
  });
});
