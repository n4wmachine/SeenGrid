# SeenGrid Visual Overhaul — Nuancen & Design-Rationale

**Zweck dieses Dokuments:** Der `HANDOFF_v2.md` beschreibt das *Was* (Specs, Maße, Farben, Pattern). Dieses Dokument erklärt das *Warum*. Es schützt den aktuellen Bau davor, dass spätere Sessions unbewusst Entscheidungen kippen, die aus Gründen getroffen wurden die nicht offensichtlich im Code stehen.

**Wenn du als Claude-Code-Agent diese Datei liest:** Das hier sind keine Vorschläge oder Diskussionspunkte. Das sind Leitplanken. Jede Versuchung etwas "schöner", "einfacher", "konventioneller" zu machen, gegen die hier dokumentierte Entscheidung spricht, ist fast immer **Drift** und muss mit dem User abgeklärt werden bevor sie umgesetzt wird.

---

## 1. Die Gold-vs-Teal-Systematik ist das Herzstück

**Regel:** Teal ist universell für Aktiv/Primary. Gold ist **ausschließlich** für User-persönliche Qualitätsmarkierungen.

**Warum diese Trennung heilig ist:**

Ein visuelles Sprachsystem funktioniert nur durch Konsistenz. Wenn Gold an zwei Stellen unterschiedliche Bedeutungen hat, trainiert der User zwei widersprüchliche Lese-Reflexe an — und das System wird für ihn unklar, egal wie schön es aussieht.

**Was Gold bedeutet:** "Das hier kommt von dir. Das ist deine persönliche Qualität."
- Signatures (User hat das gespeichert)
- Override-Dots (User hat global-value überschrieben)
- Grid-Rail-Stern (User arbeitet im Herzstück)
- Signatures-Bar
- Applied-Signature-Card im Inspector

**Was Gold NICHT bedeutet:** "Das ist premium/wichtig/besonders."
- Classics bekommen KEIN Gold, obwohl sie "hochwertige fertige Rezepte" sind
- Featured Prompts im Hub bekommen kein Gold
- Popular Templates bekommen kein Gold

**Anti-Pattern das auftreten wird:** Ein Agent sieht Classics und denkt "die sollten irgendwie premium aussehen". Macht eine Gold-Akzentlinie dran. Gerechtfertigt sich mit "wirkt wertiger". → **Das verwässert die Gold-Signal-Bedeutung.** Classics sind neutral. Punkt.

---

## 2. Der Override-Dot und Signature-Applied sind ZWEI unabhängige States

**Regel:** Ein Panel kann vier Zustände kombinieren — neutral, mit Override-Dot, mit Signature-Applied-Tint, mit beidem.

**Warum beide unterschiedlich aussehen müssen:**

Die zwei Konzepte haben verschiedene mentale Modelle:
- **Override** = "per-Panel-Konfiguration weicht vom globalen Default ab" (prozedural)
- **Signature-Applied** = "gespeicherter Look-Token wurde hier eingehängt" (deklarativ/objekthaft)

Der User muss beide beim Scannen eines Grids sofort unterscheiden können, ohne zu denken. Deshalb:
- Override: Goldener **Dot** oben rechts am Panel (Signal: "punktuelle Abweichung hier")
- Signature-Applied: Goldener **Border-Tint** + subtiler Glow um das ganze Panel (Signal: "Objekt umhüllt das ganze Panel")

**Anti-Pattern:** Ein Agent vereinfacht "war doch beides gold" und fasst zusammen → Dot wird zu Border oder umgekehrt. → Der User verliert die Unterscheidung. Kritischer Fehler. Beide States müssen koexistieren können an **demselben Panel gleichzeitig**.

---

## 3. Die Rail ist nicht einklappbar. Absichtlich.

**Regel:** Rail-Breite ist 88px fix. Keine Collapse-Funktion, keine Expand-Funktion, keine responsive Verkürzung.

**Warum das gegen die Konvention ist:**

Viele Tools (VSCode, Cursor, etc.) haben einklappbare Sidebars. Der User kann Platz sparen wenn er ihn braucht. Bei SeenGrid wäre das ein Fehler, weil:

