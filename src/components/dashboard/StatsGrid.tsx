import type { CSSProperties, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Flame, ListChecks, Target, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { VOCAB } from '../../data';
import { selectDueItemIds, selectMastery } from '../../lib/srsQuery';
import { useProgressStore } from '../../store/progressStore';

const ALL_ITEM_IDS: readonly string[] = VOCAB.map((item) => item.id);

const CARD =
  'rounded-[2rem] border border-zinc-200/70 bg-white p-6 shadow-whisper dark:border-white/[0.06] dark:bg-zinc-900 dark:shadow-none';

interface TileProps {
  icon: LucideIcon;
  label: string;
  index: number;
  className?: string;
  /** Setzt die gesamte Kachel als Link (z.B. Fällig-heute → Drill). */
  href?: string;
  children: ReactNode;
}

function Tile({ icon: Icon, label, index, className = '', href, children }: TileProps) {
  const inner = (
    <>
      <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </span>
        {label}
      </div>
      <div className="mt-4">{children}</div>
    </>
  );

  const base = `reveal ${CARD} ${className}`;

  if (href) {
    return (
      <Link
        to={href}
        title="Jetzt fällige Karten wiederholen"
        className={`${base} block transition-colors duration-200 hover:border-emerald-600/45 dark:hover:border-emerald-400/35`}
        style={{ '--index': index } as CSSProperties}
      >
        {inner}
      </Link>
    );
  }

  return (
    <section className={base} style={{ '--index': index } as CSSProperties}>
      {inner}
    </section>
  );
}

export function StatsGrid() {
  const cards = useProgressStore((s) => s.cards);
  const streak = useProgressStore((s) => s.streak);
  const dailyGoal = useProgressStore((s) => s.dailyGoal);

  const dueToday = useMemo(
    () => selectDueItemIds(cards, ALL_ITEM_IDS, new Date()).length,
    [cards],
  );
  const mastery = selectMastery(cards, VOCAB.length);
  const goalRatio = Math.min(dailyGoal.completedReviews / dailyGoal.targetReviews, 1);
  const goalReached = goalRatio >= 1;
  const masteryPercent = Math.round(mastery * 100);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-6">
      <Tile icon={Flame} label="Streak" index={0} className="lg:col-span-2">
        <p className="font-mono text-3xl font-bold tracking-tight tabular-nums">{streak.current}</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Tage Serie · Rekord {streak.longest}</p>
      </Tile>

      <Tile icon={Target} label="Tagesziel" index={1} className="lg:col-span-4">
        <div className="flex items-end justify-between gap-4">
          <p className="font-mono text-3xl font-bold tracking-tight tabular-nums">
            {dailyGoal.completedReviews}
            <span className="text-base font-medium text-zinc-400 dark:text-zinc-500"> / {dailyGoal.targetReviews}</span>
          </p>
          {goalReached && (
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Erreicht
            </span>
          )}
        </div>
        <div
          role="progressbar"
          aria-valuenow={dailyGoal.completedReviews}
          aria-valuemin={0}
          aria-valuemax={dailyGoal.targetReviews}
          aria-label="Tagesziel-Fortschritt"
          className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800"
        >
          <div
            className={`h-full w-full origin-left rounded-full transition-transform duration-700 ease-[var(--ease-spring)] ${
              goalReached ? 'bg-emerald-500' : 'bg-emerald-600/80'
            }`}
            style={{ transform: `scaleX(${goalRatio})` }}
          />
        </div>
      </Tile>

      <Tile icon={ListChecks} label="Fällig heute" index={2} className="lg:col-span-4" href="/review">
        <p className="font-mono text-3xl font-bold tracking-tight tabular-nums">{dueToday}</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Wiederholungen offen von {VOCAB.length} HSK-1-Einträgen
        </p>
      </Tile>

      <Tile icon={TrendingUp} label="Mastery" index={3} className="lg:col-span-2">
        <p className="font-mono text-3xl font-bold tracking-tight tabular-nums">{masteryPercent}%</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Langzeit-Gedächtnis</p>
        <div
          role="progressbar"
          aria-valuenow={masteryPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Mastery-Fortschritt"
          className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800"
        >
          <div
            className="h-full w-full origin-left rounded-full bg-emerald-600/80 transition-transform duration-700 ease-[var(--ease-spring)]"
            style={{ transform: `scaleX(${mastery})` }}
          />
        </div>
      </Tile>
    </div>
  );
}
