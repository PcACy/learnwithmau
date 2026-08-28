import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Flame,
  FlaskConical,
  Gamepad2,
  Headphones,
  Keyboard,
  Layers,
  LineChart,
  MessageSquareQuote,
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

  const SHORTCUT_ROUTES = [
    '/review',
    '/typeracer',
    '/alchemy',
    '/sentences',
    '/ear-trainer',
    '/number-drill',
    '/blitz',
  ];

  // Globale Shortcuts 1-7 im Dashboard
  useKeyDown((event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

    const num = Number.parseInt(event.key, 10);
    if (num >= 1 && num <= SHORTCUT_ROUTES.length) {
      navigate(SHORTCUT_ROUTES[num - 1]);
    }
  });

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Header & Quick Stat Badges */}
      <div className="reveal flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" style={{ '--index': 0 } as CSSProperties}>
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 font-cjk text-sm font-bold text-emerald-700 dark:text-emerald-400">
              汉
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">
              Hanzi Arcade · HSK 1
            </span>
          </div>
          <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight sm:text-4xl">Trainings-Zentrale</h1>
        </div>

        {/* Quick Stat Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/stats"
            title="Zu den detaillierten Statistiken"
            className="group flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-4 py-2 text-xs font-semibold shadow-xs transition-all duration-200 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:border-emerald-500/40 dark:border-white/10 dark:bg-zinc-900"
          >
            <Flame className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${streak.current > 0 ? 'text-amber-500 fill-amber-500' : 'text-zinc-400'}`} />
            <span>{streak.current} Tage Streak</span>
          </Link>

          <Link
            to="/stats"
            title="Zu den detaillierten Statistiken"
            className="group flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-4 py-2 text-xs font-semibold shadow-xs transition-all duration-200 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:border-emerald-500/40 dark:border-white/10 dark:bg-zinc-900"
          >
            <Target className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110" />
            <span>
              {dailyGoal.completedReviews}/{dailyGoal.targetReviews} Ziel
            </span>
          </Link>

          <Link
            to="/stats"
            title="Zu den detaillierten Statistiken"
            className="group flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-4 py-2 text-xs font-semibold shadow-xs transition-all duration-200 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:border-emerald-500/40 dark:border-white/10 dark:bg-zinc-900"
          >
            <TrendingUp className="h-3.5 w-3.5 text-sky-500 transition-transform group-hover:scale-110" />
            <span>{masteryPercent}% Mastery</span>
          </Link>
        </div>
      </div>

      {/* 2. Hero Call-To-Action Card (Double-Bezel Architecture) */}
      <div
        className="reveal rounded-[2.5rem] p-1.5 bg-gradient-to-b from-emerald-500/20 via-zinc-200/50 to-zinc-200/30 dark:from-emerald-500/20 dark:via-white/[0.05] dark:to-white/[0.02] border border-emerald-600/30 dark:border-emerald-500/20 shadow-whisper"
        style={{ '--index': 1 } as CSSProperties}
      >
        <div className="relative overflow-hidden rounded-[calc(2.5rem-0.375rem)] bg-gradient-to-br from-emerald-500/[0.07] via-white to-white p-7 sm:p-9 dark:from-emerald-500/[0.12] dark:via-zinc-900 dark:to-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
          {/* Subtle Background Watermark */}
          <span className="font-cjk pointer-events-none select-none absolute -bottom-8 -right-4 text-[130px] font-black text-emerald-950/[0.03] dark:text-emerald-400/[0.04]">
            学
          </span>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/15 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="h-3 w-3" />
                  Tages-Empfehlung
                </span>
                {goalReached && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" />
                    Ziel erreicht
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-100">
                {dueToday > 0
                  ? `${dueToday} Vokabeln heute zur Wiederholung bereit`
                  : 'Alle Wiederholungen für heute abgeschlossen'}
              </h2>

              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {dueToday > 0
                  ? 'Festige dein Langzeit-Gedächtnis mit der intelligenten SM-2-Wiederholung für den vollständigen HSK-1-Katalog.'
                  : 'Hervorragende Arbeit. Trainiere deine Tipp-Geschwindigkeit im TypeRacer oder starte eine 2-Minuten-Blitzsession.'}
              </p>
            </div>

            {/* Button-in-Button Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {dueToday > 0 ? (
                <Link
                  to="/review"
                  className="group inline-flex items-center gap-3 rounded-full bg-emerald-600 py-2.5 pl-6 pr-2.5 text-sm font-bold text-white shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:bg-emerald-500 hover:shadow-[0_14px_28px_-8px_rgba(16,185,129,0.35)] active:scale-[0.98]"
                >
                  <span>Jetzt wiederholen ({dueToday})</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 ease-[var(--ease-spring)] group-hover:translate-x-0.5 group-hover:scale-105">
                    <Play className="h-3.5 w-3.5 fill-white text-white" />
                  </span>
                </Link>
              ) : (
                <Link
                  to="/typeracer"
                  className="group inline-flex items-center gap-3 rounded-full bg-emerald-600 py-2.5 pl-6 pr-2.5 text-sm font-bold text-white shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:bg-emerald-500 hover:shadow-[0_14px_28px_-8px_rgba(16,185,129,0.35)] active:scale-[0.98]"
                >
                  <span>TypeRacer starten</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 ease-[var(--ease-spring)] group-hover:translate-x-0.5 group-hover:scale-105">
                    <Gamepad2 className="h-3.5 w-3.5 text-white" />
                  </span>
                </Link>
              )}

              <Link
                to="/blitz"
                className="group inline-flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-amber-500/10 py-2.5 pl-5 pr-2.5 text-sm font-bold text-amber-800 transition-all duration-300 ease-[var(--ease-spring)] hover:bg-amber-500/20 active:scale-[0.98] dark:text-amber-300"
              >
                <span>2-Min-Blitz</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 transition-transform duration-200 ease-[var(--ease-spring)] group-hover:scale-105 dark:text-amber-300">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Asymmetrisches Bento-Grid für Trainingsmodi */}
      <section className="space-y-6">
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
            Tastatur-Schnellstart: <kbd className="rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">1</kbd>–<kbd className="rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">7</kbd>
          </span>
        </div>

        {/* Bento Grid Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          {/* Tile 1 (Row 1): Fälligkeits-Drill (7 Spalten Feature Hero) */}
          <Link
            to="/review"
            style={{ '--index': 3 } as CSSProperties}
            className="reveal group relative overflow-hidden rounded-[2.25rem] p-1 bg-white/[0.04] border border-zinc-200/80 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 hover:border-emerald-600/40 dark:border-white/[0.08] dark:bg-white/[0.02] col-span-1 md:col-span-2 lg:col-span-7 active:scale-[0.99]"
          >
            <div className="relative h-full overflow-hidden rounded-[calc(2.25rem-0.25rem)] bg-white p-7 dark:bg-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between">
              {/* Calligraphy Watermark */}
              <span className="font-cjk pointer-events-none select-none absolute -bottom-4 -right-2 text-[100px] font-black text-zinc-950/[0.04] dark:text-white/[0.04] transition-transform duration-500 group-hover:scale-105">
                记
              </span>

              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition-colors duration-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:text-emerald-400">
                    <Layers className="h-5 w-5" />
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                      {dueToday} fällig
                    </span>
                    <span className="rounded-lg border border-zinc-200/80 bg-zinc-50 px-2.5 py-1 font-mono text-xs font-bold text-zinc-400 dark:border-white/[0.06] dark:bg-zinc-950/60 dark:text-zinc-500">
                      1
                    </span>
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-bold tracking-tight">Fälligkeits-Drill</h3>
                <p className="mt-0.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-400">
                  SM-2-Karten selbst bewerten
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-md">
                  Wiederhole alle fälligen Vokabeln im klassischen Karteikarten-Stil mit intelligenter Intervall-Steuerung.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span>Jetzt wiederholen</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Tile 2 (Row 1): Pinyin TypeRacer (5 Spalten) */}
          <Link
            to="/typeracer"
            style={{ '--index': 4 } as CSSProperties}
            className="reveal group relative overflow-hidden rounded-[2.25rem] p-1 bg-white/[0.04] border border-zinc-200/80 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 hover:border-emerald-600/40 dark:border-white/[0.08] dark:bg-white/[0.02] col-span-1 md:col-span-2 lg:col-span-5 active:scale-[0.99]"
          >
            <div className="relative h-full overflow-hidden rounded-[calc(2.25rem-0.25rem)] bg-white p-7 dark:bg-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between">
              {/* Calligraphy Watermark */}
              <span className="font-cjk pointer-events-none select-none absolute -bottom-4 -right-2 text-[100px] font-black text-zinc-950/[0.04] dark:text-white/[0.04] transition-transform duration-500 group-hover:scale-105">
                打
              </span>

              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition-colors duration-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:text-emerald-400">
                    <Keyboard className="h-5 w-5" />
                  </span>
                  <span className="rounded-lg border border-zinc-200/80 bg-zinc-50 px-2.5 py-1 font-mono text-xs font-bold text-zinc-400 dark:border-white/[0.06] dark:bg-zinc-950/60 dark:text-zinc-500">
                    2
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold tracking-tight">Pinyin TypeRacer</h3>
                <p className="mt-0.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-400">
                  IME-Training & Schnelligkeit
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Tippe Pinyin flüssig und wähle das passende Zeichen per Zifferntaste.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span>Rennen starten</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Tile 3 (Row 2): Hanzi Alchemy (4 Spalten) */}
          <Link
            to="/alchemy"
            style={{ '--index': 5 } as CSSProperties}
            className="reveal group relative overflow-hidden rounded-[2.25rem] p-1 bg-white/[0.04] border border-zinc-200/80 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 hover:border-emerald-600/40 dark:border-white/[0.08] dark:bg-white/[0.02] col-span-1 lg:col-span-4 active:scale-[0.99]"
          >
            <div className="relative h-full overflow-hidden rounded-[calc(2.25rem-0.25rem)] bg-white p-7 dark:bg-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between">
              <span className="font-cjk pointer-events-none select-none absolute -bottom-4 -right-2 text-[90px] font-black text-zinc-950/[0.04] dark:text-white/[0.04] transition-transform duration-500 group-hover:scale-105">
                合
              </span>

              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition-colors duration-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:text-emerald-400">
                    <FlaskConical className="h-5 w-5" />
                  </span>
                  <span className="rounded-lg border border-zinc-200/80 bg-zinc-50 px-2.5 py-1 font-mono text-xs font-bold text-zinc-400 dark:border-white/[0.06] dark:bg-zinc-950/60 dark:text-zinc-500">
                    3
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">Hanzi Alchemy</h3>
                <p className="mt-0.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-400">
                  Radikale fusionieren
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Kombiniere Radikal-Bausteine zu echten Schriftzeichen.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span>Experiment starten</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Tile 4 (Row 2): Satzbau-Baukasten (4 Spalten) */}
          <Link
            to="/sentences"
            style={{ '--index': 6 } as CSSProperties}
            className="reveal group relative overflow-hidden rounded-[2.25rem] p-1 bg-white/[0.04] border border-zinc-200/80 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 hover:border-emerald-600/40 dark:border-white/[0.08] dark:bg-white/[0.02] col-span-1 lg:col-span-4 active:scale-[0.99]"
          >
            <div className="relative h-full overflow-hidden rounded-[calc(2.25rem-0.25rem)] bg-white p-7 dark:bg-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between">
              <span className="font-cjk pointer-events-none select-none absolute -bottom-4 -right-2 text-[90px] font-black text-zinc-950/[0.04] dark:text-white/[0.04] transition-transform duration-500 group-hover:scale-105">
                句
              </span>

              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition-colors duration-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:text-emerald-400">
                    <MessageSquareQuote className="h-5 w-5" />
                  </span>
                  <span className="rounded-lg border border-zinc-200/80 bg-zinc-50 px-2.5 py-1 font-mono text-xs font-bold text-zinc-400 dark:border-white/[0.06] dark:bg-zinc-950/60 dark:text-zinc-500">
                    4
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">Satzbau-Baukasten</h3>
                <p className="mt-0.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-400">
                  Grammatik & Wortfolge
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Baue vollständige HSK-1-Sätze aus gemischten Wortkarten.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span>Sätze bauen</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Tile 5 (Row 2): Pinyin Ear-Trainer (4 Spalten) */}
          <Link
            to="/ear-trainer"
            style={{ '--index': 7 } as CSSProperties}
            className="reveal group relative overflow-hidden rounded-[2.25rem] p-1 bg-white/[0.04] border border-zinc-200/80 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 hover:border-emerald-600/40 dark:border-white/[0.08] dark:bg-white/[0.02] col-span-1 md:col-span-2 lg:col-span-4 active:scale-[0.99]"
          >
            <div className="relative h-full overflow-hidden rounded-[calc(2.25rem-0.25rem)] bg-white p-7 dark:bg-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between">
              <span className="font-cjk pointer-events-none select-none absolute -bottom-4 -right-2 text-[90px] font-black text-zinc-950/[0.04] dark:text-white/[0.04] transition-transform duration-500 group-hover:scale-105">
                听
              </span>

              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition-colors duration-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:text-emerald-400">
                    <Headphones className="h-5 w-5" />
                  </span>
                  <span className="rounded-lg border border-zinc-200/80 bg-zinc-50 px-2.5 py-1 font-mono text-xs font-bold text-zinc-400 dark:border-white/[0.06] dark:bg-zinc-950/60 dark:text-zinc-500">
                    5
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">Ear-Trainer</h3>
                <p className="mt-0.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-400">
                  Minimal Pairs & Töne
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Unterscheide feine Ton- und Silbenunterschiede per Gehör.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span>Audio-Drill starten</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Tile 6 (Row 3): Number & Time Drill (6 Spalten) */}
          <Link
            to="/number-drill"
            style={{ '--index': 8 } as CSSProperties}
            className="reveal group relative overflow-hidden rounded-[2.25rem] p-1 bg-white/[0.04] border border-zinc-200/80 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 hover:border-emerald-600/40 dark:border-white/[0.08] dark:bg-white/[0.02] col-span-1 md:col-span-1 lg:col-span-6 active:scale-[0.99]"
          >
            <div className="relative h-full overflow-hidden rounded-[calc(2.25rem-0.25rem)] bg-white p-7 dark:bg-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between">
              <span className="font-cjk pointer-events-none select-none absolute -bottom-4 -right-2 text-[95px] font-black text-zinc-950/[0.04] dark:text-white/[0.04] transition-transform duration-500 group-hover:scale-105">
                数
              </span>

              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 transition-colors duration-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:text-emerald-400">
                    <CalendarClock className="h-5 w-5" />
                  </span>
                  <span className="rounded-lg border border-zinc-200/80 bg-zinc-50 px-2.5 py-1 font-mono text-xs font-bold text-zinc-400 dark:border-white/[0.06] dark:bg-zinc-950/60 dark:text-zinc-500">
                    6
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">Number & Time Drill</h3>
                <p className="mt-0.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-400">
                  Zahlen, Uhrzeiten & Daten
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Lerne chinesische Zahlen bis 999.999 sowie Datums- und Uhrzeitangaben.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span>Zahlen üben</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Tile 7 (Row 3): 2-Minuten-Blitz (6 Spalten) */}
          <Link
            to="/blitz"
            style={{ '--index': 9 } as CSSProperties}
            className="reveal group relative overflow-hidden rounded-[2.25rem] p-1 bg-white/[0.04] border border-amber-500/30 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 hover:border-amber-500/50 dark:border-amber-500/20 dark:bg-amber-500/[0.02] col-span-1 md:col-span-1 lg:col-span-6 active:scale-[0.99]"
          >
            <div className="relative h-full overflow-hidden rounded-[calc(2.25rem-0.25rem)] bg-white p-7 dark:bg-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between">
              <span className="font-cjk pointer-events-none select-none absolute -bottom-4 -right-2 text-[95px] font-black text-amber-500/[0.05] dark:text-amber-400/[0.05] transition-transform duration-500 group-hover:scale-105">
                快
              </span>

              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 transition-colors duration-300 group-hover:bg-amber-500/20 dark:text-amber-400">
                    <Zap className="h-5 w-5 fill-current" />
                  </span>
                  <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-300">
                    7
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">2-Minuten-Blitzsession</h3>
                <p className="mt-0.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-amber-700 dark:text-amber-400">
                  Schnelligkeit & Multi-Drill
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  90-Sekunden-Countdown mit gemischten Vokabel-, Pinyin- und Ton-Fragen.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-700 dark:text-amber-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span>Blitz starten</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Nachschlagen, Fortschritt & Konfiguration */}
      <section className="space-y-4">
        <h2 className="reveal text-xl font-bold tracking-tight" style={{ '--index': 10 } as CSSProperties}>
          Tools & Fortschritt
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Link
            to="/dictionary"
            style={{ '--index': 11 } as CSSProperties}
            className="reveal group flex items-center justify-between gap-4 rounded-[2rem] border border-zinc-200/70 bg-white p-5 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:border-emerald-600/35 dark:border-white/[0.06] dark:bg-zinc-900 dark:hover:border-emerald-400/30 active:scale-[0.99]"
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
            style={{ '--index': 12 } as CSSProperties}
            className="reveal group flex items-center justify-between gap-4 rounded-[2rem] border border-zinc-200/70 bg-white p-5 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:border-emerald-600/35 dark:border-white/[0.06] dark:bg-zinc-900 dark:hover:border-emerald-400/30 active:scale-[0.99]"
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
            style={{ '--index': 13 } as CSSProperties}
            className="reveal group flex items-center justify-between gap-4 rounded-[2rem] border border-zinc-200/70 bg-white p-5 shadow-whisper transition-all duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:border-emerald-600/35 dark:border-white/[0.06] dark:bg-zinc-900 dark:hover:border-emerald-400/30 active:scale-[0.99]"
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
