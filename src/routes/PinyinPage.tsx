import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Volume2,
  BookOpen,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { SealBadge } from '../components/ui/SealBadge';
import {
  INITIALS,
  FINALS,
  TONE_SANDHI_RULES,
  ORTHOGRAPHY_RULES,
  type InitialData,
  type FinalData,
} from '../data/pinyinData';
import { VOCAB } from '../data';
import { playAsset, playToneSequence, stopCurrentAudio } from '../lib/audio';
import type { Tone } from '../types/vocab';

type PinyinTab = 'initials' | 'finals' | 'tones' | 'orthography';

const VOCAB_MAP_BY_HANZI = new Map(VOCAB.map((v) => [v.hanzi, v]));

const INITIALS_BY_CATEGORY: { label: string; items: InitialData[] }[] = (() => {
  const groups: { label: string; items: InitialData[] }[] = [];
  for (const item of INITIALS) {
    let group = groups.find((g) => g.label === item.categoryLabel);
    if (!group) {
      group = { label: item.categoryLabel, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
})();

const FINALS_BY_CATEGORY: { label: string; items: FinalData[] }[] = (() => {
  const groups: { label: string; items: FinalData[] }[] = [];
  for (const item of FINALS) {
    let group = groups.find((g) => g.label === item.categoryLabel);
    if (!group) {
      group = { label: item.categoryLabel, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
})();

export function PinyinPage() {
  const [activeTab, setActiveTab] = useState<PinyinTab>('initials');
  const [selectedInitial, setSelectedInitial] = useState<InitialData | null>(INITIALS[0]);
  const [selectedFinal, setSelectedFinal] = useState<FinalData | null>(FINALS[0]);
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const playTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      stopCurrentAudio();
      if (playTimeoutRef.current !== undefined) {
        window.clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);

  const playWordAudio = useCallback((hanzi: string, toneFallback?: number) => {
    stopCurrentAudio();
    if (playTimeoutRef.current !== undefined) {
      window.clearTimeout(playTimeoutRef.current);
    }
    setPlayingWord(hanzi);

    const vocab = VOCAB_MAP_BY_HANZI.get(hanzi);
    if (vocab?.audioPath) {
      void playAsset(vocab.audioPath, () => setPlayingWord(null));
      return;
    }

    if (toneFallback && toneFallback >= 1 && toneFallback <= 5) {
      playToneSequence([toneFallback as Tone]);
      playTimeoutRef.current = window.setTimeout(() => setPlayingWord(null), 600);
      return;
    }

    setPlayingWord(null);
  }, []);

  const playToneSound = useCallback((tone: Tone) => {
    stopCurrentAudio();
    playToneSequence([tone]);
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <SealBadge sealChar="拼" label="PHONETIK & PINYIN" variant="cinnabar" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Lehrbuch-Fundament · Aussprachelehre
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
          Pinyin- &amp; Phonetik-Schule
        </h1>
        <p className="max-w-3xl text-sm text-zinc-600 dark:text-zinc-300">
          Das systematische phonetische Fundament der chinesischen Hochsprache (Putonghua). Lerne alle 21 Anlaute,
          36 Auslaute, die vier Tonhöhen sowie die unerlässlichen Tonveränderungsregeln (Tone Sandhi).
        </p>
      </div>

      {/* Primary Tab Switcher */}
      <div
        role="tablist"
        aria-label="Pinyin-Bereiche"
        className="flex flex-wrap gap-2 border-b border-zinc-200/80 pb-3 dark:border-white/[0.08]"
      >
        {(
          [
            { id: 'initials', label: 'Anlaute (声母)', sub: '21 Konsonanten' },
            { id: 'finals', label: 'Auslaute (韵母)', sub: '36 Vokale & Nasale' },
            { id: 'tones', label: 'Töne & Sandhi (变调)', sub: 'Tonveränderungsregeln' },
            { id: 'orthography', label: 'Rechtschreibung', sub: 'Pinyin-Regeln' },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-start rounded-2xl px-4 py-2.5 text-left transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'border border-emerald-600/40 bg-emerald-500/10 text-emerald-900 shadow-sm ring-1 ring-emerald-500/30 dark:border-emerald-400/40 dark:text-emerald-300 dark:bg-emerald-500/15'
                  : 'border border-zinc-200/70 bg-zinc-50 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100/80 dark:border-white/[0.06] dark:bg-zinc-900/40 dark:text-zinc-400 dark:hover:bg-zinc-900/80'
              }`}
            >
              <span className="text-xs font-bold sm:text-sm">{tab.label}</span>
              <span className="text-[10px] font-medium opacity-70">{tab.sub}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANLAUTE (INITIALS) */}
      {activeTab === 'initials' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* List of initials grouped */}
          <div className="space-y-6 lg:col-span-5">
            {INITIALS_BY_CATEGORY.map((group) => (
              <div key={group.label} className="space-y-2">
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {group.label}
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {group.items.map((initial) => {
                    const isSelected = selectedInitial?.pinyin === initial.pinyin;
                    return (
                      <button
                        key={initial.pinyin}
                        type="button"
                        onClick={() => setSelectedInitial(initial)}
                        className={`flex flex-col items-center justify-center rounded-2xl border p-2.5 transition-all duration-150 active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-500/10 text-emerald-900 ring-2 ring-emerald-500/30 dark:border-emerald-400 dark:text-emerald-300'
                            : 'border-zinc-200/70 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/[0.06] dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-800/60'
                        }`}
                      >
                        <span className="font-mono text-xl font-extrabold">{initial.pinyin}</span>
                        <span className="font-mono text-[10px] opacity-60">[{initial.ipa}]</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Initial Detail & Articulation Inspector */}
          {selectedInitial && (
            <div className="lg:col-span-7">
              <div className="sticky top-24 rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md dark:border-white/[0.08] dark:bg-zinc-900/90 space-y-6">
                <div className="flex items-start justify-between border-b border-zinc-100 pb-4 dark:border-white/[0.06]">
                  <div>
                    <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                      {selectedInitial.categoryLabel}
                    </span>
                    <div className="mt-2 flex items-baseline gap-3">
                      <h2 className="font-mono text-4xl font-black text-zinc-900 dark:text-zinc-50">
                        {selectedInitial.pinyin}
                      </h2>
                      <span className="font-mono text-lg text-zinc-400">IPA: [{selectedInitial.ipa}]</span>
                    </div>
                  </div>
                </div>

                {/* German Analogy */}
                <div className="space-y-1.5 rounded-2xl bg-zinc-50/80 p-4 border border-zinc-200/50 dark:bg-zinc-950/40 dark:border-white/[0.05]">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                    <Info className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    Aussprache-Analogie für Deutschsprachige
                  </h4>
                  <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 font-medium">
                    {selectedInitial.germanAnalogy}
                  </p>
                </div>

                {/* Articulation Tip */}
                <div className="space-y-1.5 rounded-2xl bg-amber-500/5 p-4 border border-amber-500/20 dark:bg-amber-500/10">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Zungen- &amp; Mundstellung
                  </h4>
                  <p className="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                    {selectedInitial.articulationTip}
                  </p>
                </div>

                {/* Sample HSK-1 Words with Audio */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    HSK-1 Hörbeispiele mit diesem Laut:
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {selectedInitial.sampleWords.map((sample) => {
                      const isPlaying = playingWord === sample.hanzi;
                      return (
                        <button
                          key={sample.hanzi}
                          type="button"
                          onClick={() => playWordAudio(sample.hanzi, sample.tone)}
                          className={`flex items-center justify-between rounded-2xl border p-3 text-left transition-all active:scale-95 cursor-pointer ${
                            isPlaying
                              ? 'border-emerald-600 bg-emerald-500/15 ring-2 ring-emerald-500/30 dark:border-emerald-400'
                              : 'border-zinc-200/70 bg-zinc-50 hover:border-emerald-600/40 hover:bg-zinc-100/70 dark:border-white/[0.06] dark:bg-zinc-950/40 dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          <div>
                            <span className="font-cjk text-lg font-bold text-zinc-900 dark:text-zinc-50 block leading-tight">
                              {sample.hanzi}
                            </span>
                            <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 block">
                              {sample.pinyin}
                            </span>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block truncate max-w-[100px]">
                              {sample.meaning}
                            </span>
                          </div>
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                              isPlaying
                                ? 'bg-emerald-600 text-white animate-pulse'
                                : 'bg-zinc-200/70 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                            }`}
                          >
                            <Volume2 className="h-4 w-4" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AUSLAUTE (FINALS) */}
      {activeTab === 'finals' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* List of finals grouped */}
          <div className="space-y-6 lg:col-span-5">
            {FINALS_BY_CATEGORY.map((group) => (
              <div key={group.label} className="space-y-2">
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {group.label}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {group.items.map((item) => {
                    const isSelected = selectedFinal?.pinyin === item.pinyin;
                    return (
                      <button
                        key={item.pinyin}
                        type="button"
                        onClick={() => setSelectedFinal(item)}
                        className={`flex flex-col items-center justify-center rounded-2xl border p-2.5 transition-all duration-150 active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-500/10 text-emerald-900 ring-2 ring-emerald-500/30 dark:border-emerald-400 dark:text-emerald-300'
                            : 'border-zinc-200/70 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/[0.06] dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-800/60'
                        }`}
                      >
                        <span className="font-mono text-base font-extrabold">{item.pinyin}</span>
                        <span className="font-mono text-[10px] opacity-60">[{item.ipa}]</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Final Detail Inspector */}
          {selectedFinal && (
            <div className="lg:col-span-7">
              <div className="sticky top-24 rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md dark:border-white/[0.08] dark:bg-zinc-900/90 space-y-6">
                <div className="flex items-start justify-between border-b border-zinc-100 pb-4 dark:border-white/[0.06]">
                  <div>
                    <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                      {selectedFinal.categoryLabel}
                    </span>
                    <div className="mt-2 flex items-baseline gap-3">
                      <h2 className="font-mono text-4xl font-black text-zinc-900 dark:text-zinc-50">
                        {selectedFinal.pinyin}
                      </h2>
                      <span className="font-mono text-lg text-zinc-400">IPA: [{selectedFinal.ipa}]</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 rounded-2xl bg-zinc-50/80 p-4 border border-zinc-200/50 dark:bg-zinc-950/40 dark:border-white/[0.05]">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                    <Info className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    Aussprache &amp; Lautführung
                  </h4>
                  <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 font-medium">
                    {selectedFinal.germanAnalogy}
                  </p>
                </div>

                {/* Sample HSK-1 Words with Audio */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Beispielwörter:
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {selectedFinal.sampleWords.map((sample) => {
                      const isPlaying = playingWord === sample.hanzi;
                      return (
                        <button
                          key={sample.hanzi}
                          type="button"
                          onClick={() => playWordAudio(sample.hanzi, sample.tone)}
                          className={`flex items-center justify-between rounded-2xl border p-3 text-left transition-all active:scale-95 cursor-pointer ${
                            isPlaying
                              ? 'border-emerald-600 bg-emerald-500/15 ring-2 ring-emerald-500/30 dark:border-emerald-400'
                              : 'border-zinc-200/70 bg-zinc-50 hover:border-emerald-600/40 hover:bg-zinc-100/70 dark:border-white/[0.06] dark:bg-zinc-950/40 dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          <div>
                            <span className="font-cjk text-lg font-bold text-zinc-900 dark:text-zinc-50 block leading-tight">
                              {sample.hanzi}
                            </span>
                            <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 block">
                              {sample.pinyin}
                            </span>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block truncate">
                              {sample.meaning}
                            </span>
                          </div>
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                              isPlaying
                                ? 'bg-emerald-600 text-white animate-pulse'
                                : 'bg-zinc-200/70 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                            }`}
                          >
                            <Volume2 className="h-4 w-4" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TÖNE & SANDHI (变调) */}
      {activeTab === 'tones' && (
        <div className="space-y-8">
          {/* Die 4 Töne Grundlagen-Karte */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm dark:border-white/[0.08] dark:bg-zinc-900/90 space-y-6">
            <div className="border-b border-zinc-100 pb-4 dark:border-white/[0.06]">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Die 4 Töne des Standardchinesischen (四声)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Chinesisch ist eine Tonsprache. Dieselbe Silbe (z. B. "ma") hat je nach Tonhöhe und Tonverlauf
                vollkommen unterschiedliche Bedeutungen!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  tone: 1 as Tone,
                  name: '1. Ton (阴平)',
                  pitch: '5-5',
                  shape: 'Hoch & eben',
                  desc: 'Konstant hohe Tonlage wie ein gesungenes "Aaaa". Keine Tonhöhenänderung.',
                  sample: '妈 (mā) — Mutter',
                },
                {
                  tone: 2 as Tone,
                  name: '2. Ton (阳平)',
                  pitch: '3-5',
                  shape: 'Mittelhoch steigend',
                  desc: 'Steigt von mittlerer zu hoher Lage, wie bei einer erstaunten Nachfrage: "Wie?!"',
                  sample: '麻 (má) — Hanf',
                },
                {
                  tone: 3 as Tone,
                  name: '3. Ton (上声)',
                  pitch: '2-1-4',
                  shape: 'Tief & fallend-steigend',
                  desc: 'Fällt zuerst in den Keller und steigt dann leicht an. Dauert am längsten.',
                  sample: '马 (mǎ) — Pferd',
                },
                {
                  tone: 4 as Tone,
                  name: '4. Ton (去声)',
                  pitch: '5-1',
                  shape: 'Scharf fallend',
                  desc: 'Fällt energisch und abrupt von ganz oben nach ganz unten, wie ein schroffes "Nein!".',
                  sample: '骂 (mà) — schimpfen',
                },
              ].map((t) => (
                <div
                  key={t.tone}
                  className="rounded-2xl border border-zinc-200/70 bg-zinc-50/80 p-4 space-y-3 dark:border-white/[0.06] dark:bg-zinc-950/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      Ton {t.tone}
                    </span>
                    <button
                      type="button"
                      onClick={() => playToneSound(t.tone)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 dark:bg-emerald-500/20 dark:text-emerald-300 cursor-pointer"
                      title={`Ton ${t.tone} anhören`}
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">{t.name}</h4>
                    <span className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mt-0.5">
                      Verlauf: {t.pitch} ({t.shape})
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{t.desc}</p>
                  <div className="rounded-xl bg-white px-2.5 py-1.5 border border-zinc-200/50 text-[11px] font-medium text-zinc-700 dark:bg-zinc-900 dark:border-white/[0.05] dark:text-zinc-300">
                    {t.sample}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tonveränderungsregeln (Tone Sandhi) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Die 4 unverzichtbaren Tonveränderungsregeln (变调 Sandhi)
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Im Wörterbuch steht jedes Zeichen mit seinem Originalton. Im lebendigen Redefluss verändern sich
              jedoch bestimmte Töne nach strikten Regeln. Wer diese Regeln nicht kennt, klingt hölzern und
              unnatürlich!
            </p>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {TONE_SANDHI_RULES.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-3xl border border-zinc-200/80 bg-white/90 p-5 shadow-sm space-y-4 dark:border-white/[0.08] dark:bg-zinc-900/90"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                        {rule.badge}
                      </span>
                      <h4 className="mt-1.5 font-bold text-zinc-900 dark:text-zinc-50 text-base">
                        {rule.title}
                      </h4>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{rule.chinese}</span>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {rule.ruleExplanation}
                  </p>

                  {/* Highlighted Example Box */}
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-1.5 dark:bg-emerald-500/10">
                    <div className="flex items-center justify-between">
                      <span className="font-cjk text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                        {rule.exampleHanzi}
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        {rule.exampleSpoken}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span>Geschrieben: {rule.exampleOriginal}</span>
                      <span>„{rule.exampleMeaning}“</span>
                    </div>
                  </div>

                  {/* More Examples Table */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                      Weitere Praxis-Beispiele:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {rule.moreExamples.map((ex) => (
                        <div
                          key={ex.hanzi}
                          className="rounded-xl border border-zinc-200/60 bg-zinc-50/70 p-2 text-xs dark:border-white/[0.05] dark:bg-zinc-950/40"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-cjk font-bold text-zinc-900 dark:text-zinc-100">{ex.hanzi}</span>
                            <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 text-[11px]">
                              {ex.spoken}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block truncate">
                            {ex.meaning}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RECHTSCHREIBUNG & REGELN */}
      {activeTab === 'orthography' && (
        <div className="space-y-6">
          <div className="border-b border-zinc-100 pb-3 dark:border-white/[0.06]">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Pinyin-Rechtschreib- &amp; Orthographie-Regeln
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Warum fallen bei manchen Wörtern die Umlaut-Pünktchen von ü weg? Und wann braucht man ein Apostroph?
              Hier sind die drei wichtigsten Rechtschreibregeln jedes Lehrbuchs.
            </p>
          </div>

          <div className="space-y-5">
            {ORTHOGRAPHY_RULES.map((rule) => (
              <div
                key={rule.id}
                className="rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm space-y-4 dark:border-white/[0.08] dark:bg-zinc-900/90"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    {rule.title}
                  </h4>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 font-mono text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 w-fit">
                    {rule.ruleFormula}
                  </span>
                </div>

                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  {rule.summary}
                </p>

                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {rule.detail}
                </p>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {rule.examples.map((ex) => (
                    <div
                      key={ex.correct}
                      className="rounded-2xl border border-zinc-200/70 bg-zinc-50/70 p-3 text-xs space-y-1 dark:border-white/[0.05] dark:bg-zinc-950/40"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          {ex.correct}
                        </span>
                      </div>
                      {ex.wrong && (
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-mono text-[11px]">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          <span>Nicht: {ex.wrong}</span>
                        </div>
                      )}
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">
                        Hinweis: {ex.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
