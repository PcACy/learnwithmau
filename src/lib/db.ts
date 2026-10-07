import Dexie, { type Table } from 'dexie';
import type { SrsCard } from '../types/srs';
import type { DailyGoal, SessionStat, StreakData } from '../types/game';
import type { MistakeRecord } from '../types/mistake';
import type { StudyPlanState } from './studyPlan';

/** Typisierte Meta-Einträge (key-value in Tabelle `meta`). */
export interface MetaMap {
  streak: StreakData;
  dailyGoal: DailyGoal;
  completedGrammar: string[];
  completedStories: string[];
  completedDialogues: Record<string, { stars: number; bestScore: number; completedAt: string }>;
  mistakeBank: Record<string, MistakeRecord>;
  studyPlan: StudyPlanState;
}

export type MetaKey = keyof MetaMap;

interface MetaRow {
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

export async function getCompletedGrammar(): Promise<string[]> {
  const meta = await getMeta('completedGrammar');
  if (meta && Array.isArray(meta)) return meta;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('hanzi_completed_grammar') : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function putCompletedGrammar(ids: string[]): Promise<void> {
  await putMeta('completedGrammar', ids);
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanzi_completed_grammar', JSON.stringify(ids));
    }
  } catch {
    // ignore
  }
}

export async function getCompletedStories(): Promise<string[]> {
  const meta = await getMeta('completedStories');
  if (meta && Array.isArray(meta)) return meta;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('hanzi_completed_stories') : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function putCompletedStories(ids: string[]): Promise<void> {
  await putMeta('completedStories', ids);
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanzi_completed_stories', JSON.stringify(ids));
    }
  } catch {
    // ignore
  }
}

export async function getCompletedDialogues(): Promise<Record<string, { stars: number; bestScore: number; completedAt: string }>> {
  const meta = await getMeta('completedDialogues');
  if (meta && typeof meta === 'object' && !Array.isArray(meta)) return meta;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('hanzi_completed_dialogues') : null;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function putCompletedDialogues(dialogues: Record<string, { stars: number; bestScore: number; completedAt: string }>): Promise<void> {
  await putMeta('completedDialogues', dialogues);
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanzi_completed_dialogues', JSON.stringify(dialogues));
    }
  } catch {
    // ignore
  }
}

export async function getMistakeBank(): Promise<Record<string, MistakeRecord>> {
  const meta = await getMeta('mistakeBank');
  if (meta && typeof meta === 'object' && !Array.isArray(meta)) return meta;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('hanzi_mistake_bank') : null;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function putMistakeBank(mistakes: Record<string, MistakeRecord>): Promise<void> {
  await putMeta('mistakeBank', mistakes);
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanzi_mistake_bank', JSON.stringify(mistakes));
    }
  } catch {
    // ignore
  }
}

function isStudyPlanState(value: unknown): value is StudyPlanState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.startDate === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(v.startDate) &&
    (v.examDate === undefined || (typeof v.examDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v.examDate))) &&
    Array.isArray(v.doneTasks) &&
    v.doneTasks.every((id) => typeof id === 'string')
  );
}

/** 30-Tage-Plan; `null`, solange der Plan nicht gestartet wurde. */
export async function getStudyPlan(): Promise<StudyPlanState | null> {
  const meta = await getMeta('studyPlan');
  if (isStudyPlanState(meta)) return meta;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('hanzi_study_plan') : null;
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return isStudyPlanState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function putStudyPlan(plan: StudyPlanState): Promise<void> {
  await putMeta('studyPlan', plan);
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanzi_study_plan', JSON.stringify(plan));
    }
  } catch {
    // ignore
  }
}

