# SeenGrid — Grid Creator Picker Spec V1

**Datum:** 2026-04-18
**Status:** Verbindlich. Bereit für Code-Chat.
**Vorgänger:** PRODUCT_STRATEGY_V1.md, HANDOFF_STRATEGY_TO_PICKER.md
**Nachfolger:** HANDOFF_PICKER_TO_CODE.md (Übergabe an Code-Chat)
**Gilt nur für:** Grid Creator Picker-State. Workspace-State ist eigene Phase.

---

## 0. Zweck

Der Picker ist der **Einstiegs-State** des Grid Creators. Full-Page-View (kein Overlay, kein Modal, siehe NUANCEN Punkt 6). Der User wählt hier seine Grundlage — eigenes Preset, fertiges Core-Template oder leeres Grid — und landet danach im Workspace-State.

---

## 1. Gesamtstruktur

```
┌──────────────────────────────────────────────────────┐
│  [🔍 search]   all · character · world · sequence   │  ← Suche + Filter-Pills
├──────────────────────────────────────────────────────┤
│  ★ YOUR PRESETS                                      │  ← adaptiv (weg wenn leer)
│  [card] [card] [card] ...                            │
│                                                      │
│  CORE TEMPLATES                                      │
│  [card] [card] [card] [card] [card]                  │
│  [card] [card] [card] [card] [card]                  │
│                   ↳ more templates in Prompt Hub →   │  ← Mini-Hinweis, Wortlaut TBD
│                                                      │
│  + START FROM SCRATCH                                │  ← einzelne full-width Card
└──────────────────────────────────────────────────────┘
```

**Sektions-Reihenfolge fix:** YOUR PRESETS → CORE TEMPLATES → START FROM SCRATCH.

---

## 2. Suche + Filter-Pills

### 2.1 Search-Input

- Position: oben links, max-width 480px
- Styling-Referenz: v2-Handoff §10.1 (Background `#141420`, 1px Border, Radius 9px, Padding `11px 16px 11px 40px`, Search-Icon links)
- **Live-Filter** während Tippens, kein Submit-Button
- Durchsucht: Card-Titel, Case-Typ, Sub-Line-Inhalt, **Case-Description-Text** aus `MODULE_AND_CASE_CATALOG.md` (damit "emotion" → Expression Sheet findet)
- Filter wirkt gleichzeitig auf YOUR PRESETS + CORE TEMPLATES
- START FROM SCRATCH reagiert **nicht** auf Suche (bleibt immer sichtbar am Ende)

### 2.2 Filter-Pills

- Labels: `all · character · world · sequence` (später erweiterbar ohne Code-Änderung via JSON)
- Default-Aktiv: `all`
- Active Pill: Teal-BG + Teal-Text + Teal-Border (aus v2)
- Wirken auf YOUR PRESETS + CORE TEMPLATES (Pills filtern nach Case-Kategorie)
- Pills + Suche kombinierbar (AND-Verknüpfung)

### 2.3 Leerzustand bei Suche ohne Treffer

```
"no templates match 'xyz'"
         [clear search]
```

- START FROM SCRATCH bleibt sichtbar — der User kommt immer weiter.

---

## 3. Sektion YOUR PRESETS

### 3.1 Verhalten

- **Adaptiv:** Sektion wird komplett weggelassen wenn User keine Presets hat (analog zum CONTINUE-Band der Landing, siehe PRODUCT_STRATEGY_V1 §5.2)
- **Position:** oberste Sektion (häufigster Wiederzugriff für aktive User)
- **Sektion-Label:** "YOUR PRESETS" mit kleinem Gold-Star-Icon links
- Label-Styling: 11px JetBrains Mono, 0.2em letter-spacing, Gold `#f5c961`, 600 weight

### 3.2 Card-Pattern YOUR PRESETS

```
┌──────────────────────────┐
│                          │  ← Thumbnail 16:10
│   ┌──┬──┬──┬──┐          │    (Grid-Layout-Vorschau)
│   │  │  │  │  │   ★ 🎨   │  ← Gold-Star + Signature-Swatch
│   └──┴──┴──┴──┘          │    (nur wenn Signature verknüpft)
│                          │
├──────────────────────────┤
│ Noir Tokio Sheet         │  ← User-gegebener Name
│ angle study · 4 panels · │    (General Sans 13px / 500)
│ 2d ago                   │  ← Case-Typ + Meta
└──────────────────────────┘    (JetBrains Mono 11px)
```

