import { useCallback, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  MessageSquareQuote,
  RefreshCw,
  RotateCcw,
  Trophy,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import sentencesData from '../data/sentences.json';
import { playToneSequence } from '../lib/audio';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';
import { shuffled } from '../lib/shuffle';

interface SentenceItem {
  id: string;
  german: string;
  pinyin: string;
  tokens: string[];
  explanation: string;
}

const SENTENCES: SentenceItem[] = sentencesData as SentenceItem[];
const ROUNDS_PER_SESSION = 5;

function initSession(): {
  sentences: SentenceItem[];
  available: string[];
} {
  const initial = shuffled(SENTENCES).slice(0, ROUNDS_PER_SESSION);
  return {
    sentences: initial,
    available: initial[0] ? shuffled(initial[0].tokens) : [],
  };
}

export function SentenceBuilderPage() {
  const [session, setSession] = useState(initSession);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>(session.available);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong' | 'summary'>('playing');
  const [showPinyin, setShowPinyin] = useState(false);
  const [score, setScore] = useState(0);

  // Initialisiert eine neue Session mit 5 zufälligen Sätzen
  const startSession = useCallback(() => {
    const newSession = initSession();
    setSession(newSession);
    setCurrentIndex(0);
    setScore(0);
    setSelectedTokens([]);
    setAvailableTokens(newSession.available);
    setStatus('playing');
    setShowPinyin(false);
  }, []);

  const sessionSentences = session.sentences;

  const currentSentence = sessionSentences[currentIndex];

  // Token auswählen (von Vorrat in den Satz)
  const addToken = (token: string, index: number) => {
    if (status !== 'playing') return;
    const newAvailable = [...availableTokens];
    newAvailable.splice(index, 1);
    setAvailableTokens(newAvailable);
    setSelectedTokens([...selectedTokens, token]);
  };

  // Token abwählen (vom Satz zurück in den Vorrat)
  const removeToken = (token: string, index: number) => {
    if (status !== 'playing') return;
    const newSelected = [...selectedTokens];
    newSelected.splice(index, 1);
    setSelectedTokens(newSelected);
    setAvailableTokens([...availableTokens, token]);
  };

  // Satz prüfen
  const checkAnswer = () => {
    if (!currentSentence || selectedTokens.length === 0) return;
    const isCorrect = selectedTokens.join('') === currentSentence.tokens.join('');

    if (isCorrect) {
      setStatus('correct');
      setScore((s) => s + 1);
      fireMicroBurst();
      playToneSequence([1, 4]); // Bestätigungston
    } else {
      setStatus('wrong');
      playToneSequence([3, 3]); // Fehlerton
    }
  };

  // Nächster Satz oder Zusammenfassung
  const nextSentence = () => {
    if (currentIndex + 1 < sessionSentences.length) {
      const nextIdx = currentIndex + 1;
      const nextItem = sessionSentences[nextIdx];
      setCurrentIndex(nextIdx);
      setSelectedTokens([]);
      setAvailableTokens(shuffled(nextItem.tokens));
      setStatus('playing');
      setShowPinyin(false);
    } else {
      setStatus('summary');
      fireCelebration();
    }
  };

  // Zurücksetzen des aktuellen Versuchs
  const resetCurrent = () => {
    if (!currentSentence) return;
    setSelectedTokens([]);
    setAvailableTokens(shuffled(currentSentence.tokens));
    setStatus('playing');
  };

  if (!currentSentence) return null;

  if (status === 'summary') {
    return (
      <div className="reveal mx-auto max-w-lg space-y-6 py-12 text-center" style={{ '--index': 0 } as CSSProperties}>
        <div className="flex justify-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-whisper">
            <Trophy className="h-10 w-10" />
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Runde abgeschlossen!</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Du hast {score} von {ROUNDS_PER_SESSION} Sätzen auf Anhieb richtig gebaut.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={startSession}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-whisper transition-all hover:bg-emerald-500 active:translate-y-px"
          >
            <RefreshCw className="h-4 w-4" />
            Noch eine Runde
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-5 py-3.5 text-sm font-semibold text-zinc-700 shadow-xs dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
          >
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-16">
      {/* Header */}
      <div className="reveal flex items-center justify-between" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <p className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            Grammatik & Satzbau
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Satzbau-Baukasten</h1>
        </div>
        <span className="rounded-full bg-zinc-100 px-3.5 py-1 font-mono text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          Satz {currentIndex + 1} von {ROUNDS_PER_SESSION}
        </span>
      </div>

      {/* Deutsche Vorgabe & Pinyin */}
      <div
        className="reveal relative rounded-[2rem] border border-zinc-200/80 bg-white p-7 text-center shadow-whisper dark:border-white/10 dark:bg-zinc-900"
        style={{ '--index': 1 } as CSSProperties}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500">
          Baue diesen deutschen Satz auf Chinesisch:
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
          „{currentSentence.german}“
        </h2>

        {showPinyin ? (
          <p className="mt-3 font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {currentSentence.pinyin}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setShowPinyin(true)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Pinyin-Tipp anzeigen
          </button>
        )}
      </div>

      {/* Gebauter Satz (Slots) */}
      <div
        className={`reveal min-h-24 rounded-3xl border-2 border-dashed p-5 transition-colors duration-200 ${
          status === 'wrong'
            ? 'animate-shake border-red-500/60 bg-red-500/5 dark:border-red-400/50'
            : 'border-zinc-300 bg-zinc-50/70 dark:border-zinc-700 dark:bg-zinc-950/40'
        }`}
        style={{ '--index': 2 } as CSSProperties}
      >
        {selectedTokens.length === 0 ? (
          <div className="flex h-14 items-center justify-center text-xs font-medium text-zinc-400">
            Klicke unten auf die Wortkarten, um den Satz zusammenzubauen
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {selectedTokens.map((token, i) => (
              <button
                key={`${token}-${i}`}
                type="button"
                onClick={() => removeToken(token, i)}
                disabled={status !== 'playing'}
                className="font-cjk group flex h-14 items-center justify-center rounded-2xl border border-emerald-600/30 bg-white px-4 text-2xl font-bold text-zinc-900 shadow-whisper transition-all duration-150 active:scale-95 hover:border-red-400 hover:bg-red-50 dark:border-emerald-400/30 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-red-950/30"
              >
                <span>{token}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Verfügbare Wortkarten */}
      <div className="reveal space-y-3" style={{ '--index': 3 } as CSSProperties}>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">
          Verfügbare Wortbausteine:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {availableTokens.map((token, i) => (
            <button
              key={`${token}-${i}`}
              type="button"
              onClick={() => addToken(token, i)}
              disabled={status !== 'playing'}
              className="font-cjk flex h-14 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white px-5 text-2xl font-bold text-zinc-800 shadow-whisper transition-all duration-150 active:scale-95 hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-emerald-400/40 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-300"
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback & Steuerung */}
      <div className="reveal flex flex-col items-center gap-4 pt-2" style={{ '--index': 4 } as CSSProperties}>
        {status === 'playing' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetCurrent}
              disabled={selectedTokens.length === 0}
              className="flex h-11 items-center gap-1.5 rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-600 shadow-xs hover:border-zinc-300 disabled:opacity-40 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <RotateCcw className="h-4 w-4" />
              Zurücksetzen
            </button>

            <button
              type="button"
              onClick={checkAnswer}
              disabled={selectedTokens.length === 0}
              className="flex h-12 items-center gap-2 rounded-2xl bg-emerald-600 px-7 text-sm font-bold text-white shadow-whisper transition-all hover:bg-emerald-500 disabled:opacity-40 active:translate-y-px"
            >
              <CheckCircle2 className="h-4 w-4" />
              Satz prüfen
            </button>
          </div>
        )}

        {status === 'correct' && (
          <div className="w-full space-y-4 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center dark:border-emerald-400/30 dark:bg-emerald-950/30">
            <div className="flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <span className="text-lg font-bold">Perfekt gelöst!</span>
            </div>
            <p className="font-mono text-base font-semibold text-emerald-700 dark:text-emerald-400">
              {currentSentence.tokens.join(' ')} · {currentSentence.pinyin}
            </p>
            <p className="mx-auto max-w-lg text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mr-1.5">Grammatik-Tipp</span>
              {currentSentence.explanation}
            </p>
            <button
              type="button"
              onClick={nextSentence}
              className="mt-2 inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-whisper transition-all hover:bg-emerald-500 active:translate-y-px"
            >
              Weiter zum nächsten Satz
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {status === 'wrong' && (
          <div className="w-full space-y-4 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center dark:border-red-400/30 dark:bg-red-950/30">
            <div className="flex items-center justify-center gap-2 text-red-800 dark:text-red-300">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              <span className="text-lg font-bold">Noch nicht ganz richtig</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Achte auf die Satzstellung (Zeit vor Verb, Modalverben und Fragepartikeln am Ende).
            </p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={resetCurrent}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-zinc-900 px-5 text-sm font-semibold text-white transition-all active:translate-y-px dark:bg-zinc-100 dark:text-zinc-900"
              >
                <RotateCcw className="h-4 w-4" />
                Nochmal probieren
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
