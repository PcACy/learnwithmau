import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
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
import { SealBadge } from '../components/ui/SealBadge';
import { KineticButton } from '../components/ui/KineticButton';
import { playToneSequence } from '../lib/audio';
import { fireMicroBurst } from '../lib/confetti';

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
        fireMicroBurst();
        playToneSequence([1, 4]);
        const grade = reactionMs < FAST_ANSWER_MS ? 5 : 4;
        for (const itemId of promptItemIds(currentQuestion.prompt)) {
          await review(itemId, grade);
        }
      } else {
        playToneSequence([3, 3]);
      }
    },
    [review],
  );

  const next = useCallback(() => {
    const current = drillRef.current;
    if (!current || (current.answeredIndex == null && !current.timedOut)) return;

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
    if (event.metaKey || event.ctrlKey) return;
    if (event.repeat) return;

    if (phase === 'intro' && event.key === 'Enter') {
      startSession();
      return;
    }

    if (phase !== 'drill') return;

    if (event.key === 'Enter') {
      next();
      return;
    }
    const digit = Number.parseInt(event.key, 10);
    if (digit >= 1 && digit <= 4) answer(digit - 1);
  });

  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="reveal flex items-center gap-2.5" style={{ '--index': 0 } as CSSProperties}>
          <SealBadge sealChar="数" label="ZAHLEN & ZEIT" variant="jade" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Tempo-Drill
          </span>
        </div>

        <section
          className="reveal double-bezel-casing shadow-whisper"
          style={{ '--index': 1 } as CSSProperties}
        >
          <div className="double-bezel-core p-7 sm:p-10 space-y-6 relative">
            <span className="watermark-glyph">数</span>

            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
                Number &amp; Time Drill
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Schnellerkennung: Zahlen, Uhrzeiten und Daten erscheinen als Schriftzeichen – du wählst
                die passende Bedeutung unter Zeitdruck.
              </p>
            </div>

            <ul className="space-y-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
              <li className="flex gap-3">
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">01</span>
                <span>{QUESTIONS_PER_SESSION} Fragen, je {QUESTION_TIME_MS / 1000} Sekunden – danach zählt die Frage als falsch.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">02</span>
                <span>Richtige Antwort unter {FAST_ANSWER_MS / 1000} s = SRS Grade 5, sonst 4.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">03</span>
                <span>Zahlen füttern direkt die SRS-Karten ihrer Schriftzeichen (一 bis 百).</span>
              </li>
            </ul>

            <div className="pt-2">
              <KineticButton
                variant="primary"
                onClick={startSession}
                shortcut="[Enter]"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Session starten
              </KineticButton>
            </div>
          </div>
        </section>
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
      <div className="reveal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ '--index': 0 } as CSSProperties}>
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <SealBadge sealChar="数" label="ZAHLEN & ZEIT" variant="jade" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Frage {drill.index + 1} / {drill.questions.length} · {KIND_LABELS[question.kind]}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-50">
            Was bedeutet das?
          </h1>
        </div>
        <span className="rounded-full border border-zinc-200/80 bg-white/90 px-3.5 py-1.5 font-mono text-xs font-bold tabular-nums text-zinc-600 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-300">
          {drill.correctCount} richtig
        </span>
      </div>

      {!answered && (
        <div
          role="timer"
          aria-label="Countdown für diese Frage"
          className="reveal h-2 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800"
          style={{ '--index': 1 } as CSSProperties}
        >
          <div
            className={`h-full w-full origin-left rounded-full transition-transform duration-100 ease-linear ${
              secondsLeft > 0.3 ? 'bg-emerald-600' : 'bg-rose-500'
            }`}
            style={{ transform: `scaleX(${secondsLeft})` }}
          />
        </div>
      )}

      <section
        className="reveal double-bezel-casing shadow-whisper"
        style={{ '--index': 2 } as CSSProperties}
      >
        <div className="double-bezel-core p-7 sm:p-10 space-y-8 relative">
          <span className="watermark-glyph">数</span>

          <p className="text-center font-cjk text-6xl font-black tracking-wide text-zinc-900 dark:text-zinc-50 relative">
            {question.prompt}
          </p>

          <div className="grid grid-cols-2 gap-4 relative">
            {question.options.map((option, i) => {
              const isSelected = drill.answeredIndex === i;
              const showAsCorrect = answered && i === question.correctIndex;
              const showAsWrong = answered && isSelected && !showAsCorrect;

              let cls =
                'relative flex h-24 items-center justify-center rounded-2xl border-2 transition-all duration-200 select-none cursor-pointer ';
              if (!answered) {
                cls +=
                  'border-zinc-200/80 bg-white hover:-translate-y-0.5 hover:border-emerald-600/40 active:translate-y-px dark:border-white/[0.08] dark:bg-zinc-900';
              } else if (showAsCorrect) {
                cls += 'border-emerald-600/60 bg-emerald-500/10 font-bold';
              } else if (showAsWrong) {
                cls += 'border-rose-500/60 bg-rose-500/10';
              } else {
                cls += 'border-zinc-200/50 bg-transparent opacity-40 dark:border-white/[0.04]';
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
                  <span className="absolute left-3 top-3 font-mono text-[11px] font-bold text-zinc-400 dark:text-zinc-500">
                    [{i + 1}]
                  </span>
                  <span className="font-mono text-2xl font-bold tabular-nums text-zinc-800 dark:text-zinc-100">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div
              className={`rounded-2xl border p-4 text-center text-sm font-semibold animate-pop-in relative ${
                drill.answeredIndex === question.correctIndex
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300'
              }`}
            >
              <p className="font-bold">
                {drill.timedOut
                  ? 'Zeit abgelaufen!'
                  : drill.answeredIndex === question.correctIndex
                    ? 'Richtig gelöst!'
                    : 'Leider daneben.'}
              </p>
              <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-300 font-normal">
                {question.prompt} = {question.options[question.correctIndex]}
              </p>
            </div>
          )}

          {/* Steuerung & KeyHints */}
          <div className="pt-3 border-t border-zinc-100 dark:border-white/[0.05] relative flex flex-col items-center gap-4">
            {answered && (
              <KineticButton
                variant="primary"
                onClick={next}
                shortcut="[Enter]"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                {drill.index === drill.questions.length - 1 ? 'Zur Auswertung' : 'Nächste Frage'}
              </KineticButton>
            )}

            <KeyHints
              hints={[
                ['1–4', 'Antwort wählen'],
                ...(answered ? ([['↵ Enter', 'Nächste Frage']] as [string, string][]) : []),
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
