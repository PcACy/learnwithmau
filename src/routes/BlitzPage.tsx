import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Check,
  Flame,
  Play,
  RefreshCw,
  Timer,
  Trophy,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { VOCAB } from '../data';
import { playAsset, playToneSequence } from '../lib/audio';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';
import { shuffled } from '../lib/shuffle';
import { useProgressStore } from '../store/progressStore';
import type { VocabItem } from '../types/vocab';

interface BlitzQuestion {
  id: string;
  type: 'meaning' | 'pinyin' | 'tone';
  item: VocabItem;
  prompt: string;
  options: string[];
  correctAnswer: string;
  audioUrl?: string | null;
}

const TOTAL_TIME_SEC = 90;

function generateBlitzQuestions(count = 15): BlitzQuestion[] {
  const shuffledVocab = shuffled(VOCAB);
  const questions: BlitzQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const item = shuffledVocab[i % shuffledVocab.length];
    const qType: 'meaning' | 'pinyin' | 'tone' = i % 3 === 0 ? 'tone' : i % 3 === 1 ? 'meaning' : 'pinyin';

    if (qType === 'meaning') {
      const correct = item.meaning.split(',')[0].trim();
      const distinctDistractors = Array.from(
        new Set(
          VOCAB.map((v) => v.meaning.split(',')[0].trim()).filter((m) => m !== correct),
        ),
      );
      const distractors = shuffled(distinctDistractors).slice(0, 3);
      const options = shuffled([correct, ...distractors]);

      questions.push({
        id: `blitz-${i}`,
        type: 'meaning',
        item,
        prompt: `Welche Bedeutung hat „${item.hanzi}“?`,
        options,
        correctAnswer: correct,
        audioUrl: item.audioPath,
      });
    } else if (qType === 'pinyin') {
      const correct = item.pinyin;
      const distinctDistractors = Array.from(
        new Set(
          VOCAB.map((v) => v.pinyin).filter((p) => p !== correct),
        ),
      );
      const distractors = shuffled(distinctDistractors).slice(0, 3);
      const options = shuffled([correct, ...distractors]);

      questions.push({
        id: `blitz-${i}`,
        type: 'pinyin',
        item,
        prompt: `Welches Pinyin passt zu „${item.hanzi}“?`,
        options,
        correctAnswer: correct,
        audioUrl: item.audioPath,
      });
    } else {
      const firstTone = item.syllables[0]?.tone ?? 1;
      const toneNames: Record<number, string> = {
        1: 'Ton 1 (ˉ)',
        2: 'Ton 2 (ˊ)',
        3: 'Ton 3 (ˇ)',
        4: 'Ton 4 (ˋ)',
        5: 'Neutraler Ton',
      };
      const correct = toneNames[firstTone] || 'Ton 1 (ˉ)';
      const standardOptions = ['Ton 1 (ˉ)', 'Ton 2 (ˊ)', 'Ton 3 (ˇ)', 'Ton 4 (ˋ)'];
      const options = firstTone === 5
        ? shuffled(['Neutraler Ton', 'Ton 1 (ˉ)', 'Ton 2 (ˊ)', 'Ton 4 (ˋ)'])
        : standardOptions;

      questions.push({
        id: `blitz-${i}`,
        type: 'tone',
        item,
        prompt: `Welchen Ton hat die erste Silbe von „${item.hanzi}“ (${item.syllables[0]?.plain})?`,
        options,
        correctAnswer: correct,
        audioUrl: item.audioPath,
      });
    }
  }

  return questions;
}

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

  // Timer-Countdown
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
            answered: answeredCount,
            correct: score > 0 ? Math.round(score / 100) : 0,
            durationMs: TOTAL_TIME_SEC * 1000,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, answeredCount, score, logSession]);

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
      <div className="reveal mx-auto max-w-lg space-y-6 py-12 text-center" style={{ '--index': 0 } as CSSProperties}>
        <div className="flex justify-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 shadow-whisper">
            <Trophy className="h-10 w-10 fill-amber-500" />
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Zeit abgelaufen!</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Klasse Durchlauf! Hier ist deine Auswertung:
          </p>
        </div>

        {/* Score Card */}
        <div className="grid grid-cols-4 gap-2 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-whisper dark:border-white/10 dark:bg-zinc-900">
          <div>
            <p className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">{score}</p>
            <p className="text-[10px] text-zinc-400">Punkte</p>
          </div>
          <div>
            <p className="font-mono text-xl font-bold text-amber-500">{bestStreak}</p>
            <p className="text-[10px] text-zinc-400">Beste Serie</p>
          </div>
          <div>
            <p className="font-mono text-xl font-bold text-zinc-800 dark:text-zinc-200">{answeredCount}</p>
            <p className="text-[10px] text-zinc-400">Gelöst</p>
          </div>
          <div>
            <p className="font-mono text-xl font-bold text-sky-500">{accuracy}%</p>
            <p className="text-[10px] text-zinc-400">Genauigkeit</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={startBlitz}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-whisper transition-all hover:bg-emerald-500 active:translate-y-px"
          >
            <RefreshCw className="h-4 w-4" />
            Nochmal spielen
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-5 py-3.5 text-sm font-semibold text-zinc-700 shadow-xs dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
          >
            Zurück zum Arcade
          </Link>
        </div>
      </div>
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
