import { useEffect, useRef, useState } from 'react';
import {
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
import { SealBadge } from '../ui/SealBadge';

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
  const playTimerRef = useRef<number | undefined>(undefined);

  // Stoppt Audio und cleart Timeouts beim Wechsel der Vokabel oder Demontage
  useEffect(() => {
    return () => {
      stopCurrentAudio();
      setIsPlaying(false);
      if (playTimerRef.current !== undefined) {
        window.clearTimeout(playTimerRef.current);
      }
    };
  }, [item.id]);

  const activeWriterChar =
    selectedChar && item.characters.some((c) => c.char === selectedChar)
      ? selectedChar
      : (item.characters[0]?.char ?? item.hanzi[0]);

  const audioSpeed = useSettingsStore((s) => s.audioSpeed);
  const setAudioSpeed = useSettingsStore((s) => s.setAudioSpeed);

  const enriched = getEnrichedVocab(item);
  const mastery = getMasteryLevel(card);
  const hskTag = `#${String(globalIndex).padStart(2, '0')}`;

  const playMainAudio = async (rate?: number) => {
    stopCurrentAudio();
    if (playTimerRef.current !== undefined) {
      window.clearTimeout(playTimerRef.current);
    }
    setIsPlaying(true);
    const speed = rate ?? audioSpeed;
    const done = () => setIsPlaying(false);

    let started = false;
    if (item.audioPath) {
      started = await playAsset(item.audioPath, done, speed);
    }

    if (!started) {
      const durationMs = playToneSequence(item.syllables.map((s) => s.tone));
      playTimerRef.current = window.setTimeout(done, Math.max(300, durationMs));
    }
  };

  const playSentenceAudio = async (audioPath: string | undefined, idx: number) => {
    if (!audioPath) return;
    stopCurrentAudio();
    setPlayingSentenceIdx(idx);
    await playAsset(audioPath, () => setPlayingSentenceIdx(null));
  };

  return (
    <div className="double-bezel-casing relative overflow-hidden rounded-[2.5rem]">
      {/* Background Chinese Calligraphy Watermark */}
      <span
        aria-hidden="true"
        className="watermark-glyph select-none pointer-events-none absolute -bottom-12 -right-8 text-[200px] leading-none opacity-[0.03] dark:opacity-[0.04]"
      >
        典
      </span>

      <div className="double-bezel-core p-6 sm:p-8 space-y-8 relative">
        {/* 1. Header (Grosses Zeichen im Tianzige-Raster, Pinyin, Töne, Speed & Aussprache) */}
        <div className="flex flex-col gap-4 border-b border-zinc-100 pb-5 dark:border-white/[0.06]">
          <div className="flex items-start gap-4 min-w-0">
            {/* Dynamische Tianzige Kacheln */}
            <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
              {item.characters.map((c, i) => {
                const charCount = item.characters.length;
                const boxSize =
                  charCount === 1
                    ? 'h-20 w-20 text-4xl sm:text-5xl'
                    : charCount === 2
                      ? 'h-16 w-16 text-3xl sm:text-4xl'
                      : 'h-13 w-13 text-2xl';

                return (
                  <div
                    key={c.char + i}
                    className={`relative flex ${boxSize} items-center justify-center rounded-2xl border border-zinc-200/90 bg-zinc-50/70 shadow-xs dark:border-white/10 dark:bg-zinc-800/50`}
                  >
                    {/* Tianzige Grid Lines */}
                    <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-20">
                      <div className="border-b border-r border-dashed border-current" />
                      <div className="border-b border-dashed border-current" />
                      <div className="border-r border-dashed border-current" />
                      <div />
                    </div>
                    <span className="font-cjk font-black text-zinc-900 dark:text-zinc-100 tracking-tight select-none">
                      {c.char}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Vokabel Info (Pinyin, Siegel, Übersetzung & Audio-Player) */}
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                  {item.pinyin}
                </h2>
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-xs bg-rose-700 text-[11px] font-bold text-white shadow-xs"
                  title="Offizielle Standard-Aussprache (Putonghua / HSK-Norm)"
                >
                  印
                </span>
              </div>

              <p className="text-sm sm:text-base font-semibold text-zinc-600 dark:text-zinc-300">
                {item.meaning}
              </p>

              {/* Kompakte Audio-Aussprache-Leiste */}
              <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => void playMainAudio()}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-whisper transition-all active:scale-95 cursor-pointer ${
                    isPlaying
                      ? 'bg-emerald-700 ring-2 ring-emerald-400/40'
                      : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  <Volume2 className={`h-3.5 w-3.5 transition-transform ${isPlaying ? 'scale-110 text-emerald-200' : ''}`} />
                  <span>Aussprache</span>
                </button>

                <div className="flex items-center rounded-xl bg-zinc-100/90 p-0.5 border border-zinc-200/60 dark:bg-zinc-800/80 dark:border-white/10 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-300">
                  <button
                    type="button"
                    onClick={() => {
                      setAudioSpeed(1.0);
                      playMainAudio(1.0);
                    }}
                    className={`rounded-lg px-2 py-1 transition-all ${
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
                    className={`rounded-lg px-2 py-1 transition-all ${
                      audioSpeed === 0.75 ? 'bg-white shadow-xs text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 font-bold' : ''
                    }`}
                  >
                    0.75x
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontale Meta-Badges Zeile (kein Umbruch, klare visuelle Ordnung) */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="inline-flex items-center rounded-md border border-zinc-200/80 bg-zinc-100/70 px-2.5 py-0.5 font-mono text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
              {enriched.strokes} Striche (画)
            </span>

            <span className="inline-flex items-center rounded-md border border-zinc-200/80 bg-zinc-100/70 px-2.5 py-0.5 font-mono text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
              HSK 1 {hskTag}
            </span>

            <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-rose-700 dark:text-rose-400 tracking-wide uppercase">
              A1 Essential
            </span>

            {/* Ton-Verlauf Aufschlüsselung */}
            <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200/80 bg-zinc-50 px-2.5 py-0.5 font-mono text-xs text-zinc-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
              {item.syllables.map((s, idx) => (
                <span key={idx}>
                  {idx > 0 && <span className="text-zinc-300 dark:text-zinc-600 mr-1.5">·</span>}
                  <span className="font-bold">{s.marked}</span>{' '}
                  <span className="text-[11px] text-zinc-400">({s.tone === 5 ? 'Neutral' : `${s.tone}. Ton`})</span>
                </span>
              ))}
            </div>
          </div>
        </div>

      {/* 2. RADIKAL-DEKOMPOSITION (字形拆解) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-100 pb-3 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <SealBadge sealChar="析" label="ZEICHEN-ANATOMIE" variant="jade" />
            <div>
              <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Radikal-Dekomposition (字形拆解)
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Zerlegung in semantische Radikale und strukturelle Komponenten
              </p>
            </div>
          </div>
          <span className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {item.characters.length === 1 ? '1 Schriftzeichen' : `${item.characters.length} Schriftzeichen im Wort`}
          </span>
        </div>

        {/* Gruppiert nach jedem Schriftzeichen des Wortes */}
        <div className="space-y-3.5">
          {item.characters.map((charDec, cIdx) => {
            const syllable = item.syllables[cIdx];
            const isCompound = charDec.parts.length > 1;

            return (
              <div
                key={`${charDec.char}-${cIdx}`}
                className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4 sm:p-5 shadow-xs dark:border-white/[0.08] dark:bg-zinc-950/40 space-y-3.5"
              >
                {/* Schriftzeichen-Header */}
                <div className="flex items-center justify-between border-b border-zinc-200/60 pb-3 dark:border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    {/* Tianzige Mini-Kachel für das Zeichen */}
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-300/80 bg-white font-cjk text-2xl font-black text-zinc-900 shadow-xs dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-100">
                      <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-15">
                        <div className="border-b border-r border-dashed border-current" />
                        <div className="border-b border-dashed border-current" />
                        <div className="border-r border-dashed border-current" />
                        <div />
                      </div>
                      <span>{charDec.char}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-zinc-900 dark:text-zinc-100">
                          {syllable?.marked ?? charDec.char}
                        </span>
                        <span className="rounded-md border border-zinc-200/80 bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-zinc-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
                          Zeichen {cIdx + 1} von {item.characters.length}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {isCompound
                          ? `Zusammengesetztes Zeichen (${charDec.parts.length} Komponenten)`
                          : 'Unteilbares Grundzeichen (Basisradikal)'}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    {isCompound ? '合体字 · Verbindung' : '独体字 · Basis'}
                  </span>
                </div>

                {/* Komponenten-Gitter (dynamisch 2 oder 3 Spalten) */}
                <div
                  className={`grid gap-2.5 ${
                    charDec.parts.length >= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
                  }`}
                >
                  {charDec.parts.map((part, pIdx) => {
                    const rad = RADICALS_BY_ID.get(part.id);
                    const posLabel = POSITION_LABELS[part.position] || part.position;

                    return (
                      <div
                        key={pIdx}
                        className="flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-white p-3 shadow-xs dark:border-white/[0.08] dark:bg-zinc-900"
                      >
                        {/* Radikal/Komponenten-Symbol im Tianzige */}
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50/70 font-cjk text-xl font-black text-zinc-900 shadow-xs dark:border-white/10 dark:bg-zinc-800/60 dark:text-zinc-100">
                          <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-15">
                            <div className="border-b border-r border-dashed border-current" />
                            <div className="border-b border-dashed border-current" />
                            <div className="border-r border-dashed border-current" />
                            <div />
                          </div>
                          <span>{part.hanzi}</span>
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {rad ? rad.pinyin : part.hanzi}
                            </span>
                            <span className="rounded-md border border-zinc-200/70 bg-zinc-100/70 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-zinc-600 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                              {posLabel}
                            </span>
                            {rad && rad.hanzi !== part.hanzi && (
                              <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                                ({rad.hanzi})
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200 leading-tight">
                            {rad ? rad.meaning : part.id}
                          </p>

                          <p className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                            {rad ? `${rad.strokes} Striche` : ''}
                            {pIdx === 0 && isCompound ? ' · Hauptradikal' : isCompound ? ' · Komponente' : ' · Grundzeichen'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Didaktische Baukasten-Formelzeile am Fuß der Kachel */}
                {isCompound && (
                  <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-emerald-600/20 bg-emerald-500/[0.04] px-4 py-2 text-xs font-mono text-zinc-700 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06] dark:text-zinc-300">
                    {charDec.parts.map((p, pIdx) => {
                      const r = RADICALS_BY_ID.get(p.id);
                      return (
                        <span key={pIdx} className="inline-flex items-center gap-1.5">
                          {pIdx > 0 && <span className="font-bold text-emerald-600 dark:text-emerald-400">+</span>}
                          <span className="font-cjk text-sm font-black text-zinc-900 dark:text-zinc-100">{p.hanzi}</span>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            ({r ? r.meaning.split('/')[0] : p.id})
                          </span>
                        </span>
                      );
                    })}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-1">→</span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                      <span className="font-cjk text-base font-black">{charDec.char}</span>
                      <span>({syllable?.marked})</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cultural Mnemonic Box */}
        {enriched.mnemonic && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-600/20 bg-rose-600/[0.04] p-4.5 sm:p-5 dark:border-rose-500/20 dark:bg-rose-500/[0.06]">
            <SealBadge sealChar="悟" label="MERKHILFE" variant="cinnabar" size="sm" className="mt-0.5 shrink-0" />
            <div className="space-y-1 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                Kulturelle Gedächtnisstütze:
              </span>{' '}
              {enriched.mnemonic}
            </div>
          </div>
        )}
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
                  key={`${c.char}-${i}`}
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
    </div>
  );
}
