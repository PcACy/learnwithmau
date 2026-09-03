import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlignLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
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
import { playAsset, playToneSequence, stopCurrentAudio } from '../lib/audio';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';
import { getCompletedStories, putCompletedStories } from '../lib/db';
import { STORY_TO_GRAMMAR_MAP } from '../data/chapterLinks';
import { KineticButton } from '../components/ui/KineticButton';
import { SealBadge } from '../components/ui/SealBadge';
import { VOCAB } from '../data';
import { useProgressStore } from '../store/progressStore';

const STORIES = storiesData as Story[];

export function StoriesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paramId = searchParams.get('id');
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  const selectedStoryId =
    activeStoryId && STORIES.some((s) => s.id === activeStoryId)
      ? activeStoryId
      : paramId && STORIES.some((s) => s.id === paramId)
        ? paramId
        : STORIES[0].id;

  const [viewMode, setViewMode] = useState<'reader' | 'sentences'>('reader');
  const [showPinyin, setShowPinyin] = useState(true);
  const [showGerman, setShowGerman] = useState(true);

  const cards = useProgressStore((s) => s.cards);
  const review = useProgressStore((s) => s.review);

  // Audio Playback State
  const [playingSentenceId, setPlayingSentenceId] = useState<string | null>(null);
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const fullAudioCancelledRef = useRef(false);

  useEffect(() => {
    if (!playingSentenceId) return;
    const el = document.getElementById(`sentence-${playingSentenceId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [playingSentenceId]);

  const playTokenAudio = useCallback((token: StoryWordToken) => {
    stopCurrentAudio();
    const vocab = VOCAB.find((v) => v.hanzi === token.hanzi);
    if (vocab?.audioPath) {
      void playAsset(vocab.audioPath);
      return;
    }
    if (vocab) {
      playToneSequence(vocab.syllables.map((s) => s.tone));
    }
  }, []);

  // Active word token for Lookup Popover
  const [activeToken, setActiveToken] = useState<StoryWordToken | null>(null);

  // Completed Stories Storage
  const [completedStories, setCompletedStories] = useState<Set<string>>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('hanzi_completed_stories') : null;
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    let cancelled = false;
    void getCompletedStories().then((ids) => {
      if (cancelled || ids.length === 0) return;
      setCompletedStories((prev) => new Set([...prev, ...ids]));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const currentStory = STORIES.find((s) => s.id === selectedStoryId) || STORIES[0];
  const currentIndex = STORIES.findIndex((s) => s.id === selectedStoryId);
  const isCurrentCompleted = completedStories.has(currentStory.id);
  const relatedGrammar = STORY_TO_GRAMMAR_MAP[currentStory.id] || [];

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
      if (!fullAudioCancelledRef.current) {
        await new Promise((r) => setTimeout(r, 450));
      }
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
    playTokenAudio(token);
    fireMicroBurst();
  };

  // Escape-Taste schließt Wort-Glossar
  useEffect(() => {
    if (!activeToken) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveToken(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeToken]);

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
      void putCompletedStories(Array.from(next));
      return next;
    });
    fireCelebration();
  }, []);

  return (
    <div className="space-y-10 pb-24" onClick={() => setActiveToken(null)}>
      {/* 1. Header & Fortschritt */}
      <div
        className="reveal flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ '--index': 0 } as CSSProperties}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <SealBadge sealChar="读" label="HSK 1 LESETEXTE" variant="jade" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
              Immersiver Graded Reader
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
            Geschichten & Dialoge
          </h1>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-full border border-zinc-200/80 bg-white/90 px-4 py-2 text-xs font-semibold shadow-xs dark:border-white/10 dark:bg-zinc-900/90">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-mono text-zinc-700 dark:text-zinc-300">
              {completedStories.size} / {STORIES.length} gelesen
            </span>
          </div>
        </div>
      </div>

      {/* 2. Story Selector Chips (Horizontal scrollbare Milled-Pills) */}
      <div
        className="reveal flex gap-2.5 overflow-x-auto pb-2 scrollbar-none"
        style={{ '--index': 1 } as CSSProperties}
      >
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
                setActiveStoryId(story.id);
                setActiveToken(null);
              }}
              className={`group flex shrink-0 items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-xs font-semibold transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isSel
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-whisper dark:border-emerald-500 dark:bg-emerald-600'
                  : 'border-zinc-200/80 bg-white text-zinc-700 hover:border-emerald-500/40 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-md font-mono text-[10px] font-bold ${
                  isSel
                    ? 'bg-white/20 text-white'
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
        className="reveal flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/90 p-3 shadow-xs dark:border-white/10 dark:bg-zinc-900/90"
        style={{ '--index': 2 } as CSSProperties}
      >
        {/* Ansichtsmodus (Dual-Mode: Buch vs. Satzkarten) */}
        <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setViewMode('reader')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
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
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all shadow-whisper cursor-pointer ${
            isPlayingFull
              ? 'bg-amber-600 text-white hover:bg-amber-500'
              : 'bg-emerald-600 text-white hover:bg-emerald-500'
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
        className="reveal double-bezel-casing shadow-whisper relative"
        style={{ '--index': 3 } as CSSProperties}
      >
        <div className="double-bezel-core p-7 sm:p-11 space-y-9">
          {/* Authentic Calligraphy Watermark */}
          <span className="watermark-glyph">
            {currentStory.hanziTag || '读'}
          </span>

          {/* Story Header */}
          <div className="relative space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <SealBadge
                sealChar="印"
                label={`TEXT ${String(currentIndex + 1).padStart(2, '0')}`}
                variant="cinnabar"
                size="sm"
              />
              <span className="rounded-full border border-zinc-200 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-500 dark:border-white/10">
                {currentStory.difficulty} · ~{currentStory.wordCount} Zeichen
              </span>
              {isCurrentCompleted && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                  <Check className="h-3 w-3" />
                  Gelesen
                </span>
              )}
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-100">
              {currentStory.title}
            </h2>
            <p className="font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {currentStory.pinyinTitle} · {currentStory.germanTitle}
            </p>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 pt-0.5">
              {currentStory.summary}
            </p>
          </div>

          {/* 5A. Modus 1: Buch-Fließtext (Immersiv) */}
          {viewMode === 'reader' && (
            <div className="space-y-6 rounded-3xl border border-zinc-100 bg-zinc-50/70 p-6 sm:p-9 dark:border-white/[0.04] dark:bg-zinc-950/40 relative">
              <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
                <span>Tipp: Klicke auf ein beliebiges Wort im Text für die Sofort-Übersetzung</span>
                <span className="font-mono text-[10px] uppercase tracking-wider">Buchansicht</span>
              </div>

              <div className="space-y-4">
                {currentStory.sentences.map((sent) => {
                  const isCurrentActive = playingSentenceId === sent.id;

                  return (
                    <div
                      key={sent.id}
                      id={`sentence-${sent.id}`}
                      className={`group rounded-2xl p-4 transition-all duration-200 ${
                        isCurrentActive
                          ? 'bg-emerald-500/10 ring-2 ring-emerald-500/60 shadow-whisper'
                          : 'hover:bg-white dark:hover:bg-zinc-900/60'
                      }`}
                    >
                      {/* Chinese text with interactive clickable tokens */}
                      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-2.5 leading-[1.9]">
                        {sent.tokens.map((token, tIdx) => (
                          <button
                            key={tIdx}
                            type="button"
                            onClick={(e) => handleWordClick(token, e)}
                            className="group/word inline-flex flex-col items-center rounded-lg px-1.5 py-0.5 hover:bg-emerald-500/20 active:scale-95 transition-all text-left cursor-pointer"
                          >
                            {showPinyin && (
                              <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-tight">
                                {token.pinyin}
                              </span>
                            )}
                            <span className="font-cjk text-2xl sm:text-3xl font-medium text-zinc-900 dark:text-zinc-100 group-hover/word:text-emerald-800 dark:group-hover/word:text-emerald-300">
                              {token.hanzi}
                            </span>
                          </button>
                        ))}

                        {/* Direct Sentence Audio Trigger Button */}
                        <button
                          type="button"
                          onClick={() => playSentenceAudio(sent)}
                          className={`ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all cursor-pointer ${
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
                        <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 pl-2 border-l-2 border-emerald-500/40">
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
                    id={`sentence-${sent.id}`}
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

                        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-2.5">
                          {sent.tokens.map((token, tIdx) => (
                            <button
                              key={tIdx}
                              type="button"
                              onClick={(e) => handleWordClick(token, e)}
                              className="group/word inline-flex flex-col items-center rounded-lg px-2 py-1 hover:bg-emerald-500/20 active:scale-95 transition-all text-left cursor-pointer"
                            >
                              {showPinyin && (
                                <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                  {token.pinyin}
                                </span>
                              )}
                              <span className="font-cjk text-2xl sm:text-3xl font-medium text-zinc-900 dark:text-zinc-100">
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
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all cursor-pointer ${
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

          {/* 6. Wort-Lookup Popover / Dialog via Portal direkt auf Viewport-Ebene */}
          {activeToken &&
            typeof document !== 'undefined' &&
            createPortal(
              <div className="fixed inset-0 z-100 flex items-end justify-end p-4 sm:p-6 pointer-events-none">
                {/* Klickbarer Backdrop zum Schließen */}
                <div
                  className="fixed inset-0 bg-black/20 backdrop-blur-[1px] pointer-events-auto transition-opacity"
                  onClick={() => setActiveToken(null)}
                />

                <div
                  className="relative z-10 max-w-sm w-full rounded-3xl border border-zinc-200/90 bg-white/95 p-6 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/95 animate-pop-in pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const matchingVocab = VOCAB.find((v) => v.hanzi === activeToken.hanzi);
                    const isStudied = matchingVocab ? matchingVocab.id in cards : false;

                    return (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                Wort-Glossar
                              </span>
                              {matchingVocab ? (
                                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                                  HSK 1
                                </span>
                              ) : (
                                <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-500">
                                  Kontext
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-baseline gap-3">
                              <span className="font-cjk text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                                {activeToken.hanzi}
                              </span>
                              <span className="font-mono text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                                {activeToken.pinyin}
                              </span>
                              <button
                                type="button"
                                onClick={() => playTokenAudio(activeToken)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-300 transition-colors cursor-pointer"
                                title="Aussprache anhören"
                              >
                                <Volume2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveToken(null)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 text-xs dark:border-white/[0.04] dark:bg-zinc-950/40">
                          <span className="text-zinc-400">Bedeutung: </span>
                          <span className="font-bold text-zinc-800 dark:text-zinc-200">{activeToken.german}</span>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-100 pt-3 dark:border-white/[0.05]">
                          {matchingVocab && (
                            <button
                              type="button"
                              onClick={() => {
                                void review(matchingVocab.id, 3);
                                fireMicroBurst();
                              }}
                              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                isStudied
                                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
                              }`}
                            >
                              {isStudied ? <Check className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                              <span>{isStudied ? 'Im SRS aktiv' : 'Im SRS vormerken'}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setActiveToken(null);
                              navigate(`/dictionary?q=${encodeURIComponent(activeToken.hanzi)}`);
                            }}
                            className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
                          >
                            <span>Wörterbuch</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>,
              document.body,
            )}

          {/* 7. Didaktische Kapitel-Verknüpfung zurück zu Grammatik-Lektionen */}
          {relatedGrammar.length > 0 && (
            <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/60 p-5 dark:border-white/10 dark:bg-zinc-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    Verknüpfte Grammatik-Lektion
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Die Grammatikregeln dieser Geschichte systematisch im Kompendium vertiefen:
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {relatedGrammar.map((rg) => (
                  <button
                    key={rg.lessonId}
                    type="button"
                    onClick={() => navigate('/grammar')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 dark:border-emerald-500/20 dark:bg-zinc-900 dark:text-emerald-300 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <span>{rg.lessonTitle}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 8. Leseverständnis-Quiz (Comprehension Checks) */}
          <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-white/[0.05]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Leseverständnis-Check
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Überprüfe, ob du den Textinhalt vollständig erfasst hast.
                </p>
              </div>
              <SealBadge sealChar="考" label="QUIZ" variant="stone" size="sm" />
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
                            className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs font-medium transition-all cursor-pointer ${btnStyle}`}
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

          {/* 9. Lektionsabschluss & Footer Navigation mit KineticButton */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-zinc-100 dark:border-white/[0.05]">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => {
                fullAudioCancelledRef.current = true;
                stopCurrentAudio();
                setIsPlayingFull(false);
                setPlayingSentenceId(null);
                setActiveStoryId(STORIES[currentIndex - 1].id);
                setActiveToken(null);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-5 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 disabled:pointer-events-none dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Vorherige Geschichte</span>
            </button>

            <div className="flex flex-wrap items-center gap-3">
              {!isCurrentCompleted && (
                <KineticButton
                  variant="primary"
                  onClick={() => markCompleted(currentStory.id)}
                  icon={<Check className="h-4 w-4" />}
                >
                  Als gelesen markieren
                </KineticButton>
              )}

              {currentIndex < STORIES.length - 1 && (
                <KineticButton
                  variant="secondary"
                  onClick={() => {
                    fullAudioCancelledRef.current = true;
                    stopCurrentAudio();
                    setIsPlayingFull(false);
                    setPlayingSentenceId(null);
                    setActiveStoryId(STORIES[currentIndex + 1].id);
                    setActiveToken(null);
                  }}
                  icon={<ChevronRight className="h-4 w-4" />}
                >
                  Nächste Geschichte
                </KineticButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
