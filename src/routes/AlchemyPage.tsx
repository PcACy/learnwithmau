import { useCallback, useState } from 'react';
import type { CSSProperties, DragEvent } from 'react';
import { RotateCcw } from 'lucide-react';
import { buildAlchemyPuzzles, type AlchemyPuzzle } from '../lib/alchemyEngine';
import { useKeyDown } from '../hooks/useKeyDown';
import { KeyHints } from '../components/ui/Kbd';
import { SessionSummary } from '../components/game/SessionSummary';
import { useProgressStore } from '../store/progressStore';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';

const PUZZLES_PER_SESSION = 6;

type Phase = 'running' | 'summary';

interface SlotState {
  filledPieceId: string | null;
  wrongFlash: boolean;
}

interface SessionState {
  puzzles: AlchemyPuzzle[];
  index: number;
  slots: SlotState[];
  selectedPiece: number | null;
  usedPieces: Set<number>;
  wordErrors: number;
  totalErrors: number;
  solvedCount: number;
  sessionStartedAt: number;
  finishedAt: number | null;
}

function freshSlots(puzzle: AlchemyPuzzle): SlotState[] {
  return puzzle.slots.map(() => ({ filledPieceId: null, wrongFlash: false }));
}

function newSession(): SessionState {
  const puzzles = buildAlchemyPuzzles(PUZZLES_PER_SESSION);
  return {
    puzzles,
    index: 0,
    slots: puzzles[0] ? freshSlots(puzzles[0]) : [],
    selectedPiece: null,
    usedPieces: new Set<number>(),
    wordErrors: 0,
    totalErrors: 0,
    solvedCount: 0,
    sessionStartedAt: Date.now(),
    finishedAt: null,
  };
}

