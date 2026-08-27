import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Volume2 } from 'lucide-react';
import type { Tone, VocabItem } from '../types/vocab';
import { VOCAB } from '../data';
import { playAsset, playToneSequence, primeAudio, stopCurrentAudio, syllableAssetUrl } from '../lib/audio';
import {
  buildToneQuestion,
  buildWordOptions,
  pickDrillItems,
  type ToneQuestion,
} from '../lib/drillGenerator';
import { shuffled } from '../lib/shuffle';
import { useKeyDown } from '../hooks/useKeyDown';
import { KeyHints } from '../components/ui/Kbd';
import { SessionSummary } from '../components/game/SessionSummary';
import { useProgressStore } from '../store/progressStore';

const QUESTIONS_PER_SESSION = 10;
const FAST_ANSWER_MS = 2500;
const WORD_QUESTION_SHARE = 0.4;

type Phase = 'intro' | 'drill' | 'summary';

type Question =
  | { kind: 'tone'; item: VocabItem; data: ToneQuestion }
  | { kind: 'word'; target: VocabItem; options: VocabItem[] };

interface DrillState {
  questions: Question[];
  index: number;
  answeredOption: number | null;
  questionStartedAt: number;
  correctCount: number;
  reactionSumMs: number;
  sessionStartedAt: number;
  finishedAt: number | null;
}

function questionTones(question: Question): Tone[] {
  if (question.kind === 'tone') return [question.data.correctTone];
  return question.target.syllables.map((syllable) => syllable.tone);
}

function questionAssetUrls(question: Question): string[] {
  if (question.kind === 'tone') {
    return [syllableAssetUrl(question.data.plain, question.data.correctTone)];
  }
  return question.target.audioPath ? [question.target.audioPath] : [];
}

function optionCount(question: Question): number {
  return question.kind === 'tone' ? question.data.options.length : question.options.length;
}

function questionItemId(question: Question): string {
  return question.kind === 'tone' ? question.item.id : question.target.id;
}

function newSession(cards: Parameters<typeof pickDrillItems>[0]): DrillState {
  const now = new Date();
  const items = pickDrillItems(cards, VOCAB, QUESTIONS_PER_SESSION, now);

  const questions: Question[] = shuffled(items).map((item) => {
    if (item.syllables.length >= 2 && Math.random() < WORD_QUESTION_SHARE) {
      return { kind: 'word', target: item, options: buildWordOptions(item, VOCAB) };
    }
    return { kind: 'tone', item, data: buildToneQuestion(item) };
  });

  return {
    questions,
    index: 0,
    answeredOption: null,
    questionStartedAt: Date.now(),
    correctCount: 0,
    reactionSumMs: 0,
    sessionStartedAt: Date.now(),
    finishedAt: null,
  };
}

