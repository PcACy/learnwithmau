import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Headphones,
  Play,
  RotateCcw,
  Timer,
  Volume2,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import mockExamData from '../data/mockExam.json';
import type { ExamQuestion, ExamSubmission } from '../types/exam';
import { playAsset, stopCurrentAudio } from '../lib/audio';
import { fireCelebration } from '../lib/confetti';

const QUESTIONS = mockExamData as ExamQuestion[];
const DEFAULT_TIME_SEC = 35 * 60; // 35 Minuten

export function MockExamPage() {
  const [phase, setPhase] = useState<'intro' | 'exam' | 'result'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_SEC);
  const [isPaused, setIsPaused] = useState(false);
  const [resultFilter, setResultFilter] = useState<'all' | 'errors'>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submission, setSubmission] = useState<ExamSubmission | null>(null);

  const currentQ = QUESTIONS[currentIndex];

  // Prüfung auswerten
  const handleSubmitExam = useCallback(() => {
    setShowSubmitModal(false);
    stopCurrentAudio();

    let listeningCorrect = 0;
    let readingCorrect = 0;

    QUESTIONS.forEach((q) => {
      const given = answers[q.id];
      if (given === q.correctIndex) {
        if (q.section === 'listening') listeningCorrect += 1;
        else readingCorrect += 1;
      }
    });

    const listeningScore = Math.round((listeningCorrect / 15) * 150);
    const readingScore = Math.round((readingCorrect / 15) * 150);
    const score = listeningScore + readingScore;
    const passed = score >= 180;

    const sub: ExamSubmission = {
      startedAt: Date.now() - (DEFAULT_TIME_SEC - timeLeft) * 1000,
      finishedAt: Date.now(),
      answers,
      markedQuestions: Array.from(marked),
      score,
      listeningScore,
      readingScore,
      passed,
      totalAnswered: Object.keys(answers).length,
      totalCorrect: listeningCorrect + readingCorrect,
    };

    setSubmission(sub);
    setPhase('result');
    if (passed) {
      fireCelebration();
    }
  }, [answers, marked, timeLeft]);

  // Timer
  useEffect(() => {
    if (phase !== 'exam' || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isPaused, handleSubmitExam]);

  // Audio bei Fragenwechsel im Hörverstehen
  useEffect(() => {
    if (phase === 'exam' && currentQ?.audioUrl) {
      void playAsset(currentQ.audioUrl);
    }
    return () => stopCurrentAudio();
  }, [phase, currentQ]);

  // Start der Prüfung
  const startExam = useCallback(() => {
    setAnswers({});
    setMarked(new Set());
    setTimeLeft(DEFAULT_TIME_SEC);
    setCurrentIndex(0);
    setIsPaused(false);
    setPhase('exam');
  }, []);

  // Antwort auswählen
  const selectOption = (optIdx: number) => {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
  };

  // Frage markieren / entmarkieren
  const toggleMark = (qId: string) => {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  // ================= 1. INTRO PHASE =================
  if (phase === 'intro') {
    return (
      <div className="reveal mx-auto max-w-2xl space-y-8 py-8" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 font-cjk text-sm font-bold text-emerald-700 dark:text-emerald-400">
              考
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">
              Offizielle Simulation · HSK 1
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">HSK-1 Probeprüfung</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teste dein Chinesisch-Wissen unter realitätsnahen Bedingungen. Die Probeprüfung umfasst 30 Fragen aufgeteilt in Hör- und Leseverstehen.
          </p>
        </div>

        {/* Struktur-Karten */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-whisper dark:border-white/10 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                <Headphones className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-bold">Teil 1: Hörverstehen</h2>
                <p className="font-mono text-xs text-zinc-500">15 Fragen · Max. 150 Pkt.</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Wahr/Falsch-Abgleich, Dialog-Zuordnung und Audio-Bedeutungsfragen mit nativer Aussprache.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-whisper dark:border-white/10 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-bold">Teil 2: Leseverstehen</h2>
                <p className="font-mono text-xs text-zinc-500">15 Fragen · Max. 150 Pkt.</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Schriftzeichenerkennung, Satzbau, Lückentexte und logische Gesprächsführung.
            </p>
          </div>
        </div>

        {/* Prüfungsregeln */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-whisper dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Prüfungsbedingungen</h2>
          <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">01</span>
              <span><strong>Zeitlimit:</strong> 35 Minuten für alle 30 Fragen (kann bei Bedarf pausiert werden).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">02</span>
              <span><strong>Bestehensgrenze:</strong> Mindestens 180 von 300 Punkten (60 %).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">03</span>
              <span><strong>Flexibles Springen:</strong> Du kannst jederzeit zwischen Fragen vor- und zurückspringen und unklare Fragen für später markieren.</span>
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={startExam}
          className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-emerald-600 py-4 text-base font-bold text-white shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:bg-emerald-500 active:scale-[0.99]"
        >
          <span>Probeprüfung jetzt starten</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
            <Play className="h-4 w-4 fill-white" />
          </span>
        </button>
      </div>
    );
  }

  // ================= 2. LIVE EXAM PHASE =================
  if (phase === 'exam' && currentQ) {
    const answeredCount = Object.keys(answers).length;
    const isCurrentMarked = marked.has(currentQ.id);
    const selectedOpt = answers[currentQ.id];

    return (
      <div className="mx-auto max-w-3xl space-y-6 pb-20">
        {/* Fixed / Sticky Top Bar */}
        <div className="reveal sticky top-16 z-20 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-zinc-200/80 bg-white/95 p-4 shadow-whisper backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/95" style={{ '--index': 0 } as CSSProperties}>
          {/* Section Indicator */}
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {currentQ.section === 'listening' ? 'Teil 1: Hören' : 'Teil 2: Lesen'} · {currentIndex + 1}/30
            </span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2">
            <Timer className={`h-4 w-4 ${timeLeft <= 300 ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`} />
            <span className={`font-mono text-sm font-bold tabular-nums ${timeLeft <= 300 ? 'text-red-500' : ''}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Submit Action */}
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
          >
            Prüfung abgeben ({answeredCount}/30)
          </button>
        </div>

        {/* 30-Fragen Schnellwahl-Gitter */}
        <div className="reveal rounded-3xl border border-zinc-200/80 bg-white p-4 shadow-whisper dark:border-white/10 dark:bg-zinc-900" style={{ '--index': 1 } as CSSProperties}>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2.5">
            <span className="font-semibold uppercase tracking-wider">Fragenübersicht</span>
            <span>{answeredCount} von 30 beantwortet</span>
          </div>
          <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
            {QUESTIONS.map((q, idx) => {
              const isAns = answers[q.id] !== undefined;
              const isCur = idx === currentIndex;
              const isM = marked.has(q.id);

              let bg = 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300';
              if (isCur) bg = 'ring-2 ring-emerald-500 font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300';
              else if (isM) bg = 'bg-amber-500/20 text-amber-800 border border-amber-500/40 dark:text-amber-300';
              else if (isAns) bg = 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950 font-semibold';

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-8 rounded-lg font-mono text-xs transition-all ${bg}`}
                  title={`Frage ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Haupt-Fragekarte (Double-Bezel) */}
        <div
          className="reveal rounded-[2.5rem] p-1.5 bg-gradient-to-b from-white/10 to-white/5 border border-zinc-200/80 dark:border-white/10 dark:bg-white/[0.02] shadow-whisper"
          style={{ '--index': 2 } as CSSProperties}
        >
          <div className="rounded-[calc(2.5rem-0.375rem)] bg-white p-7 sm:p-9 dark:bg-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Frage {currentIndex + 1} von 30 · {currentQ.section === 'listening' ? 'Hörverstehen' : 'Leseverstehen'}
                </span>
                <h2 className="mt-1 text-lg font-bold sm:text-xl text-zinc-900 dark:text-zinc-100">
                  {currentQ.prompt}
                </h2>
              </div>

              {/* Bookmark Toggle */}
              <button
                type="button"
                onClick={() => toggleMark(currentQ.id)}
                aria-label="Frage markieren"
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                  isCurrentMarked
                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-300'
                    : 'border-zinc-200/80 bg-zinc-50 text-zinc-400 hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950/50'
                }`}
                title="Frage für spätere Durchsicht markieren"
              >
                <Bookmark className={`h-4 w-4 ${isCurrentMarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Chinese Text / Audio Prompts */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200/60 bg-zinc-50/50 p-6 text-center dark:border-white/[0.05] dark:bg-zinc-950/40">
              {currentQ.chineseText && (
                <span className="font-cjk text-3xl font-semibold sm:text-4xl text-zinc-900 dark:text-zinc-100">
                  {currentQ.chineseText}
                </span>
              )}

              {currentQ.audioUrl && (
                <button
                  type="button"
                  onClick={() => playAsset(currentQ.audioUrl!)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-xs font-bold text-emerald-800 transition-all hover:bg-emerald-500/20 active:translate-y-px dark:text-emerald-300"
                >
                  <Volume2 className="h-4 w-4" />
                  Audio abspielen / wiederholen
                </button>
              )}
            </div>

            {/* Antwort-Optionen */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedOpt === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => selectOption(optIdx)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left text-sm font-semibold transition-all duration-150 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300 shadow-whisper'
                        : 'border-zinc-200/80 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-zinc-950'
                          : 'border-zinc-300 text-zinc-400 dark:border-zinc-700'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Footer (Vor / Zurück) */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/[0.05]">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 transition-all hover:bg-zinc-50 disabled:opacity-30 disabled:pointer-events-none dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <ChevronLeft className="h-4 w-4" />
                Vorherige
              </button>

              {currentIndex < QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((i) => Math.min(QUESTIONS.length - 1, i + 1))}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-whisper transition-all hover:bg-emerald-500"
                >
                  Nächste
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-whisper transition-all hover:bg-emerald-500"
                >
                  Prüfung abgeben
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Abgabe-Bestätigungs-Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-zinc-900 space-y-4">
              <h2 className="text-xl font-bold">Prüfung jetzt abgeben?</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Du hast <strong>{answeredCount} von 30 Fragen</strong> beantwortet.
                {answeredCount < 30 && (
                  <span className="block mt-1 text-amber-600 dark:text-amber-400 font-semibold">
                    Achtung: {30 - answeredCount} Fragen sind noch unbeantwortet!
                  </span>
                )}
              </p>
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-300"
                >
                  Weiter bearbeiten
                </button>
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-whisper"
                >
                  Endgültig abgeben
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================= 3. RESULT / EVALUATION PHASE =================
  if (phase === 'result' && submission) {
    const filteredQuestions = QUESTIONS.filter((q) => {
      if (resultFilter === 'errors') {
        return submission.answers[q.id] !== q.correctIndex;
      }
      return true;
    });

    return (
      <div className="reveal mx-auto max-w-3xl space-y-8 py-8" style={{ '--index': 0 } as CSSProperties}>
        {/* Hero Score Card (Double Bezel) */}
        <div className="rounded-[2.5rem] p-1.5 bg-gradient-to-b from-white/10 to-white/5 border border-zinc-200/80 dark:border-white/10 shadow-whisper">
          <div className="rounded-[calc(2.5rem-0.375rem)] bg-white p-8 sm:p-10 text-center dark:bg-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-4">
            <div className="flex justify-center">
              <span
                className={`flex h-20 w-20 items-center justify-center rounded-3xl shadow-whisper ${
                  submission.passed
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                }`}
              >
                {submission.passed ? (
                  <CheckCircle2 className="h-10 w-10" />
                ) : (
                  <XCircle className="h-10 w-10" />
                )}
              </span>
            </div>

            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Prüfungsergebnis
              </span>
              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-100">
                {submission.passed ? 'HSK 1 Bestanden!' : 'Nicht bestanden'}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {submission.passed
                  ? 'Glückwunsch! Du hast das offizielle HSK-1-Niveau souverän erreicht.'
                  : 'Knapp verfehlt. Wiederhole deine Fehler im Vokabeltrainer und versuche es erneut.'}
              </p>
            </div>

            {/* Total Points */}
            <div className="my-6 inline-flex items-baseline gap-2 rounded-2xl border border-zinc-200/80 bg-zinc-50 px-6 py-3 dark:border-white/10 dark:bg-zinc-950/60">
              <span className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400">
                {submission.score}
              </span>
              <span className="font-mono text-sm text-zinc-400">/ 300 Punkte</span>
              <span className="ml-2 font-mono text-xs font-semibold text-zinc-400">
                ({Math.round((submission.score / 300) * 100)}%)
              </span>
            </div>

            {/* Sub-Score Breakdown */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 text-left">
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500">Teil 1: Hörverstehen</span>
                  <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {submission.listeningScore} / 150 Pkt.
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${(submission.listeningScore / 150) * 100}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500">Teil 2: Leseverstehen</span>
                  <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {submission.readingScore} / 150 Pkt.
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${(submission.readingScore / 150) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={startExam}
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-whisper transition-all hover:bg-emerald-500"
              >
                <RotateCcw className="h-4 w-4" />
                Erneut versuchen
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white px-5 py-3 text-sm font-bold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Trainings-Zentrale
              </Link>
            </div>
          </div>
        </div>

        {/* Detaillierte Fehler- und Lösungsanalyse */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Fragen- & Fehleranalyse</h2>
            <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-0.5 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => setResultFilter('all')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                  resultFilter === 'all'
                    ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
                }`}
              >
                Alle (30)
              </button>
              <button
                type="button"
                onClick={() => setResultFilter('errors')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                  resultFilter === 'errors'
                    ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
                }`}
              >
                Nur Fehler ({30 - submission.totalCorrect})
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const given = submission.answers[q.id];
              const isCorrect = given === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-5 transition-all ${
                    isCorrect
                      ? 'border-emerald-500/30 bg-white dark:border-emerald-500/20 dark:bg-zinc-900'
                      : 'border-rose-500/40 bg-white dark:border-rose-500/30 dark:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-zinc-400">
                        Frage {QUESTIONS.indexOf(q) + 1} · {q.section === 'listening' ? 'Hören' : 'Lesen'}
                      </span>
                      <h3 className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">{q.prompt}</h3>
                    </div>
                    <span
                      className={`flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold ${
                        isCorrect
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {isCorrect ? 'Richtig (+10)' : 'Falsch (+0)'}
                    </span>
                  </div>

                  {q.chineseText && (
                    <p className="mt-2 font-cjk text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                      {q.chineseText}
                    </p>
                  )}

                  {q.audioUrl && (
                    <button
                      type="button"
                      onClick={() => playAsset(q.audioUrl!)}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      Audio nochmals anhören
                    </button>
                  )}

                  <div className="mt-3 space-y-1.5 text-xs">
                    <p>
                      <span className="text-zinc-400">Deine Antwort: </span>
                      <span className={isCorrect ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'font-semibold text-rose-600 dark:text-rose-400'}>
                        {given !== undefined ? q.options[given] : 'Keine Antwort abgegeben'}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p>
                        <span className="text-zinc-400">Richtige Lösung: </span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {q.options[q.correctIndex]}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 dark:border-white/[0.04] dark:bg-zinc-950/40">
                    <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mr-1.5">
                        Erklärung
                      </span>
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
