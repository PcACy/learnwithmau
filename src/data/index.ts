import rawRadicals from './radicals.json';
import rawVocab from './hsk1.json';
import { RADICAL_POSITIONS, type Radical, type VocabItem } from '../types/vocab';
import { applyTone } from '../lib/pinyinUtils';

const POSITION_SET: ReadonlySet<string> = new Set<string>(RADICAL_POSITIONS);

const RADICALS: readonly Radical[] = (rawRadicals as Radical[]).map((radical, index) => {
  assertNonEmptyString(radical.id, `radicals[${index}].id`);
  assertNonEmptyString(radical.hanzi, `radicals[${index}].hanzi`);
  if (!Array.isArray(radical.forms)) {
    throw new DataError(`radicals[${index}]: forms muss ein Array sein`);
  }
  for (const field of ['meaning', 'pinyin'] as const) {
    assertNonEmptyString(radical[field], `radicals[${index}].${field}`);
  }
  if (!Number.isInteger(radical.strokes) || radical.strokes < 1) {
    throw new DataError(`radicals[${index}]: strokes muss positive Ganzzahl sein`);
  }
  return radical;
});

function buildRadicalIndex(): ReadonlyMap<string, Radical> {
  const map = new Map<string, Radical>();
  for (const radical of RADICALS) {
    if (map.has(radical.id)) {
      throw new DataError(`Duplikat-Radikal-ID: ${radical.id}`);
    }
    map.set(radical.id, radical);
  }
  return map;
}

export const RADICALS_BY_ID: ReadonlyMap<string, Radical> = buildRadicalIndex();

class DataError extends Error {}

function assertNonEmptyString(value: unknown, field: string): asserts value is string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new DataError(`${field}: nicht-leerer String erwartet`);
  }
}

function validateVocabItem(item: VocabItem): VocabItem {
  const where = `vocab[${item.id ?? '<ohne-id>'}]`;
  assertNonEmptyString(item.id, `${where}.id`);

  assertNonEmptyString(item.hanzi, `${where}.hanzi`);
  assertNonEmptyString(item.pinyin, `${where}.pinyin`);
  assertNonEmptyString(item.meaning, `${where}.meaning`);
  if (item.hskLevel !== 1) {
    throw new DataError(`${where}: hskLevel muss 1 sein`);
  }

  const charCount = Array.from(item.hanzi).length;
  if (!Array.isArray(item.characters) || item.characters.length !== charCount) {
    throw new DataError(`${where}: characters-Länge (${item.characters.length}) ≠ Zeichenzahl (${charCount})`);
  }
  const chars = Array.from(item.hanzi);
  item.characters.forEach((decomposition, i) => {
    if (decomposition.char !== chars[i]) {
      throw new DataError(`${where}: characters[${i}].char "${decomposition.char}" ≠ "${chars[i]}"`);
    }
    if (!Array.isArray(decomposition.parts) || decomposition.parts.length === 0) {
      throw new DataError(`${where}: characters[${i}] ohne parts`);
    }
    for (const part of decomposition.parts) {
      const radical = RADICALS_BY_ID.get(part.id);
      if (!radical) {
        throw new DataError(`${where}: unbekannte Radikal-ID "${part.id}"`);
      }
      const allowedForms = [radical.hanzi, ...radical.forms];
      if (!allowedForms.includes(part.hanzi)) {
        throw new DataError(
          `${where}: Form "${part.hanzi}" passt nicht zu Radikal "${part.id}" (erlaubt: ${allowedForms.join(', ')})`,
        );
      }
      if (!POSITION_SET.has(part.position)) {
        throw new DataError(`${where}: ungültige Position "${part.position}"`);
      }
    }
  });

  if (!Array.isArray(item.syllables) || item.syllables.length !== charCount) {
    throw new DataError(`${where}: syllables-Länge ≠ Zeichenzahl`);
  }
  const rebuiltPinyin = item.syllables
    .map((syllable) => applyTone(syllable.plain, syllable.tone))
    .join(' ');
  if (rebuiltPinyin !== item.pinyin) {
    throw new DataError(`${where}: syllables ergeben "${rebuiltPinyin}", erwartet "${item.pinyin}"`);
  }
  const rebuiltMarked = item.syllables.map((s) => s.marked).join(' ');
  if (rebuiltMarked !== item.pinyin) {
    throw new DataError(`${where}: marked-Silben ergeben "${rebuiltMarked}", erwartet "${item.pinyin}"`);
  }

  if (item.audioPath !== null && typeof item.audioPath !== 'string') {
    throw new DataError(`${where}: audioPath muss string oder null sein`);
  }

  return item;
}

function validateVocab(rawItems: unknown[]): VocabItem[] {
  const seenIds = new Set<string>();
  return rawItems.map((raw) => {
    const item = validateVocabItem(raw as VocabItem);
    if (seenIds.has(item.id)) {
      throw new DataError(`Duplikat-Vocab-ID: ${item.id}`);
    }
    seenIds.add(item.id);
    return item;
  });
}

/** Validierter HSK-1-Katalog (wirft beim Modul-Load bei korrupten Daten). */
export const VOCAB: readonly VocabItem[] = validateVocab(rawVocab as VocabItem[]);

export const VOCAB_BY_ID: ReadonlyMap<string, VocabItem> = new Map(
  VOCAB.map((item) => [item.id, item]),
);

export { THEMATIC_DECKS, THEMATIC_DECKS_BY_ID, getThematicDeck } from './thematicDecks';
export type { ThematicDeck } from './thematicDecks';

