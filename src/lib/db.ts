import Dexie, { type Table } from 'dexie';
import type { SrsCard } from '../types/srs';
import type { DailyGoal, SessionStat, StreakData } from '../types/game';

/** Typisierte Meta-Einträge (key-value in Tabelle `meta`). */
export interface MetaMap {
  streak: StreakData;
  dailyGoal: DailyGoal;
}

export type MetaKey = keyof MetaMap;

export interface MetaRow {
  key: MetaKey;
  value: MetaMap[MetaKey];
}

class HanziArcadeDB extends Dexie {
  cards!: Table<SrsCard, string>;
  meta!: Table<MetaRow, string>;
  stats!: Table<SessionStat, number>;

  constructor() {
    super('hanzi-arcade');
    this.version(1).stores({
      cards: 'itemId, dueDate',
      meta: 'key',
      stats: '++id, mode, finishedAt',
    });
    // Bewusst KEINE Schema-Migration mit upgrade()-Hook: Ein blockiertes
    // Upgrade (alter Tab hält eine Verbindung) würde jeden IndexedDB.open-
    // Aufruf endlos penden lassen. Das frühere wordleDaily-Aufräumen ist
    // unnötig – verwaiste Meta-Zeilen sind funktional harmlos.
  }
}

export const db = new HanziArcadeDB();

export async function getMeta<K extends MetaKey>(key: K): Promise<MetaMap[K] | undefined> {
  const row = await db.meta.get(key);
  return row?.value as MetaMap[K] | undefined;
}

export async function putMeta<K extends MetaKey>(key: K, value: MetaMap[K]): Promise<void> {
  await db.meta.put({ key, value });
}

export interface BackupData {
  version: 1;
  exportedAt: string;
  app: 'hanzi-arcade';
  cards: SrsCard[];
  meta: MetaRow[];
  stats: SessionStat[];
}

export interface ImportResult {
  success: boolean;
  cardsCount: number;
  statsCount: number;
  message?: string;
}

/**
 * Exportiert den gesamten Dexie-Datenbestand als formatiertes JSON.
 */
export async function exportBackup(): Promise<string> {
  const [cards, meta, stats] = await Promise.all([
    db.cards.toArray(),
    db.meta.toArray(),
    db.stats.toArray(),
  ]);

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'hanzi-arcade',
    cards,
    meta,
    stats,
  };

  return JSON.stringify(backup, null, 2);
}

/**
 * Importiert ein Backup-JSON in Dexie (atomar in einer Transaktion).
 */
export async function importBackup(
  jsonContent: string | Record<string, unknown>,
): Promise<ImportResult> {
  try {
    const data: BackupData =
      typeof jsonContent === 'string' ? JSON.parse(jsonContent) : (jsonContent as unknown as BackupData);

    if (!data || typeof data !== 'object') {
      throw new Error('Ungültiges Dateiformat: Kein JSON-Objekt');
    }
    if (!Array.isArray(data.cards) || !Array.isArray(data.stats)) {
      throw new Error('Ungültiges Dateiformat: Tabellen fehlen');
    }

    await db.transaction('rw', db.cards, db.meta, db.stats, async () => {
      await db.cards.clear();
      await db.meta.clear();
      await db.stats.clear();

      if (data.cards.length > 0) {
        await db.cards.bulkPut(data.cards);
      }
      if (Array.isArray(data.meta) && data.meta.length > 0) {
        await db.meta.bulkPut(data.meta);
      }
      if (data.stats.length > 0) {
        // Strip previous auto-increment IDs
        const cleanedStats = data.stats.map((s) => ({
          mode: s.mode,
          finishedAt: s.finishedAt,
          answered: s.answered,
          correct: s.correct,
          durationMs: s.durationMs,
        }));
        await db.stats.bulkAdd(cleanedStats);
      }
    });

    return {
      success: true,
      cardsCount: data.cards.length,
      statsCount: data.stats.length,
    };
  } catch (error) {
    return {
      success: false,
      cardsCount: 0,
      statsCount: 0,
      message: error instanceof Error ? error.message : 'Unbekannter Importfehler',
    };
  }
}

