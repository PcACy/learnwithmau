# Hanzi Arcade — Design System & Visual Identity Specification

**Status:** Canonical Source of Truth  
**Target:** 100% HSK-1 Digital Textbook Replacement & Gamified Arcade

---

## 1. Native Product Shape & Architectural Essence

Hanzi Arcade is **not a generic landing page or blog template**. Its native shape is a **multi-sensory learning matrix** modeled around the cognitive stages of acquiring Mandarin Chinese:

1. **Phonetics & Tones (Input Layer):** Ear-Trainer (`/ear-trainer`) — Minimal pairs, audio synthesis, Chao 5-level pitch contours.
2. **Morphology & Character Construction (Decomposition Layer):** Hanzi Alchemy (`/alchemy`) — Radicals (`radicals.json`), spatial positions (`left`, `right`, `top`, `bottom`, `enclosure`, `inside`).
3. **Pinyin Typing & IME (Motor Output Layer):** TypeRacer (`/typeracer`) — WPM tracking, candidate bar selection, Hanzi verification.
4. **Syntax & Grammar (Structural Layer):** Sentence Builder (`/sentences`) & Grammar Compendium (`/grammar`) — SVO formulas, aspect markers (`了`), copula (`是`), location rule (`在`), questions.
5. **Applied Discourse & Reading (Context Layer):** Graded Reader (`/stories`) — 8 authentic HSK-1 stories, dual-mode reading (immersive prose vs. sentence cards), synchronized full audio playback with active sentence highlighting, word-click glossaries.
6. **Retention & Mastery (Memory & Evaluation Layer):** SRS Spaced Repetition (`/review`, SM-2 algorithm in `progressStore.ts`) & 35-minute realistic Mock Exam (`/exam`).

---

## 2. Color Palette & Roles

```css
:root {
  /* Canvas Backgrounds */
  --canvas-light: #f9fafb; /* Warm neutral light background */
  --canvas-dark: #09090b;  /* Zinc-950 foundation, never pure #000000 */

  /* Surfaces & Cards */
  --surface-light: #ffffff;
  --surface-dark: #18181b; /* Zinc-900 */
  --surface-glass-border: rgba(255, 255, 255, 0.1);

  /* Primary Accent: Emerald Signal (Growth, Accuracy, Mastery) */
  --accent-emerald-500: #10b981;
  --accent-emerald-600: #059669;
  --accent-emerald-700: #047857;
  --accent-emerald-subtle: rgba(16, 185, 129, 0.12);

  /* Feedback Accents */
  --accent-rose: #e11d48;   /* Errors, tone 4 descent, shake animations */
  --accent-amber: #f59e0b;  /* Streaks, warnings, neutral tone 5 */
  --accent-sky: #0284c7;    /* Tone 1 high level (55), information pills */

  /* Neutral Spectrum */
  --ink-primary: #18181b;   /* Light mode main text */
  --ink-secondary: #71717a; /* Zinc-500 body text */
  --ink-muted: #a1a1aa;     /* Zinc-400 subtitles & metadata */
  --line-whisper: rgba(228, 228, 231, 0.8); /* Zinc-200/80 */
}
```

### Banned Colors
- **NO** "AI Purple" / Neon violet gradients (`#8B5CF6`, `#A855F7`).
- **NO** pure black `#000000` (always Off-Black / Zinc-950).
- **NO** oversaturated neon accents above 80% saturation.

---

## 3. Typography System

| Role | Font Family | Tracking | Purpose |
|---|---|---|---|
| **Headlines & Display** | `Outfit`, sans-serif | `-0.025em` (tight) | Hero titles, section headers, scoreboards |
| **Pinyin, Codes & Data**| `JetBrains Mono`, monospace | `normal` | Pinyin transcriptions, shortcuts, timers, metrics |
| **Hanzi Glyphs (CJK)**  | `Noto Sans SC`, sans-serif | `0.05em` | Chinese characters, radical components, watermarks |

### Chao 5-Level Pitch Contour Visualization
Mandarin tones are represented by exact mathematical SVG vector curves (`PitchContour.tsx`):
- **Tone 1 (High Flat - 55):** Horizontal straight line at level 5 (`y = 4`).
- **Tone 2 (Rising - 35):** Diagonal ascending line from level 3 (`y = 12`) to 5 (`y = 4`).
- **Tone 3 (Dipping - 214):** Deep curve descending from level 2 to 1 and rising sharply to 4.
- **Tone 4 (Falling - 51):** Sharp steep drop from level 5 (`y = 4`) to 1 (`y = 20`).
- **Tone 5 (Neutral - 3):** Centered dot at midpoint level 3 (`y = 12`).

---

## 4. Hardware Component Architecture

### A. Double-Bezel Nested Cards
All major interactive modules (Hero banner, Story reader, Sentence builder, Dictionary detail) utilize a double-bezel frame:
1. **Outer Shell:** Semi-transparent gradient bezel (`border border-zinc-200/80 dark:border-white/10 rounded-[2.5rem] p-1.5`).
2. **Inner Core:** Solid surface with whisper shadow (`rounded-[calc(2.5rem-0.375rem)] bg-white dark:bg-zinc-900 shadow-whisper p-7 sm:p-10`).

### B. Button-in-Button Kinetic CTAs
High-priority action triggers (e.g. *"Jetzt starten"*, *"Alles vorlesen"*, *"Probeprüfung starten"*) feature an inner kinetic circle enclosing a vector arrow or play icon:
```html
<button class="inline-flex items-center gap-3 rounded-full bg-emerald-600 pl-6 pr-2 py-2 text-white shadow-whisper hover:bg-emerald-500">
  <span class="font-bold text-sm">Jetzt starten</span>
  <span class="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
    <ArrowRight class="h-4 w-4" />
  </span>
</button>
```

### C. Authentic Chinese Calligraphy Watermarks
Every page and topic contains an oversized, low-opacity background watermark representing the subject:
- **Arcade Dashboard:** `字` (Character)
- **TypeRacer:** `打` (Type / Strike)
- **Hanzi Alchemy:** `合` (Combine)
- **Sentence Builder:** `句` (Sentence)
- **Ear-Trainer:** `听` (Listen)
- **Number Drill:** `数` (Number / Count)
- **Graded Reader:** `读` (Read), `饭`, `友`, `校`, `天`, `买`, `话`, `医`
- **Grammar Compendium:** `法` (Grammar / Rule)
- **Mock Exam:** `考` (Examine / Test)

---

## 5. Interaction & Motion Rules

- **Spring-Based Physics:** Transitions use `var(--ease-spring)` (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Zero-Emoji Policy:** Strictly 0 emojis in code, UI copy, and system alerts. All visual iconography uses Lucide vector symbols.
- **Hardware Acceleration:** Animations manipulate exclusively `transform` and `opacity`.
- **Keyboard-First Shortcuts:** All training modes support full keyboard operation (`1-4` for tones, `Space` for audio replays, `Enter` to advance, `Esc` to return).
