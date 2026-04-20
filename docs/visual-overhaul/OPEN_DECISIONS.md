# SeenGrid — Open Decisions

**Zweck:** Eine zentrale Liste ALLER offenen Produkt-/Design-Entscheidungen. Verhindert verstreute "für später"-Vermerke über viele Dokumente.

**Regel:** Jeder neue Planungs-Chat liest **diese Datei** zuerst. Neue Offen-Punkte werden hier eingetragen, nicht in Handoff-Dokumenten vergraben. Entschiedene Punkte werden mit Entscheidung + Datum + Link zur Quelle aktualisiert.

**Pflicht-Lektüre für:** Alle Planungs-Chats, Brand-Chats, Code-Chats die Architektur-Entscheidungen treffen.

---

## Format jedes Eintrags

- **Titel** (was ist zu entscheiden)
- **Kontext** (warum ist es offen)
- **Abhängig von** (welche Phase / welches Feature)
- **Wann entscheiden** (welche Phase oder Trigger)
- **Status** (offen / entschieden / verworfen)

---

## Offene Entscheidungen

### 4. Projekt-Overview-Layout

**Kontext:** Wenn ein User auf "Tokio-Kurzfilm" klickt — was sieht er?

**Mögliche Varianten:**
- Separate Projekt-Seite (eigene Page in der Rail-Logik)
- Overlay/Panel über bestehender Page
- Automatischer Wiedereinstieg in den zuletzt bearbeiteten Zustand (z.B. Grid Creator mit letztem Preset geladen), kein dedizierter Projekt-Overview
- Hybrid

**Abhängig von:** Welche Projekt-eigenen Inhalte wann gebaut werden (Szenenplan, Shot Board, Notizen). Aktuell hat ein Projekt nur Library-Referenzen — da ist ein vollständiger Overview eventuell overkill. Sobald Szenenplan + Board existieren, braucht das Projekt einen echten Zuhause-Bildschirm.

**Wann entscheiden:** Wenn Filmsystem-Phase oder Shot-Board-Phase ansteht. Vorher ist die Entscheidung verfrüht (würde spekulieren über noch nicht existierende Features).

**Status:** offen

---

### 5. LIB-Tab Aufbau und Funktionsumfang

**Kontext:** PRODUCT_STRATEGY_V1 §4.2 definiert LIB als Management-Ort für alle Library-Assets (Signatures, Grid-Presets, Filmlooks, später Prompts/Szenen-Tokens). Der Tab-Slot existiert bereits als Artefakt in der Rail, hat aber keine Funktion.

**Offen:**
- Genauer Aufbau (eine Liste mit Tabs / separate Sub-Pages / einheitliche Table-View)
- Welche Aktionen konkret in v1 (nur Löschen/Umbenennen? Oder auch Tagging, Bulk-Aktionen?)
- Wann wird LIB gebaut? (Nach Picker? Nach Workspace? Mit Token-Store Stufe 1?)

**Abhängig von:** Menge an Library-Assets die beim Build-Zeitpunkt existieren. Solange User nur 3-5 Signatures und 0 Presets haben, ist LIB niedrig-priorisiert.

**Wann entscheiden:** Eigene Phase oder integriert in Token-Store Stufe 1 / 2

**Status:** offen

---

### 6. Tags für Library-Assets (Ja/Nein + wenn ja, Details)

**Kontext:** PRODUCT_STRATEGY_V1 erwähnt Tags als mögliche spätere Feature für Filterbarkeit in LIB. Nicht jetzt, aber auf dem Radar.

**Abhängig von:** Echte Nutzung — erst wenn User-Feedback zeigt dass Ordnung gebraucht wird

**Wann entscheiden:** Nach erstem realem Nutzer-Test, nicht vorher

**Status:** offen / niedrig priorisiert

---

### 10. Workspace Min-Width-Message (Responsive unter 1100px)

**Kontext:** Der Grid Creator Workspace verlangt minimal ~1100px (Rail 88 + Context 260 + Canvas-flex + Inspector 320 + Scrollbar). Unter dieser Breite bricht das Layout. v1 akzeptiert das brutal — kein Min-Width-Check, keine Warn-Page. Pro-Tool, kein Tablet-Ziel.

**Offen:** Soll eine spätere Phase eine Min-Width-Message nachrüsten? Formen:
- Overlay `workspace requires ≥1100px width — resize your window` (volle Abdeckung)
- Inline-Banner oben: `your window is too narrow for the workspace`
- Gar nichts (bleibt bei v1-Verhalten)

