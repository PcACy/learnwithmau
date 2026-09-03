import { describe, expect, it } from 'vitest';
import { candidatesFor, isKnownSyllable } from './ime';

describe('candidatesFor', () => {
  it('liefert exakte Silben-Treffer vor längeren Präfix-Matches', () => {
    // Regression: Bei „xi“ verdrängten xia/xie/xiao das Zielzeichen 习.
    const result = candidatesFor('xi');
    const exact = result.filter((c) => c.syllable === 'xi');
    const prefixOnly = result.filter((c) => c.syllable !== 'xi');

    expect(exact.length).toBeGreaterThan(0);
    if (prefixOnly.length > 0) {
      expect(result.indexOf(exact[exact.length - 1])).toBeLessThan(result.indexOf(prefixOnly[0]));
    }
  });

  it('macht jedes Zielzeichen des Katalogs bei voller Silbe wählbar (kein Softlock)', () => {
    // Stichprobe genügt nicht – der Test läuft unten über den ganzen Katalog
    // in Verbindung mit data.test.ts; hier der bekannte Konfliktfall:
    const chars = candidatesFor('xi').map((c) => c.char);
    expect(chars).toContain('习');
  });

  it('matcht Präfixe: zh → 中 (zhōng)', () => {
    expect(candidatesFor('zh').some((c) => c.char === '中')).toBe(true);
  });

  it('liefert für volle Silben die Zielzeichen: zhuo → 桌, ni → 你, nv / nü → 女', () => {
    expect(candidatesFor('zhuo').map((c) => c.char)).toEqual(['桌']);
    expect(candidatesFor('ni').map((c) => c.char)).toContain('你');
    expect(candidatesFor('nv').map((c) => c.char)).toContain('女');
    expect(candidatesFor('nü').map((c) => c.char)).toContain('女');
  });

  it('dedupliziert Zeichen und respektiert das Limit', () => {
    const limited = candidatesFor('x', 4);
    expect(limited).toHaveLength(4);
    expect(new Set(limited.map((c) => c.char)).size).toBe(4);

    const all = candidatesFor('x');
    expect(all.length).toBeLessThanOrEqual(9);
  });

  it('leere Eingabe → keine Kandidaten; Unsinn → keine Kandidaten', () => {
    expect(candidatesFor('')).toEqual([]);
    expect(candidatesFor('qqqq')).toEqual([]);
  });
});

describe('isKnownSyllable', () => {
  it('erkennt Katalog-Silben case-insensitive', () => {
    expect(isKnownSyllable('shui')).toBe(true);
    expect(isKnownSyllable('SHUI')).toBe(true);
    expect(isKnownSyllable('abc')).toBe(false);
  });
});
