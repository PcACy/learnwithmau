import { useNavigate } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { useKeyDown } from '../../hooks/useKeyDown';
import { KineticButton } from '../ui/KineticButton';
import { SealBadge } from '../ui/SealBadge';

interface SessionSummaryProps {
  headline: string;
  stats: { label: string; value: string }[];
  onRestart(): void;
  restartLabel?: string;
}

export function SessionSummary({
  headline,
  stats,
  onRestart,
  restartLabel = 'Nochmal üben',
}: SessionSummaryProps) {
  const navigate = useNavigate();

  useKeyDown((event) => {
    if (event.key === 'Enter') onRestart();
  });

  return (
    <div className="reveal mx-auto max-w-2xl py-8">
      <div className="double-bezel-casing shadow-whisper">
        <div className="double-bezel-core p-8 sm:p-12 space-y-8 relative">
          {/* Authentic Calligraphy Watermark */}
          <span className="watermark-glyph">
            胜
          </span>

          {/* Header */}
          <div className="space-y-2 relative">
            <div className="flex items-center gap-2.5">
              <SealBadge sealChar="胜" label="SESSION VOLLENDET" variant="cinnabar" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Erfolgreich gemeistert
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
              {headline}
            </h2>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Deine Trainingsdaten wurden ausgewertet und nahtlos in dein persönliches SRS-Gedächtnisprofil integriert.
            </p>
          </div>

          {/* Stat Cards in Xuan-Paper & Ink-Stone Styling */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4.5 text-center shadow-xs dark:border-white/[0.06] dark:bg-zinc-950/40"
              >
                <dt className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </dt>
                <dd className="mt-2 font-mono text-3xl font-black tabular-nums text-zinc-900 dark:text-zinc-100">
                  {stat.value}
                </dd>
              </div>
            ))}
          </div>

          {/* Kinetic Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-100 dark:border-white/[0.05] relative">
            <KineticButton
              variant="primary"
              onClick={onRestart}
              shortcut="[Enter]"
              icon={<RotateCcw className="h-4 w-4" />}
            >
              {restartLabel}
            </KineticButton>

            <KineticButton
              variant="secondary"
              onClick={() => navigate('/')}
              shortcut="[Esc]"
            >
              Zur Trainings-Zentrale
            </KineticButton>
          </div>
        </div>
      </div>
    </div>
  );
}
