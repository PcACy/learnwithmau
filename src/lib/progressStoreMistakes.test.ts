import { beforeEach, describe, expect, it } from 'vitest';
import { useProgressStore } from '../store/progressStore';

describe('useProgressStore mistake bank actions', () => {
  beforeEach(() => {
    useProgressStore.setState({
      mistakes: {},
    });
  });

  it('records a mistake into the store', async () => {
    await useProgressStore.getState().recordMistake('hsk1-nihao', 'blitz');
    const mistakes = useProgressStore.getState().mistakes;
    expect(mistakes['hsk1-nihao']).toBeDefined();
    expect(mistakes['hsk1-nihao'].totalMistakes).toBe(1);
    expect(mistakes['hsk1-nihao'].lastSourceMode).toBe('blitz');
    expect(mistakes['hsk1-nihao'].isResolved).toBe(false);
  });

  it('progresses towards resolution on correct drill answers', async () => {
    await useProgressStore.getState().recordMistake('hsk1-nihao', 'exam');

    const res1 = await useProgressStore.getState().answerMistakeDrill('hsk1-nihao', true);
    expect(res1.streak).toBe(1);
    expect(res1.resolved).toBe(false);
    expect(useProgressStore.getState().mistakes['hsk1-nihao'].isResolved).toBe(false);

    const res2 = await useProgressStore.getState().answerMistakeDrill('hsk1-nihao', true);
    expect(res2.streak).toBe(2);
    expect(res2.resolved).toBe(true);
    expect(useProgressStore.getState().mistakes['hsk1-nihao'].isResolved).toBe(true);
  });

  it('clears resolved mistakes while keeping unresolved ones', async () => {
    await useProgressStore.getState().recordMistake('hsk1-nihao', 'blitz');
    await useProgressStore.getState().recordMistake('hsk1-xiexie', 'typeracer');

    // Resolve nihao (2 correct answers)
    await useProgressStore.getState().answerMistakeDrill('hsk1-nihao', true);
    await useProgressStore.getState().answerMistakeDrill('hsk1-nihao', true);

    expect(useProgressStore.getState().mistakes['hsk1-nihao'].isResolved).toBe(true);
    expect(useProgressStore.getState().mistakes['hsk1-xiexie'].isResolved).toBe(false);

    await useProgressStore.getState().clearResolvedMistakes();

    const remaining = useProgressStore.getState().mistakes;
    expect(remaining['hsk1-nihao']).toBeUndefined();
    expect(remaining['hsk1-xiexie']).toBeDefined();
  });
});
