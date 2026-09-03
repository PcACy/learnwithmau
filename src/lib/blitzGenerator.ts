import { VOCAB } from '../data';
import { shuffled } from './shuffle';
import type { VocabItem } from '../types/vocab';

export type BlitzQuestionType = 'meaning' | 'pinyin' | 'tone';

export interface BlitzQuestion {
  id: string;
  type: BlitzQuestionType;
  item: VocabItem;
  prompt: string;
  options: string[];
  correctAnswer: string;
  audioUrl?: string | null;
}

const TONE_NAMES: Record<number, string> = {
  1: 'Ton 1 (ˉ)',
  2: 'Ton 2 (ˊ)',
  3: 'Ton 3 (ˇ)',
  4: 'Ton 4 (ˋ)',
  5: 'Neutraler Ton',
};

const STANDARD_TONE_OPTIONS = ['Ton 1 (ˉ)', 'Ton 2 (ˊ)', 'Ton 3 (ˇ)', 'Ton 4 (ˋ)'];

/**
 * Generiert eine Sequenz abwechslungsreicher Schnellfeuer-Fragen (Bedeutung, Pinyin, Töne)
 * für den 90-Sekunden-Blitzmodus.
 */
export function generateBlitzQuestions(count = 15, vocab: readonly VocabItem[] = VOCAB): BlitzQuestion[] {
  if (vocab.length === 0) return [];
  const shuffledVocab = shuffled(vocab);
  const questions: BlitzQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const item = shuffledVocab[i % shuffledVocab.length];
    const qType: BlitzQuestionType = i % 3 === 0 ? 'tone' : i % 3 === 1 ? 'meaning' : 'pinyin';

    if (qType === 'meaning') {
      const correct = item.meaning.split(',')[0].trim();
      const distinctDistractors = Array.from(
        new Set(
          vocab.map((v) => v.meaning.split(',')[0].trim()).filter((m) => m !== correct),
        ),
      );
      const distractors = shuffled(distinctDistractors).slice(0, 3);
      const options = shuffled([correct, ...distractors]);

      questions.push({
        id: `blitz-${i}-${Date.now()}`,
        type: 'meaning',
        item,
        prompt: `Welche Bedeutung hat „${item.hanzi}“?`,
        options,
        correctAnswer: correct,
        audioUrl: item.audioPath,
      });
    } else if (qType === 'pinyin') {
      const correct = item.pinyin;
      const distinctDistractors = Array.from(
        new Set(
          vocab.map((v) => v.pinyin).filter((p) => p !== correct),
        ),
      );
      const distractors = shuffled(distinctDistractors).slice(0, 3);
      const options = shuffled([correct, ...distractors]);

      questions.push({
        id: `blitz-${i}-${Date.now()}`,
        type: 'pinyin',
        item,
        prompt: `Welches Pinyin passt zu „${item.hanzi}“?`,
        options,
        correctAnswer: correct,
        audioUrl: item.audioPath,
      });
    } else {
      const firstTone = item.syllables[0]?.tone ?? 1;
      const correct = TONE_NAMES[firstTone] || 'Ton 1 (ˉ)';
      const options = firstTone === 5
        ? shuffled(['Neutraler Ton', 'Ton 1 (ˉ)', 'Ton 2 (ˊ)', 'Ton 4 (ˋ)'])
        : STANDARD_TONE_OPTIONS;

      questions.push({
        id: `blitz-${i}-${Date.now()}`,
        type: 'tone',
        item,
        prompt: `Welchen Ton hat die erste Silbe von „${item.hanzi}“ (${item.syllables[0]?.plain ?? ''})?`,
        options,
        correctAnswer: correct,
        audioUrl: item.audioPath,
      });
    }
  }

  return questions;
}
