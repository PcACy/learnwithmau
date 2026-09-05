import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import grammarData from '../data/grammar.json';
import type { GrammarLesson } from '../types/grammar';
import { playAsset, stopCurrentAudio } from '../lib/audio';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';
import { getCompletedGrammar, putCompletedGrammar } from '../lib/db';
import { CHAPTER_LINKS } from '../data/chapterLinks';
import { KineticButton } from '../components/ui/KineticButton';
import { SealBadge } from '../components/ui/SealBadge';

const LESSONS = grammarData as GrammarLesson[];

export function GrammarPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramLesson = searchParams.get('lesson');

  const [selectedLessonId, setSelectedLessonId] = useState<string>(() => {
    if (paramLesson && LESSONS.some((l) => l.id === paramLesson)) {
      return paramLesson;
    }
    return LESSONS[0].id;
  });

  useEffect(() => {
    if (paramLesson && LESSONS.some((l) => l.id === paramLesson) && paramLesson !== selectedLessonId) {
      setSelectedLessonId(paramLesson);
    }
  }, [paramLesson, selectedLessonId]);

  const handleSelectLesson = useCallback(
    (id: string) => {
      stopCurrentAudio();
      setSelectedLessonId(id);
      setSearchParams({ lesson: id }, { replace: true });
    },
    [setSearchParams],
  );
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('hanzi_completed_grammar') : null;
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    let cancelled = false;
    void getCompletedGrammar().then((ids) => {
      if (cancelled || ids.length === 0) return;
      setCompletedLessons((prev) => new Set([...prev, ...ids]));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Audio stoppen beim Verlassen der Seite
  useEffect(() => {
    return () => stopCurrentAudio();
  }, []);

  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const currentLesson = LESSONS.find((l) => l.id === selectedLessonId) || LESSONS[0];
  const currentIndex = LESSONS.findIndex((l) => l.id === selectedLessonId);
  const chapterLink = CHAPTER_LINKS[currentLesson.id];

  // Audio abspielen
  const handlePlayAudio = (url?: string) => {
    if (!url) return;
    void playAsset(url);
  };

  // Quiz-Antwort wählen
  const handleSelectQuiz = (quizIdx: number, optIdx: number) => {
    const key = `${currentLesson.id}-${quizIdx}`;
    setQuizAnswers((prev) => ({ ...prev, [key]: optIdx }));
    setQuizSubmitted((prev) => ({ ...prev, [key]: true }));

    const quiz = currentLesson.quizzes[quizIdx];
    if (quiz && optIdx === quiz.correctIndex) {
      fireMicroBurst();
    }
  };

  // Lektion als abgeschlossen markieren
  const markCompleted = useCallback((id: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev).add(id);
      void putCompletedGrammar(Array.from(next));
      return next;
    });
    fireCelebration();
  }, []);

  const isCurrentCompleted = completedLessons.has(currentLesson.id);

  return (
    <div className="space-y-10 pb-24">
      {/* 1. Header & Fortschritt */}
      <div
        className="reveal flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ '--index': 0 } as CSSProperties}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <SealBadge sealChar="文" label="HSK 1 LEHRGANG" variant="jade" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
              Syntax & Sprachbausteine
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
            Grammatik-Kompendium
          </h1>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-full border border-zinc-200/80 bg-white/90 px-4 py-2 text-xs font-semibold shadow-xs dark:border-white/10 dark:bg-zinc-900/90">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-mono text-zinc-700 dark:text-zinc-300">
              {completedLessons.size} / {LESSONS.length} gemeistert
            </span>
          </div>
        </div>
      </div>

      {/* 2. Lektions-Navigator (Horizontal scrollbare Milled-Pills) */}
      <div
        className="reveal flex gap-2.5 overflow-x-auto pb-2 scrollbar-none"
        style={{ '--index': 1 } as CSSProperties}
      >
        {LESSONS.map((lesson, idx) => {
          const isSel = lesson.id === currentLesson.id;
          const isDone = completedLessons.has(lesson.id);

          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => handleSelectLesson(lesson.id)}
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
              <span>{lesson.title.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Haupt-Lektionsansicht (Double-Bezel Architecture) */}
      <div
        className="reveal double-bezel-casing shadow-whisper"
        style={{ '--index': 2 } as CSSProperties}
      >
        <div className="double-bezel-core p-7 sm:p-11 space-y-9">
          {/* Authentic Calligraphy Watermark (2.5% light / 4% dark) */}
          <span className="watermark-glyph">
            {currentLesson.hanziTag || '文'}
          </span>

          {/* Lektions-Header */}
          <div className="relative space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <SealBadge
                sealChar="印"
                label={`LEKTION ${String(currentIndex + 1).padStart(2, '0')}`}
                variant="cinnabar"
                size="sm"
              />
              {isCurrentCompleted && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                  <Check className="h-3 w-3" />
                  Gemeistert
                </span>
              )}
            </div>

            <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-100">
              {currentLesson.title}
            </h2>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-400">
              {currentLesson.subtitle}
            </p>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 pt-1">
              {currentLesson.summary}
            </p>
          </div>

          {/* 4. Formel-Kasten (Syntax-Box in Jade & Xuan-Paper) */}
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6 dark:border-emerald-500/20 dark:bg-emerald-500/[0.03] space-y-3 relative">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Grammatik-Formel & Syntax
              </span>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-white/95 p-4 font-mono text-base font-bold text-emerald-950 shadow-xs dark:bg-zinc-950/80 dark:text-emerald-300 sm:text-lg">
              {currentLesson.formula.pattern}
            </div>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {currentLesson.formula.explanation}
            </p>
          </div>

          {/* 5. Kernregeln (Bullet-Pills) */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Wichtige Grundregeln
            </h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {currentLesson.keyRules.map((rule, rIdx) => (
                <div
                  key={rIdx}
                  className="flex items-start gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 text-xs leading-relaxed text-zinc-700 dark:border-white/[0.06] dark:bg-zinc-950/40 dark:text-zinc-300"
                >
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {String(rIdx + 1).padStart(2, '0')}
                  </span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Beispielsätze mit Audio & Zerlegung */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Beispielsätze & Kontext
            </h3>
            <div className="space-y-3">
              {currentLesson.examples.map((ex, exIdx) => (
                <div
                  key={exIdx}
                  className="group rounded-2xl border border-zinc-200/80 bg-white p-5 transition-all hover:border-emerald-500/40 dark:border-white/10 dark:bg-zinc-900/90"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      {/* Gestackte Pinyin- und Hanzi-Typografie mit 0.25rem micro-gap */}
                      <div className="space-y-1">
                        <span className="block font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          {ex.pinyin}
                        </span>
                        <span className="block font-cjk text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                          {ex.hanzi}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        {ex.german}
                      </p>
                    </div>

                    {ex.audioUrl && (
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(ex.audioUrl)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-emerald-500/40 hover:bg-emerald-50 hover:text-emerald-800 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-emerald-400 cursor-pointer"
                        title="Beispielsatz anhören"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Audio</span>
                      </button>
                    )}
                  </div>

                  {/* Wort-für-Wort Zerlegung */}
                  {ex.breakdown && (
                    <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pt-3 border-t border-zinc-100 dark:border-white/[0.04]">
                      {ex.breakdown.map((b, bIdx) => (
                        <span
                          key={bIdx}
                          className="inline-flex items-baseline gap-1 rounded-lg bg-zinc-100 px-2 py-0.5 text-[11px] dark:bg-zinc-800"
                        >
                          <span className="font-cjk font-semibold text-zinc-800 dark:text-zinc-200">
                            {b.part}
                          </span>
                          <span className="text-[10px] text-zinc-400">= {b.meaning}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 7. Typische Stolperfallen (Pitfalls im Cinnabar-Look, Zero-Emoji) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider">
                Typische Stolperfallen deutscher Lerner
              </h3>
            </div>
            <div className="space-y-2.5">
              {currentLesson.pitfalls.map((pit, pIdx) => (
                <div
                  key={pIdx}
                  className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-4.5 text-xs leading-relaxed space-y-2 dark:border-rose-500/20 dark:bg-rose-500/[0.02]"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-semibold">
                      <X className="h-4 w-4" />
                      <span>
                        Falsch: <del className="decoration-rose-500 font-mono">{pit.wrong}</del>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <Check className="h-4 w-4" />
                      <span>
                        Richtig: <span className="font-mono">{pit.right}</span>
                      </span>
                    </div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">Grund: </span>
                    {pit.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Didaktische Kapitel-Verknüpfung (Lehrbuch-Verzahnung mit Stories & Wörterbuch) */}
          {chapterLink && (
            <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/60 p-6 dark:border-white/10 dark:bg-zinc-800/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    Lehrbuch-Verknüpfung: Lesen & Wortschatz
                  </span>
                </div>
                <SealBadge sealChar="读" label="KONTEXT" variant="stone" size="sm" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Story-Empfehlung */}
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-4.5 dark:border-white/10 dark:bg-zinc-900 flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Passende Lesegeschichte
                    </span>
                    <h4 className="mt-1 font-cjk text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {chapterLink.storyTitle}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {chapterLink.storyGerman}
                    </p>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2 italic">
                      {chapterLink.practiceHint}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/stories?id=${chapterLink.recommendedStoryId}`)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 cursor-pointer pt-1"
                  >
                    <span>Geschichte öffnen & mitlesen</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Vokabel-Chips */}
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-4.5 dark:border-white/10 dark:bg-zinc-900 flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Schlüssel-Vokabeln dieser Lektion
                    </span>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Klicke auf ein Wort für Strichfolge & Schreibtraining im Wörterbuch:
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {chapterLink.keyVocab.map((v) => (
                        <button
                          key={v.hanzi}
                          type="button"
                          onClick={() => navigate(`/dictionary?q=${encodeURIComponent(v.hanzi)}`)}
                          className="group inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-zinc-50 px-2.5 py-1 text-xs transition-all hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:border-white/10 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer"
                          title={`${v.pinyin} · ${v.meaning}`}
                        >
                          <span className="font-cjk font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                            {v.hanzi}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-400">
                            {v.pinyin}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/dictionary')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer pt-1"
                  >
                    <span>Zum Wörterbuch</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 9. Interaktiver Mini-Check (Verständnis-Quiz) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Verständnis-Check
              </h3>
              <SealBadge sealChar="考" label="QUIZ" variant="stone" size="sm" />
            </div>

            <div className="space-y-4">
              {currentLesson.quizzes.map((quiz, qIdx) => {
                const answerKey = `${currentLesson.id}-${qIdx}`;
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

          {/* 10. Lektion abschließen & Navigation Footer mit KineticButton */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-zinc-100 dark:border-white/[0.05]">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => handleSelectLesson(LESSONS[currentIndex - 1].id)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-5 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 disabled:pointer-events-none dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Vorherige Lektion</span>
            </button>

            <div className="flex flex-wrap items-center gap-3">
              {!isCurrentCompleted && (
                <KineticButton
                  variant="primary"
                  onClick={() => markCompleted(currentLesson.id)}
                  icon={<Check className="h-4 w-4" />}
                >
                  Lektion meistern
                </KineticButton>
              )}

              {currentIndex < LESSONS.length - 1 && (
                <KineticButton
                  variant="secondary"
                  onClick={() => handleSelectLesson(LESSONS[currentIndex + 1].id)}
                  icon={<ChevronRight className="h-4 w-4" />}
                >
                  Nächste Lektion
                </KineticButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
