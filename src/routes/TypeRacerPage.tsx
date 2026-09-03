import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { HelpCircle, Volume2 } from 'lucide-react';
import { VOCAB } from '../data';
import { candidatesFor, type ImeCandidate } from '../lib/ime';
import { pickDrillItems } from '../lib/drillGenerator';
import { useKeyDown } from '../hooks/useKeyDown';
import { KeyHints } from '../components/ui/Kbd';
import { SessionSummary } from '../components/game/SessionSummary';
import { useProgressStore } from '../store/progressStore';
import { playAsset, stopCurrentAudio } from '../lib/audio';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';
import type { SrsCard } from '../types/srs';
import type { VocabItem } from '../types/vocab';
import { SealBadge } from '../components/ui/SealBadge';

const WORDS_PER_SESSION = 8;

type Phase = 'running' | 'summary';

interface RoundState {
  items: VocabItem[];
  itemIndex: number;
  slots: (string | null)[];
  typed: string;
  wordErrors: number;
  totalErrors: number;
  cleanWords: number;
  committedChars: number;
  flashWrong: boolean;
  roundStartedAt: number;
  finishedAt: number | null;
}

function initialSlots(item: VocabItem): (string | null)[] {
  return Array.from(item.hanzi).map(() => null);
}

function newRound(cards: Record<string, SrsCard>, now: Date): RoundState {
  const items = pickDrillItems(cards, VOCAB, WORDS_PER_SESSION, now);
  const first = items[0];
  return {
    items,
    itemIndex: 0,
    slots: first ? initialSlots(first) : [],
    typed: '',
    wordErrors: 0,
    totalErrors: 0,
    cleanWords: 0,
    committedChars: 0,
    flashWrong: false,
    roundStartedAt: Date.now(),
    finishedAt: null,
  };
}

