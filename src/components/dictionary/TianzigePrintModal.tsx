import { useEffect } from 'react';
import { X, Printer, FileText } from 'lucide-react';
import type { VocabItem } from '../../types/vocab';
import { useKeyDown } from '../../hooks/useKeyDown';

interface TianzigePrintModalProps {
  open: boolean;
  onClose: () => void;
  item: VocabItem | null;
}

export function TianzigePrintModal({ open, onClose, item }: TianzigePrintModalProps) {
  useKeyDown((e) => {
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open || !item) return null;

  const characters = item.hanzi.split('');
  const GRID_COLS = 8;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity print:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-900 print:max-h-none print:overflow-visible print:border-none print:p-0 print:shadow-none">
        {/* Controls Bar (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-white/[0.06] print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              田字格 Tianzige Schreibübungsblatt (Druckvorschau)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Drucken / Als PDF speichern</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 text-zinc-500 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
              aria-label="Schließen"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE WORKSHEET CONTENT */}
        <div className="mt-6 space-y-8 print:mt-0 print:space-y-6">
          {/* Header on Sheet */}
          <div className="flex items-end justify-between border-b-2 border-zinc-800 pb-3 print:border-black">
            <div>
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-400 uppercase print:text-zinc-600">
                Hanzi Arcade · HSK-1 Schreibübungsbogen
              </span>
              <h1 className="font-cjk text-2xl font-black text-zinc-900 print:text-black">
                田字格练字表 · Tiánzìgé Schriftzeichentraining
              </h1>
            </div>
            <div className="text-right font-mono text-xs text-zinc-600 print:text-black space-y-1">
              <div>姓名 (Name): ______________________</div>
              <div>日期 (Datum): ______________________</div>
            </div>
          </div>

          {/* Character Sections */}
          {characters.map((char, cIdx) => (
            <div key={cIdx} className="space-y-3">
              {/* Character Meta Header */}
              <div className="flex flex-wrap items-baseline gap-4 rounded-xl bg-zinc-50 p-3.5 border border-zinc-200/70 print:bg-zinc-100 print:border-zinc-300">
                <span className="font-cjk text-3xl font-black text-zinc-900 print:text-black">
                  {char}
                </span>
                <span className="font-mono text-sm font-bold text-emerald-700 print:text-black">
                  {item.syllables[cIdx]?.marked || item.pinyin}
                </span>
                <span className="text-xs text-zinc-600 print:text-zinc-700">
                  Bedeutung: <strong className="text-zinc-900 print:text-black">{item.meaning}</strong>
                </span>
                <span className="font-mono text-xs text-zinc-400 print:text-zinc-600 ml-auto">
                  Gesamtwort: {item.hanzi} ({item.pinyin})
                </span>
              </div>

              {/* Tianzige Grid Lines */}
              <div className="space-y-2">
                {/* Row 1: Model & Tracing (Nachspuren / 描红) */}
                <div className="flex gap-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border-2 border-zinc-900 bg-white font-cjk text-3xl font-bold text-zinc-900 relative print:border-black print:text-black">
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <div className="w-full h-[1px] border-b border-dashed border-zinc-600" />
                      <div className="h-full w-[1px] border-r border-dashed border-zinc-600 absolute" />
                    </span>
                    {char}
                  </div>
                  {/* Tracing Boxes */}
                  {Array.from({ length: GRID_COLS - 1 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-zinc-400 bg-white font-cjk text-3xl font-bold relative print:border-zinc-500"
                    >
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                        <div className="w-full h-[1px] border-b border-dashed border-zinc-400" />
                        <div className="h-full w-[1px] border-r border-dashed border-zinc-400 absolute" />
                      </span>
                      {idx < 3 ? (
                        <span className="text-zinc-300 font-normal select-none print:text-zinc-300">
                          {char}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>

                {/* Row 2: Freehand Writing (Freies Schreiben) */}
                <div className="flex gap-2">
                  {Array.from({ length: GRID_COLS }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-zinc-400 bg-white relative print:border-zinc-500"
                    >
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                        <div className="w-full h-[1px] border-b border-dashed border-zinc-400" />
                        <div className="h-full w-[1px] border-r border-dashed border-zinc-400 absolute" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Footer on Sheet */}
          <div className="border-t border-zinc-200 pt-3 text-center font-mono text-[10px] text-zinc-400 print:border-zinc-400 print:text-zinc-500">
            Learn with Mau · Hanzi Arcade Offline Platform · Tianzige Practice Sheet
          </div>
        </div>
      </div>
    </div>
  );
}
