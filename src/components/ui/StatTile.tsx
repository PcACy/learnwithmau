import type { ReactNode } from 'react';
import { Card } from './Card';

export interface StatTileProps {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  className?: string;
}

export function StatTile({ icon, value, label, className = '' }: StatTileProps) {
  return (
    <Card className={`flex items-center gap-3 !p-4 ${className}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-jade-500/15 text-jade-700 dark:text-jade-300">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-mono text-2xl font-bold leading-none text-zinc-900 dark:text-zinc-50">{value}</p>
        <p className="mt-1 truncate text-xs font-semibold text-zinc-600 dark:text-zinc-400">{label}</p>
      </div>
    </Card>
  );
}
