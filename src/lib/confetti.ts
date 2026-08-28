import confetti from 'canvas-confetti';

/**
 * Löst einen dezenten, edlen Konfetti-Regen aus (in Emerald- und Gold-Tönen).
 */
export function fireCelebration(): void {
  if (typeof window === 'undefined') return;

  try {
    // Schuss 1: Zentraler Fächer
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#ffffff'],
      disableForReducedMotion: true,
    });

    // Schuss 2: Leicht verzögerte Seitenschüsse
    window.setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.75 },
        colors: ['#10b981', '#34d399', '#f59e0b'],
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.75 },
        colors: ['#10b981', '#34d399', '#f59e0b'],
        disableForReducedMotion: true,
      });
    }, 200);
  } catch {
    // Ignore in unsupported environments
  }
}

/**
 * Kleiner Mikro-Funkenflug bei einzelnen richtigen Antworten oder Alchemie-Fusionen.
 */
export function fireMicroBurst(x = 0.5, y = 0.5): void {
  if (typeof window === 'undefined') return;

  try {
    confetti({
      particleCount: 20,
      spread: 45,
      startVelocity: 25,
      origin: { x, y },
      colors: ['#10b981', '#34d399', '#ffffff'],
      disableForReducedMotion: true,
    });
  } catch {
    // Ignore
  }
}
