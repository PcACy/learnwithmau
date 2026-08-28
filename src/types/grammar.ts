export interface GrammarExample {
  hanzi: string;
  pinyin: string;
  german: string;
  audioUrl?: string;
  breakdown?: { part: string; meaning: string }[];
}

export interface GrammarPitfall {
  wrong: string;
  right: string;
  explanation: string;
}

export interface GrammarQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GrammarLesson {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  hanziTag: string; // e.g. "是", "在", "的"
  summary: string;
  formula: {
    pattern: string;
    explanation: string;
  };
  keyRules: string[];
  examples: GrammarExample[];
  pitfalls: GrammarPitfall[];
  quizzes: GrammarQuiz[];
}
