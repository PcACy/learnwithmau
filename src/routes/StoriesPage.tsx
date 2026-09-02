import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  AlignLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Languages,
  Layers,
  Pause,
  Play,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import storiesData from '../data/stories.json';
import type { Story, StorySentence, StoryWordToken } from '../types/story';
import { playAsset, stopCurrentAudio } from '../lib/audio';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';

const STORIES = storiesData as Story[];

export function StoriesPage() {
  const [selectedStoryId, setSelectedStoryId] = useState<string>(STORIES[0].id);
  const [viewMode, setViewMode] = useState<'reader' | 'sentences'>('reader');
  const [showPinyin, setShowPinyin] = useState(true);
  const [showGerman, setShowGerman] = useState(true);

  // Audio Playback State
  const [playingSentenceId, setPlayingSentenceId] = useState<string | null>(null);
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const fullAudioCancelledRef = useRef(false);

  // Active word token for Lookup Popover
  const [activeToken, setActiveToken] = useState<StoryWordToken | null>(null);

  // Completed Stories Storage
  const [completedStories, setCompletedStories] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('hanzi_completed_stories');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const currentStory = STORIES.find((s) => s.id === selectedStoryId) || STORIES[0];
  const currentIndex = STORIES.findIndex((s) => s.id === selectedStoryId);
  const isCurrentCompleted = completedStories.has(currentStory.id);

  // Stop audio on unmount or story change
  useEffect(() => {
    return () => {
      fullAudioCancelledRef.current = true;
      stopCurrentAudio();
    };
  }, [selectedStoryId]);

  // Einzelsatz abspielen
  const playSentenceAudio = async (sentence: StorySentence) => {
    if (isPlayingFull) {
      fullAudioCancelledRef.current = true;
      setIsPlayingFull(false);
    }

    if (playingSentenceId === sentence.id) {
      stopCurrentAudio();
      setPlayingSentenceId(null);
      return;
    }

    if (!sentence.audioUrl) return;
    setPlayingSentenceId(sentence.id);
    await playAsset(sentence.audioUrl, () => {
      setPlayingSentenceId((cur) => (cur === sentence.id ? null : cur));
    });
  };

  // Gesamte Geschichte satzweise mit Highlighting abspielen
  const playFullStory = async () => {
    if (isPlayingFull) {
      fullAudioCancelledRef.current = true;
      stopCurrentAudio();
      setIsPlayingFull(false);
      setPlayingSentenceId(null);
      return;
    }

    setIsPlayingFull(true);
    fullAudioCancelledRef.current = false;

    for (const sentence of currentStory.sentences) {
      if (fullAudioCancelledRef.current) break;
      if (!sentence.audioUrl) continue;

      setPlayingSentenceId(sentence.id);
      await new Promise<void>((resolve) => {
        void playAsset(sentence.audioUrl!, () => {
          resolve();
        });
      });
      // Kurze Pause zwischen Sätzen für angenehmes Zuhören
      await new Promise((r) => setTimeout(r, 450));
    }

    if (!fullAudioCancelledRef.current) {
      setIsPlayingFull(false);
      setPlayingSentenceId(null);
    }
  };

  // Wort-Klick Handler
  const handleWordClick = (token: StoryWordToken, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveToken(token);
    fireMicroBurst();
  };

  // Quiz-Antwort wählen
  const handleSelectQuiz = (quizIdx: number, optIdx: number) => {
    const key = `${currentStory.id}-${quizIdx}`;
    setQuizAnswers((prev) => ({ ...prev, [key]: optIdx }));
    setQuizSubmitted((prev) => ({ ...prev, [key]: true }));

    const quiz = currentStory.quizzes[quizIdx];
    if (quiz && optIdx === quiz.correctIndex) {
      fireMicroBurst();
    }
  };

  // Geschichte als abgeschlossen markieren
  const markCompleted = useCallback((id: string) => {
    setCompletedStories((prev) => {
      const next = new Set(prev).add(id);
      try {
        localStorage.setItem('hanzi_completed_stories', JSON.stringify(Array.from(next)));
      } catch {
        // Ignore
      }
      return next;
    });
    fireCelebration();
  }, []);

  return (
    <div className="space-y-10 pb-20" onClick={() => setActiveToken(null)}>
      {/* 1. Header & Fortschritt */}
      <div className="reveal flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 font-cjk text-sm font-bold text-emerald-700 dark:text-emerald-400">
              读
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">
              Graded Reader · HSK 1
            </span>
          </div>
          <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight sm:text-4xl">Geschichten & Lesetexte</h1>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-4 py-2 text-xs font-semibold shadow-xs dark:border-white/10 dark:bg-zinc-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              {completedStories.size} von {STORIES.length} Geschichten gemeistert
            </span>
          </div>
        </div>
      </div>

      {/* 2. Story Selector Chips (Horizontal scrollbar) */}
      <div className="reveal flex gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ '--index': 1 } as CSSProperties}>
        {STORIES.map((story, idx) => {
          const isSel = story.id === currentStory.id;
          const isDone = completedStories.has(story.id);

          return (
            <button
              key={story.id}
              type="button"
              onClick={() => {
                fullAudioCancelledRef.current = true;
                stopCurrentAudio();
                setIsPlayingFull(false);
                setPlayingSentenceId(null);
                setSelectedStoryId(story.id);
                setActiveToken(null);
              }}
              className={`group flex shrink-0 items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-xs font-semibold transition-all duration-200 ease-[var(--ease-spring)] ${
                isSel
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-whisper dark:border-emerald-500 dark:bg-emerald-500 dark:text-zinc-950'
                  : 'border-zinc-200/80 bg-white text-zinc-700 hover:border-emerald-500/40 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-md font-mono text-[10px] font-bold ${
                  isSel
                    ? 'bg-white/20 text-white dark:bg-zinc-950/20 dark:text-zinc-950'
                    : isDone
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {isDone ? <Check className="h-3 w-3" /> : idx + 1}
              </span>
              <span>{story.title}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Steuerungs-Leiste (Toggles & Vorleser) */}
      <div
        className="reveal flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-xs dark:border-white/10 dark:bg-zinc-900"
        style={{ '--index': 2 } as CSSProperties}
      >
        {/* Ansichtsmodus (Dual-Mode: Buch vs. Satzkarten) */}
        <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setViewMode('reader')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              viewMode === 'reader'
                ? 'bg-white text-emerald-800 shadow-xs dark:bg-zinc-900 dark:text-emerald-300'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            <AlignLeft className="h-3.5 w-3.5" />
            <span>Buch-Fließtext</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('sentences')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              viewMode === 'sentences'
                ? 'bg-white text-emerald-800 shadow-xs dark:bg-zinc-900 dark:text-emerald-300'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Satz-für-Satz</span>
          </button>
        </div>

        {/* Lese-Hilfen Toggles (Pinyin & Deutsch) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPinyin((v) => !v)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              showPinyin
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                : 'border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
            title="Pinyin ein- oder ausblenden"
          >
            {showPinyin ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span>Pinyin</span>
          </button>

          <button
            type="button"
            onClick={() => setShowGerman((v) => !v)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              showGerman
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                : 'border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
            title="Deutsche Übersetzung ein- oder ausblenden"
          >
            <Languages className="h-3.5 w-3.5" />
            <span>Deutsch</span>
          </button>
        </div>

        {/* Alles Vorlesen (Continuous Audio Engine) */}
        <button
          type="button"
          onClick={playFullStory}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            isPlayingFull
              ? 'bg-amber-600 text-white hover:bg-amber-500 shadow-whisper'
              : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-whisper'
          }`}
        >
          {isPlayingFull ? (
            <>
              <Pause className="h-3.5 w-3.5" />
              <span>Pause / Stop</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Alles vorlesen</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Haupt-Lese-Container (Double-Bezel Architecture) */}
      <div
        className="reveal rounded-[2.5rem] p-1.5 bg-gradient-to-b from-white/10 to-white/5 border border-zinc-200/80 dark:border-white/10 shadow-whisper relative"
        style={{ '--index': 3 } as CSSProperties}
      >
        <div className="relative overflow-hidden rounded-[calc(2.5rem-0.375rem)] bg-white p-7 sm:p-10 dark:bg-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-8">
          {/* Authentic Calligraphy Watermark */}
          <span className="font-cjk pointer-events-none select-none absolute -bottom-6 -right-3 text-[140px] font-black text-zinc-950/[0.03] dark:text-white/[0.03]">
            {currentStory.hanziTag}
          </span>

          {/* Story Header */}
          <div className="relative space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Geschichte {currentIndex + 1} von {STORIES.length}
              </span>
              <span className="rounded-full border border-zinc-200 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-500 dark:border-white/10">
                {currentStory.difficulty} · ~{currentStory.wordCount} Wörter
              </span>
              {isCurrentCompleted && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                  <Check className="h-3 w-3" />
                  Gemeistert
                </span>
              )}
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-100">
              {currentStory.title}
            </h2>
            <p className="font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {currentStory.pinyinTitle} · {currentStory.germanTitle}
            </p>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 pt-1">
              {currentStory.summary}
            </p>
          </div>

          {/* 5A. Modus 1: Buch-Fließtext (Immersiv) */}
          {viewMode === 'reader' && (
            <div className="space-y-6 rounded-3xl border border-zinc-100 bg-zinc-50/60 p-6 sm:p-8 dark:border-white/[0.04] dark:bg-zinc-950/40">
              <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
                <span>Tipp: Klicke auf ein beliebiges Wort im Text für die Sofort-Übersetzung</span>
                <span>Buchansicht</span>
              </div>

              <div className="space-y-4">
                {currentStory.sentences.map((sent) => {
                  const isCurrentActive = playingSentenceId === sent.id;

                  return (
                    <div
                      key={sent.id}
                      className={`group rounded-2xl p-4 transition-all duration-200 ${
                        isCurrentActive
                          ? 'bg-emerald-500/10 ring-2 ring-emerald-500/60 shadow-whisper'
                          : 'hover:bg-white dark:hover:bg-zinc-900/60'
                      }`}
                    >
                      {/* Chinese text with interactive clickable tokens */}
                      <div className="flex flex-wrap items-baseline gap-x-1 gap-y-2">
                        {sent.tokens.map((token, tIdx) => (
                          <button
                            key={tIdx}
                            type="button"
                            onClick={(e) => handleWordClick(token, e)}
                            className="group/word inline-flex flex-col items-center rounded-lg px-1.5 py-0.5 hover:bg-emerald-500/20 active:scale-95 transition-all text-left"
                          >
                            {showPinyin && (
                              <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-tight">
                                {token.pinyin}
                              </span>
                            )}
                            <span className="font-cjk text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover/word:text-emerald-800 dark:group-hover/word:text-emerald-300">
                              {token.hanzi}
                            </span>
                          </button>
                        ))}

                        {/* Direct Sentence Audio Trigger Button */}
                        <button
                          type="button"
                          onClick={() => playSentenceAudio(sent)}
                          className={`ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                            isCurrentActive
                              ? 'border-emerald-600 bg-emerald-600 text-white shadow-whisper'
                              : 'border-zinc-200 bg-white text-zinc-500 opacity-60 group-hover:opacity-100 hover:border-emerald-500 hover:text-emerald-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300'
                          }`}
                          title="Diesen Satz anhören"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* German translation (optional toggle) */}
                      {showGerman && (
                        <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 pl-1.5 border-l-2 border-emerald-500/40">
                          {sent.german}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5B. Modus 2: Satz-für-Satz Ansicht (Geführt) */}
          {viewMode === 'sentences' && (
            <div className="space-y-4">
              {currentStory.sentences.map((sent, sIdx) => {
                const isCurrentActive = playingSentenceId === sent.id;

                return (
                  <div
                    key={sent.id}
                    className={`rounded-3xl border p-5 sm:p-6 transition-all ${
                      isCurrentActive
                        ? 'border-emerald-500/60 bg-emerald-500/[0.06] shadow-whisper'
                        : 'border-zinc-200/80 bg-white dark:border-white/10 dark:bg-zinc-900/90'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <span className="font-mono text-[11px] font-bold text-zinc-400">
                          Satz {sIdx + 1}
                        </span>

                        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-2">
                          {sent.tokens.map((token, tIdx) => (
                            <button
                              key={tIdx}
                              type="button"
                              onClick={(e) => handleWordClick(token, e)}
                              className="group/word inline-flex flex-col items-center rounded-lg px-2 py-1 hover:bg-emerald-500/20 active:scale-95 transition-all text-left"
                            >
                              {showPinyin && (
                                <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                  {token.pinyin}
                                </span>
                              )}
                              <span className="font-cjk text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
                                {token.hanzi}
                              </span>
                            </button>
                          ))}
                        </div>

                        {showGerman && (
                          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300 pt-1">
                            {sent.german}
                          </p>
                        )}
                      </div>

                      {/* Sentence Audio Play Button */}
                      <button
                        type="button"
                        onClick={() => playSentenceAudio(sent)}
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                          isCurrentActive
                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-whisper'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-50 hover:text-emerald-800 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:text-emerald-300'
                        }`}
                        title="Diesen Satz anhören"
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 6. Wort-Lookup Popover / Dialog bei Klick auf beliebiges Wort */}
          {activeToken && (
            <div
              className="fixed bottom-6 right-6 z-50 max-w-sm w-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-900 animate-pop-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Wort-Glossar
                  </span>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="font-cjk text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                      {activeToken.hanzi}
                    </span>
                    <span className="font-mono text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                      {activeToken.pinyin}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveToken(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 text-xs dark:border-white/[0.04] dark:bg-zinc-950/40">
                <span className="text-zinc-400">Deutsche Bedeutung: </span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{activeToken.german}</span>
              </div>
            </div>
          )}

          {/* 7. Leseverständnis-Quiz (Comprehension Checks) */}
          <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-white/[0.05]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Leseverständnis-Check
                </h3>
                <p className="text-xs text-zinc-500">
                  Überprüfe, ob du den Inhalt der Geschichte vollständig verstanden hast.
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="space-y-4">
              {currentStory.quizzes.map((quiz, qIdx) => {
                const answerKey = `${currentStory.id}-${qIdx}`;
                const given = quizAnswers[answerKey];
                const submitted = quizSubmitted[answerKey];

                return (
                  <div
                    key={qIdx}
                    className="rounded-3xl border border-zinc-200/80 bg-zinc-50/50 p-5 dark:border-white/10 dark:bg-zinc-950/40 space-y-3"
                  >
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Frage {qIdx + 1}: {quiz.question}
                    </p>

                    <div className="space-y-2">
                      {quiz.options.map((opt, optIdx) => {
                        const isChosen = given === optIdx;
                        let btnStyle =
                          'border-zinc-200/80 bg-white text-zinc-700 hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300';
                        if (submitted) {
                          if (optIdx === quiz.correctIndex) {
                            btnStyle =
                              'border-emerald-500 bg-emerald-500/15 text-emerald-800 font-bold dark:border-emerald-400 dark:text-emerald-300';
                          } else if (isChosen) {
                            btnStyle =
                              'border-rose-500 bg-rose-500/15 text-rose-800 font-bold dark:border-rose-400 dark:text-rose-300 animate-shake';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectQuiz(qIdx, optIdx)}
                            className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs font-medium transition-all ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {submitted && optIdx === quiz.correctIndex && (
                              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            )}
                            {submitted && isChosen && optIdx !== quiz.correctIndex && (
                              <X className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {submitted && (
                      <div className="rounded-xl border border-zinc-100 bg-white p-3 text-xs leading-relaxed text-zinc-600 dark:border-white/[0.04] dark:bg-zinc-900 dark:text-zinc-300">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mr-1.5">
                          Erklärung
                        </span>
                        {quiz.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 8. Lektionsabschluss & Footer Navigation */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-zinc-100 dark:border-white/[0.05]">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => {
                fullAudioCancelledRef.current = true;
                stopCurrentAudio();
                setIsPlayingFull(false);
                setPlayingSentenceId(null);
                setSelectedStoryId(STORIES[currentIndex - 1].id);
                setActiveToken(null);
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-5 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 disabled:pointer-events-none dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Vorherige Geschichte
            </button>

            <div className="flex items-center gap-3">
              {!isCurrentCompleted && (
                <button
                  type="button"
                  onClick={() => markCompleted(currentStory.id)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-whisper transition-all hover:bg-emerald-500"
                >
                  <Check className="h-4 w-4" />
                  Als gemeistert markieren
                </button>
              )}

              {currentIndex < STORIES.length - 1 && (
                <button
                  type="button"
                  onClick={() => {
                    fullAudioCancelledRef.current = true;
                    stopCurrentAudio();
                    setIsPlayingFull(false);
                    setPlayingSentenceId(null);
                    setSelectedStoryId(STORIES[currentIndex + 1].id);
                    setActiveToken(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                >
                  Nächste Geschichte
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
