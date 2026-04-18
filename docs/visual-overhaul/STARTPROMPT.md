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

**Aktuell für:** Workspace-Planung (Planning-Chat, **kein** Code). Erstellt
die Bauanleitung (`WORKSPACE_SPEC_V1.md`) für den anschließenden Code-Chat.

> **Alternative Sequenz:** Wenn Jonas stattdessen Token-Store Stufe 1
> vorziehen will, sagt er das zu Session-Beginn — dann wird dieser Prompt
> ignoriert und wir starten Token-Store-Planung (ebenfalls Planning-Chat).
> Default unten ist Workspace-Planung, weil Workspace im ROADMAP vor
> Token-Store steht und den Save-Flow / Preset-Store blockiert.

**Arbeits-Branch:** `claude/seengrid-visual-overhaul-6RK4n`
Der Startprompt unten enthält die `git checkout`-Anweisung als erste
Aktion. Nicht streichen — ohne diesen Checkout findet der neue Chat
keine der Planungs-Docs (sie liegen nicht auf main).

**Nutzung:** Den Text-Block zwischen den beiden Backtick-Zeilen
unten in ein neues Chat-Fenster kopieren. Mehr nicht.

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker und Nicht-Coder. Picker-Bau ist
durch. Jetzt steht die Workspace-Planung an — das ist eine **Planning-
Session, kein Code**. Ziel: WORKSPACE_SPEC_V1.md schreiben, damit der
nachfolgende Code-Chat den Grid Creator Workspace bauen kann ohne
Layout-Entscheidungen neu zu verhandeln.

**ALLERERSTE AKTION — BRANCH-WECHSEL (nicht überspringen):**

Die gesamte Arbeit (Brand, Strategy, Picker-Spec, Picker-Code, alle Docs)
liegt auf dem Feature-Branch `claude/seengrid-visual-overhaul-6RK4n`,
NICHT auf main. Die Harness startet dich auf einem frischen Zufalls-Branch
von main — dort fehlen die Primärquellen.

Bevor du IRGENDWAS anderes tust, führe aus:

    git fetch origin claude/seengrid-visual-overhaul-6RK4n
    git checkout claude/seengrid-visual-overhaul-6RK4n
    git pull

Wenn das an Harness-Policies scheitert: stoppe, meld dich bei mir, wir
klären das. Nicht improvisieren, nicht auf main weiterarbeiten.

Verifikation nach Checkout: `ls docs/visual-overhaul/` muss u.a. zeigen:
ROADMAP.md, OPEN_DECISIONS.md, PRODUCT_STRATEGY_V1.md, PICKER_SPEC_V1.md,
PICKER_BUILD_STATUS.md, PHASE1_STATUS.md, NUANCEN.md. Wenn sie fehlen,
bist du auf dem falschen Branch.

Die CLAUDE.md-Regel "direkt auf main" ist überholt — stammt aus der
Engine-Phase. Für die Visual-Overhaul-Arbeit gilt der Feature-Branch
oben. Nicht nach main wechseln oder mergen ohne meine Freigabe.

---

**Deine Rolle:**
- Du bist **Planning-Chat** — kein Code, kein Commit auf Komponenten
- Du schreibst Docs: `WORKSPACE_SPEC_V1.md` + `HANDOFF_WORKSPACE_TO_CODE.md`
- Du aktualisierst `OPEN_DECISIONS.md` wenn neue Punkte auftauchen
- Du liest PRODUCT_STRATEGY_V1, NUANCEN, v2-Handoff §10.2–§10.9 genau
- Bei Unklarheit: mich fragen, nicht raten

**Mein Arbeitsstil:**
- Deutsch, direkte Kommunikation
- Brutal ehrlich, keine Sycophancy. Niemals "Super Idee!", "Das ist großartig!"
- Kurze, präzise Antworten bevorzugt
- Nicht-Coder — keine Coding-Jargon-Wände
- Bei langen Sessions werde ich kognitiv müde — dann simpel halten
- Nach der Planung: komplette Files im Nachfolge-Code-Chat, keine Diffs,
  ein File pro Antwort bevorzugt

