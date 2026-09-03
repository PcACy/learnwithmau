import { TONES, type Tone, type VocabItem } from '../types/vocab';
import type { SrsCard } from '../types/srs';
import { selectDueItemIds } from './srsQuery';
import { applyTone } from './pinyinUtils';
import { shuffled } from './shuffle';

function sample<T>(items: readonly T[], count: number): T[] {
  return shuffled(items).slice(0, count);
}

/** Wählt Session-Items: fällige/ungelernte zuerst, Rest zufällig aufgefüllt. */
export function pickDrillItems(
  cards: Record<string, SrsCard>,
  allItems: readonly VocabItem[],
  count: number,
  now: Date,
): VocabItem[] {
  const byId = new Map(allItems.map((item) => [item.id, item]));
  const dueIds = shuffled(selectDueItemIds(cards, allItems.map((i) => i.id), now));
  const picked: VocabItem[] = [];

  for (const id of dueIds) {
    if (picked.length >= count) break;
    const item = byId.get(id);
    if (item) picked.push(item);
  }
  if (picked.length < count) {
    const dueSet = new Set(dueIds);
    for (const item of sample(
      allItems.filter((i) => !dueSet.has(i.id)),
      count - picked.length,
    )) {
      picked.push(item);
    }
  }
  return picked.slice(0, count);
}

export interface ToneQuestion {
  itemId: string;
  syllableIndex: number;
  plain: string;
  correctTone: Tone;
  options: { marked: string; tone: Tone }[];
}

/** Baut eine Ton-Frage: korrekter Ton + 3 andere Töne als Optionen. */
export function buildToneQuestion(item: VocabItem): ToneQuestion {
  const syllableIndex = Math.floor(Math.random() * item.syllables.length);
  const syllable = item.syllables[syllableIndex];

  const otherTones = shuffled(TONES.filter((tone) => tone !== syllable.tone));
  const optionTones: Tone[] = [syllable.tone, ...otherTones.slice(0, 3)];

  return {
    itemId: item.id,
    syllableIndex,
    plain: syllable.plain,
    correctTone: syllable.tone,
    options: shuffled(optionTones).map((tone) => ({
      marked: applyTone(syllable.plain, tone),
      tone,
    })),
  };
}

function wordSimilarity(a: VocabItem, b: VocabItem): number {
  let score = 0;
  for (const sa of a.syllables) {
    if (b.syllables.some((sb) => sb.plain === sa.plain)) score += 2;
  }
  if (
    a.syllables.length === b.syllables.length &&
    a.syllables.every((sa, i) => b.syllables[i]?.tone === sa.tone)
  ) {
    score += 1;
  }
  return score;
}

/** Zielwort + 3 ähnliche Distraktoren (geteilte Silben/Tonmuster), gemischt. */
export function buildWordOptions(target: VocabItem, pool: readonly VocabItem[]): VocabItem[] {
  const scored = pool
    .filter((candidate) => candidate.id !== target.id)
    .map((candidate) => ({ candidate, score: wordSimilarity(target, candidate) }))
    .sort((x, y) => y.score - x.score);

  const distractors = sample(scored.slice(0, 8).map((entry) => entry.candidate), 3);
  return shuffled([target, ...distractors]);
}
