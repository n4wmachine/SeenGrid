# Character Study — ChatGPT Ground Truth

**Datum:** 2026-04-14
**Status:** NanoBanana-validiert — nicht verändern ohne Re-Test
**Quelle:** Mit ChatGPT von Jonas erarbeitet und empirisch bei NanoBanana validiert. Wortwörtlich kopiert aus Jonas' Nachricht.
**Zweck:** Wahrheitsquelle für das Character Study Preset (Two-Step Flow). Jede Skeleton-, Modul- und Golden-Datei muss gegen diese Datei diff-bar sein. Wenn die Repo von diesem Text abweicht, ist die Repo falsch, nicht diese Datei.
**Regel:** Dieser Text wird nicht editiert, umformuliert, gekürzt, erweitert oder "optimiert". Änderungen nur nach neuem NanoBanana-Gegentest und nur durch Jonas selbst.

---

## Step 1 — Canonical Full-Body Normalizer

Pfad: `needs_normalization`. Optional / Fallback. Wird vorgeschaltet wenn das Original-Referenzbild (Reference A) kein sauberes Full-Body zeigt. Erzeugt den "Full-body master reference" den Step 2 dann als Hauptreferenz konsumiert.

```
Create one single full-body cinematic character image of the exact same person.

Priority:
- Reference B is the highest-authority source for facial identity and fine facial details.
- Reference A is the strict authority for hairstyle, body proportions, the exact outfit design, garment layering, colors, materials, accessories, footwear, and the original environment.

Critical requirement:
Show the complete character from the top of the head to the bottom of both feet.
Both shoes must be fully visible.
If the references are cropped or incomplete, reconstruct the missing lower body faithfully so the result becomes one complete canonical full-body version of the same character.

Outfit preservation:
Preserve the exact outfit from Reference A.
Do not redesign, restyle, replace, simplify, or invent new clothing items.
Keep the same garment structure, layers, silhouette, colors, materials, patterns, accessories, and footwear from Reference A.
If any part of the outfit is partially obscured in the reference, complete it conservatively in the same design language without adding new fashion elements.

Environment preservation:
Preserve the exact environment and visual world from Reference A.
Do not replace the background, do not move the character into a new location, and do not introduce a studio backdrop or neutral setting.
Keep the same atmosphere, spatial context, lighting mood, and environmental materials from Reference A.

Pose:
Natural relaxed standing pose.
Neutral balanced stance.
No dramatic action.

Framing:
Full-body shot with comfortable margin around the figure.
No body part touches the frame edge.

Lock:
Same identity, same hairstyle, same outfit, same colors, same materials, same footwear, same environment.

Do not add:
extra characters, extra props, text, labels, watermarks, cropped feet, hidden shoes, outfit changes, new clothing items, new accessories, hairstyle changes, new background, studio background, or simplified rendering.
```

---

## Step 2 — Cinematic Angle Study Panel Strip

Pfad: Haupt-Preset. Input = Full-body master reference (entweder Original wenn `clean_full_body`, oder Step-1-Output wenn `needs_normalization`) + Face reference. Default-Testfall: 4 vertikale Panels (front / right profile / left profile / back).

```
Create one finished cinematic panel strip as four tall vertical panels arranged side by side in a single horizontal row.. Use the provided references as follows: - Full-body master reference = highest authority for body proportions, hairstyle, outfit, colors, materials, and footwear - Face reference = highest authority for facial identity and fine facial details Goal: Show the exact same character in four distinct full-body cinematic views. This is a polished cinematic panel strip, not a neutral studio turnaround sheet. Panel order from left to right: 1. Full-body front view 2. Full-body character's right side profile 3. Full-body character's left side profile 4. Full-body back view Critical orientation rule: - Panel 2 must show the character's right side to the camera - Panel 3 must show the character's left side to the camera - Panel 2 and Panel 3 must be true opposite side views, not duplicated and not mirrored versions of the same side Critical full-body rule: Every panel must show the complete figure from head to both feet. Both shoes must be fully visible in every panel. No cropped legs, no cropped feet, no hidden footwear. Consistency: Keep identical facial identity, hairstyle, body proportions, outfit, colors, materials, and footwear across all four panels. Keep the same environment, same lighting direction, same mood, and same rendering quality across all panels. Pose: Natural relaxed standing pose. Calm balanced posture. Only the viewing angle changes from panel to panel. Layout: Four tall vertical panels in one horizontal row. Even spacing between panels. Each figure fully contained inside its own panel with a small margin around the silhouette. Do not add: text, labels, captions, watermarks, extra characters, extra props, studio background, identity drift, outfit drift, hairstyle drift, material drift, cropped body parts, hidden shoes, or mirrored reuse of the same side profile.
```
