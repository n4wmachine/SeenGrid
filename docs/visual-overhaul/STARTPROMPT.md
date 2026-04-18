# STARTPROMPT — aktueller Chat-Start-Prompt

**Konvention:** Es gibt **eine** `STARTPROMPT.md` im Repo. Sie enthält
immer den Startprompt für den **nächsten** zu startenden Chat. Jeder
Chat überschreibt sie am Ende seiner Session mit dem Startprompt für
seinen Nachfolger. Historische Versionen liegen in git-log, nicht
separat im Repo.

**End-of-Session-Pflicht — Branch-Name propagieren:**
Wenn du am Ende deiner Session einen neuen STARTPROMPT schreibst, trage
den **aktuellen Arbeits-Branch** an zwei Stellen ein:
1. Im Meta-Feld "Arbeits-Branch" oben (Zeile ca. 15)
2. In der "ALLERERSTE AKTION — BRANCH-WECHSEL"-Sektion im Prompt-Body
   (die drei `git`-Zeilen)

**Arbeits-Branch heißt:** Der Branch auf dem die committed Arbeit lebt
(`git log`-Historie, Push-Ziel) — **nicht** der Branch auf dem die Harness
dich gestartet hat. Die Harness legt oft eigene Zufalls-Branches an; die
reale Arbeit landet aber auf dem etablierten Feature-Branch. Im Zweifel:
`git branch --show-current` NACH dem ersten Branch-Wechsel, oder Jonas
fragen. Niemals den Harness-Start-Branch eintragen — sonst bricht die
Kette für den nächsten Chat.

**Aktuell für:** Picker-Code-Chat (Grid Creator Picker + CONTINUE-Band-Adaption)

