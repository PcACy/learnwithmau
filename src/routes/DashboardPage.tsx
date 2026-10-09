import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, CalendarDays, CheckCircle2, Circle, Flame, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { useKeyDown } from '../hooks/useKeyDown';
import { VOCAB } from '../data';
import { selectDueItemIds, selectMastery } from '../lib/srsQuery';
import { getCompletedDialogues, getCompletedGrammar, getCompletedStories, getStudyPlan } from '../lib/db';
import {
  buildPlanDay,
  daysUntilExam,
  getPlanDay,
  getPlanPhase,
  isTaskDone,
  type PlanTask,
  type StudyPlanState,
} from '../lib/studyPlan';
import { PLAN_DAYS } from '../data/studyPlan';
import { filterActiveMistakes } from '../lib/mistakeBank';
import { LESSONS_META, STORIES_META } from '../data/curriculumMeta';
import { pickNextAction } from '../lib/nextAction';
import { levelFromXp } from '../lib/xp';
import { MODES } from '../config/modes';
import { Card } from '../components/ui/Card';
import { HubTile } from '../components/ui/HubTile';
import { KineticButton } from '../components/ui/KineticButton';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ProgressRing } from '../components/ui/ProgressRing';
import { SealBadge } from '../components/ui/SealBadge';

const ALL_ITEM_IDS: readonly string[] = VOCAB.map((item) => item.id);

const SHORTCUT_ROUTES = [
  '/typeracer',
  '/alchemy',
  '/sentences',
  '/number-drill',
  '/ear-trainer',
  '/blitz',
  '/exam',
  '/review',
  '/mistakes',
] as const;

const QUICK_MODE_IDS = ['alchemy', 'ear-trainer', 'sentences', 'dialogue'] as const;

function greeting(now: Date): string {
  const h = now.getHours();
  if (h < 11) return 'Guten Morgen';
  if (h < 18) return 'Hallo';
  return 'Guten Abend';
}

