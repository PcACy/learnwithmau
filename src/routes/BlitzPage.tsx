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
  answeredRef.current = answeredCount;
  const scoreRef = useRef(score);
  scoreRef.current = score;

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

  if (gameState === 'intro') {
    return (
      <div className="reveal mx-auto max-w-lg space-y-6 py-12 text-center" style={{ '--index': 0 } as CSSProperties}>
        <div className="flex justify-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 shadow-whisper">
            <Zap className="h-10 w-10 fill-amber-500" />
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">2-Minuten-Blitzsession</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Beantworte so viele Vokabel-, Pinyin- und Ton-Fragen wie möglich in 90 Sekunden.
            Halte deine Serie für Punkte-Multiplikatoren!
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={startBlitz}
            className="flex h-14 items-center gap-2 rounded-2xl bg-emerald-600 px-8 text-base font-bold text-white shadow-whisper transition-all hover:bg-emerald-500 active:translate-y-px"
          >
            <Play className="h-5 w-5 fill-white" />
            Blitzsession starten
          </button>
          <Link
            to="/"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Abbrechen
          </Link>
        </div>
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
      <div className="reveal flex items-center justify-between rounded-3xl border border-zinc-200/80 bg-white p-4 shadow-whisper dark:border-white/10 dark:bg-zinc-900" style={{ '--index': 0 } as CSSProperties}>
        {/* Timer */}
        <div className="flex items-center gap-2">
          <Timer className={`h-5 w-5 ${timeLeft <= 15 ? 'text-red-500 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}`} />
          <span className={`font-mono text-lg font-bold tabular-nums ${timeLeft <= 15 ? 'text-red-500' : ''}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>

        {/* Streak Indicator */}
        <div className="flex items-center gap-1.5 font-mono text-sm font-bold">
          <Flame className={`h-4 w-4 ${streak > 0 ? 'text-amber-500 fill-amber-500' : 'text-zinc-300 dark:text-zinc-700'}`} />
          <span>{streak}× Serie</span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1.5 font-mono text-base font-extrabold text-emerald-600 dark:text-emerald-400">
          <Zap className="h-4 w-4 fill-emerald-500 text-emerald-500" />
          <span>{score} Pkt</span>
        </div>
      </div>

      {/* Frage-Karte */}
      <div
        className="reveal flex flex-col items-center rounded-[2.5rem] border border-zinc-200/80 bg-white p-8 text-center shadow-whisper dark:border-white/10 dark:bg-zinc-900"
        style={{ '--index': 1 } as CSSProperties}
      >
        <div className="flex items-center gap-2">
          <span className="font-cjk text-6xl font-extrabold text-zinc-900 dark:text-zinc-100">
            {currentQ.item.hanzi}
          </span>
          {currentQ.audioUrl && (
            <button
              type="button"
              onClick={() => playAsset(currentQ.audioUrl!)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          )}
        </div>

        <p className="mt-4 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          {currentQ.prompt}
        </p>
      </div>

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
              className={`flex h-14 items-center justify-between rounded-2xl border px-5 text-left text-sm font-semibold transition-all duration-150 active:scale-98 ${
                isCorrect
                  ? 'animate-pop-in border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/30'
                  : isWrong
                    ? 'animate-shake border-red-500 bg-red-500 text-white'
                    : selectedOption !== null && option === currentQ.correctAnswer
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                      : 'border-zinc-200/80 bg-white text-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{option}</span>
              {isCorrect && <Check className="h-5 w-5 text-white" />}
              {isWrong && <X className="h-5 w-5 text-white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
