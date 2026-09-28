import mockExamData from '../data/mockExam.json';
import type { ExamQuestion, ExamSection } from '../types/exam';
import { shuffled } from './shuffle';
import { VOCAB } from '../data';
import type { VocabItem } from '../types/vocab';

export type ExamMode = 'set1' | 'set2' | 'shuffle';

const ALL_QUESTIONS = mockExamData as ExamQuestion[];

/** Offizielles Format der neuen HSK-3.0-Prüfung, Stufe 1 (gültig ab 1. Juli 2026). */
export const EXAM_FORMAT = {
  questionsPerSet: 40,
  questionsPerPart: 5,
  partsPerSection: 4,
  listeningQuestions: 20,
  readingQuestions: 20,
  maxScore: 200,
  listeningMaxScore: 100,
  readingMaxScore: 100,
  passMark: 120,
  durationMinutes: 40,
  pointsPerQuestion: 5,
} as const;

export const PASS_MARK = EXAM_FORMAT.passMark;

export interface ExamConfig {
  mode: ExamMode;
  title: string;
  subtitle: string;
  badge: string;
}

export const EXAM_MODES: readonly ExamConfig[] = [
  {
    mode: 'set1',
    title: 'Set 1 · Standard',
    subtitle: 'Offizieller Aufbau: 20 Hör- und 20 Leseverständnisfragen in je vier Teilen',
    badge: 'Standard',
  },
  {
    mode: 'set2',
    title: 'Set 2 · Vertiefung',
    subtitle: 'Zweiter vollständiger Prüfungssatz mit neuen Dialogen und Alltagstexten',
    badge: 'Neu',
  },
  {
    mode: 'shuffle',
    title: 'Zufallsmix · Shuffle',
    subtitle: `Dynamische 40er-Mischung (20 Hören + 20 Lesen) aus dem ${ALL_QUESTIONS.length}er-Pool`,
    badge: 'Dynamisch',
  },
];

/**
 * Vier Teile mit je fünf Fragen aus einer Sektion ziehen.
 *
 * Fragen, die zu einem gemeinsamen Auditiv (Hörverständnis-Teil 3) bzw. zu einem
 * gemeinsamen Lesetext gehören, werden als Block behandelt: Es wird immer ein
 * kompletter Fünferblock gewählt, damit alle Fragen auf dieselbe Vorlage zielen.
 */
function pickBySection(pool: ExamQuestion[], section: ExamSection): ExamQuestion[] {
  const scoped = pool.filter((q) => q.section === section);
  const picked: ExamQuestion[] = [];

  for (let part = 1; part <= EXAM_FORMAT.partsPerSection; part += 1) {
    const inPart = scoped.filter((q) => q.part === part);

    const blocks = new Map<string, ExamQuestion[]>();
    for (const question of inPart) {
      const key = question.audioUrl ?? question.context ?? question.id;
      const block = blocks.get(key);
      if (block) block.push(question);
      else blocks.set(key, [question]);
    }

    let remaining = EXAM_FORMAT.questionsPerPart;
    for (const block of shuffled([...blocks.values()])) {
      if (remaining <= 0) break;
      picked.push(...block.slice(0, remaining));
      remaining -= Math.min(block.length, remaining);
    }
  }

  return picked;
}

export function buildExam(mode: ExamMode): {
  config: ExamConfig;
  questions: ExamQuestion[];
} {
  const config = EXAM_MODES.find((m) => m.mode === mode) ?? EXAM_MODES[0];

  if (mode === 'set1') {
    return {
      config,
      questions: ALL_QUESTIONS.slice(0, EXAM_FORMAT.questionsPerSet),
    };
  }

  if (mode === 'set2') {
    return {
      config,
      questions: ALL_QUESTIONS.slice(EXAM_FORMAT.questionsPerSet, EXAM_FORMAT.questionsPerSet * 2),
    };
  }

  // Shuffle: pro Sektion vier Teile mit je fünf Fragen, in Teilreihenfolge.
  const listening = pickBySection(ALL_QUESTIONS, 'listening');
  const reading = pickBySection(ALL_QUESTIONS, 'reading');

  return {
    config,
    questions: [...listening, ...reading],
  };
}

/**
 * Wertet einen Prüfungslauf im offiziellen Punktesystem aus: fünf Punkte je Frage,
 * 200 Punkte gesamt, Bestehensgrenze 120.
 */
export function scoreExam(
  questions: ExamQuestion[],
  answers: Record<string, number>,
): {
  score: number;
  listeningScore: number;
  readingScore: number;
  passed: boolean;
  totalCorrect: number;
  listeningCorrect: number;
  readingCorrect: number;
} {
  let listeningCorrect = 0;
  let readingCorrect = 0;

  for (const q of questions) {
    if (answers[q.id] !== q.correctIndex) continue;
    if (q.section === 'listening') listeningCorrect += 1;
    else readingCorrect += 1;
  }

  const listeningScore = listeningCorrect * EXAM_FORMAT.pointsPerQuestion;
  const readingScore = readingCorrect * EXAM_FORMAT.pointsPerQuestion;

  return {
    score: listeningScore + readingScore,
    listeningScore,
    readingScore,
    passed: listeningScore + readingScore >= PASS_MARK,
    totalCorrect: listeningCorrect + readingCorrect,
    listeningCorrect,
    readingCorrect,
  };
}

/**
 * Ordnet einer Prüfungsfrage die passende HSK-1-Vokabel für die Fehlerbank zu.
 */
export function findVocabForExamQuestion(q: ExamQuestion): VocabItem | undefined {
  if (q.audioUrl) {
    const match = q.audioUrl.match(/\/audio\/hsk1\/([^.]+)\.mp3/);
    if (match) {
      const found = VOCAB.find((v) => v.id === match[1] || v.audioPath === q.audioUrl);
      if (found) return found;
    }
  }

  const haystack = `${q.chineseText ?? ''} ${q.context ?? ''}`;
  if (haystack.trim().length > 0) {
    const sorted = [...VOCAB].sort((a, b) => b.hanzi.length - a.hanzi.length);
    for (const v of sorted) {
      if (haystack.includes(v.hanzi)) {
        return v;
      }
    }
  }

  return undefined;
}
