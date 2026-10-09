import { create } from 'zustand';
import type { SrsCard, SrsGrade } from '../types/srs';
import { applyReview, createCard, toDateKey } from '../lib/srs';
import type { DailyGoal, SessionStat, StreakData } from '../types/game';
import {
  db,
  getMeta,
  getMistakeBank,
  getUnlockedAchievements,
  getXp,
  putMeta,
  putMistakeBank,
} from '../lib/db';
import { aggregateSessionStats } from '../lib/achievementStats';
import { findNewUnlocks, withUnlocks } from '../lib/gamification';
import { levelFromXp, xpForSession } from '../lib/xp';
import { ACHIEVEMENTS } from '../config/achievements';
import { fireCelebration } from '../lib/confetti';
import { useToastStore } from './toastStore';
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

/** Ergebnis der letzten Session für die Abschlussansicht (nicht persistiert). */
export interface SessionReward {
  /** Date.now() beim Abschluss; die Abschlussansicht ignoriert ältere Belohnungen. */
  at: number;
  xpGained: number;
  levelBefore: number;
  levelAfter: number;
  /** Erfolg-IDs, die durch diese Session neu freigeschaltet wurden. */
  unlocked: string[];
}

/** false, solange Alt-Bestände (XP/Erfolge) noch nicht still nachgetragen wurden. */
let gamificationSeeded = false;

function notifyGoalReached(prev: DailyGoal, next: DailyGoal): void {
  if (prev.date === next.date && prev.completedReviews >= prev.targetReviews) return;
  if (next.completedReviews < next.targetReviews) return;
  useToastStore.getState().push({
    kind: 'goal',
    title: 'Tagesziel erreicht',
    body: `${next.completedReviews} von ${next.targetReviews} Aufgaben erledigt`,
  });
  fireCelebration();
}

export interface ProgressState {

  /** true, sobald Dexie-Hydration abgeschlossen ist. */
  hydrated: boolean;
  cards: Record<string, SrsCard>;
  streak: StreakData;
  dailyGoal: DailyGoal;
  mistakes: Record<string, MistakeRecord>;
  xp: number;
  /** Erfolg-ID → ISO-Zeitstempel der Freischaltung. */
  unlockedAchievements: Record<string, string>;
  lastReward: SessionReward | null;

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

/**
 * Einmalige, stille Migration für Bestandsnutzer: XP aus der Session-Historie
 * schätzen und bereits erfüllte Erfolge als freigeschaltet markieren,
 * damit nicht alle auf einmal als „neu“ aufpoppen.
 */
async function seedGamification(
  existingXp: number | undefined,
  existingUnlocked: Record<string, string> | undefined,
): Promise<void> {
  const rows = await db.stats.toArray();
  const state = useProgressStore.getState();
  const now = new Date();

  const xp = existingXp ?? rows.reduce((sum, row) => sum + xpForSession(row), 0);
  const unlocked =
    existingUnlocked ??
    withUnlocks(
      {},
      findNewUnlocks(state.cards, state.streak, aggregateSessionStats(rows), {}),
      now,
    );

  useProgressStore.setState({ xp, unlockedAchievements: unlocked });
  await db.meta.bulkPut([
    { key: 'xp', value: xp },
    { key: 'unlockedAchievements', value: unlocked },
  ]);
  gamificationSeeded = true;
}

/** Handle des ausstehenden 6s-Nachmerges aus hydrate(); wird bei jedem hydrate() verworfen. */
let lateMergeTimer: number | undefined;

export const useProgressStore = create<ProgressState>()((set, get) => ({
  // Ohne Window (Tests/SSR) gibt es kein IndexedDB – dann direkt als bereit
  // markieren, damit AppShell die Seiten statt des Skeletons rendert.
  hydrated: typeof window === 'undefined',
  cards: {},
  streak: DEFAULT_STREAK,
  dailyGoal: todayGoal(new Date()),
  mistakes: {},
  xp: 0,
  unlockedAchievements: {},
  lastReward: null,

  async hydrate() {
    const HYDRATION_TIMEOUT_MS = 3000;

    // Ein noch ausstehender Nachmerge darf keine veralteten Daten
    // (z.B. aus vor einem Reset) zurückholen.
    if (lateMergeTimer !== undefined) {
      window.clearTimeout(lateMergeTimer);
      lateMergeTimer = undefined;
    }

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
        getXp().catch(() => undefined),
        getUnlockedAchievements().catch(() => undefined),
      ] as const);

    const [cardRows, streak, dailyGoal, loadedMistakes, loadedXp, loadedUnlocked] = await withTimeout(
      load(),
    ).then((result) => result ?? [undefined, undefined, undefined, undefined, undefined, undefined]);

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
      xp: loadedXp ?? get().xp,
      unlockedAchievements: loadedUnlocked ?? get().unlockedAchievements,
    });

