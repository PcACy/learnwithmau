import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowLeft } from 'lucide-react';
import { VOCAB } from '../data';
import { stripToneMarks } from '../lib/pinyinUtils';
import { stopCurrentAudio } from '../lib/audio';
import { useProgressStore } from '../store/progressStore';
import { DictionaryMasterList } from '../components/dictionary/DictionaryMasterList';
import { DictionaryDetailPanel } from '../components/dictionary/DictionaryDetailPanel';
import { PART_OF_SPEECH_MAP } from '../data/vocabDetails';

export function DictionaryPage() {
  const cards = useProgressStore((s) => s.cards);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string>(VOCAB[0]?.id ?? '');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    return () => stopCurrentAudio();
  }, []);

  // Global Keyboard Shortcut: '/' fokussiert die Suche
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

  // Filterung nach Query & Wortart-Kategorie
  const filteredItems = useMemo(() => {
    const trimmed = query.trim();
    const qLower = trimmed.toLowerCase();
    const qPlain = stripToneMarks(trimmed);

    return VOCAB.filter((item) => {
      // 1. Kategorie-Filter
      if (selectedCategory !== 'all') {
        const pos = PART_OF_SPEECH_MAP[item.id] || 'nomen';
        if (pos !== selectedCategory) {
          return false;
        }
      }

      // 2. Textsuche
      if (!trimmed) return true;
      return (
        item.hanzi.includes(trimmed) ||
        item.meaning.toLowerCase().includes(qLower) ||
        item.pinyin.toLowerCase().includes(qLower) ||
        item.syllables.some((syllable) => syllable.plain.startsWith(qPlain)) ||
        stripToneMarks(item.pinyin).includes(qPlain)
      );
    });
  }, [query, selectedCategory]);

  const handleQueryChange = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const selectedItem = useMemo(() => {
    if (filteredItems.length === 0) return VOCAB[0];
    return filteredItems.find((it) => it.id === selectedId) || filteredItems[0];
  }, [filteredItems, selectedId]);

  const selectedGlobalIndex = useMemo(() => {
    return VOCAB.findIndex((it) => it.id === selectedItem.id);
  }, [selectedItem]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileView('detail');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header */}
      <div className="reveal flex flex-wrap items-end justify-between gap-4" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 font-cjk text-sm font-bold text-emerald-700 dark:text-emerald-400">
              典
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">
              Wörterbuch & Referenz
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            HSK-1 Schriftzeichen & Vokabular
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 font-bold shadow-xs dark:border-white/10 dark:bg-zinc-900">
            {filteredItems.length} von {VOCAB.length} Wörtern
          </span>
        </div>
      </div>

      {/* 2. Desktop Split-Screen Grid (Master-Detail Layout) */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 items-start">
        {/* Linke Spalte (Master List): ca. 42 % (5 Spalten) */}
        <div className="lg:col-span-5 sticky top-20">
          <DictionaryMasterList
            items={filteredItems}
            allItemsCount={VOCAB.length}
            selectedId={selectedItem.id}
            onSelect={handleSelect}
            query={query}
            onQueryChange={handleQueryChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            page={page}
            onPageChange={setPage}
            pageSize={6}
            inputRef={searchInputRef}
          />
        </div>

        {/* Rechte Spalte (Detail Panel): ca. 58 % (7 Spalten) */}
        <div className="lg:col-span-7">
          <DictionaryDetailPanel
            item={selectedItem}
            card={cards[selectedItem.id]}
            globalIndex={selectedGlobalIndex + 1}
          />
        </div>
      </div>

      {/* 3. Mobile View (< lg) */}
      <div className="lg:hidden">
        {mobileView === 'list' ? (
          <DictionaryMasterList
            items={filteredItems}
            allItemsCount={VOCAB.length}
            selectedId={selectedItem.id}
            onSelect={handleSelect}
            query={query}
            onQueryChange={handleQueryChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            page={page}
            onPageChange={setPage}
            pageSize={6}
            inputRef={searchInputRef}
          />
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setMobileView('list')}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 shadow-xs dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Liste
            </button>
            <DictionaryDetailPanel
              item={selectedItem}
              card={cards[selectedItem.id]}
              globalIndex={selectedGlobalIndex + 1}
            />
          </div>
        )}
      </div>
    </div>
  );
}
