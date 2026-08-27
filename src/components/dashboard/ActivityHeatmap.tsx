import { useEffect, useMemo, useState } from 'react';
import type { SessionStat } from '../../types/game';
import { db } from '../../lib/db';
import { useProgressStore } from '../../store/progressStore';
import { toDateKey } from '../../lib/srs';

const DAYS_TO_SHOW = 63; // 9 full weeks (Monday to Sunday)
const WEEKDAY_LABELS = ['Mo', '', 'Mi', '', 'Fr', '', 'So'];

interface DayCell {
  date: Date;
  dateKey: string;
  dayOfWeek: number; // 0 = Mon, 6 = Sun
  answeredCount: number;
  sessionCount: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function ActivityHeatmap() {
  const [sessions, setSessions] = useState<SessionStat[]>([]);
  const [hoveredDay, setHoveredDay] = useState<DayCell | null>(null);

  const dailyGoal = useProgressStore((s) => s.dailyGoal);

  // Load session history from Dexie
  useEffect(() => {
    let active = true;
    db.stats
      .toArray()
      .then((records) => {
        if (active) {
          setSessions(records);
        }
      })
      .catch(() => {
        // Fallback gracefully on read error
      });

    return () => {
      active = false;
    };
  }, []);

  const { weeks, activeDaysCount, totalAnswersPeriod } = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Map sessions to LOCAL dateKey (finishedAt ist ISO/UTC – sonst wandern
    // Abendsessions in den falschen Tag).
    const answersByDate: Record<string, { answered: number; count: number }> = {};
    for (const session of sessions) {
      if (!session.finishedAt) continue;
      const key = toDateKey(new Date(session.finishedAt));
      if (!answersByDate[key]) {
        answersByDate[key] = { answered: 0, count: 0 };
      }
      answersByDate[key].answered += session.answered ?? 0;
      answersByDate[key].count += 1;
    }

    // Also include today's goal reviews if today has active reviews
    const todayKey = toDateKey(today);
    if (dailyGoal.date === todayKey && dailyGoal.completedReviews > 0) {
      if (!answersByDate[todayKey]) {
        answersByDate[todayKey] = { answered: dailyGoal.completedReviews, count: 1 };
      } else {
        answersByDate[todayKey].answered = Math.max(answersByDate[todayKey].answered, dailyGoal.completedReviews);
      }
    }

    // Align end of grid with end of current week (Sunday)
    // In JS: 0 = Sun, 1 = Mon ... 6 = Sat
    // Convert to Monday = 0 ... Sunday = 6
    const todayDayOfWeek = (today.getDay() + 6) % 7;
    const daysUntilSunday = 6 - todayDayOfWeek;

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + daysUntilSunday);

    const cells: DayCell[] = [];
    let activeCount = 0;
    let totalAnswers = 0;

    for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(d.getDate() - i);
      const key = toDateKey(d);
      const isFuture = d.getTime() > today.getTime();

      const dayOfWeek = (d.getDay() + 6) % 7;
      const data = !isFuture ? answersByDate[key] : undefined;

      const answered = data?.answered ?? 0;
      const sessionCount = data?.count ?? 0;

      if (answered > 0) {
        activeCount++;
        totalAnswers += answered;
      }

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (answered >= 30) level = 4;
      else if (answered >= 15) level = 3;
      else if (answered >= 6) level = 2;
      else if (answered >= 1) level = 1;

      cells.push({
        date: d,
        dateKey: key,
        dayOfWeek,
        answeredCount: answered,
        sessionCount,
        level: isFuture ? 0 : level,
      });
    }

