import { lazyRoute, type PreloadableComponent } from '../lib/lazyRoute';

export const DashboardPage = lazyRoute(() => import('./DashboardPage'), 'DashboardPage');
export const DictionaryPage = lazyRoute(() => import('./DictionaryPage'), 'DictionaryPage');
export const PinyinPage = lazyRoute(() => import('./PinyinPage'), 'PinyinPage');
export const StrokeGuidePage = lazyRoute(() => import('./StrokeGuidePage'), 'StrokeGuidePage');
export const GrammarPage = lazyRoute(() => import('./GrammarPage'), 'GrammarPage');
export const StoriesPage = lazyRoute(() => import('./StoriesPage'), 'StoriesPage');
export const CulturePage = lazyRoute(() => import('./CulturePage'), 'CulturePage');
export const StatsPage = lazyRoute(() => import('./StatsPage'), 'StatsPage');
export const SettingsPage = lazyRoute(() => import('./SettingsPage'), 'SettingsPage');
export const BlitzPage = lazyRoute(() => import('./BlitzPage'), 'BlitzPage');
export const MistakesPage = lazyRoute(() => import('./MistakesPage'), 'MistakesPage');
export const DialoguePage = lazyRoute(() => import('./DialoguePage'), 'DialoguePage');
export const EarTrainerPage = lazyRoute(() => import('./EarTrainerPage'), 'EarTrainerPage');
export const TypeRacerPage = lazyRoute(() => import('./TypeRacerPage'), 'TypeRacerPage');
export const AlchemyPage = lazyRoute(() => import('./AlchemyPage'), 'AlchemyPage');
export const SentenceBuilderPage = lazyRoute(() => import('./SentenceBuilderPage'), 'SentenceBuilderPage');
export const NumberDrillPage = lazyRoute(() => import('./NumberDrillPage'), 'NumberDrillPage');
export const ReviewPage = lazyRoute(() => import('./ReviewPage'), 'ReviewPage');
export const MockExamPage = lazyRoute(() => import('./MockExamPage'), 'MockExamPage');

export const PRIMARY_ROUTES: readonly PreloadableComponent[] = [
  DictionaryPage,
  GrammarPage,
  StoriesPage,
  DialoguePage,
  ReviewPage,
  StatsPage,
];

export const SECONDARY_ROUTES: readonly PreloadableComponent[] = [
  MockExamPage,
  MistakesPage,
  BlitzPage,
  PinyinPage,
  StrokeGuidePage,
  CulturePage,
  SettingsPage,
  EarTrainerPage,
  TypeRacerPage,
  AlchemyPage,
  SentenceBuilderPage,
  NumberDrillPage,
];

export const ALL_ROUTE_COMPONENTS: readonly PreloadableComponent[] = [
  DashboardPage,
  ...PRIMARY_ROUTES,
  ...SECONDARY_ROUTES,
];

export const ROUTE_PRELOAD_MAP: Record<string, () => Promise<unknown>> = {
  '/': () => DashboardPage.preload(),
  '/dictionary': () => DictionaryPage.preload(),
  '/grammar': () => GrammarPage.preload(),
  '/stories': () => StoriesPage.preload(),
  '/dialogue': () => DialoguePage.preload(),
  '/exam': () => MockExamPage.preload(),
  '/stats': () => StatsPage.preload(),
  '/settings': () => SettingsPage.preload(),
  '/review': () => ReviewPage.preload(),
  '/mistakes': () => MistakesPage.preload(),
  '/blitz': () => BlitzPage.preload(),
  '/pinyin': () => PinyinPage.preload(),
  '/stroke-guide': () => StrokeGuidePage.preload(),
  '/culture': () => CulturePage.preload(),
  '/ear-trainer': () => EarTrainerPage.preload(),
  '/typeracer': () => TypeRacerPage.preload(),
  '/alchemy': () => AlchemyPage.preload(),
  '/sentences': () => SentenceBuilderPage.preload(),
  '/number-drill': () => NumberDrillPage.preload(),
};

/**
 * Lädt Chunks gestaffelt nach Priorität im Hintergrund, um Bandbreite & JIT-Compiler
 * nicht auf einen Schlag mit 19 Modulen zu überlasten.
 */
export async function preloadAllRoutes(): Promise<void> {
  // In Test/SSR: Alle Routen sofort laden für synchrones Rendering
  if (typeof window === 'undefined') {
    await Promise.all(ALL_ROUTE_COMPONENTS.map((c) => c.preload()));
    return;
  }

  // 1. Primäre Navigationsrouten sofort vorab laden
  await Promise.all(PRIMARY_ROUTES.map((c) => c.preload()));

  // 2. Sekundäre Übungsmodi im nächsten freien Leerlaufzyklus nachladen
  const loadSecondary = () => {
    void Promise.all(SECONDARY_ROUTES.map((c) => c.preload()));
  };
  const win = window as Window & { requestIdleCallback?: (cb: () => void) => void };
  if (typeof win.requestIdleCallback === 'function') {
    win.requestIdleCallback(loadSecondary);
  } else {
    window.setTimeout(loadSecondary, 400);
  }
}
