# Hanzi Arcade — Agent Guidelines & Workflow Rules

## 1. Auto-Commit & Sync Workflow
* **Automatisches Committen & Pushen:** Nach Abschluss jeder Aufgabe, neuen Features oder Bugfixes muss nach erfolgreicher Verifikation (`npx vitest run`, `npm run lint`, `npm run build`) automatisch ein präziser Git-Commit nach Conventional-Commits-Standard erstellt und zum Remote (`git push origin <current-branch>`) synchronisiert werden.
* **Commit-Format:** `<type>(<scope>): <kurze beschreibung in kleinschreibung>` (z.B. `feat(dialogue): add interactive HSK-1 dialogue mode`).

## 2. Design System & Frontend-Standards
* **Anti-Slop & Redaktionelle Ästhetik:** Striktes Befolgen der Richtlinien aus `DESIGN.md`.
* **Zero-Emoji-Policy:** Im UI dürfen keine Emojis verwendet werden; ausschließlich Lucide-Vektor-Icons und CJK-Schriftzeichen.
* **Farben & Flächen:** Double-Bezel-Architektur, `#09090b` Canvas-Hintergrund in Dark-Mode, Emerald Signal (`#10B981` / `#059669`) für Fortschritt/Erfolge, Cinnabar Red (`#E11D48`) für Stempel-Badges.
* **Typografie:** `font-sans` (`Outfit`) für Überschriften, `font-cjk` (`Noto Sans SC`) für chinesische Zeichen, `font-mono` (`JetBrains Mono`) für Pinyin, Hotkeys und Zahlen.

## 3. Test- & Codequalität
* **Test-Coverage:** Jeder neue Modus und didaktische Datenbestand benötigt eine zugehörige Vitest-Testsuite in `src/lib/`.
* **Null-Fehler-Toleranz:** Vor jedem Commit müssen `npm test`, `npm run lint` und `npm run build` fehler- und warnungsfrei durchlaufen.