- Das Tool ist Canvas-zentriert (Grid Creator, SeenLab). Wenn die Rail einklappt, verändert sich das Gesamtlayout und der User muss sich neu orientieren jedes Mal.
- Der User arbeitet mit komplexen Grids die sowieso den Canvas-Platz voll ausnutzen. Die 88px der Rail sind gegenüber einem 1920px-Screen <5% — irrelevant für Content-Platz.
- Eine Collapse-Funktion baut State-Complexity (was ist auf/zu, remember Preference, Keyboard-Shortcut, Animation, etc.) für **null Nutzen**.

**Anti-Pattern:** Agent liest "modernes Web-App-Pattern" im Internet, schlägt Collapse-Feature vor, begründet mit "User sparen Platz". → Ablehnen. Die Entscheidung ist bewusst, nicht vergessen.

---

## 4. Coming-Pages sind klickbar, nicht disabled

**Regel:** Film, Board, Crop, Rev, Kit (alle "coming" Pages) sind voll klickbar, führen zu einer "COMING SOON"-Placeholder-Page.

**Warum nicht disabled:**

Disabled-Items vermitteln "geht nicht, hier ist Sackgasse". Das ist falsch — die Pages kommen ja. Ein **klickbarer Slot der auf eine Placeholder-Page führt** vermittelt:
- "Das Feature ist geplant"
- "Du kannst hier schon klicken"
- "Es passiert nur noch nichts — aber der Slot ist real"

Das macht die Rail zu einer **Versprechens-Karte statt einer Beschwerde-Liste.** Der User weiß was kommt, kann sich drauf freuen, und die Platzhalter-Pages können später gefüllt werden ohne die Rail-Struktur zu ändern.

**Anti-Pattern:** Agent macht Coming-Pages disabled weil "sie gehen ja nicht". → Ablehnen. Navigationslogik ist das Feature, nicht die Funktion dahinter.

---

## 5. Keine Tabs mehr, nirgends — auch nicht als "es ist schneller"

**Regel:** Der Visual Overhaul ersetzt die Tab-Struktur komplett. Nichts in der neuen Struktur darf Tabs reintroduzieren.

**Warum Tabs in diesem Tool nicht passen:**

Tabs signalisieren "mehrere parallele Kontexte, schnell wechselbar". Das passt zu Browsern, Spreadsheets, IDEs. Passt nicht zu SeenGrid, weil:

- Jede Page ist ein eigener **Arbeitsmodus**, kein paralleles Fenster. Du bist im Grid Creator ODER in SeenLab, nicht in beiden gleichzeitig.
- Tabs sammeln sich an und werden unübersichtlich. Das alte SeenGrid hatte fünf Tabs — das ist schon das Maximum bevor's chaotisch wird. Die neue Struktur plant 10+ Pages, das wäre als Tab-Bar unlesbar.
- Pages in einer Rail haben **stabile Positionen** — der User entwickelt Muskelgedächtnis ("Grid ist das dritte Icon"). Bei Tabs wandern die je nach Öffnungsreihenfolge.

**Ausnahme die erlaubt ist:** Sub-Sektionen innerhalb einer Page (z.B. SeenFrame hat drei Sub-Bereiche Fields / Templates & Medium / Filmstock) können als Tabs oder Segmented-Control gebaut werden. Das ist lokale Navigation, nicht globale.

**Anti-Pattern:** Agent baut "Recent Pages"-Tabs irgendwo. Oder macht Grid Creator Picker und Workspace zu Tabs innerhalb einer Grid-Creator-Page statt als State-Wechsel. → Ablehnen.

---

## 6. Grid Creator: Picker und Workspace sind States einer Page, keine Modals, keine Tabs

**Regel:** Der Grid Creator hat zwei vollwertige Bildschirmfüllungs-States. Picker = Volldarstellung von Templates. Workspace = Volldarstellung des Edit-Modus. Kein Overlay, kein Modal, kein Split-Screen.

**Warum nicht Modal:**

Ein Modal impliziert "kurzer Auswahl-Akt, dann zurück zur Hauptsache". Aber das Template-Auswählen ist **eine Hauptsache** — der User scrollt durch, liest Descriptions, vergleicht, entscheidet. Das ist keine 3-Sekunden-Entscheidung. Deswegen voll-Page.

