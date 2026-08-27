import { describe, expect, it } from 'vitest';
import {
  buildToneQuestion,
  buildWordOptions,
  pickDrillItems,
} from './drillGenerator';
import { VOCAB } from '../data';

const NOW = new Date(2026, 7, 24);

describe('buildToneQuestion', () => {
  it('bietet immer 4 eindeutige Töne inklusive dem korrekten', () => {
    for (let i = 0; i < 100; i++) {
      const item = VOCAB[i % VOCAB.length];
      const q = buildToneQuestion(item);
      expect(q.options).toHaveLength(4);
      const tones = q.options.map((o) => o.tone);
      expect(new Set(tones).size).toBe(4);
      expect(tones).toContain(q.correctTone);
    }
  });

  it('wählt die Silbe innerhalb der Wortlänge', () => {
    for (let i = 0; i < 50; i++) {
      const item = VOCAB[(i * 7) % VOCAB.length];
      const q = buildToneQuestion(item);
      expect(q.syllableIndex).toBeGreaterThanOrEqual(0);
      expect(q.syllableIndex).toBeLessThan(item.syllables.length);
    }
  });
});

describe('buildWordOptions', () => {
  it('enthält das Ziel und ist frei von Duplikaten', () => {
    for (const target of VOCAB.filter((v) => v.syllables.length >= 2).slice(0, 20)) {
      const options = buildWordOptions(target, VOCAB);
      expect(options).toHaveLength(4);
      expect(new Set(options.map((o) => o.id)).size).toBe(4);
      expect(options.some((o) => o.id === target.id)).toBe(true);
    }
  });

  it('bevorzugt Distraktoren mit geteilter Silbe', () => {
    const a = VOCAB.find((v) => v.id === 'hsk1-xuesheng');
    const b = VOCAB.find((v) => v.id === 'hsk1-tongxue'); // teilt „xue"
    if (!a || !b) return;
    let shared = 0;
    const runs = 200;
    for (let i = 0; i < runs; i++) {
      if (buildWordOptions(a, [b, ...VOCAB]).some((o) => o.id === b.id)) shared++;
    }
    // Zufall allein läge bei ~3/19; Silben-Ähnlichkeit muss deutlich darüber liegen.
    expect(shared).toBeGreaterThan(runs / 4);
  });
});

describe('pickDrillItems', () => {
  it('priorisiert fällige Items und dupliziert nicht', () => {
    const overdueIds = ['hsk1-nihao', 'hsk1-shui', 'hsk1-yue'];
    // Alle Items haben Karten – nur drei sind überfällig, damit die
    // Priorisierung deterministisch prüfbar ist.
    const realCards: Parameters<typeof pickDrillItems>[0] = {};
    for (const item of VOCAB) {
      realCards[item.id] = {
        itemId: item.id,
        easiness: 2.5,
        intervalDays: 10,
        repetitions: 2,
        lapses: 0,
        dueDate: overdueIds.includes(item.id) ? '2026-08-01' : '2026-12-01',
        lastReviewedAt: null,
      };
    }

    const picked = pickDrillItems(realCards, VOCAB, 10, NOW);
    expect(picked).toHaveLength(10);
    expect(new Set(picked.map((p) => p.id)).size).toBe(10);
    for (const id of overdueIds) {
      expect(picked.some((p) => p.id === id)).toBe(true);
    }
  });

  it('respektiert count kleiner als Kataloggröße', () => {
    expect(pickDrillItems({}, VOCAB, 5, NOW)).toHaveLength(5);
  });
});
