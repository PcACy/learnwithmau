import type { CharacterPart, RadicalPosition, VocabItem } from '../types/vocab';
import { RADICALS_BY_ID, VOCAB } from '../data';
import { shuffled } from './shuffle';

export const POSITION_LABELS: Record<RadicalPosition, string> = {
  single: 'Ganz',
  left: 'Links',
  right: 'Rechts',
  top: 'Oben',
  middle: 'Mitte',
  bottom: 'Unten',
  'top-left': 'Oben links',
  'top-right': 'Oben rechts',
  'bottom-left': 'Unten links',
  'bottom-right': 'Unten rechts',
  enclosure: 'Rahmen',
  inside: 'Innen',
};

interface PuzzleSource {
  item: VocabItem;
  charIndex: number;
}

const PUZZLE_POOL: readonly PuzzleSource[] = VOCAB.flatMap((item) =>
  item.characters.flatMap((decomposition, charIndex) =>
    decomposition.parts.length >= 2 ? [{ item, charIndex }] : [],
  ),
);

export interface AlchemyPiece {
  /** Radikal-ID – eindeutig innerhalb eines Puzzles. */
  id: string;
  hanzi: string;
}

export interface AlchemyPuzzle {
  itemId: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  targetChar: string;
  slots: { part: CharacterPart; label: string }[];
  pieces: AlchemyPiece[];
}

function buildPieces(expected: CharacterPart[], distractorCount: number): AlchemyPiece[] {
  const correct: AlchemyPiece[] = expected.map((part) => ({ id: part.id, hanzi: part.hanzi }));

  const usedIds = new Set(correct.map((piece) => piece.id));
  const usedHanzi = new Set(correct.map((piece) => piece.hanzi));

  const candidates = [...RADICALS_BY_ID.values()]
    .filter((radical) => !usedIds.has(radical.id))
    .flatMap((radical) => {
      const forms = [radical.hanzi, ...radical.forms].filter((form) => !usedHanzi.has(form));
      return forms.map((hanzi) => ({ id: radical.id, hanzi }) satisfies AlchemyPiece);
    });

  return shuffled([...correct, ...shuffled(candidates).slice(0, distractorCount)]);
}

function createPuzzleFromSource(source: PuzzleSource): AlchemyPuzzle {
  const decomposition = source.item.characters[source.charIndex];
  const expected = decomposition.parts;

  return {
    itemId: source.item.id,
    hanzi: source.item.hanzi,
    pinyin: source.item.pinyin,
    meaning: source.item.meaning,
    targetChar: decomposition.char,
    slots: expected.map((part) => ({
      part,
      label: POSITION_LABELS[part.position],
    })),
    pieces: buildPieces(expected, expected.length >= 3 ? 2 : 2),
  };
}

/** Baut mehrere unterschiedliche Puzzles für eine Spielsession. */
export function buildAlchemyPuzzles(count: number): AlchemyPuzzle[] {
  if (PUZZLE_POOL.length === 0) return [];
  const sources = shuffled(PUZZLE_POOL).slice(0, count);
  return sources.map(createPuzzleFromSource);
}
