/** Aufgabenarten im 30-Tage-Plan. */
export type PlanTaskKind =
  | 'pinyin'
  | 'vocab'
  | 'srs'
  | 'grammar'
  | 'story'
  | 'dialogue'
  | 'listening'
  | 'writing'
  | 'typing'
  | 'numbers'
  | 'blitz'
  | 'mistakes'
  | 'exam';

export const PLAN_DAYS = 30;
/** Ab Tag 25 kommen keine neuen Wörter mehr dazu – nur Wiederholung. */
export const VOCAB_DAYS = 24;

export interface PlanWeek {
  week: number;
  firstDay: number;
  lastDay: number;
  title: string;
  goal: string;
}

export const PLAN_WEEKS: readonly PlanWeek[] = [
  {
    week: 1,
    firstDay: 1,
    lastDay: 7,
    title: 'Fundament',
    goal: 'Pinyin und Töne sicher hören, erste 90 Wörter, Satzbau mit 是, 有 und SVO.',
  },
  {
    week: 2,
    firstDay: 8,
    lastDay: 14,
    title: 'Ausbau',
    goal: 'Zeit, Orte, Essen und Fragen. Erste Dialoge und Geschichten. Probeprüfung Set 1.',
  },
  {
    week: 3,
    firstDay: 15,
    lastDay: 21,
    title: 'Alltag',
    goal: 'Restliche Themen, alle 12 Grammatiklektionen, alle Dialoge. Probeprüfung Set 2.',
  },
  {
    week: 4,
    firstDay: 22,
    lastDay: 30,
    title: 'Prüfungstraining',
    goal: 'Letzte neue Wörter bis Tag 24, danach Wiederholung, Fehlerbank und Prüfungen unter Zeitlimit.',
  },
];

/** Grammatiklektion (Index in LESSONS_META) pro Plan-Tag; die passende Geschichte läuft am selben Tag. */
export const GRAMMAR_SCHEDULE: Readonly<Record<number, number>> = {
  1: 0,
  3: 1,
  5: 2,
  8: 3,
  9: 4,
  11: 5,
  13: 6,
  15: 7,
  16: 8,
  17: 9,
  18: 10,
  19: 11,
};

/** Dialog-ID pro Plan-Tag (siehe dialogues.json). */
export const DIALOGUE_SCHEDULE: Readonly<Record<number, string>> = {
  9: 'teahouse',
  11: 'market',
  13: 'taxi',
  16: 'university',
  18: 'appointment',
  20: 'hotel',
};

export type ExamSet = 'set1' | 'set2' | 'shuffle';

/** Probeprüfungen: Set 1 und 2 je einmal, dann Shuffle unter Zeitlimit. */
export const EXAM_SCHEDULE: Readonly<Record<number, ExamSet>> = {
  14: 'set1',
  21: 'set2',
  25: 'shuffle',
  28: 'shuffle',
};

export const DAY_THEMES: Readonly<Record<number, string>> = {
  1: 'Start: Töne und Begrüßung',
  7: 'Wochenabschluss 1',
  14: 'Probeprüfung Set 1',
  21: 'Probeprüfung Set 2',
  25: 'Probeprüfung unter Zeitlimit',
  28: 'Probeprüfung unter Zeitlimit',
  29: 'Schwachstellen-Tag',
  30: 'Leichter Prüfungsvortag',
};
