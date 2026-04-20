# SeenGrid Visual Overhaul — Roadmap

**Stand:** 2026-04-20
**Aktive Phase:** Workspace-Bau Part C (Bugfixes + Bars + Save + Docs)

---

## Phasen-Sequenz

```
[✓] Phase 1: Foundation (Shell + Landing + Rail) ......... fertig 2026-04-17
[✓] Brand-Session: Schrift + Landing-Atmosphäre .......... fertig 2026-04-17
[✓] Produkt-Strategie: Projekte + Grid-Presets + Continue-Logik ... fertig 2026-04-18
[✓] Picker-Planung: Grid Creator Picker (Spec + Entscheidungen) ... fertig 2026-04-18
[✓] Picker-Bau: Grid Creator Picker + CONTINUE-Band-Adaption .... fertig 2026-04-18
[✓] Landing-Redesign: Masthead-Composition .......................fertig 2026-04-18
[✓] Workspace-Planung: Spec für Grid Creator Workspace ........... fertig 2026-04-19
[✓] Workspace-Bau Part A: Foundation + Infra .................. fertig 2026-04-19
[✓] Workspace-Bau Part B: Workspace-Parent + 3 Spalten ........ fertig 2026-04-20
[→] Workspace-Bau Part C: Bugfixes + Bars + Save + Docs ....... AKTIV
[ ] Engine-Free-Mode-Planung: Spec für case-losen Builder (Konzept-Session)
[ ] Engine-Free-Mode-Bau: Refactor Engine auf case-agnostisch (4-6h Code-Session)
[ ] Token-Store Stufe 1: SeenLab schreibt, Grid Creator liest
[ ] SeenLab Visual-Update (Chips → Kacheln, 3-Spalten)
[ ] SeenFrame Visual-Update
[ ] UX-Polish-Pass auf Grid Creator + Landing + Picker
[ ] LIB-Tab: Library-Management-Page
[ ] Coming-Pages finalisieren (Film, Board, Crop, Rev, Kit)
[ ] Legacy-Tab-Header entfernen (PAGE_TO_TAB Bridge raus)
[ ] Case-Build-Out-Phase: neue Cases pro Session (1-2 Cases + NanoBanana-Tests)
```

**Sequenz-Logik (2026-04-20 nachgeschärft):**
1. Workspace-Bau Part C schließt den **case-zentrierten** v1-Workspace ab.
2. **Engine-Free-Mode** kommt **vor** Token-Store/SeenLab/etc. — weil der Refactor die Case-Interfaces ändert und sonst alle später gebauten Konsumenten (Token-Store-Links, LookLab-Integration) nachgezogen werden müssten.
3. SeenLab/SeenFrame/Polish kommen danach.
4. **Case-Build-Out** läuft als eigene fortlaufende Phase mit separaten Sessions pro 1-2 neuen Cases — inkl. Jonas' NanoBanana-Validierung. Keine Case-Erweiterung im Workspace-Bau oder Engine-Refactor.

---

## Was kommt nach der aktiven Phase

**Nach Picker-Bau:** Workspace-Planung, Workspace-Bau, Token-Store.

**Offene Detail-Entscheidungen** leben zentral in `OPEN_DECISIONS.md` statt verstreuter "für später"-Vermerke in einzelnen Dokumenten. Jede Phase prüft dort welche Punkte für sie relevant sind.

**Reihenfolge ist nicht in Stein gemeißelt** — z.B. könnte SeenLab Visual-Update vorgezogen werden wenn Token-Store gebraucht wird. Aktive Phase wird hier markiert.

---

## Wer trifft welche Entscheidungen

- **Architektur** (Komponenten-Struktur, Routing, State-Management) → Spec + NUANCEN, nicht neu verhandeln
- **Brand** (Schrift, Farben, visuelle Atmosphäre) → Brand-Session (abgeschlossen)
- **Produkt-Konzept** (Projekte, Presets, Continue-Logik) → Produkt-Strategie-Session (abgeschlossen)
- **Picker-Layout** (Sektionen, Card-Pattern, Adaptivität) → Picker-Planungs-Phase (abgeschlossen)
- **Implementation** (CSS-Werte, JS-Logik, kleine Layout-Details) → Code-Chats
- **Sequenz** (welche Phase wann) → Jonas + aktiver Planungs-Chat

---

## Was tun wenn ein Chat ratlos ist

