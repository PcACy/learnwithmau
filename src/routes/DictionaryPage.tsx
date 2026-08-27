import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  SearchX,
  Sparkles,
  X,
} from 'lucide-react';
import { RADICALS_BY_ID, VOCAB } from '../data';
import { stripToneMarks } from '../lib/pinyinUtils';
import { stopCurrentAudio } from '../lib/audio';
import { useProgressStore } from '../store/progressStore';
import { VocabRow } from '../components/dictionary/VocabRow';
import { RadicalFilterModal } from '../components/dictionary/RadicalFilterModal';
import type { Radical, VocabItem } from '../types/vocab';

type SrsFilter = 'all' | 'due' | 'learning' | 'new';
type SortOption = 'default' | 'pinyin' | 'strokes' | 'due';

interface RadicalWithCount {
  radical: Radical;
  count: number;
}

export function DictionaryPage() {
  const cards = useProgressStore((s) => s.cards);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState('');
  const [radicalId, setRadicalId] = useState<string | null>(null);
  const [srsFilter, setSrsFilter] = useState<SrsFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [isRadicalModalOpen, setIsRadicalModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const todayKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    return () => stopCurrentAudio();
  }, []);

  // Global Shortcut: `/` fokussiert das Suchfeld
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Radikale mit Vorkommens-Häufigkeit im Korpus
  const radicalsWithCount = useMemo(() => {
    const countMap = new Map<string, number>();
    for (const item of VOCAB) {
      for (const decomposition of item.characters) {
        for (const part of decomposition.parts) {
          countMap.set(part.id, (countMap.get(part.id) || 0) + 1);
        }
      }
    }

    return [...countMap.entries()]
      .map(([id, count]) => {
        const radical = RADICALS_BY_ID.get(id);
        return radical ? ({ radical, count } as RadicalWithCount) : null;
      })
      .filter((entry): entry is RadicalWithCount => entry !== null)
      .sort((a, b) => b.count - a.count);
  }, []);

  // Top 8 Radikale für die Quick-Bar
  const topRadicals = useMemo(() => radicalsWithCount.slice(0, 8), [radicalsWithCount]);

  // SRS Zähler-Statistiken
  const srsCounts = useMemo(() => {
    let due = 0;
    let learning = 0;
    let unlearned = 0;

    for (const item of VOCAB) {
      const card = cards[item.id];
      if (!card) {
        unlearned++;
      } else if (card.dueDate <= todayKey) {
        due++;
      } else {
        learning++;
      }
    }

    return { all: VOCAB.length, due, learning, new: unlearned };
  }, [cards, todayKey]);

  // Gefilterte & Sortierte Liste
  const results = useMemo(() => {
    const trimmed = query.trim();
    const qLower = trimmed.toLowerCase();
    const qPlain = stripToneMarks(trimmed);

    const filtered = VOCAB.filter((item) => {
      // Radikal-Filter
      if (radicalId && !item.characters.some((d) => d.parts.some((p) => p.id === radicalId))) {
        return false;
      }

      // SRS-Filter
      const card = cards[item.id];
      if (srsFilter === 'due' && (!card || card.dueDate > todayKey)) return false;
      if (srsFilter === 'learning' && (!card || card.dueDate <= todayKey)) return false;
      if (srsFilter === 'new' && card) return false;

      // Textsuche
      if (qLower === '') return true;
      return (
        item.hanzi.includes(trimmed) ||
        item.meaning.toLowerCase().includes(qLower) ||
        item.syllables.some((syllable) => syllable.plain.startsWith(qPlain)) ||
        stripToneMarks(item.pinyin).includes(qPlain)
      );
    });

    // Sortierung
    return filtered.sort((a, b) => {
      if (sortOption === 'pinyin') {
        return a.pinyin.localeCompare(b.pinyin);
      }
      if (sortOption === 'strokes') {
        const countA = a.characters.reduce((acc, c) => acc + c.parts.length, 0);
        const countB = b.characters.reduce((acc, c) => acc + c.parts.length, 0);
        return countA - countB;
      }
      if (sortOption === 'due') {
        const dueA = cards[a.id]?.dueDate ?? '9999';
        const dueB = cards[b.id]?.dueDate ?? '9999';
        return dueA.localeCompare(dueB);
      }
      return 0; // default HSK order
    });
  }, [query, radicalId, srsFilter, sortOption, cards, todayKey]);

  const activeRadical = radicalId ? RADICALS_BY_ID.get(radicalId) : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="reveal flex flex-wrap items-end justify-between gap-4" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <p className="flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            Nachschlagen
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Wörterbuch</h1>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-full bg-zinc-100 px-3 py-1 font-semibold dark:bg-zinc-800">
            {results.length} von {VOCAB.length} Einträgen
          </span>
        </div>
      </div>

      {/* Suche & Quick-Filter Bar */}
      <div className="reveal space-y-3.5" style={{ '--index': 1 } as CSSProperties}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Modern Search Input */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              ref={searchInputRef}
              id="dictionary-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suchen nach Hanzi, Pinyin oder Bedeutung (z. B. 水, hao, Buch)..."
              autoComplete="off"
              className="h-11 w-full rounded-2xl border border-zinc-200/80 bg-white pl-10 pr-16 text-sm text-zinc-900 shadow-whisper transition-colors placeholder:text-zinc-400 focus:border-emerald-600/50 focus:outline-none dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Suchbegriff löschen"
                  className="rounded-lg p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="hidden rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 sm:block dark:border-zinc-700 dark:bg-zinc-800">
                /
              </kbd>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor="sort-select" className="sr-only">
              Sortieren
            </label>
            <div className="relative flex items-center">
              <ArrowUpDown className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-zinc-400" />
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="h-11 rounded-2xl border border-zinc-200/80 bg-white pl-8 pr-8 text-xs font-semibold text-zinc-700 shadow-whisper focus:border-emerald-600/50 focus:outline-none dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="default">HSK Standard</option>
                <option value="pinyin">Pinyin (A–Z)</option>
                <option value="strokes">Strichanzahl</option>
                <option value="due">Fälligkeit</option>
              </select>
            </div>
          </div>
        </div>

        {/* SRS Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Lernstatus Filter">
          {[
            { id: 'all' as const, label: 'Alle', count: srsCounts.all, icon: Layers },
            { id: 'due' as const, label: 'Fällig', count: srsCounts.due, icon: Clock },
            { id: 'learning' as const, label: 'Im Lernen', count: srsCounts.learning, icon: Sparkles },
            { id: 'new' as const, label: 'Neu', count: srsCounts.new, icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = srsFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSrsFilter(tab.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-whisper dark:bg-emerald-500 dark:text-zinc-950'
                    : 'border border-zinc-200/80 bg-white text-zinc-600 hover:border-zinc-300 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-300'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white dark:bg-zinc-900/30 dark:text-zinc-950'
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Aufgeräumte Radikal-Leiste */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-zinc-400">Radikale:</span>

          {/* Top Radikale */}
          {topRadicals.map(({ radical, count }) => {
            const isSelected = radicalId === radical.id;
            return (
              <button
                key={radical.id}
                type="button"
                onClick={() => setRadicalId(isSelected ? null : radical.id)}
                title={`${radical.meaning} (${radical.pinyin}) · ${count} Wörter`}
                className={`font-cjk flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-sm transition-all duration-150 active:scale-95 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-500/15 font-bold text-emerald-800 shadow-whisper dark:border-emerald-400 dark:text-emerald-300'
                    : 'border-zinc-200/80 bg-white text-zinc-700 hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-200'
                }`}
              >
                <span>{radical.hanzi}</span>
                <span className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500">
                  {radical.meaning.split('/')[0]}
                </span>
              </button>
            );
          })}

          {/* Alle Radikale Button */}
          <button
            type="button"
            onClick={() => setIsRadicalModalOpen(true)}
            className="flex h-8 items-center gap-1 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/70 px-3 text-xs font-semibold text-zinc-600 transition-all hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:text-emerald-400"
          >
            <span>+ Alle ({radicalsWithCount.length})</span>
          </button>
        </div>

        {/* Aktiver Radikal-Filter Banner */}
        {activeRadical && (
          <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-3.5 py-2 text-xs font-medium text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <span className="font-cjk text-base font-bold">{activeRadical.hanzi}</span>
              <span>
                Filter aktiv: <strong>{activeRadical.meaning}</strong> ({activeRadical.pinyin})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setRadicalId(null)}
              className="flex items-center gap-1 font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Filter aufheben
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Ergebnisliste oder Leerzustand */}
      {results.length === 0 ? (
        <div className="reveal mx-auto max-w-md py-14 text-center" style={{ '--index': 2 } as CSSProperties}>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
            <SearchX className="h-7 w-7" aria-hidden />
          </span>
          <p className="mt-4 font-semibold">Keine Vokabeln gefunden</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Für diese Filterkombination gibt es keine Treffer im HSK-1-Wortschatz.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setRadicalId(null);
              setSrsFilter('all');
            }}
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white transition-all active:translate-y-px dark:bg-zinc-100 dark:text-zinc-900"
          >
            Alle Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="reveal space-y-2.5" style={{ '--index': 2 } as CSSProperties}>
          {results.map((item: VocabItem) => (
            <VocabRow
              key={item.id}
              item={item}
              card={cards[item.id]}
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId((current) => (current === item.id ? null : item.id))}
            />
          ))}
        </div>
      )}

      {/* Vollständiger Radikal-Katalog Modal */}
      <RadicalFilterModal
        isOpen={isRadicalModalOpen}
        onClose={() => setIsRadicalModalOpen(false)}
        radicalsWithCount={radicalsWithCount}
        selectedRadicalId={radicalId}
        onSelectRadical={(id) => setRadicalId(id)}
      />
    </div>
  );
}
