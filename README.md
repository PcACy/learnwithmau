# 汉 Hanzi Arcade

> **Interaktive HSK-1 Lernplattform & Digitaler Lehrbuch-Ersatz**  
> Lerne Mandarin-Chinesisch auf HSK-1-Niveau — durch gamifizierte Trainingsmodi, ein 12-Lektionen-Grammatikkompendium, Graded-Reader-Geschichten mit synchronisiertem Audio und eine offizielle 30-Fragen-Probeprüfung.

---

## 🎯 Zweck & Vision

**Hanzi Arcade** ersetzt klassische Chinesisch-Lehrbücher durch ein modernes, interaktives System. Anstelle von statischen Tabellen vermittelt die Plattform alle 163 Vokabeln und 12 Grammatikthemen des offiziellen **Hanban / CTI HSK-1 Lehrplans** über multisensorische Methoden:
- **Hören & Sprechen:** Native Sprachausgabe für jede Vokabel und jeden Beispielsatz, ergänzt durch SVG-Tonhöhenverläufe nach dem **Chao-5-Stufen-System**.
- **Schreiben & Zerlegen:** Radikal-Alchemie im Drag-and-Drop und animierte Strichfolgen (`HanziWriter`).
- **Tippen & IME:** Pinyin-TypeRacer zur Schulung der Eingabegeschwindigkeit und Zeichenerkennung.
- **Lesen & Verstehen:** Graded Reader mit Alltagsgeschichten, Satz-für-Satz-Audio, Sofort-Lookup bei Klick auf beliebige Wörter und Verständnisprüfungen.
- **Prüfungssimulation:** Realistischer HSK-1-Mock-Exam mit 35-Minuten-Timer, Fragen-Navigator und detaillierter Fehleranalyse.

---

## 🏗️ Kritische Dateien & Datenstrukturen

### 1. Datenbestand & Schemas (`src/data/` & `src/types/`)
* **[`src/data/hsk1.json`](src/data/hsk1.json) (`VocabItem`):**  
  Der kanonische Wortschatz (163 Einträge, 100 % Deckung des offiziellen HSK-1-Bestands). Jeder Eintrag enthält Silben mit Tönen (`PinyinSyllable`), deutsche Übersetzung, Radikalzerlegung (`CharacterDecomposition`), Strichfolgen und Audio-Pfad (`/audio/hsk1/hsk1-*.mp3`).
* **[`src/data/grammar.json`](src/data/grammar.json) (`GrammarLesson`):**  
  12 vollständige HSK-1-Grammatiklektionen mit visuellen Syntaxformeln, Kernregeln, zweisprachigen Beispielsätzen mit Audio, typischen Anfänger-Stolperfallen (*Falsch vs. Richtig*) und Verständnisfragen.
* **[`src/data/stories.json`](src/data/stories.json) (`Story`):**  
  8 alltagsnahe Lesegeschichten mit satzweiser Tokenisierung (`StoryWordToken`), deutscher Übersetzung, Einzel- und Gesamtaudio sowie Leseverständnis-Quizzen.
* **[`src/data/mockExam.json`](src/data/mockExam.json) (`ExamQuestion`):**  
  30 offizielle HSK-1-Prüfungsfragen (15 Hörverstehen + 15 Leseverstehen) mit 35-Minuten-Timer und didaktischen Erklärungen.
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
| **Wörterbuch** | `/dictionary` | 163 Wörter mit Suche, Filter nach HSK-Level, Audio, Strichfolge-Animation und Chao-Tonkurven. |
| **Grammatik-Kompendium**| `/grammar` | 12 strukturierte Lektionen: SVO, 是, 有/没有, 在, Fragepartikeln, 的, Zählwörter, Zeitlogik, Modalverben, 了/请. |
| **Graded Reader (Lesen)** | `/stories` | 8 Geschichten im Dual-Modus (Buch-Fließtext vs. Satzkarten) mit synchronisiertem Vorlesen und Wort-Lookup. |
| **HSK-1 Probeprüfung** | `/exam` | 30-Fragen-Prüfungssimulation (Hören & Lesen) mit 35-Minuten-Countdown und Fehleranalyse. |
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

# Unit-Tests ausführen (84/84 Tests)
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
