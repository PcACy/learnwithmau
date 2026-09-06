import { create } from 'zustand';
import type { SrsCard, SrsGrade } from '../types/srs';
import { applyReview, createCard, toDateKey } from '../lib/srs';
import type { DailyGoal, SessionStat, StreakData } from '../types/game';
import { db, getMeta, getMistakeBank, putMeta, putMistakeBank } from '../lib/db';
import type { MistakeRecord, MistakeSourceMode } from '../types/mistake';
import { applyDrillResult, createOrUpdateMistakeRecord } from '../lib/mistakeBank';

export const DEFAULT_DAILY_TARGET = 20;

const DEFAULT_STREAK: StreakData = {
  current: 0,
  longest: 0,
  lastActiveDate: null,
};

function todayGoal(now: Date): DailyGoal {
  return { date: toDateKey(now), targetReviews: DEFAULT_DAILY_TARGET, completedReviews: 0 };
}

/** Rollt den Streak beim ersten Lerntag des Tages weiter (Reset nach >1 Tag Pause). */
function touchStreak(streak: StreakData, today: string): StreakData {
  if (streak.lastActiveDate === today) return streak;

  const [y, m, d] = today.split('-').map(Number);
  const yesterday = new Date(y, m - 1, d);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toDateKey(yesterday);

  const current = streak.lastActiveDate === yesterdayKey ? streak.current + 1 : 1;
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastActiveDate: today,
  };
}

export function ensureFresh(goal: DailyGoal, now: Date = new Date()): DailyGoal {
  const today = toDateKey(now);
  return goal.date === today ? goal : { ...goal, date: today, completedReviews: 0 };
}

/**
 * Normalisiert den Streak-Zustand gegen das aktuelle Datum.
 * Wenn der letzte Lerntag weder heute noch gestern war, ist die aktive Serie
 * unterbrochen (current: 0), der Rekord (longest) bleibt jedoch erhalten.
 */
export function normalizeStreak(streak: StreakData, now: Date = new Date()): StreakData {
  if (!streak.lastActiveDate) return streak;
  const today = toDateKey(now);
  if (streak.lastActiveDate === today) return streak;

  const [y, m, d] = today.split('-').map(Number);
  const yesterday = new Date(y, m - 1, d);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toDateKey(yesterday);

  if (streak.lastActiveDate === yesterdayKey) {
    return streak;
  }

  return {
    ...streak,
    current: 0,
  };
}

export interface ProgressState {

  /** true, sobald Dexie-Hydration abgeschlossen ist. */
  hydrated: boolean;
  cards: Record<string, SrsCard>;
  streak: StreakData;
  dailyGoal: DailyGoal;
  mistakes: Record<string, MistakeRecord>;

  hydrate(): Promise<void>;
  /** SM-2-Review mit Write-Through nach IndexedDB (atomar in einer Transaktion). */
  review(itemId: string, grade: SrsGrade, now?: Date): Promise<void>;
  /** Loggt eine abgeschlossene Session fürs Dashboard (ohne SRS-Effekt). */
  logSession(stat: Omit<SessionStat, 'id' | 'finishedAt'>): Promise<void>;
  /** Setzt das Tagesziel (heutige completedReviews bleiben erhalten). */
  setDailyTarget(target: number): Promise<void>;
  /** Erfasst einen Fehler aus einem beliebigen Spiel-/Lernmodus in der Fehlerbank. */
  recordMistake(itemId: string, mode: MistakeSourceMode): Promise<void>;
  /** Verarbeitet das Ergebnis einer Schwachstellen-Übung (2 Treffer in Folge = gemeistert). */
  answerMistakeDrill(itemId: string, correct: boolean): Promise<{ resolved: boolean; streak: number }>;
  /** Löscht alle als gemeistert (isResolved: true) markierten Fehler aus der Bank. */
  clearResolvedMistakes(): Promise<void>;
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
  // Ohne Window (Tests/SSR) gibt es kein IndexedDB – dann direkt als bereit
  // markieren, damit AppShell die Seiten statt des Skeletons rendert.
  hydrated: typeof window === 'undefined',
  cards: {},
  streak: DEFAULT_STREAK,
  dailyGoal: todayGoal(new Date()),
  mistakes: {},