export function DashboardPage() {
  const cards = useProgressStore((s) => s.cards);
  const streak = useProgressStore((s) => s.streak);
  const dailyGoal = useProgressStore((s) => s.dailyGoal);
  const mistakes = useProgressStore((s) => s.mistakes);
  const xp = useProgressStore((s) => s.xp);
  const navigate = useNavigate();

  const [completedGrammar, setCompletedGrammar] = useState<string[]>([]);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [completedDialogueIds, setCompletedDialogueIds] = useState<string[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlanState | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getStudyPlan().then((plan) => {
      if (!cancelled) setStudyPlan(plan);
    });
    void Promise.all([getCompletedGrammar(), getCompletedStories(), getCompletedDialogues()]).then(([g, s, d]) => {
      if (cancelled) return;
      setCompletedDialogueIds(Object.keys(d || {}));
      setCompletedGrammar(g);
      setCompletedStories(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const now = useMemo(() => new Date(), []);
  const dueToday = useMemo(() => selectDueItemIds(cards, ALL_ITEM_IDS, new Date()).length, [cards]);
  const activeMistakesCount = useMemo(() => filterActiveMistakes(mistakes).length, [mistakes]);
  const masteryPercent = Math.round(selectMastery(cards, VOCAB.length) * 100);
  const level = useMemo(() => levelFromXp(xp), [xp]);

  const planToday = useMemo(() => {
    if (!studyPlan) return null;
    const rawDay = getPlanDay(studyPlan.startDate, new Date());
    if (getPlanPhase(rawDay) !== 'active') return null;
    const day = buildPlanDay(rawDay, ALL_ITEM_IDS);
    const doneSet = new Set(studyPlan.doneTasks);
    const content = { grammar: completedGrammar, stories: completedStories, dialogues: completedDialogueIds };
    const tasks = day.tasks.map((task) => ({ task, done: isTaskDone(task, doneSet, content) }));
    return { day, tasks, doneCount: tasks.filter((t) => t.done).length };
  }, [studyPlan, completedGrammar, completedStories, completedDialogueIds]);

  const examCountdown = useMemo(
    () => (studyPlan?.examDate ? daysUntilExam(studyPlan.examDate, new Date()) : null),
    [studyPlan],
  );

  const nextAction = useMemo(() => {
    const open: PlanTask | undefined = planToday?.tasks.find((t) => !t.done)?.task;
    const grammar = LESSONS_META.find((l) => !completedGrammar.includes(l.id));
    const story = STORIES_META.find((s) => !completedStories.includes(s.id));
    return pickNextAction({
      planTask: open,
      dueCount: dueToday,
      mistakeCount: activeMistakesCount,
      nextGrammar: grammar,
      nextStory: story,
    });
  }, [planToday, dueToday, activeMistakesCount, completedGrammar, completedStories]);

  const goalProgress = dailyGoal.targetReviews > 0 ? dailyGoal.completedReviews / dailyGoal.targetReviews : 0;
  const goalReached = goalProgress >= 1;

  // Globale Shortcuts 1-9 auf der Startseite
  useKeyDown((event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    const num = Number.parseInt(event.key, 10);
    if (num >= 1 && num <= SHORTCUT_ROUTES.length) navigate(SHORTCUT_ROUTES[num - 1]);
  });

  const quickModes = QUICK_MODE_IDS.map((id) => MODES.find((m) => m.id === id)).filter(
    (m): m is (typeof MODES)[number] => m !== undefined,
  );

  return (
    <div className="space-y-8 pb-24">
      {/* Begrüßung */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <SealBadge sealChar="汉" label="HEUTE · HSK 1" variant="cinnabar" />
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            {greeting(now)}
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            Trainings-Zentrale
            {planToday ? ` · Tag ${planToday.day.day} von ${PLAN_DAYS}` : ''}
          </p>
        </div>
        {examCountdown !== null && examCountdown >= 0 && (
          <div className="flex items-center gap-2 rounded-full border-2 border-cinnabar-500/40 bg-cinnabar-500/10 px-4 py-2 text-cinnabar-600 dark:text-cinnabar-400">
            <CalendarClock className="h-5 w-5" aria-hidden />
            <span className="font-mono text-sm font-bold">
              {examCountdown === 0 ? 'Prüfung heute' : `Noch ${examCountdown} ${examCountdown === 1 ? 'Tag' : 'Tage'} bis HSK 1`}
            </span>
          </div>
        )}
      </div>

      {/* Hero: Weiter lernen */}
      <section className="bg-hero-jade relative overflow-hidden rounded-[2rem] border-b-[6px] border-jade-800 p-6 sm:p-10">
        <span aria-hidden className="pointer-events-none absolute -bottom-10 -right-4 select-none font-cjk text-[14rem] font-black leading-none text-white/10">
          学
        </span>
        <div className="relative max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {nextAction.kind === 'plan' ? 'Dein Plan für heute' : 'Weiter lernen'}
          </span>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{nextAction.title}</h2>
          <p className="text-base text-white/85">{nextAction.subtitle}</p>
          <KineticButton variant="secondary" onClick={() => navigate(nextAction.to)} className="mt-2">
            {nextAction.cta}
          </KineticButton>
        </div>
      </section>

      {/* Fortschritt */}
      <section aria-label="Dein Fortschritt heute" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="col-span-2 flex items-center gap-4 sm:col-span-1">
          <ProgressRing value={goalProgress} size={72} stroke={8} label="Tagesziel">
            {goalReached ? (
              <CheckCircle2 className="h-7 w-7 text-gold-500" aria-hidden />
            ) : (
              <Target className="h-6 w-6 text-jade-700 dark:text-jade-300" aria-hidden />
            )}
          </ProgressRing>
          <div>
            <p className="font-mono text-2xl font-bold leading-none text-zinc-900 dark:text-zinc-50">
              {dailyGoal.completedReviews}/{dailyGoal.targetReviews}
            </p>
            <p className="mt-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              {goalReached ? 'Tagesziel geschafft' : 'Tagesziel'}
            </p>
          </div>
        </Card>

        <Card className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-2">
            <Flame className={`h-6 w-6 ${streak.current > 0 ? 'fill-gold-500 text-gold-500' : 'text-zinc-400'}`} aria-hidden />
            <span className="font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-50">{streak.current}</span>
          </div>
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {streak.current > 0 ? 'Tage in Folge' : 'Starte heute deine Serie'}
          </p>
        </Card>

        <Card className="flex flex-col justify-center gap-2">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-sm font-bold text-gold-600 dark:text-gold-300">Lv {level.level}</span>
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{level.title}</span>
          </div>
          <ProgressBar value={level.progress} tone="gold" label="Fortschritt zum nächsten Level" />
          <p className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            {level.xpForNext > 0 ? `${level.xpIntoLevel}/${level.xpForNext} XP` : 'Höchste Stufe'}
          </p>
        </Card>

        <Card className="flex flex-col justify-center gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-jade-600" aria-hidden />
            <span className="font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-50">{masteryPercent}%</span>
          </div>
          <ProgressBar value={masteryPercent / 100} label="Meisterschaft" />
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Meisterschaft</p>
        </Card>
      </section>

      {/* Heutige Aufgaben */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Heute auf dem Plan</h2>
          <Link to="/plan" className="text-sm font-bold text-jade-700 hover:underline dark:text-jade-300">
            Zum 30-Tage-Plan
          </Link>
        </div>
        {planToday ? (
          <Card className="space-y-1 !p-2">
            <p className="px-3 pt-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {planToday.day.theme} · {planToday.doneCount}/{planToday.tasks.length} erledigt · {planToday.day.totalMinutes} Min.
            </p>
            <ul>
              {planToday.tasks.map(({ task, done }) => (
                <li key={task.id}>
                  <Link
                    to={task.route}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-paper-tint dark:hover:bg-zinc-800/60"
                  >
                    {done ? (
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-jade-500" aria-hidden />
                    ) : (
                      <Circle className="h-6 w-6 shrink-0 text-zinc-300 dark:text-zinc-600" aria-hidden />
                    )}
                    <span className={`flex-1 text-base font-semibold ${done ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-zinc-50'}`}>
                      {task.label}
                    </span>
                    <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{task.minutes} Min.</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Link to="/plan" className="card-solid btn-chunky flex items-center gap-4 p-5 hover:border-jade-500/50">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-jade-500/15 text-jade-700 dark:text-jade-300">
              <CalendarDays className="h-6 w-6" aria-hidden />
            </span>
            <span>
              <span className="block text-lg font-extrabold text-zinc-900 dark:text-zinc-50">30-Tage-Plan starten</span>
              <span className="block text-sm text-zinc-600 dark:text-zinc-400">
                Jeden Tag klare Aufgaben, bis zur Prüfung.
              </span>
            </span>
          </Link>
        )}
      </section>

      {/* Schnellstart */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Schnell üben</h2>
          <Link to="/practice" className="text-sm font-bold text-jade-700 hover:underline dark:text-jade-300">
            Alle Übungen
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickModes.map((m, i) => (
            <HubTile key={m.id} to={m.path} title={m.title} description={m.tagline} icon={m.icon} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
