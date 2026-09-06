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

export const ALL_ROUTE_COMPONENTS: readonly PreloadableComponent[] = [
  DashboardPage,
  DictionaryPage,
  PinyinPage,
  StrokeGuidePage,
  GrammarPage,
  StoriesPage,
  CulturePage,
  StatsPage,
  SettingsPage,
  BlitzPage,
  MistakesPage,
  DialoguePage,
  EarTrainerPage,
  TypeRacerPage,
  AlchemyPage,
  SentenceBuilderPage,
  NumberDrillPage,
  ReviewPage,
  MockExamPage,
];

export async function preloadAllRoutes(): Promise<void> {
  await Promise.all(ALL_ROUTE_COMPONENTS.map((c) => c.preload()));
}
