import type { Tone } from '../types/vocab';
import { useSettingsStore } from '../store/settingsStore';

/**
 * Lokale Web-Audio-Engine. Ohne vorhandene Audio-Assets synthetisiert sie
 * die Tonkonturen (1–5) als unterscheidbare Tonhöhenverläufe.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

const BASE_FREQ = 233;
const NEUTRAL_MS = 280;
const SYLLABLE_MS = 520;
const GAP_MS = 260;

/** Relativfaktoren um BASE_FREQ; Index = Position im Verlauf. */
const CONTOURS: Record<Tone, number[]> = {
  1: [1.34, 1.36, 1.34],
  2: [0.94, 1.14, 1.32],
  3: [0.84, 0.6, 0.78, 1.04],
  4: [1.36, 1.1, 0.68],
  5: [1.0],
};

export function primeAudio(): void {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.5;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2200;
    master.connect(filter);
    filter.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') {
    void ctx.resume();
  }
}

function toneDurationMs(tone: Tone): number {
  return tone === 5 ? NEUTRAL_MS : SYLLABLE_MS;
}

function scheduleTone(tones: Tone[], startOffsetSec: number): number {
  if (!ctx || !master) return 0;
  let cursor = ctx.currentTime + startOffsetSec;

  for (const tone of tones) {
    const durationMs = toneDurationMs(tone);
    const durSec = durationMs / 1000;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';

    const contour = CONTOURS[tone];
    const steps = Math.max(2, Math.round(durationMs / 20));
    const curve = new Float32Array(steps);
    for (let i = 0; i < steps; i++) {
      const pos01 = i / (steps - 1);
      const scaled = pos01 * (contour.length - 1);
      const lower = Math.floor(scaled);
      const upper = Math.min(contour.length - 1, lower + 1);
      const frac = scaled - lower;
      const factor = contour[lower] + (contour[upper] - contour[lower]) * frac;
      curve[i] = BASE_FREQ * factor;
    }
    osc.frequency.setValueCurveAtTime(curve, cursor, durSec);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, cursor);
    gain.gain.exponentialRampToValueAtTime(0.6, cursor + 0.025);
    gain.gain.setValueAtTime(0.6, cursor + durSec - 0.09);
    gain.gain.exponentialRampToValueAtTime(0.0001, cursor + durSec);

    osc.connect(gain);
    gain.connect(master);
    osc.start(cursor);
    osc.stop(cursor + durSec + 0.02);

    cursor += durSec + GAP_MS / 1000;
  }

  return (cursor - ctx.currentTime) * 1000 - GAP_MS;
}

/**
 * Spielt eine Silben-Tonsequenz und liefert die Gesamtdauer in ms
 * (für Pulse-/Lock-States in der UI).
 */
export function playToneSequence(tones: Tone[]): number {
  primeAudio();
  if (!ctx) return 0;
  return scheduleTone(tones, 0.03);
}

/** URL einer isolierten Silben-Aufnahme aus `public/audio/syllables/`. */
export function syllableAssetUrl(plain: string, tone: Tone): string {
  return `/audio/syllables/${plain}${tone}.mp3`;
}

let currentAudio: HTMLAudioElement | null = null;
let currentOnEnded: (() => void) | null = null;

/**
 * Stoppt die aktuell laufende Audio-Wiedergabe sofort und setzt das Audio-Element zurück.
 */
export function stopCurrentAudio(): void {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = '';
    } catch {
      // ignore
    }
    currentAudio = null;
  }
  if (currentOnEnded) {
    const cb = currentOnEnded;
    currentOnEnded = null;
    cb();
  }
}

/**
 * Versucht, eine MP3-Asset-Datei abzuspielen.
 * Stoppt vorherige Wiedergaben sofort und fängt unterbrochene play()-Aufrufe ab.
 */
export function playAsset(url: string, onEnded?: () => void, rate?: number): Promise<boolean> {
  stopCurrentAudio();

  return new Promise((resolve) => {
    let settled = false;
    const audio = new Audio();
    currentAudio = audio;
    audio.src = url;
    const speed = rate ?? useSettingsStore.getState().audioSpeed ?? 1.0;
    audio.playbackRate = speed;

    const finish = (started: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      if (currentAudio === audio && !started) {
        currentAudio = null;
        currentOnEnded = null;
      }
      resolve(started);
    };

    currentOnEnded = () => {
      onEnded?.();
      finish(false);
    };

    audio.addEventListener(
      'playing',
      () => {
        window.clearTimeout(timeoutId);
        finish(true);
      },
      { once: true },
    );
    audio.addEventListener('error', () => finish(false), { once: true });
    audio.addEventListener(
      'ended',
      () => {
        if (currentAudio === audio) {
          currentAudio = null;
          currentOnEnded = null;
        }
        onEnded?.();
        finish(true);
      },
      { once: true },
    );

    const timeoutId = window.setTimeout(() => finish(false), 4000);

    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Started successfully
          })
          .catch(() => {
            window.clearTimeout(timeoutId);
            finish(false);
          });
      }
    } catch {
      window.clearTimeout(timeoutId);
      finish(false);
    }
  });
}

