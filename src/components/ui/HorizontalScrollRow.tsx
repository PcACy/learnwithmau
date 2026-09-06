import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { computeScrollState } from '../../lib/scrollUtils';

export interface HorizontalScrollRowProps {
  children?: React.ReactNode;
  /** Klassen für den inneren horizontal scrollbaren Container */
  className?: string;
  /** Klassen für den äußeren Wrapper */
  containerClassName?: string;
  /** Pixel-Schrittweite pro Pfeilklick (Standard: 240px) */
  scrollAmount?: number;
  /** Konvertiert vertikales Mausrad-Scrollen in horizontales Scrollen (Standard: true) */
  enableWheelScroll?: boolean;
  /** Farbvariante für den weichen Kanten-Fade */
  fadeVariant?: 'canvas' | 'card' | 'none';
  /** Button-Größe für die Navigationspfeile */
  buttonSize?: 'sm' | 'md';
  /** Zugängliche Bezeichnung für den Scrollbereich */
  ariaLabel?: string;
}

export function HorizontalScrollRow({
  children,
  className = '',
  containerClassName = '',
  scrollAmount = 240,
  enableWheelScroll = true,
  fadeVariant = 'canvas',
  buttonSize = 'sm',
  ariaLabel,
}: HorizontalScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { canScrollLeft: nextLeft, canScrollRight: nextRight } = computeScrollState(
      el.scrollLeft,
      el.scrollWidth,
      el.clientWidth,
    );
    setCanScrollLeft(nextLeft);
    setCanScrollRight(nextRight);
  }, []);

  // Event-Listener für Scrollen, Resize und DOM-Änderungen
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();

    el.addEventListener('scroll', updateScrollState, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        updateScrollState();
      });
      ro.observe(el);
      Array.from(el.children).forEach((child) => ro?.observe(child));
    }

    const onResize = () => updateScrollState();
    window.addEventListener('resize', onResize);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [updateScrollState, children]);

  // Mausrad-Unterstützung: Vertikales Rad scrollt horizontal, sofern im Überlauf
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !enableWheelScroll) return;

    const onWheel = (e: WheelEvent) => {
      // Nur abfangen, wenn primär vertikales Scrollrad und Überlauf vorhanden ist
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.scrollWidth > el.clientWidth) {
        const isAtLeft = el.scrollLeft <= 0 && e.deltaY < 0;
        const isAtRight =
          el.scrollLeft >= el.scrollWidth - el.clientWidth - 1 && e.deltaY > 0;

        if (!isAtLeft && !isAtRight) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
          updateScrollState();
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [enableWheelScroll, updateScrollState]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = direction === 'left' ? -scrollAmount : scrollAmount;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Fade-Gradienten basierend auf Canvas/Card
  const leftFadeClass =
    fadeVariant === 'canvas'
      ? 'bg-gradient-to-r from-[#fbfbf9] via-[#fbfbf9]/90 to-transparent dark:from-[#09090b] dark:via-[#09090b]/90'
      : fadeVariant === 'card'
        ? 'bg-gradient-to-r from-white via-white/90 to-transparent dark:from-zinc-900 dark:via-zinc-900/90'
        : '';

  const rightFadeClass =
    fadeVariant === 'canvas'
      ? 'bg-gradient-to-l from-[#fbfbf9] via-[#fbfbf9]/90 to-transparent dark:from-[#09090b] dark:via-[#09090b]/90'
      : fadeVariant === 'card'
        ? 'bg-gradient-to-l from-white via-white/90 to-transparent dark:from-zinc-900 dark:via-zinc-900/90'
        : '';

  const btnDim = buttonSize === 'md' ? 'h-8 w-8' : 'h-7 w-7';
  const iconDim = buttonSize === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';

  return (
    <div className={`relative group/scroll ${containerClassName}`}>
      {/* Linker Navigations-Pfeil & Kanten-Fade */}
      {canScrollLeft && (
        <div
          className={`absolute left-0 top-0 bottom-0 z-20 flex items-center pr-4 pl-0.5 pointer-events-none transition-opacity duration-200 ${leftFadeClass}`}
        >
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Nach links scrollen"
            className={`pointer-events-auto flex ${btnDim} items-center justify-center rounded-full border border-zinc-200/90 bg-white/95 text-zinc-700 shadow-whisper transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-950 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-white/15 dark:bg-zinc-800/95 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-white cursor-pointer`}
          >
            <ChevronLeft className={`${iconDim} stroke-[2.5]`} />
          </button>
        </div>
      )}

      {/* Horizontales Scroll-Element */}
      <div
        ref={scrollRef}
        aria-label={ariaLabel}
        className={`flex overflow-x-auto scrollbar-none scroll-smooth ${className}`}
      >
        {children}
      </div>

      {/* Rechter Navigations-Pfeil & Kanten-Fade */}
      {canScrollRight && (
        <div
          className={`absolute right-0 top-0 bottom-0 z-20 flex items-center pl-4 pr-0.5 pointer-events-none transition-opacity duration-200 ${rightFadeClass}`}
        >
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Nach rechts scrollen"
            className={`pointer-events-auto flex ${btnDim} items-center justify-center rounded-full border border-zinc-200/90 bg-white/95 text-zinc-700 shadow-whisper transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-950 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-white/15 dark:bg-zinc-800/95 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-white cursor-pointer`}
          >
            <ChevronRight className={`${iconDim} stroke-[2.5]`} />
          </button>
        </div>
      )}
    </div>
  );
}