    if (!timedOut) {
      if (loadedXp !== undefined && loadedUnlocked !== undefined) {
        gamificationSeeded = true;
      } else {
        void seedGamification(loadedXp, loadedUnlocked).catch(() => undefined);
      }
    }

    if (timedOut) {
      // Nachmerge: Wenn die Datenbank später doch aufgeht (z.B. nach dem
      // Schließen eines blockierenden Tabs), Daten leise übernehmen.
      lateMergeTimer = window.setTimeout(() => {
        lateMergeTimer = undefined;
        void load()
          .then(([lateRows, lateStreak, lateGoal, lateMistakes, lateXp, lateUnlocked]) => {
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
              xp: lateXp ?? state.xp,
              unlockedAchievements: lateUnlocked ?? state.unlockedAchievements,
            }));
            if (lateXp !== undefined && lateUnlocked !== undefined) {
              gamificationSeeded = true;
            } else {
              void seedGamification(lateXp, lateUnlocked).catch(() => undefined);
            }
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
    const goalBefore = ensureFresh(get().dailyGoal, at);

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
    notifyGoalReached(goalBefore, updatedGoal);

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
    const xpGained = xpForSession(stat);
    const levelBefore = levelFromXp(get().xp).level;
    const goalBefore = ensureFresh(get().dailyGoal, at);

    let updatedGoal: DailyGoal = get().dailyGoal;
    let updatedStreak: StreakData = get().streak;
    let updatedXp = get().xp;

    set((state) => {
      const freshGoal = ensureFresh(state.dailyGoal, at);
      updatedGoal = { ...freshGoal, completedReviews: freshGoal.completedReviews + credit };
      updatedStreak = touchStreak(state.streak, toDateKey(at));
      updatedXp = state.xp + xpGained;
      return {
        dailyGoal: updatedGoal,
        streak: updatedStreak,
        xp: updatedXp,
      };
    });

    try {
      await db.transaction('rw', db.stats, db.meta, async () => {
        await db.stats.add(record);
        await db.meta.bulkPut([
          { key: 'dailyGoal', value: updatedGoal },
          { key: 'streak', value: updatedStreak },
          { key: 'xp', value: updatedXp },
        ]);
      });
    } catch {
      // IndexedDB write error handled gracefully
    }

    const levelAfter = levelFromXp(updatedXp).level;
    const toasts = useToastStore.getState();
    notifyGoalReached(goalBefore, updatedGoal);
    if (levelAfter > levelBefore) {
      toasts.push({
        kind: 'level',
        title: `Level ${levelAfter} erreicht`,
        body: levelFromXp(updatedXp).title,
      });
    }

    let unlocked: string[] = [];
    if (gamificationSeeded) {
      try {
        const stats = aggregateSessionStats(await db.stats.toArray());
        const state = get();
        unlocked = findNewUnlocks(state.cards, state.streak, stats, state.unlockedAchievements);
        if (unlocked.length > 0) {
          const next = withUnlocks(state.unlockedAchievements, unlocked, at);
          set({ unlockedAchievements: next });
          await putMeta('unlockedAchievements', next).catch(() => undefined);
          for (const id of unlocked) {
            const ach = ACHIEVEMENTS.find((a) => a.id === id);
            if (ach) toasts.push({ kind: 'achievement', title: ach.title, body: 'Neuer Erfolg freigeschaltet' });
          }
        }
      } catch {
        // Erfolge werden beim nächsten Abschluss nachgeholt
      }
    }

    set({ lastReward: { at: Date.now(), xpGained, levelBefore, levelAfter, unlocked } });
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

