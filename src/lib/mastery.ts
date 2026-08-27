import type { SrsCard } from '../types/srs';

export interface MasteryLevelInfo {
  level: number;
  name: string;
  shortName: string;
  badgeClass: string;
  iconColor: string;
  description: string;
}

export const MASTERY_LEVELS: readonly MasteryLevelInfo[] = [
  {
    level: 0,
    name: 'Neu',
    shortName: 'Neu',
    badgeClass: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-white/10',
    iconColor: 'text-zinc-400',
    description: 'Noch ungelernte Vokabel',
  },
  {
    level: 1,
    name: 'Bronze',
    shortName: 'Bronze I',
    badgeClass: 'bg-amber-700/10 text-amber-800 border-amber-700/30 dark:bg-amber-600/15 dark:text-amber-300 dark:border-amber-500/30',
    iconColor: 'text-amber-700 dark:text-amber-400',
    description: 'Im Anfangsstadium (1–3 Tage Intervall)',
  },
  {
    level: 2,
    name: 'Silber',
    shortName: 'Silber II',
    badgeClass: 'bg-slate-400/15 text-slate-700 border-slate-400/30 dark:bg-slate-400/15 dark:text-slate-300 dark:border-slate-400/30',
    iconColor: 'text-slate-400',
    description: 'Festigend (4–10 Tage Intervall)',
  },
  {
    level: 3,
    name: 'Gold',
    shortName: 'Gold III',
    badgeClass: 'bg-yellow-500/15 text-yellow-800 border-yellow-500/40 dark:bg-yellow-500/15 dark:text-yellow-300 dark:border-yellow-500/30',
    iconColor: 'text-yellow-500',
    description: 'Gut verankert (11–25 Tage Intervall)',
  },
  {
    level: 4,
    name: 'Platin',
    shortName: 'Platin IV',
    badgeClass: 'bg-cyan-500/15 text-cyan-800 border-cyan-500/30 dark:bg-cyan-400/15 dark:text-cyan-300 dark:border-cyan-400/30',
    iconColor: 'text-cyan-500 dark:text-cyan-400',
    description: 'Sehr sicher (26–59 Tage Intervall)',
  },
  {
    level: 5,
    name: 'Diamant',
    shortName: 'Meister V',
    badgeClass: 'bg-emerald-500/15 text-emerald-800 border-emerald-500/40 dark:bg-emerald-400/20 dark:text-emerald-300 dark:border-emerald-400/40',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    description: 'Gemeistert im Langzeit-Gedächtnis (60+ Tage Intervall)',
  },
];

export function getMasteryLevel(card: SrsCard | undefined): MasteryLevelInfo {
  if (!card || card.intervalDays <= 0) {
    return MASTERY_LEVELS[0];
  }

  const days = card.intervalDays;
  if (days <= 3) return MASTERY_LEVELS[1];
  if (days <= 10) return MASTERY_LEVELS[2];
  if (days <= 25) return MASTERY_LEVELS[3];
  if (days <= 59) return MASTERY_LEVELS[4];
  return MASTERY_LEVELS[5];
}
