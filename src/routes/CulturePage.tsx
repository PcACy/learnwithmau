import { useState } from 'react';
import { Sparkles, HeartHandshake } from 'lucide-react';
import { SealBadge } from '../components/ui/SealBadge';
import { CULTURE_TOPICS, type CultureTopic } from '../data/cultureNotes';

export function CulturePage() {
  const [selectedTopic, setSelectedTopic] = useState<CultureTopic>(CULTURE_TOPICS[0]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <SealBadge sealChar="文" label="KULTUR & LANDESKUNDE" variant="cinnabar" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Lehrbuch-Fundament · Kultur- &amp; Etikette-Fibel
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-zinc-50">
          Kultur, Etikette &amp; Gepflogenheiten (文化小知识)
        </h1>
        <p className="max-w-3xl text-sm text-zinc-600 dark:text-zinc-300">
          Eine Sprache lernt man nicht isoliert von ihrer Kultur. Verstehe chinesische Höflichkeitsrituale,
          Namensstrukturen, die Kunst der Bescheidenheit und die Geheimnisse der Zahlensymbolik.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Topic Selector List */}
        <div className="space-y-2.5 lg:col-span-5">
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Themenübersicht:
          </h3>
          <div className="space-y-2">
            {CULTURE_TOPICS.map((topic) => {
              const isSelected = selectedTopic.id === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all duration-150 active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'border-rose-600/50 bg-rose-500/10 text-rose-950 ring-2 ring-rose-500/30 dark:border-rose-400/40 dark:text-rose-200 dark:bg-rose-500/15'
                      : 'border-zinc-200/70 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/[0.06] dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <div>
                    <span className="inline-block rounded-full bg-zinc-200/60 px-2 py-0.5 font-mono text-[9px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {topic.categoryLabel}
                    </span>
                    <h4 className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {topic.titleGerman}
                    </h4>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-cjk">
                      {topic.titleChinese}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-rose-700 dark:text-rose-400 shrink-0 ml-2">
                    {topic.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic Detail Inspector */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md dark:border-white/[0.08] dark:bg-zinc-900/90 space-y-6">
            <div className="border-b border-zinc-100 pb-4 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="inline-block rounded-full bg-rose-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-rose-800 dark:bg-rose-500/20 dark:text-rose-300">
                  {selectedTopic.categoryLabel}
                </span>
                <span className="text-xs text-zinc-400 font-mono">· {selectedTopic.badge}</span>
              </div>
              <h2 className="mt-2 text-2xl font-black text-zinc-900 dark:text-zinc-50">
                {selectedTopic.titleGerman}
              </h2>
              <p className="font-cjk text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
                {selectedTopic.titleChinese} ({selectedTopic.titlePinyin})
              </p>
            </div>

            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {selectedTopic.summary}
            </p>

            {/* Key Takeaways */}
            <div className="space-y-2.5">
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Zentrale Erkenntnisse für den Alltag:
              </h4>
              <div className="space-y-2">
                {selectedTopic.keyTakeaways.map((takeaway, tIdx) => (
                  <div
                    key={tIdx}
                    className="rounded-2xl border border-zinc-200/60 bg-zinc-50/70 p-3 text-xs leading-relaxed text-zinc-800 dark:border-white/[0.05] dark:bg-zinc-950/40 dark:text-zinc-200 flex items-start gap-2.5"
                  >
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                      #{tIdx + 1}
                    </span>
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Etiquette Tip / Tabu Alert */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 dark:bg-rose-500/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                <HeartHandshake className="h-4 w-4" />
                <span>Etikette-Empfehlung &amp; Fettnäpfchen-Vermeidung:</span>
              </div>
              <p className="text-xs text-rose-950/90 dark:text-rose-200/90 leading-relaxed font-medium">
                {selectedTopic.etiquetteTip}
              </p>
            </div>

            {/* Cultural Vocabulary Chips */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Schlüsselbegriffe zum Thema:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTopic.vocabulary.map((vocab) => (
                  <div
                    key={vocab.hanzi}
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-200/70 bg-zinc-50 px-3 py-1.5 text-xs dark:border-white/[0.06] dark:bg-zinc-950/50"
                  >
                    <span className="font-cjk font-bold text-zinc-900 dark:text-zinc-100">{vocab.hanzi}</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
                      {vocab.pinyin}
                    </span>
                    <span className="text-zinc-400 text-[11px]">({vocab.meaning})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
