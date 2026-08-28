import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { CheckCircle2, Layers, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SrsGrade } from '../types/srs';
import type { VocabItem } from '../types/vocab';
import { VOCAB_BY_ID } from '../data';
import { buildReviewQueue, summarizeQueue } from '../lib/reviewQueue';
import { playAsset, playToneSequence, stopCurrentAudio } from '../lib/audio';
import { useKeyDown } from '../hooks/useKeyDown';
import { KeyHints } from '../components/ui/Kbd';
import { SessionSummary } from '../components/game/SessionSummary';
import { useProgressStore } from '../store/progressStore';
import { fireCelebration } from '../lib/confetti';

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
    sublabel:'sofort gewusst',
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
}

export function ReviewPage() {
  const cards = useProgressStore((s) => s.cards);
  const review = useProgressStore((s) => s.review);
  const logSession = useProgressStore((s) => s.logSession);

  const allItemIds = useMemo(() => [...VOCAB_BY_ID.keys()], []);
  const introSummary = useMemo(
    () => summarizeQueue(cards, allItemIds, new Date()),
    [cards, allItemIds],
  );

  const [phase, setPhase] = useState<Phase>(
    introSummary.dueCount + introSummary.freshCount === 0 ? 'empty' : 'intro',
  );
  const [session, setSession] = useState<SessionState | null>(null);

  const currentId = session?.queue[0] ?? null;
  const currentItem: VocabItem | undefined =
    currentId !== null ? VOCAB_BY_ID.get(currentId) : undefined;
  const revealed = session?.revealed ?? false;

  useEffect(() => {
    return () => stopCurrentAudio();
  }, []);

  const startSession = useCallback(() => {
    const now = new Date();
    const built = buildReviewQueue(cards, allItemIds, now);
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
    });
    setPhase('drill');
  }, [cards, allItemIds]);

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
    if (phase !== 'drill' || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.repeat) return;

    if (event.code === 'Space') {
      event.preventDefault();
      setRevealedTrue();
      return;
    }
    if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      playCurrent();
      return;
    }
    if (event.key === 'Enter' && revealed) {
      grade(2); // Standard-Urteil „Gut" für schnelles Weiterklicken
      return;
    }
    if (!revealed) return;
    const digit = Number.parseInt(event.key, 10);
    if (digit >= 1 && digit <= GRADE_OPTIONS.length) grade(digit - 1);
  });

  function setRevealedTrue() {
    setSession((prev) => (prev && !prev.revealed ? { ...prev, revealed: true } : prev));
  }

  if (phase === 'empty') {
    const formatter = new Intl.DateTimeFormat('de-DE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    const nextDue = introSummary.nextDueDate
      ? (() => {
          const [y, m, d] = introSummary.nextDueDate.split('-').map(Number);
          return formatter.format(new Date(y, m - 1, d));
        })()
      : null;

    return (
      <div className="reveal mx-auto max-w-xl py-16 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Alles wiederholt!</h1>
        <p className="mx-auto mt-3 max-w-prose text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          Keine Karte ist heute fällig.
          {nextDue
            ? ` Die nächste Karte wird am ${nextDue} wieder fällig – oder trainiere bis dahin in einem der anderen Modi.`
            : ' Leere den Katalog mit einem Durchlauf im Ear-Trainer oder TypeRacer.'}
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-12 items-center rounded-xl bg-emerald-600 px-7 text-sm font-semibold text-white transition-all duration-200 ease-[var(--ease-spring)] hover:bg-emerald-500 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          Zu den Trainingsmodi
        </Link>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div className="reveal mx-auto max-w-2xl py-6">
        <p className="flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
          <Layers className="h-3.5 w-3.5" aria-hidden />
          Modus 5 · Wiederholen
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Fälligkeits-Drill</h1>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          Der klassische Karteikarten-Lauf: Zeichen ansehen, selbst prüfen und ehrlich benoten.
          Dein Urteil fließt direkt ins SM-2 ein.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { label: 'Überfällig', value: introSummary.dueCount },
            { label: 'Neu', value: introSummary.freshCount },
            { label: 'Gesamt', value: introSummary.dueCount + introSummary.freshCount },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.5rem] border border-zinc-200/70 bg-white p-4 shadow-whisper dark:border-white/[0.06] dark:bg-zinc-900"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </p>
              <p className="mt-1 font-mono text-2xl font-bold tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={startSession}
          className="mt-10 inline-flex h-12 items-center rounded-xl bg-emerald-600 px-7 text-sm font-semibold text-white transition-all duration-200 ease-[var(--ease-spring)] hover:bg-emerald-500 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          Warteschlange starten ({introSummary.dueCount + introSummary.freshCount} Karten)
        </button>

        <ul className="mt-8 max-w-prose space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          <li className="flex gap-3"><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">01</span>Überfällige Karten zuerst – das längst Fälligste ganz vorn.</li>
          <li className="flex gap-3"><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">02</span>„Vergessen“ hängt die Karte ans Ende der Runde, bis du sie korrekt benotest.</li>
          <li className="flex gap-3"><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">03</span>Ehrlich benoten lohnt: zu großzügige Grade überschätzen dein Intervall.</li>
        </ul>
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
          { label: 'Karten', value: `${session.passedIds.size}/${session.initialTotal}` },
          { label: 'Bewertungen', value: String(session.gradedTotal) },
          { label: 'Dauer', value: `${minutes.toFixed(1)} min` },
        ]}
        onRestart={startSession}
        restartLabel="Nächste Runde"
      />
    );
  }

  if (!session || !currentItem) return null;

  const completed = session.passedIds.size;
  const progressRatio = completed / Math.max(completed + session.queue.length, 1);

  return (
    <div className="mx-auto max-w-3xl space-y-6" aria-live="polite">
      <div className="reveal flex items-end justify-between gap-4" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
            Karte {completed + 1}/{session.initialTotal}
            {session.requeueCount > 0 && ` · ${session.requeueCount}× wiederholt`}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Was bedeutet dieses Zeichen?</h1>
        </div>
        <p className="font-mono text-sm tabular-nums text-zinc-500 dark:text-zinc-400">
          {completed}/{session.initialTotal} erledigt
        </p>
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

      <section
        className="reveal rounded-[2.5rem] border border-zinc-200/70 bg-white p-7 shadow-whisper sm:p-9 dark:border-white/[0.06] dark:bg-zinc-900"
        style={{ '--index': 2 } as CSSProperties}
      >
        <div className="relative">
          <button
            type="button"
            onClick={playCurrent}
            aria-label="Wort anhören"
            title="Wort anhören (r)"
            className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50 text-zinc-600 transition-all duration-200 hover:border-emerald-600/35 hover:bg-emerald-500/10 hover:text-emerald-700 active:translate-y-px dark:border-white/[0.08] dark:bg-zinc-950/50 dark:text-zinc-300 dark:hover:border-emerald-400/30 dark:hover:text-emerald-400"
          >
            <Volume2 className="h-5 w-5" aria-hidden />
          </button>

          {!revealed ? (
            <button
              type="button"
              onClick={() => setRevealedTrue()}
              className="group flex w-full flex-col items-center justify-center py-14 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
              aria-label="Karte aufdecken"
            >
              <span className="font-cjk text-6xl font-semibold tracking-wide sm:text-7xl">
                {currentItem.hanzi}
              </span>
              <span className="mt-8 rounded-full border border-dashed border-zinc-300 px-4 py-1.5 font-mono text-xs text-zinc-400 transition-colors group-hover:border-emerald-600/50 group-hover:text-emerald-700 dark:border-white/[0.12] dark:text-zinc-500 dark:group-hover:text-emerald-400">
                Leertaste zum Aufdecken
              </span>
            </button>
          ) : (
            <div className="reveal animate-pop-in flex flex-col items-center py-8 text-center">
              <span className="font-cjk text-4xl font-semibold">{currentItem.hanzi}</span>
              <span className="mt-4 font-mono text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                {currentItem.pinyin}
              </span>
              <span className="mt-2 text-lg text-zinc-800 dark:text-zinc-100">{currentItem.meaning}</span>
              {currentItem.notes && (
                <span className="mt-3 max-w-prose text-xs italic text-zinc-400 dark:text-zinc-500">
                  {currentItem.notes}
                </span>
              )}

              <div className="mt-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
                {GRADE_OPTIONS.map((option, i) => (
                  <button
                    key={option.grade}
                    type="button"
                    onClick={() => grade(i)}
                    className={`relative flex h-20 flex-col items-center justify-center gap-0.5 rounded-[1.25rem] border transition-all duration-150 ease-[var(--ease-spring)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${option.styleClass}`}
                  >
                    <span className="absolute left-2 top-1.5 font-mono text-[10px] text-current opacity-60">
                      {i + 1}
                    </span>
                    <span className="text-sm font-bold">{option.label}</span>
                    <span className="text-[11px] opacity-70">{option.sublabel}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <KeyHints
            hints={[
              ...(revealed
                ? ([['1–4', 'Bewerten'], ['↵', '„Gut“']] as [string, string][])
                : ([['␣', 'Aufdecken']] as [string, string][])),
              ['R', 'Audio'],
            ]}
          />
        </div>
      </section>
    </div>
  );
}
