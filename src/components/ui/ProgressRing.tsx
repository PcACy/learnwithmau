import type { ReactNode } from 'react';

export interface ProgressRingProps {
  /** 0..1 */
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  className?: string;
  label?: string;
}

export function ProgressRing({
  value,
  size = 64,
  stroke = 7,
  children,
  className = '',
  label,
}: ProgressRingProps) {
  const clamped = Math.min(1, Math.max(0, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
      aria-label={label}
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-black/10 dark:stroke-white/15"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
          className={`transition-[stroke-dashoffset] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            clamped >= 1 ? 'stroke-gold-500' : 'stroke-jade-500'
          }`}
        />
      </svg>
      {children && (
        <span className="absolute inset-0 flex items-center justify-center">{children}</span>
      )}
    </div>
  );
}
