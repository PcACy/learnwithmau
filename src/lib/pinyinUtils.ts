import type { Tone } from '../types/vocab';

/**
 * Platziert das Ton-Diakritikum nach der Standardregel:
 * a vor o vor e; bei "iu"/"ui" erhält die zweite Vokalgrafie den Ton,
 * sonst die erste vorhandene Grafie aus i/u/v(=ü).
 */
export function applyTone(syllablePlain: string, tone: Tone): string {
  if (tone < 1 || tone > 5 || syllablePlain.length === 0) return syllablePlain;

  const lower = syllablePlain.toLowerCase();
  const vowelIndex = findToneVowelIndex(lower);
  if (vowelIndex === -1) return syllablePlain;

  const baseChar = lower[vowelIndex];
  if (tone === 5) {
    // Neutraler Ton: kein Diakritikum, aber v → ü normalisieren.
    return replaceAt(lower, vowelIndex, baseChar === 'v' ? 'ü' : baseChar);
  }

  const marked = markVowel(baseChar, tone);
  return replaceAt(lower, vowelIndex, marked);
}

function findToneVowelIndex(lower: string): number {
  for (const vowel of ['a', 'o', 'e'] as const) {
    const index = lower.indexOf(vowel);
    if (index !== -1) return index;
  }
  const iuIndex = lower.indexOf('iu');
  if (iuIndex !== -1) return iuIndex + 1;
  const uiIndex = lower.indexOf('ui');
  if (uiIndex !== -1) return uiIndex + 1;
  for (const vowel of ['i', 'u', 'v'] as const) {
    const index = lower.indexOf(vowel);
    if (index !== -1) return index;
  }
  return -1;
}

const MARKS: Record<string, Partial<Record<Tone, string>>> = {
  a: { 1: 'ā', 2: 'á', 3: 'ǎ', 4: 'à' },
  o: { 1: 'ō', 2: 'ó', 3: 'ǒ', 4: 'ò' },
  e: { 1: 'ē', 2: 'é', 3: 'ě', 4: 'è' },
  i: { 1: 'ī', 2: 'í', 3: 'ǐ', 4: 'ì' },
  u: { 1: 'ū', 2: 'ú', 3: 'ǔ', 4: 'ù' },
  v: { 1: 'ǖ', 2: 'ǘ', 3: 'ǚ', 4: 'ǜ' },
};

function markVowel(baseChar: string, tone: Tone): string {
  const key = baseChar === 'ü' ? 'v' : baseChar;
  return MARKS[key]?.[tone] ?? baseChar;
}

function replaceAt(input: string, index: number, replacement: string): string {
  return input.slice(0, index) + replacement + input.slice(index + 1);
}

/**
 * Entfernt Ton-Diakritika, behält aber das Umlaut-Pünktchen von ü
 * (NFD-Zerlegung, alle Combining Marks außer U+0308 verwerfen).
 */
export function stripToneMarks(marked: string): string {
  const decomposed = marked.normalize('NFD');
  let result = '';
  for (const char of decomposed) {
    const code = char.codePointAt(0) ?? 0;
    const isCombining = code >= 0x0300 && code <= 0x036f;
    const isDiaeresis = code === 0x0308;
    if (!isCombining || isDiaeresis) result += char;
  }
  return result.normalize('NFC').toLowerCase();
}

/** Zerlegt ein vollständiges Pinyin ("nǐ hǎo") in seine Silben-Markierungen. */
export function splitMarkedSyllables(pinyin: string): string[] {
  return pinyin.trim().split(/\s+/).filter((part) => part.length > 0);
}
