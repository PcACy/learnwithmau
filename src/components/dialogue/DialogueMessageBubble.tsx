import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Sparkles, Volume2 } from 'lucide-react';
import type { DialogueWordToken } from '../../types/dialogue';

interface DialogueMessageBubbleProps {
  id: string;
  speaker: 'npc' | 'user';
  speakerName: string;
  speakerAvatar: string;
  hanzi: string;
  pinyin: string;
  german: string;
  tokens: DialogueWordToken[];
  cultureTip?: string;
  audioUrl?: string;
  showPinyin: boolean;
  showGerman: boolean;
  isPlaying?: boolean;
  pointsAwarded?: number;
  feedbackGerman?: string;
  onPlayAudio?: () => void;
  onTokenClick: (token: DialogueWordToken) => void;
}

export function DialogueMessageBubble({
  speaker,
  speakerName,
  speakerAvatar,
  hanzi,
  pinyin,
  german,
  tokens,
  cultureTip,
  showPinyin,
  showGerman,
  isPlaying = false,
  pointsAwarded,
  feedbackGerman,
  onPlayAudio,
  onTokenClick,
}: DialogueMessageBubbleProps) {
  const isNpc = speaker === 'npc';
  const [tipOpen, setTipOpen] = useState(false);

  return (
    <div
      className={`group flex w-full gap-3 sm:gap-4 animate-pop-in ${
        isNpc ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* NPC Avatar Siegel */}
      {isNpc && (
        <div className="flex flex-col items-center shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 font-cjk text-lg font-bold text-rose-700 shadow-whisper dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-300">
            {speakerAvatar}
          </div>
          <span className="mt-1 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
            {speakerName}
          </span>
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`relative flex max-w-[85%] sm:max-w-[75%] flex-col rounded-3xl p-4 sm:p-5 shadow-whisper transition-all duration-200 ${
          isNpc
            ? 'border border-zinc-200/80 bg-white text-zinc-900 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-100 rounded-tl-sm'
            : 'border border-emerald-600/30 bg-emerald-600/10 text-zinc-900 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-zinc-100 rounded-tr-sm'
        }`}
      >
        {/* Header mit Audio & Punkten */}
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isNpc && (
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Deine Antwort
              </span>
            )}
            {typeof pointsAwarded === 'number' && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-extrabold ${
                  pointsAwarded >= 90
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : pointsAwarded >= 60
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                      : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                }`}
              >
                <Sparkles className="h-2.5 w-2.5" />+{pointsAwarded} Pkt
              </span>
            )}
          </div>

          {onPlayAudio && (
            <button
              type="button"
              onClick={onPlayAudio}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-emerald-500/20 hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-emerald-300'
              }`}
              title="Aussprache anhören"
              aria-label="Aussprache abspielen"
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* CJK Text mit klickbaren Wort-Tokens */}
        <div className="flex flex-wrap items-baseline gap-x-1 gap-y-2">
          {tokens && tokens.length > 0 ? (
            tokens.map((token, idx) => (
              <button
                key={`${token.hanzi}-${idx}`}
                type="button"
                onClick={() => onTokenClick(token)}
                className="group/tok relative inline-flex flex-col items-center rounded-lg px-1.5 py-0.5 text-left transition-all hover:bg-emerald-500/15 cursor-pointer"
                title={`${token.pinyin}: ${token.german}`}
              >
                {showPinyin && (
                  <span className="font-mono text-[11px] font-medium text-emerald-700 dark:text-emerald-400 group-hover/tok:font-bold">
                    {token.pinyin}
                  </span>
                )}
                <span className="font-cjk text-xl sm:text-2xl font-bold tracking-wide text-zinc-900 dark:text-zinc-100">
                  {token.hanzi}
                </span>
              </button>
            ))
          ) : (
            <div className="flex flex-col">
              {showPinyin && (
                <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-0.5">
                  {pinyin}
                </span>
              )}
              <span className="font-cjk text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {hanzi}
              </span>
            </div>
          )}
        </div>

        {/* Deutsche Übersetzung */}
        {showGerman && german && (
          <div className="mt-3 border-t border-zinc-200/50 pt-2 text-xs font-medium text-zinc-600 dark:border-white/[0.06] dark:text-zinc-400">
            {german}
          </div>
        )}

        {/* Didaktisches Feedback zur gewählten Antwort */}
        {feedbackGerman && (
          <div className="mt-2.5 rounded-xl border border-zinc-200/60 bg-zinc-50/80 p-2.5 text-xs text-zinc-700 dark:border-white/[0.04] dark:bg-zinc-950/50 dark:text-zinc-300">
            <span className="font-bold text-emerald-700 dark:text-emerald-400">Didaktik: </span>
            {feedbackGerman}
          </div>
        )}

        {/* Didaktischer Kultur- / Grammatik-Tipp (Aufklappbar) */}
        {cultureTip && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-500/[0.07] text-xs dark:border-amber-400/20 dark:bg-amber-500/[0.08]">
            <button
              type="button"
              onClick={() => setTipOpen(!tipOpen)}
              className="flex w-full items-center justify-between px-3 py-2 text-left font-bold text-amber-800 dark:text-amber-300 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Kultur- & Grammatik-Tipp
              </span>
              {tipOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
            {tipOpen && (
              <div className="border-t border-amber-500/20 px-3 py-2 text-zinc-700 dark:text-zinc-300">
                {cultureTip}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Avatar Siegel */}
      {!isNpc && (
        <div className="flex flex-col items-center shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-600/30 bg-emerald-600/10 font-cjk text-lg font-bold text-emerald-700 shadow-whisper dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
            {speakerAvatar}
          </div>
          <span className="mt-1 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
            {speakerName}
          </span>
        </div>
      )}
    </div>
  );
}
