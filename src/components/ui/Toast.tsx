import { useEffect } from 'react';
import { Award, Flame, Target, TrendingUp, X } from 'lucide-react';
import { useToastStore, type Toast, type ToastKind } from '../../store/toastStore';

const DURATION_MS = 5000;

const KIND_STYLE: Record<ToastKind, { icon: typeof Award; tile: string }> = {
  achievement: { icon: Award, tile: 'bg-hero-gold' },
  level: { icon: TrendingUp, tile: 'bg-hero-jade' },
  goal: { icon: Target, tile: 'bg-hero-jade' },
  info: { icon: Flame, tile: 'bg-cinnabar-500 text-white' },
};

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const { icon: Icon, tile } = KIND_STYLE[toast.kind];

  useEffect(() => {
    const t = window.setTimeout(() => dismiss(toast.id), DURATION_MS);
    return () => window.clearTimeout(t);
  }, [toast.id, dismiss]);

  return (
    <div
      role="status"
      className="card-solid animate-pop-in pointer-events-auto flex items-center gap-3 p-3 pr-2 shadow-whisper"
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tile}`}>
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold text-zinc-900 dark:text-zinc-50">{toast.title}</p>
        {toast.body && (
          <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">{toast.body}</p>
        )}
      </div>
      <button
        type="button"
        aria-label="Schließen"
        onClick={() => dismiss(toast.id)}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-zinc-500 hover:bg-paper-tint dark:hover:bg-zinc-800"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-50 mx-auto flex w-full max-w-sm flex-col gap-2 px-4">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
