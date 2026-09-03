import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { VOCAB } from '../data';
import { stripToneMarks } from '../lib/pinyinUtils';
import { stopCurrentAudio } from '../lib/audio';
import { useProgressStore } from '../store/progressStore';
import { DictionaryMasterList } from '../components/dictionary/DictionaryMasterList';
import { DictionaryDetailPanel } from '../components/dictionary/DictionaryDetailPanel';
import { PART_OF_SPEECH_MAP } from '../data/vocabDetails';
import { SealBadge } from '../components/ui/SealBadge';

export function DictionaryPage() {
  const [searchParams] = useSearchParams();
  const cards = useProgressStore((s) => s.cards);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const paramQ = searchParams.get('q');
  const [internalQuery, setInternalQuery] = useState<string | null>(null);
  const query = internalQuery ?? (paramQ ?? '');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);

  const matchedIdFromUrl = useMemo(() => {
    if (!paramQ) return null;
    const match = VOCAB.find(
      (v) => v.hanzi === paramQ || v.pinyin.toLowerCase() === paramQ.toLowerCase()
    );
    return match?.id ?? null;
  }, [paramQ]);

  const selectedId = internalSelectedId ?? (matchedIdFromUrl ?? (VOCAB[0]?.id ?? ''));
  const [internalMobileView, setInternalMobileView] = useState<'list' | 'detail' | null>(null);
  const mobileView = internalMobileView ?? (paramQ ? 'detail' : 'list');

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
    setInternalQuery(q);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
  };

  const selectedItem = useMemo(() => {
    if (filteredItems.length === 0) return VOCAB[0];
    return filteredItems.find((it) => it.id === selectedId) || filteredItems[0];
  }, [filteredItems, selectedId]);

  const selectedGlobalIndex = useMemo(() => {
    return VOCAB.findIndex((it) => it.id === selectedItem.id);
  }, [selectedItem]);

  const handleSelect = (id: string) => {
    setInternalSelectedId(id);
    setInternalMobileView('detail');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header */}
      <div className="reveal flex flex-wrap items-end justify-between gap-4" style={{ '--index': 0 } as CSSProperties}>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <SealBadge sealChar="典" label="HSK 1 WÖRTERBUCH" variant="jade" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
              Referenz & Schriftzeichen-Anatomie
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-100">
            HSK-1 Schriftzeichen &amp; Vokabular
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
            Umfassendes Nachschlagewerk mit Strichfolge, Radikal-Anatomie und authentischen Beispielsätzen.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <span className="rounded-full border border-zinc-200/80 bg-white px-3.5 py-1.5 font-bold shadow-xs dark:border-white/10 dark:bg-zinc-900">
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
            inputRef={searchInputRef}
          />
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setInternalMobileView('list')}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-4 py-2 text-xs font-bold text-zinc-700 shadow-xs dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
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
