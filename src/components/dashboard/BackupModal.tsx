import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, FileJson, HardDrive, Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { exportBackup, importBackup, type ImportResult } from '../../lib/db';
import { useProgressStore } from '../../store/progressStore';

interface BackupModalProps {
  open: boolean;
  onClose: () => void;
}

export function BackupModal({ open, onClose }: BackupModalProps) {
  const cards = useProgressStore((s) => s.cards);
  const streak = useProgressStore((s) => s.streak);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  // Blockt in der Capture-Phase sämtliche weiteren Keydown-Listener
  // (Modus-Shortcuts, Trainer-Eingaben …), solange das Modal offen ist.
  // Escape schließt hier exklusiv.
  useEffect(() => {
    if (!open) return;
    const blocker = (event: KeyboardEvent) => {
      // Fokus-Navigation und Browser-/OS-Shortcuts unangetastet lassen.
      if (event.key === 'Tab' || event.metaKey || event.ctrlKey || event.altKey) return;
      event.stopImmediatePropagation();
      event.preventDefault();
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', blocker, true);
    return () => window.removeEventListener('keydown', blocker, true);
  }, [open, onClose]);

  const handleExport = useCallback(async () => {
    try {
      const json = await exportBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `hanzi-arcade-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setImporting(true);
      setResult(null);

      try {
        const text = await file.text();
        const res = await importBackup(text);
        setResult(res);
        if (res.success) {
          await useProgressStore.getState().hydrate();
        }
      } catch (err) {
        setResult({
          success: false,
          cardsCount: 0,
          statsCount: 0,
          message: err instanceof Error ? err.message : 'Fehler beim Lesen der Datei',
        });
      } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [],
  );

  if (!open) return null;

  const cardsCount = Object.keys(cards).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg rounded-[2.5rem] border border-zinc-200/80 bg-white p-7 shadow-2xl transition-all sm:p-9 dark:border-white/[0.08] dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
              <HardDrive className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 id="backup-modal-title" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Backup & Wiederherstellung
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Lokaler Offline-Speicher (IndexedDB)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Current status summary */}
        <div className="mt-6 rounded-2xl border border-zinc-200/60 bg-zinc-50/80 p-4 dark:border-white/[0.04] dark:bg-zinc-950/50">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500">
            Aktueller lokaler Stand
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-600 dark:text-zinc-300">
            <span>
              <strong className="text-zinc-900 dark:text-zinc-100">{cardsCount}</strong> Karten im SRS
            </span>
            <span>·</span>
            <span>
              <strong className="text-zinc-900 dark:text-zinc-100">{streak.current}</strong> Tage Streak
            </span>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Export button */}
          <button
            type="button"
            onClick={handleExport}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-600/40 hover:bg-emerald-500/[0.02] active:translate-y-0 dark:border-white/[0.06] dark:bg-zinc-950/40 dark:hover:border-emerald-400/30"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:bg-emerald-500 dark:group-hover:text-zinc-950">
              <Download className="h-5 w-5" />
            </span>
            <div>
              <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Backup exportieren
              </span>
              <span className="block text-xs text-zinc-400 dark:text-zinc-500">
                Als JSON speichern
              </span>
            </div>
          </button>

          {/* Import button */}
          <button
            type="button"
            disabled={importing}
            onClick={() => fileInputRef.current?.click()}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-600/40 hover:bg-emerald-500/[0.02] active:translate-y-0 disabled:opacity-50 dark:border-white/[0.06] dark:bg-zinc-950/40 dark:hover:border-emerald-400/30"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-200 dark:group-hover:bg-emerald-500 dark:group-hover:text-zinc-950">
              <Upload className="h-5 w-5" />
            </span>
            <div>
              <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {importing ? 'Importiere…' : 'Backup einspielen'}
              </span>
              <span className="block text-xs text-zinc-400 dark:text-zinc-500">
                JSON-Datei wählen
              </span>
            </div>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Feedback Message */}
        {result && (
          <div
            className={`mt-5 flex items-start gap-3 rounded-2xl p-4 text-xs ${
              result.success
                ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                : 'border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400'
            }`}
          >
            {result.success ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <div>
              <p className="font-semibold">
                {result.success ? 'Wiederherstellung erfolgreich!' : 'Fehler beim Import'}
              </p>
              <p className="mt-0.5 opacity-90">
                {result.success
                  ? `${result.cardsCount} SRS-Karten und ${result.statsCount} Sessions eingespielt.`
                  : result.message}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500">
          <span className="flex items-center gap-1">
            <FileJson className="h-3.5 w-3.5" />
            Format: Standard JSON
          </span>
          <span>Escape zum Schließen</span>
        </div>
      </div>
    </div>
  );
}