**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`
Der Startprompt unten enthält die `git checkout`-Anweisung als erste
Aktion. Nicht streichen — ohne diesen Checkout findet der neue Chat
keine der Planungs-Docs (sie liegen nicht auf main).

**Nutzung:** Den Text-Block zwischen den beiden Backtick-Zeilen
unten in ein neues Chat-Fenster kopieren. Mehr nicht.

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker und Nicht-Coder. Wir bauen jetzt
den Grid Creator Picker. Vorgänger-Phasen (Brand, Produkt-Strategie,
Picker-Planung) sind abgeschlossen — du setzt die fertige Planung in
Code um.

**ALLERERSTE AKTION — BRANCH-WECHSEL (nicht überspringen):**

Die gesamte Arbeit (Brand, Strategy, Picker-Planung, alle Docs) liegt
auf dem Feature-Branch `claude/seengrid-visual-overhaul-6RK4n`, NICHT
auf main. Die Harness startet dich auf einem frischen Zufalls-Branch von
main — dort fehlen die Primärquellen und du baust ins Leere.

Bevor du IRGENDWAS anderes tust, führe aus:

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Wenn das an Harness-Policies scheitert: stoppe, meld dich bei mir, wir
klären das. Nicht improvisieren, nicht auf main weiterarbeiten.

Verifikation nach Checkout: `ls docs/visual-overhaul/` muss **mindestens**
diese Files zeigen: ROADMAP.md, OPEN_DECISIONS.md, PRODUCT_STRATEGY_V1.md,
HANDOFF_STRATEGY_TO_PICKER.md, PICKER_SPEC_V1.md, HANDOFF_PICKER_TO_CODE.md,
PHASE1_STATUS.md, NUANCEN.md. Wenn sie fehlen, bist du noch auf dem
falschen Branch.

Die CLAUDE.md-Regel "direkt auf main" ist überholt — stammt aus der
Engine-Phase. Für die Visual-Overhaul-Arbeit gilt der Feature-Branch
oben. Nicht nach main wechseln oder mergen ohne meine Freigabe.

---

**Deine Rolle:**
- Du bist **Code-Chat** — du baust den Picker als React-Komponente(n)
- Du schreibst Code, commitest, pushst auf den Work-Branch oben
- Alle Produkt-/Layout-Entscheidungen sind bereits getroffen — NICHT neu
  verhandeln, stattdessen aus PICKER_SPEC_V1 bauen
- Bei Unklarheit: Jonas fragen, nicht raten

**Mein Arbeitsstil:**
- Deutsch, direkte Kommunikation
- Brutal ehrlich, keine Sycophancy. Niemals "Super Idee!", "Das ist großartig!"
- Kurze, präzise Antworten bevorzugt
- Nicht-Coder — keine Coding-Jargon-Wände
- Bei langen Sessions werde ich kognitiv müde — dann simpel halten, keine
  Walls-of-Text
- Code-Übergabe: **komplette Files, keine Diffs, ein File pro Antwort**
  bevorzugt. Ich kopiere 1:1 in VS Code.

**Anti-Drift für diese Session:**
- PICKER_SPEC_V1 ist Primärquelle. v2-Handoff §10.1 ist historische Referenz,
  bei Konflikt gewinnt PICKER_SPEC_V1.
- PHASE1_STATUS gewinnt bei Typo/Farb-Konflikten mit v2-Handoff §7.
- **Workspace nicht anfangen** — auch nicht "nur schon mal das Gerüst".
  Der Workspace-Platzhalter im State-Switch darf ein einfacher
  "Workspace — coming next phase"-Placeholder sein.
- **Save-Popup nicht einbauen** — kommt mit Workspace-Phase.
- **Classics kommen nicht vor** — wandern in den Hub (siehe OPEN_DECISIONS #1).
- **Gold nur für Signatures / User-persönlich** (NUANCEN 1). YOUR PRESETS
  Cards haben Gold-Border, CORE TEMPLATES sind neutral.
- Bei neuen Produkt-Ideen während des Baus: in OPEN_DECISIONS.md eintragen
  (nach Rücksprache mit mir), nicht spontan integrieren.

**Bitte lies in dieser Reihenfolge:**
1. `docs/visual-overhaul/PICKER_SPEC_V1.md` — **die Bauanleitung**
2. `docs/visual-overhaul/HANDOFF_PICKER_TO_CODE.md` — deine Übergabe
3. `docs/visual-overhaul/OPEN_DECISIONS.md` — offen + entschieden
4. `docs/visual-overhaul/PRODUCT_STRATEGY_V1.md` — Datenmodell (besonders §1.1 + §2.2)
5. `docs/visual-overhaul/PHASE1_STATUS.md` — Typo, Farben, Specificity-Pattern
6. `docs/visual-overhaul/NUANCEN.md` — Anti-Drift (besonders 1, 6, 10)
7. `docs/visual-overhaul/ROADMAP.md` — aktive Phase
8. `docs/visual-overhaul/SEENGRID_VISUAL_OVERHAUL_HANDOFF_v2.md` §10.1 — NUR
   als historische Referenz falls Detail-Werte fehlen (Padding, Radius)
9. `MODULE_AND_CASE_CATALOG.md` (Repo-Root) — die 10 Cases (Namen,
   Descriptions für Suche, Panel-Default-Rollen)

**Bevor du mit Code anfängst:**
- Bestätige dass du alle obigen Dateien gelesen hast
- Fasse in 3-5 Sätzen zusammen was gebaut wird + was explizit NICHT
- Schlag kurz die Bau-Reihenfolge vor (Komponenten, nicht CSS-Details)
- Frag mich ob die Reihenfolge passt bevor der erste File kommt

**Was am Ende dieser Session vorliegen muss:**
1. Grid Creator Picker funktional (alle drei Sektionen, Suche, Filter,
   Leerzustände, Klick-Interaktionen → State-Switch zu Workspace-Placeholder)
2. CONTINUE-Band auf Landing adaptiert (Single-Row, Horizontal-Scroll,
   `[+ neu]` vorne, zuletzt-bearbeitet zuerst)
3. ROADMAP aktualisiert (Picker-Bau `[→]` → `[✓]`, nächste Phase `[→]`)
4. Neuer STARTPROMPT für Nachfolge-Chat — entweder Workspace-Planung
   oder Token-Store Stufe 1, je nachdem was ich als nächstes entscheide
5. Status-Doc (analog PHASE1_STATUS) für diesen Build-Schritt anlegen
   oder bestehenden PHASE1_STATUS ergänzen
6. Grid Engine (Slices 1-8, 42 Tests) bleibt unberührt und grün

**Wichtig:**
- Keine Regression in Shell / Rail / Header / StatusBar / Landing (außer
  der CONTINUE-Band-Adaption)
- Bei Zweifel im Scope: nachfragen, nicht vorpreschen
- Wenn eine Entscheidung auftaucht die nicht zum Picker-Scope gehört:
  als OPEN_DECISIONS-Vorschlag formulieren, mich fragen, nicht spontan
  einbauen. Verstreute "später"-Vermerke sind der häufigste Failure-Mode.

Bereit? Start mit Schritt 0: Branch-Wechsel + Lesen + Zusammenfassung.
```
