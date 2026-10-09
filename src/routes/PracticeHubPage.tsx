import { useMemo } from 'react';
import { RotateCcw, Zap } from 'lucide-react';
import { HubTile } from '../components/ui/HubTile';
import { PageHeader } from '../components/ui/PageHeader';
import { MODES } from '../config/modes';
import { VOCAB } from '../data';
import { filterActiveMistakes } from '../lib/mistakeBank';
import { selectDueItemIds } from '../lib/srsQuery';
import { useProgressStore } from '../store/progressStore';

const ALL_ITEM_IDS: readonly string[] = VOCAB.map((item) => item.id);

export function PracticeHubPage() {
  const cards = useProgressStore((s) => s.cards);
  const mistakes = useProgressStore((s) => s.mistakes);
  const dueCount = useMemo(
    () => selectDueItemIds(cards, ALL_ITEM_IDS, new Date()).length,
    [cards],
  );
  const mistakeCount = useMemo(() => filterActiveMistakes(mistakes).length, [mistakes]);

  const tiles = [
    ...MODES.filter((m) => m.id !== 'exam').map((m) => ({
      to: m.path,
      title: m.title,
      description: m.tagline,
      icon: m.icon,
      tag: m.id === 'review' && dueCount > 0 ? `${dueCount} fällig` : undefined,
    })),
    {
      to: '/blitz',
      title: 'Blitz-Runde',
      description: '90 Sekunden volle Konzentration.',
      icon: Zap,
      tag: undefined,
    },
    {
      to: '/mistakes',
      title: 'Schwachstellen',
      description: 'Üben, was bisher nicht saß.',
      icon: RotateCcw,
      tag: mistakeCount > 0 ? `${mistakeCount}` : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Üben"
        subtitle="Jede Runde bringt XP. Such dir einen Modus aus."
        sealChar="练"
        badge="ÜBEN"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {tiles.map((tile, index) => (
          <HubTile key={tile.to} {...tile} index={index} />
        ))}
      </div>
    </div>
  );
}
