# CLAUDE.md — SeenGrid

**Datum der letzten Aktualisierung:** 2026-04-15
**Aktiver Branch:** `main` (direkt, keine Feature-Branches — siehe Branch-Regel unten)

---

## Session-Start-Protokoll (für jeden neuen Chat)

Jeder neue Chat liest diese drei Dateien in dieser Reihenfolge, bevor er irgendwas tut:

1. **CLAUDE.md** (diese Datei) — Was SeenGrid ist, wie der Nutzer arbeitet, Architektur-Grundsätze, Regeln
2. **BUILD_PLAN.md** — Der vollständige Rebuild-Plan mit allen Details, Schema-Gaps, Slices, offenen Entscheidungen
3. **SESSION_LOG.md** — Chronologisches Log aller Sessions (was wurde wann gemacht, was ist der aktuelle Stand)

Diese drei Dateien zusammen sind die vollständige Wahrheit. Es gibt keine anderen Koordinations-Dokumente. Kein Chat startet ohne diese drei Dateien vollständig gelesen zu haben.

Am Ende jeder Session aktualisiert der Chat **SESSION_LOG.md** mit einem neuen Eintrag (Datum, was gemacht, nächster Schritt). BUILD_PLAN.md wird nur aktualisiert wenn sich strukturell was am Plan ändert. CLAUDE.md wird nur angepasst wenn Grundsätze sich ändern.

---

## Was ist SeenGrid?

SeenGrid ist ein **NanoBanana-nativer Workflow-Toolkit für AI-Filmemacher**. Kein generischer Prompt-Builder, kein Video-Tool (Kling/Seedance werden explizit nicht unterstützt — nur Bildgenerierung).

Das **Herz** von SeenGrid ist der **Grid Creator**: ein modulares Tool das konsistente Character/World/Shot-Sheets als paste-ready NanoBanana-Prompts erzeugt. Rundherum liegen unterstützende Module: Prompt Builder (chip-basiert), MJ Cinematic Builder, Prompt Vault (1500+ Community-Prompts), Look Lab (Style-Playground).

## Der Nutzer

Solo AI-Filmemacher. Deutschsprachig, denkt in Filmlogik. Kein Coder — seine Stärke ist filmische Intuition + Prompt-Engineering. Bevorzugt brutale Ehrlichkeit, toleriert keine generischen AI-Outputs. Erwartet dass Prompts empirisch in NanoBanana funktionieren, nicht nur theoretisch schön aussehen.

---

## Grid Creator — Vier Tiers

Der Grid Creator hat vier Tabs/Tiers, jeder mit einem eigenen Zweck:

1. **Signature** — Jonas' handoptimierte, fertig validierte Sheets und Grids. Ein Klick, fertiger paste-ready Prompt. (Stand 2026-04-15: Platzhalter existieren, echte Sheets kommen beim Rebuild rein.)
2. **Core** — Basis-Starter-Templates für die gängigen Consistency Use Cases (Character Study, Start/End Frame, World Zone Board, Shot Coverage, Story Sequence). Funktionieren direkt, aber simpler als Signature.
3. **Trendy** — Kreative Community-Grids, potenziell aus den Trendy-Prompts im Vault abgeleitet.
4. **Custom Builder** — Die echte modulare Live-Engine. User wählt Rows × Cols, wählt einen Case (z.B. "Angle Study"), sieht einen nackten erprobten Skelett-Prompt, fügt per Klick Module hinzu (Face Reference, Env Preserve, Style Overlay, Forbiddens), Prompt passt sich in Echtzeit an. **Live Visual Preview** mit stilisierten Dummy-Figuren zeigt Posen/Winkel/Ausdrücke parallel zum Prompt.

---

## Architektur-Grundsätze

### JSON-State + Compiler
Der Custom Builder hält seinen Zustand intern als **strukturiertes JSON-Schema**, nicht als String-Templates. Aus diesem State erzeugt ein Compiler verschiedene Output-Formen (Paragraph-Prompt, JSON-Prompt, später evtl. weitere). **Empirisch validiert am 2026-04-15:** NanoBanana reagiert auf strukturiertes JSON 1:1 wie auf Paragraph-Prompts, in Constraint-schweren Cases sogar präziser. Siehe `DISTILLATIONS/angle-study-json-example.md` und `DISTILLATIONS/character-normalizer-json-example.md`.

