import type { ReactNode } from 'react';

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-zinc-300/80 bg-white px-1.5 font-mono text-[11px] font-medium text-zinc-600 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
      {children}
    </kbd>
  );
}

export function KeyHints({ hints }: { hints: [ReactNode, string][] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
      {hints.map(([key, label]) => (
        <span key={label} className="inline-flex items-center gap-1.5">
          <Kbd>{key}</Kbd>
          {label}
        </span>
      ))}
    </div>
  );
}
