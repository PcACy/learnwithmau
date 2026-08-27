import { Monitor, Moon, Sun } from 'lucide-react';
import { useSettingsStore, type Theme } from '../../store/settingsStore';

const META: Record<Theme, { label: string; Icon: typeof Sun }> = {
  system: { label: 'Design: System – umschalten zu Hell', Icon: Monitor },
  light: { label: 'Design: Hell – umschalten zu Dunkel', Icon: Moon },
  dark: { label: 'Design: Dunkel – umschalten zu System', Icon: Sun },
};

export function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme);
  const cycleTheme = useSettingsStore((s) => s.cycleTheme);
  const { label, Icon } = META[theme];

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={label}
      title={label}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-500 transition-all duration-200 ease-[var(--ease-spring)] hover:border-emerald-600/40 hover:text-emerald-700 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-white/[0.08] dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-emerald-400/40 dark:hover:text-emerald-400"
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden />
    </button>
  );
}