1. `OPEN_DECISIONS.md` lesen (alle offenen Entscheidungen zentral)
2. `PRODUCT_STRATEGY_V1.md` lesen (finale Produkt-Entscheidungen)
3. `PICKER_SPEC_V1.md` lesen (finale Picker-Entscheidungen)
4. `PHASE1_STATUS.md` lesen (was ist technisch Stand)
5. Diese Roadmap lesen (du bist hier)
6. Phasen-Handoff lesen (`HANDOFF_*_TO_*.md`, falls für aktive Phase vorhanden)
7. `NUANCEN.md` lesen (Anti-Drift)
8. Erst dann fragen oder eine Annahme treffen

---

## Pflege dieser Roadmap

**Wer aktualisiert:** Der Code-Chat am Ende seiner Phase. Eine Zeile umsetzen ([→] zu [✓] für die abgeschlossene Phase, [ ] zu [→] für die nächste). Stand-Datum aktualisieren. Eintrag committen + pushen.

**Wer NICHT aktualisiert:** Planungs-Chats, Jonas selbst (es sei denn manuelle Korrektur nötig).

---

## Konvention: STARTPROMPT.md

Es gibt **eine** `STARTPROMPT.md` im `docs/visual-overhaul/`-Ordner. Sie enthält immer den Startprompt für den **nächsten** zu startenden Chat. Jeder Chat überschreibt sie am Ende seiner Session mit dem Startprompt für seinen Nachfolger. Historische Versionen liegen in git-log, nicht separat im Repo. Keine versionierten Kopien (`STARTPROMPT_PICKER_*.md`, `STARTPROMPT_BRAND_*.md`, etc.).

Handoff-Docs (`HANDOFF_*_TO_*.md`) bleiben versioniert — sie sind adressierte Briefe an spätere Phasen und können nachträglich gelesen werden.

---

## Phasen-Definitionen (Kurz)

**Phase 1: Foundation**
Shell-Struktur (Rail + Header + StatusBar), Landing-Page mit den drei Bändern (Continue/Quick Start/Discover), Routing, Page-Meta-Context, Coming-Page-Placeholder. Status: Technisch fertig, visuell unbefriedigend → daher Brand-Session.

**Brand-Session**
Schrift-Auswahl + Landing-Atmosphäre. Behebt die visuelle Unbefriedigung der Phase 1 bevor weitere Komponenten draufgebaut werden. Beinhaltet NICHT: Logo, Slogan, App-Name (separate Brand-Session später).

**Produkt-Strategie: Projekte + Grid-Presets + Continue-Logik**
Konzept-Session, keine Code-Session. Geklärt: Datenmodell (Library + Projekte), Speicher-Mechanik (Flexi-Payload Presets), Projekt-Erstellung (explizit + implizit), Landing Continue-Logik (adaptiv), SeenFrame-Isolation, LIB-Konzept. Ergebnis: `PRODUCT_STRATEGY_V1.md`.

**Picker-Planung**
Konzept-Session, keine Code-Session. Geklärt: Picker-Sektionen (YOUR PRESETS / CORE TEMPLATES / START FROM SCRATCH), Card-Patterns, Suche + Filter, Adaptivität, Leerzustände, CONTINUE-Band-Kapazität (Variante A), Classics-Verortung (wandert in den Hub). Ergebnis: `PICKER_SPEC_V1.md`, `HANDOFF_PICKER_TO_CODE.md`, Updates in `OPEN_DECISIONS.md`.

**Picker-Bau**
Code-Phase. Umsetzung der `PICKER_SPEC_V1.md` plus CONTINUE-Band-Adaption auf der Landing. Workspace nicht Scope.

**Landing-Redesign: Masthead-Composition**
Code-Phase. Ersetzt zentrierten Hero durch editorialen Masthead (~75px), schiebt Discover nach oben als visuellen Anker (150px Mood-Cards), komprimiert Continue auf 130×66px mit Gradient-Fade rechts, Quick Start auf 44px-Utility-Leiste. ShellHeader wird auf Home unterdrückt. Ziel: alles above the fold auf 1080p. Entscheidet OPEN_DECISIONS #2. Ergebnis: `LANDING_REDESIGN_STATUS.md`, NUANCEN 11 neu gefasst.

