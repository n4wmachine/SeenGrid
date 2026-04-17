# SeenGrid — Feature Vision & Ideen

**Stand:** 2026-04-16
**Status:** Ideensammlung. Nichts davon ist im aktuellen Build-Scope. Wird erst angegangen wenn die Grid Engine steht.

---

## 1. 2-Stufen LLM Filmsystem

User wirft sein Skript rein, beantwortet ein paar Fragen zu Stimmung/Look/Style. Im Hintergrund:

- **LLM 1 (Director):** Bearbeitet das Filmsystem-Dokument, erzeugt einen vollständigen Szenenplan. Emotionale Pole, Pacing, Shot-Leiter, Pillow Shots, visuelle Motive — alles filmisch durchdacht, tool-agnostisch.
- **LLM 1.5 (Validator):** Prüft ob LLM 1 irgendwas falsch gemacht hat. Wenn ja → Feedback-Loop zurück. Wenn nein → weiter.
- **LLM 2 (Producer):** Bearbeitet das Prompt-Modul-Dokument, erzeugt den finalen Shotplan mit allen Details, paste-ready Prompts für Kling/Seedance, NanoBanana-Startframe-Prompts.

User kriegt seinen fertigen Plan. Kann direkt im Grid Creator Startframes bauen, Look aus Look Lab konsistent auf den ganzen Film legen, Startframe-Prompts direkt in den Grid Creator laden.

**Basis:** Jonas' erprobtes 2-stufiges LLM-Filmproduktionssystem (zwei Textdateien, trial/error-optimiert, funktioniert bereits manuell).

**Technisch:** Braucht ein Backend (Serverless Functions auf Vercel) für LLM-API-Calls. Gratis/günstige LLMs (z.B. Step Flash), 2-3 Versuche pro Tag pro User, kostet effektiv nichts.

---

## 2. Reverse Engineering Bild-Tool

User hat ein Bild dessen Look ihm gefällt. Lädt es in SeenGrid hoch. Statt nur einer Bildbeschreibung: SeenGrid extrahiert die passende Look-Chip-Zusammenstellung aus dem Look Lab. User kann den Look direkt als Token speichern und überall verwenden.

**Flow:** Bild hochladen → Vision-API analysiert Style-Attribute → Look Lab Chips werden gematcht → als Token speicherbar → sofort im Grid Creator nutzbar.

**Technisch:** Läuft über denselben LLM/Vision-Backend-Layer wie das Filmsystem.

---

## 3. Consistency Kit Builder

Geführter Multi-Grid-Workflow für maximale Character-Consistency in Video-KIs (Kling, etc.). Statt ein einzelnes Reference Sheet: ein komplettes Bilderpaket nach diesem Schema:

- **Hauptbild:** Full Body, 3/4 Winkel, höchste Qualität — primäre Identitätsextraktion
- **Referenz 1 — Face Identity Sheet (3x2):** Frontal, 3/4 Links/Rechts, Profile, Upward Gaze
- **Referenz 2 — Body 360° Sheet (3x2):** Full Body aus 6 Winkeln
- **Referenz 3 — Wildcard Slot:** Situativ je nach Charakter:
  - Option A: Asymmetrische Features (Narben, Tattoos)
  - Option B: Outfit-Details (Rüstung, Textur, Accessoires)
  - Option C: Expression Sheet (Neutral, Happy, Angry, Sad, Surprised)
  - Option D: Action Pose Sheet (charakteristische Bewegungsposen)

Nutzt bestehende Grid-Creator-Cases (character_angle_study, expression_sheet, etc.) in einer geführten Reihenfolge. Kein neuer Engine-Code nötig.

---

## 4. Community Hub / App Store Vision

Zwei mögliche strategische Richtungen (Entscheidung kommt wenn klar ist wer SeenGrid tatsächlich nutzt):

**Richtung A — Community Hub:**
- Zentrale Plattform für aktuelle Trending Prompts (statt Reddit/X/GitHub durchsuchen)
- App Store Release (iOS/Android)
- API-Integration für direkte Bildgenerierung im Grid
- Paid Plan
- Anime/Pixar-Community im Backend bedienen ohne das cinematische Frontend zu verwässern

**Richtung B — Pro Tool:**
- Weiter in die Tiefe für ernsthafte Filmemacher
- Einzigartige Pre-Production Features ausbauen
- Fokus auf den professionellen Workflow

Beides schließt sich nicht gegenseitig aus — Priorität bestimmt wohin die Energie geht.

---

## 5. Shot Dashboard / Visual Production Board

Kein klassisches Text-Dashboard. Ein visuelles Produktionsboard im PureRef-Stil:

- Alle Szenen und Shots des Films als visuelle Leiste — du siehst deinen Film als Bilderfolge
- Generierte Startframes/Frames direkt per Drag & Drop reinschieben
- Visuelles Storyboard/Direction Board: jeder Shot hat seinen Slot, du siehst sofort wo Lücken sind, wo Farbstimmung nicht passt, wo Übergänge fehlen
- Fortschritt des Films auf einen Blick sichtbar
- Szenen und Shots können umgeordnet, angepasst, annotiert werden

**Verbindung zum Filmsystem:** Der Director erzeugt den Szenenplan → das Board zeigt die leeren Slots visuell → User füllt sie nach und nach mit generierten Frames.

**Eigenständig nutzbar:** Auch ohne LLM-Filmsystem sinnvoll für jeden der einen Film manuell plant und Übersicht braucht.

---

## 6. Grid Cropper + Upscaler

Statt 6 oder 9 Panels einzeln zu croppen: User lädt seine generierten Grids auf SeenGrid hoch, SeenGrid croppt alle Panels automatisch auf einen Schlag und **upscaled sie auf Vollbild-Format** (soweit mit Gratis-Upscaler oder Python möglich — kein Topaz-Niveau, aber brauchbar für Startframes). Der User weiß vorher bereits durch den Dim Advisory im Grid Creator wie groß seine Panels in 2K/4K sein werden und ob sie als Startframe tauglich sind.
