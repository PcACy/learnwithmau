import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Volume2 } from 'lucide-react';
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

const WORDS_PER_SESSION = 8;

type Phase = 'intro' | 'running' | 'summary';

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

  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState<RoundState | null>(null);
  const flashTimer = useRef<number | undefined>(undefined);

  const currentItem = round ? round.items[round.itemIndex] : null;
  const slotIndex = round ? round.slots.findIndex((slot) => slot === null) : -1;
  const targetChar = currentItem && slotIndex >= 0 ? currentItem.characters[slotIndex]?.char : undefined;

  const candidates: ImeCandidate[] =
    round && targetChar ? candidatesFor(round.typed) : [];

  const startRound = useCallback(() => {
    setRound(newRound(cards, new Date()));
    setPhase('running');
  }, [cards]);

  const commitChar = useCallback(
    (char: string) => {
      if (!round || !currentItem || !targetChar || phase !== 'running') return;

      if (char === targetChar) {
        const nextSlots = [...round.slots];
        nextSlots[slotIndex] = char;
        const wordDone = nextSlots.every((slot) => slot !== null);
        const committedChars = round.committedChars + 1;

        if (!wordDone) {
          setRound({ ...round, slots: nextSlots, typed: '', committedChars });
          return;
        }

        const grade = round.wordErrors === 0 ? 5 : round.wordErrors <= 2 ? 4 : 3;
        void review(currentItem.id, grade);

        const isLastWord = round.itemIndex === round.items.length - 1;
        if (isLastWord) {
          void logSession({
            mode: 'typeracer',
            answered: round.items.length,
            correct: round.cleanWords + (round.wordErrors === 0 ? 1 : 0),
            durationMs: Date.now() - round.roundStartedAt,
          });
          setRound({
            ...round,
            slots: nextSlots,
            typed: '',
            committedChars,
            cleanWords: round.cleanWords + (round.wordErrors === 0 ? 1 : 0),
            finishedAt: Date.now(),
          });
          setPhase('summary');
          fireCelebration();
          return;
        }

        if (round.wordErrors === 0) {
          fireMicroBurst();
        }

        const nextIndex = round.itemIndex + 1;
        const nextItem = round.items[nextIndex];
        setRound({
          ...round,
          slots: nextItem ? initialSlots(nextItem) : [],
          typed: '',
          committedChars,
          itemIndex: nextIndex,
          wordErrors: 0,
          cleanWords: round.cleanWords + (round.wordErrors === 0 ? 1 : 0),
        });
        return;
      }

      window.clearTimeout(flashTimer.current);
      flashTimer.current = window.setTimeout(() => {
        setRound((prev) => (prev ? { ...prev, flashWrong: false } : prev));
      }, 420);

      setRound({
        ...round,
        typed: '',
        wordErrors: round.wordErrors + 1,
        totalErrors: round.totalErrors + 1,
        flashWrong: true,
      });
    },
    [round, currentItem, targetChar, slotIndex, phase, review, logSession],
  );

  // Stoppt Audio beim Verlassen der Seite
  useEffect(() => {
    return () => {
      stopCurrentAudio();
    };
  }, []);

  const playCurrentAudio = useCallback(() => {
    if (currentItem?.audioPath) {
      void playAsset(currentItem.audioPath);
    }
  }, [currentItem]);

  useKeyDown((event) => {
    if (phase !== 'running' || !round || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.repeat) return;
    // Ignoriere Events während laufender IME-Komposition
    if (event.isComposing || event.keyCode === 229) return;

    if (event.code === 'Space' && round.typed.length === 0) {
      event.preventDefault();
      playCurrentAudio();
      return;
    }

    if (/^[a-zA-Z]$/.test(event.key)) {
      const targetSyllable = currentItem?.syllables[slotIndex]?.plain?.toLowerCase();
      if (
        (event.key === 'r' || event.key === 'R') &&
        round.typed.length === 0 &&
        targetSyllable &&
        !targetSyllable.startsWith('r')
      ) {
        event.preventDefault();
        playCurrentAudio();
        return;
      }

      if (round.typed.length < 8) {
        event.preventDefault();
        setRound({ ...round, typed: round.typed + event.key.toLowerCase() });
      }
      return;
    }
    if (event.key === 'Backspace') {
      event.preventDefault();
      setRound({ ...round, typed: round.typed.slice(0, -1) });
      return;
    }
    if (event.key === 'Escape') {
      if (round.typed.length > 0) {
        event.preventDefault();
        setRound({ ...round, typed: '' });
      }
      return;
    }
    const digit = Number.parseInt(event.key, 10);
    if (!Number.isNaN(digit) && digit >= 1 && digit <= candidates.length) {
      event.preventDefault();
      commitChar(candidates[digit - 1].char);
    }
  });

  if (phase === 'intro') {
    return (
      <div className="reveal mx-auto max-w-2xl py-6">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
          Modus 2 · Tippen
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Pinyin TypeRacer</h1>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          Tippe das angezeigte Wort in Pinyin – wie in einer echten IME. Buchstaben eingeben,
          Zeichen aus der Kandidatenliste per Ziffer wählen.
        </p>

        <ul className="mt-8 max-w-prose space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          <li className="flex gap-3"><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">01</span>{WORDS_PER_SESSION} Wörter pro Runde, fällige zuerst.</li>
          <li className="flex gap-3"><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">02</span>Fehlerfreies Wort = SRS Grade 5, wenige Fehler = 4, viele = 3.</li>
          <li className="flex gap-3"><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">03</span>Töne brauchst du nicht tippen – die Silbe genügt, wie beim echten IME.</li>
        </ul>

        <button
          type="button"
          onClick={startRound}
          className="mt-10 inline-flex h-12 items-center rounded-xl bg-emerald-600 px-7 text-sm font-semibold text-white transition-all duration-200 ease-[var(--ease-spring)] hover:bg-emerald-500 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          Runde starten
        </button>
      </div>
    );
  }

  if (phase === 'summary' && round) {
    const minutes = ((round.finishedAt ?? round.roundStartedAt) - round.roundStartedAt) / 60000;
    const cpm = minutes > 0 ? Math.round(round.committedChars / minutes) : 0;
    const accuracy =
      round.committedChars + round.totalErrors > 0
        ? Math.round((round.committedChars / (round.committedChars + round.totalErrors)) * 100)
        : 100;
    return (
      <SessionSummary
        headline={accuracy >= 95 ? 'Sauberer Lauf!' : 'Runde abgeschlossen'}
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

  if (!round || !currentItem || !targetChar) return null;

  const wordsDone = round.itemIndex;

  return (
    <div className="mx-auto max-w-3xl space-y-6" aria-live="polite">
      <div className="reveal flex items-end justify-between gap-4" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
            Wort {wordsDone + 1}/{round.items.length}
          </p>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Tippe die Silben von „{currentItem.meaning}“</h1>
            {currentItem.audioPath && (
              <button
                type="button"
                onClick={playCurrentAudio}
                aria-label="Wort anhören"
                title="Wort anhören (r)"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50 text-zinc-600 shadow-whisper transition-all duration-200 hover:border-emerald-600/35 hover:bg-emerald-500/10 hover:text-emerald-700 active:scale-95 dark:border-white/[0.08] dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-emerald-400/30 dark:hover:text-emerald-400"
              >
                <Volume2 className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </div>
        <p className="font-mono text-sm tabular-nums text-zinc-500 dark:text-zinc-400">{round.totalErrors} Fehler</p>
      </div>

      <section
        className={`reveal rounded-[2.5rem] border p-7 shadow-whisper transition-all duration-300 sm:p-9 dark:bg-zinc-900 ${
          round.flashWrong
            ? 'animate-shake border-rose-500/60 bg-rose-500/[0.02] dark:border-rose-500/40'
            : 'border-zinc-200/70 bg-white dark:border-white/[0.06]'
        }`}
        style={{ '--index': 1 } as CSSProperties}
      >
        <div className="flex flex-wrap gap-3">
          {Array.from(currentItem.hanzi).map((_hanzi, i) => {
            const isFilled = round.slots[i] !== null && round.slots[i] !== undefined;
            const isCurrent = i === slotIndex;

            let cls =
              'flex h-16 w-16 items-center justify-center rounded-2xl border font-cjk text-3xl transition-colors duration-200 ';
            if (isFilled) {
              cls += 'border-emerald-500/40 bg-emerald-500/10 font-semibold text-emerald-800 dark:text-emerald-300';
            } else if (isCurrent) {
              cls += `border-zinc-400/70 bg-zinc-50 dark:border-white/25 dark:bg-zinc-950/60 ${
                round.flashWrong ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-700 dark:text-zinc-200'
              }`;
            } else {
              cls += 'border-dashed border-zinc-300/70 text-transparent dark:border-white/[0.08]';
            }

            return (
              <span key={`${currentItem.id}-${i}`} className={cls}>
                {isFilled ? round.slots[i] : isCurrent ? (
                  <span className="font-mono text-xl">
                    {round.typed}
                    <span className="ml-px inline-block h-5 w-0.5 animate-pulse-soft bg-current align-middle" />
                  </span>
                ) : (
                  '·'
                )}
              </span>
            );
          })}
        </div>

        <p className="mt-6 min-h-6 text-sm text-zinc-500 dark:text-zinc-400">
          {candidates.length > 0
            ? 'Kandidaten – per Zifferntaste oder Klick wählen:'
            : round.typed.length > 0
              ? 'Kein Treffer – weiter tippen oder mit ⌫ korrigieren.'
              : 'Beginne zu tippen …'}
        </p>

        <div className="mt-3 flex min-h-20 flex-wrap gap-3">
          {candidates.map((candidate, i) => (
            <button
              key={`${candidate.syllable}-${candidate.char}`}
              type="button"
              onClick={() => commitChar(candidate.char)}
              className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50 font-cjk text-2xl text-zinc-800 transition-all duration-150 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:border-emerald-600/40 hover:text-emerald-800 active:translate-y-0 dark:border-white/[0.08] dark:bg-zinc-950/50 dark:text-zinc-100 dark:hover:border-emerald-400/35 dark:hover:text-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <span className="absolute left-1 top-1 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                {i + 1}
              </span>
              {candidate.char}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <KeyHints
            hints={[
              ['A–Z', 'Silbe tippen'],
              ['1–9', 'Zeichen wählen'],
              ['␣ / r', 'Audio'],
              ['⌫', 'Löschen'],
              ['Esc', 'Leeren'],
            ]}
          />
        </div>
      </section>
    </div>
  );
}
