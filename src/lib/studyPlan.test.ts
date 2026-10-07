import { describe, expect, it } from 'vitest';
import hsk1Data from '../data/hsk1.json';
import dialogues from '../data/dialogues.json';
import { LESSONS_META, STORIES_META } from '../data/curriculumMeta';
import { MODES } from '../config/modes';
import {
  EXAM_SCHEDULE,
  GRAMMAR_SCHEDULE,
  PLAN_DAYS,
  PLAN_WEEKS,
  VOCAB_DAYS,
} from '../data/studyPlan';
import {
  DAY_BUDGET_MINUTES,
  buildPlan,
  dateKeyForPlanDay,
  daysUntilExam,
  getPlanDay,
  getPlanPhase,
  isDayDone,
  isTaskDone,
  missedDays,
  planProgress,
  vocabIdsForDay,
  type CompletedContent,
} from './studyPlan';

const ALL_IDS = (hsk1Data as { id: string }[]).map((v) => v.id);
const PLAN = buildPlan(ALL_IDS);
const NOTHING: CompletedContent = { grammar: [], stories: [], dialogues: [] };

const STATIC_ROUTES = new Set([
  '/dictionary',
  '/pinyin',
  '/strokes',
  '/grammar',
  '/stories',
  '/stats',
  '/blitz',
  '/mistakes',
  ...MODES.map((m) => m.path),
]);

describe('30-Tage-Lernplan: Aufbau', () => {
  it('hat genau 30 Tage in 4 lückenlosen Wochen', () => {
    expect(PLAN).toHaveLength(PLAN_DAYS);
    expect(PLAN.map((d) => d.day)).toEqual(Array.from({ length: PLAN_DAYS }, (_, i) => i + 1));
    expect(PLAN_WEEKS[0].firstDay).toBe(1);
    expect(PLAN_WEEKS[PLAN_WEEKS.length - 1].lastDay).toBe(PLAN_DAYS);
    for (let i = 1; i < PLAN_WEEKS.length; i++) {
      expect(PLAN_WEEKS[i].firstDay).toBe(PLAN_WEEKS[i - 1].lastDay + 1);
    }
  });

  it('verteilt alle Wörter genau einmal auf die Vokabeltage', () => {
    const seen = PLAN.flatMap((d) => d.vocabIds);
    expect(seen).toEqual(ALL_IDS);
    expect(new Set(seen).size).toBe(ALL_IDS.length);
    for (const d of PLAN) {
      if (d.day <= VOCAB_DAYS) {
        expect(d.vocabIds.length).toBeGreaterThanOrEqual(12);
        expect(d.vocabIds.length).toBeLessThanOrEqual(14);
      } else {
        expect(d.vocabIds).toHaveLength(0);
      }
    }
    expect(vocabIdsForDay(0, ALL_IDS)).toEqual([]);
    expect(vocabIdsForDay(PLAN_DAYS + 1, ALL_IDS)).toEqual([]);
  });

  it('plant alle 12 Lektionen, zugehörige Geschichten und alle Dialoge ein', () => {
    const tasks = PLAN.flatMap((d) => d.tasks);
    const grammarIds = tasks.filter((t) => t.auto?.type === 'grammar').map((t) => t.auto?.id);
    const storyIds = tasks.filter((t) => t.auto?.type === 'story').map((t) => t.auto?.id);
    const dialogueIds = tasks.filter((t) => t.auto?.type === 'dialogue').map((t) => t.auto?.id);
    expect(grammarIds).toEqual(LESSONS_META.map((l) => l.id));
    expect(storyIds).toEqual(STORIES_META.slice(0, LESSONS_META.length).map((s) => s.id));
    const realDialogues = (dialogues as { id: string }[]).map((d) => d.id);
    expect([...dialogueIds].sort()).toEqual([...realDialogues].sort());
    expect(Object.keys(GRAMMAR_SCHEDULE)).toHaveLength(LESSONS_META.length);
  });

  it('legt Probeprüfungen Set 1, Set 2 und mindestens zwei Zufallsmixe an', () => {
    const exams = PLAN.filter((d) => d.exam).map((d) => d.exam);
    expect(exams).toContain('set1');
    expect(exams).toContain('set2');
    expect(exams.filter((e) => e === 'shuffle').length).toBeGreaterThanOrEqual(2);
    for (const day of Object.keys(EXAM_SCHEDULE).map(Number)) {
      expect(PLAN[day - 1].tasks.some((t) => t.kind === 'exam')).toBe(true);
    }
  });

  it('bleibt pro Tag im Zeitbudget und hat eindeutige Aufgaben-IDs', () => {
    const ids = new Set<string>();
    for (const d of PLAN) {
      expect(d.totalMinutes).toBeGreaterThan(0);
      expect(d.totalMinutes).toBeLessThanOrEqual(DAY_BUDGET_MINUTES);
      expect(d.totalMinutes).toBe(d.tasks.reduce((s, t) => s + t.minutes, 0));
      for (const t of d.tasks) {
        expect(ids.has(t.id)).toBe(false);
        ids.add(t.id);
      }
    }
  });

  it('verlinkt nur auf existierende Routen', () => {
    for (const d of PLAN) {
      for (const t of d.tasks) {
        expect(STATIC_ROUTES.has(t.route), `${t.id} -> ${t.route}`).toBe(true);
      }
    }
  });

  it('hat jeden Tag Wiederholung und Hörtraining, aber kein neues Wort nach Tag 24', () => {
    for (const d of PLAN) {
      expect(d.tasks.some((t) => t.kind === 'srs')).toBe(true);
      expect(d.tasks.some((t) => t.kind === 'listening')).toBe(true);
      if (d.day > VOCAB_DAYS) expect(d.tasks.some((t) => t.kind === 'vocab')).toBe(false);
    }
  });
});