Ein Modal würde auch das Hauptsächliche (den leeren Canvas dahinter) verschwenden — leerer Canvas ist keine nützliche Information, nur visuelles Rauschen.

**Warum nicht Split:**

Manche Tools zeigen Templates-Sidebar + Canvas-Preview daneben. Klingt nett, in der Praxis: Sidebar ist zu eng für richtige Preview-Thumbs, Canvas zu leer wenn noch kein Template gewählt. Split-Layouts gewinnen nur wenn beide Seiten permanent relevant sind. Hier nicht.

**Anti-Pattern:** Agent macht "wäre doch kompakter als Modal" oder "baut Templates als Dropdown". → Ablehnen. Picker-State ist volle Page, Workspace-State ist volle Page, State-Wechsel ist ein React-Zustand.

---

## 7. Der Preview-Strip im Workspace ist Full-Width, NICHT in der Canvas-Spalte

**Regel:** Der Preview-Strip (96px Höhe, zeigt die Gesamtvorschau des Grids) liegt **unter** der 3-Spalten-Row (Case Context | Canvas | Inspector), nicht in der Canvas-Spalte.

**Warum das kritisch ist:**

Zweck des Preview-Strips: der User sieht auf einen Blick "so wird das insgesamt aussehen" — unabhängig davon welches Panel er gerade im Canvas editiert. Das ist **Meta-Information über das ganze Grid**, nicht über den Edit-Zustand.

Wenn der Strip in der Canvas-Spalte wäre:
- Er wird zerquetscht zwischen den Nachbarspalten
- Er wirkt als ob er zum Canvas gehört (Edit-Modus) statt als eigene Ebene
- Horizontal-Scroll wird unmöglich weil die Breite zu klein ist

In einer frühen Mockup-Version war genau dieser Fehler drin — der Strip war in der Canvas-Spalte eingezwängt. Wurde korrigiert. Darf nicht rückgängig gemacht werden.

**Anti-Pattern:** Agent dekomponiert "das gehört doch zum Canvas" und verschiebt's in die Spalte. → Full-Width ist Absicht, nicht zufälliges Layout.

---

## 8. Ein Grid Creator, kein GridOperator2

**Regel:** Der neue Grid Creator ist **neu from scratch**. Der alte GridOperator bleibt als parkierte Legacy-Komponente im Repo (temporär, bis Phase wechselt), wird aber nicht der Kern vom neuen Grid Creator.

**Warum nicht "einfach den alten styled neu":**

Der alte GridOperator ist ein Formular. Case wählen → Felder ausfüllen → Prompt kommt raus. Das ist der Verstand-Modus.

Der neue Grid Creator ist ein **Canvas-Tool**. Du siehst das Grid visuell, klickst Panels an, siehst Silhouetten, hast Preview-Strip, Signatures-Bar. Das ist der Augen-Modus.

Die zwei Paradigmen sind nicht miteinander verträglich. "Altes Tool neu stylen" würde einen Formular-zentrierten Grid Creator mit neuer Farbe erzeugen — das Gegenteil vom Ziel.

**Anti-Pattern:** Agent nimmt abgekürzten Weg, importiert GridOperator-Komponente, wickelt sie in neues CSS. → Ablehnen. From scratch bauen. Die alten Daten-Schemas (Cases, Modules JSON) können wiederverwendet werden, aber die UI-Layer ist neu.

---

## 9. SeenFrame bleibt isoliert von den anderen Tools

**Regel:** SeenFrame teilt keinen Signature-Store mit den anderen Tools. Eigene Filmlook-Library, eigener Namespace, keine Cross-Tool-Signatures.

**Warum das gegen "wäre doch nice wenn man überall die gleichen Looks nutzen kann" steht:**

MJ-Syntax ist fundamental anders als NanoBanana-Prompts. Ein "noir look" in SeenLab ist ein Stack aus spezifischen Chips (Film Style: Noir, Lighting: Low-key, Color: Desaturated, etc.). Ein "noir look" in MJ ist ein Prompt-Snippet mit MJ-spezifischen Parametern (`--style raw`, `--sref`, etc.).

