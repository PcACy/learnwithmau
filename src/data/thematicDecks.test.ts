import { describe, expect, it } from 'vitest';
import { THEMATIC_DECKS, THEMATIC_DECKS_BY_ID, getThematicDeck } from './thematicDecks';
import { VOCAB } from './index';

describe('ThematicDecks – Struktur und HSK-1-Abdeckung', () => {
  it('umfasst 10 thematische Decks', () => {
    expect(THEMATIC_DECKS.length).toBe(10);
  });

  it('jedes Deck besitzt valide Metadaten', () => {
    for (const deck of THEMATIC_DECKS) {
      expect(deck.id.length).toBeGreaterThan(0);
      expect(deck.title.length).toBeGreaterThan(0);
      expect(deck.hanziTag.length).toBe(1);
      expect(deck.description.length).toBeGreaterThan(0);
      expect(deck.itemIds.length).toBeGreaterThanOrEqual(10);
    }
  });

  it('deckt alle 163 HSK-1-Vokabeln ohne Lücken oder Duplikate ab', () => {
    const allAssignedIds: string[] = [];
    for (const deck of THEMATIC_DECKS) {
      allAssignedIds.push(...deck.itemIds);
    }

    expect(allAssignedIds).toHaveLength(163);
    const uniqueIds = new Set(allAssignedIds);
    expect(uniqueIds.size).toBe(163);

    const vocabIds = new Set(VOCAB.map((v) => v.id));
    for (const id of allAssignedIds) {
      expect(vocabIds.has(id), `Unbekannte ID in Deck: ${id}`).toBe(true);
    }
    for (const item of VOCAB) {
      expect(uniqueIds.has(item.id), `Fehlendes Vokabel-Item im Deck: ${item.id}`).toBe(true);
    }
  });

  it('liefert Decks über getThematicDeck und THEMATIC_DECKS_BY_ID', () => {
    const deck = getThematicDeck('food-drinks');
    expect(deck).toBeDefined();
    expect(deck?.title).toBe('Essen & Trinken');
    expect(THEMATIC_DECKS_BY_ID.get('food-drinks')).toBe(deck);
  });
});
