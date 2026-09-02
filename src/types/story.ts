export interface StoryWordToken {
  hanzi: string;
  pinyin: string;
  german: string;
  tone?: number;
}

export interface StorySentence {
  id: string;
  hanzi: string;
  pinyin: string;
  german: string;
  audioUrl?: string;
  tokens: StoryWordToken[];
}

export interface StoryQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Story {
  id: string;
  order: number;
  title: string;
  pinyinTitle: string;
  germanTitle: string;
  subtitle: string;
  hanziTag: string; // Background calligraphy watermark, e.g. "读", "饭", "友"
  difficulty: 'HSK 1';
  wordCount: number;
  summary: string;
  audioUrl?: string; // Full story audio
  sentences: StorySentence[];
  quizzes: StoryQuiz[];
}
