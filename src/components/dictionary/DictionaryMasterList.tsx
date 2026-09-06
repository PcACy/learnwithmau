import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import type { VocabItem } from '../../types/vocab';
import { PART_OF_SPEECH_LABELS, PART_OF_SPEECH_MAP } from '../../data/vocabDetails';

interface DictionaryMasterListProps {
  items: VocabItem[];
  allItemsCount: number;
  selectedId: string;
  onSelect(id: string): void;
  query: string;
  onQueryChange(q: string): void;
  selectedCategory: string;
  onCategoryChange(cat: string): void;
  page?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function DictionaryMasterList({
  items,
  allItemsCount,
  selectedId,
  onSelect,
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  inputRef,
}: DictionaryMasterListProps) {
  const activeItemRef = useRef<HTMLDivElement | null>(null);

  const categories = [
    { id: 'all', label: `ALLE ${allItemsCount}`, cn: '全' },
    { id: 'nomen', label: 'NOMEN (名)', cn: '名' },
    { id: 'verb', label: 'VERBEN (动)', cn: '动' },
    { id: 'adjektiv', label: 'ADJEKTIVE (形)', cn: '形' },
    { id: 'pronomen', label: 'PRONOMEN (代)', cn: '代' },
    { id: 'zahl', label: 'ZAHLEN (数)', cn: '数' },
    { id: 'partikel', label: 'PARTIKELN (助)', cn: '助' },
  ];

  // Automatisches sanftes Scrollen zum aktiven Element
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedId]);

  return (
    <div className="space-y-3.5">
      {/* 1. Suchleiste */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Suchen (Hanzi, Pinyin, Definition, z.B. 'hǎo', '好', /)"
          aria-label="Suchen"
          className="h-11 w-full rounded-2xl border border-zinc-200/80 bg-white pl-10 pr-12 text-xs font-medium text-zinc-900 shadow-xs transition-all placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/15 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400">
            /
          </span>
        )}
      </div>

      {/* 2. Kategorie-Filter-Pills mit weichem Gradient-Fade */}
      <div className="relative">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none [mask-image:linear-gradient(to_right,black_88%,transparent_100%)]">
          {categories.map((cat) => {
            const isSel = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`shrink-0 rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-150 ${
                  isSel
                    ? 'bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-zinc-950'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trefferzähler & Schnellauswahl */}
      <div className="flex items-center justify-between px-1 text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
        <span>
          {items.length} {items.length === 1 ? 'Vokabel' : 'Vokabeln'}
        </span>
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            className="text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>

      {/* 3. Flüssig scrollbare Vokabelliste */}
      <div className="max-h-[calc(100vh-14.5rem)] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {items.map((item, idx) => {
          const isSelected = item.id === selectedId;
          const pos = PART_OF_SPEECH_MAP[item.id] || 'nomen';
          const posInfo = PART_OF_SPEECH_LABELS[pos] || { short: 'Wort' };
          const hskTag = `#${String(idx + 1).padStart(2, '0')}`;

          return (
            <div
              key={item.id}
              ref={isSelected ? activeItemRef : null}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(item.id);
                }
              }}
              className={`group relative flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-2.5 sm:p-3 transition-all duration-150 ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-500/[0.04] shadow-whisper ring-1 ring-emerald-600/30 dark:border-emerald-500 dark:bg-emerald-500/[0.08]'
                  : 'border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-xs dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/20'
              }`}
            >
              {/* Aktiver Akzentstreifen links */}
              {isSelected && (
                <span className="absolute -left-[1px] bottom-2.5 top-2.5 w-1 rounded-r-full bg-emerald-600 dark:bg-emerald-400" />
              )}

              <div className="flex items-center gap-3 min-w-0">
                {/* Quadratische Tianzige-Box */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border relative overflow-hidden ${
                    isSelected
                      ? 'border-emerald-500/40 bg-white text-emerald-950 dark:border-emerald-500/40 dark:bg-zinc-800 dark:text-emerald-100'
                      : 'border-zinc-200/90 bg-zinc-50/80 text-zinc-900 dark:border-white/10 dark:bg-zinc-800/60 dark:text-zinc-100'
                  }`}
                >
                  {/* Subtle Tianzige-Grid */}
                  <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-15">
                    <div className="border-b border-r border-dashed border-current" />
                    <div className="border-b border-dashed border-current" />
                    <div className="border-r border-dashed border-current" />
                    <div />
                  </div>
                  <span className="font-cjk text-xl font-bold tracking-tight select-none">{item.hanzi}</span>
                </div>

                {/* Wort-Details (Pinyin & Übersetzung) */}
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                      {item.pinyin}
                    </span>
                  </div>
                  <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {item.meaning}
                  </p>
                </div>
              </div>

              {/* Badges rechts */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="font-mono text-[10px] font-extrabold text-rose-600 dark:text-rose-400 tracking-wider">
                  HSK 1 {hskTag}
                </span>
                <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {posInfo.short}
                </span>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-500 dark:border-white/10">
            Keine Vokabeln für deine Suche gefunden.
          </div>
        )}
      </div>
    </div>
  );
}
