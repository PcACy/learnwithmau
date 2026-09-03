import { useRef, useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  PenTool,
  Volume2,
} from 'lucide-react';
import type { VocabItem } from '../../types/vocab';
import type { SrsCard } from '../../types/srs';
import { RADICALS_BY_ID } from '../../data';
import { POSITION_LABELS } from '../../lib/alchemyEngine';
import { playAsset, playToneSequence, stopCurrentAudio } from '../../lib/audio';
import { getMasteryLevel } from '../../lib/mastery';
import { useSettingsStore } from '../../store/settingsStore';
import { getEnrichedVocab } from '../../data/vocabDetails';
import { StrokeOrderViewer } from './StrokeOrderViewer';

interface DictionaryDetailPanelProps {
  item: VocabItem;
  card: SrsCard | undefined;
  globalIndex: number;
}

export function DictionaryDetailPanel({ item, card, globalIndex }: DictionaryDetailPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSentenceIdx, setPlayingSentenceIdx] = useState<number | null>(null);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const writerSectionRef = useRef<HTMLDivElement>(null);

  const activeWriterChar =
    selectedChar && item.characters.some((c) => c.char === selectedChar)
      ? selectedChar
      : (item.characters[0]?.char ?? item.hanzi[0]);

  const audioSpeed = useSettingsStore((s) => s.audioSpeed);
  const setAudioSpeed = useSettingsStore((s) => s.setAudioSpeed);

  const enriched = getEnrichedVocab(item);
  const mastery = getMasteryLevel(card);
  const hskTag = `#${String(globalIndex).padStart(2, '0')}`;

  const playMainAudio = (rate?: number) => {
    stopCurrentAudio();
    setIsPlaying(true);
    const done = () => setIsPlaying(false);
    if (item.audioPath) {
      void playAsset(item.audioPath, done, rate ?? audioSpeed);
      window.setTimeout(done, 2500);
    } else {
      const durationMs = playToneSequence(item.syllables.map((s) => s.tone));
      window.setTimeout(done, Math.max(300, durationMs));
    }
  };

  const playSentenceAudio = (audioPath: string | undefined, idx: number) => {
    if (!audioPath) return;
    stopCurrentAudio();
    setPlayingSentenceIdx(idx);
    void playAsset(audioPath, () => setPlayingSentenceIdx(null));
  };

  return (
    <div className="rounded-[2.5rem] border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-whisper dark:border-white/10 dark:bg-zinc-900 space-y-8 relative overflow-hidden">
      {/* Background Chinese Calligraphy Watermark */}
      <span className="font-cjk pointer-events-none select-none absolute -bottom-10 -right-6 text-[160px] font-black text-zinc-950/[0.03] dark:text-white/[0.03]">
        {item.hanzi}
      </span>

      {/* 1. Header (Grosses Zeichen im Tianzige-Raster, Pinyin, Töne, Speed & Aussprache) */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-7 dark:border-white/[0.06]">
        <div className="flex items-center gap-5">
          {/* Grosses Zeichen im Tianzige Raster */}
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/80 bg-zinc-50/50 shadow-xs dark:border-white/10 dark:bg-zinc-800/40">
            {/* Tianzige Grid Lines */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-20">
              <div className="border-b border-r border-dashed border-current" />
              <div className="border-b border-dashed border-current" />
              <div className="border-r border-dashed border-current" />
              <div />
            </div>
            <span className="font-cjk text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight select-none">
              {item.hanzi}
            </span>
          </div>

          {/* Vokabel Info & Metadaten */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-mono text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {item.pinyin}
              </h2>
              {/* Rotes Siegel Badge für authentische Aussprache */}
              <span
                className="flex h-5 w-5 items-center justify-center rounded-xs bg-rose-700 text-[11px] font-bold text-white shadow-xs"
                title="Offizielle Standard-Aussprache (Putonghua / HSK-Norm)"
              >
                印
              </span>
            </div>

            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 capitalize">
              {item.meaning}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="rounded-md border border-zinc-200 bg-zinc-100/70 px-2 py-0.5 font-mono text-[11px] font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                {enriched.strokes} Striche (画)
              </span>

              <span className="rounded-md border border-zinc-200 bg-zinc-100/70 px-2 py-0.5 font-mono text-[11px] font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                HSK 1 {hskTag}
              </span>

              <span className="rounded-md bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-700 dark:text-rose-400 tracking-wide uppercase">
                A1 Essential
              </span>
            </div>
          </div>
        </div>

        {/* Audio Steuerung & Speed Toggle */}
        <div className="flex items-center gap-3">
          {/* Speed Toggle */}
          <div className="flex items-center rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-300">
            <button
              type="button"
              onClick={() => {
                setAudioSpeed(1.0);
                playMainAudio(1.0);
              }}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                audioSpeed === 1.0 ? 'bg-white shadow-xs text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 font-bold' : ''
              }`}
            >
              1.0x
            </button>
            <button
              type="button"
              onClick={() => {
                setAudioSpeed(0.75);
                playMainAudio(0.75);
              }}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                audioSpeed === 0.75 ? 'bg-white shadow-xs text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 font-bold' : ''
              }`}
            >
              0.75x
            </button>
          </div>

          {/* Haupt-Audio Button */}
          <button
            type="button"
            onClick={() => playMainAudio()}
            disabled={isPlaying}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold text-white shadow-whisper transition-all active:scale-95 ${
              isPlaying
                ? 'bg-emerald-700 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            <span>Aussprache</span>
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. RADIKAL-DEKOMPOSITION (字形拆解) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Radikal-Dekomposition (字形拆解)
          </span>
          <span className="font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
            Semantisch-Phonetische Harmonie
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {item.characters.flatMap((charDec, cIdx) =>
            charDec.parts.map((part, pIdx) => {
              const rad = RADICALS_BY_ID.get(part.id);
              const posLabel = POSITION_LABELS[part.position] || part.position;
              const isFirst = pIdx === 0;

              return (
                <div
                  key={`${cIdx}-${pIdx}`}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-white/10 dark:bg-zinc-800/30"
                >
                  <span
                    className={`font-cjk text-3xl font-black ${
                      isFirst ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {part.hanzi}
                  </span>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {rad ? rad.pinyin : part.id}
                      </span>
                      <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                        {posLabel}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-300">
                      {rad ? rad.meaning : part.id}
                    </p>

                    {rad && (
                      <p className="text-[10px] text-zinc-400 font-mono">
                        Radikal {rad.id} • {rad.strokes} Striche
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cultural Mnemonic Box */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-start gap-3">
          <Bookmark className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
            <strong className="font-semibold text-rose-700 dark:text-rose-300">Kulturelle Gedächtnisstütze: </strong>
            {enriched.mnemonic}
          </p>
        </div>
      </div>

      {/* 4. STRICHFOLGE & SCHREIBTRAINER */}
      <div ref={writerSectionRef} className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Strichfolge & Schreibtrainer ({enriched.strokes} Striche 画)
          </span>

          {/* Zeichen-Auswahl für mehrsilbige Wörter */}
          {item.characters.length > 1 && (
            <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
              {item.characters.map((c, i) => (
                <button
                  key={c.char}
                  type="button"
                  onClick={() => setSelectedChar(c.char)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-cjk text-sm font-bold transition-all ${
                    activeWriterChar === c.char
                      ? 'bg-white text-emerald-700 shadow-xs dark:bg-zinc-900 dark:text-emerald-400'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  <span>{c.char}</span>
                  <span className="font-mono text-[10px] opacity-70">
                    ({i + 1}/{item.characters.length})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Echter interaktiver HanziWriter mit Animation, Schrittmodus und Schreibquiz */}
        <StrokeOrderViewer
          character={activeWriterChar}
          pinyin={item.characters.find((c) => c.char === activeWriterChar) ? item.pinyin : undefined}
          meaning={item.meaning}
          size={190}
        />
      </div>

      {/* 5. HSK-1 BEISPIELSÄTZE (例句研习) */}
      <div className="space-y-3">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          HSK-1 Beispielsätze (例句研习)
        </span>

        <div className="space-y-2">
          {enriched.exampleSentences.map((sent, sIdx) => (
            <div
              key={sIdx}
              className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-white/10 dark:bg-zinc-800/30"
            >
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-cjk text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {sent.hanzi}
                  </span>
                  <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {sent.pinyin}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{sent.german}</p>
              </div>

              {sent.audioPath && (
                <button
                  type="button"
                  onClick={() => playSentenceAudio(sent.audioPath, sIdx)}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all ${
                    playingSentenceIdx === sIdx
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-zinc-200 bg-white text-zinc-500 hover:border-emerald-500 hover:text-emerald-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                  title="Satz anhören"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6. HÄUFIGE WORTVERBINDUNGEN (复合词扩展) - Nur anzeigen wenn reale Kollokationen existieren */}
      {enriched.collocations.length > 0 && (
        <div className="space-y-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Häufige Wortverbindungen (复合词扩展)
          </span>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {enriched.collocations.map((col, cIdx) => (
              <div
                key={cIdx}
                className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50/40 p-2.5 dark:border-white/10 dark:bg-zinc-800/20 text-xs"
              >
                <span className="font-cjk text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {col.hanzi}
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  {col.pinyin}
                </span>
                <span className="truncate text-zinc-400">({col.german})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Mastery Leitner Box & Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-zinc-100 pt-6 dark:border-white/[0.06]">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            Mastery Leitner Box: Stufe {mastery.level} ({mastery.name})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => writerSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-whisper hover:bg-rose-500 transition-all active:scale-95"
          >
            <PenTool className="h-4 w-4" />
            <span>Schreibübung aufrufen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
