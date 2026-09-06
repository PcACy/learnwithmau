import { Volume2 } from 'lucide-react';
import type { DialogueChoice } from '../../types/dialogue';

interface DialogueChoicePanelProps {
  choices: DialogueChoice[];
  onSelectChoice: (choice: DialogueChoice) => void;
  onPreviewAudio?: (audioUrl: string) => void;
  showPinyin: boolean;
  showGerman: boolean;
  disabled?: boolean;
}

export function DialogueChoicePanel({
  choices,
  onSelectChoice,
  onPreviewAudio,
  showPinyin,
  showGerman,
  disabled = false,
}: DialogueChoicePanelProps) {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Wähle deine Antwort (Taste 1–{choices.length})
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {choices.map((choice, index) => {
          const hotkeyNumber = index + 1;
          return (
            <div
              key={choice.id}
              className={`group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-4 text-left shadow-whisper transition-all duration-200 hover:border-emerald-500/60 hover:bg-emerald-500/[0.04] dark:border-white/[0.08] dark:bg-zinc-900 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/[0.06] ${
                disabled ? 'opacity-60 pointer-events-none' : 'cursor-pointer active:scale-[0.98]'
              }`}
              onClick={() => onSelectChoice(choice)}
            >
              <div>
                {/* Hotkey Tag & Audio Preview */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 font-mono text-xs font-bold text-zinc-700 shadow-xs group-hover:border-emerald-500/40 group-hover:bg-emerald-500/15 group-hover:text-emerald-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:text-emerald-300">
                    {hotkeyNumber}
                  </span>

                  {onPreviewAudio && choice.audioUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewAudio(choice.audioUrl);
                      }}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-emerald-600 dark:hover:bg-zinc-800 dark:hover:text-emerald-400 transition-colors"
                      title="Vorab anhören"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Pinyin */}
                {showPinyin && (
                  <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                    {choice.pinyin}
                  </p>
                )}

                {/* Hanzi */}
                <h4 className="font-cjk text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  {choice.hanzi}
                </h4>
              </div>

              {/* Deutsche Übersetzung */}
              {showGerman && choice.german && (
                <p className="mt-3 border-t border-zinc-100 pt-2 text-xs text-zinc-500 dark:border-white/[0.04] dark:text-zinc-400">
                  {choice.german}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
