import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Check,
  Flame,
  Play,
  Timer,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { playAsset, playToneSequence } from '../lib/audio';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';
import { useProgressStore } from '../store/progressStore';
import { generateBlitzQuestions, type BlitzQuestion } from '../lib/blitzGenerator';
import { SessionSummary } from '../components/game/SessionSummary';
import { useKeyDown } from '../hooks/useKeyDown';
import { KeyHints } from '../components/ui/Kbd';
import { SealBadge } from '../components/ui/SealBadge';
import { KineticButton } from '../components/ui/KineticButton';

const TOTAL_TIME_SEC = 90;

export function BlitzPage() {
  const logSession = useProgressStore((s) => s.logSession);
  const [questions, setQuestions] = useState<BlitzQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SEC);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const answeredRef = useRef(answeredCount);
  const scoreRef = useRef(score);

  useEffect(() => {
    answeredRef.current = answeredCount;
  }, [answeredCount]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const startBlitz = useCallback(() => {
    const q = generateBlitzQuestions(20);
    setQuestions(q);
    setCurrentIdx(0);
    setTimeLeft(TOTAL_TIME_SEC);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setAnsweredCount(0);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setGameState('playing');
  }, []);

  // Timer-Countdown (unabhängig von Antworten/Score, um Reset-Freeze zu verhindern)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('ended');
          fireCelebration();
          void logSession({
            mode: 'blitz',
            answered: answeredRef.current,
            correct: scoreRef.current > 0 ? Math.round(scoreRef.current / 100) : 0,
            durationMs: TOTAL_TIME_SEC * 1000,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, logSession]);

  const currentQ = questions[currentIdx];

  // Audio abspielen bei Fragenwechsel
  useEffect(() => {
    if (gameState === 'playing' && currentQ?.audioUrl) {
      void playAsset(currentQ.audioUrl);
    }
  }, [gameState, currentQ]);

  // Antwort auswählen
  const handleAnswer = (option: string) => {
    if (selectedOption !== null || gameState !== 'playing' || !currentQ) return;

    setSelectedOption(option);
    const correct = option === currentQ.correctAnswer;
    setIsAnswerCorrect(correct);
    setAnsweredCount((c) => c + 1);

    if (correct) {
      const newStreak = streak + 1;
      const multiplier = Math.min(3, 1 + Math.floor(newStreak / 3) * 0.5);
      const points = Math.round(100 * multiplier);
      setScore((s) => s + points);
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      if (newStreak > 0 && newStreak % 5 === 0) fireMicroBurst();
      playToneSequence([1]);
    } else {
      setStreak(0);
      playToneSequence([4]);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setIsAnswerCorrect(null);
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx((i) => i + 1);
      } else {
        // Fragen-Nachschub
        setQuestions((prev) => [...prev, ...generateBlitzQuestions(10)]);
        setCurrentIdx((i) => i + 1);
      }
    }, 600);
  };

  useKeyDown((event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.repeat) return;

    if (gameState === 'intro' && event.key === 'Enter') {
      startBlitz();
      return;
    }

    if (gameState !== 'playing' || !currentQ || selectedOption !== null) return;

    if (event.code === 'Space' || event.key === 'r' || event.key === 'R') {
      if (currentQ.audioUrl) {
        event.preventDefault();
        void playAsset(currentQ.audioUrl);
      }
      return;
    }

    const digit = Number.parseInt(event.key, 10);
    if (digit >= 1 && digit <= currentQ.options.length) {
      handleAnswer(currentQ.options[digit - 1]);
    }
  });

  if (gameState === 'intro') {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-6 text-center">
        <div className="reveal flex justify-center" style={{ '--index': 0 } as CSSProperties}>
          <SealBadge sealChar="电" label="BLITZ-DRILL" variant="cinnabar" />
        </div>

        <section
          className="reveal double-bezel-casing shadow-whisper"
          style={{ '--index': 1 } as CSSProperties}
        >
          <div className="double-bezel-core p-7 sm:p-10 space-y-6 relative">
            <span className="watermark-glyph">电</span>

            <div className="space-y-2 relative">
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
                90-Sekunden-Blitz
              </h1>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Beantworte so viele Vokabel-, Pinyin- und Ton-Fragen wie möglich in 90 Sekunden.
                Halte deine Serie für Punkte-Multiplikatoren!
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 pt-2 relative">
              <KineticButton
                variant="primary"
                onClick={startBlitz}
                shortcut="[Enter]"
                icon={<Play className="h-4 w-4 fill-white" />}
              >
                Blitzsession starten
              </KineticButton>
              <Link
                to="/"
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Zurück zur Zentrale
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (gameState === 'ended') {
    const accuracy = answeredCount > 0 ? Math.round(((score / 100) / answeredCount) * 100) : 0;

    return (
      <SessionSummary
        headline="Zeit abgelaufen!"
        stats={[
          { label: 'Punkte', value: String(score) },
          { label: 'Beste Serie', value: String(bestStreak) },
          { label: 'Gelöst', value: String(answeredCount) },
          { label: 'Trefferquote', value: `${accuracy}%` },
        ]}
        onRestart={startBlitz}
        restartLabel="Nochmal spielen"
      />
    );
  }

  if (!currentQ) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-16">
      {/* Top Header Bar (Timer, Streak, Score) */}
      <div className="reveal flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-whisper dark:border-white/10 dark:bg-zinc-900" style={{ '--index': 0 } as CSSProperties}>
        {/* Timer */}
        <div className="flex items-center gap-2">
          <Timer className={`h-5 w-5 ${timeLeft <= 15 ? 'text-rose-500 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}`} />
          <span className={`font-mono text-lg font-bold tabular-nums ${timeLeft <= 15 ? 'text-rose-500 font-extrabold' : ''}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>

        {/* Streak Indicator */}
        <div className="flex items-center gap-1.5 font-mono text-sm font-bold">
          <Flame className={`h-4 w-4 ${streak > 0 ? 'text-amber-500 fill-amber-500 animate-bounce' : 'text-zinc-300 dark:text-zinc-700'}`} />
          <span>{streak}× Serie</span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1.5 font-mono text-base font-extrabold text-emerald-600 dark:text-emerald-400">
          <Zap className="h-4 w-4 fill-emerald-500 text-emerald-500" />
          <span>{score} Pkt</span>
        </div>
      </div>

      {/* Frage-Karte */}
      <section
        className="reveal double-bezel-casing shadow-whisper"
        style={{ '--index': 1 } as CSSProperties}
      >
        <div className="double-bezel-core p-8 text-center relative space-y-4">
          <span className="watermark-glyph">电</span>

          <div className="flex items-center justify-center gap-3 relative">
            <span className="font-cjk text-6xl font-black text-zinc-900 dark:text-zinc-50">
              {currentQ.item.hanzi}
            </span>
            {currentQ.audioUrl && (
              <button
                type="button"
                onClick={() => playAsset(currentQ.audioUrl!)}
                aria-label="Audio abspielen (␣)"
                title="Audio abspielen (␣)"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-emerald-600 shadow-xs transition-all hover:bg-emerald-50 active:scale-95 dark:border-white/10 dark:bg-zinc-800 dark:text-emerald-400 cursor-pointer"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            )}
          </div>

          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 relative">
            {currentQ.prompt}
          </p>
        </div>
      </section>

      {/* Antwort-Optionen */}
      <div className="reveal grid grid-cols-1 gap-3 sm:grid-cols-2" style={{ '--index': 2 } as CSSProperties}>
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = isAnswerCorrect && isSelected;
          const isWrong = isAnswerCorrect === false && isSelected;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleAnswer(option)}
              disabled={selectedOption !== null}
              className={`relative flex h-14 items-center justify-between rounded-2xl border-2 px-5 text-left text-sm font-semibold transition-all duration-150 select-none cursor-pointer active:scale-98 ${
                isCorrect
                  ? 'animate-pop-in border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/30 font-bold'
                  : isWrong
                    ? 'animate-shake border-rose-500 bg-rose-500 text-white font-bold'
                    : selectedOption !== null && option === currentQ.correctAnswer
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                      : 'border-zinc-200/80 bg-white text-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-zinc-400 dark:text-zinc-500">
                  [{idx + 1}]
                </span>
                <span>{option}</span>
              </div>
              {isCorrect && <Check className="h-5 w-5 text-white" />}
              {isWrong && <X className="h-5 w-5 text-white" />}
            </button>
          );
        })}
      </div>

      {/* KeyHints Footer */}
      <div className="flex justify-center pt-2">
        <KeyHints
          hints={[
            ['1–4', 'Schnell-Antwort'],
            ['␣ / R', 'Audio anhören'],
          ]}
        />
      </div>
    </div>
  );
}
