# SeenGrid — Grid Creator Workspace Spec V1

**Datum:** 2026-04-19
**Status:** Verbindlich. Bereit für Code-Chat.
**Vorgänger:** PRODUCT_STRATEGY_V1.md, PICKER_SPEC_V1.md, LANDING_REDESIGN_STATUS.md
**Nachfolger:** HANDOFF_WORKSPACE_TO_CODE.md (Übergabe an Code-Chat)
**Gilt nur für:** Grid Creator Workspace-State. Picker-State ist eigene Phase (`PICKER_SPEC_V1.md`).

---

## 0. Zweck

Der Workspace ist der **Edit-State** des Grid Creators. Full-Page-View (kein Modal, kein Split, NUANCEN 6). Der User ist hier nach Picker-Auswahl und arbeitet am Grid — Case-Setup links, Canvas-Preview mittig, Panel-Edit rechts, Preview-Strip unten, Signature-Zugriff unten, Output-Export ganz unten.

---

## 1. Gesamtstruktur (vertikaler Stack)

```
┌──────────────────────────────────────────────────────────────┐
│  ⟨logo⟩  grid creator · tokio-kurzfilm ▾       ⟨meta⟩        │  56 · ShellHeader
├──────────────────────────────────────────────────────────────┤
│  [face_ref] [env_mode] [style_overlay] ... · random · reset  │  52 · Module-Toolbar
├──────────┬───────────────────────────────────────┬───────────┤
│          │                                       │           │
│  CASE    │                                       │ INSPECTOR │
│ CONTEXT  │            CANVAS                     │           │
│  260     │         (flex, zentriert)             │    320    │
│          │                                       │           │
├──────────┴───────────────────────────────────────┴───────────┤
│  PREVIEW · [thumb][thumb][thumb][thumb] →                    │  96 · Preview-Strip
├──────────────────────────────────────────────────────────────┤
│  SIGNATURES · [applied ×] [pinned] [recent] →                │  52 · Signatures-Bar
├──────────────────────────────────────────────────────────────┤
│  [COPY AS JSON] [SAVE AS PRESET]    ~340 tok · ⚠ TINY @2K    │  32 · Output-Bar
└──────────────────────────────────────────────────────────────┘
```

**Stack-Heights (Tokens aus `tokens.css`, bereits vorhanden):**
- Header: `--sg2-header-height: 56px`
- Module-Toolbar: `--sg2-toolbar-height: 52px`
- 3-Spalten-Row: flex (füllt verbleibende Höhe)
- Preview-Strip: `--sg2-preview-height: 96px`
- Signatures-Bar: `--sg2-sigbar-height: 52px`
- Output-Bar: `--sg2-outputbar-height: 32px`

**Spalten-Widths:**
- Rail (global, Shell-Ebene): `--sg2-rail-width: 88px`
- Case Context: `--sg2-context-width: 260px`
- Canvas: `flex: 1`
- Inspector: `--sg2-inspector-width: 320px`

**Kein Collapse der Spalten** — Rail (NUANCEN 3), Case Context, Inspector sind alle fix. Minimum-Viewport-Breite brutal: unter ~1100px bricht Layout ohne Warnmessage (siehe OPEN_DECISIONS "Workspace Min-Width-Message").

**Preview-Strip + Signatures-Bar + Output-Bar sind strikt full-width** unter der 3-Spalten-Row (NUANCEN 7). Niemals in die Canvas-Spalte einbetten.

---

## 2. ShellHeader im Workspace

### 2.1 Layout

```
⟨logo⟩  ← back  ·  grid creator · tokio-kurzfilm ▾       ⟨session-meta⟩
```

- **Logo-Mark** links (bestehend, nicht angefasst)
- **Back-to-Picker-Element** direkt rechts vom Logo: `← choose another template` (Mono 11px, `--sg2-text-tertiary`). Klick → setzt `mode: 'picker'` in `GridCreator.jsx`. Kein Confirm-Dialog in v1 — Grid-State bleibt session-lokal erhalten (siehe §15 Store-Modell), Picker-Rückweg ist harmlos.
- **Page-Title:** `grid creator` (General Sans 13px Medium, `--sg2-text-primary`, lowercase)
- **Bullet-Trenner** via `::before`-Pseudo-Element (analog Masthead)
- **Projekt-Label:** `tokio-kurzfilm ▾` oder `no project ▾` (Mono 11px, `--sg2-text-secondary`, lowercase, ▾-Hint)
- **Session-Meta** rechts (bestehend aus Shell, nicht geändert)

### 2.2 Projekt-Dropdown (entscheidet OPEN_DECISIONS #7)

Klick auf Projekt-Label öffnet Dropdown:

```
┌─────────────────────────────┐
│ [no project]                │  ← kontextfrei-Mode
│ tokio-kurzfilm ✓            │  ← currently active
│ berlin-doku                 │
│ wuerzburg-serie             │
│ ...                         │
│─────────────────────────────│
│ + new project               │
│ open project page →         │  ← Footer-Eintrag
└─────────────────────────────┘
```

