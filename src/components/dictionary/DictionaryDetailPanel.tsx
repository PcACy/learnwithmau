import { useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  PenTool,
  RotateCcw,
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
  const [showAnimatedWriter, setShowAnimatedWriter] = useState(false);
  const [activeWriterChar, setActiveWriterChar] = useState<string>(item.characters[0]?.char ?? item.hanzi[0]);

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
            <span className="font-cjk text-5xl font-black text-zinc-900 dark:text-zinc-100">
              {item.hanzi}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                {item.pinyin}
              </h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-500/10 font-cjk text-xs font-bold text-rose-600 dark:text-rose-400">
                印
              </span>
            </div>

            <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              {item.meaning}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="rounded-lg bg-zinc-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {enriched.strokes} Striche (画)
              </span>
              <span className="rounded-lg bg-zinc-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                HSK 1 {hskTag}
              </span>
              <span className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 font-mono text-[11px] font-extrabold text-rose-700 dark:text-rose-400">
                A1 ESSENTIAL
              </span>
            </div>
          </div>
        </div>

        {/* Audio Controls (Speed Toggles & Aussprache Button) */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="flex items-center rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setAudioSpeed(1.0)}
              className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition-all ${
                audioSpeed === 1.0
                  ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              1.0x
            </button>
            <button
              type="button"
              onClick={() => setAudioSpeed(0.75)}
              className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition-all ${
                audioSpeed === 0.75
                  ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              0.75x
            </button>
          </div>

          <button
            type="button"
            onClick={() => playMainAudio()}
            className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold text-white shadow-whisper transition-all active:scale-95 ${
              isPlaying
                ? 'bg-emerald-700 dark:bg-emerald-600'
                : 'bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500'
            }`}
          >
            <span>Aussprache</span>
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. CHAO PITCH MATRIX */}
      <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/50 p-5 dark:border-white/10 dark:bg-zinc-800/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Chao Pitch Matrix
              </span>
              <span className="font-mono text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
                {enriched.chaoPitch.toneName} ({enriched.chaoPitch.contourCode}{' '}
                {enriched.chaoPitch.label.split(' ')[0]})
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {enriched.chaoPitch.description}
            </p>
          </div>

          {/* Chao Pitch Graphic Curve */}
          <div className="flex shrink-0 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white px-5 py-3 dark:border-white/10 dark:bg-zinc-900">
            <div className="relative flex h-14 w-32 items-center">
              {/* Level Axis Grid (5 to 1) */}
              <div className="absolute inset-0 flex flex-col justify-between text-[8px] font-mono text-zinc-300 dark:text-zinc-600 pointer-events-none">
                <span>5</span>
                <span>3</span>
                <span>1</span>
              </div>
              <svg viewBox="0 0 100 40" className="ml-4 h-full w-full overflow-visible">
                <line x1="0" y1="5" x2="95" y2="5" stroke="currentColor" strokeDasharray="2 2" className="text-zinc-200 dark:text-zinc-800" strokeWidth="1" />
                <line x1="0" y1="20" x2="95" y2="20" stroke="currentColor" strokeDasharray="2 2" className="text-zinc-200 dark:text-zinc-800" strokeWidth="1" />
                <line x1="0" y1="35" x2="95" y2="35" stroke="currentColor" strokeDasharray="2 2" className="text-zinc-200 dark:text-zinc-800" strokeWidth="1" />
                {/* Dynamische Tonkurve mit Stützpunkten */}
                <path
                  d={`M 10 ${40 - (enriched.chaoPitch.levels[0] || 3) * 7} Q 50 ${
                    40 - (enriched.chaoPitch.levels[1] || 3) * 7
                  } 90 ${40 - (enriched.chaoPitch.levels[2] || 3) * 7}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="10" cy={40 - (enriched.chaoPitch.levels[0] || 3) * 7} r="3" fill="#f59e0b" />
                <circle cx="50" cy={40 - (enriched.chaoPitch.levels[1] || 3) * 7} r="3" fill="#f59e0b" />
                <circle cx="90" cy={40 - (enriched.chaoPitch.levels[2] || 3) * 7} r="3" fill="#f59e0b" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RADIKAL-DEKOMPOSITION (字形拆解) */}
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
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {rad?.pinyin ?? ''}
                      </span>
                      <span
                        className={`font-mono text-[10px] font-bold ${
                          isFirst ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {posLabel}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300">
                      {rad?.meaning ?? 'Grundradikal'} ({isFirst ? 'Semantic' : 'Phonetic/Semantic'})
                    </p>
                    <span className="block font-mono text-[10px] text-zinc-400">
                      Radikal {rad?.id} • {rad?.strokes ?? 3} Striche
                    </span>
                  </div>
                </div>
              );
            }),
          )}
        </div>

        {/* Kulturelle Gedächtnisstütze (Mnemonic Callout Box) */}
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-4 text-xs leading-relaxed text-zinc-700 dark:border-rose-400/20 dark:text-zinc-300">
          <Bookmark className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <div>
            <strong className="font-bold text-zinc-900 dark:text-zinc-100">
              Kulturelle Gedächtnisstütze:{' '}
            </strong>
            {enriched.mnemonic}
          </div>
        </div>
      </div>

      {/* 4. STRICHFOLGE SEQUENZ (笔顺) & Animation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Strichfolge Sequenz ({enriched.strokes} 画笔顺)
          </span>

          <button
            type="button"
            onClick={() => setShowAnimatedWriter((v) => !v)}
            className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700 hover:text-emerald-600 dark:text-emerald-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{showAnimatedWriter ? 'Sequenz-Kacheln anzeigen' : 'Strich-Animation abspielen'}</span>
          </button>
        </div>

        {showAnimatedWriter ? (
          <div className="flex flex-col items-center rounded-3xl border border-zinc-200/80 bg-zinc-50/50 p-6 dark:border-white/10 dark:bg-zinc-800/20">
            {item.characters.length > 1 && (
              <div className="mb-4 flex gap-2">
                {item.characters.map((c) => (
                  <button
                    key={c.char}
                    type="button"
                    onClick={() => setActiveWriterChar(c.char)}
                    className={`rounded-xl px-3 py-1 font-cjk text-lg font-bold transition-all ${
                      activeWriterChar === c.char
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-zinc-200/80 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    {c.char}
                  </button>
                ))}
              </div>
            )}
            <StrokeOrderViewer
              character={activeWriterChar}
              pinyin={item.pinyin}
              meaning={item.meaning}
              size={180}
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {Array.from({ length: Math.min(6, enriched.strokes) }).map((_, sIdx) => {
              const isLast = sIdx === Math.min(5, enriched.strokes - 1);
              return (
                <div
                  key={sIdx}
                  className="flex flex-col items-center rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3 dark:border-white/10 dark:bg-zinc-800/30"
                >
                  <span
                    className={`font-cjk text-2xl font-bold ${
                      isLast ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    {item.hanzi[0]}
                  </span>
                  <span className="mt-1 font-mono text-[10px] text-zinc-400">
                    {sIdx + 1}. {isLast ? '[Complete]' : 'Strich'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
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

      {/* 6. HÄUFIGE WORTVERBINDUNGEN (复合词扩展) */}
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
            onClick={() => setShowAnimatedWriter(true)}
            className="flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-whisper hover:bg-rose-500 transition-all active:scale-95"
          >
            <PenTool className="h-4 w-4" />
            <span>Schreibübung starten</span>
          </button>
        </div>
      </div>
    </div>
  );
}
