import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  AlertTriangle,
  Database,
  HardDrive,
  Minus,
  Monitor,
  Moon,
  Plus,
  Sun,
  Target,
} from 'lucide-react';
import { useProgressStore, DEFAULT_DAILY_TARGET } from '../store/progressStore';
import { applyTheme, useSettingsStore, type Theme } from '../store/settingsStore';
import { BackupModal } from '../components/dashboard/BackupModal';
import { resetAllLocalData } from '../lib/resetApp';

const APP_VERSION = '1.0.0-dev';

const THEME_OPTIONS: readonly { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'light', label: 'Hell', Icon: Sun },
  { value: 'dark', label: 'Dunkel', Icon: Moon },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="reveal rounded-[2rem] border border-zinc-200/70 bg-white p-6 shadow-whisper sm:p-7 dark:border-white/[0.06] dark:bg-zinc-900"
      style={{ '--index': 1 } as CSSProperties}
    >
      <h2 className="text-base font-bold tracking-tight">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function SettingsPage() {
  const dailyGoal = useProgressStore((s) => s.dailyGoal);
  const setDailyTarget = useProgressStore((s) => s.setDailyTarget);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  const [backupOpen, setBackupOpen] = useState(false);
  const [storageText, setStorageText] = useState<string>('–');
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void navigator.storage?.estimate?.().then((estimate) => {
      if (cancelled) return;
      const usageMb = ((estimate.usage ?? 0) / (1024 * 1024)).toFixed(1);
      const quotaMb = Math.round((estimate.quota ?? 0) / (1024 * 1024));
      setStorageText(`${usageMb} MB von ~${quotaMb} MB`);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!armed) return;
    const id = window.setTimeout(() => setArmed(false), 5000);
    return () => window.clearTimeout(id);
  }, [armed]);

  const stepTarget = useCallback(
    (delta: number) => {
      void setDailyTarget(dailyGoal.targetReviews + delta);
    },
    [dailyGoal.targetReviews, setDailyTarget],
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="reveal" style={{ '--index': 0 } as CSSProperties}>
        <p className="flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.1em] text-emerald-700 dark:text-emerald-400">
          <Database className="h-3.5 w-3.5" aria-hidden />
          Nachschlagen & Konfiguration
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Einstellungen</h1>
      </div>

      <Section title="Tagesziel">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Reviews pro Tag</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Zählt jede bewertete Karte in allen Modi.
            </p>
          </div>
          <div className="flex items-center gap-2" role="group" aria-label="Tagesziel anpassen">
            <button
              type="button"
              onClick={() => stepTarget(-5)}
              disabled={dailyGoal.targetReviews <= 5}
              aria-label="Tagesziel senken"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50 text-zinc-600 transition-all duration-150 hover:border-emerald-600/35 active:translate-y-px disabled:opacity-40 dark:border-white/[0.08] dark:bg-zinc-950/50 dark:text-zinc-300"
            >
              <Minus className="h-4 w-4" aria-hidden />
            </button>
            <span
              aria-live="polite"
              className="inline-flex min-w-16 items-center justify-center gap-1 rounded-xl bg-zinc-100 px-3 py-2 font-mono text-lg font-bold tabular-nums dark:bg-zinc-800"
            >
              <Target className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" aria-hidden />
              {dailyGoal.targetReviews}
            </span>
            <button
              type="button"
              onClick={() => stepTarget(5)}
              disabled={dailyGoal.targetReviews >= 100}
              aria-label="Tagesziel erhöhen"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50 text-zinc-600 transition-all duration-150 hover:border-emerald-600/35 active:translate-y-px disabled:opacity-40 dark:border-white/[0.08] dark:bg-zinc-950/50 dark:text-zinc-300"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
        <p className="mt-3 text-right font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
          Bereich 5–100 · Standard {DEFAULT_DAILY_TARGET}
        </p>
      </Section>

      <Section title="Design">
        <div
          role="radiogroup"
          aria-label="Farbschema wählen"
          className="grid grid-cols-3 gap-3"
        >
          {THEME_OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={theme === value}
              onClick={() => setTheme(value)}
              className={`flex h-20 flex-col items-center justify-center gap-1.5 rounded-2xl border transition-all duration-150 ease-[var(--ease-spring)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                theme === value
                  ? 'border-emerald-600 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/50 dark:text-emerald-300'
                  : 'border-zinc-200/80 bg-zinc-50 text-zinc-600 hover:border-emerald-600/30 dark:border-white/[0.08] dark:bg-zinc-950/40 dark:text-zinc-300'
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="text-xs font-semibold">{label}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          <Sun className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          „System“ folgt deiner OS-Einstellung automatisch – auch während die App läuft.
          {theme !== 'system' && (
            <>
              {' '}
              <button
                type="button"
                onClick={() => applyTheme('system')}
                className="underline decoration-dotted underline-offset-2 hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                Vorschau System
              </button>
            </>
          )}
        </p>
      </Section>

      <Section title="Lokale Daten">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/60 bg-zinc-50/70 px-4 py-3 dark:border-white/[0.04] dark:bg-zinc-950/40">
            <span className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
              <HardDrive className="h-4 w-4 text-zinc-400" aria-hidden />
              Belegter Speicher
            </span>
            <span className="font-mono text-sm tabular-nums">{storageText}</span>
          </div>

          <button
            type="button"
            onClick={() => setBackupOpen(true)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-all duration-200 ease-[var(--ease-spring)] hover:bg-emerald-500 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:w-auto sm:px-6"
          >
            Backup exportieren / einspielen
          </button>

          <div className="rounded-2xl border border-rose-500/25 bg-rose-500/[0.04] p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" aria-hidden />
              Gefahrenzone
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Löscht SRS-Karten, Streak, Statistiken und Einstellungen unwiderruflich.
              Exportiere vorher ein Backup.
            </p>
            <button
              type="button"
              onClick={() => (armed ? void resetAllLocalData() : setArmed(true))}
              onBlur={() => setArmed(false)}
              className={`mt-3 inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                armed
                  ? 'border-rose-600 bg-rose-600 text-white hover:bg-rose-500'
                  : 'border-rose-500/40 text-rose-700 hover:border-rose-500 dark:text-rose-400'
              }`}
            >
              {armed ? 'Wirklich löschen – klicken zum Bestätigen' : 'Alle Daten zurücksetzen'}
            </button>
          </div>
        </div>
      </Section>

      <p className="reveal pb-8 text-center font-mono text-[11px] text-zinc-400 dark:text-zinc-600" style={{ '--index': 2 } as CSSProperties}>
        Hanzi Arcade {APP_VERSION} · React · Dexie · Offline-first PWA
      </p>

      <BackupModal open={backupOpen} onClose={() => setBackupOpen(false)} />
    </div>
  );
}
