import mockExamData from '../data/mockExam.json';
import type { ExamQuestion } from '../types/exam';

export type ExamMode = 'set1' | 'set2' | 'shuffle';

const ALL_QUESTIONS = mockExamData as ExamQuestion[];

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
    subtitle: 'Klassische HSK-1-Probeprüfung mit Fokus auf Grundwortschatz',
    badge: 'Standard',
  },
  {
    mode: 'set2',
    title: 'Set 2 · Vertiefung',
    subtitle: 'Neue Dialoge, Alltagsfragen und vertiefte Grammatikstrukturen',
    badge: 'Neu',
  },
  {
    mode: 'shuffle',
    title: 'Zufallsmix · Shuffle',
    subtitle: 'Dynamische 30er-Mischung (15 Hören + 15 Lesen) aus dem 60er-Pool',
    badge: 'Dynamisch',
  },
];

export function buildExam(mode: ExamMode): {
  config: ExamConfig;
  questions: ExamQuestion[];
} {
  const config = EXAM_MODES.find((m) => m.mode === mode) ?? EXAM_MODES[0];

  if (mode === 'set1') {
    return {
      config,
      questions: ALL_QUESTIONS.slice(0, 30),
    };
  }

  if (mode === 'set2') {
    return {
      config,
      questions: ALL_QUESTIONS.slice(30, 60),
    };
  }

  // Shuffle: Pick exactly 15 listening questions and 15 reading questions
  const listeningPool = ALL_QUESTIONS.filter((q) => q.section === 'listening');
  const readingPool = ALL_QUESTIONS.filter((q) => q.section === 'reading');

  const shuffleArray = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const selectedListening = shuffleArray(listeningPool).slice(0, 15);
  selectedListening.sort((a, b) => a.part - b.part);

  const selectedReading = shuffleArray(readingPool).slice(0, 15);
  selectedReading.sort((a, b) => a.part - b.part);

  return {
    config,
    questions: [...selectedListening, ...selectedReading],
  };
}
