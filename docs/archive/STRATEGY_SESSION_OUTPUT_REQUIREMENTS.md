# Anforderungen an die Ergebnis-Dokumente der Strategie-Session

**Zweck:** Damit die Strategie-Session ein verwertbares Ergebnis produziert, hier die Struktur-Anforderungen an die drei Output-Dokumente.

---

## 1. PRODUCT_STRATEGY_V1.md

**Zweck:** Primärquelle für alle späteren Planer. Langlebig, authoritativ.

**Struktur:**
- **Abschnitt 1 — Grund-Konzepte** (was ist ein Projekt, was ist ein Preset, was ist ein Grid, was ist eine Signature, was ist ein Prompt — je 2-3 Zeilen, User-facing Definition)
- **Abschnitt 2 — Datenmodell-Entscheidungen** (Antworten auf A1–A4, kein Code-Schema, nur Konzept)
- **Abschnitt 3 — UX-Workflow-Entscheidungen** (Antworten auf B1–B4)
- **Abschnitt 4 — Landing-Konsequenzen** (Antworten auf C1–C3)
- **Abschnitt 5 — Picker-Konsequenzen** (Antworten auf D1–D2)
- **Abschnitt 6 — Ausblick Grid Creator + SeenLab** (Antworten auf E1–E3)
- **Abschnitt 7 — Offene Punkte / Vertagt** (Sachen die während der Session aufgekommen sind und für später notiert wurden)

**Pro Entscheidung dokumentieren:**
- Die Entscheidung (kurz, eindeutig)
- Die Alternativen die diskutiert wurden
- Die Begründung warum diese gewählt wurde

---

## 2. HANDOFF_STRATEGY_TO_PICKER.md

**Zweck:** Kompakte Übergabe an den Picker-Planer. Nur das was der Picker-Planer konkret wissen muss.

**Muss enthalten:**
- Rolle des Picker-Planers (nicht bauen, nur planen — Picker-Mockup 02 als visuelle Referenz, Strategy-V1 als Produkt-Grundlage)
- Die relevanten Strategy-Entscheidungen (D1, D2, plus alles aus B und C das die Picker-UI betrifft)
- Was der Picker-Planer NICHT anfassen darf (Workspace, Brand, Logo, Slogan, spätere Ebenen)
- Lese-Liste für den Picker-Planer (PRODUCT_STRATEGY_V1.md, PHASE1_STATUS.md, NUANCEN.md, Mockup_02)
- Ergebnis-Erwartungen an die Picker-Planer-Session (Picker-Bau-Brief für den Code-Chat)

---

## 3. STARTPROMPT_PICKER_PLANNING.md

**Zweck:** Der Prompt den Jonas in den neuen Planungs-Chat reinkopiert.

**Analog zum STARTPROMPT_STRATEGY_PLANNING.md aufgebaut.** Muss enthalten:
- Jonas-Rolle und Arbeitsstil
- Aufgabe der Picker-Planer-Session
- Anti-Drift-Punkte
- Lese-Liste (in Reihenfolge)
- Erste Aufgabe nach Setup

---

## Qualitäts-Check vor Session-Ende

Vor dem letzten Commit prüfen:
- [ ] Alle drei Dokumente liegen im Repo unter `docs/visual-overhaul/`
- [ ] PRODUCT_STRATEGY_V1.md beantwortet **alle** Fragen A–E (keine offen, ggf. als "vertagt" markiert)
- [ ] HANDOFF_STRATEGY_TO_PICKER.md referenziert PRODUCT_STRATEGY_V1.md als Primärquelle
- [ ] STARTPROMPT_PICKER_PLANNING.md ist kopier-und-einfüg-bereit
- [ ] ROADMAP.md ist aktualisiert (Strategie ✓, Picker →)
