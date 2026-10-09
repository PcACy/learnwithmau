import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, RotateCcw, TrendingUp } from 'lucide-react';
import { useKeyDown } from '../../hooks/useKeyDown';
import { ACHIEVEMENTS } from '../../config/achievements';
import { levelFromXp } from '../../lib/xp';
import { useProgressStore } from '../../store/progressStore';
import { KineticButton } from '../ui/KineticButton';
import { ProgressBar } from '../ui/ProgressBar';
import { SealBadge } from '../ui/SealBadge';

interface SessionSummaryProps {
  headline: string;
  stats: { label: string; value: string }[];
  onRestart(): void;
  restartLabel?: string;
  onSecondaryAction?: () => void;
  secondaryLabel?: string;
}

/** Belohnungen, die älter als dieses Fenster vor dem Öffnen sind, gehören zu einer früheren Session. */
const REWARD_WINDOW_MS = 15_000;

export function SessionSummary({
  headline,
  stats,
  onRestart,
  restartLabel = 'Nochmal üben',
  onSecondaryAction,
  secondaryLabel = 'Zur Trainings-Zentrale',
}: SessionSummaryProps) {
  const navigate = useNavigate();
  const [mountedAt] = useState(() => Date.now());
  const xp = useProgressStore((s) => s.xp);
  const lastReward = useProgressStore((s) => s.lastReward);

  const reward = lastReward && lastReward.at >= mountedAt - REWARD_WINDOW_MS ? lastReward : null;
  const level = useMemo(() => levelFromXp(xp), [xp]);
  const unlocked = useMemo(
    () => (reward ? ACHIEVEMENTS.filter((a) => reward.unlocked.includes(a.id)) : []),
    [reward],
  );

  useKeyDown((event) => {
    if (event.key === 'Enter') onRestart();
  });

  return (
    <div className="mx-auto max-w-2xl space-y-5 py-8">
      <section className="bg-hero-jade relative overflow-hidden rounded-[2rem] border-b-[6px] border-jade-800 p-6 sm:p-10">
        <span aria-hidden className="pointer-events-none absolute -bottom-10 -right-2 select-none font-cjk text-[12rem] font-black leading-none text-white/10">
          胜
        </span>
        <div className="relative space-y-3">
          <SealBadge sealChar="胜" label="SESSION VOLLENDET" variant="cinnabar" className="bg-white/90" />
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{headline}</h2>
          {reward && reward.xpGained > 0 && (
            <p className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-4 py-1.5 font-mono text-lg font-black text-ink">
              <TrendingUp className="h-5 w-5" aria-hidden />+{reward.xpGained} XP
            </p>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card-solid p-4 text-center">
            <dt className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              {stat.label}
            </dt>
            <dd className="mt-2 font-mono text-3xl font-black tabular-nums text-zinc-900 dark:text-zinc-50">
              {stat.value}
            </dd>
          </div>
        ))}
      </div>

      {reward && (
        <div className="card-solid space-y-3 p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">
              {reward.levelAfter > reward.levelBefore ? `Level ${level.level} erreicht` : `Level ${level.level}: ${level.title}`}
            </p>
            <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
              {level.xpForNext > 0 ? `${level.xpIntoLevel}/${level.xpForNext} XP` : 'Höchste Stufe'}
            </p>
          </div>
          <ProgressBar value={level.progress} tone="gold" label="Fortschritt zum nächsten Level" />
        </div>
      )}

      {unlocked.length > 0 && (
        <div className="card-solid space-y-3 p-5">
          <p className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">Neu freigeschaltet</p>
          <ul className="space-y-2">
            {unlocked.map((a) => (
              <li key={a.id} className="flex items-center gap-3">
                <span className="bg-hero-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <Award className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-bold text-zinc-900 dark:text-zinc-50">{a.title}</span>
                  <span className="block text-xs text-zinc-600 dark:text-zinc-400">{a.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <KineticButton
          variant="primary"
          onClick={onRestart}
          shortcut="[Enter]"
          icon={<RotateCcw className="h-4 w-4" />}
        >
          {restartLabel}
        </KineticButton>

        <KineticButton
          variant="secondary"
          onClick={onSecondaryAction ?? (() => navigate('/'))}
          shortcut="[Esc]"
        >
          {secondaryLabel}
        </KineticButton>
      </div>
    </div>
  );
}
