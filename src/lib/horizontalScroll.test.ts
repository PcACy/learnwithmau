import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { computeScrollState } from './scrollUtils';
import { HorizontalScrollRow } from '../components/ui/HorizontalScrollRow';

describe('HorizontalScrollRow & computeScrollState', () => {
  describe('computeScrollState calculation', () => {
    it('returns false for all scroll directions when content does not overflow', () => {
      const state = computeScrollState(0, 300, 300);
      expect(state.hasOverflow).toBe(false);
      expect(state.canScrollLeft).toBe(false);
      expect(state.canScrollRight).toBe(false);
    });

    it('returns canScrollRight true when at the beginning of an overflowing container', () => {
      const state = computeScrollState(0, 600, 300);
      expect(state.hasOverflow).toBe(true);
      expect(state.canScrollLeft).toBe(false);
      expect(state.canScrollRight).toBe(true);
    });

    it('returns both canScrollLeft and canScrollRight true when in the middle', () => {
      const state = computeScrollState(150, 600, 300);
      expect(state.hasOverflow).toBe(true);
      expect(state.canScrollLeft).toBe(true);
      expect(state.canScrollRight).toBe(true);
    });

    it('returns canScrollLeft true and canScrollRight false when scrolled to the end', () => {
      // maxScroll = 600 - 300 = 300
      const state = computeScrollState(300, 600, 300);
      expect(state.hasOverflow).toBe(true);
      expect(state.canScrollLeft).toBe(true);
      expect(state.canScrollRight).toBe(false);
    });

    it('respects the threshold parameter near edges', () => {
      // scrollLeft = 2 with threshold = 2 -> not enough to trigger canScrollLeft
      const nearLeft = computeScrollState(2, 600, 300, 2);
      expect(nearLeft.canScrollLeft).toBe(false);

      // scrollLeft = 3 with threshold = 2 -> triggers canScrollLeft
      const pastLeft = computeScrollState(3, 600, 300, 2);
      expect(pastLeft.canScrollLeft).toBe(true);

      // maxScroll is 300. scrollLeft = 299 with threshold = 2 -> not enough remaining distance
      const nearRight = computeScrollState(299, 600, 300, 2);
      expect(nearRight.canScrollRight).toBe(false);
    });
  });

  describe('HorizontalScrollRow React Component SSR', () => {
    it('renders children within a scrollable container in server environment', () => {
      const html = renderToString(
        React.createElement(
          HorizontalScrollRow,
          {
            className: 'gap-2',
            ariaLabel: 'Test-Pills',
          },
          React.createElement('button', null, 'Pill 1'),
          React.createElement('button', null, 'Pill 2'),
        ),
      );

      expect(html).toContain('Test-Pills');
      expect(html).toContain('Pill 1');
      expect(html).toContain('Pill 2');
      expect(html).toContain('overflow-x-auto');
      expect(html).toContain('scrollbar-none');
    });

    it('supports different fadeVariants without error', () => {
      const htmlCanvas = renderToString(
        React.createElement(
          HorizontalScrollRow,
          { fadeVariant: 'canvas' },
          React.createElement('span', null, 'Content'),
        ),
      );
      expect(htmlCanvas).toContain('Content');

      const htmlCard = renderToString(
        React.createElement(
          HorizontalScrollRow,
          { fadeVariant: 'card' },
          React.createElement('span', null, 'Content'),
        ),
      );
      expect(htmlCard).toContain('Content');

      const htmlNone = renderToString(
        React.createElement(
          HorizontalScrollRow,
          { fadeVariant: 'none' },
          React.createElement('span', null, 'Content'),
        ),
      );
      expect(htmlNone).toContain('Content');
    });
  });
});
