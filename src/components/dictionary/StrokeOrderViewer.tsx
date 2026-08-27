import { useCallback, useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit3,
  HelpCircle,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

interface StrokeOrderViewerProps {
  character: string;
  pinyin?: string;
  meaning?: string;
  size?: number;
}

type ViewerMode = 'animate' | 'step' | 'quiz';

export function StrokeOrderViewer({ character, pinyin, meaning, size = 190 }: StrokeOrderViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<HanziWriter | null>(null);

  const theme = useSettingsStore((s) => s.theme);
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const [mode, setMode] = useState<ViewerMode>('animate');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState<number>(0);
  const [quizStatus, setQuizStatus] = useState<'idle' | 'drawing' | 'success'>('idle');
  const [quizFeedback, setQuizFeedback] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const strokeColor = isDark ? '#34d399' : '#059669';
  const outlineColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)';
  const drawingColor = isDark ? '#6ee7b7' : '#10b981';
  const highlightColor = isDark ? '#38bdf8' : '#0284c7';

  // Hilfsfunktion: Setzt exakt die ersten `count` Striche sichtbar und verbirgt den Rest
  const setVisibleStrokes = useCallback((count: number, total: number) => {
    const writer = writerRef.current as any;
    if (!writer) return;

    writer.cancelQuiz();
    if (writer._renderState) {
      writer._renderState.cancelAll();
      const strokesObj: Record<number, { opacity: number; displayPortion: number }> = {};
      for (let i = 0; i < total; i++) {
        strokesObj[i] = {
          opacity: i < count ? 1 : 0,
          displayPortion: i < count ? 1 : 0,
        };
      }
      writer._renderState.updateState({
        character: {
          main: {
            opacity: 1,
            strokes: strokesObj,
          },
          outline: {
            opacity: 1,
          },
        },
        options: {
          showCharacter: true,
          showOutline: true,
        },
      });
    }
  }, []);

  // Initialisiere HanziWriter mit lokalem Data-Loader (100% Offline)
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    setLoading(true);
    setQuizStatus('idle');
    setQuizFeedback('');

    const writer = HanziWriter.create(containerRef.current, character, {
      width: size,
      height: size,
      padding: 16,
      strokeColor,
      outlineColor,
      drawingColor,
      highlightColor,
      drawingWidth: 18,
      showOutline: true,
      showCharacter: true,
      strokeAnimationSpeed: 1.1,
      delayBetweenStrokes: 180,
      charDataLoader: (char, onComplete, onErr) => {
        fetch(`/data/strokes/${encodeURIComponent(char)}.json`)
          .then((res) => {
            if (!res.ok) throw new Error(`Status ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (data && Array.isArray(data.strokes)) {
              setTotalStrokes(data.strokes.length);
            }
            onComplete(data);
          })
          .catch(() => {
            // Fallback auf CDN falls lokale Datei fehlt
            fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(char)}.json`)
              .then((r) => r.json())
              .then((data) => {
                if (data && Array.isArray(data.strokes)) setTotalStrokes(data.strokes.length);
                onComplete(data);
              })
              .catch(onErr);
          });
      },
      onLoadCharDataSuccess: () => {
        setLoading(false);
        setIsPlaying(true);
        void writer.animateCharacter({
          onComplete: () => setIsPlaying(false),
        });
      },
    });

    writerRef.current = writer;

    return () => {
      writer.cancelQuiz();
      writerRef.current = null;
    };
  }, [character, size, strokeColor, outlineColor, drawingColor, highlightColor]);

  // Startet oder wiederholt die gesamte Strichfolge-Animation
  const playAnimation = useCallback(() => {
    if (!writerRef.current) return;
    setMode('animate');
    setIsPlaying(true);
    writerRef.current.cancelQuiz();
    void writerRef.current.showOutline();
    void writerRef.current.showCharacter();
    void writerRef.current.animateCharacter({
      onComplete: () => setIsPlaying(false),
    });
  }, []);

  // Stoppt Animation
  const pauseAnimation = useCallback(() => {
    if (!writerRef.current) return;
    void writerRef.current.pauseAnimation();
    setIsPlaying(false);
  }, []);

  // Schritt-für-Schritt Strichanzeige mit echtem Strichaufbau
  const goToStep = useCallback(
    (step: number, animateCurrent = false) => {
      if (!writerRef.current || totalStrokes === 0) return;
      const targetStep = Math.max(0, Math.min(totalStrokes, step));
      setMode('step');
      setIsPlaying(false);

      if (animateCurrent && targetStep > 0) {
        // Erst vorherige Striche anzeigen, dann den aktuellen Strich animieren
        setVisibleStrokes(targetStep - 1, totalStrokes);
        void writerRef.current.animateStroke(targetStep - 1, {
          onComplete: () => {
            setVisibleStrokes(targetStep, totalStrokes);
          },
        });
      } else {
        setVisibleStrokes(targetStep, totalStrokes);
      }

      setCurrentStep(targetStep);
    },
    [totalStrokes, setVisibleStrokes],
  );

  // Startet den interaktiven Schreibtrainer (Quiz)
  const startQuiz = useCallback(() => {
    if (!writerRef.current || totalStrokes === 0) return;
    setMode('quiz');
    setIsPlaying(false);
    setQuizStatus('drawing');
    setQuizFeedback('Zeichne den 1. Strich');

    void writerRef.current.showOutline();
    void writerRef.current.hideCharacter();

    writerRef.current.quiz({
      onCorrectStroke: (strokeData) => {
        const next = strokeData.strokeNum + 2;
        if (next <= totalStrokes) {
          setQuizFeedback(`Strich ${strokeData.strokeNum + 1}/${totalStrokes} richtig! Weiter mit Strich ${next}.`);
        }
      },
      onMistake: (strokeData) => {
        setQuizFeedback(`Falsche Richtung oder falscher Strich (${strokeData.mistakesOnStroke}×). Tipp: Klicke auf „Hinweis“.`);
      },
      onComplete: (summary) => {
        setQuizStatus('success');
        setQuizFeedback(
          summary.totalMistakes === 0
            ? 'Perfekt fehlerfrei gezeichnet! 🎉'
            : `Klasse! Abgeschlossen mit ${summary.totalMistakes} Korrektur${summary.totalMistakes === 1 ? '' : 'en'}.`,
        );
      },
    });
  }, [totalStrokes]);

  // Hinweis im Schreibtrainer
  const showHint = useCallback(() => {
    if (!writerRef.current || mode !== 'quiz') return;
    void writerRef.current.animateStroke(currentStep);
  }, [mode, currentStep]);

  // Tastaturnavigation im Schrittmodus
  useEffect(() => {
    if (mode !== 'step') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToStep(currentStep - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToStep(currentStep + 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        goToStep(currentStep, true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, currentStep, goToStep]);

  return (
    <div className="flex flex-col items-center rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-5 dark:border-white/[0.08] dark:bg-zinc-950/40">
      {/* Header Info */}
      <div className="flex w-full items-center justify-between gap-3 border-b border-zinc-200/60 pb-3 dark:border-white/[0.06]">
        <div className="flex items-baseline gap-2.5">
          <span className="font-cjk text-3xl font-bold">{character}</span>
          {pinyin && <span className="font-mono text-base font-semibold text-emerald-700 dark:text-emerald-400">{pinyin}</span>}
          {meaning && <span className="text-xs text-zinc-500 dark:text-zinc-400">({meaning})</span>}
        </div>
        {totalStrokes > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-3 w-3" />
            {totalStrokes} Striche
          </span>
        )}
      </div>

      {/* Mode Tabs */}
      <div className="mt-3 flex w-full max-w-sm justify-center gap-1 rounded-xl bg-zinc-200/70 p-1 dark:bg-zinc-900" role="tablist">
        <button
          type="button"
          onClick={playAnimation}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
            mode === 'animate'
              ? 'bg-white text-zinc-900 shadow-whisper dark:bg-zinc-800 dark:text-zinc-100'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Play className="h-3.5 w-3.5" />
          Animation
        </button>

        <button
          type="button"
          onClick={() => goToStep(1, true)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
            mode === 'step'
              ? 'bg-white text-zinc-900 shadow-whisper dark:bg-zinc-800 dark:text-zinc-100'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Schrittweise
        </button>

        <button
          type="button"
          onClick={startQuiz}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
            mode === 'quiz'
              ? 'bg-white text-zinc-900 shadow-whisper dark:bg-zinc-800 dark:text-zinc-100'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Edit3 className="h-3.5 w-3.5" />
          Selbst schreiben
        </button>
      </div>

      {/* Mǐzìgé (米字格) Canvas Box */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Traditionelles Reisfeld-Raster */}
        <svg
          width={size}
          height={size}
          className="pointer-events-none absolute inset-0 text-zinc-300/80 dark:text-white/[0.08]"
          aria-hidden="true"
        >
          {/* Außenrahmen */}
          <rect x="2" y="2" width={size - 4} height={size - 4} fill="none" stroke="currentColor" strokeWidth="1.5" rx="8" />
          {/* Kreuzlinien (Horizontal & Vertikal) */}
          <line x1={size / 2} y1="2" x2={size / 2} y2={size - 2} stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="2" y1={size / 2} x2={size - 2} y2={size / 2} stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
          {/* Diagonale Linien */}
          <line x1="2" y1="2" x2={size - 2} y2={size - 2} stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={size - 2} y1="2" x2="2" y2={size - 2} stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
        </svg>

        {/* HanziWriter Render Container */}
        <div
          ref={containerRef}
          className="relative cursor-crosshair select-none touch-manipulation"
          style={{ width: size, height: size }}
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs dark:bg-zinc-900/70">
            <RefreshCw className="h-6 w-6 animate-spin text-emerald-600 dark:text-emerald-400" />
          </div>
        )}
      </div>

      {/* Modus-spezifische Controls */}
      <div className="flex w-full flex-col items-center gap-3">
        {mode === 'animate' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={isPlaying ? pauseAnimation : playAnimation}
              className="flex h-10 items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-5 text-xs font-semibold text-zinc-800 shadow-whisper transition-all hover:border-emerald-600/40 active:translate-y-px dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-100"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 text-zinc-500" />
                  Pausieren
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Ganze Animation abspielen
                </>
              )}
            </button>
          </div>
        )}

        {mode === 'step' && (
          <div className="flex w-full flex-col items-center gap-3.5">
            {/* Numerierte Strich-Buttons (Pills) */}
            {totalStrokes > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5" role="group" aria-label="Strich auswählen">
                {Array.from({ length: totalStrokes }, (_, i) => i + 1).map((strokeNum) => {
                  const isActive = currentStep === strokeNum;
                  const isPassed = currentStep > strokeNum;

                  return (
                    <button
                      key={strokeNum}
                      type="button"
                      onClick={() => goToStep(strokeNum, true)}
                      aria-label={`Strich ${strokeNum} anzeigen`}
                      aria-pressed={isActive}
                      className={`flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs font-bold transition-all duration-150 active:scale-95 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-whisper ring-2 ring-emerald-500/50 dark:bg-emerald-500 dark:text-zinc-950'
                          : isPassed
                            ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                            : 'border border-zinc-200/80 bg-white text-zinc-500 hover:border-zinc-300 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-400'
                      }`}
                    >
                      {strokeNum}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Stepper Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToStep(0)}
                disabled={currentStep === 0}
                title="Zurück zum leeren Zeichen (Strich 0)"
                aria-label="Zurück zum Anfang"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-700 shadow-whisper transition-all hover:border-emerald-600/40 disabled:opacity-30 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-200"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => goToStep(currentStep - 1, true)}
                disabled={currentStep <= 0}
                title="Vorheriger Strich"
                aria-label="Vorheriger Strich"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-700 shadow-whisper transition-all hover:border-emerald-600/40 disabled:opacity-30 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="min-w-28 text-center font-mono text-xs font-bold tabular-nums text-zinc-700 dark:text-zinc-200">
                {currentStep === 0
                  ? 'Leer (0 Striche)'
                  : currentStep === totalStrokes
                    ? `Vollständig (${totalStrokes})`
                    : `Strich ${currentStep} von ${totalStrokes}`}
              </span>

              <button
                type="button"
                onClick={() => goToStep(currentStep + 1, true)}
                disabled={currentStep >= totalStrokes}
                title="Nächster Strich"
                aria-label="Nächster Strich"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-700 shadow-whisper transition-all hover:border-emerald-600/40 disabled:opacity-30 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => goToStep(totalStrokes)}
                disabled={currentStep === totalStrokes}
                title="Alle Striche anzeigen"
                aria-label="Alle Striche anzeigen"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-700 shadow-whisper transition-all hover:border-emerald-600/40 disabled:opacity-30 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-200"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>

              {currentStep > 0 && currentStep <= totalStrokes && (
                <button
                  type="button"
                  onClick={() => goToStep(currentStep, true)}
                  title="Diesen Strich nochmals vorzeichnen"
                  aria-label="Strich wiederholen"
                  className="ml-1 flex h-9 items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-500/20 active:translate-y-px dark:text-emerald-300"
                >
                  <RotateCcw className="h-3 w-3" />
                  Vorzeichnen
                </button>
              )}
            </div>

            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Tipp: Nutze <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">←</kbd> / <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">→</kbd> oder klicke direkt auf die Strichnummern.
            </p>
          </div>
        )}

        {mode === 'quiz' && (
          <div className="flex flex-col items-center gap-2.5">
            <p className="min-h-5 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {quizFeedback}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={showHint}
                disabled={quizStatus === 'success'}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-white px-3.5 text-xs font-medium text-zinc-700 shadow-whisper hover:border-emerald-600/30 disabled:opacity-40 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-300"
              >
                <HelpCircle className="h-4 w-4 text-amber-500" />
                Hinweis
              </button>

              <button
                type="button"
                onClick={startQuiz}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-white px-3.5 text-xs font-medium text-zinc-700 shadow-whisper hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-300"
              >
                <RefreshCw className="h-3.5 w-3.5 text-zinc-500" />
                Nochmal
              </button>

              {quizStatus === 'success' && (
                <span className="flex items-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <Check className="h-4 w-4" />
                  Fertig
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
