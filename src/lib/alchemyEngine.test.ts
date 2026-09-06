import { describe, expect, it } from 'vitest';
import { buildAlchemyPuzzles } from './alchemyEngine';

describe('alchemyEngine', () => {
  it('builds requested count of valid puzzles', () => {
    const puzzles = buildAlchemyPuzzles(5);
    expect(puzzles.length).toBe(5);

    for (const p of puzzles) {
      expect(p.itemId).toBeTruthy();
      expect(p.hanzi).toBeTruthy();
      expect(p.slots.length).toBeGreaterThanOrEqual(2);
      expect(p.pieces.length).toBeGreaterThanOrEqual(p.slots.length);

      // All expected slot radicals exist in the piece pool
      const pieceIds = p.pieces.map((piece) => piece.id);
      for (const slot of p.slots) {
        expect(pieceIds).toContain(slot.part.id);
      }
    }
  });

  it('handles empty or zero count request gracefully', () => {
    const empty = buildAlchemyPuzzles(0);
    expect(empty).toEqual([]);
  });
});