- **Border:** Gold `rgba(245,201,97,0.25)` rest, `rgba(245,201,97,0.5)` hover
- **Title:** User-Name (beim Save eingegeben), General Sans 13px Weight 500
- **Sub-Line:** `{case_typ} · {N} panels · {time_ago}`, JetBrains Mono 11px, `#7a7a92`
- **Signature-Badge:** Wenn Preset eine Signature verknüpft hat, kleines Gold-Star-Icon (8×8) oben rechts auf dem Thumbnail + Swatch-Circle daneben (22px, Look-Thumbnail-Gradient)
- **Hover:** `translateY(-2px)`, Border fester Gold, Shadow mit Gold-Tint

---

## 4. Sektion CORE TEMPLATES

### 4.1 Verhalten

- **Immer sichtbar** (10 Cases aus `MODULE_AND_CASE_CATALOG.md`)
- **Sektion-Label:** "CORE TEMPLATES" — neutral, kein Gold, kein Star
- Label-Styling: 11px JetBrains Mono, 0.2em letter-spacing, `#8a8aa0`, 600 weight
- **Unter der Card-Liste:** Mini-Hinweis-Zeile (siehe 4.3)

### 4.2 Card-Pattern CORE TEMPLATES

```
┌──────────────────────────┐
│                          │  ← Thumbnail 16:10
│   ┌──┬──┬──┬──┐          │    (abstrakte Pattern-Vorschau
│   │  │  │  │  │          │     des Grid-Layouts)
│   └──┴──┴──┴──┘          │
│                          │
├──────────────────────────┤
│ Character Angle Study    │  ← Case-Name in natürlicher Sprache
│ 4 panels · front, right, │    (General Sans 13px / 500)
│ left, back               │  ← Sub-Line
└──────────────────────────┘    (JetBrains Mono 11px)
```

- **Border:** Default `rgba(255,255,255,0.08)` rest, Teal `rgba(60,207,204,0.4)` hover
- **Title:** Case-Name in natürlicher Sprache (nicht `character_angle_study` sondern "Character Angle Study"), General Sans 13px Weight 500
- **Sub-Line:** `{N} panels · {role1}, {role2}, ...`, JetBrains Mono 11px, `#7a7a92`
- **Kein Gold**, keine Signature-Badges
- **Hover:** `translateY(-2px)`, Border Teal, Shadow

### 4.3 Mini-Hinweis "more in Prompt Hub"

- Position: rechtsbündig unter dem Card-Grid
- Styling: JetBrains Mono 11px, `#8a8aa0`, Klick → führt zur Hub-Page (bis Hub gebaut ist: Placeholder)
- **Wortlaut offen:** `more templates in Prompt Hub →` ist der aktuelle Platzhalter. Suggeriert fälschlich "mehr vom gleichen"; finales Wording für Code-Chat TBD (Kandidaten: `different template flavors in Prompt Hub →`, `alternative sheets in Prompt Hub →` o.ä.)

### 4.4 Optionaler Use-Case-Hinweis auf Cards

- **Flag für Code-Chat:** auf beiden Card-Typen (CORE + YOUR PRESETS) testbar. Wenn aktiv, Zeile unter Sub-Line: `good for: character introductions` (o.ä.). Muss einfach ein-/ausschaltbar sein (Prop oder JSON-Feld), weil Jonas nach visuellem Eindruck entscheidet.

---

## 5. Sektion START FROM SCRATCH

### 5.1 Card-Pattern (einzelne Full-Width Card, nicht im Grid)

```
┌────────────────────────────────────────────────────┐
│                                                    │
│  +  empty grid                                 →   │
│     choose your own case, dimensions, modules      │
│                                                    │
└────────────────────────────────────────────────────┘
        (dashed Border `1px dashed rgba(60,207,204,0.3)`)
```

- Volle Zeilenbreite des Content-Bereichs (nicht im auto-fit-Grid)
- "+"-Icon links, Titel + Sub Mitte-links, Pfeil rechts
- **Titel:** "empty grid", General Sans 13px Weight 500
- **Sub:** "choose your own case, dimensions, and modules", JetBrains Mono 11px, `#8a8aa0`
- **Hover:** Border fester Teal, BG leicht heller, Pfeil rückt 4px nach rechts (aus v2-Handoff §10.1)
- Reagiert **nicht** auf Suche oder Filter-Pills — bleibt immer sichtbar

---

## 6. Klick-Interaktionen (Navigation nach Card-Klick)

| Card | Klick → Ziel |
|---|---|
| CORE TEMPLATES | Workspace mit Case + Defaults vorgeladen |
| YOUR PRESETS | Workspace mit komplettem Preset (inkl. verknüpfter Signature falls vorhanden, siehe PRODUCT_STRATEGY_V1 §1.1) |
| START FROM SCRATCH | Workspace, Case-Dropdown offen, Rest leer |
| "more in Prompt Hub →" | Hub-Page (oder Placeholder bis Hub gebaut) |