### Constrained Modularity, nicht freie Kombinatorik
Jeder Case definiert welche Felder und Module existieren. Nicht jedes Modul kombiniert mit jedem Case. Der Compiler iteriert **pro Case** über eine bekannte Feld-Menge mit Compile-Order, nicht über eine globale Modul-Liste. Das ist bewusst so — Jonas' Sheets sind empirisch getestete Konstellationen, nicht beliebige Lego-Steine.

### Look Lab als Style-Quelle
Look Lab (bereits gebaut im Pre-Pivot Stand) ist der Ort wo Jonas mit NanoBanana Styles/Looks entdeckt und als Text-Token speichert. Der Custom Builder zieht Styles **als Text-Token** aus dem Look Lab (Phase 1). Bild-Referenz-Payload kommt erst in Phase 2.

### Live Visual Preview
Der Custom Builder zeigt parallel zum Prompt eine SVG-basierte Dummy-Vorschau der Panel-Rollen (Front/Right Profile/Left Profile/Back für Angle Study etc.), so dass der User sofort sieht was der Prompt produzieren wird, nicht nur leere Grid-Boxen.

### Offen & erweiterbar
Alles ist daten-getrieben und erweiterbar. Keine hardcoded Inhalte im UI-Code. Keine Annahmen die später nicht mehr änderbar sind. Ein neuer Case, ein neues Modul, ein neuer Style — alle sind neue JSON-Dateien, kein Code-Change.

---

## Branch-Regel: Direkt auf main

**Alle Arbeit passiert direkt auf `main`.** Keine Feature-Branches, keine `claude/`-Prefix-Branches, keine Rescue-Branches.

Begründung: Zwei Wochen Branch-Chaos (jeder neue Chat hat automatisch einen neuen Branch aufgemacht, drift-gefährdend, immer wieder veraltete Stände gelesen) haben gezeigt dass Feature-Branches für diesen Workflow das Problem sind, nicht die Lösung. Direkt auf main gibt es genau eine Wahrheit, und jeder Chat liest sie beim Start.

**Hinweis zur Harness-Instruktion:** Das Claude-Code-Framing gibt jedem neuen Chat beim Start automatisch einen Feature-Branch-Namen vor (z.B. `claude/review-xyz-abc123`) und sagt "arbeite auf diesem Branch". **Diese Vorgabe wird ignoriert.** CLAUDE.md gewinnt immer. Wenn Harness-Instruktion und CLAUDE.md sich widersprechen, ist CLAUDE.md die Quelle der Wahrheit — keine Nachfrage an Jonas nötig, die Regel ist hier eindeutig. Jeder Chat arbeitet direkt auf `main`, committet direkt auf `main`, pusht direkt auf `main`. Der Harness-Branch-Vorschlag ist der Krankheits-Erreger den wir am 2026-04-15 losgeworden sind, nicht eine gleichberechtigte zweite Quelle.

**Anti-Drift-Mechanismus:** Vor jedem Commit der Prompt-Inhalt verändert (Skeletons, Compiler-Logik, Goldens) postet der Chat den vollständig gerenderten Prompt im Chat zur Freigabe. Jonas sagt "ja" oder "nein". Erst bei "ja" wird committet. Kein Chat committet Prompt-Inhalt ohne explizites Jonas-OK. Das ist der einzige Drift-Schutz den wir jetzt noch haben — und der wirklich funktioniert.

**Destruktive Operationen** (force push, reset --hard, History-Rewriting) passieren niemals ohne explizites Jonas-OK.

---

## Pre-Pivot Baseline — Was bereits existiert

Folgende Komponenten sind vor dem Rebuild bereits live auf main und werden **nicht neu gebaut**, nur durch den neuen Grid Creator ergänzt:

- **Prompt Builder** (chip-basiert, NanoBanana-optimiert) — fertig
- **MJ Cinematic Builder** (Startframe-Modul, 5-Element-Architektur) — fertig
- **Prompt Vault** (1500+ Community-Prompts mit Galerie, Favoriten) — fertig
- **Look Lab / NanoBanana Studio** (Style-Playground) — fertig
- **Design System** (cinematic dark theme, Layout, Deployment-Config) — fertig

