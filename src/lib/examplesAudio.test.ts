import { describe, expect, it } from 'vitest';
import { GRAMMAR_PITFALLS } from '../data/grammarPitfalls';
import { getEnrichedVocab } from '../data/vocabDetails';
import { VOCAB } from '../data';

describe('Example Sentences & Pitfall Audio Integrity', () => {
  it('verifies that every vocabulary item has example sentences with valid audioPath and audio files exist', () => {
    const exampleAudioFiles = import.meta.glob('/public/audio/examples/*.mp3');
    const existingKeys = new Set(Object.keys(exampleAudioFiles));
    let checkedSentences = 0;

    for (const item of VOCAB) {
      const enriched = getEnrichedVocab(item);
      expect(enriched.exampleSentences.length).toBeGreaterThan(0);

      for (const sent of enriched.exampleSentences) {
        expect(sent.audioPath, `Missing audioPath in example for ${item.id}`).toBeDefined();
        expect(sent.audioPath).toMatch(/^\/audio\/examples\/ex-hsk1-.*\.mp3$/);

        const expectedKey = `/public${sent.audioPath}`;
        expect(existingKeys.has(expectedKey), `Audio file ${expectedKey} does not exist`).toBe(true);
        checkedSentences++;
      }
    }

    expect(checkedSentences).toBeGreaterThanOrEqual(300);
  });

  it('verifies that every pitfall comparison point has valid audioUrl and existing audio file', () => {
    const pitfallAudioFiles = import.meta.glob('/public/audio/grammar/pitfall-*.mp3');
    const existingKeys = new Set(Object.keys(pitfallAudioFiles));
    let checkedPitfalls = 0;

    for (const pair of GRAMMAR_PITFALLS) {
      for (const pt of pair.comparisonPoints) {
        expect(pt.audioUrl, `Missing audioUrl in pitfall point: ${pt.example}`).toBeDefined();
        expect(pt.audioUrl).toMatch(/^\/audio\/grammar\/pitfall-\d{2}\.mp3$/);

        const expectedKey = `/public${pt.audioUrl}`;
        expect(existingKeys.has(expectedKey), `Audio file ${expectedKey} does not exist`).toBe(true);
        checkedPitfalls++;
      }
    }

    expect(checkedPitfalls).toBe(14);
  });

  it('verifies that every collocation has valid audioPath and existing audio file', () => {
    const collocationAudioFiles = import.meta.glob('/public/audio/collocations/*.mp3');
    const existingKeys = new Set(Object.keys(collocationAudioFiles));
    let checkedCollocations = 0;

    for (const item of VOCAB) {
      const enriched = getEnrichedVocab(item);
      for (const col of enriched.collocations) {
        expect(col.audioPath, `Missing audioPath in collocation for ${item.id}: ${col.hanzi}`).toBeDefined();
        expect(col.audioPath).toMatch(/^\/audio\/collocations\/col-hsk1-.*\.mp3$/);

        const expectedKey = `/public${col.audioPath}`;
        expect(existingKeys.has(expectedKey), `Audio file ${expectedKey} does not exist`).toBe(true);
        checkedCollocations++;
      }
    }

    expect(checkedCollocations).toBeGreaterThan(400);
  });
});