Wenn man den User einen SeenLab-Noir-Signature in SeenFrame anwenden lassen würde, müsste automatisch übersetzt werden. Das wäre entweder:
- Schlechte Übersetzung (Feature wirkt kaputt)
- Aufwändige Infrastruktur (Translation-Layer für jede Tool-Kombination)
- Verwirrender User (wendet Token an, kriegt was anderes als gedacht)

Die saubere Lösung: **Akzeptieren dass die Tools verschiedene Sprachen sprechen.** SeenFrame hat seine eigenen Filmlooks. Das ist keine fehlende Feature, das ist eine korrekte Grenzziehung.

**Anti-Pattern:** Agent erweitert später "aus Benutzerfreundlichkeit" den Signature-Store auf SeenFrame. → Ablehnen.

---

## 10. Token-Begriff in UI ist "Signature". Intern darf "Token" bleiben.

**Regel:** Die User-Facing-UI sagt immer "Signature". Der interne Code darf `tokenStore`, `Token` Interface, etc. heißen wenn das technisch sinnvoller ist.

**Warum diese Trennung:**

"Token" hat im LLM-Kontext eine technische Konnotation (die kleinsten Einheiten die ein Modell verarbeitet). Ein User der seinen gespeicherten Look als "Token" sieht, denkt er hat was Technisches — nicht was Kreatives.

"Signature" dagegen trägt:
- Persönlichkeit ("meine Signatur")
- Qualität (was ein Künstler auf seine Arbeit setzt)
- Wiedererkennbarkeit (ein Signature-Sound in Musik, Signature-Shot in Film)

Das ist der Ton den wir treffen wollen: **kreatives Werkzeug, nicht Dev-Tool.**

**Anti-Pattern:** Agent harmonisiert "intern und extern gleich nennen ist sauberer". → Ablehnen. Das Naming-System hat Zweck.

---

## 11. Brand-Präsenz: Editorial statt Splash (überholt + neu gefasst 2026-04-18)

**Frühere Regel (Brand-Session 2026-04-17, durch Landing-Redesign 2026-04-18 überholt):**
> Landing hat einen expliziten Hero-Bereich mit großem Logo + Wordmark (72px). Brand-Präsenz durch Raumverbrauch.

**Warum die Änderung:**
Der Hero fraß den Fold — bei 1080p war unter dem 200px-Logo-Block + 72px-Wordmark + 80px-Abstand nur noch Continue sichtbar, Quick Start und Discover erforderten Scrolling. Brand-Moment ja, aber auf Kosten der Nutzbarkeit als Pro-Tool-Home.

**Neue Regel:**
Landing trägt Brand durch **Editorial-Layout**, nicht durch Raumverbrauch. Drei parallele Mechanismen:

1. **Masthead als konstanter Präsenz-Träger ohne Fold-Kosten** — schmale Leiste (~75px) mit Wordmark (24px), Claim, Session-Metadata. Liest sich wie Zeitungskopfzeile / DAW-Header (Ableton, Resolve). Selbstbewusst, nicht prahlerisch.
2. **Discover als Hero-Ersatz** — kuratierte Mood-Cards mit Filmmaker-Sprache (`prisoners look · deakins · noir`) sind bereits Identität. Kein anderes Tool verwendet diese Sprache. Das ist die Marke, nicht der Wordmark.
3. **Session-Metadata im Masthead** (`v0.4.2 · 3 signatures · 18 prompts · saved 14m ago`) — signalisiert echtes Produkt mit echter Arbeit, kein leeres SaaS-Template.

**Was bleibt aus der alten Fassung:**
- Rail-Brand-Zone (Logo-Mark ohne Wordmark) bleibt unverändert — ist nicht Hero, sondern Utility.
- Wordmark wird im Content-Bereich weiterhin geführt (jetzt im Masthead, nicht zentriert groß).

**Anti-Pattern (neu):**
- Agent argumentiert "Linear/Figma machen den Header noch kleiner, lass das Session-Metadata weg". → Ablehnen. Die Metadata ist der Brand-Moment-Ersatz für den entfallenen Hero.
- Agent will den alten 72px-Hero zurückholen ("mehr Brand-Präsenz"). → Ablehnen. Die Entscheidung wurde empirisch getroffen.
- Agent baut eine Pre-Landing / Splash-Page vor der Landing. → Ablehnen. Generisches SaaS-Muster.

