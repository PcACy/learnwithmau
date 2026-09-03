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
    ? 'border-rose-600/70 bg-rose-600/[0.08] text-rose-700 dark:border-rose-500/60 dark:bg-rose-500/[0.12] dark:text-rose-400'
    : isJade
      ? 'border-emerald-600/70 bg-emerald-600/[0.08] text-emerald-800 dark:border-emerald-500/60 dark:bg-emerald-500/[0.12] dark:text-emerald-300'
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
