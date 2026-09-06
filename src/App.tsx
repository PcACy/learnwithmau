import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { MODES, type ModeConfig } from './config/modes';
import {
  AlchemyPage,
  BlitzPage,
  CulturePage,
  DashboardPage,
  DialoguePage,
  DictionaryPage,
  EarTrainerPage,
  GrammarPage,
  MistakesPage,
  MockExamPage,
  NumberDrillPage,
  PinyinPage,
  ReviewPage,
  SentenceBuilderPage,
  SettingsPage,
  StatsPage,
  StoriesPage,
  StrokeGuidePage,
  TypeRacerPage,
} from './routes/lazyRoutes';

function renderMode(mode: ModeConfig) {
  switch (mode.id) {
    case 'dialogue':
      return <DialoguePage />;
    case 'ear-trainer':
      return <EarTrainerPage />;
    case 'typeracer':
      return <TypeRacerPage />;
    case 'alchemy':
      return <AlchemyPage />;
    case 'sentences':
      return <SentenceBuilderPage />;
    case 'number-drill':
      return <NumberDrillPage />;
    case 'review':
      return <ReviewPage />;
    case 'exam':
      return <MockExamPage />;
  }
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dictionary" element={<DictionaryPage />} />
        <Route path="/pinyin" element={<PinyinPage />} />
        <Route path="/strokes" element={<StrokeGuidePage />} />
        <Route path="/grammar" element={<GrammarPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/culture" element={<CulturePage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/blitz" element={<BlitzPage />} />
        <Route path="/mistakes" element={<MistakesPage />} />
        {MODES.map((mode) => (
          <Route key={mode.id} path={mode.path} element={renderMode(mode)} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
