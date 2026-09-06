import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { playAsset, stopCurrentAudio } from './audio';
import { buildAlchemyPuzzles } from './alchemyEngine';

describe('Audio Engine Semantics & Concurrency Fixes', () => {
  const g = globalThis as unknown as { Audio?: unknown };
  let originalAudio: unknown;

  beforeEach(() => {
    originalAudio = g.Audio;
  });

  afterEach(() => {
    g.Audio = originalAudio;
    stopCurrentAudio();
  });

  it('does NOT call onEnded when stopCurrentAudio is triggered before completion', async () => {
    const eventListeners: Record<string, (() => void)[]> = {};

    class MockAudio {
      src = '';
      currentTime = 0;
      defaultPlaybackRate = 1.0;
      playbackRate = 1.0;
      play = vi.fn().mockResolvedValue(undefined);
      pause = vi.fn();
      removeAttribute = vi.fn();
      addEventListener = (evt: string, cb: () => void) => {
        eventListeners[evt] = eventListeners[evt] || [];
        eventListeners[evt].push(cb);
      };
    }
    g.Audio = MockAudio;

    const onEndedSpy = vi.fn();
    const playPromise = playAsset('/audio/sentences/s01.mp3', onEndedSpy);

    // Trigger playing event to simulate playback start
    eventListeners['playing']?.forEach((cb) => cb());
    await playPromise;

    // Manually stop audio (e.g. user clicked pause or started another audio)
    stopCurrentAudio();

    // Now trigger ended event on the old audio (if browser had scheduled it)
    eventListeners['ended']?.forEach((cb) => cb());

    // onEnded MUST NOT be called because playback was stopped/interrupted
    expect(onEndedSpy).not.toHaveBeenCalled();
  });

  it('calls onEnded ONLY when playback completes naturally without interruption', async () => {
    const eventListeners: Record<string, (() => void)[]> = {};

    class MockAudio {
      src = '';
      currentTime = 0;
      defaultPlaybackRate = 1.0;
      playbackRate = 1.0;
      play = vi.fn().mockResolvedValue(undefined);
      pause = vi.fn();
      removeAttribute = vi.fn();
      addEventListener = (evt: string, cb: () => void) => {
        eventListeners[evt] = eventListeners[evt] || [];
        eventListeners[evt].push(cb);
      };
    }
    g.Audio = MockAudio;

    const onEndedSpy = vi.fn();
    void playAsset('/audio/sentences/s02.mp3', onEndedSpy);

    // Natural playback flow
    eventListeners['playing']?.forEach((cb) => cb());
    expect(onEndedSpy).not.toHaveBeenCalled();

    eventListeners['ended']?.forEach((cb) => cb());
    expect(onEndedSpy).toHaveBeenCalledTimes(1);
  });
});

describe('Alchemy Puzzle Integrity & Slot Mechanics', () => {
  it('generates puzzles where every slot part exists in the available pieces pool', () => {
    const puzzles = buildAlchemyPuzzles(10);
    expect(puzzles.length).toBe(10);

    for (const puzzle of puzzles) {
      expect(puzzle.slots.length).toBeGreaterThanOrEqual(1);
      expect(puzzle.pieces.length).toBeGreaterThanOrEqual(puzzle.slots.length);

      const pieceIds = new Set(puzzle.pieces.map((p) => p.id));
      for (const slot of puzzle.slots) {
        expect(
          pieceIds.has(slot.part.id),
          `Slot ${slot.part.id} (${slot.label}) missing in pieces for ${puzzle.targetChar}`,
        ).toBe(true);
      }
    }
  });

  it('verifies slot completion logic evaluates correctly', () => {
    const puzzles = buildAlchemyPuzzles(1);
    const puzzle = puzzles[0];
    expect(puzzle).toBeDefined();

    // Simulated slots state
    const emptySlots = puzzle.slots.map(() => ({ filledPieceId: null }));
    const isCompleteInitial = puzzle.slots.every(
      (slot, i) => emptySlots[i]?.filledPieceId === slot.part.id,
    );
    expect(isCompleteInitial).toBe(false);

    const filledSlots = puzzle.slots.map((slot) => ({ filledPieceId: slot.part.id }));
    const isCompleteFilled = puzzle.slots.every(
      (slot, i) => filledSlots[i]?.filledPieceId === slot.part.id,
    );
    expect(isCompleteFilled).toBe(true);
  });
});

describe('State Hydration & Streak Normalization Fixes', () => {
  it('normalizes streak when user was active yesterday or today', async () => {
    const { normalizeStreak } = await import('../store/progressStore');
    const now = new Date('2026-09-06T12:00:00');

    // Heute aktiv
    const todayStreak = normalizeStreak({ current: 5, longest: 10, lastActiveDate: '2026-09-06' }, now);
    expect(todayStreak.current).toBe(5);
    expect(todayStreak.longest).toBe(10);

    // Gestern aktiv
    const yesterdayStreak = normalizeStreak({ current: 5, longest: 10, lastActiveDate: '2026-09-05' }, now);
    expect(yesterdayStreak.current).toBe(5);
    expect(yesterdayStreak.longest).toBe(10);
  });

  it('breaks active streak (current = 0) when user missed more than 1 day, while preserving record', async () => {
    const { normalizeStreak } = await import('../store/progressStore');
    const now = new Date('2026-09-06T12:00:00');

    // 2 Tage Pause (letzte Aktivität am 04.09.)
    const brokenStreak = normalizeStreak({ current: 5, longest: 10, lastActiveDate: '2026-09-04' }, now);
    expect(brokenStreak.current).toBe(0);
    expect(brokenStreak.longest).toBe(10);
  });

  it('resets daily goal completed reviews on date transition', async () => {
    const { ensureFresh } = await import('../store/progressStore');
    const now = new Date('2026-09-06T12:00:00');

    const freshGoal = ensureFresh(
      { date: '2026-09-05', targetReviews: 25, completedReviews: 25 },
      now,
    );
    expect(freshGoal.date).toBe('2026-09-06');
    expect(freshGoal.completedReviews).toBe(0);
    expect(freshGoal.targetReviews).toBe(25);

    // Gleicher Tag behält Fortschritt
    const sameDay = ensureFresh(
      { date: '2026-09-06', targetReviews: 25, completedReviews: 12 },
      now,
    );
    expect(sameDay.completedReviews).toBe(12);
  });
});

