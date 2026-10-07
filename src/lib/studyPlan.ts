import {
  DAY_THEMES,
  DIALOGUE_SCHEDULE,
  EXAM_SCHEDULE,
  GRAMMAR_SCHEDULE,
  PLAN_DAYS,
  PLAN_WEEKS,
  VOCAB_DAYS,
  type ExamSet,
  type PlanTaskKind,
  type PlanWeek,
} from '../data/studyPlan';
import { LESSONS_META, STORIES_META } from '../data/curriculumMeta';

export interface PlanTask {
  id: string;
  kind: PlanTaskKind;
  label: string;
  detail?: string;
  minutes: number;
  route: string;
  /** Optionale Aufgaben entfallen zuerst, wenn ein Tag über dem Zeitbudget liegt. */
  optional?: boolean;
  /** Wird automatisch als erledigt erkannt, sobald der Inhalt abgeschlossen wurde. */
  auto?: { type: 'grammar' | 'story' | 'dialogue'; id: string };
}

export interface PlanDay {
  day: number;
  week: number;
  theme: string;
  tasks: PlanTask[];
  totalMinutes: number;
  /** Vokabel-IDs, die an diesem Tag neu eingeführt werden. */
  vocabIds: string[];
  exam?: ExamSet;
}

export interface StudyPlanState {
  /** Lokaler Datumsschlüssel YYYY-MM-DD von Tag 1. */
  startDate: string;
  /** Optionaler Prüfungstermin (YYYY-MM-DD). */
  examDate?: string;
  doneTasks: string[];
}

export interface CompletedContent {
  grammar: readonly string[];
  stories: readonly string[];
  dialogues: readonly string[];
}

/** Tägliches Zeitbudget in Minuten (2 Stunden plus Puffer). */
export const DAY_BUDGET_MINUTES = 150;

const MS_PER_DAY = 86_400_000;

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayDiff(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY);
}

/** Plan-Tag zum Datum: 1 = Starttag. Kann <1 (noch nicht gestartet) oder >30 (vorbei) sein. */
export function getPlanDay(startDate: string, now: Date): number {
  return dayDiff(parseDateKey(startDate), now) + 1;
}

export type PlanPhase = 'upcoming' | 'active' | 'finished';

export function getPlanPhase(day: number): PlanPhase {
  if (day < 1) return 'upcoming';
  if (day > PLAN_DAYS) return 'finished';
  return 'active';
}

/** Verbleibende Tage bis zur Prüfung (0 = heute, negativ = vorbei). */
export function daysUntilExam(examDate: string, now: Date): number {
  return dayDiff(now, parseDateKey(examDate));
}

