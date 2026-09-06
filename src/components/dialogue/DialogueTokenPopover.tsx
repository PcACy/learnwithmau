import { useCallback } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Check, ExternalLink, Sparkles, Volume2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DialogueWordToken } from '../../types/dialogue';
import { VOCAB } from '../../data';
import { useProgressStore } from '../../store/progressStore';
import { playAsset, playToneSequence, stopCurrentAudio } from '../../lib/audio';
import { fireMicroBurst } from '../../lib/confetti';
import { PitchContour } from '../ui/PitchContour';

interface DialogueTokenPopoverProps {
  token: DialogueWordToken | null;
  onClose: () => void;
}

export function DialogueTokenPopover({ token, onClose }: DialogueTokenPopoverProps) {
  const navigate = useNavigate();
  const cards = useProgressStore((s) => s.cards);
  const review = useProgressStore((s) => s.review);

  const playTokenAudio = useCallback((t: DialogueWordToken) => {
    stopCurrentAudio();
    const vocab = VOCAB.find((v) => v.hanzi === t.hanzi);
    if (vocab?.audioPath) {
      void playAsset(vocab.audioPath);
      return;
    }
    if (vocab) {
      playToneSequence(vocab.syllables.map((s) => s.tone));
    }
  }, []);

  if (!token || typeof document === 'undefined') return null;

  const matchingVocab = VOCAB.find((v) => v.hanzi === token.hanzi);
  const isStudied = matchingVocab ? matchingVocab.id in cards : false;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-end justify-end p-4 sm:p-6 pointer-events-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[1px] pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      <div
        className="relative z-10 max-w-sm w-full rounded-3xl border border-zinc-200/90 bg-white/95 p-6 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/95 animate-pop-in pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Wort-Glossar
              </span>
              {matchingVocab ? (
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  HSK 1
                </span>
              ) : (
                <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-500">
                  Kontext
                </span>
              )}
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="font-cjk text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                {token.hanzi}
              </span>
              <span className="font-mono text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                {token.pinyin}
              </span>
              <button
                type="button"
                onClick={() => playTokenAudio(token)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-300 transition-colors cursor-pointer"
                title="Aussprache anhören"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {matchingVocab && (
          <div className="mt-3 flex items-center gap-3">
            <PitchContour
              tones={matchingVocab.syllables.map((s) => s.tone)}
              syllables={matchingVocab.syllables.map((s) => s.marked)}
              size="sm"
              showLabels
            />
          </div>
        )}

        <div className="mt-3 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 text-xs dark:border-white/[0.04] dark:bg-zinc-950/40">
          <span className="text-zinc-400">Bedeutung: </span>
          <span className="font-bold text-zinc-800 dark:text-zinc-200">{token.german}</span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-100 pt-3 dark:border-white/[0.05]">
          {matchingVocab && (
            <button
              type="button"
              onClick={() => {
                void review(matchingVocab.id, 3);
                fireMicroBurst();
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                isStudied
                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
              }`}
            >
              {isStudied ? <Check className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span>{isStudied ? 'Im SRS aktiv' : 'Im SRS vormerken'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onClose();
              navigate(`/dictionary?q=${encodeURIComponent(token.hanzi)}`);
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 cursor-pointer ml-auto"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Wörterbuch</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