- **Aktuelles Projekt:** Checkmark (`✓`) rechts
- **`+ new project`:** öffnet Inline-Input für neuen Projektnamen, Enter = anlegen + selektieren
- **`open project page →`:** führt zu Projekt-Overview (Placeholder bis gebaut, siehe OPEN_DECISIONS #4)
- **`[no project]`:** wechselt in kontextfreien Modus (Library-only)
- Keyboard: Escape schließt Dropdown, Arrow-Keys navigieren, Enter = select

### 2.3 Kein Case-Name im ShellHeader

Der Case lebt in Case Context (§4) + optional als Workspace-PageMeta-Subtitle. Im ShellHeader nicht nochmal führen — wäre dreifach.

---

## 3. Module-Toolbar (52px)

### 3.1 Position

Zwischen ShellHeader und 3-Spalten-Row. Strikt full-width.

### 3.2 Inhalt

```
┌───────────────────────────────────────────────────────────────┐
│  [style_overlay] [face_ref] [env_mode] [forbidden_user] ...   │
│  [wardrobe] [pose] [expression] ...         · random · reset  │
└───────────────────────────────────────────────────────────────┘
```

- **Module-Chips** links, Label-only (Mono 11px), **keine Icons**
- **Alle Module immer sichtbar** in der Toolbar — kein Filtern nach Case-Whitelist
- **Case-Whitelist** (aus `MODULE_AND_CASE_CATALOG.md` Kompatibilitäts-Matrix) bestimmt nur welche Module **pre-aktiviert** sind (Default-Konstellation)
- **User kann jederzeit jedes Modul zuschalten** — Custom-Building/Scratch-Flow verlangt volle Freiheit
- Keine visuelle Unterscheidung zwischen "empfohlen" und "zusätzlich"
- Keine Warnings beim Zuschalten inkompatibler Kombinationen
- **Hart ausgeschlossen** nur bei empirisch toten Kombinationen (siehe CLAUDE.md "Was NICHT gebaut wird" — z.B. Character+World-Merge). Diese sind im Katalog als `—` markiert und in der Toolbar **nicht klickbar** (disabled-State, Tooltip erklärt warum)

### 3.3 Chip-States

| State | Visual |
|---|---|
| inaktiv (togglebar) | neutral Border `--sg2-border-default`, Text `--sg2-text-tertiary` |
| aktiv | Teal-Border `--sg2-border-teal`, Text `--sg2-teal`, BG `--sg2-teal-active-bg` |
| disabled (empirisch tot) | Text `--sg2-text-muted`, cursor `not-allowed`, Tooltip `not compatible with this case` |

### 3.4 Random + Reset (rechts)

Rechts in der Toolbar, visuell vom Module-Block getrennt (z.B. durch `·` oder vertikalen Divider):

- **`random`** — Field-Auto-Fill aller Panels (siehe §11)
- **`reset`** — setzt alle Panels zurück auf Case-Defaults (Module-Aktivierung, Overrides, Panel-Role-Changes, Field-Inhalte). Signatures werden dabei detached. Confirm-Dialog wie Random, Text: `reset will discard all changes on this grid.`

---

## 4. Case Context (Sidebar links, 260px)

### 4.1 Sektionen (in dieser Reihenfolge von oben nach unten)

1. **CASE** — Case-Readout (nicht editierbar)
2. **REFERENCE STATE** — Normalizer-Toggle
3. **DIMENSIONS** — 6×4 Klick-Matrix + Dim-Advisory
4. **PANEL ORIENTATION** — vertical / horizontal / square
5. **FORBIDDEN ELEMENTS** — User-Freitextliste
6. **Modul-globale Settings** — pro aktivem Modul mit globalen Settings eine weitere Sektion (siehe §4.7)

Jede Sektion: Mono-Label oben (`--sg2-text-mono-label`, 0.2em letter-spacing, uppercase, `--sg2-text-tertiary`). Content darunter.

### 4.2 CASE

```
CASE
character angle study
```

- Nur Read-Only-Readout des Case-Namens (lowercase natural language, General Sans 13px/500)
- Kein Edit-Button — Case-Wechsel ist nicht möglich im Workspace (siehe §17.2)
- Optional Sub-Line: Case-Description aus `cases.config.json` (Mono 11px)

### 4.3 REFERENCE STATE (Normalizer)

```
REFERENCE STATE
( ) clean_full_body
(•) needs_normalization   ← default für character_normalizer
```

- Nur sichtbar wenn Case **Normalizer-kompatibel** ist (character-basierte Cases, siehe Kompatibilitäts-Matrix)
- 2 Radio-Options. Wert wirkt als `reference_state` im Compiler-Output
- Default per Case-Config

### 4.4 DIMENSIONS (Klick-Matrix)

```
DIMENSIONS · 6 × 4 · 24 panels

┌──┬──┬──┬──┬──┬──┐
│  │  │  │  │  │  │     ← Hover → Live-Highlight
├──┼──┼──┼──┼──┼──┤        bis zur Hover-Zelle
│  │  │  │  │  │  │        (Google-Docs-Tabellen-Pattern)
├──┼──┼──┼──┼──┼──┤
│  │  │  │  │  │  │
├──┼──┼──┼──┼──┼──┤
│  │  │  │  │  │  │
└──┴──┴──┴──┴──┴──┘

@ 2K  ~341 × 341 px  · STANDARD
@ 4K  ~683 × 683 px  · HIRES
```

- **Matrix:** 6 Cols × 4 Rows (max aus bestehender Engine-Limitierung), jede Zelle ~18×18px
- **Interaktion:** Hover über Zelle (col X, row Y) → Highlight alle Zellen `[0..X][0..Y]` in Teal. Klick = apply
- **Display-Line oben:** zeigt die aktuell gewählte Dim + panel_count live
- **Dim-Advisory darunter:** 2 Zeilen (@ 2K + @ 4K), inline mit Quality-Tag rechts — Details §12
- **Case-Constraint:** manche Cases haben `VALID_PANEL_COUNTS` (z.B. angle_study: `[3, 4, 6, 8]`). Ungültige Zellen werden disabled (cursor `not-allowed`, Tooltip `invalid panel count for this case`)

### 4.5 PANEL ORIENTATION

```
PANEL ORIENTATION
[•] vertical   [ ] horizontal   [ ] square
```

- Segmented-Control (3 Optionen)
- Default per Case-Config
- Wirkt auf alle Panels gleichzeitig (globale Einstellung)
- Bei Änderung: Canvas-Silhouetten reagieren live

### 4.6 FORBIDDEN ELEMENTS

```
FORBIDDEN ELEMENTS
┌─────────────────────────┐
│ no logos                │
│ no text overlays        │
│ ...                     │
└─────────────────────────┘
[+ add forbidden]
```

- Textarea oder Chip-List (ein Eintrag pro Zeile)
- Merged mit Case-Level-Forbiddens + Modul-Level-Forbiddens im Compiler (drei Quellen, wie in Engine bereits implementiert)
- User-Additions erscheinen hier. Case-/Modul-Level-Forbiddens werden nicht geshown (bleiben implizit)

### 4.7 Modul-globale Settings

Pro aktivem Modul mit grid-globalen Settings erscheint eine zusätzliche Sektion **unten** in Case Context (nach FORBIDDEN ELEMENTS). Sektionen verschwinden wenn zugehöriges Modul deaktiviert wird.

**Bekannte Module mit globalen Settings (v1):**

- **`environment_mode`:**
  ```
  ENVIRONMENT
  ( ) inherit from reference
  (•) neutral_studio
  ( ) custom text: [____________]
  ```
- **`style_overlay`:**
  ```
  STYLE OVERLAY
  Token: [____________]
  ```
  (Freitext-Input; später Dropdown aus LookLab-Signatures wenn Token-Store live)
- **`weather_atmosphere`, `wardrobe`, `pose_override`, `expression_emotion`:** haben je nach Case einen "global oder pro Panel"-Modus. Im Workspace: wenn Modul auf "global" geschaltet → Sektion hier. Wenn auf "per-Panel" → Felder erscheinen im Inspector (§6).

Architektur: Die Render-Logik ist **datengetrieben aus dem Modul-Schema**. Neues Modul mit globalen Settings = Schema-Eintrag, Sektion erscheint automatisch.

---

## 5. Canvas (Mitte, flex)

### 5.1 Inhalt

Zentrierte SVG-Panel-Darstellung des Grids. Panels als Silhouetten (bestehend aus Slice 6 der Engine) oder Platzhalter-Rechtecke je nach Case.

- **Grid-Anordnung** entspricht der gewählten Dimensions (rows × cols)
- **Gap zwischen Panels:** 12px (validiert in NanoBanana, NUANCEN 13)
- **Container-Background:** `--sg2-bg-canvas` (bestehender Radial-Gradient)
- **Zentrierung:** horizontal + vertikal im verfügbaren Flex-Raum

### 5.2 Panel-Interaktion (v1 minimal)

| Interaktion | Effekt |
|---|---|
| Klick auf Panel | Selektiert dieses Panel → Inspector lädt Panel-Daten |
| Hover über Panel | Subtle Outline (Teal, `--sg2-border-teal-subtle`) als Affordance |
| (alles andere) | v1 nicht geplant — kein Drag-Reorder, kein Right-Click-Menu |

### 5.3 Panel-Visual-States (nach NUANCEN 2)

Alle States sind **übereinander kombinierbar** — ein Panel kann gleichzeitig selected + signature-applied + override-haben.

| State | Signal |
|---|---|
| Default | Neutral Border `--sg2-border-default`, Silhouette `--sg2-text-tertiary` |
| **Selected** (Inspector aktiv) | Teal-Border `--sg2-border-teal-strong` |
| **Hover** | Teal-Outline `--sg2-border-teal-subtle` (leichter als Selected) |
| **Signature-Applied** | Gold-Border-Tint `--sg2-gold-border` + Gold-Glow `--sg2-gold-glow-subtle` ums ganze Panel (NUANCEN 2) |
| **Override vorhanden** | Gold-Dot oben rechts am Panel (8×8px, `--sg2-gold`), NUANCEN 2 |

### 5.4 Override-Dot-Regel

**Ein einziger Dot für alle Override-Typen** (Dirty-Indicator). Triggert wenn mindestens eins zutrifft:

- Panel-Role weicht vom `panelRoleStrategy`-Default ab
- Environment per-Panel-override gesetzt
- Style-Overlay per-Panel-override gesetzt
- Custom Notes gesetzt
- Weitere Modul-per-Panel-Overrides aktiv

Details sieht der User im Inspector. Kein Zähler, kein Typ-spezifisches Symbol — ein Dot, simple Lese-Regel.

### 5.5 Empty-State

Beim Workspace-Start wird **Panel 1 automatisch selected**. Inspector zeigt Panel-1-Daten.

Wenn User explizit deselektiert (Escape, Close-Button im Inspector, Klick in Canvas-Leerraum außerhalb aller Panels):
- Alle Panel-Border-States gehen auf Default
- Inspector zeigt `no panel selected — click a panel to edit` (Mono, zentriert vertikal)

---

## 6. Inspector (Sidebar rechts, 320px)

### 6.1 Sektionen (von oben nach unten)

1. **Header** — `PANEL N` + Close-Button (×)
2. **ROLE** — Panel-Role-Dropdown (nur bei Structured Cases)
3. **Per-Panel-Overrides** — case-/modul-abhängig
4. **SIGNATURE** — Card mit Gold-Border (wenn applied)
5. **CUSTOM NOTES** — Freitext-Textarea
6. **Reset-Footer** — "reset panel to case-default"

### 6.2 Header

```
PANEL 3              ×
```

- **`PANEL N`:** Mono 11px Uppercase, mit optional Rollen-Hint als zweite Zeile (`PANEL 3 · left profile`)
- **`×`-Button:** Close-Action, Klick → deselect (Panel-Selection weg, Inspector zeigt "no panel selected")

### 6.3 Panel-Role-Dropdown (Structured Cases)

Nur sichtbar wenn das `panel_fields`-Schema des Cases einen Field-Type `role` (oder Äquivalent) hat (z.B. `character_angle_study` mit `view`).

```
ROLE
[ front            ▾ ]   ← Dropdown
```

- Optionen kommen aus dem Case-Schema (`panel_fields.view.options`)
- Strikt: nur vordefinierte Rollen aus Schema (keine UI-Freitext-Option). Neue Rollen → Schema-File erweitern, nicht UI-Input
- **Override-Signal:** wenn Role ≠ Strategy-Default, Badge `overriding global` rechts neben Dropdown (Mono 9px, `--sg2-text-quaternary`) + kleiner ↶-Reset-Button

### 6.4 Per-Panel-Overrides

Pro aktivem Modul mit per-Panel-Option ein Feld. Feld-Typen aus Schema:

| Field-Type | Render-Komponente |
|---|---|
| `role` | Dropdown (strikt, Schema-Optionen) |
| `select` | Dropdown (freie Option-Liste) |
| `text` | Single-line Text-Input |
| `textarea` | Multi-line Textarea |

**Override-State pro Feld:**
- Wenn User-Value ≠ global/default → Badge `overriding global` (Mono 9px) + `↶` Reset-Button am Feld
- Klick auf `↶` → Feld zurück auf global/default (ohne Confirm, einzelnes Feld ist low-risk)

### 6.5 SIGNATURE-Card

```
SIGNATURE
┌─────────────────────────┐
│ ★ prisoners-noir         │  ← Gold-Border
│   deakins · noir         │     (NUANCEN 2: Card = Gold-applied)
│   [detach]               │
└─────────────────────────┘
```

- Nur sichtbar wenn Signature auf Panel-Level applied (Inspector zeigt _per-Panel_ Signature; der bar-level Applied-State gilt grid-weit — siehe §8)
- Gold-Border `--sg2-gold-border`
- Klick auf Card → TODO(looklab-jump): später Signature in LookLab öffnen
- `[detach]`-Link → entfernt Signature von diesem Panel

**v1-Pragma:** Signature-Management primär über Signatures-Bar (§8). Inspector-Signature-Card ist informativ (`read + detach`), nicht Apply-UI. Apply läuft immer über die Bar.

### 6.6 CUSTOM NOTES

```
CUSTOM NOTES
┌─────────────────────────┐
│                         │
│                         │
└─────────────────────────┘
```

- Freitext-Textarea pro Panel
- Optional — User kann leer lassen
- Gefüllter Wert zählt als Override (triggert Gold-Dot am Panel)

### 6.7 Reset-Footer

```
─────────────────────────
[ reset panel to case-default ]
```

- Rollback aller Overrides dieses Panels auf Case-/Strategy-Defaults
- Kein Confirm (ist rückgängig durch erneutes Editieren, nicht destruktiv im Sinne von "Daten weg")

### 6.8 Close-Button-Verhalten (Z3)

Klick auf `×` im Inspector-Header:
- Panel wird deselektiert (Canvas-Selected-Border geht weg)
- Inspector-Spalte bleibt erhalten (kein Collapse, NUANCEN 3 analog)
- Inspector zeigt `no panel selected — click a panel to edit`

### 6.9 Multi-Select: nicht in v1

Nur Single-Select. Shift-Klick / Cmd-Klick haben v1 keinen Effekt. Additiv später.

---

## 7. Preview-Strip (96px, full-width)

### 7.1 Position

Strikt full-width unter der 3-Spalten-Row, über Signatures-Bar. **Niemals in die Canvas-Spalte** (NUANCEN 7).

### 7.2 Inhalt

```
┌──────────────────────────────────────────────────────────────┐
│ PREVIEW  [p1][p2][p3][p4][p5][p6]...→                        │
└──────────────────────────────────────────────────────────────┘
```

- **Label `PREVIEW` links** (Mono 11px, `--sg2-text-tertiary`, uppercase, 0.2em letter-spacing)
- **Panel-Thumbs** horizontal scrollbar — jeder Thumb ~56×78px mit Rollen-Label Mono unter der Silhouette
- **Scroll-Mechanik:** `flex-row nowrap` + `overflow-x: auto` + Custom-Scrollbar, analog Landing-Continue
- **Gradient-Fade rechts** nur bei echtem Overflow (wiederverwende `useOverflowDetection`-Hook aus `src/hooks/useOverflowDetection.js`)
- **Scroll-Snap:** `scroll-snap-type: x proximity` + `scroll-snap-align: start` an jedem Thumb

**Keine redundante Meta** (keine `4×1 · vertical`-Zusatzzeile, keine `PANELS 4`-Zahl — Dimensions sind in Case Context, Panel-Count ebenso)

### 7.3 Thumb-State-Signale

Konsistent mit Canvas-States (§5.3), nur kleiner:

| State | Signal am Thumb |
|---|---|
| Default | Neutral Border `--sg2-border-default` |
| Selected (currently in Inspector) | Teal-Border `--sg2-border-teal-strong` |
| Signature-Applied | Gold-Border-Tint + Gold-Dot oben rechts |
| Override vorhanden | Gold-Dot oben rechts (gleicher Dot, beide Signale koexistieren an demselben Thumb) |

### 7.4 Klick-Verhalten

- **Klick auf Thumb** → selektiert das Panel (= gleicher Effekt wie Canvas-Klick). Canvas-Panel-Border wird Teal, Inspector lädt Panel-Daten.
- **Klick auf Strip in Leerraum** (zwischen Thumbs) → keine Aktion (nicht Deselect — Deselect geht über Escape oder Close-Button)

### 7.5 Empty-State

Wenn das Grid keine Panels hat (theoretisch möglich bei Dim 0×0 — in Praxis nicht erreichbar wegen VALID_PANEL_COUNTS-Constraint): Strip zeigt nur Label `PREVIEW`, kein Content.

---

## 8. Signatures-Bar (52px, full-width)

### 8.1 Position

Strikt full-width, unter Preview-Strip, über Output-Bar.

### 8.2 Inhalt

```
┌───────────────────────────────────────────────────────────────┐
│ SIGNATURES   [⭐prisoners-noir ×][deakins][kurosawa][...] →   │
└───────────────────────────────────────────────────────────────┘
```

- **Label `SIGNATURES` links** — **Gold** (`--sg2-gold`, Mono 11px, uppercase, 0.2em letter-spacing, 600 weight). Markiert die Zone als Gold-Territorium.
- **Applied-Card fix ganz links** (direkt nach Label), dann **Pinned-Favoriten**, dann **Recently Used** — **keine visuellen Trenner** zwischen den drei Zonen (homogener Strip)
- **Horizontal-Scroll** + Gradient-Fade rechts + Scroll-Snap (wiederverwende `useOverflowDetection`, analog Continue/Preview-Strip)

### 8.3 Card-Struktur

Jede Card: 160×40px (ungefähr, Code-Chat finalisiert), Swatch-Circle (22px) + Label rechts (General Sans 13px Medium, Signature-Name lowercase) + optional 2. Zeile (Tagline Mono 11px)

### 8.4 Gold-Verteilung (NUANCEN 1 + 2, kritisch)

| Card-Zustand | Border | Background | Details |
|---|---|---|---|
| Default (inaktiv) | `--sg2-border-default` | neutral dunkle Surface | keine Gold-Akzente, nur Label `SIGNATURES` ist Gold |
| **Applied (aktiv)** | **`--sg2-gold-border-hover` + Gold-Glow** `--sg2-gold-glow-subtle` | leicht erhöht | `★` Stern-Icon vor Label, `×` rechts oben für Detach |

Nur Applied-Card trägt Gold-Border + Glow. Inaktive Cards bleiben neutral. Zone wird durch Label als Gold-Territorium signalisiert, aber Applied ist der einzige Ort mit vollem Gold-Signal.

### 8.5 Klick-Verhalten

| Target | Action |
|---|---|
| Inaktive Card → Klick | Apply (wird zur Applied-Card, bisherige Applied fällt zurück in den Strip) |
| Applied Card `×` | Detach (Signature wird entfernt, Card wird inaktiv) |
| Applied Card Body-Klick | **TODO(looklab-jump):** später → Signature in LookLab öffnen. v1: no-op, aber Code-Marker pflanzen |

### 8.6 Empty-State (User hat keine Signatures)

```
SIGNATURES   no signatures yet — create in LookLab →
```

- Ein-Zeiler rechts vom Label
- Clickable (führt zu LookLab)
- Bar-Höhe bleibt 52px (nicht adaptiv weg — Layout-Konsistenz mit Preview-Strip und Output-Bar)

### 8.7 Kein Plus-Slot

Kein `[+ new signature]`-Slot in der Bar. LookLab ist via Rail erreichbar — Dopplung wäre Noise. (Anders als Continue auf Landing, wo Plus-Slot Projekt-Erstellung ohne Save-Umweg ermöglicht.)

---

## 9. Output-Bar (32px, full-width, Stack-Boden)

### 9.1 Layout

```
┌───────────────────────────────────────────────────────────────┐
│ [COPY AS JSON]  [SAVE AS PRESET]        ~340 tok · ⚠ TINY @2K │
└───────────────────────────────────────────────────────────────┘
```

- **Links:** Actions (Copy + Save)
- **Rechts:** Meta (Token-Count + Dim-Warning)
- **Vertikal zentriert** in 32px Höhe
- Horizontal-Padding: 16px links/rechts

### 9.2 Actions (links)

**`COPY AS JSON`** — Primary-Action
- Button-Style: Teal-getintet (BG `--sg2-teal-active-bg`, Border `--sg2-border-teal-subtle`, Text `--sg2-teal`)
- Klick → Prompt-JSON-Output (aus Compiler) in Clipboard
- Feedback: Toast `json copied` (siehe §16 Toast-System)

**`SAVE AS PRESET`** — Sekundär-Action
- Button-Style: neutral (Border `--sg2-border-default`, Text `--sg2-text-secondary`)
- Klick → öffnet Save-Popup (siehe §10)

**Kein Copy-as-Paragraph in v1** — der Grid-Creator-Output ist JSON-nativ (siehe CLAUDE.md "JSON-Output: nur wo das Ziel-Tool es versteht"). Paragraph additiv wenn echter Bedarf auftaucht.

**Kein Reset hier** — Reset lebt in der Module-Toolbar neben Random.

### 9.3 Meta (rechts)

**Token-Count:** `~340 tok` — geschätzte Token-Länge des kompilierten JSON-Outputs (Hinweis für NanoBanana-Context-Budget). Mono 11px, `--sg2-text-tertiary`. Updated live.

**Dim-Warning:** nur wenn Quality `LOW` oder `TINY` (siehe §12). Format: `⚠ TINY @2K` bzw. `⚠ LOW @4K`. Mono 11px, Farbe `--sg2-warning` (Amber, gleicher Token wie `--sg2-gold` aber semantisch Warn-Rolle). Wenn beide Resolutions kritisch: `⚠ TINY @2K · LOW @4K`.

**Separator** zwischen Token-Count und Warning: ` · ` (bei vorhandener Warning).

### 9.4 Kein Autosave-Indicator

v1: kein `saved · 14m ago`-Indicator. Workspace-State ist session-lokal, kein Draft-Konzept in v1 (siehe §15 Store-Modell).

---

## 10. Save-as-Preset-Popup

### 10.1 Typ + Position

Center-Modal mit dunklem Overlay. Modal-Dimensions: ~460×auto, vertikal zentriert, Overlay `rgba(0,0,0,0.65)`.

**Legitimer Modal-Use-Case** (NUANCEN 6 verbietet Modals als Arbeitsmodus — Save-Flow ist 3-5 Sekunden-Akt, kein Arbeitsmodus).

### 10.2 Popup-Struktur

```
┌─────────────────────────────────────────────┐
│ SAVE AS PRESET                          ×   │
│                                             │
│ Name                                        │
│ [____________________________]              │
│                                             │
│ What to include                             │
│ [✓] Grid-Layout              (required)     │
│ [ ] Panel Content Fields                    │
│ [ ] Module-Auswahl                          │
│ [ ] Signature-Link [prisoners-noir ▾]       │
│                                             │
│ Where to save                               │
│ (•) Library only                            │
│ ( ) To project: [tokio-kurzfilm ▾]          │
│ ( ) New project: [____________]             │
│                                             │
│                        [ Cancel ]  [ Save ] │
└─────────────────────────────────────────────┘
```

### 10.3 Felder + Verhalten

**Name (required):**
- Text-Input, Placeholder `e.g. Noir Tokio Sheet`
- **Save-Button disabled** bis Name ≥ 2 Zeichen
- Auto-focus beim Modal-Open
- Kollision bei Submit: Error-Zeile unter Input `name already exists` (kein Auto-Numbering in v1)

**What to include (aus PRODUCT_STRATEGY §2.2):**
- `Grid-Layout` — Pflicht, disabled Checked-State (visuell als checked mit reduziertem Kontrast)
- `Panel Content Fields`, `Module-Auswahl` — optional
- `Signature-Link` — Checkbox + Dropdown. Default: aktuell applied Signature (wenn vorhanden). Optionen: alle Library-Signatures + `(none)`. **Kein "create new in LookLab →"** Link (State-Verlust-Risiko bei Popup-Abbruch).

**Where to save (Default: Library only):**
- Radio-Group
- `To project` → Dropdown mit bestehenden Projekten (Default = aktuelles Projekt aus ShellHeader, falls kontextgebunden)
- `New project` → Text-Input für neuen Projekt-Namen; Projekt wird **erst bei Submit** angelegt, bei Cancel nicht

### 10.4 Buttons

- `Cancel` — schließt Popup, kein State-Commit
- `Save` — disabled bis Name valid. Klick → Payload bauen, Store-Write, Popup schließen, **Toast** `preset '{name}' saved`

### 10.5 Escape + Overlay-Klick

- Escape = Cancel
- Klick aufs Overlay (außerhalb Modal) = Cancel

### 10.6 Update vs. Save-as-New (v1 = nur Save-as-New)

In v1: **jedes Save erzeugt ein neues Preset**. Auch wenn User ein bestehendes Preset geladen hat und editiert. Update-Flow (Y-Variante aus Planungs-Session) kommt additiv später. Klares Modell, kein versehentliches Überschreiben.

---

## 11. Random + Confirm-Dialog

### 11.1 Trigger

Random-Button in der Module-Toolbar rechts (§3.4).

### 11.2 Mechanik

**Random = Field-Auto-Fill**, **nicht** Role-Shuffle. Füllt die **Inhalt-Felder aller Panels** mit zufälligen Werten aus field-type-passenden Pools.

- Respektiert das `panel_fields`-Schema des aktiven Cases
- Pro Field-Type ein Random-Pool, datengetrieben unter `src/data/random/` (teilweise Legacy bereits vorhanden — siehe alten GridOperator-Code)
- Wirkt auf **alle Panels gleichzeitig** (Quick-Test-Use-Case)
- **Overrides bleiben unberührt** — nur Field-Inhalte werden gewürfelt
- **Signatures bleiben unberührt** — Gold-Border-Tint an Panels überlebt Random
- **Panel-Roles bleiben unberührt** — strukturelle Rolle (front/side/back) ist kein Random-Pool-Eintrag

### 11.3 Confirm-Dialog

**Trigger-Regel:** Nur wenn ≥ 1 Panel bereits Field-Content hat (also User-eingegebene oder vorherige Random-Werte). Leere Sheets: direkt füllen ohne Confirm.

**Dialog-Layout (Mono, kompakt):**
```
┌─────────────────────────────────────────┐
│ X panels have content that will be      │
│ overwritten.                            │
│                                         │
│            [ Cancel ]  [ Randomize ]    │
└─────────────────────────────────────────┘
```

- **Default-Focus:** `Cancel` (sichere Option bei versehentlichem Enter)
- `Randomize anyway` als bewusster Klick
- Escape = Cancel
- **Kein Toast nach Erfolg** (Resultat ist sofort visuell sichtbar im Canvas + Inspector + Preview-Strip)

### 11.4 v2-Nachzug

Später: user-edited vs. randomized Felder tracken, damit wiederholtes Random ohne Confirm geht wenn nur randomized Werte überschrieben werden. Nicht in v1.

---

## 12. Dim-Advisory

### 12.1 Quality-Stufen (4-Level)

Aus `getDimAdvice()` des alten GridOperators. **Code-Chat:** Logik portieren via `git show 13ca30f~1:src/components/GridOperator.jsx` (Commit ist der letzte vor GridOperator-Löschung durch Picker-Bau).

```
HIRES      ← ≥ ~600 px/side, NanoBanana-optimal
STANDARD   ← ≥ ~300 px/side, taugliche Startframes
LOW        ← < ~300 px/side, grenzwertig
TINY       ← < ~200 px/side, kaputt für Startframes
```

Exakte Thresholds: aus Git-History übernehmen, nicht neu erfinden.

**Casing:** Die Spec-Tags sind **UPPERCASE** (konsistent mit Section-Headern auf Landing). Git-History liefert `'Hires'` / `'Standard'` capitalized. Code-Chat macht entweder `.toUpperCase()` in der View oder Tag-Mapping-Objekt — beides akzeptabel.

### 12.2 Format in Case Context (§4.4)

Inline vertikal, unter dem Dimensions-Display-Line:

```
DIMENSIONS · 6 × 4 · 24 panels
[Matrix]

@ 2K  ~341 × 341 px  · STANDARD
@ 4K  ~683 × 683 px  · HIRES
```

Zwei Zeilen (@ 2K + @ 4K), Quality-Tag am rechten Rand, Mono 11px.

### 12.3 Farb-Kodierung

| Tag | Farbe |
|---|---|
| HIRES | `--sg2-teal` |
| STANDARD | `--sg2-text-tertiary` (neutral) |
| LOW | `--sg2-warning` (Amber) |
| TINY | `--sg2-warning` fetter (gleicher Token, stärkeres Gewicht z.B. 700) |

Amber-Stack, **kein Rot** — konsistent mit Output-Bar-Warning (§9.3).

### 12.4 Warnung in Output-Bar (§9.3)

Warning-Trigger-Schwelle: `LOW` oder `TINY` in mindestens einer Resolution. STANDARD ist tauglich, HIRES ist optimal — beide triggern keine Warnung.

### 12.5 Panel-Orientation-Awareness

**Nicht in v1.** Alte `getDimAdvice()` war nicht orientation-aware, funktionierte praktisch. Additiv erweiterbar wenn echter Bedarf entsteht.

### 12.6 Live-Update

Advisory reagiert live auf Änderungen in Dimensions-Matrix (§4.4). Kein Manual-Refresh nötig.

---

## 13. Panel-Fields-Schema (Architektur-Klausel)

**Regel:** Der Inspector rendert **ausschließlich datengetrieben** aus dem `panel_fields`-Schema des aktiven Cases. Es gibt keinen hardcoded case-specific Inspector-Code.

### 13.1 Field-Types (enumerable v1)

| Type | Render-Komponente | Beispiel-Case |
|---|---|---|
| `role` | Dropdown, strikt (nur Schema-Optionen) | angle_study.view |
| `select` | Dropdown, frei (Schema-Optionen + evtl. free-text Fallback) | shot_coverage.framing |
| `text` | Single-line Text-Input | zone_board.zone |
| `textarea` | Multi-line Textarea | story_sequence.action |

Neue Field-Types werden additiv ergänzt — eine neue Render-Komponente, ein neuer Schema-Eintrag.

### 13.2 Pflicht pro Field-Schema

- `id`: interner Key
- `type`: einer der Field-Types oben
- `label`: User-facing Label
- `options` (nur bei `role` + `select`): Array möglicher Werte
- `default`: optional, per-Strategy pro Panel ableitbar
- `global_or_panel`: `'global' | 'panel' | 'both'` — bestimmt ob Feld in Case Context (§4.7) oder Inspector (§6.4) rendert

### 13.3 Neue Panel-Rollen hinzufügen

Pfad: **Schema-File erweitern** unter `src/lib/cases/{caseId}/schema.js` bzw. `panelRoleStrategy.js`. Keine UI-Freitext-Eingabe.

Begründung: NanoBanana reagiert auf validierte Rollen-Namen. Unvalidierte Rollen aus UI-Input wären unpredictable Output (NUANCEN 13: Tool-first vor Konzept).

### 13.4 Freeform vs. Structured Cases

- **Structured** (angle_study, shot_coverage, expression_sheet, outfit_variation): Inspector hat Role-Dropdown + Field-Overrides
- **Freeform** (story_sequence, zone_board, start_end_frame): Inspector hat primär Textarea(s), kein Role-Dropdown
- **Hybrid** (world_angle_study: camera_angle Dropdown + zone_focus Freitext): Inspector rendert beide Felder sequenziell

---

## 14. State-Signale (NUANCEN 2, kritisch)

### 14.1 Zwei unabhängige Signale

| Signal | Bedeutung | Visual |
|---|---|---|
| **Override-Dot** | per-Panel-Konfiguration weicht vom globalen Default ab (prozedural, alle Override-Typen teilen diesen einen Dot) | Gold-Dot oben rechts am Panel (8×8px, `--sg2-gold`) |
| **Signature-Applied** | gespeicherter Signature-Token auf diesem Panel eingehängt (deklarativ/objekthaft) | Gold-Border-Tint + Gold-Glow `--sg2-gold-glow-subtle` ums ganze Panel |

**Beide müssen an demselben Panel gleichzeitig koexistieren können.** Ein Panel mit Override-abweichender Role + applied Signature trägt:
- Gold-Border-Tint ums Panel (Signature)
- PLUS Gold-Dot oben rechts (Override)

### 14.2 Scope

Gilt identisch in:
- **Canvas** (§5.3) — volle Größe
- **Preview-Strip** (§7.3) — skaliert auf Thumb-Größe

### 14.3 Selected-State ist Teal, nicht Gold

`Selected` (currently in Inspector) wird mit Teal-Border signalisiert (§5.3). Teal bleibt universell-aktiv, Gold bleibt User-Qualität (NUANCEN 1). Selected + Signature-Applied an demselben Panel = Teal-Border (von Selected gewinnt in der Border-Prioritäten-Reihenfolge) + Gold-Glow darunter (Signature bleibt erkennbar).

---

## 15. Workspace-Store-Modell

### 15.1 Store-Trennung (kritisch für Spec + Code-Chat)

**Grid-State (lokal/session):**
- Lebt im Grid Creator Workspace-Component-State oder in einem einfachen `workspaceStore` (Zustand-Slice)
- Session-weit persistent: User wechselt zu LookLab, kommt zurück, Workspace-State ist noch da (Panel-Selection, Override-Werte, Module-Aktivierung, Dimensions, etc.)
- **Flüchtig bei Page-Reload** — kein localStorage-Dump in v1
- Kein Draft-Konzept, kein Autosave

**Globale Stores (reactive):**
- **Signatures** — persistiert (wird in Token-Store-Stufe-1-Phase gebaut; v1 des Workspace nutzt Stub)
- **Grid-Presets** — persistiert (Picker-Bau hat bereits `presetStore.js` Stub angelegt)
- **Projects** — persistiert (gebaut wenn Projekt-Feature voll ausgerollt ist; v1 Stub mit Dummy-Projekten)

### 15.2 Reactive Live-Link-Regel (PRODUCT_STRATEGY §1.1)

Grid-Preset referenziert Signatures **per ID, nicht Snapshot**. Wenn User eine Signature im LookLab editiert und dann zurück in den Workspace kommt:
- Applied-Signature zeigt automatisch die aktuelle Version (Style, Tagline, Swatch)
- Kein Re-Sync nötig, keine manuelle Aktualisierung

Edge-Case: Signature gelöscht → Applied-Card zeigt `signature unavailable` + User kann neu zuweisen oder detachen. Preset stirbt nicht.

### 15.3 Case-Wechsel ist blockiert im Workspace

User kann den Case im Workspace **nicht wechseln**. Case ist Picker-Entscheidung. Um den Case zu ändern:
- Back-to-Picker (§2.1: `← choose another template`)
- Picker auswählen
- Neuer Workspace mit neuem Case

Der vorherige Grid-State wird dabei **nicht automatisch** übertragen — der neue Case hat anderes `panel_fields`-Schema.

### 15.4 Rail-Wechsel bleibt harmlos

User klickt von Grid Creator auf LookLab (Rail) und zurück: Workspace-State bleibt exakt wie verlassen. Inspector-Selection bleibt, Overrides bleiben, Module bleiben.

### 15.5 Projekt-Wechsel bleibt harmlos

Konsistent mit PRODUCT_STRATEGY §3.3: Projekt-Wechsel ändert nur Label im ShellHeader + Default-Zuordnung beim nächsten Save. Grid-Arbeit selbst ist projekt-agnostisch.

---

## 16. Toast-System (generische Infra)

### 16.1 Use-Cases (über Workspace hinaus, aber hier zuerst instantiiert)

- `COPY AS JSON` → `json copied`
- `SAVE AS PRESET` → `preset 'noir tokio sheet' saved`
- Später: Signature-Save, Filmlook-Save, Projekt-Create, etc.

### 16.2 Position + Layout

- **Position:** `bottom-right`, 24px vom rechten Rand, y-Offset = Output-Bar-Höhe (32) + 24 = **56px vom absoluten Bottom**
- Stapel wächst **nach oben**
- Max **3 sichtbare Toasts** gleichzeitig. Bei mehr: ältere werden auto-dismissed

### 16.3 Toast-Card

- Breite: auto (min ~220px, max ~340px)
- Höhe: auto (min ~40px)
- Radius: `--sg2-radius-md`
- Surface: neutrale dunkle Background (`--sg2-bg-elevated`)
- **Border-Tint** (nicht Fill-Color) je Typ:
  - `success` → Border `rgba(60, 207, 204, 0.4)` (Teal)
  - `error` → Border `--sg2-error-border` (Amber)
  - `info` → Border `--sg2-border-emphasized` (neutral)
- Text: Mono 12px, `--sg2-text-primary`
- `×`-Close rechts (manuelles Schließen)

### 16.4 Timing

- **Auto-Dismiss:** 3000ms
- **Pause-on-Hover:** Timer pausiert solange Maus über dem Toast schwebt, setzt fort beim Verlassen
- **Manuelles `×`:** schließt sofort
- **Slide-in / slide-out:** 180ms, `ease` (siehe `--sg2-transition`)

### 16.5 Stacking-Verhalten

- Neuer Toast rutscht von unten ein
- Bestehende Toasts rutschen nach oben
- Bei Auto-Dismiss: der dismissed Toast fadet + rutscht weg, restliche bleiben an ihren Positionen oder rutschen nach

---

## 17. Keyboard, Interaktion, Responsive (v1-Policy)

### 17.1 Keyboard-Shortcuts (v1 minimal)

| Key | Context | Effekt |
|---|---|---|
| `Escape` | Workspace-Focus | Deselect current panel (Inspector → no panel selected) |
| `Escape` | Textarea-Focus (CUSTOM NOTES, FORBIDDEN ELEMENTS, etc.) | **Blur Textarea**, nicht Deselect (häufigere Erwartung in Text-Feldern) |
| `Escape` | Dialog/Popup (Save, Random-Confirm, Projekt-Dropdown) | Schließt Dialog (= Cancel) |
| `Arrow Left/Right` | Preview-Strip-Focus | Wechselt zum vorherigen/nächsten Panel |
| `Arrow Up/Down` | Dropdown-Focus | Navigiert Options |

**Nicht in v1:** `Cmd/Ctrl+C` (Copy-Shortcut braucht Focus-Management, additiv später), `Cmd/Ctrl+S` (Save-Shortcut ebenso).

### 17.2 Case-Wechsel-Block

Case im Workspace **nicht änderbar**. Siehe §15.3.

### 17.3 Undo/Redo: nicht in v1

Keine Undo-Infrastruktur. Reset-Affordances (Panel-Reset, Global-Reset, Per-Field-Reset) decken häufigste Use-Cases. Additiv später.

### 17.4 Canvas-Interaktion minimal

Nur `click` + `hover`. Kein Drag-Reorder, kein Right-Click-Menu, keine Multi-Select-Gestures in v1.

### 17.5 Responsive (v1 brutal)

- Minimum funktionale Breite: ~1100px (Rail 88 + Context 260 + Canvas ~400 + Inspector 320 + Scrollbar)
- **Kein Min-Width-Message** in v1 — Layout bricht unter 1100px ohne Warning
- Eintrag in `OPEN_DECISIONS.md` `Workspace Min-Width-Message` für späteren Nachtrag

### 17.6 Accessibility

Delegiert an Code-Chat (Focus-Rings, ARIA-Labels, Tab-Navigation). Spec spezifiziert keine ARIA-Details.

---

## 18. Typografie-Referenz

Gültig aus `PHASE1_STATUS.md` + Landing-Redesign-Updates:

| Element | Token |
|---|---|
| Display / Page-Titel | `--sg2-text-display` (24px) General Sans Medium |
| Card-Titel / Header | `--sg2-text-h1` (16px) General Sans Medium |
| Section-Sub-Title | `--sg2-text-h2` (14px) |
| Body / UI-Content | `--sg2-text-body` (13px) General Sans |
| Sub-Line / Small | `--sg2-text-small` (12px) JetBrains Mono |
| Section-Labels | `--sg2-text-caption` (11px) Mono 600, 0.2em letter-spacing, uppercase |
| Mono-Labels (Meta/Tag) | `--sg2-text-mono-label` (10px) JetBrains Mono |
| Min-Labels (sub-badges) | `--sg2-text-min` (9px) |

**Farben:**
- Primary: `--sg2-text-primary`
- Secondary: `--sg2-text-secondary`
- Tertiary (Labels, Meta): `--sg2-text-tertiary`
- Quaternary (Sub-Meta): `--sg2-text-quaternary`
- Muted (Disabled): `--sg2-text-muted`

**Akzent:**
- Teal `--sg2-teal` für universelle aktive States
- Gold `--sg2-gold` **nur** für: Signatures-Bar-Label, Applied-Signature-Border, Override-Dots, Signature-Cards im Inspector, Grid-Rail-Stern (falls aktiviert) (NUANCEN 1)

---

## 19. Offene Mikro-Punkte für Code-Chat

1. **Save-Popup-Feinpolish** — Padding, exakte Card-Breite, Checkbox-Styling nach bestehenden Picker-Card-Pattern harmonisieren
2. **Toast-Animation-Kurven** — finales easing + duration nach Browser-Test abstimmen
3. **Dim-Advisory-Thresholds** — exakte Pixel-Werte aus `git show 13ca30f~1:src/components/GridOperator.jsx` übernehmen, nicht neu schätzen
4. **Random-Pool-Dateien** — Legacy unter `src/data/random/` identifizieren; fehlende Pools pro Field-Type ergänzen (Case-Chat entscheidet Umfang)
5. **Signature-Card-Dimensions in der Bar** — 160×40px ist Richtwert, Code-Chat tariert auf Balance mit Label-Länge
6. **Modul-Chip-Disabled-Tooltip-Wortlaut** — pro `—`-Kombination aus Matrix ein knapper Grund (z.B. `world cases have no character to attach a face to`). Code-Chat + Jonas finalisieren
7. **ShellHeader-Projekt-Dropdown** — Max-Height + Scroll bei vielen Projekten; Search-Input ab N ≥ 10 Projekten? Code-Chat schlägt pragmatisches Default vor
8. **Back-to-Picker-Wortlaut** — aktuell `← choose another template`, alternative Kandidaten: `← pick another template`, `← back to templates`. Finalisierung bei Live-Check

---

## 20. Was NICHT zu dieser Spec gehört

- **Picker-State** → `PICKER_SPEC_V1.md`
- **LookLab-Inhalt + Signature-Creation** → Token-Store-Stufe-1-Phase
- **LIB-Tab-Details** → eigene Phase (OPEN_DECISIONS #5)
- **Projekt-Overview-Page** → OPEN_DECISIONS #4 (eigene Phase)
- **Hub-Inhalt + Prompt-Customization** → OPEN_DECISIONS #8 (eigene Phase)
- **Undo/Redo-Infrastruktur** → additiv v2
- **Autosave / Draft-Konzept** → additiv v2
- **Multi-Select Panels** → additiv v2
- **Drag-Reorder Panels** → additiv v2
- **Cmd+S / Cmd+C Shortcuts** → additiv v2
- **Responsive <1100px Min-Width-Message** → OPEN_DECISIONS neu (`Workspace Min-Width-Message`)
- **Cross-Tool Signature-Sharing (Grid Creator ↔ SeenFrame)** → verboten, NUANCEN 9

---

## 21. Abgleich mit v2-Handoff §10.2 ff. + historischem Mockup

Diese Spec **ersetzt** v2-Handoff §10.2+ für den Workspace-Bau. Kernunterschiede:

- **Module-Toolbar als 4. Top-Bar** (zwischen Header und 3-Spalten-Row) — v2-Handoff hatte Module-Toggles in Case Context
- **Preview-Strip full-width** — einige alte Mockups hatten Strip in Canvas-Spalte (NUANCEN 7 korrigiert)
- **Signatures-Bar-Gold-Verteilung** — Label Gold + Applied Gold, inaktive Cards neutral (nicht durchgängig Gold wie alter Vorschlag)
- **Save-Popup mit 4 Checkboxen** — PRODUCT_STRATEGY §2.2 Flexi-Payload, Struktur aus Strategy-Session übernommen
- **Dim-Advisory 4 Stufen** — NUANCEN 13 hat PERFECT als 5. Stufe genannt, das ist falsch (4 Stufen aus Git-History). NUANCEN 13 wird separat korrigiert.
- **Random = Field-Auto-Fill**, nicht Role-Shuffle — Korrektur aus Planungs-Session (Random respektiert `panel_fields`, füllt Content, nicht Rollen)
- **Mockup `mockup_03_gridcreator_workspace.html`** — visueller Anker, aber bei Konflikten gewinnt NUANCEN (NUANCEN 7, 1, 2 besonders)

---

## 22. Definition of Done (Workspace-Bau-Phase)

1. Alle 6 Stack-Zonen rendern (Header, Toolbar, 3-Spalten, Preview, Signatures, Output) in korrekter Höhen-Addition
2. Back-to-Picker funktioniert (State-Switch auf 'picker' in `GridCreator.jsx`)
3. Projekt-Dropdown im ShellHeader öffnet Inline-Dropdown mit Projekt-Liste + Footer
4. Module-Toolbar zeigt alle Module, pre-aktiviert per Case-Whitelist, User kann togglen
5. Case Context hat alle 6 Sektionen (CASE / REFERENCE / DIMENSIONS / PANEL ORIENTATION / FORBIDDEN / Modul-globale)
6. Dimensions-Matrix (6×4) mit Hover-Highlight + Klick-Apply funktioniert
7. Dim-Advisory live unter Matrix, 4-Stufen-Tags, Amber-Warn bei LOW/TINY
8. Canvas rendert Grid mit SVG-Silhouetten, Klick + Hover funktionieren, Panel 1 auto-selected beim Start
9. Inspector rendert datengetrieben aus `panel_fields`-Schema, Role-Dropdown + Overrides + Signature-Card + Custom Notes + Reset
10. Preview-Strip full-width scrollbar, Thumb-Click selektiert Panel
11. Signatures-Bar mit Applied-Card links, Pinned + Recent daneben, Detach via `×`
12. Output-Bar mit Copy-Primary + Save-Sekundär + Token-Count + Dim-Warning
13. Save-as-Preset-Popup mit 4 Checkboxen + Projekt-Dropdown funktioniert
14. Random + Reset in Module-Toolbar mit Confirm-Dialog bei non-empty Panels
15. Override-Dots + Signature-Applied-Border-Tints am Panel korrekt und kombinierbar (NUANCEN 2)
16. Toast-System generisch (success / error / info), bottom-right, pause-on-hover, max 3 gestackt
17. Workspace-State bleibt bei Rail-Wechsel erhalten (Session-Store), flüchtig bei Page-Reload
18. Grid Engine (42 Tests, Slices 1-8) grün und unberührt
19. Keine Regression in Shell, Rail, Landing, Picker

---



**Ende WORKSPACE_SPEC_V1.**
