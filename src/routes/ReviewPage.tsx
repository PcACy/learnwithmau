import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, CheckCircle2, Volume2, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SrsGrade } from '../types/srs';
import type { VocabItem } from '../types/vocab';
import { VOCAB_BY_ID, THEMATIC_DECKS, getThematicDeck } from '../data';
import { buildReviewQueue, summarizeQueue } from '../lib/reviewQueue';
import { playAsset, playToneSequence, stopCurrentAudio } from '../lib/audio';
import { useKeyDown } from '../hooks/useKeyDown';
import { KeyHints } from '../components/ui/Kbd';
import { SessionSummary } from '../components/game/SessionSummary';
import { useProgressStore } from '../store/progressStore';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';
import { SealBadge } from '../components/ui/SealBadge';
import { KineticButton } from '../components/ui/KineticButton';

type Phase = 'intro' | 'drill' | 'summary' | 'empty';

interface GradeOption {
  grade: SrsGrade;
  label: string;
  sublabel: string;
  styleClass: string;
}

const GRADE_OPTIONS: readonly GradeOption[] = [
  {
    grade: 0,
    label: 'Vergessen',
    sublabel: 'kommt gleich wieder',
    styleClass:
      'border-rose-500/50 bg-transparent text-rose-700 hover:-translate-y-0.5 hover:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/10 active:translate-y-0',
  },
  {
    grade: 3,
    label: 'Schwer',
    sublabel: 'knapp geschafft',
    styleClass:
      'border-zinc-300/80 bg-zinc-50 text-zinc-700 hover:-translate-y-0.5 hover:border-zinc-400 dark:border-white/[0.12] dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:border-white/25 active:translate-y-0',
  },
  {
    grade: 4,
    label: 'Gut',
    sublabel: 'sicher gewusst',
    styleClass:
      'border-emerald-600/40 bg-emerald-500/[0.06] text-emerald-800 hover:-translate-y-0.5 hover:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-400/10 active:translate-y-0',
  },
  {
    grade: 5,
    label: 'Leicht',
    sublabel: 'sofort gewusst',
    styleClass:
      'bg-emerald-600 border border-emerald-600 text-white hover:-translate-y-0.5 hover:bg-emerald-500 dark:border-emerald-500 dark:text-zinc-950 active:translate-y-0',
  },
];

interface SessionState {
  queue: string[];
  revealed: boolean;
  gradedTotal: number;
  requeueCount: number;
  passedIds: Set<string>;
  initialTotal: number;
  sessionStartedAt: number;
  finishedAt: number | null;
  deckTitle: string;
  deckTag: string;
}

