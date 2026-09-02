export const TONES = [1, 2, 3, 4, 5] as const;

/** Ein Ton (5 = neutraler Ton). */
export type Tone = (typeof TONES)[number];

export const RADICAL_POSITIONS = [
  'single',
  'left',
  'right',
  'top',
  'middle',
  'bottom',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'enclosure',
  'inside',
] as const;

/** Layout-Hinweis für den Alchemy-Baukasten. */
export type RadicalPosition = (typeof RADICAL_POSITIONS)[number];

export interface PinyinSyllable {
  /** Pinyin ohne Diakritikum, z.B. "ni" – Input-Form für TypeRacer/Ear-Trainer. */
  plain: string;
  /** Pinyin mit Ton-Diakritikum, z.B. "nǐ" – Anzeige-Form. */
  marked: string;
  tone: Tone;
}

/**
 * Referenz auf einen Eintrag aus `data/radicals.json`.
 * `hanzi` ist die Kontextform innerhalb des Zielzeichens (z.B. 亻 statt 人).
 */
export interface CharacterPart {
  id: string;
  hanzi: string;
  position: RadicalPosition;
}

export interface CharacterDecomposition {
  char: string;
  parts: CharacterPart[];
}

export type HskLevel = 1;

export type PartOfSpeech =
  | 'nomen'
  | 'verb'
  | 'adjektiv'
  | 'pronomen'
  | 'adverb'
  | 'partikel'
  | 'zahl'
  | 'eigenname'
  | 'interjektion';

export interface Collocation {
  hanzi: string;
  pinyin: string;
  german: string;
}

export interface ExampleSentence {
  hanzi: string;
  pinyin: string;
  german: string;
  audioPath?: string;
}

export interface VocabItem {
  /** Stabile ID, z.B. "hsk1-nihao". */
  id: string;
  hanzi: string;
  /** Vollständiges Pinyin mit Diakritika, z.B. "nǐ hǎo". */
  pinyin: string;
  syllables: PinyinSyllable[];
  meaning: string;
  notes?: string;
  characters: CharacterDecomposition[];
  /** Pfad zu einem lokalen Audio-Asset; null ⇒ Synthese-Fallback. */
  audioPath: string | null;
  hskLevel: HskLevel;
  partOfSpeech?: PartOfSpeech;
  mnemonic?: string;
  strokes?: number;
  hskOrder?: number;
  collocations?: Collocation[];
  exampleSentences?: ExampleSentence[];
}

/** Kanonischer Radikal-Eintrag aus `data/radicals.json`. */
export interface Radical {
  id: string;
  /** Grundform, z.B. "人". */
  hanzi: string;
  /** Varianten in Zusammensetzung, z.B. ["亻"]. */
  forms: string[];
  meaning: string;
  pinyin: string;
  strokes: number;
}
