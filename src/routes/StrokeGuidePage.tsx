import { useState } from 'react';
import { Compass, CheckCircle2, Sparkles } from 'lucide-react';
import { SealBadge } from '../components/ui/SealBadge';
import { BASIC_STROKES, STROKE_ORDER_RULES, type BasicStroke, type StrokeOrderRule } from '../data/strokeGuideData';
import radicalsData from '../data/radicals.json';
import type { Radical } from '../types/vocab';

type StrokeTab = 'basic' | 'rules' | 'radicals';

const TOP_RADICALS = (radicalsData as Radical[]).slice(0, 30);

export function StrokeGuidePage() {
  const [activeTab, setActiveTab] = useState<StrokeTab>('basic');
  const [selectedStroke, setSelectedStroke] = useState<BasicStroke>(BASIC_STROKES[0]);
  const [selectedRule, setSelectedRule] = useState<StrokeOrderRule>(STROKE_ORDER_RULES[0]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <SealBadge sealChar="笔" label="SCHRIFTZEICHEN-THEORIE" variant="jade" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Lehrbuch-Fundament · Strichlehre &amp; Radikale
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
          Stricharten- &amp; Radikal-Fibel
        </h1>
        <p className="max-w-3xl text-sm text-zinc-600 dark:text-zinc-300">
          Verstehe die architektonische Logik der chinesischen Schriftzeichen: Von den 8 fundamentalen Grundstrichen
          (永字八法) über die 7 unumstößlichen Schreibregeln bis hin zu den sinntragenden Radikal-Bausteinen.
        </p>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Strichlehre Bereiche"
        className="flex flex-wrap gap-2 border-b border-zinc-200/80 pb-3 dark:border-white/[0.08]"
      >
        {(
          [
            { id: 'basic', label: 'Die 8 Grundstriche', sub: '永字八法 Anatomie' },
            { id: 'rules', label: 'Die 7 Schreibregeln', sub: 'Reihenfolge & Logik' },
            { id: 'radicals', label: 'Wichtige Radikale', sub: 'Sinntragende Bausteine' },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-start rounded-2xl px-4 py-2.5 text-left transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'border border-emerald-600/40 bg-emerald-500/10 text-emerald-900 shadow-sm ring-1 ring-emerald-500/30 dark:border-emerald-400/40 dark:text-emerald-300 dark:bg-emerald-500/15'
                  : 'border border-zinc-200/70 bg-zinc-50 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100/80 dark:border-white/[0.06] dark:bg-zinc-900/40 dark:text-zinc-400 dark:hover:bg-zinc-900/80'
              }`}
            >
              <span className="text-xs font-bold sm:text-sm">{tab.label}</span>
              <span className="text-[10px] font-medium opacity-70">{tab.sub}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 8 GRUNDSTRICHE */}
      {activeTab === 'basic' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Strichauswahl */}
          <div className="space-y-3 lg:col-span-5">
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Grundstriche wählen:
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {BASIC_STROKES.map((stroke) => {
                const isSelected = selectedStroke.id === stroke.id;
                return (
                  <button
                    key={stroke.id}
                    type="button"
                    onClick={() => setSelectedStroke(stroke)}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-150 active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-500/10 text-emerald-950 ring-2 ring-emerald-500/30 dark:border-emerald-400 dark:text-emerald-200'
                        : 'border-zinc-200/70 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/[0.06] dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-zinc-200 font-cjk text-2xl font-black text-zinc-900 dark:bg-zinc-950 dark:border-white/10 dark:text-zinc-50 shadow-xs">
                      {stroke.glyph}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-cjk font-extrabold text-sm">{stroke.name}</span>
                        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{stroke.pinyin}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate max-w-[110px]">
                        {stroke.direction}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Strich Detail-Panel */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md dark:border-white/[0.08] dark:bg-zinc-900/90 space-y-6">
              <div className="flex items-start justify-between border-b border-zinc-100 pb-4 dark:border-white/[0.06]">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 font-cjk text-4xl font-black text-emerald-800 dark:text-emerald-300">
                    {selectedStroke.glyph}
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      Grundstrich
                    </span>
                    <h2 className="mt-1 font-cjk text-2xl font-black text-zinc-900 dark:text-zinc-50">
                      {selectedStroke.name}{' '}
                      <span className="font-mono text-lg font-normal text-zinc-500 dark:text-zinc-400">
                        ({selectedStroke.pinyin})
                      </span>
                    </h2>
                  </div>
                </div>
              </div>

              {/* Richtung & Beschreibung */}
              <div className="space-y-2 rounded-2xl bg-zinc-50/80 p-4 border border-zinc-200/50 dark:bg-zinc-950/40 dark:border-white/[0.05]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Compass className="h-4 w-4" />
                  <span>Strichrichtung: {selectedStroke.direction}</span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {selectedStroke.description}
                </p>
              </div>

              {/* Beispielzeichen */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Vorkommen in HSK-1 Schriftzeichen:
                </h4>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {selectedStroke.sampleCharacters.map((sc) => (
                    <div
                      key={sc.char}
                      className="rounded-2xl border border-zinc-200/70 bg-zinc-50/60 p-3 dark:border-white/[0.05] dark:bg-zinc-950/30"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-cjk text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                          {sc.char}
                        </span>
                        <div>
                          <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 block">
                            {sc.pinyin}
                          </span>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block leading-tight">
                            {sc.meaning}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 7 SCHREIBREGELN */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Regelliste */}
          <div className="space-y-3 lg:col-span-5">
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Regeln auswählen:
            </h3>
            <div className="space-y-2">
              {STROKE_ORDER_RULES.map((rule, idx) => {
                const isSelected = selectedRule.id === rule.id;
                return (
                  <button
                    key={rule.id}
                    type="button"
                    onClick={() => setSelectedRule(rule)}
                    className={`w-full flex items-center justify-between rounded-2xl border p-3 text-left transition-all duration-150 active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-500/10 text-emerald-950 ring-2 ring-emerald-500/30 dark:border-emerald-400 dark:text-emerald-200'
                        : 'border-zinc-200/70 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/[0.06] dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold opacity-60">#{idx + 1}</span>
                        <span className="font-cjk font-extrabold text-sm">{rule.ruleChinese}</span>
                      </div>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 block mt-0.5">
                        {rule.ruleGerman}
                      </span>
                    </div>
                    <span className="font-cjk text-xl font-black opacity-80">{rule.exampleChar}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regel Detail-Panel */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md dark:border-white/[0.08] dark:bg-zinc-900/90 space-y-6">
              <div className="flex items-start justify-between border-b border-zinc-100 pb-4 dark:border-white/[0.06]">
                <div>
                  <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                    Schreibregel
                  </span>
                  <h2 className="mt-1 font-cjk text-2xl font-black text-zinc-900 dark:text-zinc-50">
                    {selectedRule.ruleChinese}{' '}
                    <span className="font-mono text-base font-normal text-zinc-500 dark:text-zinc-400">
                      ({selectedRule.rulePinyin})
                    </span>
                  </h2>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mt-0.5">
                    {selectedRule.ruleGerman}
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 border border-zinc-200 font-cjk text-3xl font-black text-zinc-900 dark:bg-zinc-800 dark:border-white/10 dark:text-zinc-50">
                  {selectedRule.exampleChar}
                </div>
              </div>

              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {selectedRule.explanation}
              </p>

              {/* Mnemonic (Merkbrücke) */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 dark:bg-amber-500/10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Sparkles className="h-4 w-4" />
                  <span>Lehrbuch-Merkbrücke:</span>
                </div>
                <p className="text-xs text-amber-900/90 dark:text-amber-200/90 italic">
                  „{selectedRule.mnemonic}“
                </p>
              </div>

              {/* Schritt-für-Schritt Ablauf */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Schrittweise Ausführung am Beispielzeichen {selectedRule.exampleChar}:
                </h4>
                <div className="space-y-1.5">
                  {selectedRule.stepBreakdown.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center gap-2.5 rounded-xl border border-zinc-200/60 bg-zinc-50/60 p-2.5 text-xs text-zinc-800 dark:border-white/[0.05] dark:bg-zinc-950/30 dark:text-zinc-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WICHTIGE RADIKALE */}
      {activeTab === 'radicals' && (
        <div className="space-y-6">
          <div className="border-b border-zinc-100 pb-3 dark:border-white/[0.06]">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Die sinntragenden Radikale (部首 Bùshǒu)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Radikale sind die semantischen Wurzeln der chinesischen Schrift. Wenn du das Radikal erkennst,
              kannst du die Themenkategorie eines unbekannten Zeichens sofort erraten!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOP_RADICALS.map((radical) => (
              <div
                key={radical.id}
                className="rounded-2xl border border-zinc-200/70 bg-white/90 p-3.5 shadow-xs dark:border-white/[0.06] dark:bg-zinc-900/80 flex items-center gap-3"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-cjk text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
                  {radical.hanzi}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {radical.pinyin}
                    </span>
                    {radical.forms.length > 0 && (
                      <span className="font-cjk text-xs text-zinc-400">
                        (Form: {radical.forms.join(', ')})
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block truncate">
                    Bedeutung: {radical.meaning}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 block">
                    {radical.strokes} Striche
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
