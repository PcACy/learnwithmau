import { useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { ChevronDown, Volume2, Edit3, Gauge } from 'lucide-react';
import type { SrsCard } from '../../types/srs';
import type { VocabItem } from '../../types/vocab';
import { RADICALS_BY_ID } from '../../data';
import { POSITION_LABELS } from '../../lib/alchemyEngine';
import { playAsset, playToneSequence, stopCurrentAudio } from '../../lib/audio';
import { getMasteryLevel } from '../../lib/mastery';
import { useSettingsStore, type AudioSpeed } from '../../store/settingsStore';
import { StrokeOrderViewer } from './StrokeOrderViewer';

interface VocabRowProps {
  item: VocabItem;
  card: SrsCard | undefined;
  expanded: boolean;
  onToggle(): void;
}

export function VocabRow({ item, card, expanded, onToggle }: VocabRowProps) {
  const [playing, setPlaying] = useState(false);
  const [activeStrokeChar, setActiveStrokeChar] = useState<string | null>(null);

  const audioSpeed = useSettingsStore((s) => s.audioSpeed);
  const setAudioSpeed = useSettingsStore((s) => s.setAudioSpeed);

  const playAudio = (e?: MouseEvent, rate?: number) => {
    if (e) e.stopPropagation();
    stopCurrentAudio();
    setPlaying(true);
    const done = () => setPlaying(false);
    if (item.audioPath) {
      void playAsset(item.audioPath, done, rate ?? audioSpeed);
      window.setTimeout(done, 2500);
    } else {
      const durationMs = playToneSequence(item.syllables.map((syllable) => syllable.tone));
      window.setTimeout(done, Math.max(300, durationMs));
    }
  };

  const characters = item.characters.map((c) => c.char);
  const mastery = getMasteryLevel(card);

  return (
    <div
      className={`rounded-[1.5rem] border transition-all duration-200 ${
        expanded
          ? 'border-emerald-600/35 bg-white shadow-whisper dark:border-emerald-400/25 dark:bg-zinc-900'
          : 'border-zinc-200/70 bg-white hover:border-emerald-600/30 hover:shadow-xs dark:border-white/[0.06] dark:bg-zinc-900'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={expanded}
        className="flex w-full cursor-pointer items-center gap-3.5 p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:gap-4"
      >
        {/* Quick Audio Button */}
        <button
          type="button"
          onClick={playAudio}
          aria-label={`${item.hanzi} anhören`}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-150 active:scale-95 ${
            playing
              ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
              : 'border-zinc-200/80 bg-zinc-50/80 text-zinc-600 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-700 dark:border-white/[0.08] dark:bg-zinc-950/40 dark:text-zinc-300 dark:hover:text-emerald-400'
          }`}
        >
          <Volume2 className="h-4 w-4" aria-hidden />
        </button>

        {/* Hanzi */}
        <span className="font-cjk min-w-14 text-center text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
          {item.hanzi}
        </span>

        {/* Pinyin & Meaning */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {item.pinyin}
            </span>
          </div>
          <p className="truncate text-xs text-zinc-600 sm:text-sm dark:text-zinc-300">
            {item.meaning}
          </p>
        </div>

        {/* Mastery Level Badge */}
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold ${mastery.badgeClass}`}>
          {mastery.shortName}
        </span>

        {/* Chevron Toggle */}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${expanded ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''}`}
          aria-hidden
        />
      </div>

      {expanded && (
        <div className="reveal space-y-5 border-t border-zinc-100 px-4 pb-5 pt-4 dark:border-white/[0.05]" style={{ '--index': 0 } as CSSProperties}>
          {/* Top Bar with Syllable Chips, Audio Speed Toggle and Stroke Order Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-400">Silben:</span>
                {item.syllables.map((syllable, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-zinc-200/70 bg-zinc-50 px-2 py-0.5 font-mono text-xs font-medium text-zinc-700 dark:border-white/[0.08] dark:bg-zinc-950/50 dark:text-zinc-200"
                  >
                    {syllable.marked}
                    <sub className="ml-0.5 text-[9px] text-zinc-400">{syllable.tone}</sub>
                  </span>
                ))}
              </div>

              {/* Audio Speed Toggles */}
              <div className="ml-2 flex items-center gap-1 rounded-xl bg-zinc-100 p-0.5 dark:bg-zinc-800" role="group" aria-label="Audio-Geschwindigkeit">
                <Gauge className="ml-1.5 h-3 w-3 text-zinc-400" />
                {([0.75, 1.0, 1.25] as AudioSpeed[]).map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => {
                      setAudioSpeed(speed);
                      playAudio(undefined, speed);
                    }}
                    className={`rounded-lg px-1.5 py-0.5 font-mono text-[10px] font-bold transition-all ${
                      audioSpeed === speed
                        ? 'bg-white text-emerald-800 shadow-xs dark:bg-zinc-900 dark:text-emerald-300'
                        : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                  >
                    {speed}×
                  </button>
                ))}
              </div>
            </div>

            {/* Strichreihenfolge-Trigger */}
            <div className="flex items-center gap-1.5" role="group" aria-label="Strichreihenfolge anzeigen">
              <span className="flex items-center gap-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <Edit3 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Strichfolge:
              </span>
              {characters.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => setActiveStrokeChar(activeStrokeChar === char ? null : char)}
                  aria-pressed={activeStrokeChar === char}
                  title={`Strichreihenfolge für „${char}“ anzeigen`}
                  className={`font-cjk flex h-8 min-w-8 items-center justify-center rounded-lg border px-2.5 text-base font-medium transition-all ${
                    activeStrokeChar === char
                      ? 'border-emerald-600 bg-emerald-500/15 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300 shadow-whisper'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-emerald-600/40 dark:border-white/[0.08] dark:bg-zinc-950/50 dark:text-zinc-200'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>

          {/* Interaktiver Strichreihenfolge-Viewer */}
          {activeStrokeChar && (
            <div className="reveal pt-1" style={{ '--index': 1 } as CSSProperties}>
              <StrokeOrderViewer
                character={activeStrokeChar}
                pinyin={item.characters.length === 1 ? item.pinyin : undefined}
                meaning={item.characters.length === 1 ? item.meaning : undefined}
              />
            </div>
          )}

          {/* Radikal-Zerlegung */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500">
              Radikal-Zerlegung
            </p>
            {item.characters.map((decomposition, charIndex) => (
              <div key={charIndex} className="flex flex-wrap items-center gap-2">
                <span className="font-cjk text-2xl font-medium">{decomposition.char}</span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">=</span>
                {decomposition.parts.map((part, partIndex) => (
                  <span
                    key={partIndex}
                    className="inline-flex items-baseline gap-1 rounded-lg bg-zinc-100 px-2 py-1 dark:bg-zinc-800"
                    title={radicalMeaning(part.id)}
                  >
                    <span className="font-cjk text-lg text-zinc-800 dark:text-zinc-100">{part.hanzi}</span>
                    <span className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {POSITION_LABELS[part.position]}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>

          {item.notes && (
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-white/[0.04] dark:bg-zinc-950/30">
              <p className="text-xs italic leading-relaxed text-zinc-600 dark:text-zinc-300">
                💡 {item.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function radicalMeaning(id: string): string {
  return RADICALS_BY_ID.get(id)?.meaning ?? id;
}