export function ReviewPage() {
  const cards = useProgressStore((s) => s.cards);
  const review = useProgressStore((s) => s.review);
  const logSession = useProgressStore((s) => s.logSession);

  const [selectedDeckId, setSelectedDeckId] = useState<string>('all');
  const [freshLimit, setFreshLimit] = useState<number | 'all'>(10);

  const allItemIds = useMemo(() => [...VOCAB_BY_ID.keys()], []);

  const selectedDeck = useMemo(
    () => (selectedDeckId === 'all' ? null : getThematicDeck(selectedDeckId)),
    [selectedDeckId],
  );

  const activeItemIds = useMemo(
    () => (selectedDeck ? selectedDeck.itemIds : allItemIds),
    [selectedDeck, allItemIds],
  );

  const now = useMemo(() => new Date(), []);

  const masterSummary = useMemo(
    () => summarizeQueue(cards, allItemIds, now),
    [cards, allItemIds, now],
  );

  const deckSummaries = useMemo(() => {
    const map = new Map<string, ReturnType<typeof summarizeQueue>>();
    for (const d of THEMATIC_DECKS) {
      map.set(d.id, summarizeQueue(cards, d.itemIds, now));
    }
    return map;
  }, [cards, now]);

  const currentSummary = useMemo(
    () => (selectedDeckId === 'all' ? masterSummary : (deckSummaries.get(selectedDeckId) ?? masterSummary)),
    [selectedDeckId, masterSummary, deckSummaries],
  );

  const effectiveMaxFresh = freshLimit === 'all' ? undefined : freshLimit;
  const queuedFreshCount = Math.min(
    currentSummary.freshCount,
    typeof effectiveMaxFresh === 'number' ? effectiveMaxFresh : currentSummary.freshCount,
  );
  const plannedSessionTotal = currentSummary.dueCount + queuedFreshCount;

  const [phase, setPhase] = useState<Phase>('intro');
  const [session, setSession] = useState<SessionState | null>(null);

  const currentId = session?.queue[0] ?? null;
  const currentItem: VocabItem | undefined =
    currentId !== null ? VOCAB_BY_ID.get(currentId) : undefined;
  const revealed = session?.revealed ?? false;

  useEffect(() => {
    return () => stopCurrentAudio();
  }, []);

  const startSession = useCallback(() => {
    const nowDate = new Date();
    const built = buildReviewQueue(cards, activeItemIds, nowDate, effectiveMaxFresh);
    const queue = [...built.overdueStudied, ...built.fresh];
    if (queue.length === 0) {
      setPhase('empty');
      return;
    }
    setSession({
      queue,
      revealed: false,
      gradedTotal: 0,
      requeueCount: 0,
      passedIds: new Set(),
      initialTotal: queue.length,
      sessionStartedAt: Date.now(),
      finishedAt: null,
      deckTitle: selectedDeck ? selectedDeck.title : 'Gesamt-Deck',
      deckTag: selectedDeck ? selectedDeck.hanziTag : '全',
    });
    setPhase('drill');
  }, [cards, activeItemIds, effectiveMaxFresh, selectedDeck]);

  const playCurrent = useCallback(() => {
    if (!currentItem) return;
    stopCurrentAudio();
    if (currentItem.audioPath) {
      void playAsset(currentItem.audioPath);
      return;
    }
    playToneSequence(currentItem.syllables.map((syllable) => syllable.tone));
  }, [currentItem]);

  const finish = useCallback(
    (gradedTotal: number, passedCount: number, startedAt: number) => {
      const finishedAt = Date.now();
      void logSession({
        mode: 'review',
        answered: gradedTotal,
        correct: passedCount,
        durationMs: finishedAt - startedAt,
      });
      setSession((prev) => (prev ? { ...prev, finishedAt } : prev));
      setPhase('summary');
      fireCelebration();
    },
    [logSession],
  );

  const grade = useCallback(
    (optionIndex: number) => {
      if (!session || !currentId || !revealed) return;
      const option = GRADE_OPTIONS[optionIndex];
      if (!option) return;

      void review(currentId, option.grade);

      const passed = option.grade >= 3;
      if (option.grade === 5) {
        fireMicroBurst();
        playToneSequence([1]);
      } else if (passed) {
        playToneSequence([1]);
      } else {
        playToneSequence([4]);
      }

      let nextQueue: string[];
      let nextPassed = session.passedIds;
      if (passed) {
        nextPassed = new Set(session.passedIds).add(currentId);
        nextQueue = session.queue.slice(1);
      } else {
        // Relearn-Queue: vergessene Karte ans Ende der Restschlange.
        nextQueue = [...session.queue.slice(1), currentId];
      }

      const gradedTotal = session.gradedTotal + 1;
      const requeueCount = session.requeueCount + (passed ? 0 : 1);

      if (nextQueue.length === 0) {
        finish(gradedTotal, nextPassed.size, session.sessionStartedAt);
        return;
      }
      setSession({
        ...session,
        queue: nextQueue,
        passedIds: nextPassed,
        gradedTotal,
        requeueCount,
        revealed: false,
      });
    },
    [session, currentId, revealed, review, finish],
  );

  useKeyDown((event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.repeat) return;

    if (phase === 'intro' && event.key === 'Enter') {
      if (plannedSessionTotal > 0) {
        startSession();
      }
      return;
    }

    if (phase !== 'drill') return;

    if (event.code === 'Space') {
      event.preventDefault();
      if (!revealed) {
        setRevealedTrue();
      } else {
        playCurrent();
      }
      return;
    }

    if (!revealed) {
      if (event.key === 'Enter') {
        event.preventDefault();
        setRevealedTrue();
      }
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      grade(2); // Standard-Bestätigung: Gut (Grade 4)
      return;
    }

    const keyNum = Number(event.key);
    if (keyNum >= 1 && keyNum <= GRADE_OPTIONS.length) {
      event.preventDefault();
      grade(keyNum - 1);
    }
  });

  function setRevealedTrue() {
    setSession((prev) => (prev && !prev.revealed ? { ...prev, revealed: true } : prev));
  }

  if (phase === 'empty') {
    return (
      <div className="reveal mx-auto max-w-xl py-16 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Alles wiederholt!</h1>
        <p className="mx-auto mt-3 max-w-prose text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          Für das gewählte Deck sind heute keine Karten fällig und keine neuen Karten zur Einführung ausgewählt.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPhase('intro')}
            className="inline-flex h-12 items-center rounded-xl bg-emerald-600 px-7 text-sm font-semibold text-white transition-all duration-200 ease-[var(--ease-spring)] hover:bg-emerald-500 active:translate-y-px cursor-pointer"
          >
            Zur Deck-Auswahl
          </button>
          <Link
            to="/"
            className="inline-flex h-12 items-center rounded-xl border border-zinc-300 dark:border-white/10 px-6 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Zu den Trainingsmodi
          </Link>
        </div>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div className="reveal mx-auto max-w-4xl space-y-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <SealBadge sealChar="复" label="SPACED REPETITION" variant="jade" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Thematische Wiederholung
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Neue Vokabeln / Runde:
            </span>
            <div className="flex items-center rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800 border border-zinc-200/60 dark:border-white/5">
              {([5, 10, 15, 'all'] as const).map((limit) => (
                <button
                  key={String(limit)}
                  type="button"
                  onClick={() => setFreshLimit(limit)}
                  className={`rounded-lg px-3 py-1 font-mono text-xs font-bold transition-all cursor-pointer ${
                    freshLimit === limit
                      ? 'bg-white text-emerald-700 shadow-xs dark:bg-zinc-900 dark:text-emerald-400'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {limit === 'all' ? 'Alle' : `+${limit}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Master-Deck: Alle fälligen Karten */}
        <button
          type="button"
          onClick={() => setSelectedDeckId('all')}
          className={`w-full text-left rounded-3xl border-2 transition-all p-5 sm:p-6 cursor-pointer relative overflow-hidden ${
            selectedDeckId === 'all'
              ? 'border-emerald-600 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
              : 'border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/20'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 font-cjk text-lg font-black text-white shadow-xs">
                  全
                </span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Gesamt-Deck (Alle 163 Vokabeln)
                </h2>
                {selectedDeckId === 'all' && (
                  <span className="rounded-full bg-emerald-600/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-600/20">
                    Aktiv gewählt
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
                Tägliches Komplett-Review: Wiederholt alle fälligen Karten über alle 10 Themenbereiche hinweg.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
              <span className={`rounded-xl px-3 py-1.5 font-mono text-xs font-bold ${
                masterSummary.dueCount > 0
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25'
                  : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
              }`}>
                {masterSummary.dueCount} fällig
              </span>
              <span className="rounded-xl bg-zinc-100 px-3 py-1.5 font-mono text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {masterSummary.freshCount} neu
              </span>
            </div>
          </div>
        </button>

        {/* Thematische Decks Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Thematische Decks ({THEMATIC_DECKS.length})
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Wähle ein Thema für eine fokussierte Einheit
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {THEMATIC_DECKS.map((deck) => {
              const summary = deckSummaries.get(deck.id);
              const isSelected = selectedDeckId === deck.id;
              const due = summary?.dueCount ?? 0;
              const fresh = summary?.freshCount ?? 0;
              const learned = deck.itemIds.length - fresh;
              const pct = Math.round((learned / deck.itemIds.length) * 100);

              return (
                <button
                  key={deck.id}
                  type="button"
                  onClick={() => setSelectedDeckId(deck.id)}
                  className={`text-left rounded-2xl border-2 p-4 sm:p-5 transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-sm dark:border-emerald-500 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                      : 'border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-xs dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 font-cjk text-lg font-black text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-white/10">
                        {deck.hanziTag}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {deck.title}
                        </h4>
                        <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                          {deck.itemIds.length} Vokabeln
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="rounded-full bg-emerald-600 text-white p-1 shadow-xs">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {deck.description}
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-white/[0.05]">
                    <span className={`rounded-lg px-2 py-0.5 font-mono text-[11px] font-bold ${
                      due > 0
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {due} fällig
                    </span>
                    <span className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                      {fresh} neu
                    </span>
                    <span className="ml-auto font-mono text-[11px] text-zinc-400">
                      {pct}% gelernt
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start-Aktionsleiste */}
        <section className="double-bezel-casing shadow-whisper">
          <div className="double-bezel-core p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
            <span className="watermark-glyph">复</span>
            <div className="space-y-1 relative">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Ausgewählt: {selectedDeck ? selectedDeck.title : 'Gesamt-Deck'}
              </p>
              <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                {plannedSessionTotal === 0
                  ? 'Alle Karten in diesem Deck sind aktuell gelernt!'
                  : `${plannedSessionTotal} Karten in dieser Runde bereit`}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {currentSummary.dueCount} fällige Wiederholungen + {queuedFreshCount} neue Vokabeln
              </p>
            </div>

            <div className="relative shrink-0">
              <KineticButton
                variant="primary"
                onClick={startSession}
                shortcut="[Enter]"
                disabled={plannedSessionTotal === 0}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Runde starten ({plannedSessionTotal} Karten)
              </KineticButton>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (phase === 'summary' && session) {
    const minutes = ((session.finishedAt ?? session.sessionStartedAt) - session.sessionStartedAt) / 60000;
    const passRatio = session.passedIds.size / Math.max(session.initialTotal, 1);
    return (
      <SessionSummary
        headline={passRatio >= 0.85 && session.requeueCount === 0 ? 'Sauber wiederholt!' : 'Runde abgeschlossen'}
        stats={[
          { label: 'Deck', value: session.deckTitle },
          { label: 'Karten', value: `${session.passedIds.size}/${session.initialTotal}` },
          { label: 'Bewertungen', value: String(session.gradedTotal) },
          { label: 'Dauer', value: `${minutes.toFixed(1)} min` },
        ]}
        onRestart={startSession}
        restartLabel="Nächste Runde in diesem Deck"
        onSecondaryAction={() => setPhase('intro')}
        secondaryLabel="Zurück zur Deck-Auswahl"
      />
    );
  }

  if (!session || !currentItem) return null;

  const completed = session.passedIds.size;
  const progressRatio = completed / Math.max(completed + session.queue.length, 1);

  return (
    <div className="mx-auto max-w-3xl space-y-6" aria-live="polite">
      <div className="reveal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ '--index': 0 } as CSSProperties}>
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <SealBadge sealChar={session.deckTag} label={session.deckTitle.toUpperCase()} variant="jade" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Karte {completed + 1} / {session.initialTotal}
              {session.requeueCount > 0 && ` · ${session.requeueCount}× wiederholt`}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-50">
            Was bedeutet dieses Zeichen?
          </h1>
        </div>
        <span className="rounded-full border border-zinc-200/80 bg-white/90 px-3.5 py-1.5 font-mono text-xs font-bold tabular-nums text-zinc-600 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-300">
          {completed} / {session.initialTotal} erledigt
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={session.initialTotal}
        aria-label="Warteschlangen-Fortschritt"
        className="reveal h-1.5 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800"
        style={{ '--index': 1 } as CSSProperties}
      >
        <div
          className="h-full w-full origin-left rounded-full bg-emerald-600/80 transition-transform duration-500 ease-[var(--ease-spring)]"
          style={{ transform: `scaleX(${progressRatio})` }}
        />
      </div>

      <div className="reveal double-bezel-casing shadow-whisper" style={{ '--index': 2 } as CSSProperties}>
        <div className="double-bezel-core p-8 sm:p-14 text-center space-y-8 relative">
          <span className="watermark-glyph">{session.deckTag}</span>

          <div className="relative">
            <p className="font-cjk text-7xl sm:text-8xl font-black tracking-normal text-zinc-900 dark:text-zinc-50 select-none">
              {currentItem.hanzi}
            </p>
          </div>

          <div className="relative min-h-[5.5rem] flex flex-col items-center justify-center">
            {revealed ? (
              <div className="reveal space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                    {currentItem.pinyin}
                  </p>
                  <button
                    type="button"
                    onClick={playCurrent}
                    aria-label="Aussprache abspielen"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-emerald-700 transition-colors hover:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-500/20 active:translate-y-px cursor-pointer"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-lg sm:text-xl font-medium text-zinc-800 dark:text-zinc-200">
                  {currentItem.meaning}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={setRevealedTrue}
                className="group inline-flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all duration-200 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:border-white/20 active:translate-y-0 cursor-pointer shadow-xs"
              >
                <span>Antwort aufdecken</span>
                <kbd className="rounded-md bg-zinc-200/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  Space
                </kbd>
              </button>
            )}
          </div>

          <div className="border-t border-zinc-100 pt-6 dark:border-white/[0.05] relative">
            {revealed ? (
              <div className="space-y-3">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Wie gut konntest du dich erinnern?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {GRADE_OPTIONS.map((opt, idx) => (
                    <button
                      key={opt.grade}
                      type="button"
                      onClick={() => grade(idx)}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition-all duration-200 ease-[var(--ease-spring)] cursor-pointer shadow-xs ${opt.styleClass}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold opacity-60">[{idx + 1}]</span>
                        <span className="text-sm font-bold">{opt.label}</span>
                      </div>
                      <span className="text-[11px] opacity-75 mt-0.5">{opt.sublabel}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Drücke <kbd className="rounded bg-zinc-200/60 px-1.5 py-0.5 font-mono text-[10px] dark:bg-zinc-800">Leertaste</kbd> oder <kbd className="rounded bg-zinc-200/60 px-1.5 py-0.5 font-mono text-[10px] dark:bg-zinc-800">Enter</kbd> zum Aufdecken
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="reveal flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400" style={{ '--index': 3 } as CSSProperties}>
        <KeyHints
          hints={
            revealed
              ? [
                  ['1–4', 'Bewerten'],
                  ['Enter', 'Gut'],
                  ['Space', 'Audio'],
                ]
              : [['Space / Enter', 'Aufdecken']]
          }
        />
        <button
          type="button"
          onClick={() => setPhase('intro')}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          Runde abbrechen
        </button>
      </div>
    </div>
  );
}
