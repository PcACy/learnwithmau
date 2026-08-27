import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  buildDrillQuestion,
  promptItemIds,
  type DrillKind,
  type DrillQuestion,
} from '../lib/numberDrill';
import { useKeyDown } from '../hooks/useKeyDown';
import { KeyHints } from '../components/ui/Kbd';
import { SessionSummary } from '../components/game/SessionSummary';
import { useProgressStore } from '../store/progressStore';

const QUESTIONS_PER_SESSION = 12;
const QUESTION_TIME_MS = 6000;
const FAST_ANSWER_MS = 3000;

const KINDS: readonly DrillKind[] = ['number', 'time', 'date'];

const KIND_LABELS: Record<DrillKind, string> = {
  number: 'Zahl',
  time: 'Uhrzeit',
  date: 'Datum',
};

type Phase = 'intro' | 'drill' | 'summary';

interface DrillState {
  questions: DrillQuestion[];
  index: number;
  answeredIndex: number | null;
  timedOut: boolean;
  questionStartedAt: number;
  correctCount: number;
  fastCount: number;
  sessionStartedAt: number;
  finishedAt: number | null;
}

function newSession(): DrillState {
  return {
    questions: Array.from({ length: QUESTIONS_PER_SESSION }, () =>
      buildDrillQuestion(KINDS[Math.floor(Math.random() * KINDS.length)]),
    ),
    index: 0,
    answeredIndex: null,
    timedOut: false,
    questionStartedAt: Date.now(),
    correctCount: 0,
    fastCount: 0,
    sessionStartedAt: Date.now(),
    finishedAt: null,
  };
}

