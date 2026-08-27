import { VOCAB } from '../data';

interface CandidateEntry {
  syllable: string;
  char: string;
  count: number;
}

const DICT: ReadonlyMap<string, Map<string, number>> = (() => {
  const dict = new Map<string, Map<string, number>>();
  for (const item of VOCAB) {
    item.syllables.forEach((syllable, i) => {
      const char = item.characters[i]?.char;
      if (!char) return;
      let chars = dict.get(syllable.plain);
      if (!chars) {
        chars = new Map();
        dict.set(syllable.plain, chars);
      }
      chars.set(char, (chars.get(char) ?? 0) + 1);
    });
  }
  return dict;
})();

export interface ImeCandidate {
  /** Vollständige Silbe, die diesen Kandidaten erzeugt. */
  syllable: string;
  char: string;
}

/**
 * IME-Kandidaten für das bereits getippte Präfix – wie ein echtes Pinyin-IME:
 * Silben, die dem Präfix exakt entsprechen, kommen zuerst (damit das Zielzeichen
 * immer wählbar ist), danach längere Silben mit diesem Präfix nach Häufigkeit.
 */
export function candidatesFor(prefix: string, limit = 9): ImeCandidate[] {
  if (prefix.length === 0) return [];
  const lower = prefix.toLowerCase();

  const matches: CandidateEntry[] = [];
  for (const [syllable, charCounts] of DICT) {
    if (!syllable.startsWith(lower)) continue;
    for (const [char, count] of charCounts) {
      matches.push({ syllable, char, count });
    }
  }

  matches.sort((a, b) => {
    const aExact = a.syllable === lower ? 0 : 1;
    const bExact = b.syllable === lower ? 0 : 1;
    return aExact - bExact || b.count - a.count || a.syllable.length - b.syllable.length;
  });

  const seen = new Set<string>();
  const result: ImeCandidate[] = [];
  for (const match of matches) {
    if (seen.has(match.char)) continue;
    seen.add(match.char);
    result.push({ syllable: match.syllable, char: match.char });
    if (result.length >= limit) break;
  }
  return result;
}

export function isKnownSyllable(syllable: string): boolean {
  return DICT.has(syllable.toLowerCase());
}
