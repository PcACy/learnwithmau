import { TONES } from '../types/vocab';

/** Alle gängigen Initialen (inkl. y/w als Semi-Initialen für Silben ohne echte Initiale). */
export const INITIALS: readonly string[] = [
  'b', 'p', 'm', 'f',
  'd', 't', 'n', 'l',
  'g', 'k', 'h',
  'j', 'q', 'x',
  'zh', 'ch', 'sh', 'r',
  'z', 'c', 's',
  'y', 'w',
];

/**
 * Finale in Schreibform (wie im Hanyu Pinyin geschrieben):
 * "iu/ui/un" sind Kurzformen von iou/uei/uen, "u" nach j/q/x/y steht für ü.
 * "v" deckt eigenständiges ü ab (nü/lü-Konvention von Pinyin-IMEs).
 */
export const FINALS: readonly string[] = [
  'a', 'o', 'e', 'i', 'u', 'v',
  'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'er',
  'ia', 'ie', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'iong',
  'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'ueng',
  've', 'van', 'vn',
];

export interface SyllableCombination {
  /** null = silbe ohne initiale. */
  initial: string | null;
  final: string;
}

/** Kartesisches Produkt aus Initialen × Finalen (inkl. initialenloser Silben). */
export function buildSyllableCombinations(): SyllableCombination[] {
  const combos: SyllableCombination[] = [{ initial: null, final: '' }];
  for (const final of FINALS) {
    combos.push({ initial: null, final });
    for (const initial of INITIALS) {
      combos.push({ initial, final });
    }
  }
  return combos;
}

export { TONES as ALL_TONES };
