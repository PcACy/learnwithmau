export type ExamSection = 'listening' | 'reading';

export interface ExamQuestion {
  id: string;
  section: ExamSection;
  part: number; // 1, 2, 3
  prompt: string;
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
  score: number; // Max 300
  listeningScore: number; // Max 150
  readingScore: number; // Max 150
  passed: boolean; // >= 180
  totalAnswered: number;
  totalCorrect: number;
}
