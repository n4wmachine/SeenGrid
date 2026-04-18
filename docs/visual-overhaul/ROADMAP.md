# SeenGrid Visual Overhaul — Roadmap

**Stand:** 2026-04-18
**Aktive Phase:** Landing-Redesign (Typografie + Layout-Konsistenz)

---

## Phasen-Sequenz

```
[✓] Phase 1: Foundation (Shell + Landing + Rail) ......... fertig 2026-04-17
[✓] Brand-Session: Schrift + Landing-Atmosphäre .......... fertig 2026-04-17
[✓] Produkt-Strategie: Projekte + Grid-Presets + Continue-Logik ... fertig 2026-04-18
[✓] Picker-Planung: Grid Creator Picker (Spec + Entscheidungen) ... fertig 2026-04-18
[✓] Picker-Bau: Grid Creator Picker + CONTINUE-Band-Adaption .... fertig 2026-04-18
[→] Landing-Redesign: Typografie + Layout-Konsistenz ....  AKTIV
[ ] Workspace-Planung: Spec für Grid Creator Workspace
[ ] Workspace-Bau: Grid Creator Workspace (3-Spalten + Bars) .. größter Brocken
[ ] Token-Store Stufe 1: SeenLab schreibt, Grid Creator liest
[ ] SeenLab Visual-Update (Chips → Kacheln, 3-Spalten)
[ ] LIB-Tab: Library-Management-Page
[ ] Coming-Pages finalisieren (Film, Board, Crop, Rev, Kit)
[ ] Legacy-Tab-Header entfernen (PAGE_TO_TAB Bridge raus)
```

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

**Workspace**
Grid Creator Edit-Modus. 3-Spalten-Layout (Case Context | Canvas | Inspector) + Full-Width Preview-Strip + Signatures-Bar + Output-Bar. Größter Bau-Block der Phase. Integriert auch: Projekt-Kontext im Header (siehe PRODUCT_STRATEGY_V1 §7).

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
