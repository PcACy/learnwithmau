# 汉 Hanzi Arcade

> **Interaktive HSK-1 Lernplattform & Digitaler Lehrbuch-Ersatz**  
> Lerne Mandarin-Chinesisch auf HSK-1-Niveau — durch gamifizierte Trainingsmodi, ein 12-Lektionen-Grammatikkompendium, Graded-Reader-Geschichten mit synchronisiertem Audio und eine offizielle 40-Fragen-Probeprüfung im Format der neuen HSK-3.0-Prüfung (gültig ab 1. Juli 2026).

---

## 🎯 Zweck & Vision

**Hanzi Arcade** ersetzt klassische Chinesisch-Lehrbücher durch ein modernes, interaktives System. Anstelle von statischen Tabellen vermittelt die Plattform alle 300 Vokabeln der offiziellen **HSK-3.0-Wortliste (Stufe 1, 300 Wörter)** und 12 Grammatikthemen über multisensorische Methoden:
- **Hören & Sprechen:** Native Sprachausgabe für jede Vokabel und jeden Beispielsatz, ergänzt durch SVG-Tonhöhenverläufe nach dem **Chao-5-Stufen-System**.
- **Schreiben & Zerlegen:** Radikal-Alchemie im Drag-and-Drop und animierte Strichfolgen (`HanziWriter`).
- **Tippen & IME:** Pinyin-TypeRacer zur Schulung der Eingabegeschwindigkeit und Zeichenerkennung.
- **Lesen & Verstehen:** Graded Reader mit Alltagsgeschichten, Satz-für-Satz-Audio, Sofort-Lookup bei Klick auf beliebige Wörter und Verständnisprüfungen.
- **Prüfungssimulation:** Realistischer HSK-1-Mock-Exam im offiziellen Format (40 Fragen, 200 Punkte, Bestehensgrenze 120) mit 40-Minuten-Timer, Fragen-Navigator und detaillierter Fehleranalyse.

---

## 🏗️ Kritische Dateien & Datenstrukturen

### 1. Datenbestand & Schemas (`src/data/` & `src/types/`)
* **[`src/data/hsk1.json`](src/data/hsk1.json) (`VocabItem`):**  
  Der kanonische Wortschatz (307 Einträge: alle 300 Wörter der offiziellen HSK-3.0-Liste für Stufe 1 plus 7 bewährte Zusatzwörter). Jeder Eintrag enthält Silben mit Tönen (`PinyinSyllable`), deutsche Übersetzung, Radikalzerlegung (`CharacterDecomposition`), Strichfolgen und Audio-Pfad (`/audio/hsk1/hsk1-*.mp3`).
* **[`src/data/grammar.json`](src/data/grammar.json) (`GrammarLesson`):**  
  12 vollständige HSK-1-Grammatiklektionen mit visuellen Syntaxformeln, Kernregeln, zweisprachigen Beispielsätzen mit Audio, typischen Anfänger-Stolperfallen (*Falsch vs. Richtig*) und Verständnisfragen.
* **[`src/data/stories.json`](src/data/stories.json) (`Story`):**  
  12 alltagsnahe Lesegeschichten mit satzweiser Tokenisierung (`StoryWordToken`), deutscher Übersetzung, Einzel- und Gesamtaudio sowie Leseverständnis-Quizzen (100 % Wortschatzabdeckung).
* **[`src/data/mockExam.json`](src/data/mockExam.json) (`ExamQuestion`):**  
  80 offizielle HSK-1-Prüfungsfragen in zwei vollständigen Sätzen à 40 Fragen (20 Hörverstehen + 20 Leseverstehen, je vier Teile mit fünf Fragen). Set 1, Set 2 und Shuffle-Modus, 40-Minuten-Timer, 5 Punkte je Frage, Bestehensgrenze 120 von 200 Punkten, didaktische Erklärungen.
* **[`src/data/radicals.json`](src/data/radicals.json) (`Radical`):**  
  Radikal-Datenbank für den Hanzi-Alchemy-Baukasten (Positionen: `left`, `right`, `top`, `bottom`, `enclosure`, `inside`).

### 2. Audio & Visualisierung (`src/lib/` & `src/components/ui/`)
* **[`src/lib/audio.ts`](src/lib/audio.ts):**  
  Audio-Engine mit Web Audio API Synthesizer für Tonhöhen-Sequenzen und Asset-Player für Edge-TTS-Sprachdateien.
* **[`src/components/ui/PitchContour.tsx`](src/components/ui/PitchContour.tsx):**  
  Vektor-SVG-Komponente für Mandarin-Tonkurven (Ton 1: 55, Ton 2: 35, Ton 3: 214, Ton 4: 51, Neutraler Ton: 3).
* **[`src/lib/confetti.ts`](src/lib/confetti.ts):**  
  Leichtgewichtige Gamification-Effekte (`canvas-confetti`) für Level-Abschlüsse (`fireCelebration`) und Interaktionssparks (`fireMicroBurst`).

### 3. State Management & Persistenz (`src/store/`)
* **[`src/store/progressStore.ts`](src/store/progressStore.ts):**  
  Verwaltet den Spaced-Repetition-Lernstand (SuperMemo SM-2 Algorithmus), Fälligkeiten (`selectDueItemIds`), tägliche Ziele, Lernstreaks und Session-Statistiken in IndexedDB/Dexie.

