import { describe, expect, it } from 'vitest';
import storiesData from '../data/stories.json';
import type { Story } from '../types/story';
import { VOCAB } from '../data';

const stories = storiesData as Story[];

describe('HSK-1 Graded Reader Dataset & Integrity', () => {
  it('contains exactly 12 curated HSK-1 stories', () => {
    expect(stories.length).toBe(12);
  });

  it('ensures each story is properly ordered from 1 to 12', () => {
    stories.forEach((story, idx) => {
      expect(story.order).toBe(idx + 1);
      expect(story.id).toBeTruthy();
      expect(story.title).toBeTruthy();
      expect(story.pinyinTitle).toBeTruthy();
      expect(story.germanTitle).toBeTruthy();
      expect(story.hanziTag).toBeTruthy();
      expect(story.difficulty).toBe('HSK 1');
      expect(story.wordCount).toBeGreaterThan(30);
      expect(story.sentences.length).toBeGreaterThanOrEqual(3);
      expect(story.quizzes.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('ensures every sentence has non-empty fields, audioUrl, and valid tokens', () => {
    stories.forEach((story) => {
      story.sentences.forEach((sent) => {
        expect(sent.id).toBeTruthy();
        expect(sent.hanzi.length).toBeGreaterThan(2);
        expect(sent.pinyin.length).toBeGreaterThan(2);
        expect(sent.german.length).toBeGreaterThan(2);
        expect(sent.tokens.length).toBeGreaterThanOrEqual(2);

        sent.tokens.forEach((t) => {
          expect(t.hanzi).toBeTruthy();
          expect(t.pinyin).toBeTruthy();
          expect(t.german).toBeTruthy();
        });
      });
    });
  });

  it('ensures token hanzi fully covers the sentence hanzi for every sentence without omissions', () => {
    const cleanPunctuation = (str: string) => str.replace(/[，。？！、\s,.?!:："'“”‘’]/g, '');
    stories.forEach((story) => {
      story.sentences.forEach((sent) => {
        const full = cleanPunctuation(sent.hanzi);
        const fromTokens = cleanPunctuation(sent.tokens.map((t) => t.hanzi).join(''));
        expect(fromTokens, `Token mismatch in ${story.id} (${sent.id})`).toBe(full);
      });
    });
  });

  it('verifies that all referenced audio URLs match expected asset conventions', () => {
    stories.forEach((story) => {
      if (story.audioUrl) {
        expect(story.audioUrl).toMatch(/^\/audio\/stories\/story-\d{2}-full\.mp3$/);
      }

      story.sentences.forEach((sent) => {
        if (sent.audioUrl) {
          expect(sent.audioUrl).toMatch(/^\/audio\/stories\/s\d{2}-\d{2}\.mp3$/);
        }
      });
    });
  });

  it('ensures all comprehension quizzes have valid options and bounds', () => {
    stories.forEach((story) => {
      story.quizzes.forEach((q) => {
        expect(q.question.length).toBeGreaterThan(5);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(quizOptionsLength(q.options));
        expect(q.explanation.length).toBeGreaterThan(5);
      });
    });
  });

  it('deckt alle 163 HSK-1-Vokabeln im Fließtext der 12 Geschichten ab', () => {
    const allText = stories
      .flatMap((s) => s.sentences.map((sent) => sent.hanzi))
      .join('');

    const missing: string[] = [];
    for (const item of VOCAB) {
      if (!allText.includes(item.hanzi)) {
        missing.push(item.hanzi);
      }
    }

    expect(missing, `Fehlende HSK-1-Vokabeln in den Geschichten: ${missing.join(', ')}`).toEqual([]);
  });
});

function quizOptionsLength(opts: string[]): number {
  return opts.length;
}
