import { useCallback, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import sentencesData from '../data/sentences.json';
import { playToneSequence } from '../lib/audio';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';
import { shuffled } from '../lib/shuffle';
import { SealBadge } from '../components/ui/SealBadge';
import { KineticButton } from '../components/ui/KineticButton';
import { SessionSummary } from '../components/game/SessionSummary';

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
  const [showHelp, setShowHelp] = useState(false);
  const [score, setScore] = useState(0);

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

  const addToken = (token: string, index: number) => {
    if (status !== 'playing') return;
    const newAvailable = [...availableTokens];
    newAvailable.splice(index, 1);
    setAvailableTokens(newAvailable);
    setSelectedTokens([...selectedTokens, token]);
  };

  const removeToken = (token: string, index: number) => {
    if (status !== 'playing') return;
    const newSelected = [...selectedTokens];
    newSelected.splice(index, 1);
    setSelectedTokens(newSelected);
    setAvailableTokens([...availableTokens, token]);
  };

  const checkAnswer = () => {
    if (!currentSentence || selectedTokens.length === 0) return;
    const isCorrect = selectedTokens.join('') === currentSentence.tokens.join('');

    if (isCorrect) {
      setStatus('correct');
      setScore((s) => s + 1);
      fireMicroBurst();
      playToneSequence([1, 4]);
    } else {
      setStatus('wrong');
      playToneSequence([3, 3]);
    }
  };

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

  const resetCurrent = () => {
    if (!currentSentence) return;
    setSelectedTokens([]);
    setAvailableTokens(shuffled(currentSentence.tokens));
    setStatus('playing');
  };

  if (!currentSentence) return null;

  if (status === 'summary') {
    const accuracy = Math.round((score / ROUNDS_PER_SESSION) * 100);
    return (
      <SessionSummary
        headline={score === ROUNDS_PER_SESSION ? 'Makelloser Satzbau!' : 'Runde abgeschlossen'}
        stats={[
          { label: 'Richtig', value: `${score} / ${ROUNDS_PER_SESSION}` },
          { label: 'Trefferquote', value: `${accuracy}%` },
          { label: 'Sätze', value: String(ROUNDS_PER_SESSION) },
        ]}
        onRestart={startSession}
        restartLabel="Neue Sätze bauen"
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20" aria-live="polite">
      {/* 1. Header */}
      <div
        className="reveal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{ '--index': 0 } as CSSProperties}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <SealBadge sealChar="句" label="SATZBAU-MEISTER" variant="jade" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Satz {currentIndex + 1} / {ROUNDS_PER_SESSION}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-50">
            SVO-Syntax-Baukasten
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-400 cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>{showHelp ? 'Hilfe schließen' : 'Tipps'}</span>
          </button>
          <span className="rounded-full border border-zinc-200/80 bg-white/90 px-3.5 py-1.5 font-mono text-xs font-bold tabular-nums text-zinc-600 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-300">
            Punkte: {score}
          </span>
        </div>
      </div>

      {/* Foldable Help */}
      {showHelp && (
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-4 text-xs text-zinc-600 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 space-y-1.5 animate-pop-in">
          <p className="font-bold text-zinc-900 dark:text-zinc-100">Satzbau-Regeln im Chinesischen:</p>
          <p>1. Grundstellung: Subjekt + Zeit + Ort + Verb + Objekt (z. B. <code className="font-mono bg-white dark:bg-zinc-800 px-1 py-0.5 rounded">我昨天在家看书</code>).</p>
          <p>2. Klicke auf die Wortblöcke unten, um sie in den Satz einzufügen oder herauszunehmen.</p>
        </div>
      )}

      {/* 2. Deutsche Satzvorgabe (Double-Bezel Casing) */}
      <section
        className="reveal double-bezel-casing shadow-whisper"
        style={{ '--index': 1 } as CSSProperties}
      >
        <div className="double-bezel-core p-7 sm:p-10 space-y-7 relative">
          {/* Authentic Calligraphy Watermark */}
          <span className="watermark-glyph">
            句
          </span>

          {/* Deutscher Ausgangssatz */}
          <div className="text-center space-y-3 relative">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
              Baue diesen Satz auf Chinesisch:
            </span>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              „{currentSentence.german}“
            </h2>

            {showPinyin ? (
              <p className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400 animate-pop-in">
                {currentSentence.pinyin}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setShowPinyin(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Pinyin-Hinweis anzeigen</span>
              </button>
            )}
          </div>

          {/* Gebauter Satz (Slots-Leiste) */}
          <div
            className={`min-h-24 rounded-2xl border-2 border-dashed p-4 transition-all duration-200 relative flex items-center justify-center ${
              status === 'wrong'
                ? 'animate-shake border-rose-500/60 bg-rose-500/5 dark:border-rose-400/50'
                : 'border-zinc-200/80 bg-zinc-50/70 dark:border-white/10 dark:bg-zinc-950/40'
            }`}
          >
            {selectedTokens.length === 0 ? (
              <p className="font-mono text-xs text-zinc-400 dark:text-zinc-500 text-center select-none">
                [Klicke auf die Wortbausteine unten, um den Satz zusammenzubauen]
              </p>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {selectedTokens.map((token, i) => (
                  <button
                    key={`${token}-${i}`}
                    type="button"
                    onClick={() => removeToken(token, i)}
                    disabled={status !== 'playing'}
                    className="group flex h-13 items-center justify-center rounded-xl border border-emerald-600/30 bg-white px-4 font-cjk text-2xl font-bold text-zinc-900 shadow-xs transition-all duration-150 active:scale-95 hover:border-rose-400 hover:bg-rose-50/50 dark:border-emerald-400/30 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-rose-950/20 cursor-pointer"
                  >
                    <span>{token}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Verfügbare Wortkarten */}
          <div className="space-y-2.5 relative">
            <p className="font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-500 text-center">
              Verfügbare Wortkarten:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {availableTokens.map((token, i) => (
                <button
                  key={`${token}-${i}`}
                  type="button"
                  onClick={() => addToken(token, i)}
                  disabled={status !== 'playing'}
                  className="flex h-13 items-center justify-center rounded-xl border border-zinc-200/80 bg-white px-4.5 font-cjk text-2xl font-bold text-zinc-800 shadow-xs transition-all duration-150 active:scale-95 hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300 cursor-pointer"
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          {/* Steuerung & Feedback */}
          <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.05] relative flex flex-col items-center gap-4">
            {status === 'playing' && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetCurrent}
                  disabled={selectedTokens.length === 0}
                  className="flex h-11 items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-600 shadow-xs hover:border-zinc-300 disabled:opacity-30 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Zurücksetzen
                </button>

                <KineticButton
                  variant="primary"
                  onClick={checkAnswer}
                  disabled={selectedTokens.length === 0}
                  icon={<CheckCircle2 className="h-4 w-4" />}
                >
                  Satz prüfen
                </KineticButton>
              </div>
            )}

            {status === 'correct' && (
              <div className="w-full space-y-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center dark:border-emerald-400/30 dark:bg-emerald-950/25 animate-pop-in">
                <div className="flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Grammatikalisch perfekt gelöst!</span>
                </div>
                <p className="font-mono text-base font-bold text-emerald-800 dark:text-emerald-300">
                  {currentSentence.tokens.join(' ')} · {currentSentence.pinyin}
                </p>
                <p className="mx-auto max-w-lg text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mr-1.5">
                    Didaktik
                  </span>
                  {currentSentence.explanation}
                </p>
                <div className="pt-2 flex justify-center">
                  <KineticButton
                    variant="primary"
                    onClick={nextSentence}
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    Nächster Satz
                  </KineticButton>
                </div>
              </div>
            )}

            {status === 'wrong' && (
              <div className="w-full space-y-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-center dark:border-rose-400/30 dark:bg-rose-950/25 animate-pop-in">
                <div className="flex items-center justify-center gap-2 text-rose-800 dark:text-rose-300 font-bold">
                  <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  <span>Noch nicht ganz richtig</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  Achte auf die Satzstellung (Zeit vor Ort/Verb, Modalverben und Fragepartikeln am Satzende).
                </p>
                <div className="pt-1 flex justify-center">
                  <KineticButton
                    variant="secondary"
                    onClick={resetCurrent}
                    icon={<RotateCcw className="h-4 w-4" />}
                  >
                    Nochmal probieren
                  </KineticButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
