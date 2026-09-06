import { describe, expect, it } from 'vitest';
import { INITIALS, FINALS, TONE_SANDHI_RULES, ORTHOGRAPHY_RULES } from '../data/pinyinData';
import { BASIC_STROKES, STROKE_ORDER_RULES } from '../data/strokeGuideData';
import { GRAMMAR_PITFALLS } from '../data/grammarPitfalls';
import { CULTURE_TOPICS } from '../data/cultureNotes';

describe('Textbook Parity Content & Data Tests', () => {
  describe('Pinyin & Phonetics Data', () => {
    it('contains all standard initials and semi-vowels', () => {
      expect(INITIALS.length).toBeGreaterThanOrEqual(23);
      const pinyins = INITIALS.map((i) => i.pinyin);
      expect(pinyins).toContain('b');
      expect(pinyins).toContain('zh');
      expect(pinyins).toContain('j');
      expect(pinyins).toContain('q');
      expect(pinyins).toContain('x');
      expect(pinyins).toContain('y');
      expect(pinyins).toContain('w');
    });

    it('contains simple, compound and nasal finals including all standard Mandarin categories', () => {
      expect(FINALS.length).toBeGreaterThanOrEqual(30);
      const pinyins = FINALS.map((f) => f.pinyin);
      expect(pinyins).toEqual(
        expect.arrayContaining([
          'a', 'o', 'e', 'i', 'u', 'ü',
          'ai', 'ei', 'ao', 'ou', 'ia', 'ie', 'ua', 'uo', 'üe / ue', 'iao', 'iu', 'uai', 'ui',
          'an', 'en', 'in', 'ian', 'uan', 'un', 'ün', 'üan',
          'ang', 'eng', 'ing', 'ong', 'iang', 'uang', 'iong',
          'er',
        ]),
      );

      // Verify 'in' does not erroneously have 'jiǔ'
      const inFinal = FINALS.find((f) => f.pinyin === 'in');
      expect(inFinal).toBeDefined();
      expect(inFinal?.sampleWords.some((w) => w.hanzi === '您')).toBe(true);
      expect(inFinal?.sampleWords.some((w) => w.pinyin.includes('jiǔ'))).toBe(false);

      // Verify 'iu' has 'jiǔ'
      const iuFinal = FINALS.find((f) => f.pinyin === 'iu');
      expect(iuFinal).toBeDefined();
      expect(iuFinal?.sampleWords.some((w) => w.pinyin.includes('jiǔ'))).toBe(true);
    });

    it('provides all 4 core tone sandhi rules with examples', () => {
      expect(TONE_SANDHI_RULES.length).toBe(4);
      const ids = TONE_SANDHI_RULES.map((r) => r.id);
      expect(ids).toContain('third-third-sandhi');
      expect(ids).toContain('yi-sandhi');
      expect(ids).toContain('bu-sandhi');
      expect(ids).toContain('neutral-tone');

      for (const rule of TONE_SANDHI_RULES) {
        expect(rule.exampleOriginal).toBeTruthy();
        expect(rule.exampleSpoken).toBeTruthy();
        expect(rule.moreExamples.length).toBeGreaterThan(0);
      }
    });

    it('contains critical orthography rules', () => {
      const ids = ORTHOGRAPHY_RULES.map((r) => r.id);
      expect(ids).toContain('u-umlaut-rule');
      expect(ids).toContain('apostrophe-rule');
      expect(ids).toContain('abbreviated-vowels');
    });
  });

  describe('Stroke Theory & Writing Rules', () => {
    it('contains the 8 fundamental strokes (永字八法) with authentic stroke glyphs', () => {
      expect(BASIC_STROKES.length).toBe(8);
      const names = BASIC_STROKES.map((s) => s.name);
      expect(names).toEqual(expect.arrayContaining(['点', '横', '竖', '撇', '捺', '提', '折', '钩']));
      const tiStroke = BASIC_STROKES.find((s) => s.id === 'ti');
      expect(tiStroke?.glyph).toBe('㇀');
    });

    it('contains the 7 fundamental stroke order rules', () => {
      expect(STROKE_ORDER_RULES.length).toBe(7);
      const rules = STROKE_ORDER_RULES.map((r) => r.ruleChinese);
      expect(rules).toEqual(
        expect.arrayContaining([
          '先横后竖',
          '先撇后捺',
          '从上到下',
          '从左到右',
          '先外后内',
          '先外后内再封口',
          '先中间后两边',
        ]),
      );
    });
  });

  describe('Contrastive Grammar Pitfalls', () => {
    it('contains essential HSK-1 pitfall pairs', () => {
      expect(GRAMMAR_PITFALLS.length).toBeGreaterThanOrEqual(5);
      const ids = GRAMMAR_PITFALLS.map((p) => p.id);
      expect(ids).toContain('er-vs-liang');
      expect(ids).toContain('bu-vs-mei');
      expect(ids).toContain('xiang-vs-yao');
      expect(ids).toContain('zenme-vs-zenmeyang');
      expect(ids).toContain('na-question-vs-demonstrative');
    });

    it('has valid quiz items with in-bound correctIndex', () => {
      for (const pair of GRAMMAR_PITFALLS) {
        for (const quiz of pair.quiz) {
          expect(quiz.options.length).toBeGreaterThanOrEqual(2);
          expect(quiz.correctIndex).toBeGreaterThanOrEqual(0);
          expect(quiz.correctIndex).toBeLessThan(quiz.options.length);
          expect(quiz.explanation.length).toBeGreaterThan(10);
        }
      }
    });
  });

  describe('Culture & Etiquette Notes', () => {
    it('contains core Chinese cultural topics with vocabulary', () => {
      expect(CULTURE_TOPICS.length).toBeGreaterThanOrEqual(5);
      for (const topic of CULTURE_TOPICS) {
        expect(topic.titleGerman).toBeTruthy();
        expect(topic.keyTakeaways.length).toBeGreaterThanOrEqual(3);
        expect(topic.vocabulary.length).toBeGreaterThan(0);
        expect(topic.etiquetteTip).toBeTruthy();
      }
    });
  });
});
