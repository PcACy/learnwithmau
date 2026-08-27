import type { LucideIcon } from 'lucide-react';
import { CalendarClock, FlaskConical, Headphones, Keyboard, Layers, MessageSquareQuote } from 'lucide-react';
import type { ModeId } from '../types/game';

export interface ModeConfig {
  id: ModeId;
  path: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
}

export const MODES: readonly ModeConfig[] = [
  {
    id: 'ear-trainer',
    path: '/ear-trainer',
    title: 'Pinyin Ear-Trainer',
    tagline: 'Minimal Pairs & Töne hören',
    description: 'Unterscheide ähnliche Silben und Töne per Tastatur-Antwort.',
    icon: Headphones,
  },
  {
    id: 'typeracer',
    path: '/typeracer',
    title: 'Pinyin TypeRacer',
    tagline: 'IME-Training mit Zeichenauswahl',
    description: 'Tippe Pinyin schnell und wähle das richtige Zeichen aus.',
    icon: Keyboard,
  },
  {
    id: 'alchemy',
    path: '/alchemy',
    title: 'Hanzi Alchemy',
    tagline: 'Radikale zu Hanzi verbinden',
    description: 'Setze Zeichen aus ihren Radikal-Bausteinen im Drag-and-Drop zusammen.',
    icon: FlaskConical,
  },
  {
    id: 'sentences',
    path: '/sentences',
    title: 'Satzbau-Baukasten',
    tagline: 'Grammatik & Wortreihenfolge',
    description: 'Baue vollständige HSK-1-Sätze aus gemischten Wortkarten zusammen.',
    icon: MessageSquareQuote,
  },
  {
    id: 'number-drill',
    path: '/number-drill',
    title: 'Number & Time Drill',
    tagline: 'Zahlen, Uhrzeiten, Daten',
    description: 'Erkenne Zahlen, Uhrzeiten und Daten blitzschnell.',
    icon: CalendarClock,
  },
  {
    id: 'review',
    path: '/review',
    title: 'Fälligkeits-Drill',
    tagline: 'SM-2-Karten selbst bewerten',
    description: 'Wiederhole alle fälligen Vokabeln im klassischen Karteikarten-Stil.',
    icon: Layers,
  },
] as const;
