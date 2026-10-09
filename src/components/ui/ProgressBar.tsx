export interface ProgressBarProps {
  /** 0..1 */
  value: number;
  tone?: 'jade' | 'gold' | 'cinnabar';
  className?: string;
  label?: string;
}

const FILL = {
  jade: 'bg-jade-500',
  gold: 'bg-gold-500',
  cinnabar: 'bg-cinnabar-500',
} as const;

export function ProgressBar({ value, tone = 'jade', className = '', label }: ProgressBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
      className={`h-3 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${FILL[tone]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
