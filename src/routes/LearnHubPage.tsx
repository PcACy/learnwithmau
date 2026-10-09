import {
  BookOpen,
  BookOpenText,
  CalendarDays,
  GraduationCap,
  Landmark,
  PenLine,
  Volume2,
} from 'lucide-react';
import { HubTile } from '../components/ui/HubTile';
import { PageHeader } from '../components/ui/PageHeader';

const ITEMS = [
  { to: '/plan', title: '30-Tage-Plan', description: 'Dein Fahrplan bis zur Prüfung, Tag für Tag.', icon: CalendarDays },
  { to: '/dictionary', title: 'Wörterbuch', description: 'Alle HSK-1-Wörter mit Audio und Strichfolge.', icon: BookOpen },
  { to: '/grammar', title: 'Grammatik', description: 'Muster, Beispiele und typische Fallstricke.', icon: GraduationCap },
  { to: '/stories', title: 'Lesen', description: 'Kurze Texte zum Verstehen und Mitlesen.', icon: BookOpenText },
  { to: '/pinyin', title: 'Pinyin & Töne', description: 'Aussprache und die vier Töne sicher beherrschen.', icon: Volume2 },
  { to: '/strokes', title: 'Striche & Radikale', description: 'Schreiben lernen, Baustein für Baustein.', icon: PenLine },
  { to: '/culture', title: 'Kultur', description: 'Etikette und Alltag in China.', icon: Landmark },
] as const;

export function LearnHubPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Lernen"
        subtitle="Neues entdecken: Plan, Wörter, Grammatik und Texte."
        sealChar="学"
        badge="LERNEN"
        variant="jade"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {ITEMS.map((item, index) => (
          <HubTile key={item.to} {...item} index={index} />
        ))}
      </div>
    </div>
  );
}