export function TypeRacerPage() {
  const cards = useProgressStore((s) => s.cards);
  const review = useProgressStore((s) => s.review);
  const logSession = useProgressStore((s) => s.logSession);

  const [phase, setPhase] = useState<Phase>('running');
  const [round, setRound] = useState<RoundState>(() => newRound(cards, new Date()));
  const [showHelp, setShowHelp] = useState(false);
  const flashTimer = useRef<number | undefined>(undefined);

  const currentItem = round.items[round.itemIndex];
  const slotIndex = round.slots.findIndex((slot) => slot === null);
  const targetChar = currentItem && slotIndex >= 0 ? currentItem.characters[slotIndex]?.char : undefined;

  const candidates: ImeCandidate[] = targetChar ? candidatesFor(round.typed) : [];

  const startRound = useCallback(() => {
    setRound(newRound(cards, new Date()));
    setPhase('running');
  }, [cards]);

  const commitChar = useCallback(
    (char: string) => {
      if (!currentItem || !targetChar || phase !== 'running') return;

      if (char === targetChar) {
        fireMicroBurst();
        const nextSlots = [...round.slots];
        nextSlots[slotIndex] = char;
        const allFilled = nextSlots.every((s) => s !== null);

        if (allFilled) {
          const errors = round.wordErrors;
          const grade = errors === 0 ? 5 : errors <= 2 ? 4 : 3;
          void review(currentItem.id, grade);

          if (currentItem.audioPath) {
            void playAsset(currentItem.audioPath);
          }

          const nextIndex = round.itemIndex + 1;
          if (nextIndex >= round.items.length) {
            fireCelebration();
            const finishedAt = Date.now();
            void logSession({
              mode: 'typeracer',
              answered: round.items.length,
              correct: round.cleanWords + (errors === 0 ? 1 : 0),
              durationMs: finishedAt - round.roundStartedAt,
            });
            setRound((r) => ({
              ...r,
              slots: nextSlots,
              typed: '',
              committedChars: r.committedChars + 1,
              cleanWords: r.cleanWords + (errors === 0 ? 1 : 0),
              finishedAt,
            }));
            setPhase('summary');
            return;
          }

          const nextItem = round.items[nextIndex];
          setRound((r) => ({
            ...r,
            itemIndex: nextIndex,
            slots: initialSlots(nextItem),
            typed: '',
            wordErrors: 0,
            committedChars: r.committedChars + 1,
            cleanWords: r.cleanWords + (errors === 0 ? 1 : 0),
          }));
        } else {
          setRound((r) => ({
            ...r,
            slots: nextSlots,
            typed: '',
            committedChars: r.committedChars + 1,
          }));
        }
      } else {
        if (flashTimer.current !== undefined) {
          window.clearTimeout(flashTimer.current);
        }
        setRound((r) => ({
          ...r,
          wordErrors: r.wordErrors + 1,
          totalErrors: r.totalErrors + 1,
          flashWrong: true,
        }));
        flashTimer.current = window.setTimeout(() => {
          setRound((r) => ({ ...r, flashWrong: false }));
        }, 320);
      }
    },
    [currentItem, targetChar, phase, round, slotIndex, review, logSession],
  );

  useEffect(() => {
    return () => {
      if (flashTimer.current !== undefined) {
        window.clearTimeout(flashTimer.current);
      }
      stopCurrentAudio();
    };
  }, []);

  const playCurrentAudio = useCallback(() => {
    if (currentItem?.audioPath) {
      void playAsset(currentItem.audioPath);
    }
  }, [currentItem]);

  // Tastatureingabe für Pinyin, IME-Ziffern und Shortcuts
  useKeyDown((event) => {
    if (phase !== 'running') return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

    if (event.key === ' ' || event.key === 'r') {
      if (round.typed.length === 0) {
        event.preventDefault();
        playCurrentAudio();
        return;
      }
      if (event.key === ' ' && candidates.length > 0) {
        event.preventDefault();
        commitChar(candidates[0].char);
        return;
      }
    }

    if (/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
      setRound((r) => ({ ...r, typed: (r.typed + event.key.toLowerCase()).slice(0, 7) }));
      return;
    }
    if (event.key === 'Backspace') {
      event.preventDefault();
      setRound((r) => ({ ...r, typed: r.typed.slice(0, -1) }));
      return;
    }
    if (event.key === 'Escape') {
      if (round.typed.length > 0) {
        event.preventDefault();
        setRound((r) => ({ ...r, typed: '' }));
      }
      return;
    }
    const digit = Number.parseInt(event.key, 10);
    if (!Number.isNaN(digit) && digit >= 1 && digit <= candidates.length) {
      event.preventDefault();
      commitChar(candidates[digit - 1].char);
    }
  });

  if (phase === 'summary') {
    const minutes = ((round.finishedAt ?? round.roundStartedAt) - round.roundStartedAt) / 60000;
    const cpm = minutes > 0 ? Math.round(round.committedChars / minutes) : 0;
    const accuracy =
      round.committedChars + round.totalErrors > 0
        ? Math.round((round.committedChars / (round.committedChars + round.totalErrors)) * 100)
        : 100;
    return (
      <SessionSummary
        headline={accuracy >= 95 ? 'Präziser Schnelllauf!' : 'Runde abgeschlossen'}
        stats={[
          { label: 'Zeichen/Min', value: String(cpm) },
          { label: 'Trefferquote', value: `${accuracy}%` },
          { label: 'Fehler', value: String(round.totalErrors) },
        ]}
        onRestart={startRound}
        restartLabel="Nächste Runde"
      />
    );
  }

  if (!currentItem || !targetChar) return null;

  const wordsDone = round.itemIndex;

  return (
    <div className="mx-auto max-w-3xl space-y-6" aria-live="polite">
      {/* 1. Header & Fortschritt */}
      <div
        className="reveal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{ '--index': 0 } as CSSProperties}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <SealBadge sealChar="打" label="IME TYPERACER" variant="jade" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Wort {wordsDone + 1} / {round.items.length}
            </span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-50">
              Tippe: „{currentItem.meaning}“
            </h1>
            {currentItem.audioPath && (
              <button
                type="button"
                onClick={playCurrentAudio}
                aria-label="Wort anhören"
                title="Wort anhören (␣ / r)"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-600 shadow-xs transition-all hover:border-emerald-600/35 hover:bg-emerald-500/10 hover:text-emerald-700 active:scale-95 dark:border-white/[0.08] dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-emerald-400/30 dark:hover:text-emerald-400 cursor-pointer"
              >
                <Volume2 className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-400 cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>{showHelp ? 'Hilfe schließen' : 'Tipps'}</span>
          </button>
          <span className="rounded-full border border-zinc-200/80 bg-white/90 px-3.5 py-1.5 font-mono text-xs font-bold tabular-nums text-zinc-600 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-300">
            {round.totalErrors} {round.totalErrors === 1 ? 'Fehler' : 'Fehler'}
          </span>
        </div>
      </div>

      {/* Foldable Tips / Instructions */}
      {showHelp && (
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-4 text-xs text-zinc-600 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 space-y-1.5 animate-pop-in">
          <p className="font-bold text-zinc-900 dark:text-zinc-100">So funktioniert der Pinyin TypeRacer:</p>
          <p>1. Tippe die Silbe ohne Tonzeichen auf deiner Tastatur (z. B. <code className="font-mono bg-white dark:bg-zinc-800 px-1 py-0.5 rounded">ni</code>).</p>
          <p>2. Wähle das passende Zeichen per Zifferntaste <code className="font-mono bg-white dark:bg-zinc-800 px-1 py-0.5 rounded">1–5</code> oder drücke <code className="font-mono bg-white dark:bg-zinc-800 px-1 py-0.5 rounded">␣ Leertaste</code> für den ersten Treffer.</p>
        </div>
      )}

      {/* 2. Haupt-Eingabe-Container (Double-Bezel Architecture) */}
      <section
        className={`reveal double-bezel-casing shadow-whisper transition-all duration-300 ${
          round.flashWrong ? 'animate-shake' : ''
        }`}
        style={{ '--index': 1 } as CSSProperties}
      >
        <div
          className={`double-bezel-core p-7 sm:p-10 space-y-8 relative transition-colors ${
            round.flashWrong ? 'bg-rose-500/[0.04] dark:bg-rose-500/[0.06]' : ''
          }`}
        >
          {/* Authentic Calligraphy Watermark */}
          <span className="watermark-glyph">
            打
          </span>

          {/* Tianzige-Zielraster für das aktuelle Wort */}
          <div className="flex flex-wrap gap-4 relative">
            {Array.from(currentItem.hanzi).map((_hanzi, i) => {
              const isFilled = round.slots[i] !== null && round.slots[i] !== undefined;
              const isCurrent = i === slotIndex;

              let boxStyle =
                'flex h-20 w-20 items-center justify-center rounded-2xl border-2 font-cjk text-4xl transition-all duration-200 relative overflow-hidden ';
              if (isFilled) {
                boxStyle +=
                  'border-emerald-600/50 bg-emerald-500/10 font-bold text-emerald-800 dark:text-emerald-300 shadow-xs';
              } else if (isCurrent) {
                boxStyle += `border-emerald-600 bg-white dark:bg-zinc-900 shadow-whisper ring-2 ring-emerald-500/30 ${
                  round.flashWrong ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-900 dark:text-zinc-100'
                }`;
              } else {
                boxStyle +=
                  'border-dashed border-zinc-200/80 bg-zinc-50/50 text-zinc-300 dark:border-white/10 dark:bg-zinc-950/30';
              }

              return (
                <div key={`${currentItem.id}-${i}`} className={boxStyle}>
                  {/* Subtle Tianzige-Grid */}
                  <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-15">
                    <div className="border-b border-r border-dashed border-current" />
                    <div className="border-b border-dashed border-current" />
                    <div className="border-r border-dashed border-current" />
                    <div />
                  </div>

                  {isFilled ? (
                    <span>{round.slots[i]}</span>
                  ) : isCurrent ? (
                    <span className="font-mono text-xl font-bold tracking-tight">
                      {round.typed}
                      <span className="ml-0.5 inline-block h-6 w-0.5 animate-pulse bg-emerald-600 dark:bg-emerald-400 align-middle" />
                    </span>
                  ) : (
                    <span className="font-mono text-sm opacity-30">·</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Horizontale IME-Kandidatenmatrix (gemäß DESIGN.md) */}
          <div className="space-y-2.5 relative">
            <p className="font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-500">
              {candidates.length > 0
                ? 'IME-Kandidatenleiste (Wähle per Ziffer 1–5 oder Klick):'
                : round.typed.length > 0
                  ? 'Keine Übereinstimmung – mit ⌫ korrigieren.'
                  : 'Tippe die Silbe auf deiner Tastatur …'}
            </p>

            <div className="flex min-h-16 flex-wrap items-center gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-2.5 dark:border-white/[0.08] dark:bg-zinc-950/50">
              {candidates.map((candidate, i) => (
                <button
                  key={`${candidate.syllable}-${candidate.char}`}
                  type="button"
                  onClick={() => commitChar(candidate.char)}
                  className={`group relative flex h-12 min-w-14 items-center justify-center gap-2 rounded-xl border px-3 transition-all cursor-pointer ${
                    i === 0
                      ? 'border-emerald-600/50 bg-emerald-500/10 text-emerald-900 dark:border-emerald-500/40 dark:text-emerald-200 ring-1 ring-emerald-500/20'
                      : 'border-zinc-200/80 bg-white text-zinc-800 hover:border-emerald-500/40 hover:bg-emerald-50/50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  <span className="font-mono text-[11px] font-bold text-zinc-400 group-hover:text-emerald-600 dark:text-zinc-500">
                    {i + 1}.
                  </span>
                  <span className="font-cjk text-2xl font-bold">{candidate.char}</span>
                </button>
              ))}

              {candidates.length === 0 && round.typed.length === 0 && (
                <span className="font-mono text-xs text-zinc-400 px-2">
                  [Warte auf Eingabe]
                </span>
              )}
            </div>
          </div>

          {/* KeyHints Footer */}
          <div className="pt-2 border-t border-zinc-100 dark:border-white/[0.05] relative">
            <KeyHints
              hints={[
                ['A–Z', 'Silbe tippen'],
                ['1–5', 'Zeichen wählen'],
                ['␣ / r', 'Audio / 1. Zeichen'],
                ['⌫', 'Löschen'],
                ['Esc', 'Eingabe leeren'],
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
