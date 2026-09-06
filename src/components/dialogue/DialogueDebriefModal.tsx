import { useEffect } from 'react';
import { ArrowRight, Check, RotateCcw, Sparkles, Star, Trophy } from 'lucide-react';
import type { DialogueScenario } from '../../types/dialogue';
import { fireCelebration } from '../../lib/confetti';

interface DialogueDebriefModalProps {
  scenario: DialogueScenario;
  score: number;
  maxScore: number;
  onRetry: () => void;
  onNext?: () => void;
  onBackToOverview: () => void;
}

export function DialogueDebriefModal({
  scenario,
  score,
  maxScore,
  onRetry,
  onNext,
  onBackToOverview,
}: DialogueDebriefModalProps) {
  const percentage = Math.round((score / Math.max(1, maxScore)) * 100);
  const stars = percentage >= 90 ? 3 : percentage >= 65 ? 2 : 1;

  useEffect(() => {
    fireCelebration();
  }, []);

  const ratingTitle =
    stars === 3
      ? 'Hervorragend gemeistert!'
      : stars === 2
        ? 'Gut gemacht!'
        : 'Szenario abgeschlossen!';

  const ratingDescription =
    stars === 3
      ? 'Du hast dich in dieser Alltagssituation wie ein Muttersprachler verhalten – höflich, präzise und kulturfest.'
      : stars === 2
        ? 'Du hast dein Ziel erreicht und wurdest verstanden. Einige Formulierungen lassen sich noch etwas höflicher oder natürlicher gestalten.'
        : 'Du hast die Situation bewältigt! Probiere es gleich noch einmal, um die optimalen Ausdrucksweisen einzustudieren.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-lg rounded-[2.5rem] border border-zinc-200/80 bg-white p-6 sm:p-8 text-center shadow-2xl dark:border-white/[0.08] dark:bg-zinc-900 animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-whisper">
          <Trophy className="h-8 w-8" />
        </div>

        {/* Stars */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {[1, 2, 3].map((starIndex) => (
            <Star
              key={starIndex}
              className={`h-9 w-9 transition-all duration-300 ${
                starIndex <= stars
                  ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-sm'
                  : 'fill-zinc-200 text-zinc-300 dark:fill-zinc-800 dark:text-zinc-700'
              }`}
            />
          ))}
        </div>

        {/* Rating Title */}
        <h3 className="mt-3 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          {ratingTitle}
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {scenario.title} ({scenario.germanTitle})
        </p>

        {/* Score Pill */}
        <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-600/10 px-4 py-1.5 font-mono text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
          <Sparkles className="h-4 w-4" />
          <span>
            {score} von {maxScore} Punkten ({percentage}%)
          </span>
        </div>

        {/* Evaluation Text */}
        <div className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 text-xs text-zinc-600 dark:border-white/[0.04] dark:bg-zinc-950/40 dark:text-zinc-300">
          {ratingDescription}
        </div>

        {/* Objectives Accomplished */}
        <div className="mt-4 space-y-1.5 text-left text-xs">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Abgeschlossene Lernziele
          </p>
          {scenario.objectives.map((obj, i) => (
            <div key={i} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{obj}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-zinc-100 pt-4 dark:border-white/[0.06]">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Noch einmal</span>
          </button>

          <button
            type="button"
            onClick={onBackToOverview}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Zur Übersicht
          </button>

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-whisper hover:bg-emerald-500 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Nächstes Szenario</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
