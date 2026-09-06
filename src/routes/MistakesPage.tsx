import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Headphones,
  Keyboard,
  Layers,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  Volume2,
  Zap,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { VOCAB_BY_ID } from '../data';
import {
  filterActiveMistakes,
  filterResolvedMistakes,
  generateMistakeDrillBatch,
  isPinyinAnswerCorrect,
  REQUIRED_CONSECUTIVE_CORRECT,
} from '../lib/mistakeBank';
import type { MistakeDrillQuestion, MistakeSourceMode } from '../types/mistake';
import { playMandarinWithFallback, playToneSequence, stopCurrentAudio } from '../lib/audio';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';
import { useKeyDown } from '../hooks/useKeyDown';
import { SealBadge } from '../components/ui/SealBadge';
import { KineticButton } from '../components/ui/KineticButton';

const SOURCE_LABELS: Record<MistakeSourceMode, { label: string; icon: typeof Zap }> = {
  blitz: { label: 'Blitz', icon: Zap },
  exam: { label: 'Prüfung', icon: GraduationCap },
  typeracer: { label: 'TypeRacer', icon: Keyboard },
  'ear-trainer': { label: 'EarTrainer', icon: Headphones },
  review: { label: 'Review', icon: Layers },
};

const BATCH_SIZE = 5;

