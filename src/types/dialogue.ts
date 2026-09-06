/**
 * Typdefinitionen für den interaktiven HSK-1 Dialog- & Rollenspiel-Modus.
 */

export interface DialogueWordToken {
  hanzi: string;
  pinyin: string;
  german: string;
}

export interface DialogueChoice {
  id: string;
  hanzi: string;
  pinyin: string;
  german: string;
  audioUrl: string;
  /** Didaktische Punktzahl (z.B. 100 für optimal/höflich, 70 für akzeptabel, 20 für suboptimal/Missverständnis). */
  points: number;
  /** Erklärung für den Lernenden, warum diese Formulierung gut/mittel/falsch ist. */
  feedbackGerman: string;
  /** ID des nächsten Knotens im Dialogbaum. */
  nextNodeId: string;
}

export interface DialogueNode {
  id: string;
  speaker: 'npc' | 'user';
  speakerName: string;
  /** Einzeleichen für das CJK-Wasserzeichen-/Siegel-Avatar (z.B. '店', '车', '友'). */
  speakerAvatar: string;
  gender: 'female' | 'male';
  hanzi: string;
  pinyin: string;
  german: string;
  audioUrl: string;
  tokens: DialogueWordToken[];
  /** Optionaler didaktischer Kultur- oder Grammatik-Hinweis zum aktuellen Zug. */
  cultureTip?: string;
  /** Mögliche Antworten, falls dieser Knoten eine Entscheidung des Lernenden erfordert. */
  choices?: DialogueChoice[];
  /** Markiert das Ende des Dialogs. */
  isEnding?: boolean;
}

export interface DialogueScenario {
  id: string;
  order: number;
  title: string;
  pinyinTitle: string;
  germanTitle: string;
  /** Chinesisches Tag-Zeichen für die Kachel-Vorschau. */
  hanziTag: string;
  category: string;
  /** Die Rolle des Lernenden (z.B. 'Kunde', 'Fahrgast', 'Gast'). */
  role: string;
  location: string;
  partner: string;
  summary: string;
  objectives: string[];
  initialNodeId: string;
  nodes: Record<string, DialogueNode>;
  maxScore: number;
}

