import { describe, expect, it } from 'vitest';
import { pickNextAction } from './nextAction';

const base = { dueCount: 0, mistakeCount: 0 };

describe('pickNextAction', () => {
  it('prefers the open plan task over everything else', () => {
    const a = pickNextAction({
      ...base,
      dueCount: 9,
      mistakeCount: 3,
      planTask: { label: '12 neue Wörter lernen', minutes: 30, route: '/dictionary' },
    });
    expect(a.kind).toBe('plan');
    expect(a.to).toBe('/dictionary');
  });

  it('falls back to due cards, then mistakes', () => {
    expect(pickNextAction({ ...base, dueCount: 4, mistakeCount: 2 }).kind).toBe('review');
    expect(pickNextAction({ ...base, mistakeCount: 2 }).kind).toBe('mistakes');
  });

  it('then continues the curriculum and ends at the exam', () => {
    expect(
      pickNextAction({ ...base, nextGrammar: { id: 'g 1', title: 'A', subtitle: 'B' } }).to,
    ).toBe('/grammar?lesson=g%201');
    expect(pickNextAction({ ...base, nextStory: { id: 's1', title: 'A', germanTitle: 'B' } }).kind).toBe('story');
    expect(pickNextAction(base).kind).toBe('exam');
  });
});