**Abhängig von:** Realer Nutzer-Feedback (bricht jemand tatsächlich auf schmalem Screen?)

**Wann entscheiden:** Nach erstem echten Workspace-Nutzungs-Feedback. Nicht proaktiv.

**Status:** offen / niedrig priorisiert

---

### 8. Hub-Prompt-Customization + Auto-Einpflege-Pipeline (überholungsbedürftig)

**Kontext:** In `docs/archive/VISUAL_OVERHAUL_PLAN.md` ist ein altes Konzept dokumentiert:
- Slot-System mit drei Slot-Typen (Text-Slot / Bild-Hinweis / Text+Bild)
- Drei Beispiel-Slots: `[CHARACTER]`, `[SETTING]`, `[STYLE]`
- Auto-Pipeline: Claude analysiert hochgeladene Prompts, erkennt austauschbare Stellen, setzt Slot-Klammern, weist Kategorie+Tags zu, erkennt Bild-Referenz-Hinweise. Jonas reviewed nur.

Das Konzept stammt aus der Pre-JSON-Output-Ära und ist überholt:
- Drei Slot-Typen reichen definitiv nicht
- Multi-Panel-Sheets brauchen Per-Panel-Inputs (vgl. `panel_fields` aus `MODULE_AND_CASE_CATALOG.md` für Custom-Builder-Cases) — das fehlt im alten Slot-System komplett
- Classics (vom Picker in den Hub gewandert, siehe #1) sind genau solche Multi-Panel-Sheets — ohne Per-Panel-Inputs nicht sinnvoll bedienbar

**Offen — neu zu konzipieren:**
- Welcher Customization-Mechanismus für Hub-Prompts insgesamt (Trendy, Classics, Community)?
- Erweiterung des Slot-Systems oder Übernahme des `panel_fields`-Mechanismus aus der Engine oder Hybrid?
- Wie funktioniert die Auto-Einpflege-Pipeline für die ~1500 Community-Prompts? Welche Erkennungs-Regeln, welcher Output, welcher Review-Flow?
- Was passiert mit Prompts wo Per-Panel-Inputs keinen Sinn machen (Single-Image-Prompts)? Pipeline muss differenzieren.

**ToDo:**
- Eigene Hub-Architektur-Session: konsolidierter Customization-Mechanismus + Pipeline-Spec für die ~1500 Prompts
- Davor: Hub-Phase darf nicht mit dem alten 3-Slot-System gebaut werden

**Abhängig von:** Hub-Phase (noch nicht geplant)

**Wann entscheiden:** Vor Hub-Bau. Eigene Konzept-Session nötig.

**Status:** offen — überholungsbedürftig

---

### 11. FROM SCRATCH deferred bis Engine Free-Mode (Post-v1-Phase)

**Kontext:** Die Grid-Engine ist heute **case-gebunden** — Compiler, `panelRoleStrategy`, `panel_fields`-Schema, Module-Kompatibilität hängen alle an einem konkreten `caseId`. Ein echtes "from scratch" bräuchte einen Engine-Free-Mode (Panels ohne Case-Schema, freie Modul-Kombination, generischer Compile-Pfad). Das existiert nicht.

**Aus Workspace-Part-B-Session (2026-04-20):** Die FROM-SCRATCH-Sektion im Picker wird in v1 **disabled + `COMING SOON`-Label** ausgeliefert (analog Coming-Pages-Pattern, NUANCEN 4). Ein Fallback auf `character_angle_study` wurde diskutiert und verworfen — das hätte die Produkt-Separation zwischen CORE TEMPLATES (schnelle Vorlagen) und FROM SCRATCH (echte Freiheit) gebrochen und eine Feature-Versprechung ohne Deckung geliefert.

**Offen:**
- Wie sieht der Engine-Free-Mode konkret aus (case-loses Panel-Array, minimaler generischer Compiler, universelle Modul-Liste)?
- Oder andere Architektur: ein "Blank"-Case mit generischem `panel_fields` als Schema-Eintrag?
- Welche Module sind im Free-Mode erlaubt (alle? minus den case-spezifischen wie `face_reference`)?

**Abhängig von:** Engine-Erweiterung Post-v1. Kein Workspace-Blocker — CORE TEMPLATES + YOUR PRESETS decken den v1-Nutzer ab.

**Wann entscheiden:** Eigene Engine-Phase nach v1-Launch, wenn reale Nutzung zeigt ob echte Free-Mode-Freiheit gebraucht wird oder ob die 10 Cases reichen.

**Status:** offen / deferred Post-v1

---

### 9. Avatar-Platzierung global

**Kontext:** Durch die ShellHeader-Suppression auf Home (Landing-Redesign 2026-04-18) ist auf der Landing-Page kein User-Avatar sichtbar. Auf anderen Pages bleibt der ShellHeader erhalten, dort existiert aktuell auch kein Avatar. Der Masthead führt bewusst keinen Avatar — Teal-Avatar rechts würde den editorialen Mono-Rhythmus brechen, und Account-Actions finden auf der Landing ohnehin nicht statt.

**Ergebnis (Landing-Redesign-Session):** Auf Home kein User-Avatar sichtbar, weil ShellHeader dort unterdrückt und Masthead ihn bewusst nicht führt. Avatar-Platzierung global TBD (Kandidat: Rail bottom, analog Linear/Figma).

**Abhängig von:** Account-/Auth-Phase (noch nicht geplant). Solange kein Login-Flow existiert, ist ein Avatar reine Deko.

**Wann entscheiden:** Wenn Account-System gebaut wird oder Workspace-Phase explizit Multi-User-Kontext aufnimmt.

**Status:** offen

---

## Entschiedene Punkte

### 1. Classics-Verortung (Grid Creator Picker vs. Prompt Hub) — ENTSCHIEDEN

**Entscheidung (2026-04-18, Picker-Planungs-Session):**
Classics wandern komplett in den **Prompt Hub** als **separate, klar erkennbare Sektion** (nicht vermischt mit Trendy/Community-Prompts). Classics werden **nicht im Grid Creator Picker** angezeigt.

**Begründung:** Jonas' ursprüngliche Intuition (aus einer früheren Session erinnert, jetzt bestätigt): Classics sind erprobte erweiterte Alternativ-Sheets für bestimmte Use-Cases (z.B. andere Character Sheets, technische Bauplan-Erstellung von Szenen). Sie sind keine Premium-/Magic-Prompts (deshalb auch kein Gold, NUANCEN-konform). Im Picker würden sie den Fokus auf Custom Builder + eigene Presets verwässern. Im Hub stehen sie als kuratierte Alternativen neben Community und Trendy.

**Folge für den Picker:**
- CLASSICS-Sektion aus dem Picker gestrichen
- Picker hat nur noch drei Sektionen: YOUR PRESETS / CORE TEMPLATES / START FROM SCRATCH
- Im Picker unter CORE TEMPLATES ein Mini-Hinweis "more templates in Prompt Hub →" (Wortlaut TBD)

**Folge für den Hub (spätere Phase):**
- Classics erhalten eigene Sektion, visuell von Community/Trendy getrennt
- Customization-Mechanismus für Hub-Prompts ist offen (siehe #8)

**Quelle:** `docs/visual-overhaul/PICKER_SPEC_V1.md` §4, §12

---

### 2. Hero-Verhalten auf Landing (dauerhaft vs. Splash-Pre-Page) — ENTSCHIEDEN

**Entscheidung (2026-04-18, Landing-Redesign-Session):**
**Weder A noch B** — beide Varianten aus der ursprünglichen Liste (dauerhafter Hero vs. Splash-Pre-Page) wurden verworfen. Stattdessen: **Editorial Masthead** statt zentriertem Hero.

- Hero-Bereich mit 72px-Wordmark + 200px-Logo-Block entfällt komplett auf der Landing
- Stattdessen schmaler Masthead (~75px) mit 24px-Wordmark + Claim + Session-Metadata rechts
- Brand-Präsenz durch Editorial-Layout + kuratierte Discover-Cards + Metadata-Signal, nicht durch Raumverbrauch
- Keine Splash-Pre-Page (generisches SaaS-Muster)
- ShellHeader wird auf Home via Conditional in `App.jsx` unterdrückt — der Masthead ist die einzige Kopfzeile der Landing

**Begründung:** Der ursprüngliche Hero fraß den Fold — bei 1080p war unter Logo-Block + Wordmark + 80px-Abstand nur noch CONTINUE sichtbar. Die naive Lösung wäre ein größerer Hero (aktueller Zustand) oder eine Pre-Landing mit Marketing-Splash. Beide falsch. Die Profi-Lösung ist editorial: Zeitungskopfzeile / DAW-Header-Register. Brand durch Content-Qualität (Discover-Mood-Cards mit Filmmaker-Sprache) + Session-Signal (Metadata rechts), nicht durch Splash.

**Folge für NUANCEN 11:** Regel zu Brand-Präsenz wurde neu gefasst — siehe `NUANCEN.md` §11.

**Folge für Avatar-Frage:** Auf Home kein Avatar sichtbar (ShellHeader unterdrückt, Masthead bewusst ohne Avatar). Globale Avatar-Platzierung bleibt offen, siehe #9.

**Quelle:** `docs/visual-overhaul/LANDING_REDESIGN_STATUS.md`

---

### 7. Projekt-Wechsel-UI — ENTSCHIEDEN

**Entscheidung (2026-04-19, Workspace-Planungs-Session):**
Projekt-Wechsel via **Inline-Dropdown am ShellHeader-Projekt-Label**. Nicht via Projekt-Overview-Page (diese bleibt optionaler Folge-Klick aus dem Dropdown-Footer).

**Mechanik:**
- Projekt-Label sitzt im ShellHeader neben dem Page-Title: `grid creator · tokio-kurzfilm ▾` (lowercase, Bullet-Trenner via `::before` analog Masthead)
- Klick auf Label öffnet Inline-Dropdown mit: `[no project]` + Projekt-Liste (aktuelles Projekt mit `✓`) + `[+ new project]` + Footer-Eintrag `open project page →`
- `[no project]` wechselt in kontextfreien Modus (Library-only)
- `[+ new project]` öffnet Inline-Input für Projektnamen
- `open project page →` führt zur Projekt-Overview (Placeholder bis diese gebaut ist, siehe #4)
- Keyboard: Escape schließt, Arrow-Keys navigieren, Enter = select
- Kontextfrei-Zustand: Label zeigt `no project ▾`

**Begründung:** Projekt-Overview-Page existiert nicht und wäre ein Umweg (zwei Klicks + Page-Load). Dropdown ist Quick-Switch-Pattern. `open project page →` bleibt als Footer-Link für Management-Use-Cases.

**Folge:** Die dedizierte Projekt-Overview (OPEN_DECISIONS #4) bleibt offen, ist aber nicht Blocker für Projekt-Wechsel im Workspace.

**Quelle:** `docs/visual-overhaul/WORKSPACE_SPEC_V1.md` §2.2

---

### 3. CONTINUE-Band Kapazität / Überlauf-Verhalten — ENTSCHIEDEN

**Entscheidung (2026-04-18, Picker-Planungs-Session):**
**Variante A** — Single-Row mit horizontalem Scroll.

- Eine Reihe, immer
- `[+ neu]`-Slot ganz vorne (links)
- Projekte daneben, **zuletzt bearbeitet zuerst** (links nach rechts absteigend nach Modified-Timestamp)
- Bei Überlauf: horizontal scrollen/swipen
- Keine Abhängigkeit zu LIB-Tab — funktioniert sofort
- Wenn LIB später gebaut wird: "show all"-Link rechts optional nachrüstbar

**Begründung:** CONTINUE-Band = Wiedereinstieg-Schnellzugriff, kein Archiv. Konstante Höhe (kein Layout-Wachstum wenn Projekte zunehmen). Keine Dependency auf noch-nicht-existierende LIB-Page.

**Folge für die Landing-Page (Code-Umsetzung):**
- Container-CSS wechselt von `grid auto-fit` zu `flex-row nowrap` + Horizontal-Scroll
- Scrollbar-Styling gemäß `globals.css`-Pattern (custom, nicht Browser-Default)
- Landing-Redesign-Session (2026-04-18) hat die Card-Dimensionen zusätzlich verkleinert (130×66px statt 260×200px) und einen Gradient-Fade rechts als Scroll-Affordance ergänzt.

**Quelle:** `docs/visual-overhaul/PICKER_SPEC_V1.md` §9, `docs/visual-overhaul/LANDING_REDESIGN_STATUS.md`

---

## Regel für neue Einträge

Wenn in einem Chat eine Entscheidung auftaucht die **nicht jetzt getroffen werden kann oder soll**:

1. Sofort hier eintragen (nicht in andere Dokumente als "später")
2. Format strikt befolgen (Titel / Kontext / Abhängig von / Wann entscheiden / Status)
3. Im Ziel-Dokument nur kurz vermerken: "siehe OPEN_DECISIONS #N"

So bleibt die Liste die **einzige Quelle der Wahrheit** für offene Punkte.

---

**Ende OPEN_DECISIONS.**