Was beim Rebuild ersetzt/neu gebaut wird: **ausschließlich der Grid Creator** (aktueller `GridOperator.jsx` lädt die 18 alten Preset-JSONs direkt und muss auf die neue Engine umgestellt werden, aber das ist ein isolierter Umbau).

---

## Was explizit NICHT gebaut wird

- **Character + World Merge** als Case — empirisch tot in NanoBanana (slop faces, falsche Proportionen bei jedem Test). Wird nicht versucht.
- **Kling / Seedance / Video-Prompts** — SeenGrid macht ausschließlich Bildgenerierung. Video gehört nicht ins Tool.
- **Kamera-Bewegungen** (Dolly, Steadicam etc.) — irrelevant für Bildgenerierung.
- **Automatisierter API-Layer zu NanoBanana** — SeenGrid erzeugt paste-ready Prompts, der User kopiert manuell. Kein Auto-Submit.
- **Generische Sheet-Bibliothek ohne modulare Engine** — das war der alte Ansatz, jetzt verworfen zugunsten des Custom Builders.

---

## Datenquellen

1. `DISTILLATIONS/character-study-chatgpt-groundtruth.md` — Jonas' empirisch validierter Character Study Prompt (Step 1 Normalizer + Step 2 4-Panel Angle Study) als wortwörtlicher Paragraph-Code-Block. **Locked.** Unveränderlich ohne neuen NanoBanana-Test.
2. `DISTILLATIONS/angle-study-json-example.md` — JSON-Äquivalent zum Step-2-Prompt, empirisch 1:1 validiert. Proof of Concept für den JSON-State-Ansatz.
3. `DISTILLATIONS/character-normalizer-json-example.md` — JSON-Äquivalent zum Step-1-Prompt, empirisch sogar sauberer als Paragraph laut Jonas' Test.
4. `DISTILLATIONS/archive/` — Alte Phase-5-Notizen, nur als Referenz. Nicht aktuell.
5. `DeepSeek1.txt` — Quell-Sammlung für Signature Sheets (MJ-Templates und Grid-Presets relevant, Kling/Seedance-Items ignorieren).
6. `SEENGRID_STRATEGY_AND_FUTURE_VISION_BRIEFING.txt` — Langfrist-Vision (Architektur nicht verbauen, nicht jetzt alles bauen).
7. `SeenGrid_grundgeruest_fuer_claude.md` — Konzeptionelles Grundgerüst.
8. **NanoBanana System Prompt** (extern, GitHub): https://github.com/jau123/nanobanana-trending-prompts/blob/main/prompts/system-prompt-en.md
9. **Trending Prompts Repo** (extern, GitHub): https://github.com/jau123/nanobanana-trending-prompts — 1500+ Community-Prompts als JSON.

---

## Tech Stack

- **Vite + React** (JavaScript, keine TS-Migration)
- **Keine Backend-Abhängigkeit** — reine Client-App
- **Daten in JSON-Dateien** unter `src/data/` oder `public/data/`
- **Deploybar auf Vercel/Netlify** (aktuell nur lokale `npm run dev`)

---

## Kontakt zu den Regeln

Die alten "ARBEITSREGELN GEGEN DRIFT" (6 Regeln) und der "PILOT-WORKFLOW GT-FIRST" aus der vorherigen CLAUDE.md-Version sind bewusst **nicht mehr hier**. Sie waren Reaktionen auf einen überkomplizierten Rebuild-Plan der jetzt verworfen ist. Die neue Anti-Drift-Strategie ist simpler und in drei Punkten ausreichend:

1. **Direkt auf main** — kein Branch-Chaos
2. **Drei-Datei-Hierarchie** (CLAUDE.md, BUILD_PLAN.md, SESSION_LOG.md) — kein Kontext-Verlust zwischen Chats
3. **Rendered-Output-Review vor Commit** — kein stiller Drift bei Prompt-Inhalt

Wenn eine Regel fehlt die du vermisst, frag Jonas — nicht selbst erfinden.
