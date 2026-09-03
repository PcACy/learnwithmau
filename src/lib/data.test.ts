import { describe, expect, it } from 'vitest';
import { RADICALS_BY_ID, VOCAB } from '../data';
import { stripToneMarks } from '../lib/pinyinUtils';

describe('Katalog-Integrität', () => {
  it('umfasst den vollständigen HSK-1-Bestand', () => {
    expect(VOCAB.length).toBeGreaterThanOrEqual(150);
  });

  it('hat keine doppelten IDs', () => {
    const ids = VOCAB.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('hat für jeden Eintrag einen audioPath im erwarteten Muster', () => {
    for (const item of VOCAB) {
      expect(item.audioPath).toBe(`/audio/hsk1/${item.id}.mp3`);
    }
  });

  it('konsistiert Hanzi ↔ Zeichenzerlegung ↔ Silbenzahl', () => {
    for (const item of VOCAB) {
      const chars = Array.from(item.hanzi);
      expect(item.characters).toHaveLength(chars.length);
      expect(item.syllables).toHaveLength(chars.length);
      item.characters.forEach((decomp, i) => {
        expect(decomp.char).toBe(chars[i]);
      });
    }
  });

  it('rekonstruiert marked-Silben exakt zum pinyin-Feld', () => {
    for (const item of VOCAB) {
      const rebuilt = item.syllables.map((s) => s.marked).join(' ');
      expect(rebuilt).toBe(item.pinyin);
      // v↔ü-Konvention wie im pinyinUtils-Roundtrip einpreisen.
      const plainJoined = item.syllables
        .map((s) => stripToneMarks(s.marked))
        .join(' ');
      const expectedPlain = item.syllables.map((s) => s.plain.replaceAll('v', 'ü')).join(' ');
      expect(plainJoined).toBe(expectedPlain);
    }
  });

  it('verweist nur auf bekannte Radikale mit passender Kontextform', () => {
    for (const item of VOCAB) {
      for (const decomposition of item.characters) {
        for (const part of decomposition.parts) {
          const radical = RADICALS_BY_ID.get(part.id);
          expect(radical, `unbekanntes Radikal ${part.id} in ${item.id}`).toBeDefined();
          if (!radical) continue;
          expect([radical.hanzi, ...radical.forms]).toContain(part.hanzi);
        }
      }
    }
  });

  it('besitzt für alle 163 Vokabeln authentische Beispielsätze ohne Platzhalter', async () => {
    const { getEnrichedVocab } = await import('../data/vocabDetails');
    for (const item of VOCAB) {
      const enriched = getEnrichedVocab(item);
      expect(enriched.exampleSentences.length, `Keine Beispielsätze für ${item.id}`).toBeGreaterThanOrEqual(1);
      for (const s of enriched.exampleSentences) {
        expect(s.hanzi.length).toBeGreaterThan(0);
        expect(s.pinyin.length).toBeGreaterThan(0);
        expect(s.german.length).toBeGreaterThan(0);
        // Sicherstellen, dass keine furchtbaren Auto-Templates vorkommen
        expect(s.german).not.toContain('Das ist hallo');
        expect(s.hanzi).not.toBe(`这是${item.hanzi}。`);
      }

      // Kollokationen dürfen keine Fake-Strings enthalten
      for (const c of enriched.collocations) {
        expect(c.german).not.toContain('mit hallo');
        expect(c.hanzi).not.toBe(`${item.hanzi}好`);
      }

      // Chao-Pitch-Level muss sauber vorliegen
      expect(enriched.chaoPitch.levels.length).toBeGreaterThanOrEqual(3);
    }
  });
});
