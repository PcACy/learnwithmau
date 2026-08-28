import { useCallback, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import grammarData from '../data/grammar.json';
import type { GrammarLesson } from '../types/grammar';
import { playAsset, stopCurrentAudio } from '../lib/audio';
import { fireCelebration, fireMicroBurst } from '../lib/confetti';

const LESSONS = grammarData as GrammarLesson[];

export function GrammarPage() {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS[0].id);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('hanzi_completed_grammar');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const currentLesson = LESSONS.find((l) => l.id === selectedLessonId) || LESSONS[0];
  const currentIndex = LESSONS.findIndex((l) => l.id === selectedLessonId);

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
      try {
        localStorage.setItem('hanzi_completed_grammar', JSON.stringify(Array.from(next)));
      } catch {
        // Ignore
      }
      return next;
    });
    fireCelebration();
  }, []);

  const isCurrentCompleted = completedLessons.has(currentLesson.id);

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Header & Fortschritt */}
      <div className="reveal flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 font-cjk text-sm font-bold text-emerald-700 dark:text-emerald-400">
              文
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">
              Grammatik-Lehrgang · HSK 1
            </span>
          </div>
          <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight sm:text-4xl">HSK-1 Grammatik-Kompendium</h1>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-4 py-2 text-xs font-semibold shadow-xs dark:border-white/10 dark:bg-zinc-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              {completedLessons.size} von {LESSONS.length} Lektionen gemeistert
            </span>
          </div>
        </div>
      </div>

      {/* 2. Lektions-Navigator (Horizontal scrollbare Chips) */}
      <div className="reveal flex gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ '--index': 1 } as CSSProperties}>
        {LESSONS.map((lesson, idx) => {
          const isSel = lesson.id === currentLesson.id;
          const isDone = completedLessons.has(lesson.id);

          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => {
                stopCurrentAudio();
                setSelectedLessonId(lesson.id);
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
              <span>{lesson.title.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Haupt-Lektionsansicht (Double-Bezel Architecture) */}
      <div
        className="reveal rounded-[2.5rem] p-1.5 bg-gradient-to-b from-white/10 to-white/5 border border-zinc-200/80 dark:border-white/10 shadow-whisper"
        style={{ '--index': 2 } as CSSProperties}
      >
        <div className="relative overflow-hidden rounded-[calc(2.5rem-0.375rem)] bg-white p-7 sm:p-10 dark:bg-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-8">
          {/* Authentic Calligraphy Watermark */}
          <span className="font-cjk pointer-events-none select-none absolute -bottom-6 -right-3 text-[140px] font-black text-zinc-950/[0.03] dark:text-white/[0.03]">
            {currentLesson.hanziTag}
          </span>

          {/* Lektions-Header */}
          <div className="relative space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Lektion {currentIndex + 1} von {LESSONS.length}
              </span>
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
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-400">
              {currentLesson.subtitle}
            </p>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 pt-1">
              {currentLesson.summary}
            </p>
          </div>

          {/* 4. Formel-Kasten (Syntax-Box) */}
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6 dark:border-emerald-500/20 dark:bg-emerald-500/[0.03] space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Grammatik-Formel & Syntax
              </span>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-white/80 p-4 font-mono text-base font-bold text-emerald-900 shadow-xs dark:bg-zinc-950/70 dark:text-emerald-300 sm:text-lg">
              {currentLesson.formula.pattern}
            </div>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {currentLesson.formula.explanation}
            </p>
          </div>

          {/* 5. Kernregeln (Bullet-Pills) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Wichtige Grundregeln
            </h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {currentLesson.keyRules.map((rule, rIdx) => (
                <div
                  key={rIdx}
                  className="flex items-start gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 text-xs leading-relaxed text-zinc-700 dark:border-white/[0.06] dark:bg-zinc-950/40 dark:text-zinc-300"
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
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
                      <div className="flex items-baseline gap-3">
                        <span className="font-cjk text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                          {ex.hanzi}
                        </span>
                        <span className="font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                          {ex.pinyin}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        {ex.german}
                      </p>
                    </div>

                    {ex.audioUrl && (
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(ex.audioUrl)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-emerald-500/40 hover:bg-emerald-50 hover:text-emerald-800 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-emerald-400"
                        title="Beispielsatz anhören"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        Audio
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
                          <span className="font-cjk font-semibold text-zinc-800 dark:text-zinc-200">{b.part}</span>
                          <span className="text-[10px] text-zinc-400">= {b.meaning}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 7. Typische Stolperfallen (Pitfalls) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-500/80 dark:text-rose-400">
              Typische Stolperfallen deutscher Lerner
            </h3>
            <div className="space-y-2.5">
              {currentLesson.pitfalls.map((pit, pIdx) => (
                <div
                  key={pIdx}
                  className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-4.5 text-xs leading-relaxed space-y-2 dark:border-rose-500/20 dark:bg-rose-500/[0.02]"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-semibold">
                      <X className="h-4 w-4" />
                      <span>Falsch: <del className="decoration-rose-500 font-mono">{pit.wrong}</del></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <Check className="h-4 w-4" />
                      <span>Richtig: <span className="font-mono">{pit.right}</span></span>
                    </div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">Warum: </span>
                    {pit.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Interaktiver Mini-Check (Verständnis-Quiz) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Verständnis-Check
              </h3>
              <span className="font-mono text-xs text-zinc-400">Sofort-Test</span>
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
                        let btnStyle = 'border-zinc-200/80 bg-white text-zinc-700 hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300';
                        if (submitted) {
                          if (optIdx === quiz.correctIndex) {
                            btnStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-800 font-bold dark:border-emerald-400 dark:text-emerald-300';
                          } else if (isChosen) {
                            btnStyle = 'border-rose-500 bg-rose-500/15 text-rose-800 font-bold dark:border-rose-400 dark:text-rose-300 animate-shake';
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

          {/* 9. Lektion abschließen & Navigation Footer */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-zinc-100 dark:border-white/[0.05]">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => {
                stopCurrentAudio();
                setSelectedLessonId(LESSONS[currentIndex - 1].id);
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-5 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 disabled:pointer-events-none dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Vorherige Lektion
            </button>

            <div className="flex items-center gap-3">
              {!isCurrentCompleted && (
                <button
                  type="button"
                  onClick={() => markCompleted(currentLesson.id)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-whisper transition-all hover:bg-emerald-500"
                >
                  <Check className="h-4 w-4" />
                  Lektion als gemeistert markieren
                </button>
              )}

              {currentIndex < LESSONS.length - 1 && (
                <button
                  type="button"
                  onClick={() => {
                    stopCurrentAudio();
                    setSelectedLessonId(LESSONS[currentIndex + 1].id);
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                >
                  Nächste Lektion
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
