import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { SrsCard } from '../../types/srs';
import { MASTERY_INTERVAL_DAYS } from '../../lib/srs';
import { VOCAB } from '../../data';

interface SrsDistributionProps {
  cards: Record<string, SrsCard>;
}

interface StageInfo {
  id: 'new' | 'learning' | 'review' | 'mastered';
  label: string;
  sublabel: string;
  count: number;
  pct: number;
  colorClass: string;
  dotClass: string;
}

export function SrsDistributionBar({ cards }: SrsDistributionProps) {
  const total = VOCAB.length;
  const [mounted, setMounted] = useState(false);

  // Einmaliger scaleX-Entrance statt width-Animation (transform-only).
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const stages: StageInfo[] = useMemo(() => {
    let newCount = 0;
    let learningCount = 0;
    let reviewCount = 0;
    let masteredCount = 0;

    for (const item of VOCAB) {
      const card = cards[item.id];
      if (!card || (card.intervalDays === 0 && card.repetitions === 0)) {
        newCount++;
      } else if (card.intervalDays <= 6) {
        // SM-2-Startintervalle: 1 und 6 Tage
        learningCount++;
      } else if (card.intervalDays < MASTERY_INTERVAL_DAYS) {
        reviewCount++;
      } else {
        masteredCount++;
      }
    }

    const stageData: Omit<StageInfo, 'pct'>[] = [
      {
        id: 'new',
        label: 'Neu',
        sublabel: 'Ungelernt',
        count: newCount,
        colorClass: 'bg-zinc-300 dark:bg-zinc-700',
        dotClass: 'bg-zinc-400 dark:bg-zinc-600',
      },
      {
        id: 'learning',
        label: 'Lernen',
        sublabel: 'Intervall 1–6 Tage',
        count: learningCount,
        colorClass: 'bg-amber-500',
        dotClass: 'bg-amber-500',
      },
      {
        id: 'review',
        label: 'Festigen',
        sublabel: `Intervall 7–${MASTERY_INTERVAL_DAYS - 1} Tage`,
        count: reviewCount,
        colorClass: 'bg-emerald-500',
        dotClass: 'bg-emerald-500',
      },
      {
        id: 'mastered',
        label: 'Gemeistert',
        sublabel: `Intervall ${MASTERY_INTERVAL_DAYS}+ Tage`,
        count: masteredCount,
        colorClass: 'bg-teal-600 dark:bg-teal-400',
        dotClass: 'bg-teal-600 dark:bg-teal-400',
      },
    ];

    return stageData.map((s) => ({
      ...s,
      pct: total > 0 ? (s.count / total) * 100 : 0,
    }));
  }, [cards, total]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            SRS-Gedächtnisstufen
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Verteilung aller {total} HSK-1-Vokabeln nach SM-2-Intervall
          </p>
        </div>
        <p className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
          {total - (stages[0]?.count ?? 0)} / {total} im Lernzyklus
        </p>
      </div>

      {/* Segmented Progress Bar */}
      <div
        role="progressbar"
        aria-label="SRS-Stufenverteilung"
        className="flex h-3.5 w-full overflow-hidden rounded-full bg-zinc-100 p-0.5 shadow-inner dark:bg-zinc-950/60"
      >
        {stages.map((stage) => {
          if (stage.count === 0) return null;
          return (
            <div
              key={stage.id}
              style={{ width: `${stage.pct}%` } as CSSProperties}
              title={`${stage.label}: ${stage.count} (${Math.round(stage.pct)}%)`}
              className="relative h-full first:rounded-l-full last:rounded-r-full"
            >
              <div
                className={`absolute inset-0 origin-left rounded-sm transition-transform duration-700 ease-[var(--ease-spring)] ${stage.colorClass} ${
                  mounted ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Legend & Stats */}
      <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="flex flex-col rounded-2xl border border-zinc-200/60 bg-zinc-50/70 p-3 dark:border-white/[0.04] dark:bg-zinc-950/40"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <span className={`h-2 w-2 rounded-full ${stage.dotClass}`} aria-hidden />
              <span>{stage.label}</span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between gap-2">
              <span className="font-mono text-xl font-bold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-100">
                {stage.count}
              </span>
              <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
                {Math.round(stage.pct)}%
              </span>
            </div>
            <span className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
              {stage.sublabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
