import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/outfit';
import '@fontsource-variable/jetbrains-mono';
import './index.css';
import App from './App.tsx';
import { useProgressStore } from './store/progressStore.ts';
import { applyTheme, useSettingsStore } from './store/settingsStore.ts';
import { ErrorBoundary } from './components/ui/ErrorBoundary.tsx';
import { registerSW } from 'virtual:pwa-register';

applyTheme(useSettingsStore.getState().theme);

registerSW({ immediate: true });

// Self-Healing bei PWA-Updates: Sobald ein neuer Service Worker die Kontrolle
// übernimmt, einmalig neu laden – sonst läuft ein alter Tab weiter auf dem
// alten Bundle und neuere Routen „öffnen sich nicht“.
let swRefreshing = false;
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  if (swRefreshing) return;
  swRefreshing = true;
  window.location.reload();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

void useProgressStore.getState().hydrate();


