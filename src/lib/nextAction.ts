export type NextActionKind = 'plan' | 'review' | 'mistakes' | 'grammar' | 'story' | 'exam';

export interface NextAction {
  kind: NextActionKind;
  title: string;
  subtitle: string;
  cta: string;
  to: string;
}

export interface NextActionInput {
  /** Erste offene Aufgabe des heutigen Plantags, falls der Plan läuft. */
  planTask?: { label: string; detail?: string; minutes: number; route: string };
  dueCount: number;
  mistakeCount: number;
  nextGrammar?: { id: string; title: string; subtitle: string };
  nextStory?: { id: string; title: string; germanTitle: string };
}

/**
 * Wählt die eine Aufgabe, die die Startseite als „Weiter lernen“ zeigt.
 * Reihenfolge: Plan, fällige Karten, Schwachstellen, Grammatik, Lesen, Prüfung.
 */
export function pickNextAction(input: NextActionInput): NextAction {
  if (input.planTask) {
    const { label, detail, minutes, route } = input.planTask;
    return {
      kind: 'plan',
      title: label,
      subtitle: `${detail ? `${detail} ` : ''}Ca. ${minutes} Min. laut Plan.`,
      cta: 'Los geht’s',
      to: route,
    };
  }
  if (input.dueCount > 0) {
    return {
      kind: 'review',
      title: `${input.dueCount} Vokabeln warten auf dich`,
      subtitle: 'Kurze Wiederholung, damit nichts verloren geht.',
      cta: 'Jetzt wiederholen',
      to: '/review',
    };
  }
  if (input.mistakeCount > 0) {
    return {
      kind: 'mistakes',
      title: `${input.mistakeCount} Schwachstellen beheben`,
      subtitle: 'Fokussierte Runden, bis jede Lücke geschlossen ist.',
      cta: 'Schwachstellen üben',
      to: '/mistakes',
    };
  }
  if (input.nextGrammar) {
    return {
      kind: 'grammar',
      title: input.nextGrammar.title,
      subtitle: input.nextGrammar.subtitle,
      cta: 'Lektion starten',
      to: `/grammar?lesson=${encodeURIComponent(input.nextGrammar.id)}`,
    };
  }
  if (input.nextStory) {
    return {
      kind: 'story',
      title: input.nextStory.title,
      subtitle: input.nextStory.germanTitle,
      cta: 'Geschichte lesen',
      to: `/stories?id=${encodeURIComponent(input.nextStory.id)}`,
    };
  }
  return {
    kind: 'exam',
    title: 'Bereit für die Probeprüfung',
    subtitle: 'Teste dich unter echten Prüfungsbedingungen.',
    cta: 'Prüfung starten',
    to: '/exam',
  };
}
