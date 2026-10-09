import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTE_PRELOAD_MAP } from '../../routes/lazyRoutes';

const TONES = [
  'bg-jade-500/15 text-jade-700 dark:text-jade-300',
  'bg-gold-500/20 text-gold-600 dark:text-gold-300',
  'bg-cinnabar-500/15 text-cinnabar-600 dark:text-cinnabar-400',
] as const;

export interface HubTileProps {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Index für die Farbrotation. */
  index: number;
  /** Kleines Info-Etikett, z. B. „12 fällig“. */
  tag?: string;
}

export function HubTile({ to, title, description, icon: Icon, index, tag }: HubTileProps) {
  const preload = () => void ROUTE_PRELOAD_MAP[to]?.();
  return (
    <Link
      to={to}
      onMouseEnter={preload}
      onFocus={preload}
      onTouchStart={preload}
      className="card-solid btn-chunky group flex items-center gap-4 p-4 transition-colors hover:border-jade-500/50 sm:p-5"
    >
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${TONES[index % TONES.length]}`}
      >
        <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </span>
          {tag && (
            <span className="shrink-0 rounded-full bg-cinnabar-500 px-2 py-0.5 font-mono text-[11px] font-bold text-white">
              {tag}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-sm text-zinc-600 dark:text-zinc-400">{description}</span>
      </span>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