  async hydrate() {
    const HYDRATION_TIMEOUT_MS = 3000;

    // IndexedDB.open kann bei blockierten Schema-Upgrades oder hängenden
    // deleteDatabase-Aufrufen PENDING bleiben (nie rejecten) – ohne Timeout
    // würde die App dann endlos im Skeleton hängen. Deshalb: Race, danach
    // UI freigeben; ein später Nachmerge holt verspätete Daten nach.
    const withTimeout = <T>(promise: Promise<T>): Promise<T | undefined> =>
      Promise.race([
        promise,
        new Promise<undefined>((resolve) => {
          window.setTimeout(() => resolve(undefined), HYDRATION_TIMEOUT_MS);
        }),
      ]);

    const load = () =>
      Promise.all([
        db.cards.toArray().catch(() => [] as SrsCard[]),
        getMeta('streak').catch(() => undefined),
        getMeta('dailyGoal').catch(() => undefined),
        getMistakeBank().catch(() => ({})),
      ] as const);

    let [cardRows, streak, dailyGoal, loadedMistakes] = await withTimeout(load()).then(
      (result) => result ?? [undefined, undefined, undefined, undefined],
    );

    const timedOut = cardRows === undefined;
    const cards: Record<string, SrsCard> = {};
    for (const card of cardRows ?? []) {
      cards[card.itemId] = card;
    }

    const now = new Date();
    const effectiveStreak = streak ? normalizeStreak(streak, now) : get().streak;
    const effectiveGoal = dailyGoal ? ensureFresh(dailyGoal, now) : (timedOut ? get().dailyGoal : todayGoal(now));

    set({
      hydrated: true,
      cards,
      streak: effectiveStreak,
      dailyGoal: effectiveGoal,
      mistakes: loadedMistakes ?? get().mistakes ?? {},
    });

    if (timedOut) {
      // Nachmerge: Wenn die Datenbank später doch aufgeht (z.B. nach dem
      // Schließen eines blockierenden Tabs), Daten leise übernehmen.
      window.setTimeout(() => {
        void load()
          .then(([lateRows, lateStreak, lateGoal, lateMistakes]) => {
            if (!lateRows) return;
            const lateCards: Record<string, SrsCard> = { ...get().cards };
            for (const card of lateRows) {
              lateCards[card.itemId] = card;
            }
            const lateNow = new Date();
            set((state) => ({
              cards: lateCards,
              streak: lateStreak ? normalizeStreak(lateStreak, lateNow) : state.streak,
              dailyGoal: lateGoal ? ensureFresh(lateGoal, lateNow) : state.dailyGoal,
              mistakes: lateMistakes ? { ...state.mistakes, ...lateMistakes } : state.mistakes,
            }));
          })
          .catch(() => undefined);
      }, 6000);
    }
  },

  async review(itemId, grade, now) {
    const at = now ?? new Date();

    const existing = get().cards[itemId];
    const reviewed = applyReview(existing ?? createCard(itemId, at), grade, at);

    let updatedGoal: DailyGoal = get().dailyGoal;
    let updatedStreak: StreakData = get().streak;

    set((state) => {
      const freshGoal = ensureFresh(state.dailyGoal, at);
      updatedGoal = { ...freshGoal, completedReviews: freshGoal.completedReviews + 1 };
      updatedStreak = touchStreak(state.streak, toDateKey(at));
      return {
        cards: { ...state.cards, [itemId]: reviewed },
        dailyGoal: updatedGoal,
        streak: updatedStreak,
      };
    });

    try {
      await db.transaction('rw', db.cards, db.meta, async () => {
        await db.cards.put(reviewed);
        await db.meta.bulkPut([
          { key: 'dailyGoal', value: updatedGoal },
          { key: 'streak', value: updatedStreak },
        ]);
      });
    } catch {
      // IndexedDB write error handled gracefully in memory
    }
  },

  async logSession(stat) {
    const at = new Date();
    const record: SessionStat = { ...stat, finishedAt: at.toISOString() };
    const credit = stat.correct > 0 ? stat.correct : (stat.answered > 0 ? 1 : 0);

    let updatedGoal: DailyGoal = get().dailyGoal;
    let updatedStreak: StreakData = get().streak;

    set((state) => {
      const freshGoal = ensureFresh(state.dailyGoal, at);
      updatedGoal = { ...freshGoal, completedReviews: freshGoal.completedReviews + credit };
      updatedStreak = touchStreak(state.streak, toDateKey(at));
      return {
        dailyGoal: updatedGoal,
        streak: updatedStreak,
      };
    });

    try {
      await db.transaction('rw', db.stats, db.meta, async () => {
        await db.stats.add(record);
        await db.meta.bulkPut([
          { key: 'dailyGoal', value: updatedGoal },
          { key: 'streak', value: updatedStreak },
        ]);
      });
    } catch {
      // IndexedDB write error handled gracefully
    }
  },

  async setDailyTarget(target) {
    const clamped = Math.min(100, Math.max(5, Math.round(target)));
    const goal: DailyGoal = {
      ...ensureFresh(get().dailyGoal, new Date()),
      targetReviews: clamped,
    };
    try {
      await putMeta('dailyGoal', goal);
    } catch {
      // Write-Through-Fehler: In-Memory-State bleibt führend
    }
    set({ dailyGoal: goal });
  },

  async recordMistake(itemId, mode) {
    const existing = get().mistakes[itemId];
    const updated = createOrUpdateMistakeRecord(existing, itemId, mode, new Date());
    const nextMistakes = { ...get().mistakes, [itemId]: updated };
    set({ mistakes: nextMistakes });
    try {
      await putMistakeBank(nextMistakes);
    } catch {
      // Write-Through-Fehler: In-Memory-State bleibt führend
    }
  },

  async answerMistakeDrill(itemId, correct) {
    const existing = get().mistakes[itemId];
    if (!existing) {
      return { resolved: false, streak: 0 };
    }
    const updated = applyDrillResult(existing, correct, new Date());
    const nextMistakes = { ...get().mistakes, [itemId]: updated };
    set({ mistakes: nextMistakes });
    try {
      await putMistakeBank(nextMistakes);
    } catch {
      // Write-Through-Fehler: In-Memory-State bleibt führend
    }
    return { resolved: updated.isResolved, streak: updated.consecutiveCorrect };
  },

  async clearResolvedMistakes() {
    const current = get().mistakes;
    const remaining: Record<string, MistakeRecord> = {};
    for (const [id, record] of Object.entries(current)) {
      if (!record.isResolved) {
        remaining[id] = record;
      }
    }
    set({ mistakes: remaining });
    try {
      await putMistakeBank(remaining);
    } catch {
      // Write-Through-Fehler: In-Memory-State bleibt führend
    }
  },
}));

