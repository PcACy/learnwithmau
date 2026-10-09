import type { ReactNode } from 'react';
import { SealBadge } from './SealBadge';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  sealChar?: string;
  badge?: string;
  actions?: ReactNode;
  variant?: 'cinnabar' | 'jade' | 'stone';
}

export function PageHeader({
  title,
  subtitle,
  sealChar,
  badge,
  actions,
  variant = 'cinnabar',
}: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-2">
        <SealBadge sealChar={sealChar} label={badge} variant={variant} />
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        )}
      </div>
      {actions}
    </header>
  );
}