interface BackupData {
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

/** YYYY-MM-DD Datumsschlüssel (wie von createCard erzeugt). */
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateKey(value: unknown): value is string {
  return typeof value === 'string' && DATE_KEY_PATTERN.test(value) && !Number.isNaN(Date.parse(value));
}

function isIsoTimestampOrNull(value: unknown): value is string | null {
  return value === null || (typeof value === 'string' && !Number.isNaN(Date.parse(value)));
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/** Element-Validator: eine fremde/korrumpierte Backup-Datei darf keine Rows in Dexie schreiben. */
function isValidSrsCard(value: unknown): value is SrsCard {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const card = value as Record<string, unknown>;
  return (
    typeof card.itemId === 'string' &&
    card.itemId.length > 0 &&
    isFiniteNumber(card.easiness) &&
    card.easiness > 0 &&
    isFiniteNumber(card.intervalDays) &&
    card.intervalDays >= 0 &&
    isFiniteNumber(card.repetitions) &&
    card.repetitions >= 0 &&
    isFiniteNumber(card.lapses) &&
    card.lapses >= 0 &&
    isValidDateKey(card.dueDate) &&
    isIsoTimestampOrNull(card.lastReviewedAt)
  );
}

/** Element-Validator für SessionStat-Zeilen aus fremden Backups. */
function isValidSessionStat(value: unknown): value is SessionStat {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.mode === 'string' &&
    row.mode.length > 0 &&
    typeof row.finishedAt === 'string' &&
    !Number.isNaN(Date.parse(row.finishedAt)) &&
    isFiniteNumber(row.answered) &&
    row.answered >= 0 &&
    isFiniteNumber(row.correct) &&
    row.correct >= 0 &&
    isFiniteNumber(row.durationMs) &&
    row.durationMs >= 0
  );
}

const META_KEYS: readonly MetaKey[] = [
  'streak',
  'dailyGoal',
  'completedGrammar',
  'completedStories',
  'completedDialogues',
  'mistakeBank',
  'studyPlan',
];

function isValidMetaRow(value: unknown): value is MetaRow {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const row = value as Record<string, unknown>;
  if (typeof row.key !== 'string') return false;
  return (META_KEYS as readonly string[]).includes(row.key);
}

/**
 * Importiert ein Backup-JSON in Dexie (atomar in einer Transaktion).
 * Ungültige oder importierte Fremd-Einträge werden verworfen, nicht geschrieben.
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

    const cards = data.cards.filter(isValidSrsCard);
    const stats = data.stats.filter(isValidSessionStat);
    const meta = Array.isArray(data.meta) ? data.meta.filter(isValidMetaRow) : [];

    await db.transaction('rw', db.cards, db.meta, db.stats, async () => {
      await db.cards.clear();
      await db.meta.clear();
      await db.stats.clear();

      // Lokaler Spiegel muss vor dem Import sterben, sonst reaktiviert ein
      // Backup ohne mistakeBank-Zeile die alte Fehlerbank nach dem Neuladen.
      try {
        localStorage.removeItem('hanzi_mistake_bank');
        localStorage.removeItem('hanzi_study_plan');
      } catch {
        // ignore
      }

      if (cards.length > 0) {
        await db.cards.bulkPut(cards);
      }
      if (meta.length > 0) {
        await db.meta.bulkPut(meta);
        for (const row of meta) {
          if (row.key === 'completedGrammar' && Array.isArray(row.value)) {
            try {
              localStorage.setItem('hanzi_completed_grammar', JSON.stringify(row.value));
            } catch {
              // ignore
            }
          } else if (row.key === 'completedStories' && Array.isArray(row.value)) {
            try {
              localStorage.setItem('hanzi_completed_stories', JSON.stringify(row.value));
            } catch {
              // ignore
            }
          } else if (row.key === 'completedDialogues' && typeof row.value === 'object' && row.value !== null) {
            try {
              localStorage.setItem('hanzi_completed_dialogues', JSON.stringify(row.value));
            } catch {
              // ignore
            }
          } else if (row.key === 'studyPlan' && isStudyPlanState(row.value)) {
            try {
              localStorage.setItem('hanzi_study_plan', JSON.stringify(row.value));
            } catch {
              // ignore
            }
          } else if (row.key === 'mistakeBank' && typeof row.value === 'object' && row.value !== null) {
            try {
              localStorage.setItem('hanzi_mistake_bank', JSON.stringify(row.value));
            } catch {
              // ignore
            }
          }
        }
      }
      if (stats.length > 0) {
        // Strip previous auto-increment IDs
        const cleanedStats = stats.map((s) => ({
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
      cardsCount: cards.length,
      statsCount: stats.length,
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

