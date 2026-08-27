import { VOCAB } from '../data';
import { shuffled } from './shuffle';

const DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'] as const;
const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'] as const;
const GERMAN_WEEKDAYS = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag',
] as const;

/** Kanonische Zahlwörter 0–999 (mit 零-Lückenfüller, formal ohne Kurzformen). */
export function numberToChinese(n: number): string {
  if (n < 0 || !Number.isInteger(n) || n > 999) throw new RangeError(`nicht darstellbar: ${n}`);
  if (n < 10) return DIGITS[n];

  const hundreds = Math.floor(n / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;

  let result = '';
  if (hundreds > 0) {
    result += (hundreds === 1 ? '一' : DIGITS[hundreds]) + '百';
    if (tens === 0 && ones > 0) return result + '零' + DIGITS[ones];
  }
  if (tens > 0) {
    result += (hundreds === 0 && tens === 1 ? '十' : `${DIGITS[tens]}十`);
    if (ones > 0) result += DIGITS[ones];
  } else if (ones > 0 && hundreds > 0) {
    result += '零' + DIGITS[ones];
  } else if (ones > 0) {
    result += DIGITS[ones];
  }
  return result;
}

/** Uhrzeit im HSK-1-Stil: X点 / X点半 / X点Y分. */
export function timeToChinese(hour: number, minute: number): string {
  const hourPart = hour === 2 ? '两点' : `${numberToChinese(hour)}点`;
  if (minute === 30) return `${hourPart}半`;
  if (minute === 0) return `${hourPart}整`;
  return `${hourPart}${numberToChinese(minute)}分`;
}

/** Datum als X月Y号. */
export function dateToChinese(month: number, day: number): string {
  return `${numberToChinese(month)}月${numberToChinese(day)}号`;
}

export type DrillKind = 'number' | 'time' | 'date';

interface DrillSpec {
  prompt: string;
  answer: string;
}

function randomInt(minInclusive: number, maxInclusive: number): number {
  return minInclusive + Math.floor(Math.random() * (maxInclusive - minInclusive + 1));
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildNumberSpec(): DrillSpec {
  const n = randomInt(11, 999);
  return { prompt: numberToChinese(n), answer: String(n) };
}

function nearNumbers(n: number): number[] {
  const candidates = new Set<number>();
  for (const delta of [-11, -10, -2, -1, 1, 2, 10, 11]) {
    const candidate = n + delta;
    if (candidate >= 1 && candidate <= 999 && candidate !== n) candidates.add(candidate);
  }
  return [...candidates];
}

function nearTimes(hour: number, minute: number): string[] {
  const results = new Set<string>();
  const label = (h: number, m: number): string => `${h}:${String(m).padStart(2, '0')}`;
  for (const [dh, dm] of [[0, -15], [0, 15], [0, 30], [-1, 0], [1, 0], [-1, 45], [1, -45], [0, 5]] as const) {
    const h = ((hour - 1 + dh + 12) % 12) + 1;
    const m = minute + dm;
    if (m >= 0 && m <= 59) results.add(label(h, m));
  }
  results.delete(label(hour, minute));
  return [...results];
}

function nearDates(month: number, day: number): string[] {
  const results = new Set<string>();
  const label = (m: number, d: number): string => `${d}.${m}.`;
  for (const [dm, dd] of [[1, 0], [-1, 0], [0, 1], [0, -1], [0, 7], [7, 3]] as const) {
    const m = month + dm;
    const d = day + dd;
    if (m >= 1 && m <= 12 && d >= 1 && d <= 28) results.add(label(m, d));
  }
  results.delete(label(month, day));
  return [...results];
}

export interface DrillQuestion {
  kind: DrillKind;
  prompt: string;
  options: string[];
  correctIndex: number;
}

/** Baut eine Frage des gewünschten Typs mit 4 naheliegenden Optionen. */
export function buildDrillQuestion(kind: DrillKind): DrillQuestion {
  let spec: DrillSpec;
  let distractors: string[];

  if (kind === 'number') {
    spec = buildNumberSpec();
    distractors = shuffled(nearNumbers(Number.parseInt(spec.answer, 10))).map(String);
  } else if (kind === 'time') {
    const hour = randomInt(1, 12);
    const minute = pick([0, 15, 30, 45]);
    spec = { prompt: timeToChinese(hour, minute), answer: `${hour}:${String(minute).padStart(2, '0')}` };
    distractors = shuffled(nearTimes(hour, minute));
  } else if (Math.random() < 0.5) {
    const weekday = randomInt(0, WEEKDAYS.length - 1);
    spec = { prompt: `星期${WEEKDAYS[weekday]}`, answer: GERMAN_WEEKDAYS[weekday] };
    distractors = shuffled(GERMAN_WEEKDAYS.filter((day) => day !== spec.answer));
  } else {
    const month = randomInt(1, 12);
    const day = randomInt(1, 28);
    spec = { prompt: dateToChinese(month, day), answer: `${day}.${month}.` };
    distractors = shuffled(nearDates(month, day));
  }

  const options = shuffled([spec.answer, ...distractors.slice(0, 3)]);
  while (options.length < 4) options.push(spec.answer + '?');
  return {
    kind,
    prompt: spec.prompt,
    options,
    correctIndex: options.indexOf(spec.answer),
  };
}

/**
 * Vokabel-IDs aller Einzelzeichen des Prompts, die im Katalog existieren
 * (SRS-Anker; Zeit-Wörter wie 点/分 haben keinen Katalog-Eintrag).
 */
export function promptItemIds(prompt: string): string[] {
  const ids = new Set<string>();
  for (const char of prompt) {
    const item = VOCAB.find((candidate) => candidate.hanzi === char);
    if (item) ids.add(item.id);
  }
  return [...ids];
}
