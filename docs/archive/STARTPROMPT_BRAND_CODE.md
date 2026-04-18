# Startprompt für Brand-Session Code-Chat

> **Anleitung für Jonas:** Diesen kompletten Text (alles unterhalb der Trennlinie) in den neuen Code-Chat reinkopieren als allererste Nachricht — **ABER ERST nachdem der Brand-Planungs-Chat seine erste konkrete Brand-Entscheidung getroffen und einen Auftrag formuliert hat.** Vorher brauchst du diesen Code-Chat nicht.

---

Hi. Ich bin Jonas, Solo AI-Filmemacher und Nicht-Coder. Du bist Code-Chat für eine dedizierte **Brand-Session** an meiner App SeenGrid (Vite + React + CSS Modules). Phase 1 ist technisch fertig, du baust jetzt die Brand-Anpassungen (Schriften, Atmosphäre, Layout-Polish der Landing).

Die bisherige Arbeit liegt auf Branch `claude/seengrid-visual-overhaul-6RK4n`. Falls du auf einem anderen Branch bist:
```
git fetch origin && git checkout claude/seengrid-visual-overhaul-6RK4n && git pull
```

**Bitte lies in dieser Reihenfolge — gezielt:**

1. `docs/visual-overhaul/ROADMAP.md` — Übersicht aller Phasen, wo wir stehen
2. `docs/visual-overhaul/PHASE1_STATUS.md` — aktueller Stand
3. `docs/visual-overhaul/NUANCEN.md` — komplett (Anti-Drift, ist kurz)
4. `docs/visual-overhaul/SEENGRID_VISUAL_OVERHAUL_HANDOFF_v2.md` **nur** Abschnitte 6 (Farbe), 7 (Typo), 9 (Landing), 19 (Globale UI-Rules)
5. `docs/visual-overhaul/mockup_01_shell_landing.html`
6. **Code-Files (Foundation für Landing):**
   - `src/components/landing/LandingPage.jsx`
   - `src/components/landing/LandingPage.module.css`
   - `src/styles/tokens.css`
   - `src/styles/globals.css`

**NICHT lesen:** Mockup_02, Mockup_03, andere Spec-Abschnitte, Code-Files außerhalb der Landing/Foundation. Token-Disziplin.

**Arbeitsstil:**
- Deutsch, direkte Kommunikation
- Brutal ehrlich, keine Sycophancy ("Super Idee!" etc. — nie)
- **Komplette Files statt Diffs** (ich kopiere 1:1 in VS Code, keine Diff-Anwendung möglich)
- Ein File pro Antwort bei mehreren — klar trennen mit "Datei 1 von 3" etc.
- Bestehende Grid Engine (Slices 1-8, 42 Tests) unberührt
- Bei Konflikten Mockup vs NUANCEN: NUANCEN gewinnt
- Code-Übergabe-Disziplin: nie behaupten committed zu haben ohne tatsächlich Commit-Hash zu nennen, Branch + Hash am Ende jeder Push-Aktion verifizieren

**Bekannte CSS-Falle (sehr wichtig):**

Es gibt einen globalen Reset in `globals.css`:
```css
.sg2-shell, .sg2-shell *, .sg2-shell *::before, .sg2-shell *::after {
  padding: 0;
  margin: 0;
}
```

Das hat schon einen Hero-Diagnose-Pfad in die falsche Richtung geführt — gesetzte Padding-/Margin-Werte werden überschrieben. Bei Style-Bugs **immer zuerst prüfen ob der globale Reset zuschlägt** bevor andere Ursachen vermutet werden. Falls du Padding/Margin auf Komponenten brauchst die innerhalb `.sg2-shell` liegen, brauchst du höhere Spezifität (z.B. `.sg2-shell .heroLogoInner` oder `!important` falls notwendig).

**Bevor du anfängst:**
- Bestätige mir dass du Roadmap, Status-Doc, NUANCEN, relevante Spec-Abschnitte (6/7/9/19), Mockup_01 und die vier Code-Files gelesen hast
- Fass in 3-5 Sätzen zusammen: aktueller Stand der Landing
- Nachfragen bei Unklarheiten, nicht raten

**Wichtig — am Ende deiner Phase:**

Wenn die Brand-Implementation steht und akzeptiert ist, **bevor du dich verabschiedest:**

1. `PHASE1_STATUS.md` aktualisieren mit den finalen Brand-Entscheidungen (welche Schriften, welche Atmosphäre-Werte)
2. `ROADMAP.md` aktualisieren — Brand-Session mit ✓ markieren, Picker mit → (aktiv) markieren
3. Beides committen + pushen
4. Bestätigung an mich: Branch + Commit-Hash + alles gepusht

**Wichtig:** Warte auf den konkreten Brand-Auftrag im nächsten Prompt (z.B. "swap Schriften zu X/Y/Z, mache Section-Labels größer, etc."). **Vorher keine Code-Änderungen.**
