export type ExamSection = 'listening' | 'reading';
export type ExamPart = 1 | 2 | 3 | 4;
export type ExamQuestionType = 'trueFalse' | 'multipleChoice' | 'matching';

export interface ExamQuestion {
  id: string;
  section: ExamSection;
  part: ExamPart;
  type: ExamQuestionType;
  prompt: string;
  /** Gemeinsamer Kontext (z. B. Lesetext) für alle Fragen eines Parts. */
  context?: string;
  chineseText?: string;
  audioUrl?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExamSubmission {
  startedAt: number;
  finishedAt: number;
  answers: Record<string, number>; // questionId -> optionIndex
  markedQuestions: string[]; // questionIds marked for review
  score: number; // Max 200
  listeningScore: number; // Max 100
  readingScore: number; // Max 100
  passed: boolean; // >= 120
  totalAnswered: number;
  totalCorrect: number;
}
