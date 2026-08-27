import { describe, expect, it } from 'vitest';
import { applyTone, splitMarkedSyllables, stripToneMarks } from './pinyinUtils';
import { VOCAB } from '../data';
import type { Tone } from '../types/vocab';

describe('applyTone – Vokal-Hierarchie', () => {
  it.each([
    ['a', 1, 'ā'],
    ['o', 2, 'ó'],
    ['e', 3, 'ě'],
    ['hao', 3, 'hǎo'],
    ['jian', 4, 'jiàn'],
    ['zhong', 1, 'zhōng'],
  ])('markiert das erste a/o/e: %s Ton %i → %s', (plain, tone, marked) => {
    expect(applyTone(plain, tone as Tone)).toBe(marked);
  });

  it('markiert bei iu das u (liu → liù)', () => {
    expect(applyTone('liu', 4)).toBe('liù');
    expect(applyTone('diu', 1)).toBe('diū');
  });

  it('markiert bei ui das i (hui → huì)', () => {
    expect(applyTone('hui', 4)).toBe('huì');
    expect(applyTone('shui', 3)).toBe('shuǐ');
  });

  it('behandelt v als ü inklusive Diakritikum', () => {
    expect(applyTone('lv', 3)).toBe('lǚ');
    expect(applyTone('nv', 4)).toBe('nǜ');
  });

  it('Ton 5 ist neutral und normalisiert nur v → ü', () => {
    expect(applyTone('men', 5)).toBe('men');
    expect(applyTone('lv', 5)).toBe('lü');
  });

  it('ignoriert ungültige Töne und leere Eingaben', () => {
    expect(applyTone('ma', 6 as unknown as Tone)).toBe('ma');
    expect(applyTone('', 2)).toBe('');
  });
});

describe('stripToneMarks', () => {
  it('entfernt Tondiakritika, behält aber ü', () => {
    expect(stripToneMarks('nǐ hǎo')).toBe('ni hao');
    expect(stripToneMarks('lǜ')).toBe('lü');
    expect(stripToneMarks('zhōng guó')).toBe('zhong guo');
  });

  it('ist die Umkehrfunktion von applyTone', () => {
    expect(stripToneMarks(applyTone('xue', 2))).toBe('xue');
  });
});

describe('splitMarkedSyllables', () => {
  it('teilt an Leerzeichen und trimmt', () => {
    expect(splitMarkedSyllables('  nǐ hǎo ')).toEqual(['nǐ', 'hǎo']);
    expect(splitMarkedSyllables('')).toEqual([]);
  });
});

describe('Katalog-Roundtrip: jede marked-Silbe ergibt ihr plain', () => {
  it(`über alle ${VOCAB.length} Items hinweg`, () => {
    let checked = 0;
    for (const item of VOCAB) {
      for (const syllable of item.syllables) {
        // Konvention: plain nutzt „v" für eigenständiges ü (IME-Schreibweise),
        // marked/stripToneMarks dagegen das echte ü.
        const expectedPlain = syllable.plain.replaceAll('v', 'ü');
        expect(stripToneMarks(syllable.marked)).toBe(expectedPlain);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(200);
  });
});