/** Datumsschlüssel für Plan-Tag `day`. */
export function dateKeyForPlanDay(startDate: string, day: number): string {
  const d = parseDateKey(startDate);
  d.setDate(d.getDate() + day - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function getWeekForDay(day: number): PlanWeek {
  return PLAN_WEEKS.find((w) => day >= w.firstDay && day <= w.lastDay) ?? PLAN_WEEKS[PLAN_WEEKS.length - 1];
}

/** Gleichmäßige Aufteilung der Wortliste auf Tag 1..VOCAB_DAYS (Reihenfolge der Wortliste). */
export function vocabIdsForDay(day: number, allIds: readonly string[]): string[] {
  if (day < 1 || day > VOCAB_DAYS) return [];
  const start = Math.floor(((day - 1) * allIds.length) / VOCAB_DAYS);
  const end = Math.floor((day * allIds.length) / VOCAB_DAYS);
  return allIds.slice(start, end);
}

const EXAM_LABELS: Record<ExamSet, string> = {
  set1: 'Set 1',
  set2: 'Set 2',
  shuffle: 'Zufallsmix',
};

function buildTasks(day: number, vocabIds: string[]): PlanTask[] {
  const t = (task: Omit<PlanTask, 'id'>): PlanTask => ({ ...task, id: `d${day}-${task.kind}` });
  const tasks: PlanTask[] = [];
  const exam = EXAM_SCHEDULE[day];
  const grammarIdx = GRAMMAR_SCHEDULE[day];
  const dialogueId = DIALOGUE_SCHEDULE[day];

  if (day <= 3) {
    tasks.push(
      t({
        kind: 'pinyin',
        label: 'Pinyin- und Tonschule',
        detail: 'Initialen, Finalen und die vier Töne.',
        minutes: 25,
        route: '/pinyin',
      }),
    );
  }

  if (vocabIds.length > 0) {
    tasks.push(
      t({
        kind: 'vocab',
        label: `${vocabIds.length} neue Wörter lernen`,
        detail: 'Hören, nachsprechen, Strichfolge ansehen.',
        minutes: 25,
        route: '/dictionary',
      }),
    );
  }

  tasks.push(
    t({
      kind: 'srs',
      label: 'Fällige Wörter wiederholen',
      detail: day === 1 ? 'Beginne mit den ersten Karten.' : 'Bis das Tagesziel erreicht ist.',
      minutes: day === 30 ? 20 : 25,
      route: '/review',
    }),
  );

  if (grammarIdx !== undefined) {
    const lesson = LESSONS_META[grammarIdx];
    const story = STORIES_META[grammarIdx];
    if (lesson) {
      tasks.push(
        t({
          kind: 'grammar',
          label: `Grammatik: ${lesson.title}`,
          minutes: 25,
          route: '/grammar',
          auto: { type: 'grammar', id: lesson.id },
        }),
      );
    }
    if (story) {
      tasks.push(
        t({
          kind: 'story',
          label: `Lesen: ${story.germanTitle}`,
          minutes: 20,
          route: '/stories',
          auto: { type: 'story', id: story.id },
        }),
      );
    }
  }

  if (dialogueId) {
    tasks.push(
      t({
        kind: 'dialogue',
        label: 'Alltagsdialog durchspielen',
        detail: `Szenario: ${dialogueId}`,
        minutes: 20,
        route: '/dialogue',
        auto: { type: 'dialogue', id: dialogueId },
      }),
    );
  }

  tasks.push(
    t({
      kind: 'listening',
      label: 'Hörtraining: Töne und Minimalpaare',
      minutes: day === 30 ? 10 : 15,
      route: '/ear-trainer',
    }),
  );

  if (day <= 21 && !exam) {
    tasks.push(
      t({
        kind: 'writing',
        label: day <= 3 ? 'Stricharten und Strichfolge' : 'Zeichen aus Radikalen bauen',
        minutes: 15,
        route: day <= 3 ? '/strokes' : '/alchemy',
        optional: day > 3,
      }),
    );
  }

  if (day >= 4 && day <= 14) {
    tasks.push(
      t({
        kind: 'numbers',
        label: 'Zahlen, Uhrzeiten und Daten',
        minutes: 10,
        route: '/number-drill',
        optional: true,
      }),
    );
  }

  if (day >= 8 && day <= 24) {
    tasks.push(
      t({
        kind: 'typing',
        label: 'Pinyin-Tippen',
        minutes: 10,
        route: '/typeracer',
        optional: true,
      }),
    );
  }

  if (day >= 15 && day <= 29 && !exam) {
    tasks.push(
      t({
        kind: 'blitz',
        label: 'Blitz-Runde (90 Sekunden)',
        minutes: 10,
        route: '/blitz',
        optional: true,
      }),
    );
  }

  if (exam) {
    tasks.push(
      t({
        kind: 'exam',
        label: `Probeprüfung (${EXAM_LABELS[exam]})`,
        detail: '40 Minuten am Stück, ohne Pause und ohne Nachschlagen.',
        minutes: 60,
        route: '/exam',
      }),
    );
  }

  if (day >= 8) {
    tasks.push(
      t({
        kind: 'mistakes',
        label: day === 29 ? 'Schwachstellen-Trainer (ausführlich)' : 'Fehlerbank trainieren',
        minutes: day === 29 ? 40 : day === 30 ? 15 : exam ? 20 : 15,
        route: '/mistakes',
      }),
    );
  }

  return trimToBudget(tasks);
}

function trimToBudget(tasks: PlanTask[]): PlanTask[] {
  const result = [...tasks];
  let total = result.reduce((sum, task) => sum + task.minutes, 0);
  for (let i = result.length - 1; i >= 0 && total > DAY_BUDGET_MINUTES; i--) {
    if (result[i].optional) {
      total -= result[i].minutes;
      result.splice(i, 1);
    }
  }
  return result;
}

export function buildPlanDay(day: number, allVocabIds: readonly string[]): PlanDay {
  const vocabIds = vocabIdsForDay(day, allVocabIds);
  const tasks = buildTasks(day, vocabIds);
  const grammarIdx = GRAMMAR_SCHEDULE[day];
  const theme =
    DAY_THEMES[day] ??
    (grammarIdx !== undefined && LESSONS_META[grammarIdx]
      ? `Lektion ${grammarIdx + 1}: ${LESSONS_META[grammarIdx].title}`
      : day > VOCAB_DAYS
        ? 'Wiederholung und Festigung'
        : 'Wortschatz und Alltag');
  return {
    day,
    week: getWeekForDay(day).week,
    theme,
    tasks,
    totalMinutes: tasks.reduce((sum, task) => sum + task.minutes, 0),
    vocabIds,
    exam: EXAM_SCHEDULE[day],
  };
}

export function buildPlan(allVocabIds: readonly string[]): PlanDay[] {
  return Array.from({ length: PLAN_DAYS }, (_, i) => buildPlanDay(i + 1, allVocabIds));
}

/** Erledigt = manuell abgehakt oder inhaltlich abgeschlossen (Grammatik, Geschichte, Dialog). */
export function isTaskDone(task: PlanTask, doneTasks: ReadonlySet<string>, completed: CompletedContent): boolean {
  if (doneTasks.has(task.id)) return true;
  if (!task.auto) return false;
  switch (task.auto.type) {
    case 'grammar':
      return completed.grammar.includes(task.auto.id);
    case 'story':
      return completed.stories.includes(task.auto.id);
    case 'dialogue':
      return completed.dialogues.includes(task.auto.id);
  }
}

export function isDayDone(day: PlanDay, doneTasks: ReadonlySet<string>, completed: CompletedContent): boolean {
  return day.tasks.every((task) => isTaskDone(task, doneTasks, completed));
}

export interface PlanProgress {
  doneTasks: number;
  totalTasks: number;
  doneDays: number;
  percent: number;
}

export function planProgress(
  plan: readonly PlanDay[],
  doneTasks: ReadonlySet<string>,
  completed: CompletedContent,
): PlanProgress {
  let done = 0;
  let total = 0;
  let doneDays = 0;
  for (const day of plan) {
    const dayDone = day.tasks.filter((task) => isTaskDone(task, doneTasks, completed)).length;
    done += dayDone;
    total += day.tasks.length;
    if (dayDone === day.tasks.length) doneDays += 1;
  }
  return {
    doneTasks: done,
    totalTasks: total,
    doneDays,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

/** Vergangene Tage mit offenen Aufgaben (für den Aufholen-Hinweis). */
export function missedDays(
  plan: readonly PlanDay[],
  currentDay: number,
  doneTasks: ReadonlySet<string>,
  completed: CompletedContent,
): number[] {
  return plan
    .filter((d) => d.day < currentDay && !isDayDone(d, doneTasks, completed))
    .map((d) => d.day);
}
