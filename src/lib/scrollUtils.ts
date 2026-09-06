/**
 * Berechnet rein funktional, ob horizontaler Scrollspielraum vorliegt.
 */
export function computeScrollState(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
  threshold = 2,
): { canScrollLeft: boolean; canScrollRight: boolean; hasOverflow: boolean } {
  const maxScroll = Math.max(0, scrollWidth - clientWidth);
  const hasOverflow = maxScroll > threshold;
  return {
    canScrollLeft: hasOverflow && scrollLeft > threshold,
    canScrollRight: hasOverflow && scrollLeft < maxScroll - threshold,
    hasOverflow,
  };
}
