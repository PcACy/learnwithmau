import type { VocabItem } from '../types/vocab';
import type { MistakeDrillQuestion, MistakeDrillType, MistakeRecord, MistakeSourceMode } from '../types/mistake';
import { stripToneMarks } from './pinyinUtils';

export const REQUIRED_CONSECUTIVE_CORRECT = 2;

export function createOrUpdateMistakeRecord(
  existing: MistakeRecord | undefined,
  itemId: string,
  mode: MistakeSourceMode,
  now: Date = new Date(),
): MistakeRecord {
  const timestamp = now.toISOString();
  if (!existing) {
    return {
      itemId,
      firstFailedAt: timestamp,
      lastFailedAt: timestamp,
      lastSourceMode: mode,
      totalMistakes: 1,
      consecutiveCorrect: 0,
      isResolved: false,
    };
  }

  return {
    ...existing,
    lastFailedAt: timestamp,
    lastSourceMode: mode,
    totalMistakes: existing.totalMistakes + 1,
    consecutiveCorrect: 0,
    isResolved: false,
    resolvedAt: undefined,
  };
}

export function applyDrillResult(
  record: MistakeRecord,
  correct: boolean,
  now: Date = new Date(),
): MistakeRecord {
  if (correct) {
    const nextStreak = record.consecutiveCorrect + 1;
    const isResolved = nextStreak >= REQUIRED_CONSECUTIVE_CORRECT;
    return {
      ...record,
      consecutiveCorrect: nextStreak,
      isResolved,
      resolvedAt: isResolved ? now.toISOString() : record.resolvedAt,
    };
  }

  return {
    ...record,
    totalMistakes: record.totalMistakes + 1,
    consecutiveCorrect: 0,
    isResolved: false,
    lastFailedAt: now.toISOString(),
  };
}

export function filterActiveMistakes(mistakes: Record<string, MistakeRecord>): MistakeRecord[] {
  return Object.values(mistakes)
    .filter((m) => !m.isResolved)
    .sort((a, b) => {
      if (b.totalMistakes !== a.totalMistakes) {
        return b.totalMistakes - a.totalMistakes;
      }
      return new Date(b.lastFailedAt).getTime() - new Date(a.lastFailedAt).getTime();
    });
}

export function filterResolvedMistakes(mistakes: Record<string, MistakeRecord>): MistakeRecord[] {
  return Object.values(mistakes)
    .filter((m) => m.isResolved)
    .sort((a, b) => {
      const timeA = a.resolvedAt ? new Date(a.resolvedAt).getTime() : 0;
      const timeB = b.resolvedAt ? new Date(b.resolvedAt).getTime() : 0;
      return timeB - timeA;
    });
}

function cleanInput(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, '');
}

/**
 * Validiert Benutzereingaben für Pinyin-Fragen flexibel:
 * Erlaubt Ton-Pinyin (z.B. "nǐ hǎo"), Plain Pinyin (z.B. "ni hao", "nihao")
 * oder Zahlen-Pinyin (z.B. "ni3 hao3", "ni3hao3").
 */
export function isPinyinAnswerCorrect(userAnswer: string, item: VocabItem): boolean {
  const cleanedUser = cleanInput(userAnswer);
  if (!cleanedUser) return false;

  const userStripped = cleanInput(stripToneMarks(userAnswer));

  // 1. Plain pinyin (z.B. "ni hao" -> "nihao")
  const plainJoined = cleanInput(item.syllables.map((s) => s.plain).join(''));
  if (cleanedUser === plainJoined || userStripped === plainJoined) return true;

  // 2. Ton-markiertes Pinyin (z.B. "nǐ hǎo" -> "nǐhǎo")
  const markedJoined = cleanInput(item.pinyin);
  if (cleanedUser === markedJoined) return true;

  // 3. Pinyin mit Tonnummern (z.B. "ni3hao3")
  const numberedJoined = cleanInput(item.syllables.map((s) => `${s.plain}${s.tone}`).join(''));
  if (cleanedUser === numberedJoined) return true;

  return false;
}

function shuffle<T>(array: T[], random = Math.random): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateMistakeDrillBatch(
  activeMistakes: MistakeRecord[],
  vocabMap: ReadonlyMap<string, VocabItem> | readonly VocabItem[],
  batchSize: number = 5,
  random = Math.random,
): MistakeDrillQuestion[] {
  const vocabLookup: ReadonlyMap<string, VocabItem> =
    vocabMap instanceof Map
      ? (vocabMap as ReadonlyMap<string, VocabItem>)
      : new Map((vocabMap as readonly VocabItem[]).map((v) => [v.id, v]));

  const allVocabList: VocabItem[] = Array.from(vocabLookup.values());
  const selectedMistakes = activeMistakes.slice(0, batchSize);

  const DRILL_TYPES: MistakeDrillType[] = ['meaning_choice', 'audio_listening', 'pinyin_input'];
  const results: MistakeDrillQuestion[] = [];

  for (let i = 0; i < selectedMistakes.length; i++) {
    const mistake = selectedMistakes[i];
    const vocab = vocabLookup.get(mistake.itemId);
    if (!vocab) continue;

    const type = DRILL_TYPES[i % DRILL_TYPES.length];

    if (type === 'pinyin_input') {
      results.push({
        itemId: vocab.id,
        type,
        hanzi: vocab.hanzi,
        pinyin: vocab.pinyin,
        translation: vocab.meaning,
        audioText: vocab.hanzi,
        correctAnswer: vocab.syllables.map((s) => s.plain).join(' '),
      });
      continue;
    }

    if (type === 'audio_listening') {
      const correctAnswer = `${vocab.hanzi} · ${vocab.pinyin}`;
      const otherVocab = allVocabList.filter((v) => v.id !== vocab.id);
      const distractors = shuffle(otherVocab, random)
        .slice(0, 3)
        .map((v) => `${v.hanzi} · ${v.pinyin}`);
      const options = shuffle([correctAnswer, ...distractors], random);

      results.push({
        itemId: vocab.id,
        type,
        hanzi: vocab.hanzi,
        pinyin: vocab.pinyin,
        translation: vocab.meaning,
        audioText: vocab.hanzi,
        options,
        correctAnswer,
      });
      continue;
    }

    // meaning_choice
    const correctAnswer = vocab.meaning;
    const otherVocab = allVocabList.filter((v) => v.id !== vocab.id);
    const distractors = shuffle(otherVocab, random)
      .slice(0, 3)
      .map((v) => v.meaning);
    const options = shuffle([correctAnswer, ...distractors], random);

    results.push({
      itemId: vocab.id,
      type: 'meaning_choice',
      hanzi: vocab.hanzi,
      pinyin: vocab.pinyin,
      translation: vocab.meaning,
      audioText: vocab.hanzi,
      options,
      correctAnswer,
    });
  }

  return results;
}