**Anti-Drift für diese Session:**
- v2-Handoff §10.2–§10.9 ist **historische Referenz** für Werte
  (Padding, Radius, Layout-Flexbox-Struktur), aber überholungsbedürftig
  wo er zu Picker-Phasen-Entscheidungen in Konflikt steht
- NUANCEN 1 (Gold/Teal), NUANCEN 6 (Picker+Workspace sind States,
  keine Tabs), NUANCEN 7 (Preview-Strip Full-Width NICHT in Canvas-Spalte)
  sind **unverhandelbar** — einfach übernehmen
- PRODUCT_STRATEGY §2.2 (Save-as-Preset-Popup Flexi-Payload), §7
  (Projekt-Kontext im Header) sind gesetzt
- Grid Engine (Slices 1-8, 42 Tests) bleibt im Hintergrund — Workspace
  nutzt sie als Compiler-Layer, nicht ersetzen
- Signatures-Bar braucht Token-Store Stufe 1 — falls diese Phase vor
  Workspace-Bau kommen muss, als Dependency in HANDOFF markieren
- Bei neuen Produkt-Ideen: in OPEN_DECISIONS.md eintragen, nicht in
  die Spec schmuggeln

**Bitte lies in dieser Reihenfolge:**
1. `docs/visual-overhaul/PRODUCT_STRATEGY_V1.md` — Datenmodell, Save-Popup, Projekt-Kontext
2. `docs/visual-overhaul/PICKER_SPEC_V1.md` — Picker-Muster (für Konsistenz)
3. `docs/visual-overhaul/PICKER_BUILD_STATUS.md` — was existiert im Code
4. `docs/visual-overhaul/NUANCEN.md` — Anti-Drift (besonders 1, 6, 7, 8)
5. `docs/visual-overhaul/PHASE1_STATUS.md` — Brand-Stand (Typo, Farben, Specificity)
6. `docs/visual-overhaul/SEENGRID_VISUAL_OVERHAUL_HANDOFF_v2.md` §10.2–§10.9 — historische Werte
7. `docs/visual-overhaul/mockup_03_gridcreator_workspace.html` — Mockup
8. `docs/visual-overhaul/OPEN_DECISIONS.md` — offen + entschieden
9. `docs/visual-overhaul/ROADMAP.md` — aktive Phase
10. `MODULE_AND_CASE_CATALOG.md` (Repo-Root) — Module + Case-Felder
11. `src/components/gridcreator/GridCreator.jsx` + `WorkspacePlaceholder.jsx` — aktueller Stub

**Bevor du mit dem Spec anfängst:**
- Bestätige dass du gelesen hast
- Fasse in 5-7 Sätzen zusammen was der Workspace leistet + was NICHT
- Schlag eine Spec-Gliederung vor (analog PICKER_SPEC_V1)
- Frag mich ob die Gliederung passt bevor der erste Spec-Abschnitt kommt

**Was am Ende dieser Session vorliegen muss:**
1. `docs/visual-overhaul/WORKSPACE_SPEC_V1.md` — verbindliche Bauanleitung
2. `docs/visual-overhaul/HANDOFF_WORKSPACE_TO_CODE.md` — Übergabe an Code-Chat
3. `OPEN_DECISIONS.md` aktualisiert (neue offene Punkte, entschiedene verschieben)
4. ROADMAP aktualisiert (Workspace-Planung `[→]` → `[✓]`, Workspace-Bau `[→]`)
5. Neuer STARTPROMPT für den Workspace-Code-Chat
6. **Kein Code** — nur Planning-Artefakte

**Wichtig:**
- Bei Zweifel im Scope (z.B. Module-Toolbar-Verhalten, Inspector-Dynamik,
  Signature-Drag-Logik): als OPEN_DECISIONS-Vorschlag formulieren, mich
  fragen, nicht spontan in die Spec schreiben
- v2-Handoff §10.2 ff. hat viel Detail — nicht 1:1 kopieren, sondern
  durchgehen und abgleichen gegen PRODUCT_STRATEGY-Entscheidungen
- Signatures-Bar und Save-Popup sind abhängig vom Token-Store — in
  der Spec klar markieren welche Teile Token-Store Stufe 1 brauchen

Bereit? Start mit Schritt 0: Branch-Wechsel + Lesen + Zusammenfassung.
```