---

## 🕹️ Die Lern- und Trainingsmodule

| Modul | Route | Beschreibung & Kernfunktion |
|---|---|---|
| **Pinyin Ear-Trainer** | `/ear-trainer` | Minimal Pairs & Tonhöhen-Unterscheidung per Audio & Tastatur-Shortcut (Tasten 1–4). |
| **Pinyin TypeRacer** | `/typeracer` | IME-Tipptrainer gegen die Uhr: Pinyin tippen und das passende Hanzi-Zeichen wählen. |
| **Hanzi Alchemy** | `/alchemy` | Schriftzeichen aus ihren Radikalen zusammensetzen (Drag-and-Drop / Klick). |
| **Satzbau-Baukasten** | `/sentences` | Grammatikalisch korrekte HSK-1-Sätze aus gemischten Wortblöcken bauen. |
| **Number & Time Drill** | `/number-drill` | Schnellerkennung von Zahlen (0–100), Uhrzeiten, Wochentagen und Daten. |
| **Fälligkeits-Drill (SRS)** | `/review` | SM-2 Karteikarten-Wiederholung für fällige Vokabeln mit Selbstbewertung. |
| **Wörterbuch** | `/dictionary` | 307 Wörter mit Suche, Filter nach HSK-Level, Audio, Strichfolge-Animation und Chao-Tonkurven. |
| **Grammatik-Kompendium**| `/grammar` | 12 strukturierte Lektionen: SVO, 是, 有/没有, 在, Fragepartikeln, 的, Zählwörter, Zeitlogik, Modalverben, 了/请. |
| **Graded Reader (Lesen)** | `/stories` | 12 Geschichten im Dual-Modus (Buch-Fließtext vs. Satzkarten) mit synchronisiertem Vorlesen und Wort-Lookup. |
| **HSK-1 Alltagsdialoge** | `/dialogue` | 6 interaktive Rollenspiele mit Verzweigungen, nativer Multi-Voice-Sprachausgabe, Entscheidungen und Feedback. |
| **HSK-1 Probeprüfung** | `/exam` | Vollständige 40-Fragen-Prüfungssimulation im offiziellen Format (2 × 8 Teile, Hören & Lesen) aus 80 Fragen (Set 1 / Set 2 / Shuffle) mit 40-Minuten-Countdown und Fehleranalyse. |
| **Blitz-Session** | `/blitz` | 90-Sekunden-Highspeed-Sprint mit gemischten Vokabel-, Ton- und Zeichenfragen. |

---

## 🎨 Design System & Visual Identity

Das Design folgt strengen redaktionellen Standards (`.agents/skills/stitch-design-taste`):

* **Farbpalette:**
  - **Canvas Base:** `#09090b` (Zinc-950 Tiefe, niemals reines `#000000`)
  - **Karten-Oberflächen:** `bg-white` (Light) / `bg-zinc-900` mit Glasrahmen `border-white/10` (Dark)
  - **Signal-Akzent:** Emerald Signal (`#10B981` / `#059669`) für Fortschritt, Meisterschaft und korrekte Antworten
  - **Warnung & Fehler:** Deep Rose (`#E11D48`) und Amber Warmth (`#F59E0B`)
* **Typografie:**
  - **Display / Headlines:** `Outfit` (`font-sans`), Track-tight (`-0.025em`), gewichtete Hierarchie
  - **Code & Metadaten:** `JetBrains Mono` (`font-mono`) für Pinyin, Tastatur-Hints und Zahlen
  - **Schriftzeichen:** `Noto Sans SC` (`font-cjk`) für gestochen scharfe, traditionell korrekte CJK-Glyphen
* **Architektur & Komponenten:**
  - **Double-Bezel Architecture:** Zweischalige Karten (äußerer Glasrahmen + innerer Soft-Shadow-Kern)
  - **Button-in-Button CTAs:** Pillenförmige Buttons mit kinetischem Kreis-Icon
  - **Chinesische Kalligraphie-Wasserzeichen:** Subtile Schriftzeichen im Hintergrund (`字`, `打`, `合`, `句`, `听`, `数`, `读`, `考`)
  - **Strikte Zero-Emoji-Policy:** Reine Typografie und Vektor-Icons (Lucide)
  - **GPU-Micro-Motion:** Federbasierte Keyframe-Animationen (`--ease-spring`), Shakes bei Fehlern, Pop-ins bei Erfolgen

---

## 🚀 Entwicklung & Verifikation

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Unit-Tests ausführen
npx vitest run

# Codequalität & Linting prüfen
npm run lint

# Produktions-Build erzeugen
npm run build
```

---

## 🔒 Sicherheit & Deployment

Das Projekt ist für den produktiven Einsatz auf **Vercel** konfiguriert (`vercel.json`) und durch Sicherheits-Header gehärtet:
- **Content Security Policy (CSP)**
- **Strict-Transport-Security (HSTS, 2 Jahre Preload)**
- **X-Frame-Options (`DENY`)**
- **X-Content-Type-Options (`nosniff`)**
- **Permissions-Policy**
- **Vollständige PWA-Unterstützung (Offline-Fähigkeit via Service Worker)**
