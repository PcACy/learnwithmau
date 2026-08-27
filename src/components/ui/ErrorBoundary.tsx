import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error in application component tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = async () => {
    try {
      if ('indexedDB' in window) {
        indexedDB.deleteDatabase('hanzi-arcade');
      }
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-zinc-50 p-6 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
          <div className="w-full max-w-md rounded-[2.5rem] border border-zinc-200/80 bg-white p-8 text-center shadow-whisper sm:p-10 dark:border-white/[0.08] dark:bg-zinc-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-7 w-7" aria-hidden />
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight">Etwas ist schiefgelaufen</h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Die Anwendung ist auf einen unerwarteten Zustand gestoßen. Deine Offline-Daten sind im lokalen Speicher geschützt.
            </p>

            {this.state.error && (
              <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left font-mono text-xs text-zinc-600 dark:border-white/[0.06] dark:bg-zinc-950 dark:text-zinc-400">
                <p className="truncate font-semibold">{this.state.error.name}: {this.state.error.message}</p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white transition-all hover:bg-emerald-500 active:scale-98"
              >
                <RefreshCw className="h-4 w-4" />
                Seite neu laden
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-white/[0.08] dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Lokale Daten zurücksetzen
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
