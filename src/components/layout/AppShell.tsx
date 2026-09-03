import { useState } from 'react';
import {
  BookOpen,
  BookOpenText,
  Flame,
  GraduationCap,
  HardDrive,
  LineChart,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/progressStore';
import { useKeyDown } from '../../hooks/useKeyDown';
import { ThemeToggle } from './ThemeToggle';
import { BackupModal } from '../dashboard/BackupModal';
import { SealBadge } from '../ui/SealBadge';

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

  // Globale Navigation: Escape kehrt von jeder Sub-Page zum Dashboard zurück.
  // Ausnahme: Der TypeRacer nutzt Escape selbst (Eingabe leeren).
  useKeyDown((event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    if (backupOpen) return;
    if (event.key === 'Escape' && location.pathname !== '/' && location.pathname !== '/typeracer') {
      navigate('/');
    }
  });

  if (!hydrated) {
    return <ShellSkeleton />;
  }

  const NAV_LINKS = [
    { to: '/', label: 'Zentrale', icon: Sparkles },
    { to: '/dictionary', label: 'Wörterbuch', icon: BookOpen },
    { to: '/grammar', label: 'Grammatik', icon: GraduationCap },
    { to: '/stories', label: 'Lesen', icon: BookOpenText },
    { to: '/exam', label: 'Prüfung', icon: GraduationCap },
    { to: '/stats', label: 'Fortschritt', icon: LineChart },
    { to: '/settings', label: 'Einstellungen', icon: Settings },
  ];

  return (
    <div className="min-h-dvh bg-[#fbfbf9] text-zinc-900 dark:bg-[#09090b] dark:text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-[#fbfbf9]/90 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#09090b]/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="group flex items-center gap-3 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]"
            >
              <SealBadge sealChar="汉" label="HSK 1" variant="cinnabar" size="sm" />
              <div className="hidden sm:block">
                <span className="text-sm font-black tracking-tight text-zinc-900 dark:text-zinc-50 block leading-tight">
                  Hanzi Arcade
                </span>
                <span className="font-mono text-[10px] text-zinc-400 block tracking-widest uppercase">
                  Modern Classic
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Milled Pills) */}
            <nav className="hidden items-center gap-1 sm:flex" aria-label="Hauptnavigation">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'border border-emerald-600/30 bg-emerald-600/10 text-emerald-800 font-bold dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300'
                        : 'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
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
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <Outlet />
      </main>

      <BackupModal open={backupOpen} onClose={() => setBackupOpen(false)} />
    </div>
  );
}
