import { ArrowRight, CheckCircle2, MapPin, Play, Star, UserCheck, Users, X } from 'lucide-react';
import type { DialogueScenario } from '../../types/dialogue';
import { SealBadge } from '../ui/SealBadge';

interface DialogueBriefingModalProps {
  scenario: DialogueScenario;
  previousStars?: number;
  onStart: () => void;
  onClose: () => void;
}

export function DialogueBriefingModal({
  scenario,
  previousStars = 0,
  onStart,
  onClose,
}: DialogueBriefingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-xl rounded-[2rem] border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-2xl dark:border-white/[0.08] dark:bg-zinc-900 animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <SealBadge sealChar={scenario.hanziTag} label={scenario.category} variant="cinnabar" size="md" />
            {previousStars > 0 && (
              <div className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                <span>{previousStars} / 3 Sterne</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Title */}
        <div className="mt-4">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Szenario #{scenario.order} · {scenario.pinyinTitle}
          </p>
          <h2 className="mt-1 flex items-baseline gap-3 text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            <span className="font-cjk">{scenario.title}</span>
            <span className="text-lg sm:text-xl font-normal text-zinc-500 dark:text-zinc-400">
              {scenario.germanTitle}
            </span>
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {scenario.summary}
          </p>
        </div>

        {/* Setting & Rollen-Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 text-xs dark:border-white/[0.04] dark:bg-zinc-950/40">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-zinc-400">Deine Rolle</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{scenario.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-zinc-400">Partner</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{scenario.partner}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-zinc-400">Ort</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{scenario.location}</span>
            </div>
          </div>
        </div>

        {/* Missionsziele */}
        <div className="mt-5 space-y-2">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Missionsziele & Redewendungen
          </h4>
          <ul className="space-y-1.5">
            {scenario.objectives.map((obj, i) => (
              <li key={i} className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Zurück
          </button>
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-whisper hover:bg-emerald-500 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Gespräch beginnen</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
