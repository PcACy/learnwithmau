import { useState } from 'react';
import { BookOpen, BookOpenText, Flame, Gamepad2, GraduationCap, HardDrive, LineChart, Settings } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/progressStore';
import { useKeyDown } from '../../hooks/useKeyDown';
import { ThemeToggle } from './ThemeToggle';
import { BackupModal } from '../dashboard/BackupModal';

function ShellSkeleton() {
  return (
    <div className="min-h-dvh bg-zinc-50 dark:bg-zinc-950" aria-busy="true" aria-label="Lade Fortschritt">
      <header className="sticky top-0 border-b border-zinc-200/60 bg-zinc-50/80 backdrop-blur dark:border-white/[0.06] dark:bg-zinc-950/80">
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
    { to: '/', label: 'Arcade', icon: Gamepad2 },
    { to: '/dictionary', label: 'Wörterbuch', icon: BookOpen },
    { to: '/grammar', label: 'Grammatik', icon: GraduationCap },
    { to: '/stories', label: 'Lesen', icon: BookOpenText },
    { to: '/stats', label: 'Fortschritt', icon: LineChart },
    { to: '/settings', label: 'Einstellungen', icon: Settings },
  ];

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-200/60 bg-zinc-50/80 backdrop-blur-md dark:border-white/[0.06] dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="group flex items-center gap-3 transition-transform duration-200 ease-[var(--ease-spring)] active:scale-[0.98]"
            >
              <span className="font-cjk flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-lg font-semibold text-white shadow-whisper transition-transform duration-200 group-hover:-rotate-6 dark:bg-emerald-500 dark:text-zinc-950">
                汉
              </span>
              <span className="text-base font-bold tracking-tight">Hanzi Arcade</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-1 sm:flex" aria-label="Hauptnavigation">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-300'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {streak > 0 && (
              <span className="flex h-9 items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3.5 font-mono text-sm font-medium text-emerald-700 dark:border-emerald-400/20 dark:text-emerald-400">
                <Flame className="h-4 w-4 animate-pulse-soft" aria-hidden />
                {streak}
              </span>
            )}
            <button
              type="button"
              onClick={() => setBackupOpen(true)}
              aria-label="Backup und Wiederherstellung öffnen"
              title="Backup & Wiederherstellung"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-700 shadow-whisper transition-all duration-200 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:border-emerald-600/35 hover:bg-zinc-50 active:translate-y-0 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-400/30 dark:hover:bg-zinc-800"
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

