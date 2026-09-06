import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  BookOpenText,
  Flame,
  GraduationCap,
  HardDrive,
  LineChart,
  MessagesSquare,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/progressStore';
import { useKeyDown } from '../../hooks/useKeyDown';
import { ThemeToggle } from './ThemeToggle';
import { BackupModal } from '../dashboard/BackupModal';
import { SealBadge } from '../ui/SealBadge';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function ShellSkeleton() {
  return (
    <div className="min-h-dvh bg-[#fbfbf9] dark:bg-[#09090b]" aria-busy="true" aria-label="Lade Fortschritt">
      <header className="sticky top-0 border-b border-zinc-200/60 bg-[#fbfbf9]/85 backdrop-blur-md dark:border-white/[0.06] dark:bg-[#09090b]/85">
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

export function AppShell() {
  const hydrated = useProgressStore((s) => s.hydrated);
  const streak = useProgressStore((s) => s.streak.current);
  const [backupOpen, setBackupOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Sliding Nav Pill State
  const navRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [pillRect, setPillRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  // Top Horizon Shimmer Progress Beam & Scroll Reset on Route Change
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathname = useRef(location.pathname);

  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname;
      setIsNavigating(true);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      const timer = window.setTimeout(() => setIsNavigating(false), 340);
      return () => window.clearTimeout(timer);
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
      navigate('/', { viewTransition: true });
    }
  });

  const NAV_LINKS = [
    { to: '/', label: 'Zentrale', icon: Sparkles },
    { to: '/dictionary', label: 'Wörterbuch', icon: BookOpen },
    { to: '/grammar', label: 'Grammatik', icon: GraduationCap },
    { to: '/stories', label: 'Lesen', icon: BookOpenText },
    { to: '/dialogue', label: 'Dialoge', icon: MessagesSquare },
    { to: '/exam', label: 'Prüfung', icon: Award },
    { to: '/stats', label: 'Fortschritt', icon: LineChart },
    { to: '/settings', label: 'Einstellungen', icon: Settings },
  ];

  const isLinkActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  const activeLink = NAV_LINKS.find((l) => isLinkActive(l.to));

  // Compute position of active link pill
  useIsomorphicLayoutEffect(() => {
    const updatePill = () => {
      if (!activeLink) {
        setPillRect((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }));
        return;
      }
      const el = linkRefs.current.get(activeLink.to);
      if (!el || !navRef.current) {
        setPillRect((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }));
        return;
      }
      setPillRect({
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight,
        opacity: 1,
      });
    };

    updatePill();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updatePill);
      if ('fonts' in document) {
        void document.fonts.ready.then(updatePill).catch(() => {});
      }
      return () => window.removeEventListener('resize', updatePill);
    }
  }, [location.pathname, activeLink]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsMounted(true), 60);
    return () => window.clearTimeout(timer);
  }, []);

  if (!hydrated) {
    return <ShellSkeleton />;
  }

  return (
    <div className="min-h-dvh bg-[#fbfbf9] text-zinc-900 dark:bg-[#09090b] dark:text-zinc-100">
      <header className="app-shell-header sticky top-0 z-30 border-b border-zinc-200/80 bg-[#fbfbf9]/90 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#09090b]/90 relative">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              viewTransition
              className="group flex items-center gap-3 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]"
            >
              <SealBadge sealChar="汉" label="HSK 1" variant="cinnabar" size="sm" />
              <div className="hidden sm:block">
                <span className="text-sm font-black tracking-tight text-zinc-900 dark:text-zinc-50 block leading-tight">
                  Hanzi Arcade
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links with Kinetic Sliding Indicator Pill */}
            <nav
              ref={navRef}
              className="relative hidden items-center gap-1 sm:flex"
              aria-label="Hauptnavigation"
            >
              {/* Sliding Milled Indicator Pill */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute rounded-full border border-emerald-600/30 bg-emerald-600/10 dark:border-emerald-500/30 dark:bg-emerald-500/15 motion-reduce:transition-none ${
                  isMounted ? 'transition-all duration-260 ease-[cubic-bezier(0.16,1,0.3,1)]' : ''
                }`}
                style={{
                  transform: `translate3d(${pillRect.left}px, ${pillRect.top}px, 0)`,
                  width: `${pillRect.width}px`,
                  height: `${pillRect.height}px`,
                  opacity: pillRect.opacity,
                }}
              />

              {NAV_LINKS.map((link) => {
                const isActive = isLinkActive(link.to);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    viewTransition
                    ref={(el) => {
                      if (el) linkRefs.current.set(link.to, el);
                      else linkRefs.current.delete(link.to);
                    }}
                    className={`relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                      isActive
                        ? 'text-emerald-900 font-bold dark:text-emerald-300'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 transition-transform duration-150 ${isActive ? 'scale-105' : ''}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Streak Counter with Amber Streak Accent */}
            {streak > 0 && (
              <Link
                to="/stats"
                viewTransition
                className="flex h-9 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 font-mono text-xs font-bold text-amber-700 dark:border-amber-500/20 dark:text-amber-400 hover:bg-amber-500/15 transition-all"
                title={`${streak} Tage Lernserie`}
              >
                <Flame className="h-3.5 w-3.5 fill-current animate-pulse-soft" aria-hidden />
                <span>{streak}d</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setBackupOpen(true)}
              aria-label="Backup und Wiederherstellung öffnen"
              title="Backup & Wiederherstellung"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-700 shadow-xs transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-emerald-600/35 hover:bg-zinc-50 active:scale-95 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-400/30 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <HardDrive className="h-4 w-4" aria-hidden />
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Tactical Horizon Shimmer Progress Beam on Route Transition */}
        {isNavigating && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden"
          >
            <div className="h-full w-full bg-gradient-to-r from-transparent via-emerald-600 dark:via-emerald-400 to-transparent animate-horizon-glide" />
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6 pb-28 sm:py-10 sm:px-8">
        <div key={location.pathname} className="route-transition-container">
          <Outlet />
        </div>
      </main>

      {/* Mobile Ergonomic Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200/80 bg-[#fbfbf9]/95 backdrop-blur-lg px-1 pt-1.5 safe-area-pb dark:border-white/[0.08] dark:bg-[#09090b]/95 shadow-whisper"
      >
        <div className="flex items-center justify-around">
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link.to);
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                viewTransition
                className={`flex flex-col items-center justify-center gap-0.5 px-1 py-1 text-[9px] font-semibold transition-all duration-150 active:scale-95 touch-manipulation ${
                  isActive
                    ? 'text-emerald-700 font-bold dark:text-emerald-400'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                      : ''
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="truncate max-w-[44px]">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <BackupModal open={backupOpen} onClose={() => setBackupOpen(false)} />
    </div>
  );
}

