import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  BookOpen,
  BookOpenText,
  CheckCircle2,
  ChevronRight,
  Flame,
  FlaskConical,
  GraduationCap,
  Headphones,
  Keyboard,
  Layers,
  MessageSquareQuote,
  Play,
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
import { getCompletedGrammar, getCompletedStories } from '../lib/db';
import grammarData from '../data/grammar.json';
import storiesData from '../data/stories.json';
import type { GrammarLesson } from '../types/grammar';
import type { Story } from '../types/story';
import { KineticButton } from '../components/ui/KineticButton';
import { SealBadge } from '../components/ui/SealBadge';

const ALL_ITEM_IDS: readonly string[] = VOCAB.map((item) => item.id);
const LESSONS = grammarData as GrammarLesson[];
const STORIES = storiesData as Story[];

export function DashboardPage() {
  const cards = useProgressStore((s) => s.cards);
  const streak = useProgressStore((s) => s.streak);
  const dailyGoal = useProgressStore((s) => s.dailyGoal);
  const navigate = useNavigate();

  const [completedGrammar, setCompletedGrammar] = useState<string[]>([]);
  const [completedStories, setCompletedStories] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([getCompletedGrammar(), getCompletedStories()]).then(([g, s]) => {
      if (cancelled) return;
      setCompletedGrammar(g);
      setCompletedStories(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const dueToday = useMemo(
    () => selectDueItemIds(cards, ALL_ITEM_IDS, new Date()).length,
    [cards],
  );
  const mastery = selectMastery(cards, VOCAB.length);
  const masteryPercent = Math.round(mastery * 100);
  const goalReached = dailyGoal.completedReviews >= dailyGoal.targetReviews;

  const nextGrammarLesson = useMemo(() => {
    return LESSONS.find((l) => !completedGrammar.includes(l.id));
  }, [completedGrammar]);

  const nextStory = useMemo(() => {
    return STORIES.find((s) => !completedStories.includes(s.id));
  }, [completedStories]);

  const SHORTCUT_ROUTES = [
    '/typeracer',     // 1
    '/alchemy',       // 2
    '/sentences',     // 3
    '/number-drill',  // 4
    '/ear-trainer',   // 5
    '/blitz',         // 6
    '/exam',          // 7
    '/review',        // 8
  ];

  // Globale Shortcuts 1-8 im Dashboard
  useKeyDown((event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

    const num = Number.parseInt(event.key, 10);
    if (num >= 1 && num <= SHORTCUT_ROUTES.length) {
      navigate(SHORTCUT_ROUTES[num - 1]);
    }
  });

  return (
    <div className="space-y-12 pb-24">
      {/* 1. Header & Quick Stat Badges */}
      <div
        className="reveal flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ '--index': 0 } as CSSProperties}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <SealBadge sealChar="汉" label="ZENTRALE · HSK 1" variant="cinnabar" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
            Trainings-Zentrale
          </h1>
        </div>

        {/* Quick Stat Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/stats"
            title="Zu den detaillierten Statistiken"
            className="group flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-800 dark:text-amber-300 shadow-xs transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-500/15"
          >
            <Flame
              className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${
                streak.current > 0 ? 'text-amber-600 fill-current' : 'text-zinc-400'
              }`}
            />
            <span className="font-mono">{streak.current} Tage Streak</span>
          </Link>

          <Link
            to="/stats"
            title="Zu den detaillierten Statistiken"
            className="group flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/90 px-4 py-2 text-xs font-semibold text-zinc-700 shadow-xs transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-emerald-500/40 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-200"
          >
            <Target className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110" />
            <span className="font-mono">
              {dailyGoal.completedReviews}/{dailyGoal.targetReviews} Ziel
            </span>
          </Link>

          <Link
            to="/stats"
            title="Zu den detaillierten Statistiken"
            className="group flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/90 px-4 py-2 text-xs font-semibold text-zinc-700 shadow-xs transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-emerald-500/40 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-200"
          >
            <TrendingUp className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 transition-transform group-hover:scale-110" />
            <span className="font-mono">{masteryPercent}% Meisterschaft</span>
          </Link>
        </div>
      </div>

      {/* 2. Intelligente Hero Call-To-Action Card (Double-Bezel Architecture) */}
      <div
        className="reveal double-bezel-casing shadow-whisper"
        style={{ '--index': 1 } as CSSProperties}
      >
        <div className="double-bezel-core p-7 sm:p-10 space-y-6">
          {/* Subtle Background Watermark */}
          <span className="watermark-glyph">
            学
          </span>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2.5 max-w-xl">
              <div className="flex items-center gap-2.5">
                <SealBadge
                  sealChar="荐"
                  label="TAGES-EMPFEHLUNG"
                  variant="jade"
                  size="sm"
                />
                {goalReached && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" />
                    Tagesziel erreicht
                  </span>
                )}
              </div>

              {/* Dynamic recommendation headline */}
              {dueToday > 0 ? (
                <>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-100">
                    {dueToday} Vokabeln heute zur Wiederholung bereit
                  </h2>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Festige dein Langzeit-Gedächtnis mit der intelligenten SM-2-Wiederholung für den vollständigen HSK-1-Katalog.
                  </p>
                </>
              ) : nextGrammarLesson ? (
                <>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-100">
                    Nächster Lehrbuch-Schritt: {nextGrammarLesson.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Lerne {nextGrammarLesson.subtitle} im didaktischen HSK-1 Grammatik-Lehrgang.
                  </p>
                </>
              ) : nextStory ? (
                <>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-100">
                    Nächste Lesegeschichte: {nextStory.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {nextStory.pinyinTitle} · {nextStory.germanTitle} — {nextStory.summary}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-100">
                    Alle HSK-1-Lehrbuchinhalte gemeistert!
                  </h2>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Beweise dein Können im 35-minütigen HSK-1 Prüfungssimulator unter realistischen Testbedingungen.
                  </p>
                </>
              )}
            </div>

            {/* Dynamic Kinetic CTAs */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {dueToday > 0 ? (
                <KineticButton
                  variant="primary"
                  onClick={() => navigate('/review')}
                  icon={<Play className="h-4 w-4 fill-white" />}
                >
                  Jetzt wiederholen ({dueToday})
                </KineticButton>
              ) : nextGrammarLesson ? (
                <KineticButton
                  variant="primary"
                  onClick={() => navigate(`/grammar?lesson=${encodeURIComponent(nextGrammarLesson.id)}`)}
                >
                  Lektion starten
                </KineticButton>
              ) : nextStory ? (
                <KineticButton
                  variant="primary"
                  onClick={() => navigate(`/stories?id=${nextStory.id}`)}
                >
                  Geschichte lesen
                </KineticButton>
              ) : (
                <KineticButton
                  variant="primary"
                  onClick={() => navigate('/exam')}
                >
                  Prüfungssimulator
                </KineticButton>
              )}

              <Link
                to="/blitz"
                className="group inline-flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-amber-500/10 py-2 pl-4 pr-2 text-xs font-bold text-amber-800 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-500/20 active:scale-[0.98] dark:text-amber-300"
              >
                <span>2-Min-Blitz</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 transition-transform duration-200 group-hover:scale-105 dark:text-amber-300">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 3-SÄULEN CURRICULUM ARCHITEKTUR */}

      {/* SÄULE 1: LEHRBUCH & SPRACHVERSTÄNDNIS */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between border-b border-zinc-200/80 dark:border-white/[0.08] pb-3">
          <div className="flex items-center gap-3">
            <SealBadge sealChar="书" label="SÄULE 1" variant="jade" size="sm" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Lehrbuch & Textverständnis
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Systematischer Wissensaufbau für das offizielle HSK-1-Zertifikat
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tile: Grammatik */}
          <Link
            to="/grammar"
            className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-whisper transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 dark:border-white/[0.08] dark:bg-zinc-900 flex flex-col justify-between gap-5"
          >
            <span className="watermark-glyph text-[100px]! -bottom-4! -right-2!">文</span>
            <div className="space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {completedGrammar.length} / {LESSONS.length} gemeistert
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Grammatik-Kompendium</h3>
                <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mt-0.5">
                  {LESSONS.length} Didaktische Lektionen
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  SVO-Satzbau, Kopula 是, Ortsangaben 在, Entscheidungsfragen 吗 und Vollendung 了.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 pt-2">
              <span>Lehrgang öffnen</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Tile: Lesegeschichten */}
          <Link
            to="/stories"
            className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-whisper transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 dark:border-white/[0.08] dark:bg-zinc-900 flex flex-col justify-between gap-5"
          >
            <span className="watermark-glyph text-[100px]! -bottom-4! -right-2!">读</span>
            <div className="space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <BookOpenText className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {completedStories.length} / {STORIES.length} gelesen
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Geschichten & Lesetexte</h3>
                <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mt-0.5">
                  Graded Reader HSK 1
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Authentische Kurzgeschichten mit synchronem Audio, Pinyin-Toggle und Wort-Lookup.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 pt-2">
              <span>Geschichten lesen</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Tile: Wörterbuch */}
          <Link
            to="/dictionary"
            className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-whisper transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 dark:border-white/[0.08] dark:bg-zinc-900 flex flex-col justify-between gap-5"
          >
            <span className="watermark-glyph text-[100px]! -bottom-4! -right-2!">典</span>
            <div className="space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <BookOpen className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  163 Vokabeln
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Wörterbuch & Schriftzeichen</h3>
                <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mt-0.5">
                  HanziWriter & Beispielsätze
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Interaktiver Strichfolge-Trainer, Radikal-Dekomposition und 100% echte HSK-1-Beispiele.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 pt-2">
              <span>Wörterbuch nachschlagen</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* SÄULE 2: SCHRIFT & MOTORIK */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between border-b border-zinc-200/80 dark:border-white/[0.08] pb-3">
          <div className="flex items-center gap-3">
            <SealBadge sealChar="技" label="SÄULE 2" variant="stone" size="sm" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Schrift & Motorik
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Interaktive Arcade-Arenen für Zeichenaufbau, IME-Eingabe und Satzstrukturen
              </p>
            </div>
          </div>
          <span className="hidden font-mono text-xs text-zinc-400 sm:block">
            Tastatur: <kbd className="rounded border px-1.5 py-0.5 text-[11px] font-mono">1</kbd>–<kbd className="rounded border px-1.5 py-0.5 text-[11px] font-mono">4</kbd>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1: Pinyin TypeRacer */}
          <Link
            to="/typeracer"
            className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-whisper transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 dark:border-white/[0.08] dark:bg-zinc-900 flex flex-col justify-between gap-4"
          >
            <span className="watermark-glyph text-[80px]! -bottom-3! -right-2!">打</span>
            <div className="space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  <Keyboard className="h-5 w-5" />
                </span>
                <span className="rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] font-bold text-zinc-400 dark:border-white/10 dark:bg-zinc-800">
                  [1]
                </span>
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Pinyin TypeRacer</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Tippe Pinyin flüssig und wähle Schriftzeichen im originalgetreuen IME-Kandidatenfeld.
              </p>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Starten</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* 2: Hanzi Alchemy */}
          <Link
            to="/alchemy"
            className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-whisper transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 dark:border-white/[0.08] dark:bg-zinc-900 flex flex-col justify-between gap-4"
          >
            <span className="watermark-glyph text-[80px]! -bottom-3! -right-2!">合</span>
            <div className="space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  <FlaskConical className="h-5 w-5" />
                </span>
                <span className="rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] font-bold text-zinc-400 dark:border-white/10 dark:bg-zinc-800">
                  [2]
                </span>
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Hanzi-Alchemie</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Kombiniere Grundradikale (Wasser 氵, Mensch 亻, Mund 口) zu fertigen Zeichen.
              </p>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Starten</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* 3: Satzbau-Meister */}
          <Link
            to="/sentences"
            className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-whisper transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 dark:border-white/[0.08] dark:bg-zinc-900 flex flex-col justify-between gap-4"
          >
            <span className="watermark-glyph text-[80px]! -bottom-3! -right-2!">句</span>
            <div className="space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  <MessageSquareQuote className="h-5 w-5" />
                </span>
                <span className="rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] font-bold text-zinc-400 dark:border-white/10 dark:bg-zinc-800">
                  [3]
                </span>
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Satzbau-Meister</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Bringe chinesische Wort-Kacheln in die korrekte grammatikalische SVO-Reihenfolge.
              </p>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Starten</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* 4: Zahlen-Drill */}
          <Link
            to="/number-drill"
            className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-whisper transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 dark:border-white/[0.08] dark:bg-zinc-900 flex flex-col justify-between gap-4"
          >
            <span className="watermark-glyph text-[80px]! -bottom-3! -right-2!">数</span>
            <div className="space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  <Sparkles className="h-5 w-5" />
                </span>
                <span className="rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] font-bold text-zinc-400 dark:border-white/10 dark:bg-zinc-800">
                  [4]
                </span>
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Zahlen-Drill</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Chinesische Ziffern 0–99, Preise, Mengenangaben und Uhrzeiten reflexartig verstehen.
              </p>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Starten</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* SÄULE 3: PRÜFUNG & GEDÄCHTNIS */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between border-b border-zinc-200/80 dark:border-white/[0.08] pb-3">
          <div className="flex items-center gap-3">
            <SealBadge sealChar="考" label="SÄULE 3" variant="cinnabar" size="sm" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Prüfung & Gedächtnis
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Wiederholungs-Algorithmen, Tondiskriminierung und realistische HSK-1-Prüfungssimulation
              </p>
            </div>
          </div>
          <span className="hidden font-mono text-xs text-zinc-400 sm:block">
            Tastatur: <kbd className="rounded border px-1.5 py-0.5 text-[11px] font-mono">5</kbd>–<kbd className="rounded border px-1.5 py-0.5 text-[11px] font-mono">8</kbd>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 5: Gehörtraining */}
          <Link
            to="/ear-trainer"
            className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-whisper transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 dark:border-white/[0.08] dark:bg-zinc-900 flex flex-col justify-between gap-4"
          >
            <span className="watermark-glyph text-[80px]! -bottom-3! -right-2!">听</span>
            <div className="space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  <Headphones className="h-5 w-5" />
                </span>
                <span className="rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] font-bold text-zinc-400 dark:border-white/10 dark:bg-zinc-800">
                  [5]
                </span>
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Gehörtraining</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Tondiskriminierung der 4 Töne und Minimalpaare (z. B. b/p, d/t, zh/ch).
              </p>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Starten</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* 6: 2-Minuten-Blitz */}
          <Link
            to="/blitz"
            className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-whisper transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/50 dark:border-white/[0.08] dark:bg-zinc-900 flex flex-col justify-between gap-4"
          >
            <span className="watermark-glyph text-[80px]! -bottom-3! -right-2!">快</span>
            <div className="space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 transition-colors">
                  <Zap className="h-5 w-5" />
                </span>
                <span className="rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] font-bold text-zinc-400 dark:border-white/10 dark:bg-zinc-800">
                  [6]
                </span>
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">2-Minuten-Blitz</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                High-Speed Vokabel-Review: Wie viele Begriffe erkennst du in 90 Sekunden?
              </p>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-amber-700 dark:text-amber-400">
              <span>Starten</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* 7: HSK 1 Prüfungssimulator */}
          <Link
            to="/exam"
            className="group relative overflow-hidden rounded-3xl border border-rose-500/30 bg-rose-500/[0.03] p-5 shadow-whisper transition-all duration-200 hover:-translate-y-1 hover:border-rose-500/60 dark:border-rose-500/20 dark:bg-rose-500/[0.02] flex flex-col justify-between gap-4"
          >
            <span className="watermark-glyph text-[80px]! -bottom-3! -right-2!">考</span>
            <div className="space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 transition-colors">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <span className="rounded-md border border-rose-500/30 bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-rose-700 dark:bg-zinc-900 dark:text-rose-400">
                  [7]
                </span>
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">HSK-1 Prüfung</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Offizieller 35-minütiger Test: 20 Hörverständnis- & 20 Leseaufgaben mit Timer.
              </p>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-rose-700 dark:text-rose-400">
              <span>Prüfung starten</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* 8: SRS-Wiederholungsstapel */}
          <Link
            to="/review"
            className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-whisper transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 dark:border-white/[0.08] dark:bg-zinc-900 flex flex-col justify-between gap-4"
          >
            <span className="watermark-glyph text-[80px]! -bottom-3! -right-2!">忆</span>
            <div className="space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  <Layers className="h-5 w-5" />
                </span>
                <span className="rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] font-bold text-zinc-400 dark:border-white/10 dark:bg-zinc-800">
                  [8]
                </span>
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">SRS-Wiederholung</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Spaced-Repetition: {dueToday > 0 ? `${dueToday} Karten fällig` : 'Heute auf dem aktuellen Stand'}.
              </p>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Stapel öffnen</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
