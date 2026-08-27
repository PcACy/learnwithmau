import { useMemo, useState } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import type { Radical } from '../../types/vocab';

interface RadicalWithCount {
  radical: Radical;
  count: number;
}

interface RadicalFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  radicalsWithCount: RadicalWithCount[];
  selectedRadicalId: string | null;
  onSelectRadical: (radicalId: string | null) => void;
}

export function RadicalFilterModal({
  isOpen,
  onClose,
  radicalsWithCount,
  selectedRadicalId,
  onSelectRadical,
}: RadicalFilterModalProps) {
  const [search, setSearch] = useState('');
  const [strokeFilter, setStrokeFilter] = useState<number | 'all'>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return radicalsWithCount.filter(({ radical }) => {
      if (strokeFilter !== 'all' && radical.strokes !== strokeFilter) {
        if (strokeFilter === 4 && radical.strokes < 4) return false;
        if (strokeFilter !== 4 && radical.strokes !== strokeFilter) return false;
      }
      if (!q) return true;
      return (
        radical.hanzi.includes(q) ||
        radical.meaning.toLowerCase().includes(q) ||
        radical.pinyin.toLowerCase().includes(q) ||
        radical.forms.some((f) => f.includes(q))
      );
    });
  }, [radicalsWithCount, search, strokeFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl border border-zinc-200/80 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 p-5 dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Radikal-Katalog</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {radicalsWithCount.length} Radikale im HSK-1-Wortschatz
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search & Stroke Filters */}
        <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 dark:border-white/[0.08]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Radikal suchen (z. B. Wasser, Holz, mu)..."
              className="h-10 w-full rounded-xl border border-zinc-200/80 bg-zinc-50 pl-10 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-zinc-950/50 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Nach Strichanzahl filtern">
            <span className="text-xs font-semibold text-zinc-400">Striche:</span>
            {[
              { label: 'Alle', val: 'all' as const },
              { label: '1 Strich', val: 1 },
              { label: '2 Striche', val: 2 },
              { label: '3 Striche', val: 3 },
              { label: '4+ Striche', val: 4 },
            ].map((tab) => (
              <button
                key={String(tab.val)}
                type="button"
                onClick={() => setStrokeFilter(tab.val)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  strokeFilter === tab.val
                    ? 'bg-emerald-500/15 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-300 font-semibold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Radical Cards Grid */}
        <div className="grid max-h-[50vh] grid-cols-2 gap-2 overflow-y-auto p-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map(({ radical, count }) => {
            const isSelected = selectedRadicalId === radical.id;
            return (
              <button
                key={radical.id}
                type="button"
                onClick={() => {
                  onSelectRadical(isSelected ? null : radical.id);
                  onClose();
                }}
                className={`flex items-start gap-2.5 rounded-2xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-whisper dark:border-emerald-400'
                    : 'border-zinc-200/80 bg-zinc-50/50 hover:border-emerald-500/40 hover:bg-zinc-100/60 dark:border-white/[0.08] dark:bg-zinc-950/40 dark:hover:bg-zinc-800/60'
                }`}
              >
                <span className="font-cjk flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl font-bold shadow-whisper dark:bg-zinc-800 dark:text-zinc-100">
                  {radical.hanzi}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {radical.pinyin}
                    </span>
                    <span className="rounded-full bg-zinc-200/70 px-1.5 py-0.2 font-mono text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {count}×
                    </span>
                  </div>
                  <p className="truncate text-[11px] text-zinc-600 dark:text-zinc-300">{radical.meaning}</p>
                  {radical.forms.length > 0 && (
                    <p className="font-cjk truncate text-[10px] text-zinc-400">
                      Formen: {radical.forms.join(', ')}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 p-4 dark:border-white/[0.08]">
          {selectedRadicalId ? (
            <button
              type="button"
              onClick={() => {
                onSelectRadical(null);
                onClose();
              }}
              className="text-xs font-semibold text-red-600 hover:underline dark:text-red-400"
            >
              Radikal-Filter aufheben
            </button>
          ) : (
            <span className="text-xs text-zinc-400">Klicke auf ein Radikal, um die Liste zu filtern</span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
}
