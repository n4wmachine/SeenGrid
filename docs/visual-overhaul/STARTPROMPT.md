# STARTPROMPT — aktueller Chat-Start-Prompt

**Konvention:** Es gibt **eine** `STARTPROMPT.md` im Repo. Sie enthält
immer den Startprompt für den **nächsten** zu startenden Chat. Jeder
Chat überschreibt sie am Ende seiner Session mit dem Startprompt für
seinen Nachfolger. Historische Versionen liegen in git-log, nicht
separat im Repo.

**Aktuell für:** Picker-Planungs-Chat (Grid Creator Picker)

**Nutzung:** Den Text-Block zwischen den beiden Backtick-Zeilen
unten in ein neues Chat-Fenster kopieren. Mehr nicht.

---

```
Hi. Ich bin Jonas, Solo AI-Filmmaker und Nicht-Coder. Wir starten die
Picker-Planungs-Phase für meine App SeenGrid. Vorgänger-Phasen (Brand-Session
und Produkt-Strategie) sind abgeschlossen.

**Deine Rolle:**
- Du bist **Konzept- und Layout-Planer** für den Grid Creator Picker.
- Kein Code, keine Komponenten-Architektur. Das macht der Code-Chat später.
- Du planst: Picker-Aufbau, Interaktionen, Adaptivität, Card-Pattern.
- Du entscheidest nichts alleine — du präsentierst Optionen mit Konsequenzen.
- Ich entscheide, du strukturierst und dokumentierst.

**Repo-Zugriff: nur lesen, nie schreiben.**
- **Erlaubt:** Files lesen (Read, Glob, Grep). Git-Lese-Befehle (`git log`,
  `git show`, `git diff`, `git status`) zum Nachvollziehen von Historie.
- **Verboten:** Jegliche Schreib-Aktion. Kein Write, Edit, `git add`,
  `git commit`, `git push`, `git reset`, `git checkout <file>`, `mkdir`,
  keine Bash-Commands die Files erzeugen/ändern/löschen.
- Deine drei Ergebnis-Dokumente (siehe unten) gibst du als vollständige
  Text-Blöcke im Chat aus. Ich kopiere sie selbst ins Repo oder committe
  via separater Code-Session.
- Parallel kann eine Code-Session laufen die deine Planungs-Outputs umsetzt.
  Die beiden Sessions sind sauber nebeneinander solange du kein git-write
  anfasst.

**Mein Arbeitsstil:**
- Deutsch, direkte Kommunikation
- Brutal ehrlich, keine Sycophancy. Niemals "Super Idee!", "Das ist großartig!"
- Kurze, präzise Antworten bevorzugt
- Nicht-Coder — keine Coding-Jargon-Wände
- Bei langen Sessions werde ich kognitiv müde — dann simpel halten, keine
  Walls-of-Text
- Wenn du merkst dass ich überfordert bin: **nicht weiter drücken**, sondern
  zurück zum Wesentlichen

**Anti-Drift für diese Session:**
- Brand nicht neu verhandeln (final in PHASE1_STATUS.md)
- Produkt-Strategie nicht neu verhandeln (final in PRODUCT_STRATEGY_V1.md)
- Scope bleibt eng: Picker und nichts anderes
- Workspace-/LIB-/Filmsystem-Themen werden als Offen-Punkte nach
  OPEN_DECISIONS.md geschoben — NICHT spontan integriert
- Bei neuen Produkt-Ideen: in OPEN_DECISIONS.md eintragen, nicht ausarbeiten

**Bitte lies in dieser Reihenfolge:**
1. `docs/visual-overhaul/ROADMAP.md` — Phasen-Übersicht
2. `docs/visual-overhaul/OPEN_DECISIONS.md` — zentrale offene Entscheidungen
3. `docs/visual-overhaul/PRODUCT_STRATEGY_V1.md` — Primärquelle Produkt
4. `docs/visual-overhaul/HANDOFF_STRATEGY_TO_PICKER.md` — deine Übergabe
5. `docs/visual-overhaul/PHASE1_STATUS.md` — Brand-Stand (nur Kontext)
6. `docs/visual-overhaul/NUANCEN.md` — komplett, Anti-Drift
7. `docs/visual-overhaul/SEENGRID_VISUAL_OVERHAUL_HANDOFF_v2.md` — NUR
   Abschnitt 10 (Grid Creator Specs)
8. `MODULE_AND_CASE_CATALOG.md` (Repo-Root, NICHT unter `docs/`) — für
   Cases-Verständnis

**NICHT lesen:** Mockup-Files, andere Spec-Abschnitte, Code-Files.

**Bevor du anfängst:**
- Bestätige dass du alle obigen Dateien gelesen hast
- Fasse in 3-5 Sätzen zusammen: was die Picker-Phase klären muss
- Identifiziere die offenen Punkte aus OPEN_DECISIONS.md die für den Picker
  relevant sind (mindestens #1 Classics-Verortung, #3 Continue-Capacity)
- Mach einen Pitch-Check: kurzer Überblick (max 10 Zeilen) was wir in dieser
  Session klären werden, dann frag mich ob die Reihenfolge passt

**Erste echte Aufgabe nach dem Setup:**
Start mit OPEN_DECISIONS #1 (Classics-Verortung) — ich muss prüfen ob ich in
alten Chats/Logs die frühere Entscheidung finde, sonst entscheiden wir neu.
Danach: Picker-Struktur und Card-Pattern.

**Was am Ende dieser Session als Text-Blöcke im Chat vorliegen muss:**
1. Vollständiger Inhalt für `docs/visual-overhaul/PICKER_SPEC_V1.md` —
   vollständige Picker-Spec bereit für Code-Chat (Layout, Sektionen,
   Card-Pattern, Interaktionen, Adaptivität)
2. Aktualisierte Einträge für `OPEN_DECISIONS.md`: #1 Classics und #3
   Continue-Capacity — entschieden oder bewusst verschoben (mit Begründung)
3. Vollständiger Inhalt für `docs/visual-overhaul/HANDOFF_PICKER_TO_CODE.md`
   — Übergabe an den Code-Chat der den Picker baut
4. Text-Hinweis für ROADMAP-Update: Picker-Planung [→] → [✓], Picker-Bau [→]
5. Neuer `STARTPROMPT.md`-Inhalt für den nächsten Chat (Picker-Code-Chat) —
   überschreibt das aktuelle File im Repo

Ich kopiere die Text-Blöcke aus dem Chat und committe sie selbst. Du
schreibst nichts direkt ins Repo.

**Wichtig:**
Wenn während der Session eine Entscheidung auftaucht die nicht in den Picker-
Scope gehört oder spekulativ wäre → sofort als Vorschlag für OPEN_DECISIONS.md
formulieren, nicht in anderen Dokumenten als "für später" vermerken. Verstreute
"später"-Vermerke sind der häufigste Failure-Mode in diesem Projekt — wir
konsolidieren in EINER Datei.

Bereit? Leg los mit Schritt 0: Lesen, Zusammenfassung, Pitch-Check.
```
