import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { MODES, type ModeConfig } from './config/modes';
import { AlchemyPage } from './routes/AlchemyPage';
import { BlitzPage } from './routes/BlitzPage';
import { DashboardPage } from './routes/DashboardPage';
import { DictionaryPage } from './routes/DictionaryPage';
import { EarTrainerPage } from './routes/EarTrainerPage';
import { NumberDrillPage } from './routes/NumberDrillPage';
import { ReviewPage } from './routes/ReviewPage';
import { SentenceBuilderPage } from './routes/SentenceBuilderPage';
import { SettingsPage } from './routes/SettingsPage';
import { StatsPage } from './routes/StatsPage';
import { TypeRacerPage } from './routes/TypeRacerPage';
import { MockExamPage } from './routes/MockExamPage';
import { GrammarPage } from './routes/GrammarPage';
import { StoriesPage } from './routes/StoriesPage';

function renderMode(mode: ModeConfig) {
  switch (mode.id) {
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
        <Route path="/grammar" element={<GrammarPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/blitz" element={<BlitzPage />} />
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
