import { describe, expect, it } from 'vitest';
import grammarData from '../data/grammar.json';
import storiesData from '../data/stories.json';
import { LESSONS_META, STORIES_META, TOTAL_GRAMMAR_LESSONS, TOTAL_STORIES } from '../data/curriculumMeta';

describe('Curriculum Metadata Integrity', () => {
  it('matches all grammar lessons in order, count, and titles', () => {
    expect(TOTAL_GRAMMAR_LESSONS).toBe(grammarData.length);
    expect(LESSONS_META.map((m) => m.id)).toEqual(grammarData.map((g) => g.id));
    expect(LESSONS_META.map((m) => m.title)).toEqual(grammarData.map((g) => g.title));
    expect(LESSONS_META.map((m) => m.subtitle)).toEqual(grammarData.map((g) => g.subtitle));
  });

  it('matches all stories in order, count, and titles', () => {
    expect(TOTAL_STORIES).toBe(storiesData.length);
    expect(STORIES_META.map((m) => m.id)).toEqual(storiesData.map((s) => s.id));
    expect(STORIES_META.map((m) => m.title)).toEqual(storiesData.map((s) => s.title));
    expect(STORIES_META.map((m) => m.germanTitle)).toEqual(storiesData.map((s) => s.germanTitle));
  });
});
