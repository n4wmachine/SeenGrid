# SeenGrid Visual Overhaul — Roadmap

**Stand:** 2026-04-17
**Aktive Phase:** Brand-Session (in Vorbereitung)

---

## Phasen-Sequenz

```
[✓] Phase 1: Foundation (Shell + Landing + Rail) ......... fertig 2026-04-17
[→] Brand-Session: Schrift + Landing-Atmosphäre .......... AKTIV
[ ] Picker: Grid Creator Picker (Template-Auswahl)
[ ] Workspace: Grid Creator Workspace (3-Spalten + Bars) ..  größter Brocken
[ ] Token-Store Stufe 1: SeenLab schreibt, Grid Creator liest
[ ] SeenLab Visual-Update (Chips → Kacheln, 3-Spalten)
[ ] Coming-Pages finalisieren (Film, Board, Crop, Rev, Kit)
[ ] Legacy-Tab-Header entfernen (PAGE_TO_TAB Bridge raus)
```

---

## Was kommt nach der aktiven Phase

**Nach Brand-Session:** Picker-Phase startet. Picker liest die Brand-Entscheidungen aus `PHASE1_STATUS.md` und `HANDOFF_BRAND_TO_PICKER.md`.

**Reihenfolge ist nicht in Stein gemeißelt** — z.B. könnte SeenLab Visual-Update vorgezogen werden wenn Token-Store gebraucht wird. Aktive Phase wird hier markiert.

---

## Wer trifft welche Entscheidungen

- **Architektur** (Komponenten-Struktur, Routing, State-Management) → Spec + NUANCEN, nicht neu verhandeln
- **Brand** (Schrift, Farben, visuelle Atmosphäre) → Brand-Session
- **Implementation** (CSS-Werte, JS-Logik, kleine Layout-Details) → Code-Chats
- **Sequenz** (welche Phase wann) → Jonas + aktiver Planungs-Chat

---

## Was tun wenn ein Chat ratlos ist

1. `PHASE1_STATUS.md` lesen (was ist technisch Stand)
2. Diese Roadmap lesen (du bist hier)
3. Phasen-Handoff lesen (`HANDOFF_*_TO_*.md`, falls für aktive Phase vorhanden)
4. `NUANCEN.md` lesen (Anti-Drift)
5. Erst dann fragen oder eine Annahme treffen

---

## Pflege dieser Roadmap

**Wer aktualisiert:** Der Code-Chat am Ende seiner Phase. Eine Zeile umsetzen ([→] zu [✓] für die abgeschlossene Phase, [ ] zu [→] für die nächste). Stand-Datum aktualisieren. Eintrag committen + pushen.

**Wer NICHT aktualisiert:** Planungs-Chats, Jonas selbst (es sei denn manuelle Korrektur nötig).

---

## Phasen-Definitionen (Kurz)

**Phase 1: Foundation**
Shell-Struktur (Rail + Header + StatusBar), Landing-Page mit den drei Bändern (Continue/Quick Start/Discover), Routing, Page-Meta-Context, Coming-Page-Placeholder. Status: Technisch fertig, visuell unbefriedigend → daher Brand-Session.

**Brand-Session**
Schrift-Auswahl + Landing-Atmosphäre. Behebt die visuelle Unbefriedigung der Phase 1 bevor weitere Komponenten draufgebaut werden. Beinhaltet NICHT: Logo, Slogan, App-Name (separate Brand-Session später).

**Picker**
Grid Creator Einstiegs-Page mit Template-Auswahl. 10 Core Templates + Classics + Start from Scratch. Search + Filter-Pills. Card-Pattern.

**Workspace**
Grid Creator Edit-Modus. 3-Spalten-Layout (Case Context | Canvas | Inspector) + Full-Width Preview-Strip + Signatures-Bar + Output-Bar. Größter Bau-Block der Phase.

**Token-Store Stufe 1**
Zentraler Signature-Store. SeenLab schreibt Signatures, Grid Creator liest sie. Stufe 2 (Hub-Integration) und Stufe 3 (Vision-Features) kommen später.

**SeenLab Visual-Update**
3-Spalten-Layout, Chips zu Kacheln, Such-Input. Aktuelles Tab-Layout wird ersetzt.

**Coming-Pages**
Film, Board, Crop, Rev, Kit als Placeholder-Pages mit "COMING SOON" Mono-Label. Klickbar (nicht disabled).

**Legacy-Removal**
PAGE_TO_TAB Bridge raus, alter Tab-Header weg, alle Pages laufen über neue Routing.