describe('30-Tage-Lernplan: Datumslogik', () => {
  const start = '2026-10-07';

  it('zählt vom Starttag an (Tag 1) bis Tag 30', () => {
    expect(getPlanDay(start, new Date(2026, 9, 7, 23, 59))).toBe(1);
    expect(getPlanDay(start, new Date(2026, 9, 8, 0, 1))).toBe(2);
    expect(getPlanDay(start, new Date(2026, 10, 5))).toBe(30);
  });

  it('erkennt vor Start und nach Ende', () => {
    expect(getPlanPhase(getPlanDay(start, new Date(2026, 9, 5)))).toBe('upcoming');
    expect(getPlanPhase(getPlanDay(start, new Date(2026, 9, 7)))).toBe('active');
    expect(getPlanPhase(getPlanDay(start, new Date(2026, 10, 5)))).toBe('active');
    expect(getPlanPhase(getPlanDay(start, new Date(2026, 10, 6)))).toBe('finished');
  });

  it('rechnet Datumsschlüssel und Prüfungs-Countdown', () => {
    expect(dateKeyForPlanDay(start, 1)).toBe('2026-10-07');
    expect(dateKeyForPlanDay(start, 30)).toBe('2026-11-05');
    expect(daysUntilExam('2026-11-06', new Date(2026, 9, 7))).toBe(30);
    expect(daysUntilExam('2026-10-07', new Date(2026, 9, 7))).toBe(0);
    expect(daysUntilExam('2026-10-06', new Date(2026, 9, 7))).toBe(-1);
  });
});

describe('30-Tage-Lernplan: Fortschritt', () => {
  it('erkennt Grammatik, Geschichte und Dialog automatisch als erledigt', () => {
    const day1 = PLAN[0];
    const grammar = day1.tasks.find((t) => t.kind === 'grammar');
    expect(grammar).toBeDefined();
    if (!grammar) return;
    expect(isTaskDone(grammar, new Set(), NOTHING)).toBe(false);
    expect(isTaskDone(grammar, new Set(), { ...NOTHING, grammar: [LESSONS_META[0].id] })).toBe(true);
    expect(isTaskDone(grammar, new Set([grammar.id]), NOTHING)).toBe(true);
  });

  it('berechnet Fortschritt und Rückstand', () => {
    const empty = planProgress(PLAN, new Set(), NOTHING);
    expect(empty.percent).toBe(0);
    expect(empty.doneDays).toBe(0);

    const day1Ids = new Set(PLAN[0].tasks.map((t) => t.id));
    expect(isDayDone(PLAN[0], day1Ids, NOTHING)).toBe(true);
    const some = planProgress(PLAN, day1Ids, NOTHING);
    expect(some.doneDays).toBe(1);
    expect(some.percent).toBeGreaterThan(0);

    expect(missedDays(PLAN, 4, day1Ids, NOTHING)).toEqual([2, 3]);
    expect(missedDays(PLAN, 1, new Set(), NOTHING)).toEqual([]);

    const all = new Set(PLAN.flatMap((d) => d.tasks.map((t) => t.id)));
    expect(planProgress(PLAN, all, NOTHING).percent).toBe(100);
  });
});