export function MistakesPage() {
  const mistakes = useProgressStore((s) => s.mistakes);
  const answerMistakeDrill = useProgressStore((s) => s.answerMistakeDrill);
  const clearResolvedMistakes = useProgressStore((s) => s.clearResolvedMistakes);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'drill' | 'catalog'>('drill');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogSourceFilter, setCatalogSourceFilter] = useState<string>('all');

  const activeMistakes = useMemo(() => filterActiveMistakes(mistakes), [mistakes]);
  const resolvedMistakes = useMemo(() => filterResolvedMistakes(mistakes), [mistakes]);

  // Drill State
  const [batchQuestions, setBatchQuestions] = useState<MistakeDrillQuestion[]>(() => {
    const initialActive = filterActiveMistakes(useProgressStore.getState().mistakes);
    return generateMistakeDrillBatch(initialActive, VOCAB_BY_ID, BATCH_SIZE);
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedInput, setTypedInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [resolvedInSession, setResolvedInSession] = useState<string[]>([]);
  const [batchFinished, setBatchFinished] = useState(false);
  const [batchCorrectCount, setBatchCorrectCount] = useState(0);

  // Audio cleanup
  useEffect(() => {
    return () => stopCurrentAudio();
  }, []);

  // Initialisiere oder erneuere Batch
  const startNewBatch = useCallback(() => {
    stopCurrentAudio();
    const freshActive = filterActiveMistakes(useProgressStore.getState().mistakes);
    if (freshActive.length === 0) {
      setBatchQuestions([]);
      setBatchFinished(false);
      return;
    }
    const questions = generateMistakeDrillBatch(freshActive, VOCAB_BY_ID, BATCH_SIZE);
    setBatchQuestions(questions);
    setCurrentIdx(0);
    setSelectedOption(null);
    setTypedInput('');
    setIsAnswered(false);
    setLastCorrect(null);
    setBatchFinished(false);
    setBatchCorrectCount(0);
  }, []);

  useEffect(() => {
    if (batchQuestions.length === 0 && activeMistakes.length > 0 && !batchFinished) {
      const timer = window.setTimeout(() => {
        startNewBatch();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [activeMistakes.length, batchQuestions.length, batchFinished, startNewBatch]);

  const currentQ: MistakeDrillQuestion | undefined = batchQuestions[currentIdx];
  const currentMistakeRecord = currentQ ? mistakes[currentQ.itemId] : undefined;

  // Audio automatisch bei Höraufgaben abspielen
  useEffect(() => {
    if (currentQ && currentQ.type === 'audio_listening' && !isAnswered) {
      void playMandarinWithFallback(currentQ.audioText);
    }
  }, [currentQ, isAnswered]);

  const handlePlayAudio = useCallback(() => {
    if (!currentQ) return;
    void playMandarinWithFallback(currentQ.audioText);
  }, [currentQ]);

  // Antwort abgeben
  const submitAnswer = useCallback(
    async (answer: string) => {
      if (isAnswered || !currentQ) return;

      const vocab = VOCAB_BY_ID.get(currentQ.itemId);
      if (!vocab) return;

      let correct = false;
      if (currentQ.type === 'pinyin_input') {
        correct = isPinyinAnswerCorrect(answer, vocab);
      } else {
        correct = answer === currentQ.correctAnswer;
      }

      setIsAnswered(true);
      setLastCorrect(correct);
      if (currentQ.type !== 'pinyin_input') {
        setSelectedOption(answer);
      }

      if (correct) {
        setBatchCorrectCount((c) => c + 1);
        fireMicroBurst();
        playToneSequence([1]);
      } else {
        playToneSequence([4]);
      }

      // Vokabel synchron aussprechen
      void playMandarinWithFallback(currentQ.audioText);

      const result = await answerMistakeDrill(currentQ.itemId, correct);
      if (result.resolved) {
        setResolvedInSession((prev) => [...prev, currentQ.itemId]);
      }
    },
    [isAnswered, currentQ, answerMistakeDrill],
  );

  // Weiter zur nächsten Frage im Batch
  const handleNext = useCallback(() => {
    stopCurrentAudio();
    if (currentIdx + 1 >= batchQuestions.length) {
      setBatchFinished(true);
      fireCelebration();
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setTypedInput('');
      setIsAnswered(false);
      setLastCorrect(null);
    }
  }, [currentIdx, batchQuestions.length]);

  // Globale Shortcuts (1-4 für Optionen, Enter zum Bestätigen/Weiter)
  useKeyDown((event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    if (activeTab !== 'drill' || !currentQ || batchFinished) return;

    if (isAnswered) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleNext();
      }
      return;
    }

    if (currentQ.type !== 'pinyin_input' && currentQ.options) {
      const num = Number.parseInt(event.key, 10);
      if (num >= 1 && num <= currentQ.options.length) {
        event.preventDefault();
        void submitAnswer(currentQ.options[num - 1]);
      }
    }
  });

  // Filterung für Fehler-Katalog
  const filteredCatalogMistakes = useMemo(() => {
    return activeMistakes.filter((m) => {
      const v = VOCAB_BY_ID.get(m.itemId);
      if (!v) return false;

      if (catalogSourceFilter !== 'all' && m.lastSourceMode !== catalogSourceFilter) {
        return false;
      }

      if (catalogSearch.trim()) {
        const query = catalogSearch.toLowerCase().trim();
        const matchesHanzi = v.hanzi.includes(query);
        const matchesPinyin = v.pinyin.toLowerCase().includes(query);
        const matchesMeaning = v.meaning.toLowerCase().includes(query);
        return matchesHanzi || matchesPinyin || matchesMeaning;
      }

      return true;
    });
  }, [activeMistakes, catalogSourceFilter, catalogSearch]);

  return (
    <div className="space-y-8 pb-24 max-w-5xl mx-auto">
      {/* 1. Header & Navigation Pills */}
      <div
        className="reveal flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/80 dark:border-white/[0.08] pb-6"
        style={{ '--index': 0 } as CSSProperties}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <SealBadge sealChar="错" label="SCHWACHSTELLEN · 错题本" variant="cinnabar" />
            {activeMistakes.length > 0 && (
              <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-rose-700 dark:text-rose-400 border border-rose-500/20">
                {activeMistakes.length} offen
              </span>
            )}
            {resolvedMistakes.length > 0 && (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                {resolvedMistakes.length} gemeistert
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
            Schwachstellen-Trainer
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Fehler aus allen Spielmodi werden automatisch erfasst. Löse eine Vokabel{' '}
            <strong className="text-emerald-700 dark:text-emerald-400">2x in Folge fehlerfrei</strong>, um sie nachhaltig aus der Fehlerbank zu bereinigen.
          </p>
        </div>

        {/* Tab-Wechsler */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('drill')}
            className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'drill'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                : 'border border-zinc-200/80 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400'
            }`}
          >
            Drill-Arena
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'catalog'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                : 'border border-zinc-200/80 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400'
            }`}
          >
            Fehler-Katalog ({activeMistakes.length})
          </button>
        </div>
      </div>

      {/* 2. Zustand: Fehlerbank leer (Trophäen-Zustand 全胜) */}
      {activeMistakes.length === 0 && (
        <div
          className="reveal double-bezel-casing shadow-whisper"
          style={{ '--index': 1 } as CSSProperties}
        >
          <div className="double-bezel-core p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
            <span className="watermark-glyph text-[160px]! opacity-[0.03] dark:opacity-[0.05]">胜</span>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <SealBadge sealChar="全胜" label="VOLLSTÄNDIGER TRIUMPH" variant="jade" />
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Fehlerbank vollständig bereinigt!
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Du hast aktuell keine ungelösten Schwachstellen. Spiele einen der Arcade-Modi, um dein Können auf die Probe zu stellen.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <KineticButton
                variant="primary"
                onClick={() => navigate('/blitz', { viewTransition: true })}
                icon={<Zap className="h-4 w-4" />}
              >
                2-Min-Blitz starten
              </KineticButton>
              <KineticButton
                variant="secondary"
                onClick={() => navigate('/exam', { viewTransition: true })}
                icon={<GraduationCap className="h-4 w-4" />}
              >
                HSK-1 Probeprüfung
              </KineticButton>
            </div>

            {resolvedMistakes.length > 0 && (
              <div className="pt-6 border-t border-zinc-200/60 dark:border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
                <span>{resolvedMistakes.length} Schwachstellen insgesamt in dieser Session gemeistert</span>
                <button
                  type="button"
                  onClick={() => void clearResolvedMistakes()}
                  className="flex items-center gap-1.5 font-mono text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Verlauf leeren</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. DRILL-ARENA ANSICHT */}
      {activeMistakes.length > 0 && activeTab === 'drill' && (
        <div className="space-y-6">
          {/* Runde abgeschlossen */}
          {batchFinished ? (
            <div className="double-bezel-casing shadow-whisper p-8 sm:p-12 text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <SealBadge sealChar="完" label="EINHEIT ABGESCHLOSSEN" variant="jade" />
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  Runde beendet!
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Du hast <strong className="text-zinc-900 dark:text-zinc-100">{batchCorrectCount} von {batchQuestions.length}</strong> Fragen richtig beantwortet.
                  {resolvedInSession.length > 0 && (
                    <span className="block mt-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      {resolvedInSession.length} Vokabel(n) endgültig gemeistert!
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                {activeMistakes.length > 0 ? (
                  <KineticButton
                    variant="primary"
                    onClick={startNewBatch}
                    icon={<RotateCcw className="h-4 w-4" />}
                  >
                    Nächste Einheit starten ({Math.min(BATCH_SIZE, activeMistakes.length)})
                  </KineticButton>
                ) : (
                  <KineticButton
                    variant="primary"
                    onClick={() => navigate('/', { viewTransition: true })}
                    icon={<CheckCircle2 className="h-4 w-4" />}
                  >
                    Zurück zur Zentrale
                  </KineticButton>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="rounded-full border border-zinc-200/80 px-5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Zum Fehler-Katalog
                </button>
              </div>
            </div>
          ) : currentQ ? (
            <div className="double-bezel-casing shadow-whisper">
              <div className="double-bezel-core p-6 sm:p-10 space-y-8 relative">
                {/* Status Bar: Fortschritt & Streak */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-white/[0.08] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-zinc-400">
                      Frage {currentIdx + 1} / {batchQuestions.length}
                    </span>
                    <div className="flex items-center gap-1">
                      {batchQuestions.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 rounded-full transition-all ${
                            i === currentIdx
                              ? 'w-6 bg-emerald-600 dark:bg-emerald-400'
                              : i < currentIdx
                                ? 'w-2 bg-zinc-400 dark:bg-zinc-600'
                                : 'w-2 bg-zinc-200 dark:bg-zinc-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bereinigungs-Fortschritt der aktuellen Vokabel */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      Bereinigung:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-3 w-3 rounded-full border border-zinc-300 transition-all ${
                          (currentMistakeRecord?.consecutiveCorrect ?? 0) >= 1
                            ? 'bg-emerald-500 border-emerald-600'
                            : 'bg-zinc-100 dark:bg-zinc-800 dark:border-white/10'
                        }`}
                        title="1. Treffer"
                      />
                      <span
                        className={`h-3 w-3 rounded-full border border-zinc-300 transition-all ${
                          (currentMistakeRecord?.consecutiveCorrect ?? 0) >= 2
                            ? 'bg-emerald-500 border-emerald-600'
                            : 'bg-zinc-100 dark:bg-zinc-800 dark:border-white/10'
                        }`}
                        title="2. Treffer (Gemeistert)"
                      />
                    </div>
                    <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {currentMistakeRecord?.consecutiveCorrect ?? 0}/{REQUIRED_CONSECUTIVE_CORRECT}
                    </span>
                  </div>
                </div>

                {/* Question Hero Area */}
                <div className="text-center space-y-4">
                  {currentQ.type === 'audio_listening' ? (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={handlePlayAudio}
                          className="group relative flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                          title="Audio erneut abspielen"
                        >
                          <Volume2 className="h-10 w-10 transition-transform group-hover:scale-110" />
                        </button>
                      </div>
                      <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Welches Wort hast du gehört?
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-3">
                        <h2 className="text-5xl sm:text-6xl font-extrabold font-cjk tracking-wide text-zinc-900 dark:text-zinc-50">
                          {currentQ.hanzi}
                        </h2>
                        <button
                          type="button"
                          onClick={handlePlayAudio}
                          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white text-zinc-600 hover:text-emerald-600 hover:border-emerald-500/40 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 transition-all cursor-pointer shadow-xs"
                          title="Aussprache anhören"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>

                      {currentQ.type === 'meaning_choice' && (
                        <p className="font-mono text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                          {currentQ.pinyin}
                        </p>
                      )}

                      {currentQ.type === 'pinyin_input' && (
                        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                          {currentQ.translation}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Input-Formate */}
                {currentQ.type === 'pinyin_input' ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (typedInput.trim() && !isAnswered) {
                        void submitAnswer(typedInput);
                      }
                    }}
                    className="max-w-md mx-auto space-y-3"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        autoFocus
                        disabled={isAnswered}
                        placeholder="Pinyin tippen (z.B. ni hao oder ni3hao3)..."
                        value={typedInput}
                        onChange={(e) => setTypedInput(e.target.value)}
                        className="w-full rounded-2xl border border-zinc-300 bg-white px-5 py-3.5 text-center font-mono text-lg font-semibold text-zinc-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    {!isAnswered && (
                      <button
                        type="submit"
                        disabled={!typedInput.trim()}
                        className="w-full rounded-full bg-emerald-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 disabled:opacity-50 transition-all cursor-pointer"
                      >
                        Antwort prüfen [Enter]
                      </button>
                    )}
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {currentQ.options?.map((option, idx) => {
                      const isSelected = selectedOption === option;
                      const isCorrect = option === currentQ.correctAnswer;
                      let btnStyle =
                        'border-zinc-200/80 bg-white text-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200';

                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle =
                            'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle =
                            'border-rose-500 bg-rose-500/15 text-rose-800 dark:text-rose-300 line-through';
                        } else {
                          btnStyle = 'opacity-40 border-zinc-200/60 dark:border-white/[0.06]';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => void submitAnswer(option)}
                          className={`cursor-pointer rounded-2xl border p-4 text-left font-medium transition-all duration-150 flex items-center justify-between gap-3 shadow-xs ${btnStyle}`}
                        >
                          <span className="text-sm">{option}</span>
                          <span className="rounded-md border border-zinc-200/80 bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-bold text-zinc-400 dark:border-white/10 dark:bg-zinc-800">
                            [{idx + 1}]
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Feedback-Banner nach der Antwort */}
                {isAnswered && (
                  <div
                    className={`rounded-2xl border p-4 text-center max-w-lg mx-auto space-y-2 animate-in fade-in zoom-in-95 duration-200 ${
                      lastCorrect
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
                        : 'border-rose-500/40 bg-rose-500/10 text-rose-900 dark:text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 font-bold text-sm">
                      {lastCorrect ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Hervorragend gelöst!</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4 text-rose-600" />
                          <span>Leider falsch. Richtige Antwort: {currentQ.correctAnswer}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {lastCorrect
                        ? (currentMistakeRecord?.consecutiveCorrect ?? 0) >= REQUIRED_CONSECUTIVE_CORRECT - 1
                          ? 'Damit hast du die Vokabel 2x in Folge gelöst und aus der Fehlerbank bereinigt!'
                          : 'Noch 1 weiterer Treffer in der nächsten Einheit zur vollständigen Bereinigung.'
                        : 'Die Serie wurde auf 0 zurückgesetzt. Du wirst dieser Vokabel bald wieder begegnen.'}
                    </p>
                    <div className="pt-2">
                      <KineticButton
                        variant="primary"
                        onClick={handleNext}
                        icon={<ChevronRight className="h-4 w-4" />}
                      >
                        {currentIdx + 1 >= batchQuestions.length ? 'Runde abschließen' : 'Nächste Vokabel [Enter]'}
                      </KineticButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* 4. FEHLER-KATALOG ANSICHT */}
      {activeMistakes.length > 0 && activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Filter & Suche */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Hanzi, Pinyin oder Bedeutung..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200/80 bg-white py-2 pl-9 pr-4 text-xs text-zinc-900 shadow-xs focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>

            {/* Quell-Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(['all', 'blitz', 'exam', 'typeracer', 'ear-trainer', 'review'] as const).map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => setCatalogSourceFilter(source)}
                  className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                    catalogSourceFilter === source
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                      : 'border border-zinc-200/80 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}
                >
                  {source === 'all' ? 'Alle Quellen' : SOURCE_LABELS[source].label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid aller Vokabeln */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalogMistakes.map((record) => {
              const vocab = VOCAB_BY_ID.get(record.itemId);
              if (!vocab) return null;
              const sourceInfo = SOURCE_LABELS[record.lastSourceMode];
              const Icon = sourceInfo.icon;

              return (
                <div
                  key={record.itemId}
                  className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-whisper dark:border-white/[0.08] dark:bg-zinc-900 flex flex-col justify-between gap-4 transition-all hover:border-emerald-500/40"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                        <Icon className="h-3 w-3" />
                        <span>{sourceInfo.label}</span>
                      </span>

                      <span className="rounded-full bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-700 dark:text-rose-400 border border-rose-500/20">
                        {record.totalMistakes}x fehlgeschlagen
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold font-cjk text-zinc-900 dark:text-zinc-100">
                          {vocab.hanzi}
                        </h3>
                        <button
                          type="button"
                          onClick={() => void playMandarinWithFallback(vocab.hanzi, vocab.audioPath ?? undefined)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 hover:bg-emerald-500/10 text-zinc-600 hover:text-emerald-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                          title="Aussprache anhören"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {vocab.pinyin}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-1">
                        {vocab.meaning}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 dark:border-white/[0.04] pt-3 text-xs">
                    <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                      <span>Bereinigung:</span>
                      <strong className="text-zinc-900 dark:text-zinc-100">
                        {record.consecutiveCorrect}/{REQUIRED_CONSECUTIVE_CORRECT}
                      </strong>
                    </div>

                    <Link
                      to={`/dictionary?search=${encodeURIComponent(vocab.hanzi)}`}
                      className="font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Im Wörterbuch</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCatalogMistakes.length === 0 && (
            <div className="p-8 text-center text-xs font-mono text-zinc-400 rounded-3xl border border-dashed border-zinc-200 dark:border-white/10">
              Keine Schwachstellen entsprechen den gewählten Filtern.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
