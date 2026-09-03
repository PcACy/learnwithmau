import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, Volume2 } from 'lucide-react';
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
import { PitchContour } from '../components/ui/PitchContour';
import { SealBadge } from '../components/ui/SealBadge';
import { KineticButton } from '../components/ui/KineticButton';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';

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

      if (correct) {
        fireMicroBurst();
      }

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
      fireCelebration();
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
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.repeat) return;

    if (phase === 'intro' && event.key === 'Enter') {
      startSession();
      return;
    }

    if (phase !== 'drill') return;

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
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="reveal flex items-center gap-2.5" style={{ '--index': 0 } as CSSProperties}>
          <SealBadge sealChar="听" label="HÖRTRAINING" variant="jade" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Pinyin &amp; Töne
          </span>
        </div>

        <section
          className="reveal double-bezel-casing shadow-whisper"
          style={{ '--index': 1 } as CSSProperties}
        >
          <div className="double-bezel-core p-7 sm:p-10 space-y-6 relative">
            <span className="watermark-glyph">听</span>

            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
                Pinyin Ear-Trainer
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Du hörst Silben und Wörter und antwortest komplett per Tastatur oder Klick – mal erkennst du nur
                den Ton einer Silbe, mal das ganze Wort unter ähnlichen Kandidaten.
              </p>
            </div>

            <ul className="space-y-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
              <li className="flex gap-3">
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">01</span>
                <span>{QUESTIONS_PER_SESSION} Fragen pro Session – fällige Vokabeln zuerst.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">02</span>
                <span>Zwei Fragetypen: Ton einer Silbe sowie Worterkennung unter ähnlichen Kandidaten.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">03</span>
                <span>Schnelle richtige Antwort zählt höher im SRS (Grade 5 unter 2,5 s).</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">04</span>
                <span>Töne werden lokal synthetisiert oder als echte Audio-Assets abgespielt.</span>
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
              <p className="mt-3 text-[11px] text-zinc-400 dark:text-zinc-500">
                Der Klick schaltet die Web-Audio-Engine im Browser frei.
              </p>
            </div>
          </div>
        </section>
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
      return 'border-zinc-200/80 bg-white hover:-translate-y-0.5 hover:border-emerald-600/40 text-zinc-800 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-emerald-400/30';
    }
    const isCorrect =
      question.kind === 'tone'
        ? question.data.options[index].tone === question.data.correctTone
        : question.options[index].id === question.target.id;
    const isSelected = drill.answeredOption === index;

    if (isCorrect) return 'border-emerald-600/60 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold';
    if (isSelected) return 'border-rose-500/60 bg-rose-500/10 text-rose-700 dark:text-rose-400';
    return 'border-zinc-200/50 bg-transparent text-zinc-400 opacity-40 dark:border-white/[0.04] dark:text-zinc-600';
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="reveal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ '--index': 0 } as CSSProperties}>
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <SealBadge sealChar="听" label="HÖRTRAINING" variant="jade" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Frage {drill.index + 1} / {drill.questions.length} · {isWordQuestion ? 'Wort erkennen' : 'Ton erkennen'}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-50">
            {isWordQuestion ? 'Welches Wort hast du gehört?' : 'Welchen Ton hast du gehört?'}
          </h1>
        </div>
        <span className="rounded-full border border-zinc-200/80 bg-white/90 px-3.5 py-1.5 font-mono text-xs font-bold tabular-nums text-zinc-600 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-300">
          {drill.correctCount} richtig
        </span>
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
        className="reveal double-bezel-casing shadow-whisper"
        style={{ '--index': 2 } as CSSProperties}
      >
        <div className="double-bezel-core p-7 sm:p-10 space-y-8 relative">
          <span className="watermark-glyph">听</span>

          <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-center relative">
            <button
              type="button"
              onClick={playCurrent}
              aria-label="Erneut abspielen"
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-white shadow-whisper transition-all duration-200 active:scale-95 cursor-pointer ${
                playing
                  ? 'bg-emerald-500 ring-4 ring-emerald-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              <Volume2 className={`h-8 w-8 ${playing ? 'animate-pulse-soft' : ''}`} aria-hidden />
            </button>
            {question.kind === 'tone' ? (
              <div>
                <p className="font-mono text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
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

          <div className={`gap-4 relative ${count === 4 ? 'grid grid-cols-2 sm:grid-cols-4' : 'grid grid-cols-2'}`}>
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
                className={`relative flex h-28 flex-col items-center justify-center gap-1 rounded-2xl border-2 transition-all duration-200 select-none cursor-pointer disabled:cursor-default ${optionStateClass(index)} ${answered ? '' : 'active:scale-95'}`}
              >
                <span className="absolute left-3 top-3 font-mono text-[11px] font-bold text-zinc-400 dark:text-zinc-500">
                  [{index + 1}]
                </span>
                {question.kind === 'tone' ? (
                  <>
                    <span className="text-3xl font-bold">{question.data.options[index].marked}</span>
                    <PitchContour tones={[question.data.options[index].tone]} size="sm" />
                  </>
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
            <div className="reveal rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-6 dark:border-white/[0.08] dark:bg-zinc-950/60 relative animate-pop-in">
              {(() => {
                const revealed = question.kind === 'tone' ? question.item : question.target;
                const highlightIndex = question.kind === 'tone' ? question.data.syllableIndex : -1;
                return (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-4">
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

                      <PitchContour
                        tones={revealed.syllables.map((s) => s.tone)}
                        syllables={revealed.syllables.map((s) => s.marked)}
                        size="sm"
                        showLabels={true}
                      />
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
                ['␣ / R', 'Audio wiederholen'],
                ...(answered ? ([['↵ Enter', 'Nächste Frage']] as [string, string][]) : []),
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
