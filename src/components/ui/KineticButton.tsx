import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

export interface KineticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
  variant?: 'primary' | 'secondary' | 'cinnabar';
  isLoading?: boolean;
}

export function KineticButton({
  children,
  icon,
  shortcut,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: KineticButtonProps) {
  const isPrimary = variant === 'primary';
  const isCinnabar = variant === 'cinnabar';

  const baseStyle =
    'group relative inline-flex items-center justify-between gap-3.5 rounded-full pl-5 pr-1.5 py-1.5 text-sm font-bold shadow-whisper transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

  const variantStyle = isPrimary
    ? 'bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500'
    : isCinnabar
      ? 'bg-rose-700 hover:bg-rose-600 text-white'
      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200/80 dark:border-white/10 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 dark:text-zinc-100';

  const innerCircleBg =
    isPrimary || isCinnabar
      ? 'bg-white/20 text-white'
      : 'bg-zinc-200/80 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200';

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      <span className="flex items-center gap-2">
        {children}
        {shortcut && (
          <span className="rounded-full bg-black/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-inherit dark:bg-white/10">
            {shortcut}
          </span>
        )}
      </span>

      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 ${innerCircleBg}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          icon ?? <ArrowRight className="h-4 w-4" />
        )}
      </span>
    </button>
  );
}
