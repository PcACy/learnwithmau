import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BookOpen,
  Crown,
  Flame,
  Gamepad2,
  Layers,
  MessageSquareQuote,
  Sparkles,
  Trophy,
  Volume2,
  Zap,
} from 'lucide-react';
import type { SrsCard } from '../types/srs';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'streak' | 'vocab' | 'games' | 'mastery';
  maxProgress: number;
  calculateProgress: (data: AchievementData) => { current: number; unlocked: boolean };
}

export interface AchievementData {
  cards: Record<string, SrsCard>;
  streak: { current: number; longest: number };
  stats: {
    alchemySolved?: number;
    tonesCorrect?: number;
    sentencesSolved?: number;
    blitzCompleted?: number;
  };
}

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: 'first-step',
    title: 'Erster Schritt',
    description: 'Schließe deine allererste Vokabel-Wiederholung ab.',
    icon: Sparkles,
    category: 'vocab',
    maxProgress: 1,
    calculateProgress: ({ cards }) => {
      const learned = Object.values(cards).filter((c) => c.intervalDays > 0).length;
      return { current: Math.min(1, learned), unlocked: learned >= 1 };
    },
  },
  {
    id: 'streak-3',
    title: 'Flammen-Entfacher',
    description: 'Halte eine Lernserie von mindestens 3 Tagen aufrecht.',
    icon: Flame,
    category: 'streak',
    maxProgress: 3,
    calculateProgress: ({ streak }) => {
      const best = Math.max(streak.current, streak.longest);
      return { current: Math.min(3, best), unlocked: best >= 3 };
    },
  },
  {
    id: 'streak-7',
    title: 'Feuer-Meister',
    description: 'Erreiche eine ungebrochene 7-Tage-Lernserie.',
    icon: Trophy,
    category: 'streak',
    maxProgress: 7,
    calculateProgress: ({ streak }) => {
      const best = Math.max(streak.current, streak.longest);
      return { current: Math.min(7, best), unlocked: best >= 7 };
    },
  },
  {
    id: 'vocab-25',
    title: 'Wort-Sammler',
    description: 'Nimm mindestens 25 HSK-1-Vokabeln in deinen Lernzyklus auf.',
    icon: BookOpen,
    category: 'vocab',
    maxProgress: 25,
    calculateProgress: ({ cards }) => {
      const count = Object.values(cards).filter((c) => c.intervalDays > 0).length;
      return { current: Math.min(25, count), unlocked: count >= 25 };
    },
  },
  {
    id: 'vocab-50',
    title: 'Wort-Kenner',
    description: 'Lerne mindestens 50 HSK-1-Vokabeln im SRS-System.',
    icon: Layers,
    category: 'vocab',
    maxProgress: 50,
    calculateProgress: ({ cards }) => {
      const count = Object.values(cards).filter((c) => c.intervalDays > 0).length;
      return { current: Math.min(50, count), unlocked: count >= 50 };
    },
  },
  {
    id: 'vocab-100',
    title: 'Wort-Gelehrter',
    description: 'Meistere mehr als 100 der 162 offiziellen HSK-1-Wörter.',
    icon: Award,
    category: 'vocab',
    maxProgress: 100,
    calculateProgress: ({ cards }) => {
      const count = Object.values(cards).filter((c) => c.intervalDays > 0).length;
      return { current: Math.min(100, count), unlocked: count >= 100 };
    },
  },
  {
    id: 'diamond-mastery',
    title: 'Erster Diamant',
    description: 'Bring mindestens eine Vokabel auf Meister-Stufe (60+ Tage Intervall).',
    icon: Crown,
    category: 'mastery',
    maxProgress: 1,
    calculateProgress: ({ cards }) => {
      const diamonds = Object.values(cards).filter((c) => c.intervalDays >= 60).length;
      return { current: Math.min(1, diamonds), unlocked: diamonds >= 1 };
    },
  },
  {
    id: 'gold-trio',
    title: 'Goldenes Trio',
    description: 'Besitze mindestens 3 Vokabeln auf Gold- oder Meister-Stufe.',
    icon: Trophy,
    category: 'mastery',
    maxProgress: 3,
    calculateProgress: ({ cards }) => {
      const golds = Object.values(cards).filter((c) => c.intervalDays >= 11).length;
      return { current: Math.min(3, golds), unlocked: golds >= 3 };
    },
  },
  {
    id: 'alchemy-hero',
    title: 'Alchemie-Meister',
    description: 'Baue Schriftzeichen aus ihren Radikal-Bestandteilen zusammen.',
    icon: Gamepad2,
    category: 'games',
    maxProgress: 6,
    calculateProgress: ({ stats }) => {
      const count = stats.alchemySolved ?? 0;
      return { current: Math.min(6, count), unlocked: count >= 6 };
    },
  },
  {
    id: 'tone-master',
    title: 'Ton-Virtuose',
    description: 'Höre die vier Töne der chinesischen Sprache fehlerfrei heraus.',
    icon: Volume2,
    category: 'games',
    maxProgress: 10,
    calculateProgress: ({ stats }) => {
      const count = stats.tonesCorrect ?? 0;
      return { current: Math.min(10, count), unlocked: count >= 10 };
    },
  },
  {
    id: 'sentence-pro',
    title: 'Satzbau-Baumeister',
    description: 'Kombiniere HSK-1-Wortkarten zu vollständigen Sätzen.',
    icon: MessageSquareQuote,
    category: 'games',
    maxProgress: 5,
    calculateProgress: ({ stats }) => {
      const count = stats.sentencesSolved ?? 0;
      return { current: Math.min(5, count), unlocked: count >= 5 };
    },
  },
  {
    id: 'blitz-champion',
    title: 'Blitz-Champion',
    description: 'Schließe eine 2-Minuten-Blitzsession erfolgreich ab.',
    icon: Zap,
    category: 'games',
    maxProgress: 1,
    calculateProgress: ({ stats }) => {
      const count = stats.blitzCompleted ?? 0;
      return { current: Math.min(1, count), unlocked: count >= 1 };
    },
  },
];
