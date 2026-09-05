import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Crown,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  Headphones,
  Keyboard,
  LineChart,
  Lock,
  MessageSquareQuote,
  Play,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActivityHeatmap } from '../components/dashboard/ActivityHeatmap';
import { SrsDistributionBar } from '../components/dashboard/SrsDistributionBar';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { useProgressStore } from '../store/progressStore';
import { VOCAB } from '../data';
import { db } from '../lib/db';
import { selectDueItemIds } from '../lib/srsQuery';
import { ACHIEVEMENTS } from '../config/achievements';
import { MASTERY_LEVELS, getMasteryLevel } from '../lib/mastery';

const ALL_ITEM_IDS: readonly string[] = VOCAB.map((item) => item.id);

export function StatsPage() {
  const cards = useProgressStore((s) => s.cards);
  const streak = useProgressStore((s) => s.streak);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sessionStats, setSessionStats] = useState<{
    alchemySolved: number;
    tonesCorrect: number;
    sentencesSolved: number;
    blitzCompleted: number;
    typeracerCorrect: number;
    numbersCorrect: number;
    reviewCount: number;
    examPassed: number;
  }>({
    alchemySolved: 0,
    tonesCorrect: 0,
    sentencesSolved: 0,
    blitzCompleted: 0,
    typeracerCorrect: 0,
    numbersCorrect: 0,
    reviewCount: 0,
    examPassed: 0,
  });

  useEffect(() => {
    let cancelled = false;
    void db.stats
      .toArray()
      .then((rows) => {
        if (cancelled) return;
        let alchemySolved = 0;
        let tonesCorrect = 0;
        let sentencesSolved = 0;
        let blitzCompleted = 0;
        let typeracerCorrect = 0;
        let numbersCorrect = 0;
        let reviewCount = 0;
        let examPassed = 0;

        for (const row of rows) {
          if (row.mode === 'alchemy') alchemySolved += row.correct;
          else if (row.mode === 'ear-trainer') tonesCorrect += row.correct;
          else if (row.mode === 'sentences') sentencesSolved += row.correct;
          else if (row.mode === 'blitz') blitzCompleted += 1;
          else if (row.mode === 'typeracer') typeracerCorrect += row.correct;
          else if (row.mode === 'number-drill') numbersCorrect += row.correct;
          else if (row.mode === 'review') reviewCount += row.answered;
          else if (row.mode === 'exam') {
            if (row.correct >= 18) examPassed += 1;
          }
        }

        setSessionStats({
          alchemySolved,
          tonesCorrect,
          sentencesSolved,
          blitzCompleted,
          typeracerCorrect,
          numbersCorrect,
          reviewCount,
          examPassed,
        });
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const dueToday = useMemo(
    () => selectDueItemIds(cards, ALL_ITEM_IDS, new Date()).length,
    [cards],
  );

  // Zähle Vokabeln nach Meisterungsstufe (0-5)
  const masteryCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0];
    for (const item of VOCAB) {
      const card = cards[item.id];
      const level = getMasteryLevel(card).level;
      counts[level]++;
    }
    return counts;
  }, [cards]);

  // Achievement-Fortschritte berechnen
  const achievementProgress = useMemo(() => {
    return ACHIEVEMENTS.map((ach) => {
      const { current, unlocked } = ach.calculateProgress({
        cards,
        streak,
        stats: sessionStats,
      });
      return {
        ...ach,
        current,
        unlocked,
      };
    });
  }, [cards, streak, sessionStats]);

  const unlockedCount = achievementProgress.filter((a) => a.unlocked).length;

  const filteredAchievements = useMemo(() => {
    if (filterCategory === 'all') return achievementProgress;
    return achievementProgress.filter((a) => a.category === filterCategory);
  }, [achievementProgress, filterCategory]);

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="reveal flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <p className="flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
            <LineChart className="h-3.5 w-3.5" aria-hidden />
            Analytics & Gedächtnis
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Fortschritt & Statistiken</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Detaillierte Auswertung deines Langzeit-Lernfortschritts für alle {VOCAB.length} HSK-1-Vokabeln.
          </p>
        </div>

        {dueToday > 0 && (
          <Link
            to="/review"
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-whisper transition-all hover:bg-emerald-500 active:translate-y-px"
          >
            <Play className="h-4 w-4 fill-white" />
            Heute fällig: {dueToday}
          </Link>
        )}
      </div>

      {/* Haupt-Metriken (StatsGrid) */}
      <StatsGrid />

      {/* Vokabel-Meisterungsstufen (Stufen 0–5) */}
      <section
        className="reveal space-y-4 rounded-[2.5rem] border border-zinc-200/70 bg-white p-7 shadow-whisper dark:border-white/[0.06] dark:bg-zinc-900"
        style={{ '--index': 1 } as CSSProperties}
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <Crown className="h-5 w-5 text-amber-500" />
              Vokabel-Meisterungsstufen (HSK 1)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Fortschritt aller {VOCAB.length} Wörter basierend auf dem SM-2-Gedächtnis-Intervall
            </p>
          </div>
          <span className="font-mono text-xs font-semibold text-zinc-400">
            {VOCAB.length - masteryCounts[0]} / {VOCAB.length} gelernt
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 pt-2">
          {MASTERY_LEVELS.map((lvl) => (
            <div
              key={lvl.level}
              className={`flex flex-col items-center rounded-2xl border p-3.5 text-center transition-all ${lvl.badgeClass}`}
            >
              <span className="font-mono text-2xl font-extrabold">{masteryCounts[lvl.level]}</span>
              <span className="mt-1 text-xs font-bold">{lvl.name}</span>
              <span className="mt-0.5 text-[10px] opacity-75">{lvl.shortName}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics & SRS-Verteilung */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section
          className="reveal rounded-[2.5rem] border border-zinc-200/70 bg-white p-7 shadow-whisper dark:border-white/[0.06] dark:bg-zinc-900 lg:col-span-7"
          style={{ '--index': 2 } as CSSProperties}
        >
          <ActivityHeatmap />
        </section>

        <section
          className="reveal rounded-[2.5rem] border border-zinc-200/70 bg-white p-7 shadow-whisper dark:border-white/[0.06] dark:bg-zinc-900 lg:col-span-5"
          style={{ '--index': 3 } as CSSProperties}
        >
          <SrsDistributionBar cards={cards} />
        </section>
      </div>

      {/* Trainings- & Spiel-Aktivitäten */}
      <section
        className="reveal space-y-4 rounded-[2.5rem] border border-zinc-200/70 bg-white p-7 shadow-whisper dark:border-white/[0.06] dark:bg-zinc-900"
        style={{ '--index': 4 } as CSSProperties}
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <Gamepad2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Trainings- & Spiel-Aktivitäten
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Absolvierte Runden und gelöste Aufgaben in den interaktiven Lernmodi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 pt-2">
          {/* TypeRacer */}
          <div className="flex flex-col items-center rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-3.5 text-center dark:border-white/[0.06] dark:bg-zinc-950/40">
            <Keyboard className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mb-1" />
            <span className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">{sessionStats.typeracerCorrect}</span>
            <span className="mt-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">TypeRacer</span>
            <span className="text-[10px] text-zinc-400">Zeichen getippt</span>
          </div>

          {/* Alchemy */}
          <div className="flex flex-col items-center rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-3.5 text-center dark:border-white/[0.06] dark:bg-zinc-950/40">
            <FlaskConical className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mb-1" />
            <span className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">{sessionStats.alchemySolved}</span>
            <span className="mt-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">Alchemie</span>
            <span className="text-[10px] text-zinc-400">Zeichen fusioniert</span>
          </div>

          {/* Satzbau */}
          <div className="flex flex-col items-center rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-3.5 text-center dark:border-white/[0.06] dark:bg-zinc-950/40">
            <MessageSquareQuote className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mb-1" />
            <span className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">{sessionStats.sentencesSolved}</span>
            <span className="mt-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">Satzbau</span>
            <span className="text-[10px] text-zinc-400">Sätze gelöst</span>
          </div>

          {/* Ear-Trainer */}
          <div className="flex flex-col items-center rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-3.5 text-center dark:border-white/[0.06] dark:bg-zinc-950/40">
            <Headphones className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mb-1" />
            <span className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">{sessionStats.tonesCorrect}</span>
            <span className="mt-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">Ear-Trainer</span>
            <span className="text-[10px] text-zinc-400">Töne erkannt</span>
          </div>

          {/* Numbers */}
          <div className="flex flex-col items-center rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-3.5 text-center dark:border-white/[0.06] dark:bg-zinc-950/40">
            <CalendarClock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mb-1" />
            <span className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">{sessionStats.numbersCorrect}</span>
            <span className="mt-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">Zahlen & Zeit</span>
            <span className="text-[10px] text-zinc-400">Angaben erkannt</span>
          </div>

          {/* Exam */}
          <div className="flex flex-col items-center rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-3.5 text-center dark:border-white/[0.06] dark:bg-zinc-950/40">
            <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mb-1" />
            <span className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">{sessionStats.examPassed}</span>
            <span className="mt-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">HSK 1 Prüfung</span>
            <span className="text-[10px] text-zinc-400">Examen bestanden</span>
          </div>
        </div>
      </section>

      {/* Achievements- & Trophäen-Galerie */}
      <section
        className="reveal space-y-5 rounded-[2.5rem] border border-zinc-200/70 bg-white p-7 shadow-whisper dark:border-white/[0.06] dark:bg-zinc-900"
        style={{ '--index': 5 } as CSSProperties}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold tracking-tight">Erfolge & Abzeichen</h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {unlockedCount} von {ACHIEVEMENTS.length} Trophäen freigeschaltet
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800" role="tablist">
            {[
              { id: 'all', label: 'Alle' },
              { id: 'vocab', label: 'Vokabeln' },
              { id: 'streak', label: 'Streak' },
              { id: 'mastery', label: 'Meister' },
              { id: 'games', label: 'Spiele' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterCategory(tab.id)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  filterCategory === tab.id
                    ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          {filteredAchievements.map((ach) => {
            const Icon = ach.icon;
            const percent = Math.min(100, Math.round((ach.current / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                className={`flex gap-3.5 rounded-2xl border p-4 transition-all ${
                  ach.unlocked
                    ? 'border-emerald-500/30 bg-emerald-500/[0.04] dark:border-emerald-400/25 dark:bg-emerald-950/15'
                    : 'border-zinc-200/80 bg-zinc-50/50 opacity-70 dark:border-white/5 dark:bg-zinc-950/30'
                }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    ach.unlocked
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'bg-zinc-200/60 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
                  }`}
                >
                  {ach.unlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </span>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="truncate font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {ach.title}
                    </h3>
                    <span className="font-mono text-[10px] font-bold text-zinc-400">
                      {ach.current}/{ach.maxProgress}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {ach.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800 mt-2">
                    <div
                      className={`h-full transition-all duration-300 ${ach.unlocked ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Action Navigation */}
      <div className="reveal grid grid-cols-1 gap-5 sm:grid-cols-2" style={{ '--index': 5 } as CSSProperties}>
        <Link
          to="/"
          className="group flex items-center justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-whisper transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-600/40 dark:border-white/10 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <RotateCcw className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Zurück zum Arcade-Training</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">6 Spiele & Modi zum Üben</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
        </Link>

        <Link
          to="/dictionary"
          className="group flex items-center justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-whisper transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-600/40 dark:border-white/10 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100">HSK-1 Wörterbuch</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Alle 162 Wörter & Strichreihenfolge</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
        </Link>
      </div>
    </div>
  );
}