**Workspace-Planung**
Konzept-Session 2026-04-19. Geklärt: vertikaler Stack (56+52+flex+96+52+32), 3-Spalten-Inhalte, Preview-Strip als Panel-Thumbs (full-width), Signatures-Bar mit Gold-Territorium, Output-Bar mit Copy-Primary + Dim-Warning, Save-as-Preset-Popup (Center-Modal, 4 Checkboxen), Projekt-Dropdown im ShellHeader (OPEN_DECISIONS #7 entschieden), Dim-Advisory (4 Stufen aus Git-History portiert), Panel-Role-Customization (aus `panel_fields`-Schema), Random-Field-Auto-Fill mit Confirm, Back-to-Picker-Element, Toast-System generisch. Ergebnis: `WORKSPACE_SPEC_V1.md` + `HANDOFF_WORKSPACE_TO_CODE.md` + OPEN_DECISIONS #7 geschlossen + NUANCEN 13 korrigiert (4 statt 5 Stufen) + neuer OPEN_DECISIONS-Eintrag #10 (Min-Width-Message).

**Workspace-Bau (3 Parts)**
Code-Phase, aufgeteilt in drei Chats:
- **Part A (fertig 2026-04-19):** Foundation + Infra — Store, Provider, tokens.css, Header-Integration, Picker-Adaption, ConfirmDialog + Toast + useOverflowDetection, signatures.stub, random-Pools, tokenCount, presetStore-Grundstruktur, compiler-Adapter.
- **Part B (fertig 2026-04-20):** Workspace-Parent + 3 Spalten — Workspace.jsx, CaseContext (6 Sektionen), Canvas (SVG-Silhouetten + State-Visuals), Inspector (datengetrieben), FieldRenderer. Bars als Platzhalter. FROM SCRATCH im Picker auf disabled gesetzt (OPEN_DECISIONS #11).
- **Part C (AKTIV):** Bugfixes aus Manual-Test (Role-Dropdown, Fallback-Leak, SVG-Rendering, Inspector-Hints) → Picker-Cases-Scope (nur angle_study aktiv, OPEN_DECISIONS #13) → Output-Bar priorisiert (Live-Prompt sichtbar) → PreviewStrip → SignaturesBar → ModuleToolbar → SavePresetModal → ToastProvider-Wire → presetStore-Erweiterung → finale Docs.
Grid Engine (42 Tests, Slices 1-8) bleibt unberührt.

**Engine-Free-Mode-Planung + Bau**
Konzept-Session + Code-Session. Refactor der case-zentrierten Engine (OPEN_DECISIONS #12, NUANCEN 14) zu einem case-agnostischen Builder: case-loser Panel-Container, generischer Compiler, universelle Modul-Liste mit Compat-Flags, `panel_fields`-Schema als runtime-loadable File. Unlocks FROM SCRATCH (#11) und legt Fundament für Case-Build-Out. 4-6h Code-Session nach eigener Planungs-Spec.

**Case-Build-Out-Phase**
Fortlaufende Phase nach Engine-Free-Mode. Pro Session 1-2 neue Cases aktivieren:
1. Schema-File + Compiler-Handler in `src/lib/cases/{caseId}/` bauen.
2. NanoBanana-Tests durch Jonas + Iteration.
3. Picker-Card aktivieren, `COMING SOON`-Label entfernen.
Keine Cases im Workspace-Bau oder Engine-Refactor vorziehen — saubere Trennung zwischen Infrastruktur (Engine) und Content (Cases).

**Token-Store Stufe 1**
Zentraler Signature-Store. SeenLab schreibt Signatures, Grid Creator liest sie. Stufe 2 (Hub-Integration) und Stufe 3 (Vision-Features) kommen später. Grid-Presets kommen in Stufe 2 dazu, nicht jetzt.

**SeenLab Visual-Update**
3-Spalten-Layout, Chips zu Kacheln, Such-Input. Aktuelles Tab-Layout wird ersetzt.

**LIB-Tab**
Library-Management-Page für Signatures, Grid-Presets, Filmlooks. Erstellungs-Tools (LookLab/Grid Creator/SeenFrame) bleiben für Erstellen, LIB ist für Managen. Details in OPEN_DECISIONS #5.

**Coming-Pages**
Film, Board, Crop, Rev, Kit als Placeholder-Pages mit "COMING SOON" Mono-Label. Klickbar (nicht disabled).

**Legacy-Removal**
PAGE_TO_TAB Bridge raus, alter Tab-Header weg, alle Pages laufen über neue Routing.