    // Group into columns of 7 days (Monday..Sunday)
    const groupedWeeks: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      groupedWeeks.push(cells.slice(i, i + 7));
    }

    return {
      weeks: groupedWeeks,
      activeDaysCount: activeCount,
      totalAnswersPeriod: totalAnswers,
    };
  }, [sessions, dailyGoal]);

  const levelColorClass = (level: 0 | 1 | 2 | 3 | 4, isToday: boolean): string => {
    const todayRing = isToday ? 'ring-2 ring-emerald-500/80 dark:ring-emerald-400' : '';
    switch (level) {
      case 1:
        return `bg-emerald-200 dark:bg-emerald-950 border border-emerald-300/60 dark:border-emerald-800/60 ${todayRing}`;
      case 2:
        return `bg-emerald-400 dark:bg-emerald-700 border border-emerald-400/80 ${todayRing}`;
      case 3:
        return `bg-emerald-500 dark:bg-emerald-600 ${todayRing}`;
      case 4:
        return `bg-emerald-600 dark:bg-emerald-500 ${todayRing}`;
      default:
        return `bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200/50 dark:border-white/[0.04] ${todayRing}`;
    }
  };

  const todayKey = toDateKey(new Date());

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Aktivitäts-Heatmap
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Deine täglichen Lerneinheiten & Reviews der letzten 9 Wochen
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 dark:text-zinc-500">
          <span>
            <strong className="font-semibold text-zinc-700 dark:text-zinc-300">{activeDaysCount}</strong>/60 Tage aktiv
          </span>
          <span>·</span>
          <span>
            <strong className="font-semibold text-zinc-700 dark:text-zinc-300">{totalAnswersPeriod}</strong> Fragen
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-[28rem] items-center gap-3">
          {/* Weekday Row Labels */}
          <div className="grid grid-rows-7 gap-1 text-[10px] font-mono font-medium text-zinc-400 dark:text-zinc-500">
            {WEEKDAY_LABELS.map((label, i) => (
              <span key={i} className="flex h-3.5 w-4 items-center justify-start">
                {label}
              </span>
            ))}
          </div>

          {/* Week Columns */}
          <div className="flex gap-1.5">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-rows-7 gap-1">
                {week.map((cell) => {
                  const isToday = cell.dateKey === todayKey;
                  return (
                    <button
                      key={cell.dateKey}
                      type="button"
                      onMouseEnter={() => setHoveredDay(cell)}
                      onMouseLeave={() => setHoveredDay((cur) => (cur?.dateKey === cell.dateKey ? null : cur))}
                      onFocus={() => setHoveredDay(cell)}
                      onBlur={() => setHoveredDay((cur) => (cur?.dateKey === cell.dateKey ? null : cur))}
                      aria-label={`${cell.dateKey}: ${cell.answeredCount} Einheiten`}
                      className={`h-3.5 w-3.5 rounded-[4px] transition-all duration-150 ease-out hover:scale-125 hover:z-10 focus-visible:outline-2 focus-visible:outline-emerald-500 ${levelColorClass(
                        cell.level,
                        isToday,
                      )}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Tooltip bar */}
      <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs dark:border-white/[0.04]">
        <div className="min-h-[1.25rem] text-zinc-600 dark:text-zinc-300">
          {hoveredDay ? (
            <span className="flex items-center gap-2">
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {hoveredDay.date.toLocaleDateString('de-DE', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
                :
              </span>
              <span>
                {hoveredDay.answeredCount > 0
                  ? `${hoveredDay.answeredCount} Fragen (${hoveredDay.sessionCount} Session${hoveredDay.sessionCount === 1 ? '' : 's'})`
                  : 'Keine Aktivität'}
              </span>
            </span>
          ) : (
            <span className="text-zinc-400 dark:text-zinc-500">
              Bewege den Cursor über ein Feld für Details
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
          <span>Weniger</span>
          <span className="h-2.5 w-2.5 rounded-[2px] bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200/50 dark:border-white/[0.04]" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-200 dark:bg-emerald-950" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-400 dark:bg-emerald-700" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-500 dark:bg-emerald-600" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-600 dark:bg-emerald-500" />
          <span>Mehr</span>
        </div>
      </div>
    </div>
  );
}
