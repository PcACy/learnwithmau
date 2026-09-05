import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, DragEvent } from 'react';
import { ArrowRight, Check, HelpCircle, RotateCcw, Volume2 } from 'lucide-react';
import { buildAlchemyPuzzles, type AlchemyPuzzle } from '../lib/alchemyEngine';
import { useKeyDown } from '../hooks/useKeyDown';
import { KeyHints } from '../components/ui/Kbd';
import { SessionSummary } from '../components/game/SessionSummary';
import { useProgressStore } from '../store/progressStore';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';
import { SealBadge } from '../components/ui/SealBadge';
import { KineticButton } from '../components/ui/KineticButton';
import { VOCAB } from '../data';
import { playAsset, stopCurrentAudio } from '../lib/audio';

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
  const [showHelp, setShowHelp] = useState(false);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const flashTimerRef = useRef<number | undefined>(undefined);
  const autoAdvanceTimerRef = useRef<number | undefined>(undefined);
  const isAdvancingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current !== undefined) {
        window.clearTimeout(flashTimerRef.current);
      }
      if (autoAdvanceTimerRef.current !== undefined) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
      stopCurrentAudio();
    };
  }, []);

  const puzzle = session.puzzles[session.index];
  const solved =
    puzzle !== undefined &&
    puzzle.slots.every((slot, i) => session.slots[i]?.filledPieceId === slot.part.id);

  const startSession = useCallback(() => {
    if (autoAdvanceTimerRef.current !== undefined) {
      window.clearTimeout(autoAdvanceTimerRef.current);
    }
    isAdvancingRef.current = false;
    stopCurrentAudio();
    setSession(newSession());
    setPhase('running');
  }, []);

  /** Nach gelöstem Zeichen: SRS-Grading, dann nächstes Puzzle oder Summary. */
  const completeSolve = useCallback(
    (solvedSession: SessionState) => {
      if (isAdvancingRef.current) return;
      isAdvancingRef.current = true;
      if (autoAdvanceTimerRef.current !== undefined) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
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
      isAdvancingRef.current = false;
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
          fireMicroBurst();
          const vocabItem = VOCAB.find((v) => v.id === puzzle.itemId);
          if (vocabItem?.audioPath) {
            void playAsset(vocabItem.audioPath);
          }
          setSession(intermediate);

          if (autoAdvanceTimerRef.current !== undefined) {
            window.clearTimeout(autoAdvanceTimerRef.current);
          }
          autoAdvanceTimerRef.current = window.setTimeout(() => {
            completeSolve(intermediate);
          }, 2400);
        } else {
          setSession(intermediate);
        }
        return;
      }

      if (flashTimerRef.current !== undefined) {
        window.clearTimeout(flashTimerRef.current);
      }
      flashTimerRef.current = window.setTimeout(() => {
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

    if (solved && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      if (isAdvancingRef.current) return;
      if (autoAdvanceTimerRef.current !== undefined) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
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
        headline={session.totalErrors === 0 ? 'Meister der Zeichenfusion!' : 'Runde abgeschlossen'}
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
    setDragOverSlot(null);
    const pieceIndex = Number.parseInt(event.dataTransfer.getData('text/plain'), 10);
    if (!Number.isNaN(pieceIndex)) placePiece(pieceIndex, slotIndex);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6" aria-live="polite">
      {/* 1. Header & Quick Status */}
      <div
        className="reveal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{ '--index': 0 } as CSSProperties}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <SealBadge sealChar="合" label="HANZI-ALCHEMIE" variant="jade" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Zeichen {session.index + 1} / {session.puzzles.length}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-50">
            Baue „{puzzle.meaning}“ ({puzzle.pinyin})
          </h1>
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
            {session.totalErrors} Fehler
          </span>
        </div>
      </div>

      {/* Foldable Help */}
      {showHelp && (
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-4 text-xs text-zinc-600 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 space-y-1.5 animate-pop-in">
          <p className="font-bold text-zinc-900 dark:text-zinc-100">So funktioniert die Hanzi-Alchemie:</p>
          <p>1. Wähle ein Radikal aus der unteren Leiste per Klick oder Zifferntaste <code className="font-mono bg-white dark:bg-zinc-800 px-1 py-0.5 rounded">1–9</code>.</p>
          <p>2. Setze es in den passenden Bauplan-Slot oder ziehe es per Drag & Drop direkt hinein.</p>
        </div>
      )}

      {/* 2. Double-Bezel Alchemie-Werkbank */}
      <section
        className="reveal double-bezel-casing shadow-whisper"
        style={{ '--index': 1 } as CSSProperties}
      >
        <div className="double-bezel-core p-7 sm:p-10 space-y-8 relative">
          {/* Authentic Calligraphy Watermark */}
          <span className="watermark-glyph">
            合
          </span>

          {/* Obere Leiste: Ziel-Zeichen Preview & Reset */}
          <div className="flex items-center justify-between gap-4 relative flex-wrap">
            <div className={`flex items-baseline gap-3.5 transition-all duration-300 rounded-2xl p-2 ${
              solved ? 'bg-emerald-500/10 ring-2 ring-emerald-500/40 shadow-whisper scale-105' : ''
            }`}>
              <span className={`font-cjk text-6xl font-black transition-colors ${
                solved ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-900 dark:text-zinc-50'
              }`}>
                {puzzle.targetChar}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-400 block">
                    {puzzle.pinyin}
                  </span>
                  {solved && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-xs animate-pop-in">
                      <Check className="h-3 w-3" /> FUSIONIERT
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {puzzle.meaning}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(() => {
                const vocabItem = VOCAB.find((v) => v.id === puzzle.itemId);
                return vocabItem?.audioPath ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (vocabItem.audioPath) void playAsset(vocabItem.audioPath);
                    }}
                    aria-label="Zeichen anhören"
                    title="Zeichen anhören"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-600 shadow-xs transition-all hover:border-emerald-600/35 hover:bg-emerald-500/10 hover:text-emerald-700 active:scale-95 dark:border-white/[0.08] dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                ) : null;
              })()}

              {session.selectedPiece !== null && !solved && (
                <button
                  type="button"
                  onClick={() => setSession({ ...session, selectedPiece: null })}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3.5 text-xs font-semibold text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Auswahl lösen
                </button>
              )}
            </div>
          </div>

          {/* Bauplan-Slots (Tianzige-Stil) */}
          <div className="flex flex-wrap gap-4 relative">
            {puzzle.slots.map((slot, slotIndex) => {
              const state = session.slots[slotIndex] ?? {
                filledPieceId: null,
                wrongFlash: false,
              };
              const isTarget = session.selectedPiece !== null && !state.filledPieceId;

              let slotClass =
                'flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-2xl border-2 transition-all duration-200 select-none touch-manipulation relative overflow-hidden ';
              if (state.wrongFlash) {
                slotClass += 'animate-shake border-rose-500/70 bg-rose-500/10 text-rose-600 dark:text-rose-400';
              } else if (state.filledPieceId) {
                slotClass +=
                  'border-emerald-600/50 bg-emerald-500/10 font-bold shadow-xs';
              } else if (dragOverSlot === slotIndex) {
                slotClass +=
                  'border-emerald-600 bg-emerald-500/20 ring-2 ring-emerald-500/40 shadow-whisper scale-105';
              } else if (isTarget) {
                slotClass +=
                  'cursor-pointer border-dashed border-emerald-600 bg-emerald-500/[0.08] hover:bg-emerald-500/15 active:scale-95 animate-pulse-soft';
              } else {
                slotClass += 'border-dashed border-zinc-300/80 dark:border-white/[0.12] bg-zinc-50/50 dark:bg-zinc-950/40';
              }

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
                    if (!state.filledPieceId) {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = 'move';
                    }
                  }}
                  onDragEnter={() => {
                    if (!state.filledPieceId) setDragOverSlot(slotIndex);
                  }}
                  onDragLeave={() => {
                    setDragOverSlot((cur) => (cur === slotIndex ? null : cur));
                  }}
                  onDrop={(event) => handleDrop(event, slotIndex)}
                  className={slotClass}
                >
                  {/* Tianzige-Crosshairs */}
                  <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-15">
                    <div className="border-b border-r border-dashed border-current" />
                    <div className="border-b border-dashed border-current" />
                    <div className="border-r border-dashed border-current" />
                    <div />
                  </div>

                  {filledPiece ? (
                    <>
                      <span className="font-cjk text-3xl font-bold text-emerald-800 dark:text-emerald-300">
                        {filledPiece.hanzi}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-700/70 dark:text-emerald-400/60">
                        {slot.label}
                      </span>
                    </>
                  ) : (
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {slot.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Radikal-Teilebank */}
          <div className="space-y-2.5 relative">
            <p className="font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-500">
              {solved
                ? 'Zeichen vollständig zusammengesetzt!'
                : session.selectedPiece !== null
                  ? `Radikal [${session.selectedPiece + 1}] gewählt – Position im Bauplan antippen.`
                  : 'Radikal-Palette (Wähle per Klick oder Zifferntaste 1–5):'}
            </p>

            <div className="flex flex-wrap gap-3">
              {puzzle.pieces.map((piece, pieceIndex) => {
                const used = session.usedPieces.has(pieceIndex);
                const isSelected = session.selectedPiece === pieceIndex;

                let pieceClass =
                  'relative flex h-16 w-16 cursor-grab items-center justify-center rounded-2xl border transition-all duration-150 select-none touch-manipulation active:scale-95 ';
                if (used) {
                  pieceClass += 'border-transparent bg-transparent opacity-20 cursor-default pointer-events-none';
                } else if (isSelected) {
                  pieceClass +=
                    '-translate-y-1 border-emerald-600 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-whisper dark:border-emerald-400';
                } else {
                  pieceClass +=
                    'border-zinc-200/80 bg-white hover:-translate-y-0.5 hover:border-emerald-600/40 dark:border-white/[0.08] dark:bg-zinc-900';
                }

                return (
                  <button
                    key={`${piece.id}-${piece.hanzi}`}
                    type="button"
                    draggable={!used && !solved}
                    title={piece.meaning ? `${piece.hanzi} (${piece.meaning})` : piece.hanzi}
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/plain', String(pieceIndex));
                      event.dataTransfer.effectAllowed = 'move';
                      setSession({ ...session, selectedPiece: pieceIndex });
                    }}
                    onDragEnd={() => {
                      setDragOverSlot(null);
                    }}
                    onClick={() => !used && setSession({ ...session, selectedPiece: isSelected ? null : pieceIndex })}
                    disabled={used}
                    aria-label={`Radikal ${piece.hanzi}${isSelected ? ' (gewählt)' : ''}`}
                    aria-pressed={isSelected}
                    className={pieceClass}
                  >
                    <span className="pointer-events-none absolute left-1.5 top-1 font-mono text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                      [{pieceIndex + 1}]
                    </span>
                    <span className="pointer-events-none font-cjk text-2xl font-medium text-zinc-800 dark:text-zinc-100">
                      {piece.hanzi}
                    </span>
                    {piece.meaning && (
                      <span className="pointer-events-none absolute bottom-1 max-w-[50px] truncate px-1 font-sans text-[9px] font-medium text-zinc-400 dark:text-zinc-500">
                        {piece.meaning}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Solved Kinetic CTA / KeyHints */}
          <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.05] relative flex flex-wrap items-center justify-between gap-4">
            <KeyHints
              hints={[
                ['1–9', 'Radikal wählen'],
                ['Klick / Drag', 'In Slot platzieren'],
                ...(solved ? ([['↵ Enter', 'Nächstes Zeichen']] as [string, string][]) : []),
              ]}
            />

            {solved && (
              <KineticButton
                variant="primary"
                onClick={() => completeSolve(session)}
                shortcut="[Enter]"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Nächstes Zeichen
              </KineticButton>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