export function EarTrainerPage() {
  const cards = useProgressStore((s) => s.cards);
  const review = useProgressStore((s) => s.review);
  const logSession = useProgressStore((s) => s.logSession);

  const [phase, setPhase] = useState<Phase>('intro');
  const [drill, setDrill] = useState<DrillState | null>(null);
  const [playing, setPlaying] = useState(false);
  const playTimerRef = useRef<number | undefined>(undefined);

  // Stoppt Audio beim Verlassen der Seite oder Demontage der Komponente
  useEffect(() => {
    return () => {
      stopCurrentAudio();
      if (playTimerRef.current !== undefined) {
        window.clearTimeout(playTimerRef.current);
      }
    };
  }, []);

  const playQuestionAudio = useCallback(async (q: Question) => {
    stopCurrentAudio();
    if (playTimerRef.current !== undefined) {
      window.clearTimeout(playTimerRef.current);
    }
    const unlockIn = (ms: number) => {
      playTimerRef.current = window.setTimeout(() => setPlaying(false), ms);
    };
    setPlaying(true);

    const urls = questionAssetUrls(q);
    for (const url of urls) {
      const started = await playAsset(url, () => setPlaying(false));
      if (started) return;
    }
    unlockIn(Math.max(300, playToneSequence(questionTones(q))));
  }, []);

  const question = drill ? drill.questions[drill.index] : null;
  const answered = drill?.answeredOption != null;

  const wasCorrect = useMemo(() => {
    if (!question || !answered || !drill) return false;
    if (question.kind === 'tone') {
      return question.data.options[drill.answeredOption!].tone === question.data.correctTone;
    }
    return question.options[drill.answeredOption!].id === question.target.id;
  }, [question, answered, drill]);

  const playCurrent = useCallback(() => {
    if (!question || playing) return;
    void playQuestionAudio(question);
  }, [question, playing, playQuestionAudio]);

  const startSession = useCallback(() => {
    primeAudio();
    const fresh = newSession(cards);
    setDrill(fresh);
    setPhase('drill');
    void playQuestionAudio(fresh.questions[0]);
  }, [cards, playQuestionAudio]);

  const answer = useCallback(
    (optionIndex: number) => {
      if (!drill || !question || answered || optionIndex >= optionCount(question)) return;

      const correct =
        question.kind === 'tone'
          ? question.data.options[optionIndex].tone === question.data.correctTone
          : question.options[optionIndex].id === question.target.id;

      const reactionMs = Date.now() - drill.questionStartedAt;
      const grade = !correct ? 1 : reactionMs < FAST_ANSWER_MS ? 5 : 4;
      void review(questionItemId(question), grade);

      setDrill({
        ...drill,
        answeredOption: optionIndex,
        correctCount: drill.correctCount + (correct ? 1 : 0),
        reactionSumMs: drill.reactionSumMs + reactionMs,
      });
    },
    [drill, question, answered, review],
  );

  const next = useCallback(() => {
    if (!drill || !answered) return;
    const isLast = drill.index === drill.questions.length - 1;
    if (isLast) {
      const finishedAt = Date.now();
      void logSession({
        mode: 'ear-trainer',
        answered: drill.questions.length,
        correct: drill.correctCount,
        durationMs: finishedAt - drill.sessionStartedAt,
      });
      setDrill({ ...drill, finishedAt });
      setPhase('summary');
      return;
    }
    const nextIndex = drill.index + 1;
    setDrill({
      ...drill,
      index: nextIndex,
      answeredOption: null,
      questionStartedAt: Date.now(),
    });
    void playQuestionAudio(drill.questions[nextIndex]);
  }, [drill, answered, logSession, playQuestionAudio]);

  useKeyDown((event) => {
    if (phase !== 'drill' || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.repeat) return;

    if (event.code === 'Space' || event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      playCurrent();
      return;
    }
    if (event.key === 'Enter') {
      next();
      return;
    }
    const digit = Number.parseInt(event.key, 10);
    if (digit >= 1 && digit <= (question ? optionCount(question) : 0)) answer(digit - 1);
  });

  if (phase === 'intro') {
    return (
      <div className="reveal mx-auto max-w-2xl py-6">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
          Modus 1 · Hören
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Pinyin Ear-Trainer</h1>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          Du hörst Silben und Wörter und antwortest komplett per Tastatur – mal erkennst du nur
          den Ton einer Silbe, mal das ganze Wort unter ähnlichen Kandidaten.
        </p>

        <ul className="mt-8 max-w-prose space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          <li className="flex gap-3"><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">01</span>{QUESTIONS_PER_SESSION} Fragen pro Session – fällige Vokabeln zuerst.</li>
          <li className="flex gap-3"><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">02</span>Zwei Fragetypen: Ton einer Silbe sowie Worterkennung unter ähnlichen Kandidaten.</li>
          <li className="flex gap-3"><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">03</span>Schnelle richtige Antwort zählt höher im SRS (Grade 5 unter 2,5 s).</li>
          <li className="flex gap-3"><span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">04</span>Töne werden lokal synthetisiert – echte Audio-Assets ersetzen sie automatisch, sobald sie unter <code>public/audio</code> liegen.</li>
        </ul>

        <button
          type="button"
          onClick={startSession}
          className="mt-10 inline-flex h-12 items-center rounded-xl bg-emerald-600 px-7 text-sm font-semibold text-white transition-all duration-200 ease-[var(--ease-spring)] hover:bg-emerald-500 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          Session starten
        </button>
        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
          Der erste Klick schaltet Audio frei (Browser-Richtlinie).
        </p>
      </div>
    );
  }

  if (phase === 'summary' && drill) {
    const avgReaction = drill.reactionSumMs / drill.questions.length / 1000;
    const minutes = ((drill.finishedAt ?? drill.sessionStartedAt) - drill.sessionStartedAt) / 60000;
    return (
      <SessionSummary
        headline={drill.correctCount >= drill.questions.length - 1 ? 'Scharfes Ohr!' : 'Runde abgeschlossen'}
        stats={[
          { label: 'Richtig', value: `${drill.correctCount}/${drill.questions.length}` },
          { label: 'Ø Reaktion', value: `${avgReaction.toFixed(1)} s` },
          { label: 'Dauer', value: `${minutes.toFixed(1)} min` },
        ]}
        onRestart={startSession}
      />
    );
  }

  if (!drill || !question) return null;

  const isWordQuestion = question.kind === 'word';
  const count = optionCount(question);

  const optionStateClass = (index: number): string => {
    if (!answered) {
      return 'border-zinc-200/80 bg-zinc-50 text-zinc-800 hover:-translate-y-0.5 hover:border-emerald-600/35 dark:border-white/[0.08] dark:bg-zinc-950/40 dark:text-zinc-100 dark:hover:border-emerald-400/30';
    }
    const isCorrect =
      question.kind === 'tone'
        ? question.data.options[index].tone === question.data.correctTone
        : question.options[index].id === question.target.id;
    const isSelected = drill.answeredOption === index;

    if (isCorrect) return 'border-emerald-500/60 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
    if (isSelected) return 'border-rose-500/60 bg-rose-500/10 text-rose-700 dark:text-rose-400';
    return 'border-zinc-200/50 bg-transparent text-zinc-400 dark:border-white/[0.04] dark:text-zinc-600';
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="reveal flex items-end justify-between gap-4" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
            Frage {drill.index + 1}/{drill.questions.length} · {isWordQuestion ? 'Wort erkennen' : 'Ton erkennen'}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {isWordQuestion ? 'Welches Wort hast du gehört?' : 'Welchen Ton hast du gehört?'}
          </h1>
        </div>
        <p className="font-mono text-sm tabular-nums text-zinc-500 dark:text-zinc-400">{drill.correctCount} richtig</p>
      </div>

      <div
        role="progressbar"
        aria-valuenow={drill.index}
        aria-valuemin={0}
        aria-valuemax={drill.questions.length}
        aria-label="Session-Fortschritt"
        className="reveal h-1.5 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800"
        style={{ '--index': 1 } as CSSProperties}
      >
        <div
          className="h-full w-full origin-left rounded-full bg-emerald-600/80 transition-transform duration-500 ease-[var(--ease-spring)]"
          style={{ transform: `scaleX(${drill.index / drill.questions.length})` }}
        />
      </div>

      <section
        className="reveal rounded-[2.5rem] border border-zinc-200/70 bg-white p-7 shadow-whisper sm:p-9 dark:border-white/[0.06] dark:bg-zinc-900"
        style={{ '--index': 2 } as CSSProperties}
      >
        <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={playCurrent}
            aria-label="Erneut abspielen"
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-white shadow-whisper transition-all duration-200 ease-[var(--ease-spring)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
              playing
                ? 'bg-emerald-500 ring-4 ring-emerald-500/25'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            <Volume2 className={`h-8 w-8 ${playing ? 'animate-pulse-soft' : ''}`} aria-hidden />
          </button>
          {question.kind === 'tone' ? (
            <div>
              <p className="font-mono text-3xl font-bold tracking-tight">
                {question.data.plain}
                <span className="text-zinc-300 dark:text-zinc-600">_</span>
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Silbe {question.data.syllableIndex + 1} aus „{question.item.hanzi}“ ({question.item.meaning})
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Du hörst ein mehrsilbiges HSK-1-Wort – wähle das passende.
            </p>
          )}
        </div>

        <div className={`mt-8 gap-4 ${count === 4 ? 'grid grid-cols-2 sm:grid-cols-4' : 'grid grid-cols-2'}`}>
          {(question.kind === 'tone'
            ? question.data.options.map((option, i) => ({ key: `${option.marked}-${option.tone}`, index: i }))
            : question.options.map((option, i) => ({ key: option.id, index: i }))
          ).map(({ key, index }) => (
            <button
              key={key}
              type="button"
              disabled={answered}
              onClick={() => answer(index)}
              aria-label={`Option ${index + 1}`}
              className={`relative flex h-28 flex-col items-center justify-center gap-1 rounded-[1.75rem] border transition-all duration-200 ease-[var(--ease-spring)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-default ${optionStateClass(index)} ${answered ? '' : 'active:translate-y-px'}`}
            >
              <span className="absolute left-3 top-3 font-mono text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                {index + 1}
              </span>
              {question.kind === 'tone' ? (
                <span className="text-4xl font-bold">{question.data.options[index].marked}</span>
              ) : (
                <>
                  <span className="font-cjk text-3xl font-semibold">{question.options[index].hanzi}</span>
                  <span className="font-mono text-xs text-current opacity-70">{question.options[index].pinyin}</span>
                </>
              )}
            </button>
          ))}
        </div>

        {answered && (
          <div className="reveal mt-8 rounded-[1.75rem] border border-zinc-200/70 bg-zinc-50 p-6 dark:border-white/[0.06] dark:bg-zinc-950/50">
            {(() => {
              const revealed = question.kind === 'tone' ? question.item : question.target;
              const highlightIndex = question.kind === 'tone' ? question.data.syllableIndex : -1;
              return (
                <>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="font-cjk text-4xl font-semibold">{revealed.hanzi}</span>
                    <span className="font-mono text-lg text-zinc-600 dark:text-zinc-300">
                      {revealed.syllables.map((syl, i) => (
                        <span
                          key={i}
                          className={
                            i === highlightIndex ? 'font-bold text-emerald-700 dark:text-emerald-400' : undefined
                          }
                        >
                          {i > 0 ? '\u00A0' : ''}
                          {syl.marked}
                        </span>
                      ))}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{revealed.meaning}</p>
                  <p
                    className={`mt-3 text-sm font-semibold ${
                      wasCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {wasCorrect
                      ? 'Richtig!'
                      : question.kind === 'tone'
                        ? `Das war der ${
                            question.data.options[drill.answeredOption!].tone === 5
                              ? 'neutrale'
                              : `${question.data.options[drill.answeredOption!].tone}.`
                          } Ton – gehört hast du den ${
                            question.data.correctTone === 5 ? 'neutralen' : `${question.data.correctTone}.`
                          }.`
                        : 'Leider daneben – vergleiche die Tonmuster der Kandidaten.'}
                  </p>
                </>
              );
            })()}
          </div>
        )}

        <div className="mt-8">
          <KeyHints
            hints={[
              ['1–4', 'Antwort wählen'],
              ['␣ / R', 'Audio wiederholen'],
              ...(answered ? ([['↵', 'Nächste Frage']] as [string, string][]) : []),
            ]}
          />
        </div>
      </section>
    </div>
  );
}