Der Workspace selbst ist außerhalb dieser Spec (eigene Phase).

---

## 7. Typografie (Referenz)

**Aus `PHASE1_STATUS.md` gültig, v2-Handoff §7 ist überholt:**

- **Body/UI/Titel:** General Sans (400, 500)
- **Mono-Rollen:** JetBrains Mono
- **Card-Titel:** General Sans 13px Weight 500, `#f0f0fa`
- **Card-Sub-Lines:** JetBrains Mono 11px, `#7a7a92`
- **Sektion-Labels:** JetBrains Mono 11px Weight 600, 0.2em letter-spacing, uppercase
- **Mini-Hinweise (z.B. "more in Prompt Hub"):** JetBrains Mono 11px, `#8a8aa0`

---

## 8. Adaptivität / Leerzustände

| Zustand | Verhalten |
|---|---|
| User hat keine Presets | YOUR-PRESETS-Sektion komplett weggelassen. Picker startet direkt mit CORE TEMPLATES. |
| Suche ohne Treffer | "no templates match 'xyz'" + [clear search] Button. START FROM SCRATCH bleibt sichtbar. |
| Filter-Pill aktiv, aber keine Presets passen | YOUR-PRESETS-Sektion wird für diesen Filter-Zustand ebenfalls ausgeblendet (nicht "leer mit Hinweis" — einfach weg). |
| Filter-Pill aktiv, keine Cores passen | CORE-Sektion zeigt "no core templates in this category" (knappe Mono-Zeile), Sektion-Label bleibt. |

---

## 9. CONTINUE-Band-Entscheidung (betrifft Landing, nicht Picker-State direkt)

Aus OPEN_DECISIONS #3 entschieden in dieser Planungs-Session:

- **Variante A:** Single-Row, horizontal scrollbar bei Überlauf
- Sortierung: zuletzt bearbeitet zuerst (links nach `[+ neu]`)
- `[+ neu]`-Slot ganz vorne (links)
- Keine Dependency auf LIB-Tab (kann später mit "show all"-Link erweitert werden wenn LIB gebaut ist)

Diese Entscheidung gilt für die Landing-Page und wird im Landing-CSS umgesetzt (Container wird von `grid auto-fit` zu `flex-row nowrap` + Horizontal-Scroll).

---

## 10. Offene Mikro-Punkte für Code-Chat / spätere Runden

1. **Wortlaut "more templates in Prompt Hub →"** — finales Wording TBD, aktuelle Formulierung suggeriert fälschlich "mehr vom gleichen"
2. **Optionaler Use-Case-Hinweis auf Cards** — als Prop/Flag einbauen, einfach ein-/ausschaltbar für visuellen Test
3. **Thumbnail-Pattern** — v1 nutzt abstrakte Grid-Layout-Vorschauen (Panel-Silhouetten in korrekter Anordnung). Echte Referenzbilder kommen später additiv
4. **Keyboard-Navigation** (Arrow-Keys, Enter) — nicht spezifiziert, kann Code-Chat nach Standard-Pattern bauen

---

## 11. Was NICHT zu diesem Spec gehört

- **Workspace-Aufbau** → eigene Phase (v2-Handoff §10.2 ff. als Referenz)
- **Save-as-Preset-Popup** → PRODUCT_STRATEGY_V1 §2.2
- **Projekt-Zuordnung / Projekt-Wechsel** → Workspace-Phase + OPEN_DECISIONS #7
- **Hub-Inhalt** (Classics-Sektion im Hub) → eigene Hub-Phase, siehe OPEN_DECISIONS #8
- **LIB-Tab** → OPEN_DECISIONS #5
- **Preset-Datenmodell-Details** → PRODUCT_STRATEGY_V1 §1.1 + §2.2

---

## 12. Abgleich mit v2-Handoff §10.1

Diese Spec **ersetzt** v2-Handoff §10.1 für den Picker-Bau. Kern-Änderungen gegenüber v2:

- YOUR PRESETS-Sektion ist neu (v2 kannte noch keine Presets)
- CLASSICS-Sektion ist **raus** (wandert in den Prompt Hub, siehe OPEN_DECISIONS #1)
- Typografie-Angaben aktualisiert auf Brand-Session-Stand (JetBrains Mono 11px statt v2's 10px Mono)
- Adaptivität explizit dokumentiert
- Suche durchsucht auch Case-Description (v2 nicht spezifiziert)

---

**Ende PICKER_SPEC_V1.**
