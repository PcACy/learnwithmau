import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Dumbbell,
  Flame,
  GraduationCap,
  HardDrive,
  Home,
  RotateCcw,
  Target,
  Trophy,
  User,
  type LucideIcon,
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/progressStore';
import { useKeyDown } from '../../hooks/useKeyDown';
import { stopCurrentAudio } from '../../lib/audio';
import { filterActiveMistakes } from '../../lib/mistakeBank';
import { levelFromXp } from '../../lib/xp';
import { ThemeToggle } from './ThemeToggle';
import { BackupModal } from '../dashboard/BackupModal';
import { SealBadge } from '../ui/SealBadge';
import { ProgressRing } from '../ui/ProgressRing';
import { ToastHost } from '../ui/Toast';
import { preloadAllRoutes, ROUTE_PRELOAD_MAP } from '../../routes/lazyRoutes';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function ShellSkeleton() {
  return (
    <div className="min-h-dvh bg-paper dark:bg-ink" aria-busy="true" aria-label="Lade Fortschritt">
      <header className="sticky top-0 border-b border-zinc-200/60 bg-paper/85 backdrop-blur-md dark:border-white/[0.06] dark:bg-ink/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <div className="skeleton-shimmer h-9 w-40 rounded-2xl" />
          <div className="flex gap-2">
            <div className="skeleton-shimmer h-11 w-20 rounded-full" />
            <div className="skeleton-shimmer h-11 w-11 rounded-xl" />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-8">
        <div className="skeleton-shimmer h-9 w-64 rounded-2xl" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-6">
          <div className="skeleton-shimmer h-36 rounded-[1.75rem] lg:col-span-2" />
          <div className="skeleton-shimmer h-36 rounded-[1.75rem] lg:col-span-4" />
          <div className="skeleton-shimmer h-36 rounded-[1.75rem] lg:col-span-4" />
          <div className="skeleton-shimmer h-36 rounded-[1.75rem] lg:col-span-2" />
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-6">
          <div className="skeleton-shimmer h-52 rounded-[2.5rem] lg:col-span-4" />
          <div className="skeleton-shimmer h-52 rounded-[2.5rem] lg:col-span-2" />
        </div>
      </main>
    </div>
  );
}

interface NavTab {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Weitere Pfade, die zu diesem Tab gehören. */
  also: readonly string[];
}

const NAV_TABS: readonly NavTab[] = [
  { to: '/', label: 'Heute', icon: Home, also: [] },
  {
    to: '/learn',
    label: 'Lernen',
    icon: GraduationCap,
    also: ['/plan', '/dictionary', '/grammar', '/stories', '/pinyin', '/strokes', '/culture'],
  },
  {
    to: '/practice',
    label: 'Üben',
    icon: Dumbbell,
    also: ['/review', '/blitz', '/mistakes', '/dialogue', '/ear-trainer', '/typeracer', '/alchemy', '/sentences', '/number-drill'],
  },
  { to: '/exam', label: 'Prüfung', icon: Trophy, also: [] },
  { to: '/stats', label: 'Profil', icon: User, also: ['/settings'] },
];

function isTabActive(tab: NavTab, currentPath: string): boolean {
  if (tab.to === '/') return currentPath === '/';
  return [tab.to, ...tab.also].some((p) => currentPath === p || currentPath.startsWith(`${p}/`));
}