export function NumberDrillPage() {
  const review = useProgressStore((s) => s.review);
  const logSession = useProgressStore((s) => s.logSession);

  const [phase, setPhase] = useState<Phase>('intro');
  const [drill, setDrill] = useState<DrillState | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());

  const drillRef = useRef<DrillState | null>(null);

  useEffect(() => {
    drillRef.current = drill;
  });

  const question = drill ? drill.questions[drill.index] : null;
  const answered = drill?.answeredIndex != null || drill?.timedOut === true;

  useEffect(() => {
    if (phase !== 'drill' || !drill || answered) return;
    const intervalId = window.setInterval(() => setNowTick(Date.now()), 100);
    return () => window.clearInterval(intervalId);
  }, [phase, drill, answered]);

  const startSession = useCallback(() => {
    setDrill(newSession());
    setPhase('drill');
  }, []);

  const answer = useCallback(
    async (optionIndex: number) => {
      const current = drillRef.current;
      if (!current) return;
      const currentQuestion = current.questions[current.index];
      if (current.answeredIndex != null || current.timedOut) return;

      const correct = optionIndex >= 0 && optionIndex === currentQuestion.correctIndex;
      const reactionMs = Date.now() - current.questionStartedAt;

      // Zuerst synchron locken (verhindert Doppel-Answers bei schnellen Tasten),
      // danach die SRS-Reviews sequentiell durchschreiben.
      setDrill({
        ...current,
        answeredIndex: optionIndex,
        timedOut: optionIndex < 0,
        correctCount: current.correctCount + (correct ? 1 : 0),
        fastCount: current.fastCount + (correct && reactionMs < FAST_ANSWER_MS ? 1 : 0),
      });

      if (correct) {
        const grade = reactionMs < FAST_ANSWER_MS ? 5 : 4;
        for (const itemId of promptItemIds(currentQuestion.prompt)) {
          await review(itemId, grade);
        }
      }
    },
    [review],
  );

  const next = useCallback(() => {
    const current = drillRef.current;
    if (!current || current.answeredIndex == null) return;

    const isLast = current.index === current.questions.length - 1;
    if (isLast) {
      const finishedAt = Date.now();
      void logSession({
        mode: 'number-drill',
        answered: current.questions.length,
        correct: current.correctCount,
        durationMs: finishedAt - current.sessionStartedAt,
      });
      setDrill({ ...current, finishedAt });
      setPhase('summary');
      return;
    }

    setDrill({
      ...current,
      index: current.index + 1,
      answeredIndex: null,
      timedOut: false,
      questionStartedAt: Date.now(),
    });
  }, [logSession]);

  useEffect(() => {
    if (phase !== 'drill' || !drill || answered) return;

    const elapsed = Date.now() - drill.questionStartedAt;
    const remaining = Math.max(0, QUESTION_TIME_MS - elapsed);
    const timeoutId = window.setTimeout(() => answer(-1), remaining);
    return () => window.clearTimeout(timeoutId);
  }, [phase, drill, answered, answer]);

  useKeyDown((event) => {
    if (phase !== 'drill' || event.metaKey || event.ctrlKey) return;
    if (event.repeat) return;

    if (event.key === 'Enter') {
      next();
      return;
    }
    const digit = Number.parseInt(event.key, 10);
    if (digit >= 1 && digit <= 4) answer(digit - 1);
  });

  if (phase === 'intro') {
    return (
      <div className="reveal mx-auto max-w-2xl py-6">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
          Modus 4 · Tempo
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Number &amp; Time Drill</h1>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          Schnellerkennung: Zahlen, Uhrzeiten und Daten erscheinen als Schriftzeichen – du wählst
          die passende Bedeutung unter Zeitdruck.
        </p>

        <ul className="mt-8 max-w-prose space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          <li className="flex gap-3"><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">01</span>{QUESTIONS_PER_SESSION} Fragen, je {QUESTION_TIME_MS / 1000} Sekunden – danach zählt die Frage als falsch.</li>
          <li className="flex gap-3"><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">02</span>Richtige Antwort unter {FAST_ANSWER_MS / 1000} s = SRS Grade 5, sonst 4.</li>
          <li className="flex gap-3"><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">03</span>Zahlen füttern direkt die SRS-Karten ihrer Schriftzeichen (一 bis 百).</li>
        </ul>

        <button
          type="button"
          onClick={startSession}
          className="mt-10 inline-flex h-12 items-center rounded-xl bg-emerald-600 px-7 text-sm font-semibold text-white transition-all duration-200 ease-[var(--ease-spring)] hover:bg-emerald-500 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          Session starten
        </button>
      </div>
    );
  }

  if (phase === 'summary' && drill) {
    return (
      <SessionSummary
        headline={drill.correctCount >= drill.questions.length - 2 ? 'Blitzschnell!' : 'Runde abgeschlossen'}
        stats={[
          { label: 'Richtig', value: `${drill.correctCount}/${drill.questions.length}` },
          { label: 'Blitzschnell', value: String(drill.fastCount) },
          { label: 'Dauer', value: `${(((drill.finishedAt ?? drill.sessionStartedAt) - drill.sessionStartedAt) / 60000).toFixed(1)} min` },
        ]}
        onRestart={startSession}
      />
    );
  }

  if (!drill || !question) return null;

  const elapsedMs = Math.max(0, nowTick - drill.questionStartedAt);
  const secondsLeft = Math.max(0, (QUESTION_TIME_MS - elapsedMs) / QUESTION_TIME_MS);

  return (
    <div className="mx-auto max-w-3xl space-y-6" aria-live="polite">
      <div className="reveal flex items-end justify-between gap-4" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
            Frage {drill.index + 1}/{drill.questions.length} · {KIND_LABELS[question.kind]}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Was bedeutet das?</h1>
        </div>
        <p className="font-mono text-sm tabular-nums text-zinc-500 dark:text-zinc-400">{drill.correctCount} richtig</p>
      </div>

      {!answered && (
        <div
          role="timer"
          aria-label="Countdown für diese Frage"
          className="reveal h-1.5 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800"
          style={{ '--index': 1 } as CSSProperties}
        >
          <div
            className={`h-full w-full origin-left rounded-full transition-transform duration-100 ease-linear ${
              secondsLeft > 0.3 ? 'bg-emerald-600/80' : 'bg-rose-500'
            }`}
            style={{ transform: `scaleX(${secondsLeft})` }}
          />
        </div>
      )}

      <section
        className="reveal rounded-[2.5rem] border border-zinc-200/70 bg-white p-7 shadow-whisper sm:p-9 dark:border-white/[0.06] dark:bg-zinc-900"
        style={{ '--index': 2 } as CSSProperties}
      >
        <p className="text-center font-cjk text-5xl font-semibold tracking-wide sm:text-6xl">{question.prompt}</p>

        <div className="mt-10 grid grid-cols-2 gap-4">
          {question.options.map((option, i) => {
            const isSelected = drill.answeredIndex === i;
            const showAsCorrect = answered && i === question.correctIndex;
            const showAsWrong = answered && isSelected && !showAsCorrect;

            let cls =
              'relative flex h-24 items-center justify-center rounded-[1.75rem] border transition-all duration-200 ease-[var(--ease-spring)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ';
            if (!answered) {
              cls +=
                'border-zinc-200/80 bg-zinc-50 hover:-translate-y-0.5 hover:border-emerald-600/35 active:translate-y-px dark:border-white/[0.08] dark:bg-zinc-950/40 dark:hover:border-emerald-400/30';
            } else if (showAsCorrect) {
              cls += 'border-emerald-500/60 bg-emerald-500/10';
            } else if (showAsWrong) {
              cls += 'border-rose-500/60 bg-rose-500/10';
            } else {
              cls += 'border-zinc-200/50 bg-transparent opacity-50 dark:border-white/[0.04]';
            }

            return (
              <button
                key={`${option}-${i}`}
                type="button"
                disabled={answered}
                onClick={() => answer(i)}
                aria-label={`Option ${i + 1}: ${option}`}
                className={cls}
              >
                <span className="absolute left-3 top-3 font-mono text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                  {i + 1}
                </span>
                <span className="font-mono text-2xl font-bold tabular-nums text-zinc-800 dark:text-zinc-100">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {answered && (
          <p
            className={`reveal mt-8 text-center text-sm font-semibold ${
              drill.answeredIndex === question.correctIndex
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {drill.timedOut
              ? 'Zeit abgelaufen!'
              : drill.answeredIndex === question.correctIndex
                ? 'Richtig!'
                : 'Leider daneben.'}
            {' '}
            <span className="font-normal text-zinc-500 dark:text-zinc-400">
              {question.prompt} = {question.options[question.correctIndex]}
            </span>
          </p>
        )}

        <div className="mt-8 flex justify-center">
          <KeyHints
            hints={[
              ['1–4', 'Antwort wählen'],
              ...(answered ? ([['↵', 'Nächste Frage']] as [string, string][]) : []),
            ]}
          />
        </div>
      </section>
    </div>
  );
}