describe('TypeRacer German Umlaut & IME Mapping', () => {
  it('maps ü and Ü directly to v for German keyboard layout support', async () => {
    const { candidatesFor } = await import('./ime');

    // Both 'nv' and 'nü' should yield candidates for 女 in HSK 1
    const candidatesNv = candidatesFor('nv');
    const candidatesNu = candidatesFor('nü');
    expect(candidatesNv.length).toBeGreaterThan(0);
    expect(candidatesNu.length).toBeGreaterThan(0);
    expect(candidatesNv.map((c) => c.char)).toEqual(candidatesNu.map((c) => c.char));
    expect(candidatesNu[0].char).toBe('女');
  });
});

describe('Database Reset Safety', () => {
  it('closes active database connection cleanly during reset', async () => {
    const { db } = await import('./db');
    const closeSpy = vi.spyOn(db, 'close');

    const originalIndexedDB = globalThis.indexedDB;
    const deleteSpy = vi.fn().mockReturnValue({
      onsuccess: null,
      onerror: null,
      onblocked: null,
    });
    (globalThis as any).indexedDB = {
      deleteDatabase: deleteSpy,
    };

    const { resetAllLocalData } = await import('./resetApp');

    const resetPromise = resetAllLocalData();
    const req = deleteSpy.mock.results[0]?.value;
    if (req?.onsuccess) req.onsuccess();
    await resetPromise;

    expect(closeSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith('hanzi-arcade');
    (globalThis as any).indexedDB = originalIndexedDB;
  });
});

describe('Audio Speech Synthesis & Mandarin Fallback', () => {
  it('handles environment without speechSynthesis gracefully', async () => {
    const { speakMandarin, playMandarinWithFallback } = await import('./audio');

    // In node/vitest environment, window.speechSynthesis may be undefined
    const res = await speakMandarin('你好');
    expect(typeof res).toBe('boolean');

    const fallbackRes = await playMandarinWithFallback('谢谢');
    expect(typeof fallbackRes).toBe('boolean');
  });

  it('triggers speak with correct zh-CN utterance when speechSynthesis is present', async () => {
    const speakMock = vi.fn();
    const cancelMock = vi.fn();
    const origWindow = globalThis.window;

    class MockUtterance {
      text: string;
      lang = '';
      rate = 1;
      voice: any = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    }

    (globalThis as any).window = {
      ...globalThis.window,
      SpeechSynthesisUtterance: MockUtterance,
      speechSynthesis: {
        speak: speakMock,
        cancel: cancelMock,
        getVoices: () => [{ lang: 'zh-CN', name: 'Tingting' }],
      },
    };

    const { speakMandarin, stopCurrentAudio } = await import('./audio');
    const started = await speakMandarin('你好，很高兴认识你。');

    expect(started).toBe(true);
    expect(speakMock).toHaveBeenCalled();

    stopCurrentAudio();
    expect(cancelMock).toHaveBeenCalled();

    globalThis.window = origWindow;
  });
});

describe('Game Modes Streak & Daily Goal Activity Credit', () => {
  it('credits completed questions and updates streak when logging sessions from any mode', async () => {
    const { useProgressStore } = await import('../store/progressStore');

    useProgressStore.setState({
      dailyGoal: { date: '2026-09-07', targetReviews: 20, completedReviews: 0 },
      streak: { current: 0, longest: 0, lastActiveDate: null },
    });

    await useProgressStore.getState().logSession({
      mode: 'dialogue',
      answered: 5,
      correct: 4,
      durationMs: 30000,
    });

    const state = useProgressStore.getState();
    expect(state.dailyGoal.completedReviews).toBe(4);
    expect(state.streak.current).toBe(1);
    expect(state.streak.lastActiveDate).toBe('2026-09-07');
  });

  it('awards at least 1 credit for completed sessions even if correct count is 0', async () => {
    const { useProgressStore } = await import('../store/progressStore');

    useProgressStore.setState({
      dailyGoal: { date: '2026-09-07', targetReviews: 20, completedReviews: 2 },
      streak: { current: 1, longest: 1, lastActiveDate: '2026-09-07' },
    });

    await useProgressStore.getState().logSession({
      mode: 'ear-trainer',
      answered: 10,
      correct: 0,
      durationMs: 15000,
    });

    const state = useProgressStore.getState();
    expect(state.dailyGoal.completedReviews).toBe(3);
    expect(state.streak.current).toBe(1);
  });
});