export function AppShell() {
  const hydrated = useProgressStore((s) => s.hydrated);
  const streak = useProgressStore((s) => s.streak.current);
  const mistakes = useProgressStore((s) => s.mistakes);
  const xp = useProgressStore((s) => s.xp);
  const dailyGoal = useProgressStore((s) => s.dailyGoal);
  const level = useMemo(() => levelFromXp(xp), [xp]);
  const goalProgress = dailyGoal.targetReviews > 0 ? dailyGoal.completedReviews / dailyGoal.targetReviews : 0;
  const activeMistakesCount = useMemo(() => filterActiveMistakes(mistakes).length, [mistakes]);
  const [backupOpen, setBackupOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Scroll Reset on Route Change
  const prevPathname = useRef(location.pathname);

  useIsomorphicLayoutEffect(() => {
    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname;
      stopCurrentAudio();
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
  }, [location.pathname]);

  // Globale Navigation: Escape kehrt von jeder Sub-Page zum Dashboard zurück.
  useKeyDown((event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    if (backupOpen || event.defaultPrevented) return;
    if (event.key !== 'Escape') return;

    // Wenn ein Eingabeelement aktiv ist, nur entfokussieren (blur), nicht navigieren
    const activeEl = typeof document !== 'undefined' ? document.activeElement : null;
    if (
      activeEl instanceof HTMLElement &&
      (activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.isContentEditable)
    ) {
      event.preventDefault();
      activeEl.blur();
      return;
    }

    if (location.pathname !== '/' && location.pathname !== '/typeracer') {
      event.preventDefault();
      navigate('/');
    }
  });

  useEffect(() => {
    let preloadTimer: number | null = null;
    if (typeof window !== 'undefined') {
      const preload = () => {
        void preloadAllRoutes();
      };
      const win = window as Window & { requestIdleCallback?: (cb: () => void) => void };
      if (typeof win.requestIdleCallback === 'function') {
        preloadTimer = window.setTimeout(() => {
          win.requestIdleCallback?.(preload);
        }, 1500);
      } else {
        preloadTimer = window.setTimeout(preload, 2000);
      }
    }
    return () => {
      if (preloadTimer) window.clearTimeout(preloadTimer);
    };
  }, []);

  if (!hydrated) {
    return <ShellSkeleton />;
  }

  return (
    <div className="min-h-dvh bg-paper text-zinc-900 dark:bg-ink dark:text-zinc-100">
      <header className="app-shell-header sticky top-0 z-30 border-b-2 border-paper-tint bg-paper/90 backdrop-blur-md dark:border-zinc-800 dark:bg-ink/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-8">
          <Link
            to="/"
            className="group flex items-center gap-3 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]"
          >
            <SealBadge sealChar="汉" label="HSK 1" variant="cinnabar" size="sm" />
            <span className="hidden text-base font-black leading-tight tracking-tight text-zinc-900 sm:block dark:text-zinc-50">
              Hanzi Arcade
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Level + XP */}
            <Link
              to="/stats"
              className="flex h-10 items-center gap-2 rounded-full border-2 border-gold-500/40 bg-gold-500/15 pl-2.5 pr-3 transition-colors hover:bg-gold-500/25"
              title={`Level ${level.level}: ${level.title}, ${xp} XP`}
              aria-label={`Level ${level.level}, ${level.title}`}
            >
              <span className="font-mono text-xs font-bold text-gold-600 dark:text-gold-300">
                Lv {level.level}
              </span>
              <span
                aria-hidden
                className="hidden h-2 w-14 overflow-hidden rounded-full bg-black/10 sm:block dark:bg-white/15"
              >
                <span
                  className="block h-full rounded-full bg-gold-500 transition-[width] duration-700"
                  style={{ width: `${Math.round(level.progress * 100)}%` }}
                />
              </span>
            </Link>

            {/* Streak */}
            <Link
              to="/stats"
              className={`flex h-10 items-center gap-1.5 rounded-full border-2 px-3 font-mono text-xs font-bold transition-colors ${
                streak > 0
                  ? 'border-gold-600/40 bg-gold-600/15 text-gold-600 hover:bg-gold-600/25 dark:text-gold-400'
                  : 'border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400'
              }`}
              title={`${streak} Tage Lernserie`}
            >
              <Flame className={`h-4 w-4 ${streak > 0 ? 'fill-current animate-pulse-soft' : ''}`} aria-hidden />
              <span>{streak}</span>
            </Link>

            {/* Daily goal */}
            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center"
              title={`Tagesziel: ${dailyGoal.completedReviews} von ${dailyGoal.targetReviews}`}
            >
              <ProgressRing
                value={goalProgress}
                size={38}
                stroke={5}
                label="Tagesziel"
              >
                <Target className="h-4 w-4 text-jade-700 dark:text-jade-300" aria-hidden />
              </ProgressRing>
            </Link>

            {activeMistakesCount > 0 && (
              <Link
                to="/mistakes"
                className="hidden h-10 items-center gap-1.5 rounded-full border-2 border-cinnabar-500/40 bg-cinnabar-500/10 px-3 font-mono text-xs font-bold text-cinnabar-600 transition-colors hover:bg-cinnabar-500/20 sm:flex dark:text-cinnabar-400"
                title={`${activeMistakesCount} offene Schwachstellen im Fehlerheft`}
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                <span>{activeMistakesCount}</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setBackupOpen(true)}
              aria-label="Backup und Wiederherstellung öffnen"
              title="Backup & Wiederherstellung"
              className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-xl border-2 border-paper-tint bg-white text-zinc-700 transition-colors hover:border-jade-500/50 sm:flex dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <HardDrive className="h-4 w-4" aria-hidden />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Desktop rail */}
      <nav
        aria-label="Hauptnavigation"
        className="fixed bottom-0 left-0 top-16 z-20 hidden w-24 flex-col items-center gap-2 border-r-2 border-paper-tint px-2 py-6 sm:flex dark:border-zinc-800"
      >
        {NAV_TABS.map((tab) => (
          <TabLink key={tab.to} tab={tab} active={isTabActive(tab, location.pathname)} layout="rail" />
        ))}
      </nav>

      <main className="mx-auto max-w-6xl px-4 pt-6 pb-28 sm:py-10 sm:pl-32 sm:pr-8">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>

      {/* Mobile bottom bar */}
      <nav
        aria-label="Mobile Navigation"
        className="safe-area-pb fixed bottom-0 left-0 right-0 z-40 border-t-2 border-paper-tint bg-paper/95 px-2 pt-2 backdrop-blur-lg sm:hidden dark:border-zinc-800 dark:bg-ink/95"
      >
        <div className="grid grid-cols-5 gap-1">
          {NAV_TABS.map((tab) => (
            <TabLink key={tab.to} tab={tab} active={isTabActive(tab, location.pathname)} layout="bar" />
          ))}
        </div>
      </nav>

      <ToastHost />
      <BackupModal open={backupOpen} onClose={() => setBackupOpen(false)} />
    </div>
  );
}

function TabLink({ tab, active, layout }: { tab: NavTab; active: boolean; layout: 'rail' | 'bar' }) {
  const Icon = tab.icon;
  const preload = () => void ROUTE_PRELOAD_MAP[tab.to]?.();
  const size = layout === 'rail' ? 'h-16 w-[4.75rem]' : 'h-14 w-full';
  return (
    <Link
      to={tab.to}
      onMouseEnter={preload}
      onFocus={preload}
      onTouchStart={preload}
      aria-current={active ? 'page' : undefined}
      className={`flex ${size} touch-manipulation flex-col items-center justify-center gap-0.5 rounded-2xl border-2 text-xs font-bold transition-colors ${
        active
          ? 'border-jade-500/50 bg-jade-500/15 text-jade-800 dark:text-jade-300'
          : 'border-transparent text-zinc-600 hover:bg-paper-tint dark:text-zinc-400 dark:hover:bg-zinc-800/60'
      }`}
    >
      <Icon className="h-6 w-6" strokeWidth={active ? 2.25 : 1.75} aria-hidden />
      <span>{tab.label}</span>
    </Link>
  );
}
