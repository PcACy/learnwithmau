import React from 'react';

interface PitchContourProps {
  tones: number[];
  syllables?: string[];
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

/**
 * Chao-Tonhöhenskala (1 = tief, 5 = hoch):
 * - Ton 1: 55 (hoch eben)
 * - Ton 2: 35 (steigend)
 * - Ton 3: 214 (fallend-steigend / tief)
 * - Ton 4: 51 (steil fallend)
 * - Ton 5: 3 (neutral / kurz)
 */
const TONE_PATHS: Record<number, { d: string; isDot?: boolean; dotPos?: { cx: number; cy: number } }> = {
  1: { d: 'M 4 8 L 36 8' }, // 5 -> 5
  2: { d: 'M 4 24 Q 20 18 36 8' }, // 3 -> 5
  3: { d: 'M 4 20 Q 18 34 26 34 T 36 12' }, // 2 -> 1 -> 4
  4: { d: 'M 4 8 Q 18 20 36 32' }, // 5 -> 1
  5: { d: '', isDot: true, dotPos: { cx: 20, cy: 20 } }, // 3 (neutral)
};

const TONE_NAMES: Record<number, string> = {
  1: '1. Ton (55 · hoch eben)',
  2: '2. Ton (35 · steigend)',
  3: '3. Ton (214 · fallend-steigend)',
  4: '4. Ton (51 · fallend)',
  5: 'Neutral (3 · leicht & kurz)',
};

export const PitchContour: React.FC<PitchContourProps> = ({
  tones,
  syllables,
  size = 'md',
  showLabels = false,
  className = '',
}) => {
  const height = size === 'sm' ? 24 : size === 'lg' ? 44 : 32;
  const widthPerTone = size === 'sm' ? 28 : size === 'lg' ? 48 : 36;
  const totalWidth = Math.max(widthPerTone * tones.length, 36);

  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <div className="relative flex items-center justify-center rounded-lg border border-zinc-200/80 bg-zinc-50/80 px-1.5 py-1 dark:border-white/10 dark:bg-zinc-950/50">
        <svg
          width={totalWidth}
          height={height}
          viewBox={`0 0 ${40 * tones.length} 40`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Hintergrund-Hilfslinien für die 5 Tonstufen */}
          <line x1="0" y1="8" x2={40 * tones.length} y2="8" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 2" />
          <line x1="0" y1="20" x2={40 * tones.length} y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 2" />
          <line x1="0" y1="32" x2={40 * tones.length} y2="32" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 2" />

          {/* Zeichnung der Tonkurven für jede Silbe */}
          {tones.map((rawTone, i) => {
            const tone = rawTone >= 1 && rawTone <= 5 ? rawTone : 5;
            const config = TONE_PATHS[tone] || TONE_PATHS[5];
            const offsetX = i * 40;

            return (
              <g key={i} transform={`translate(${offsetX}, 0)`}>
                {config.isDot && config.dotPos ? (
                  <circle
                    cx={config.dotPos.cx}
                    cy={config.dotPos.cy}
                    r={size === 'sm' ? 2.5 : 3.5}
                    className="fill-emerald-600 dark:fill-emerald-400"
                  />
                ) : (
                  <path
                    d={config.d}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={size === 'sm' ? 2.5 : 3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {showLabels && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
          {tones.map((t, idx) => (
            <span key={idx}>
              {syllables?.[idx] ? `${syllables[idx]}: ` : ''}
              {TONE_NAMES[t] || `Ton ${t}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
