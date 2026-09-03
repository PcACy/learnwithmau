import { beforeEach, describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import { useProgressStore } from './store/progressStore';

(globalThis as Record<string, unknown>).indexedDB ??= {
  open: () => ({ addEventListener() {}, removeEventListener() {} }),
  deleteDatabase: () => ({}),
};

beforeEach(() => {
  useProgressStore.setState({
    hydrated: true,
    cards: {},
    streak: { current: 0, longest: 0, lastActiveDate: null },
    dailyGoal: {
      date: '2026-01-01',
      targetReviews: 20,
      completedReviews: 0,
    },
  });
});

/** Marker pro Route – schlägt fehl, sobald eine Seite beim Öffnen crasht. */
const ROUTES: readonly [path: string, marker: string][] = [
  ['/', 'Trainings-Zentrale'],
  ['/ear-trainer', 'Pinyin Ear-Trainer'],
  ['/typeracer', 'TYPERACER'],
  ['/alchemy', 'ALCHEMIE'],
  ['/number-drill', 'Session starten'],
  ['/review', 'Fälligkeits-Drill'],
  ['/dictionary', 'Suchen'],
  ['/settings', 'Tagesziel'],
];

describe('Alle Routen rendern ohne Crash', () => {
  it.each(ROUTES)('öffnet %s', (path, marker) => {
    const html = renderToString(
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(html.length).toBeGreaterThan(200);
    expect(html).toContain(marker);
  });

  it('rendert bei unbekannten Pfaden die Shell ohne Modus-Inhalt (Redirect erfolgt clientseitig)', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/gibts-nicht']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(html).toContain('Hanzi Arcade');
    expect(html).not.toContain('Runde starten');
    expect(html).not.toContain('Session starten');
  });
});
