import { describe, expect, it } from 'vitest';
import sentencesData from '../data/sentences.json';

interface SentenceItem {
  id: string;
  german: string;
  pinyin: string;
  tokens: string[];
  explanation: string;
  audioUrl?: string;
}

const sentences = sentencesData as SentenceItem[];

describe('Sentence Builder Dataset & Audio Integrity', () => {
  it('contains exactly 20 structured HSK-1 exercise sentences', () => {
    expect(sentences.length).toBe(20);
  });

  it('ensures each sentence has valid tokens, pinyin, german translation, and explanation', () => {
    sentences.forEach((s) => {
      expect(s.id).toMatch(/^s\d+$/);
      expect(s.tokens.length).toBeGreaterThanOrEqual(2);
      expect(s.german.length).toBeGreaterThan(3);
      expect(s.pinyin.length).toBeGreaterThan(3);
      expect(s.explanation.length).toBeGreaterThan(10);

      // Verify that tokens joined form the expected Chinese sentence
      const joined = s.tokens.join('');
      expect(joined.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('verifies that every sentence has an audioUrl and audio file exists in public/audio/sentences/', () => {
    const audioFiles = import.meta.glob('/public/audio/sentences/*.mp3');
    const existingKeys = new Set(Object.keys(audioFiles));

    sentences.forEach((s) => {
      expect(s.audioUrl, `Missing audioUrl in sentence ${s.id}`).toBeTruthy();
      expect(s.audioUrl).toMatch(/^\/audio\/sentences\/s\d{2}\.mp3$/);

      const expectedKey = `/public${s.audioUrl}`;
      expect(existingKeys.has(expectedKey), `Audio file ${expectedKey} does not exist`).toBe(true);
    });

    expect(Object.keys(audioFiles).length).toBe(20);
  });
});
