import type { HTMLAttributes, ReactNode } from 'react';

export interface SealBadgeProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  label?: string;
  sealChar?: string;
  variant?: 'cinnabar' | 'jade' | 'stone';
  size?: 'sm' | 'md';
}

export function SealBadge({
  children,
  label,
  sealChar = '印',
  variant = 'cinnabar',
  size = 'md',
  className = '',
  ...props
}: SealBadgeProps) {
  const isCinnabar = variant === 'cinnabar';
  const isJade = variant === 'jade';

  const borderAndBg = isCinnabar
    ? 'border-cinnabar-500/70 bg-cinnabar-500/10 text-cinnabar-600 dark:border-cinnabar-400/60 dark:bg-cinnabar-500/15 dark:text-cinnabar-400'
    : isJade
      ? 'border-jade-600/70 bg-jade-600/10 text-jade-800 dark:border-jade-500/60 dark:bg-jade-500/15 dark:text-jade-300'
      : 'border-zinc-400/60 bg-zinc-400/[0.08] text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800/40 dark:text-zinc-300';

  const sizeStyle = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-[4px] border-[1.5px] font-mono font-bold tracking-wider select-none ${borderAndBg} ${sizeStyle} ${className}`}
      {...props}
    >
      <span className="font-cjk font-bold leading-none opacity-90">{sealChar}</span>
      {label && <span>{label}</span>}
      {children}
    </div>
  );
}
