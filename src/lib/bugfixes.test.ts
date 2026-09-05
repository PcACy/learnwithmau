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
