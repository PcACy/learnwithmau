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
    'btn-chunky group relative inline-flex items-center justify-between gap-3.5 rounded-full border-2 pl-6 pr-2 py-2 text-base font-extrabold transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

  const variantStyle = isPrimary
    ? 'bg-jade-500 hover:bg-jade-400 border-jade-700 text-white'
    : isCinnabar
      ? 'bg-cinnabar-500 hover:bg-cinnabar-400 border-cinnabar-600 text-white'
      : 'bg-white hover:bg-paper-tint text-zinc-900 border-paper-tint dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100';

  const innerCircleBg =
    isPrimary || isCinnabar
      ? 'bg-white/25 text-white'
      : 'bg-paper-tint text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200';

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
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 ${innerCircleBg}`}
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