export function AlchemyPage() {
  const review = useProgressStore((s) => s.review);
  const logSession = useProgressStore((s) => s.logSession);

  const [phase, setPhase] = useState<Phase>('running');
  const [session, setSession] = useState<SessionState>(() => newSession());

  const puzzle = session.puzzles[session.index];
  const solved =
    puzzle !== undefined &&
    puzzle.slots.every((slot, i) => session.slots[i]?.filledPieceId === slot.part.id);

  const startSession = useCallback(() => {
    setSession(newSession());
    setPhase('running');
  }, []);

  /** Nach gelöstem Zeichen: SRS-Grading, dann nächstes Puzzle oder Summary. */
  const completeSolve = useCallback(
    (solvedSession: SessionState) => {
      const currentPuzzle = solvedSession.puzzles[solvedSession.index];
      const grade = solvedSession.wordErrors === 0 ? 5 : solvedSession.wordErrors <= 2 ? 4 : 3;
      void review(currentPuzzle.itemId, grade);

      const isLast = solvedSession.index === solvedSession.puzzles.length - 1;
      if (isLast) {
        const finishedAt = Date.now();
        void logSession({
          mode: 'alchemy',
          answered: solvedSession.puzzles.length,
          correct: solvedSession.solvedCount + 1,
          durationMs: finishedAt - solvedSession.sessionStartedAt,
        });
        setSession({ ...solvedSession, finishedAt });
        setPhase('summary');
        fireCelebration();
        return;
      }

      fireMicroBurst();
      const nextPuzzle = solvedSession.puzzles[solvedSession.index + 1];
      setSession({
        ...solvedSession,
        index: solvedSession.index + 1,
        slots: freshSlots(nextPuzzle),
        selectedPiece: null,
        usedPieces: new Set(),
        wordErrors: 0,
        solvedCount: solvedSession.solvedCount + 1,
      });
    },
    [review, logSession],
  );

  const placePiece = useCallback(
    (pieceIndex: number, slotIndex: number) => {
      if (!puzzle || solved || session.usedPieces.has(pieceIndex)) return;
      // Belegte oder nicht initialisierte Slots sind unantastbar – sonst würden
      // bei Doppel-Radikalen (z.B. 月+月 in 朋) beide Bausteine verbraucht.
      const slotState = session.slots[slotIndex];
      if (slotState === undefined || slotState.filledPieceId !== null) return;

      const piece = puzzle.pieces[pieceIndex];
      const expectedId = puzzle.slots[slotIndex].part.id;

      if (piece.id === expectedId) {
        const nextSlots = session.slots.map((slot, i) =>
          i === slotIndex ? { ...slot, filledPieceId: piece.id } : slot,
        );
        const updatedUsed = new Set(session.usedPieces).add(pieceIndex);

        const complete = puzzle.slots.every(
          (slot, i) =>
            i === slotIndex
              ? true
              : nextSlots[i]?.filledPieceId === slot.part.id,
        );
        const intermediate: SessionState = {
          ...session,
          slots: nextSlots,
          usedPieces: updatedUsed,
          selectedPiece: null,
        };

        if (complete) {
          completeSolve(intermediate);
        } else {
          setSession(intermediate);
        }
        return;
      }

      window.setTimeout(() => {
        setSession((prev) => ({
          ...prev,
          slots: prev.slots.map((slot) => ({ ...slot, wrongFlash: false })),
        }));
      }, 420);

      setSession({
        ...session,
        wordErrors: session.wordErrors + 1,
        totalErrors: session.totalErrors + 1,
        selectedPiece: null,
        slots: session.slots.map((slot, i) =>
          i === slotIndex ? { ...slot, wrongFlash: true } : slot,
        ),
      });
    },
    [puzzle, solved, session, completeSolve],
  );

  useKeyDown((event) => {
    if (phase !== 'running' || !puzzle || event.metaKey || event.ctrlKey) return;
    if (event.repeat) return;

    if (solved && event.key === 'Enter') {
      completeSolve(session);
      return;
    }
    if (!solved && /^[1-9]$/.test(event.key)) {
      const digit = Number.parseInt(event.key, 10) - 1;
      if (digit < puzzle.pieces.length && !session.usedPieces.has(digit)) {
        setSession({ ...session, selectedPiece: session.selectedPiece === digit ? null : digit });
      }
    }
  });

  if (phase === 'summary' && session.finishedAt !== null) {
    const minutes = ((session.finishedAt ?? session.sessionStartedAt) - session.sessionStartedAt) / 60000;
    return (
      <SessionSummary
        headline={session.totalErrors === 0 ? 'Alchemist! Alles sauber verbunden.' : 'Runde abgeschlossen'}
        stats={[
          { label: 'Zeichen', value: String(session.puzzles.length) },
          { label: 'Fehler', value: String(session.totalErrors) },
          { label: 'Dauer', value: `${minutes.toFixed(1)} min` },
        ]}
        onRestart={startSession}
        restartLabel="Nächste Runde"
      />
    );
  }

  if (!puzzle) return null;

  const handleDrop = (event: DragEvent<HTMLElement>, slotIndex: number) => {
    event.preventDefault();
    const pieceIndex = Number.parseInt(event.dataTransfer.getData('text/plain'), 10);
    if (!Number.isNaN(pieceIndex)) placePiece(pieceIndex, slotIndex);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="reveal flex items-end justify-between gap-4" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
            Zeichen {session.index + 1}/{session.puzzles.length}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Baue „{puzzle.meaning}“ ({puzzle.pinyin})
          </h1>
        </div>
        <p className="font-mono text-sm tabular-nums text-zinc-500 dark:text-zinc-400">{session.totalErrors} Fehler</p>
      </div>

      <section
        className="reveal rounded-[2.5rem] border border-zinc-200/70 bg-white p-7 shadow-whisper sm:p-9 dark:border-white/[0.06] dark:bg-zinc-900"
        style={{ '--index': 1 } as CSSProperties}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="font-cjk text-5xl font-semibold">{puzzle.targetChar}</span>
          <button
            type="button"
            onClick={() => setSession({ ...session, selectedPiece: null })}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-300/80 px-4 text-xs font-medium text-zinc-500 transition-all duration-200 ease-[var(--ease-spring)] hover:border-zinc-400 active:translate-y-px dark:border-white/10 dark:text-zinc-400 dark:hover:border-white/25"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Auswahl lösen
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {puzzle.slots.map((slot, slotIndex) => {
            const state = session.slots[slotIndex] ?? {
              filledPieceId: null,
              wrongFlash: false,
            };
            const isTarget = session.selectedPiece !== null && !state.filledPieceId;

            let cls =
              'flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-2xl border-2 transition-all duration-200 select-none touch-manipulation ';
            if (state.wrongFlash) cls += 'animate-pulse-soft border-rose-500/70 bg-rose-500/10';
            else if (state.filledPieceId) cls += 'border-emerald-500/50 bg-emerald-500/10';
            else if (isTarget)
              cls +=
                'cursor-pointer border-dashed border-emerald-600 bg-emerald-500/[0.08] hover:bg-emerald-500/15 active:scale-95 animate-pulse-soft';
            else cls += 'border-dashed border-zinc-300/80 dark:border-white/[0.12]';

            const filledPiece =
              state.filledPieceId !== null
                ? puzzle.pieces.find((piece) => piece.id === state.filledPieceId)
                : undefined;

            return (
              <div
                key={`${puzzle.itemId}-${slotIndex}`}
                role={isTarget ? 'button' : undefined}
                tabIndex={isTarget ? 0 : -1}
                aria-label={`Position ${slot.label}`}
                onClick={() => session.selectedPiece !== null && placePiece(session.selectedPiece, slotIndex)}
                onKeyDown={(event) => {
                  if (isTarget && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    if (session.selectedPiece !== null) placePiece(session.selectedPiece, slotIndex);
                  }
                }}
                onDragOver={(event) => {
                  if (isTarget) event.preventDefault();
                }}
                onDrop={(event) => handleDrop(event, slotIndex)}
                className={cls}
              >
                {filledPiece ? (
                  <>
                    <span className="font-cjk text-3xl font-semibold text-emerald-800 dark:text-emerald-300">
                      {filledPiece.hanzi}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-700/70 dark:text-emerald-400/60">
                      {slot.label}
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {slot.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 min-h-6 text-sm text-zinc-500 dark:text-zinc-400">
          {solved
            ? 'Vollständig – weiter mit ↵'
            : session.selectedPiece !== null
              ? `Radikal ${session.selectedPiece + 1} gewählt – Position antippen oder hierher ziehen.`
              : 'Radikal wählen (Antippen oder Ziffer), dann Position wählen.'}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          {puzzle.pieces.map((piece, pieceIndex) => {
            const used = session.usedPieces.has(pieceIndex);
            const isSelected = session.selectedPiece === pieceIndex;

            let cls =
              'relative flex h-16 w-16 cursor-grab items-center justify-center rounded-xl border transition-all duration-150 ease-[var(--ease-spring)] select-none touch-manipulation active:scale-95 ';
            if (used) {
              cls += 'border-transparent bg-transparent opacity-20 cursor-default';
            } else if (isSelected) {
              cls += '-translate-y-1 border-emerald-600 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-whisper dark:border-emerald-400';
            } else {
              cls +=
                'border-zinc-200/80 bg-zinc-50 hover:-translate-y-0.5 hover:border-emerald-600/40 active:translate-y-0 dark:border-white/[0.08] dark:bg-zinc-950/50 dark:hover:border-emerald-400/35';
            }

            return (
              <button
                key={`${piece.id}-${piece.hanzi}`}
                type="button"
                draggable={!used && !solved}
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/plain', String(pieceIndex));
                  event.dataTransfer.effectAllowed = 'move';
                  setSession({ ...session, selectedPiece: pieceIndex });
                }}
                onClick={() => !used && setSession({ ...session, selectedPiece: isSelected ? null : pieceIndex })}
                disabled={used}
                aria-label={`Radikal ${piece.hanzi}${isSelected ? ' (gewählt)' : ''}`}
                aria-pressed={isSelected}
                className={cls}
              >
                <span className="pointer-events-none absolute left-1 top-1 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                  {pieceIndex + 1}
                </span>
                <span className="pointer-events-none font-cjk text-2xl font-medium text-zinc-800 dark:text-zinc-100">
                  {piece.hanzi}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <KeyHints
            hints={[
              ['Klick', 'Radikal → Position'],
              ['Ziehen', 'Direkt in den Slot'],
              ...(solved ? ([['↵', 'Nächstes Zeichen']] as [string, string][]) : []),
            ]}
          />
        </div>
      </section>
    </div>
  );
}
