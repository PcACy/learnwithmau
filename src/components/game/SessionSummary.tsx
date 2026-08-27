import { Link } from 'react-router-dom';
import { useKeyDown } from '../../hooks/useKeyDown';

interface SessionSummaryProps {
  headline: string;
  stats: { label: string; value: string }[];
  onRestart(): void;
  restartLabel?: string;
}

export function SessionSummary({ headline, stats, onRestart, restartLabel = 'Nochmal üben' }: SessionSummaryProps) {
  useKeyDown((event) => {
    if (event.key === 'Enter') onRestart();
  });

  return (
    <div className="reveal mx-auto max-w-xl py-8">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
        Session beendet
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{headline}</h2>

      <dl className="mt-8 grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[1.5rem] border border-zinc-200/70 bg-white p-4 shadow-whisper dark:border-white/[0.06] dark:bg-zinc-900"
          >
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </dt>
            <dd className="mt-2 font-mono text-2xl font-bold tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex h-12 items-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition-all duration-200 ease-[var(--ease-spring)] hover:bg-emerald-500 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          {restartLabel}
        </button>
        <Link
          to="/"
          className="inline-flex h-12 items-center rounded-xl border border-zinc-300/80 px-6 text-sm font-semibold text-zinc-700 transition-all duration-200 ease-[var(--ease-spring)] hover:border-zinc-400 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-white/10 dark:text-zinc-200 dark:hover:border-white/25"
        >
          Zum Dashboard
        </Link>
      </div>
      <p className="mt-6 flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
        Alle Ergebnisse sind bereits in deinen SRS-Fortschritt eingeflossen.
      </p>
    </div>
  );
}
