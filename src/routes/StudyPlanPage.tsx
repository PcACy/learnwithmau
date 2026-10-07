import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, Circle, Clock, Flag, Play, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VOCAB } from '../data';
import { PLAN_DAYS, PLAN_WEEKS } from '../data/studyPlan';
import {
  getCompletedDialogues,
  getCompletedGrammar,
  getCompletedStories,
  getStudyPlan,
  putStudyPlan,
} from '../lib/db';
import { toDateKey } from '../lib/srs';
import {
  buildPlan,
  daysUntilExam,
  getPlanDay,
  getPlanPhase,
  isDayDone,
  isTaskDone,
  missedDays,
  planProgress,
  type CompletedContent,
  type PlanDay,
  type StudyPlanState,
} from '../lib/studyPlan';
import { KineticButton } from '../components/ui/KineticButton';
import { SealBadge } from '../components/ui/SealBadge';

const PLAN: readonly PlanDay[] = buildPlan(VOCAB.map((item) => item.id));
const NO_CONTENT: CompletedContent = { grammar: [], stories: [], dialogues: [] };

export function StudyPlanPage() {
  const [loaded, setLoaded] = useState(false);
  const [plan, setPlan] = useState<StudyPlanState | null>(null);
  const [completed, setCompleted] = useState<CompletedContent>(NO_CONTENT);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [now] = useState(() => new Date());
  const [examInput, setExamInput] = useState('');

  useEffect(() => {
    let cancelled = false;
    void Promise.all([getStudyPlan(), getCompletedGrammar(), getCompletedStories(), getCompletedDialogues()]).then(
      ([state, grammar, stories, dialogues]) => {
        if (cancelled) return;
        setPlan(state);
        setExamInput(state?.examDate ?? '');
        setCompleted({ grammar, stories, dialogues: Object.keys(dialogues ?? {}) });
        setLoaded(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback((next: StudyPlanState) => {
    setPlan(next);
    void putStudyPlan(next);
  }, []);

  const doneSet = useMemo(() => new Set(plan?.doneTasks ?? []), [plan]);
  const rawDay = plan ? getPlanDay(plan.startDate, now) : 0;
  const phase = plan ? getPlanPhase(rawDay) : 'upcoming';
  const todayDay = Math.min(Math.max(rawDay, 1), PLAN_DAYS);
  const viewDay = selectedDay ?? todayDay;
  const day = PLAN[viewDay - 1];

  const progress = useMemo(() => planProgress(PLAN, doneSet, completed), [doneSet, completed]);
  const missed = useMemo(
    () => (plan && phase === 'active' ? missedDays(PLAN, rawDay, doneSet, completed) : []),
    [plan, phase, rawDay, doneSet, completed],
  );

  const startPlan = () => {
    save({ startDate: toDateKey(new Date()), examDate: examInput || undefined, doneTasks: [] });
    setSelectedDay(null);
  };

  const toggleTask = (taskId: string) => {
    if (!plan) return;
    const next = doneSet.has(taskId) ? plan.doneTasks.filter((id) => id !== taskId) : [...plan.doneTasks, taskId];
    save({ ...plan, doneTasks: next });
  };

  const updateExamDate = (value: string) => {
    setExamInput(value);
    if (plan) save({ ...plan, examDate: value || undefined });
  };

  const restartPlan = () => {
    if (typeof window !== 'undefined' && !window.confirm('Plan wirklich neu starten? Abgehakte Aufgaben gehen verloren.')) {
      return;
    }
    save({ startDate: toDateKey(new Date()), examDate: plan?.examDate, doneTasks: [] });
    setSelectedDay(null);
  };

  const examDays = plan?.examDate ? daysUntilExam(plan.examDate, now) : null;

  return (
    <div className="space-y-10 pb-16">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <SealBadge sealChar="计" label="30-TAGE-PLAN" variant="jade" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            HSK 1 in einem Monat
          </span>
        </div>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
          Dein 30-Tage-Lernplan
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Rund zwei Stunden pro Tag: {VOCAB.length} Wörter, 12 Grammatiklektionen, Lesen, Hören und vier Probeprüfungen.
        </p>
      </div>

      {!loaded ? null : !plan ? (
        <section className="space-y-5 rounded-[2.5rem] border border-zinc-200/70 bg-white p-7 shadow-whisper dark:border-white/[0.06] dark:bg-zinc-900">
          <h2 className="text-xl font-bold tracking-tight">Plan starten</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Heute ist Tag 1. Jeden Tag siehst du genau, was ansteht. Verpasste Tage verschieben nichts, du holst sie
            einfach nach.
          </p>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Prüfungstermin (optional)</span>
            <input
              type="date"
              value={examInput}
              onChange={(e) => setExamInput(e.target.value)}
              className="h-11 rounded-2xl border border-zinc-200 bg-white px-4 font-mono text-sm dark:border-white/10 dark:bg-zinc-800"
            />
          </label>
          <KineticButton onClick={startPlan} icon={<Play className="h-4 w-4" />}>
            Heute mit Tag 1 beginnen
          </KineticButton>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[2rem] border border-zinc-200/70 bg-white p-6 shadow-whisper dark:border-white/[0.06] dark:bg-zinc-900">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Heute</p>
              <p className="mt-1 font-mono text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {phase === 'upcoming' ? 'Start bald' : phase === 'finished' ? 'Geschafft' : `Tag ${rawDay} / ${PLAN_DAYS}`}
              </p>
            </div>
            <div className="rounded-[2rem] border border-zinc-200/70 bg-white p-6 shadow-whisper dark:border-white/[0.06] dark:bg-zinc-900">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Plan-Fortschritt</p>
              <p className="mt-1 font-mono text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {progress.percent}%
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress.percent}%` }} />
              </div>
            </div>
            <div className="rounded-[2rem] border border-zinc-200/70 bg-white p-6 shadow-whisper dark:border-white/[0.06] dark:bg-zinc-900">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Prüfung</p>
              {examDays === null ? (
                <label className="mt-2 block">
                  <span className="sr-only">Prüfungstermin</span>
                  <input
                    type="date"
                    value={examInput}
                    onChange={(e) => updateExamDate(e.target.value)}
                    className="h-10 rounded-xl border border-zinc-200 bg-white px-3 font-mono text-sm dark:border-white/10 dark:bg-zinc-800"
                  />
                </label>
              ) : (
                <p className="mt-1 font-mono text-3xl font-extrabold text-rose-700 dark:text-rose-400">
                  {examDays >= 0 ? `${examDays} Tage` : 'vorbei'}
                </p>
              )}
              {examDays !== null && (
                <button
                  type="button"
                  onClick={() => updateExamDate('')}
                  className="mt-2 text-xs font-semibold text-zinc-500 underline dark:text-zinc-400"
                >
                  Termin ändern
                </button>
              )}
            </div>
          </section>

          {missed.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/[0.08] px-5 py-3 text-sm text-amber-900 dark:text-amber-200">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>
                Offen aus früheren Tagen: {missed.map((d) => `Tag ${d}`).join(', ')}. Hol sie nach, sobald du Luft
                hast, die Wiederholung (SRS) hat Vorrang.
              </span>
            </div>
          )}

          <section className="space-y-5 rounded-[2.5rem] border border-zinc-200/70 bg-white p-7 shadow-whisper dark:border-white/[0.06] dark:bg-zinc-900">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Woche {day.week} · Tag {day.day}
                  {viewDay === todayDay && phase === 'active' ? ' · heute' : ''}
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight">{day.theme}</h2>
              </div>
              <div className="flex items-center gap-2">
                {day.exam && <SealBadge sealChar="考" label="PROBEPRÜFUNG" variant="cinnabar" size="sm" />}
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <Clock className="h-3.5 w-3.5" />
                  {day.totalMinutes} Min.
                </span>
              </div>
            </div>

            <ul className="space-y-2.5">
              {day.tasks.map((task) => {
                const done = isTaskDone(task, doneSet, completed);
                return (
                  <li
                    key={task.id}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                      done
                        ? 'border-emerald-500/30 bg-emerald-500/[0.06]'
                        : 'border-zinc-200/80 bg-zinc-50 dark:border-white/10 dark:bg-zinc-800/40'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      aria-label={done ? `${task.label} als offen markieren` : `${task.label} als erledigt markieren`}
                      aria-pressed={done}
                      className="shrink-0 text-emerald-600 dark:text-emerald-400"
                    >
                      {done ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6 text-zinc-400" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${done ? 'text-zinc-500 line-through' : ''}`}>{task.label}</p>
                      {task.detail && <p className="text-xs text-zinc-500 dark:text-zinc-400">{task.detail}</p>}
                    </div>
                    <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{task.minutes} Min.</span>
                    <Link
                      to={task.route}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-500"
                      aria-label={`${task.label} öffnen`}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {day.vocabIds.length > 0 && (
              <p className="flex flex-wrap gap-x-3 gap-y-1 font-cjk text-lg text-zinc-800 dark:text-zinc-100">
                {day.vocabIds.map((id) => {
                  const word = VOCAB.find((v) => v.id === id);
                  return word ? <span key={id}>{word.hanzi}</span> : null;
                })}
              </p>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <Flag className="h-5 w-5 text-emerald-600" />
              Alle 30 Tage
            </h2>
            {PLAN_WEEKS.map((week) => (
              <div key={week.week} className="space-y-2">
                <p className="text-sm">
                  <span className="font-bold">
                    Woche {week.week}: {week.title}
                  </span>{' '}
                  <span className="text-zinc-500 dark:text-zinc-400">{week.goal}</span>
                </p>
                <div className="grid grid-cols-7 gap-2">
                  {PLAN.filter((d) => d.week === week.week).map((d) => {
                    const finished = isDayDone(d, doneSet, completed);
                    const isToday = phase === 'active' && d.day === rawDay;
                    const selected = d.day === viewDay;
                    return (
                      <button
                        key={d.day}
                        type="button"
                        onClick={() => setSelectedDay(d.day)}
                        aria-label={`Tag ${d.day}${finished ? ', erledigt' : ''}`}
                        className={`relative flex h-12 items-center justify-center rounded-xl border font-mono text-sm font-bold transition-colors ${
                          finished
                            ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : 'border-zinc-200/80 bg-white text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200'
                        } ${isToday ? 'ring-2 ring-emerald-500' : ''} ${selected ? 'outline outline-2 outline-zinc-900 dark:outline-zinc-100' : ''}`}
                      >
                        {d.day}
                        {d.exam && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Roter Punkt: Probeprüfung.</p>
          </section>

          <button
            type="button"
            onClick={restartPlan}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 underline dark:text-zinc-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Plan neu starten
          </button>
        </>
      )}
    </div>
  );
}