**Quelle:** `docs/visual-overhaul/LANDING_REDESIGN_STATUS.md`

---

## 12. Die Scrollbars, die Tooltip-Dichte, die kleinen Transitions — die machen "Pro-Tool" aus

**Regel:** Nichts was Browser-Default ist darf bleiben. Scrollbars custom-styled, Tooltips Rich mit Titel + Desc, Transitions subtle aber überall (0.18s ease default).

**Warum diese Detail-Pedanterie:**

Der Unterschied zwischen "billige React-App" und "professionelles Pro-Tool" liegt zu 80% in Mikro-Details:
- Eine Windows-95-Scrollbar in einer Dark-UI reisst die Illusion sofort
- Tooltips die nur das Label wiederholen sind Schein-Tooltips (macht keiner mit, alle hovern)
- Hover-States die snappy sind (0.18s) fühlen sich präziser an als langsame (0.3s+)
- Hover-Transforms (translateY(-2px)) geben den UI-Elementen "Physikalität"

Das ist nicht Kosmetik. Das ist **Wahrnehmungs-Arbeit.** Der User merkt nicht dass die Scrollbar custom ist — er merkt nur dass die App "sich teuer anfühlt". Ziel erreicht.

**Anti-Pattern:** Agent spart "die Custom Scrollbar brauch ich jetzt nicht, Browser-Default tut's auch". → Ablehnen. Die Details sind das Ziel, nicht Overhead.

---

## 13. Discovery Principle: Tools-First vor Konzept-Entwicklung

**Regel (aus Projekt-Kultur, nicht direkt UI-relevant aber gut zu wissen):** Jonas validiert was die AI-Tools (NanoBanana, MJ, Kling) tatsächlich produzieren können bevor er Konzepte entwickelt. "Was tut das Tool?" kommt vor "Was will ich?".

**Warum das für den Bau relevant ist:**

Das bedeutet: Wenn im Grid Creator eine Funktion geplant ist die ein **technisches Verhalten der Generatoren** voraussetzt (z.B. Normalizer 2-Step, Seamless-Layout, Grid-Size-Limits), dann sind diese Entscheidungen **empirisch validiert**. Nicht in Frage stellen. Nicht "wäre doch einfacher ohne".

Beispiele:
- 6×4 Dimension-Builder mit Advisory "HIRES / STANDARD / LOW / TINY" — das sind vier validierte Quality-Regions basierend auf Pixel-pro-Panel-Berechnungen (frühere Fassung listete fünf Stufen inkl. "PERFECT"; korrigiert in der Workspace-Planungs-Session 2026-04-19 nach Git-History-Abgleich von `getDimAdvice()`)
- Normalizer 2-Step — das ist ein validierter Workflow-Fix für das Problem dass Referenzbilder oft Portraits statt Full-Body sind
- 12px Gap zwischen Panels im Canvas — das ist der Wert bei dem Grids in NanoBanana sauber getrennt werden ohne dass der Grid-Character verloren geht

**Anti-Pattern:** Agent ändert diese Specs weil "runder wäre schöner". → Ablehnen. Die Specs sind Engineering-Entscheidungen, nicht Design-Bauchgefühl.

---

## Wie dieses Dokument zu nutzen ist

**Als neuer Claude-Code-Chat zu Beginn einer Session:**
1. Original-Spec lesen: `SEENGRID_VISUAL_OVERHAUL_HANDOFF_v2.md`
2. Dieses Dokument lesen: `NUANCEN.md`
3. Aktueller Stand lesen: `PHASE1_HANDOFF.md` (falls vorhanden)
4. Erst dann bauen

**Wenn du als Agent eine Design-Entscheidung treffen musst die nicht explizit spezifiziert ist:**
1. Schau ob hier im Dokument ein ähnliches "Warum" steht
2. Leite draus ab was konsistent wäre
3. Wenn unklar → User fragen, nicht raten

**Wenn du als Agent eine Versuchung spürst etwas zu vereinfachen/schöner-machen was gegen den Handoff spricht:**
1. Check ob hier im Dokument explizit das Anti-Pattern beschrieben ist
2. Wenn ja → Versuchung ignorieren, Spec folgen
3. Wenn nein → User fragen, nicht einfach tun

**Ende Nuancen-Dokument.**