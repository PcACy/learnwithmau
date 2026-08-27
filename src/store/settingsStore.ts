import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'system' | 'light' | 'dark';
export type AudioSpeed = 0.75 | 1.0 | 1.25;

interface SettingsState {
  theme: Theme;
  audioSpeed: AudioSpeed;
  setTheme(theme: Theme): void;
  setAudioSpeed(speed: AudioSpeed): void;
  /** Blättert system → hell → dunkel → system (für den Header-Knopf). */
  cycleTheme(): void;
}

const CYCLE: readonly Theme[] = ['system', 'light', 'dark'];

function systemPrefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function isDark(theme: Theme): boolean {
  return theme === 'dark' || (theme === 'system' && systemPrefersDark());
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  const dark = isDark(theme);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.backgroundColor = dark ? '#09090b' : '#fafafa';
  if (document.body) {
    document.body.style.backgroundColor = dark ? '#09090b' : '#fafafa';
  }
}

function nextTheme(theme: Theme): Theme {
  return CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length];
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      audioSpeed: 1.0,
      setTheme(theme) {
        applyTheme(theme);
        set({ theme });
      },
      setAudioSpeed(audioSpeed) {
        set({ audioSpeed });
      },
      cycleTheme() {
        get().setTheme(nextTheme(get().theme));
      },
    }),
    {
      name: 'hanzi-arcade-settings',
      partialize: (state) => ({ theme: state.theme, audioSpeed: state.audioSpeed }),
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);

// Folgt Live-Änderungen der Systemeinstellung, solange „System“ aktiv ist.
if (typeof window !== 'undefined') {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (useSettingsStore.getState().theme === 'system') {
        applyTheme('system');
      }
    });
}
