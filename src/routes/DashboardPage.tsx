import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
  Gamepad2,
  LineChart,
  Play,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { useKeyDown } from '../hooks/useKeyDown';
import { MODES } from '../config/modes';
import { VOCAB } from '../data';
import { selectDueItemIds, selectMastery } from '../lib/srsQuery';

const ALL_ITEM_IDS: readonly string[] = VOCAB.map((item) => item.id);

export function DashboardPage() {
  const cards = useProgressStore((s) => s.cards);
  const streak = useProgressStore((s) => s.streak);
  const dailyGoal = useProgressStore((s) => s.dailyGoal);
  const navigate = useNavigate();

  const dueToday = useMemo(
    () => selectDueItemIds(cards, ALL_ITEM_IDS, new Date()).length,
    [cards],
  );
  const mastery = selectMastery(cards, VOCAB.length);
  const masteryPercent = Math.round(mastery * 100);
  const goalReached = dailyGoal.completedReviews >= dailyGoal.targetReviews;

  // Globale Shortcuts 1-6 im Dashboard
  useKeyDown((event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

    const num = Number.parseInt(event.key, 10);
    if (num >= 1 && num <= MODES.length) {
      navigate(MODES[num - 1].path);
    }
  });

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Header & Quick Stat Badges */}
      <div className="reveal flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 font-cjk text-sm font-bold text-emerald-700 dark:text-emerald-400">
              汉
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400">
              Hanzi Arcade · HSK 1
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Trainings-Zentrale</h1>
        </div>

        {/* Quick Stat Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/stats"
            title="Zu den detaillierten Statistiken"
            className="flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all hover:border-emerald-500/40 dark:border-white/10 dark:bg-zinc-900"
          >
            <Flame className={`h-3.5 w-3.5 ${streak.current > 0 ? 'text-amber-500 fill-amber-500' : 'text-zinc-400'}`} />
            <span>{streak.current} Tage Streak</span>
          </Link>

          <Link
            to="/stats"
            title="Zu den detaillierten Statistiken"
            className="flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all hover:border-emerald-500/40 dark:border-white/10 dark:bg-zinc-900"
          >
            <Target className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {dailyGoal.completedReviews}/{dailyGoal.targetReviews} Ziel
            </span>
          </Link>

          <Link
            to="/stats"
            title="Zu den detaillierten Statistiken"
            className="flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all hover:border-emerald-500/40 dark:border-white/10 dark:bg-zinc-900"
          >
            <TrendingUp className="h-3.5 w-3.5 text-sky-500" />
            <span>{masteryPercent}% Mastery</span>
          </Link>
        </div>
      </div>

      {/* 2. Hero Call-To-Action Card (Tages-Startpunkt & Blitz) */}
      <div
        className="reveal relative overflow-hidden rounded-[2.5rem] border border-emerald-600/30 bg-gradient-to-br from-emerald-500/[0.08] via-white to-white p-7 shadow-whisper dark:from-emerald-500/[0.12] dark:via-zinc-900 dark:to-zinc-900 dark:border-emerald-500/20"
        style={{ '--index': 1 } as CSSProperties}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                <Sparkles className="h-3 w-3" />
                Tages-Empfehlung
              </span>
              {goalReached && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Tagesziel erreicht!
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold tracking-tight sm:text-2xl text-zinc-900 dark:text-zinc-100">
              {dueToday > 0
                ? `${dueToday} Vokabeln heute zur Wiederholung bereit`
                : 'Alles für heute erledigt! 🎉'}
            </h2>

            <p className="max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {dueToday > 0
                ? 'Festige dein Langzeit-Gedächtnis mit der intelligenten SM-2-Wiederholung für den 100% HSK-1-Katalog.'
                : 'Großartige Arbeit! Alle fälligen Wiederholungen sind abgeschlossen. Trainiere deine Geschwindigkeit im Blitz-Modus oder baue neue Sätze.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {dueToday > 0 ? (
              <Link
                to="/review"
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-whisper transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-500/20 active:translate-y-px"
              >
                <Play className="h-4 w-4 fill-white" />
                Jetzt wiederholen ({dueToday})
              </Link>
            ) : (
              <Link
                to="/typeracer"
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-whisper transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-500/20 active:translate-y-px"
              >
                <Gamepad2 className="h-4 w-4" />
                Pinyin TypeRacer spielen
              </Link>
            )}

            <Link
              to="/blitz"
              className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3.5 text-sm font-bold text-amber-800 shadow-xs transition-all hover:bg-amber-500/20 dark:text-amber-300"
            >
              <Zap className="h-4 w-4 fill-amber-500 text-amber-500" />
              2-Min-Blitz
            </Link>

            <Link
              to="/dictionary"
              className="flex items-center gap-1.5 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-zinc-700 shadow-xs transition-all hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
            >
              Wörterbuch
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Die 6 Trainingsmodi (3x2 Raster) */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="reveal text-2xl font-bold tracking-tight" style={{ '--index': 2 } as CSSProperties}>
              Trainingsmodi
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Interaktive Übungen für Vokabeln, Grammatik, Pinyin, Töne, Gehör und Schriftzeichen
            </p>
          </div>
          <span className="hidden font-mono text-xs text-zinc-400 sm:block dark:text-zinc-500">
            Drücke <kbd className="rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">1</kbd>–<kbd className="rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">6</kbd> zum Starten
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {MODES.map((mode, i) => (
            <Link
              key={mode.id}
              to={mode.path}
              style={{ '--index': i + 3 } as CSSProperties}
              className="reveal group flex flex-col justify-between rounded-[2.5rem] border border-zinc-200/70 bg-white p-7 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 hover:border-emerald-600/35 hover:shadow-[0_28px_56px_-20px_rgba(16,185,129,0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 active:translate-y-0 active:scale-[0.99] dark:border-white/[0.06] dark:bg-zinc-900 dark:hover:border-emerald-400/30"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition-colors duration-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:text-emerald-400">
                    <mode.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="rounded-lg border border-zinc-200/80 bg-zinc-50 px-2.5 py-1 font-mono text-xs font-bold text-zinc-400 transition-colors group-hover:border-emerald-600/30 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:border-white/[0.06] dark:bg-zinc-950/60 dark:text-zinc-500 dark:group-hover:border-emerald-400/30 dark:group-hover:text-emerald-400">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">{mode.title}</h3>
                <p className="mt-0.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-400">
                  {mode.tagline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {mode.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span>Jetzt starten</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Nachschlagen, Fortschritt & Konfiguration */}
      <section className="space-y-4">
        <h2 className="reveal text-xl font-bold tracking-tight" style={{ '--index': 9 } as CSSProperties}>
          Tools & Fortschritt
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Link
            to="/dictionary"
            style={{ '--index': 10 } as CSSProperties}
            className="reveal group flex items-center justify-between gap-4 rounded-[2rem] border border-zinc-200/70 bg-white p-5 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:border-emerald-600/35 dark:border-white/[0.06] dark:bg-zinc-900 dark:hover:border-emerald-400/30"
          >
            <span className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition-colors duration-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:text-emerald-400">
                <BookOpen className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block font-semibold tracking-tight">Wörterbuch</span>
                <span className="block text-xs text-zinc-500 dark:text-zinc-400">162 Wörter & Strichfolge</span>
              </span>
            </span>
            <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-500 dark:group-hover:text-emerald-400" />
          </Link>

          <Link
            to="/stats"
            style={{ '--index': 11 } as CSSProperties}
            className="reveal group flex items-center justify-between gap-4 rounded-[2rem] border border-zinc-200/70 bg-white p-5 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:border-emerald-600/35 dark:border-white/[0.06] dark:bg-zinc-900 dark:hover:border-emerald-400/30"
          >
            <span className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition-colors duration-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:text-emerald-400">
                <LineChart className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block font-semibold tracking-tight">Statistiken & Erfolge</span>
                <span className="block text-xs text-zinc-500 dark:text-zinc-400">Heatmap, Badges & SM-2</span>
              </span>
            </span>
            <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-500 dark:group-hover:text-emerald-400" />
          </Link>

          <Link
            to="/settings"
            style={{ '--index': 12 } as CSSProperties}
            className="reveal group flex items-center justify-between gap-4 rounded-[2rem] border border-zinc-200/70 bg-white p-5 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:border-emerald-600/35 dark:border-white/[0.06] dark:bg-zinc-900 dark:hover:border-emerald-400/30"
          >
            <span className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition-colors duration-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:text-emerald-400">
                <Settings className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block font-semibold tracking-tight">Einstellungen</span>
                <span className="block text-xs text-zinc-500 dark:text-zinc-400">Backup, Theme & Ziel</span>
              </span>
            </span>
            <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-500 dark:group-hover:text-emerald-400" />
          </Link>
        </div>
      </section>
    </div>
  );
}
