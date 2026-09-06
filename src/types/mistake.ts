export type MistakeSourceMode = 'blitz' | 'exam' | 'typeracer' | 'ear-trainer' | 'review';

export interface MistakeRecord {
  itemId: string;
  firstFailedAt: string;
  lastFailedAt: string;
  lastSourceMode: MistakeSourceMode;
  totalMistakes: number;
  consecutiveCorrect: number;
  isResolved: boolean;
  resolvedAt?: string;
}

export type MistakeDrillType = 'meaning_choice' | 'pinyin_input' | 'audio_listening';

export interface MistakeDrillQuestion {
  itemId: string;
  type: MistakeDrillType;
  hanzi: string;
  pinyin: string;
  translation: string;
  audioText: string;
  options?: string[];
  correctAnswer: string;
}
