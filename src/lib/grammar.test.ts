import { describe, expect, it } from 'vitest';
import grammarData from '../data/grammar.json';
import storiesData from '../data/stories.json';
import type { GrammarLesson } from '../types/grammar';
import type { Story } from '../types/story';
import { CHAPTER_LINKS, STORY_TO_GRAMMAR_MAP } from '../data/chapterLinks';

const lessons = grammarData as GrammarLesson[];
const stories = storiesData as Story[];

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

  it('verifies that every grammar lesson has an entry in CHAPTER_LINKS with valid story target', () => {
    const storyIds = new Set(stories.map((s) => s.id));

    lessons.forEach((lesson) => {
      const link = CHAPTER_LINKS[lesson.id];
      expect(link, `Missing CHAPTER_LINK for lesson ${lesson.id}`).toBeDefined();
      expect(link.grammarLessonId).toBe(lesson.id);
      expect(storyIds.has(link.recommendedStoryId), `Invalid story id ${link.recommendedStoryId} in lesson ${lesson.id}`).toBe(true);
      expect(link.keyVocab.length).toBeGreaterThanOrEqual(3);
      expect(link.practiceHint.length).toBeGreaterThan(10);
    });
  });

  it('verifies that all references in STORY_TO_GRAMMAR_MAP match real grammar lessons', () => {
    const lessonIds = new Set(lessons.map((l) => l.id));

    stories.forEach((story) => {
      const mapping = STORY_TO_GRAMMAR_MAP[story.id];
      expect(mapping, `Missing STORY_TO_GRAMMAR_MAP for story ${story.id}`).toBeDefined();
      expect(mapping.length).toBeGreaterThanOrEqual(1);

      mapping.forEach((ref) => {
        expect(lessonIds.has(ref.lessonId), `Invalid lesson reference ${ref.lessonId} in story ${story.id}`).toBe(true);
        expect(ref.lessonTitle.length).toBeGreaterThan(2);
      });
    });
  });

  it('verifies that every example sentence in grammar.json has an audioUrl and audio file exists', () => {
    const audioFiles = import.meta.glob('/public/audio/grammar/*.mp3');
    const existingFileKeys = new Set(Object.keys(audioFiles));

    let totalExamples = 0;

    lessons.forEach((lesson) => {
      lesson.examples.forEach((ex) => {
        totalExamples += 1;
        expect(ex.audioUrl, `Missing audioUrl in example "${ex.hanzi}"`).toBeTruthy();
        expect(ex.audioUrl).toMatch(/^\/audio\/grammar\/g\d{2}-\d{2}\.mp3$/);

        const expectedViteKey = `/public${ex.audioUrl}`;
        expect(existingFileKeys.has(expectedViteKey), `Audio file ${expectedViteKey} does not exist`).toBe(true);
      });
    });

    expect(totalExamples).toBe(27);
  });
});
