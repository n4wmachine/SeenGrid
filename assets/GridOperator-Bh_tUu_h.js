import{u as G,r as c,j as e}from"./index-JXRu5LNb.js";const K="_container_1y74m_6",M="_controlsColumn_1y74m_18",H="_modeToggle_1y74m_25",q="_modeToggleBtn_1y74m_33",V="_active_1y74m_51",W="_section_1y74m_58",Z="_sectionTitle_1y74m_65",Q="_presetList_1y74m_76",J="_presetItem_1y74m_82",X="_presetName_1y74m_102",ee="_presetDesc_1y74m_113",te="_presetBadge_1y74m_120",ne="_gridSize_1y74m_135",ae="_gridSizeNote_1y74m_143",oe="_layoutChips_1y74m_153",re="_previewColumn_1y74m_160",se="_previewPanel_1y74m_165",ie="_previewTitle_1y74m_173",le="_gridOutput_1y74m_208",a={container:K,controlsColumn:M,modeToggle:H,modeToggleBtn:q,active:V,section:W,sectionTitle:Z,presetList:Q,presetItem:J,presetName:X,presetDesc:ee,presetBadge:te,gridSize:ne,gridSizeNote:ae,layoutChips:oe,previewColumn:re,previewPanel:se,previewTitle:ie,gridOutput:le},ce="world-zone-board-3x3",de="World Zone Board",pe="SeenGrid Optimized",he=3,ge=3,ue="9 räumlich verbundene Zonen eines Filmschauplatzes. Jede Zone = begehbarer Bereich.",me="Even",fe="DeepSeek1.txt — 3x3GRIDS.txt PROMPT 1",ye=`World Zone Builder 3x3
You are given a reference image or a location description.

TASK
Create a 3x3 world zone board of one physically connected cinematic location. Treat this place like a real film set — the viewer must clearly understand how a character could physically move between the zones.

REFERENCE PRIORITY
Preserve: world identity, material family, lighting family, atmosphere, terrain/architectural logic, spatial relationships.

ZONE DESIGN
Each of the 9 panels shows a distinct but logically connected zone of the same location.
Adapt the zones naturally to your scene (examples: entrance, narrow passage, threshold, main locus, observation point, hidden depth, side alley, elevated vantage, aftermath area).

COHERENCE RULE
All 9 zones must feel like believable parts of ONE single place. Same materials, same light logic, same atmosphere, same time of day. Each zone should feel like the most natural continuation of the previous one.

LAYOUT
3x3 grid. Clean alignment. Even spacing. Thin subtle separators. No text. No labels.

QUALITY ANCHOR
Premium cinematic rendering, rich material detail, atmospheric depth, correct perspective and scale across all panels.

FORBIDDEN
No disconnected zones. No architecture or geology drift. No random fantasy clutter without spatial logic. No quality downgrade.`,be=["Entrance","Narrow Passage","Threshold","Main Locus","Observation Point","Hidden Depth","Side Alley","Elevated Vantage","Aftermath Area"],ve=[{id:"location",label:"Location / Reference",placeholder:'z.B. "abandoned Soviet factory, winter, blue dusk" oder Referenzbild-Beschreibung',required:!0}],xe={id:ce,label:de,badge:pe,rows:he,cols:ge,desc:ue,layout:me,source:fe,prompt:ye,panelRoles:be,inputFields:ve},Se="multishot-3x3-single-zone",Ee="3x3 Multi-Shot (Single Zone)",Re="SeenGrid Optimized",Ne=3,we=3,Te="9 aufeinanderfolgende Film-Beats in einer Zone. Storyboard, keine Variations-Tabelle.",Ce="Even",Ae="DeepSeek1.txt — 3x3GRIDS.txt PROMPT 2A",$e=`3x3 Multi-Shot Grid — Single-Zone Version
You are given:
Reference A = character master reference (or OpenArt Character Asset)
Reference B = world zone board or single integrated scene

TASK
Pick one zone from Reference B.
Create a cinematic 3x3 sequence of nine consecutive film beats inside that single zone. This is a short scene / storyboard, not a variation sheet. Each panel must add new visual or emotional information.

REFERENCE PRIORITY
Character identity, face, proportions, outfit, materials = Reference A (Face Crop has highest authority).
Spatial identity, materials, light, atmosphere of the chosen zone = Reference B.

PANEL FUNCTIONS (von links oben nach rechts unten lesen):
Panel 1: Establishing shot — where are we? (wide, sets scale and mood)
Panel 2: Atmospheric insert — one specific tactile detail (texture, object, small motion)
Panel 3: Character introduction beat — who is here and in what state?
Panel 4: Tension build — subtle shift or clue that something is off
Panel 5: Emotional / character beat — internal reaction or micro-action
Panel 6: Escalation — action or disturbance intensifies
Panel 7: Peak tension or reveal moment
Panel 8: Immediate consequence / payoff
Panel 9: Lingering aftermath or eerie lingering detail

CONTINUITY RULE
Each panel must motivate the next. Elements from earlier panels (light, objects, atmosphere) must affect or pay off in later panels. The viewer must feel a continuous short scene unfolding in one coherent space.

LAYOUT
3x3 grid. Even spacing. Thin subtle separators. No text. No labels.

LOCKED
Same character identity, same outfit, same zone, same atmosphere and lighting across all 9 panels.

VARIABLE
Camera angle, distance, composition, character position, subtle action/motion.

FORBIDDEN
No face or outfit drift. No zone changes within the sequence. No duplicated or near-identical shots. No pasted-in character feeling. No quality drop.`,Ie=["Establishing Shot","Atmospheric Insert","Character Introduction","Tension Build","Emotional Beat","Escalation","Peak / Reveal","Consequence / Payoff","Lingering Aftermath"],Oe=[{id:"charRef",label:"Reference A — Character",placeholder:"Charakter-Beschreibung oder Referenzbild",required:!0},{id:"zoneRef",label:"Reference B — Zone/Scene",placeholder:"Zone aus World Zone Board oder Szenenbeschreibung",required:!0}],Fe={id:Se,label:Ee,badge:Re,rows:Ne,cols:we,desc:Te,layout:Ce,source:Ae,prompt:$e,panelRoles:Ie,inputFields:Oe},Pe="multishot-3x3-cross-zone",De="3x3 Multi-Shot (Cross Zone)",Be="SeenGrid Optimized",Le=3,_e=3,ke="Mini-Story: Bewegung durch 3 Zonen. Location Journey, räumliche Progression.",je="Even",ze="DeepSeek1.txt — 3x3GRIDS.txt PROMPT 2B",Ue=`3x3 Multi-Shot Grid — Cross-Zone Version
You are given:
Reference A = character master reference
Reference B = world zone board (3x3 zones)

TASK
Create a cinematic 3x3 sequence showing a short location journey that moves through the zones from Reference B. Use the zone board as a believable spatial path. This is a mini-story / location progression, not random shots.

REFERENCE PRIORITY
Character = Reference A (Face Crop highest).
World identity, zone relationships, materials, light, atmosphere = Reference B.

PANEL FUNCTIONS (sequential reading order):
Panel 1–3: Arrival & First Contact (entrance / outer zones)
Panel 4–6: Transition & Deepening (thresholds, passages, rising tension)
Panel 7–9: Core Confrontation & Aftermath (main locus → hidden depth → lingering consequence)

CONTINUITY RULE
The viewer must believe the character physically moved through connected terrain from Panel 1 to Panel 9. Zones must feel like a natural progression. What happens in earlier panels influences later ones.

LAYOUT
3x3 grid. Even spacing. Thin subtle separators. No text. No labels.

LOCKED
Same character identity, same outfit, same overall world logic and lighting continuity.

VARIABLE
Zone progression, camera angle, distance, composition, character position and action.

FORBIDDEN
No face or outfit drift. No disconnected location jumps. No duplicated shots. No pasted-in character feeling.`,Ye=["Arrival","First Contact","Outer Zone","Transition","Threshold / Passage","Rising Tension","Core Confrontation","Hidden Depth","Aftermath"],Ge=[{id:"charRef",label:"Reference A — Character",placeholder:"Charakter-Beschreibung",required:!0},{id:"boardRef",label:"Reference B — World Zone Board",placeholder:"Beschreibung des 3x3 Zone Boards",required:!0}],Ke={id:Pe,label:De,badge:Be,rows:Le,cols:_e,desc:ke,layout:je,source:ze,prompt:Ue,panelRoles:Ye,inputFields:Ge},Me="character-angle-3x3",He="Character Storyboard 3x3",qe="SeenGrid Optimized",Ve=3,We=3,Ze="Gleicher Charakter in 9 Kameraperspektiven. Keine technische Tabelle — 9 Filmaufnahmen.",Qe="Even",Je="DeepSeek1.txt — 3x3GRIDS.txt PROMPT 3",Xe=`Cinematic 3x3 Character Grid
You are given:
Reference A = character preservation / integration image (full body)
Reference B = upscaled Face Crop (highest authority for face)

TASK
Create a professional cinematic 3x3 grid showing the exact same character in 9 different camera angles and shot types. This is NOT a technical reference sheet — it is nine cinematic film captures of the same person in a consistent environment.

PANEL CONTENT (suggested powerful layout):
Row 1: Extreme Close-up (face) · Close-up (shoulders) · Medium Shot (waist-up)
Row 2: Full Body Front · Low Angle Heroic · High Angle / Top-Down
Row 3: True Side Profile · Over-the-Shoulder · Three-Quarter Rear / Back View

REFERENCE PRIORITY
Face identity and fine details = Reference B (absolute priority).
Body, proportions, outfit, materials = Reference A.

QUALITY ANCHOR
Match the premium cinematic quality and atmospheric depth of the source. Rich materials, nuanced lighting, no simplification.

LAYOUT
3x3 grid. Even spacing. Thin subtle separators. No text. No labels. Entire figure fully visible where appropriate. Natural relaxed or motivated pose.

FORBIDDEN
No face drift, no outfit change, no flat rendering, no neutral studio background, no quality downgrade.`,et=["ECU Face","CU Shoulders","Medium Shot","Full Body Front","Low Angle Heroic","High Angle","True Side Profile","Over-the-Shoulder","Three-Quarter Rear"],tt=[{id:"charFull",label:"Reference A — Full Body",placeholder:"Charakter-Beschreibung (Ganzkörper)",required:!0},{id:"faceCrop",label:"Reference B — Face Crop",placeholder:"Face Crop Beschreibung (höchste Autorität)",required:!1}],nt={id:Me,label:He,badge:qe,rows:Ve,cols:We,desc:Ze,layout:Qe,source:Je,prompt:Xe,panelRoles:et,inputFields:tt},at="character-angle-study-2x2",ot="Character Angle Study",rt="SeenGrid Optimized",st=2,it=2,lt="4 Kameraperspektiven Ganzkörper. Nicht 'Turnaround' — 4 Filmaufnahmen.",ct="Even",dt="DeepSeek1.txt — Angle Study and Detail Anchor.txt",pt=`Character Angle Study

You are given:
Reference A = cinematic character ingredient image (full body)
Reference B = upscaled close crop of the character's face

TASK
Create four cinematic full-body shots of the same exact character from four different camera angles, arranged in a 2x2 grid.
Each shot must maintain the same rendering quality and atmospheric depth as Reference A.

This is NOT a technical reference layout. This is four cinematic captures of the same person.

REFERENCE PRIORITY
Face identity, facial structure, and fine facial details = Reference B (the face crop is the highest-authority face reference).
Body proportions, hairstyle, outfit, materials, and footwear = Reference A.
If any conflict occurs: preserve face from Reference B first, then body and outfit from Reference A, then materials.

QUALITY ANCHOR
Each panel must match the rendering quality of the source image.
Preserve material richness, lighting nuance, atmospheric depth, and surface detail.
Do not simplify into flat, clean, utilitarian rendering.

LAYOUT
2x2 grid. Even spacing. No text. No labels.

PANEL CONTENT
Panel 1: Full-body front view
Panel 2: Full-body true right profile
Panel 3: Full-body true left profile
Panel 4: Full-body back view

Entire figure fully visible in all panels.
No cropped head, no cropped feet, no hidden footwear.

VIEW RULES
Use true profile and true back view — not three-quarter angles.
Same character scale and camera height in all panels.

POSE
Natural relaxed stance. Not rigid, not aggressive.

ENVIRONMENT
Keep the same atmospheric environment from the source image.
Do not replace it with a neutral studio background.

FORBIDDEN
No face drift. No hairstyle drift. No outfit change.
No mirrored fake profiles. No crop errors.
No flat simplified rendering. No neutral blank background.
No quality downgrade from the source image.`,ht=["Front View","True Right Profile","True Left Profile","Back View"],gt=[{id:"charFull",label:"Reference A — Full Body",placeholder:"Charakter-Ganzkörper Beschreibung",required:!0},{id:"faceCrop",label:"Reference B — Face Crop",placeholder:"Face Crop (höchste Autorität für Gesicht)",required:!1}],ut={id:at,label:ot,badge:rt,rows:st,cols:it,desc:lt,layout:ct,source:dt,prompt:pt,panelRoles:ht,inputFields:gt},mt="detail-anchor-strip",ft="Detail Anchor Strip",yt="SeenGrid Optimized",bt=1,vt=4,xt="3-5 Detail-Crops der wichtigsten Identity-Anker. Verhindert Drift in späteren Generierungen.",St="Even",Et="DeepSeek1.txt — Angle Study and Detail Anchor.txt STEP 6",Rt=`Detail Anchor Strip

You are given a character angle study showing the same character from multiple views.

TASK
Create 3 to 5 close detail crops of the most important recurring identity anchors from the character.

PURPOSE
This preserves the micro-signatures that tend to drift in later generates.
Each crop must be detailed enough to serve as a correction reference.

DETAIL SELECTION
Choose only the most identity-critical recurring details, such as:
hand shape, collar or neckline, footwear, signature accessory, sleeve hem, hair ornament, belt or clasp, earring, fabric texture, weapon detail.
Choose what matters most for THIS character. Do not pad with generic details.

QUALITY ANCHOR
Each crop must preserve full material detail and surface quality from the source.
Do not simplify textures or materials.

LAYOUT
1 row, 3–5 panels. Even spacing. No text. No labels.

FORBIDDEN
No face in the crops (face is already in the Angle Study).
No generic or decorative details that don't define this specific character.
No quality drop.`,Nt=["Detail 1","Detail 2","Detail 3","Detail 4"],wt=[{id:"charDesc",label:"Character Angle Study",placeholder:"Beschreibung des Charakters und der wichtigsten Details",required:!0}],Tt={id:mt,label:ft,badge:yt,rows:bt,cols:vt,desc:xt,layout:St,source:Et,prompt:Rt,panelRoles:Nt,inputFields:wt},Ct="two-character-integration",At="Two Character Integration",$t="SeenGrid Optimized",It=1,Ot=1,Ft="Place two separate character references into one coherent cinematic scene with locked individual identities.",Pt="Even",Dt="MISSING_PRESETS.txt — Item 1",Bt=`Two Character Integration

You are given two reference images of two different characters.
Reference A = Character A identity.
Reference B = Character B identity.

TASK
Place both characters into the same cinematic scene. Maintain perfect identity separation.

SCENE
[DESCRIBE SCENE HERE]

ACTION
[DESCRIBE WHAT THEY ARE DOING]

REFERENCE PRIORITY
Character A face, body, hair, outfit, materials = Reference A only.
Character B face, body, hair, outfit, materials = Reference B only.
Environment and atmosphere = scene description or scene reference.

CRITICAL
Do not blend identities. Do not average faces. Do not transfer hairstyle or outfit elements between characters.

INTEGRATION
Both characters share the same lighting, perspective, atmosphere, and world depth.
Natural relative scale. Natural positioning. Consistent shadow direction.
The scene must feel like one coherent cinematic shot.

FORBIDDEN
No face blending. No identity drift. No pasted look.
No mismatched scale or perspective.`,Lt=["Scene — Character A + B"],_t=[{id:"scene",label:"Scene Description",placeholder:"Describe the cinematic scene...",required:!0},{id:"action",label:"Action / Interaction",placeholder:"What are the characters doing?",required:!0}],kt={id:Ct,label:At,badge:$t,rows:It,cols:Ot,desc:Ft,layout:Pt,source:Dt,prompt:Bt,panelRoles:Lt,inputFields:_t},jt="outfit-swap",zt="Outfit Swap",Ut="SeenGrid Optimized",Yt=1,Gt=1,Kt="Change only the outfit on an existing character reference sheet — face, body, pose, and layout stay identical.",Mt="Even",Ht="MISSING_PRESETS.txt — Item 2",qt=`Outfit Swap — Identity Locked

You are given a character angle study showing the same character from multiple views.

TASK
Create an updated version where only the outfit changes. Everything else stays identical.

OUTFIT CHANGE
[DESCRIBE NEW OUTFIT HERE]

LOCKED
Same face, body proportions, hairstyle, pose, camera angles, grid layout, background in all panels.

VARIABLE
Only the clothing. This is a garment transfer, not a redesign.

OUTFIT RULES
Natural fit on existing body and pose. Realistic folds, seams, materials.
Consistent across all panels. Preserve body underneath.

FORBIDDEN
No face, body, hairstyle, pose, camera, layout, or background changes.`,Vt=["Outfit Swap — Updated Grid"],Wt=[{id:"outfit",label:"New Outfit Description",placeholder:"Describe the new outfit in detail...",required:!0}],Zt={id:jt,label:zt,badge:Ut,rows:Yt,cols:Gt,desc:Kt,layout:Mt,source:Ht,prompt:qt,panelRoles:Vt,inputFields:Wt},Qt="environment-continuity-2x3",Jt="Environment Continuity",Xt="SeenGrid Optimized",en=2,tn=3,nn="Show the same location from 6 camera positions to establish spatial consistency for video generation.",an="Even",on="MISSING_PRESETS.txt — Item 3",rn=`Environment Continuity

You are given a reference image of a specific environment.

TASK
Create a 2×3 grid showing the same location from 6 different camera positions.
Nothing may be added, removed, or relocated.

LOCKED
Same physical space, architecture, materials, light direction, time of day, atmosphere in all panels.

PANELS
1. Wide establishing shot — full spatial layout
2. Low angle looking up at dominant vertical element
3. Ground-level POV approaching the threshold
4. Reverse angle — looking back toward Panel 1's camera position
5. Tight detail shot of the most textured surface
6. Overhead or elevated angle showing spatial relationships

CAMERA RULES
True perspective shifts, not cropping. Each panel must confirm the same 3D space.
No elements appearing or disappearing. Water reflections update per angle.

FORBIDDEN
No architecture drift. No terrain change. No material swap.
No lighting direction change.`,sn=["Wide Establishing Shot","Low Angle — Vertical Element","Ground-Level POV","Reverse Angle","Tight Detail — Texture","Overhead / Elevated"],ln=[],cn={id:Qt,label:Jt,badge:Xt,rows:en,cols:tn,desc:nn,layout:an,source:on,prompt:rn,panelRoles:sn,inputFields:ln},dn="expression-target-2x3",pn="Expression Target",hn="SeenGrid Optimized",gn=2,un=3,mn="6 controlled expression variants of the same character — neutral to exhausted — without identity drift.",fn="Even",yn="MISSING_PRESETS.txt — Item 7",bn=`Expression Target

You are given a character reference image.

TASK
Create a 2×3 grid showing 6 controlled expression variations of the same character.

LOCKED
Same face, facial proportions, hairstyle, skin tone, visible clothing, camera distance, camera height, lighting in all panels.

VARIABLE
Only facial expression. Controlled, readable changes — no distortion.

PANELS
1. Neutral
2. Restrained subtle smile
3. Soft laughter
4. Confused / uncertain
5. Angry but controlled
6. Sad / exhausted

LAYOUT
Head-and-shoulders framing. Neutral background. No text.

FORBIDDEN
No face drift. No age shift. No beautification drift.
No exaggerated cartoon distortion.`,vn=["Neutral","Restrained Subtle Smile","Soft Laughter","Confused / Uncertain","Angry — Controlled","Sad / Exhausted"],xn=[],Sn={id:dn,label:pn,badge:hn,rows:gn,cols:un,desc:mn,layout:fn,source:yn,prompt:bn,panelRoles:vn,inputFields:xn},En="lighting-test-2x2",Rn="Lighting Test Matrix",Nn="SeenGrid Optimized",wn=2,Tn=2,Cn="Same character under 4 different lighting conditions — identity, pose, and background locked.",An="Even",$n="MISSING_PRESETS.txt — Item 8",In=`Lighting Test Matrix

You are given a character reference image.

TASK
Create a 2×2 grid showing the same character under 4 different lighting conditions.
Same bust shot, same pose, same expression, same background in all panels.

PANELS
1. Soft diffuse front lighting
2. Hard top lighting
3. Side lighting
4. Underlighting from below

LOCKED
Same face, hairstyle, outfit, pose, framing, camera, background in all panels.

VARIABLE
Only the lighting setup.

FORBIDDEN
No face, pose, framing, or background drift.`,On=["Soft Diffuse Front","Hard Top Lighting","Side Lighting","Underlighting"],Fn=[],Pn={id:En,label:Rn,badge:Nn,rows:wn,cols:Tn,desc:Cn,layout:An,source:$n,prompt:In,panelRoles:On,inputFields:Fn},Dn="progression-1x4",Bn="Progression Array",Ln="SeenGrid Optimized",_n=1,kn=4,jn="Same character across a gradual state change in 4 horizontal panels — transformation, damage, aging.",zn="Even",Un="MISSING_PRESETS.txt — Item 9",Yn=`Progression Array

You are given a character reference image.

TASK
Create a 4-panel horizontal grid showing the same character moving through a gradual state change.

LOCKED
Same face, body proportions, hairstyle base, core outfit silhouette, camera angle, camera height, framing in all panels.

VARIABLE
Only the state progression. Gradual, controlled, readable left to right.

PANELS
1. Base state — calm, intact
2. Lightly altered
3. Clearly affected
4. Fully transformed

FORBIDDEN
No identity reset between panels. No random redesign.
No camera or framing drift.`,Gn=["Base State — Calm, Intact","Lightly Altered","Clearly Affected","Fully Transformed"],Kn=[{id:"stateType",label:"State Change Type",placeholder:"e.g. aging, battle damage, corruption, illness...",required:!1}],Mn={id:Dn,label:Bn,badge:Ln,rows:_n,cols:kn,desc:jn,layout:zn,source:Un,prompt:Yn,panelRoles:Gn,inputFields:Kn},Hn="cutaway-worldbuilding",qn="Cutaway Worldbuilding",Vn="SeenGrid Optimized",Wn=1,Zn=1,Qn="Reveal multiple connected layers of one location in a single cross-section composition with spatial logic.",Jn="Even",Xn="MISSING_PRESETS.txt — Item 10",ea=`Cross-Section / Cutaway Worldbuilding

TASK
Create a single cross-section composition revealing multiple connected layers of one location.

SUBJECT
[DESCRIBE THE LOCATION HERE]

STRUCTURE
Cutaway view revealing connected layers. Each layer physically connected.
The world must read as one coherent environment with believable spatial logic.
Clean readable edges and clear spatial relationships.

FORBIDDEN
No disconnected layers. No random perspective shifts.
No repeated copied rooms. No chaotic overlap.`,ta=["Cross-Section Cutaway"],na=[{id:"location",label:"Location",placeholder:"Describe the location and its layers...",required:!0}],aa={id:Hn,label:qn,badge:Vn,rows:Wn,cols:Zn,desc:Qn,layout:Jn,source:Xn,prompt:ea,panelRoles:ta,inputFields:na},oa="knolling-layout",ra="Knolling / Inventory Layout",sa="SeenGrid Optimized",ia=1,la=1,ca="Break down an outfit or prop set into clean flat-lay components for asset reference and consistency.",da="Even",pa="MISSING_PRESETS.txt — Item 11",ha=`Knolling / Inventory Layout

You are given a character, outfit, or prop set reference.

TASK
Create a clean inventory layout breaking the outfit or prop set into readable individual components.

SUBJECT
[DESCRIBE THE OUTFIT OR PROP SET HERE]

LAYOUT
Knolling / flat lay from above. All items clearly separated, fully visible.
Balanced spacing. Clean alignment. Neutral background. No text.

RULES
Each item shown as individual component. Orderly and readable.
No merged pieces. No invented extra props. Design consistency across all items.

FORBIDDEN
No perspective scene view. No character wearing items (unless requested).
No cluttered composition.`,ga=["Knolling Inventory"],ua=[{id:"subject",label:"Subject (Outfit / Prop Set)",placeholder:"Describe the outfit or prop set to break down...",required:!0}],ma={id:oa,label:ra,badge:sa,rows:ia,cols:la,desc:ca,layout:da,source:pa,prompt:ha,panelRoles:ga,inputFields:ua},fa="2shot-keyframe-2x2",ya="2-Shot Keyframe Pairs",ba="SeenGrid Optimized",va=2,xa=2,Sa="Start + End frames for two consecutive independent shots — direct input for Kling/Seedance video generation.",Ea="Even",Ra="MISSING_PRESETS.txt — 2-SHOT INDEPENDENT KEYFRAME PAIRS",Na=`2-Shot Independent Keyframe Pairs

You are given:
Reference A = character ingredient image (full body)
Reference B = world ingredient image

TASK
Create a 2×2 keyframe grid that delivers complete Start + End frames for TWO separate, consecutive shots from the script.
The two shots are independent and can have a normal film cut between them.

LAYOUT
2×2 grid. Even spacing. No text. No labels.

PANEL BREAKDOWN (strict):
Panel 1 (top-left):  Start frame of Shot 1
Panel 2 (top-right): End frame of Shot 1
Panel 3 (bottom-left): Start frame of Shot 2
Panel 4 (bottom-right): End frame of Shot 2

LOCKED FOR ALL 4 PANELS
- Exact same character identity, face, proportions, hairstyle, outfit, materials
- Same world geometry, lighting, atmosphere, color grade (from Ref B)
- Same overall cinematic quality and depth

VARIABLE
Shot 1 motion: [DESCRIBE MOTION/ACTION FOR SHOT 1 HERE]
Shot 2 motion: [DESCRIBE MOTION/ACTION FOR SHOT 2 HERE]

RULES
- The two shots are consecutive in the script but have a normal cut between them — NO forced continuity between Panel 2 and Panel 3
- Each motion must be physically plausible and natural for its own shot
- Full premium cinematic quality in every panel
- Consistent lighting and atmosphere across all 4 panels (same scene/world)

FORBIDDEN
No face/outfit/world drift. No lighting inconsistency between panels. No pasted look.
No forced identical frame between Panel 2 and Panel 3.`,wa=["Shot 1 — Start Frame","Shot 1 — End Frame","Shot 2 — Start Frame","Shot 2 — End Frame"],Ta=[{id:"shot1",label:"Shot 1 — Motion / Action",placeholder:"Describe the motion or action for Shot 1...",required:!0},{id:"shot2",label:"Shot 2 — Motion / Action",placeholder:"Describe the motion or action for Shot 2...",required:!0}],Ca={id:fa,label:ya,badge:ba,rows:va,cols:xa,desc:Sa,layout:Ea,source:Ra,prompt:Na,panelRoles:wa,inputFields:Ta},Aa="architectural-blueprint-2x2",$a="Architectural Blueprint",Ia="SeenGrid Optimized",Oa=2,Fa=2,Pa="Technical 4-view floor plan and elevation diagram of a cinematic scene — hard spatial reference for Kling/Seedance.",Da="Even",Ba="MISSING_PRESETS.txt — ARCHITEKTONISCHER 3D BAUPLAN",La=`Architectural 3D Blueprint

You are given a cinematic scene artwork.

TASK
Create a clean, precise technical architectural blueprint / 3D spatial diagram of the exact scene.
This is NOT artistic — this is a hard technical reference for later video generation.

LAYOUT
Combine in one image:
- Top-left: Top-down floor plan (clear walls, platforms, levels, distances)
- Top-right: Front elevation view
- Bottom-left: Side elevation view (most important camera angle)
- Bottom-right: Isometric 3D overview (30° angle)

STYLE
Black clean lines on pure white background, thin precise lines, no shading, no color, no artistic style.
Technical architectural diagram style, like a professional production designer floor plan.
Label key distances and important elements very lightly if needed.

REFERENCE PRIORITY
Respect exact proportions, spatial relationships, depth, heights and geometry from the input image.
Every wall, platform, throne, column, step and object must be in the exact same position as in the reference.

QUALITY ANCHOR
Maximum precision and clarity. This image will be used as hard spatial reference in Kling and Seedance.

FORBIDDEN
No color, no artistic rendering, no mood, no characters, no atmosphere. No creative interpretation.`,_a=["Top-Down Floor Plan","Front Elevation","Side Elevation","Isometric 3D Overview"],ka=[],ja={id:Aa,label:$a,badge:Ia,rows:Oa,cols:Fa,desc:Pa,layout:Da,source:Ba,prompt:La,panelRoles:_a,inputFields:ka},za="scene-spatial-layout-2x2",Ua="Scene Spatial Layout Guide",Ya="SeenGrid Optimized",Ga=2,Ka=2,Ma="Production-ready 4-view spatial diagram of a scene — geometry reference for Kling/Seedance, with camera positions marked.",Ha="Even",qa="MISSING_PRESETS.txt — SCENE SPATIAL LAYOUT GUIDE",Va=`Scene Spatial Layout Guide

You are given a cinematic scene artwork.

TASK
Create a precise production-ready spatial layout guide that shows the exact 3D structure of the scene for video generation.

LAYOUT (2×2 grid)
Panel 1 (top-left): Top-down floor plan with clear wall positions, platforms, levels and key distances
Panel 2 (top-right): Main camera angle elevation view (the most used shot angle)
Panel 3 (bottom-left): Side elevation view (90° from main camera)
Panel 4 (bottom-right): Isometric 3D overview (30° angle) showing full depth and height relationships

STYLE
Clean technical lines, light grey background, black precise lines, very subtle depth shading only where needed for clarity.
Professional film production layout style — like a real set designer blueprint.

REFERENCE PRIORITY
Every single object, wall, platform, throne, column, step and spatial relationship must match the input image 100%.
Mark important camera positions and character standing areas with very light dotted lines.

QUALITY ANCHOR
Maximum spatial clarity and precision. This image will be used as hard geometry reference in Kling and Seedance.

FORBIDDEN
No characters in the diagram. No artistic mood or color grading. No creative changes to the geometry.
Keep it strictly technical and accurate.`,Wa=["Top-Down Floor Plan","Main Camera Elevation","Side Elevation (90°)","Isometric 3D Overview"],Za=[],Qa={id:za,label:Ua,badge:Ya,rows:Ga,cols:Ka,desc:Ma,layout:Ha,source:qa,prompt:Va,panelRoles:Wa,inputFields:Za},Ja="character-sheet-8view",Xa="8-View Character Sheet",eo="SeenGrid Optimized",to=2,no=4,ao="Professional 8-view character turnaround — 4 portrait views + 4 full-body views for consistent multi-angle generation.",oo="Even",ro="MISSING_PRESETS.txt — 8-view character sheet",so=`8-View Character Sheet

You are given two reference images that represent the same subject.
Reference Image A: Full-body view — body proportions, posture, clothing, silhouette.
Reference Image B: Close-up face view — facial identity, expression, fine details.

TASK
Using both reference images, generate a professional character reference sheet containing eight views of the same character.

IMAGE STRUCTURE — 2×4 grid:
1. Close-up portrait facing forward
2. Portrait facing right
3. Portrait facing left
4. Portrait from the back
5. Full-body front view
6. Full-body right profile
7. Full-body left profile
8. Full-body back view

LOCKED
Same facial identity, body proportions, hairstyle, clothing, colors, materials across all panels.
Identity locked — same person in all panels, no variation in face.

POSE
Natural stance. Relaxed, confident posture. Consistent across all full-body panels.

STYLE
Professional character sheet. Background must match the reference background.
Consistent lighting. Photorealistic, DSLR quality, natural muted tones, sharp details.
Even spacing between panels. Clean silhouette visibility.

CONTINUITY RULES
Facial identity must exactly match Reference Image B.
Body proportions and outfit must exactly match Reference Image A.
Lighting must remain consistent across all panels.
No stylization drift. No additional props.

FORBIDDEN
No identity drift. No hairstyle or outfit changes between panels. No artistic stylization.`,io=["Portrait — Front","Portrait — Right","Portrait — Left","Portrait — Back","Full Body — Front","Full Body — Right","Full Body — Left","Full Body — Back"],lo=[],co={id:Ja,label:Xa,badge:eo,rows:to,cols:no,desc:ao,layout:oo,source:ro,prompt:so,panelRoles:io,inputFields:lo},O=[{id:"angle-study",label:"Angle Study",desc:"Multiple camera angles on the same subject — explores spatial relationships and POV variety",defaultRows:2,defaultCols:2,panelRoles:["Front Wide","Profile Close","High Angle","Low Angle"],template:`Create a {rows}x{cols} grid of camera angle studies.

TASK: Show the same subject from {count} distinct angles that reveal spatial depth and volume. Each angle must feel deliberately chosen, not random.

PANEL FUNCTIONS:
{panelLines}

LAYOUT: {rows}x{cols} grid. {layout}. Consistent lighting across all panels.

QUALITY: Premium cinematic rendering. Rich surface detail. Atmospheric depth. Professional color science.

FORBIDDEN: No repeated angles. No disconnected panels. No quality degradation.`,panelRoleDefaults:{"2x2":["Front Wide","Profile Close","High Angle","Low Angle"],"3x3":["Extreme Wide","Front Wide","Profile","3/4 Front","POV","Over Shoulder","High Angle","Low Angle","Dutch Tilt"],"2x3":["Front Wide","Profile","3/4 Front","Over Shoulder","High Angle","Low Angle"]}},{id:"multishot",label:"Multishot",desc:"Sequential narrative beats — story progression across panels like a film strip",defaultRows:3,defaultCols:3,panelRoles:["Establish","Approach","Arrive","Discover","React","Close","Reveal","Climax","Resolve"],template:`Create a {rows}x{cols} grid of sequential narrative panels.

TASK: Build a coherent visual story across {count} panels. Each panel is a distinct story beat — together they form a complete arc.

PANEL FUNCTIONS:
{panelLines}

LAYOUT: {rows}x{cols} grid. {layout}. Left-to-right, top-to-bottom reading order.

QUALITY: Cinematic consistency across all panels. Matching color grade, lighting style, and world physics. Professional depth of field.

FORBIDDEN: No disconnected story beats. No style inconsistency between panels. No flat lighting.`,panelRoleDefaults:{"3x3":["Establish","Approach","Arrive","Discover","React","Close","Reveal","Climax","Resolve"],"2x3":["Establish","Approach","Discover","React","Reveal","Resolve"],"1x4":["Establish","Build","Climax","Resolve"]}},{id:"character-sheet",label:"Character Sheet",desc:"Full character reference — expressions, poses, details across panels",defaultRows:2,defaultCols:3,panelRoles:["Front Neutral","3/4 Turn","Profile","Expression A","Expression B","Detail Close"],template:`Create a {rows}x{cols} character reference sheet.

TASK: Comprehensive character documentation across {count} panels. Consistent character identity across all views — this is the definitive visual reference.

PANEL FUNCTIONS:
{panelLines}

LAYOUT: {rows}x{cols} grid. Clean studio background. Neutral key light optimized for reference clarity.

QUALITY: Maximum costume and face detail. High resolution rendering. Consistent scale across all panels. Subsurface skin scattering.

FORBIDDEN: No background elements competing with character. No different lighting rigs between panels. No style inconsistency.`,panelRoleDefaults:{"2x3":["Front Neutral","3/4 Turn","Profile","Expression A","Expression B","Detail Close"],"3x3":["Front Full Body","3/4 Full Body","Profile Full Body","Front Portrait","3/4 Portrait","Profile Portrait","Expression A","Expression B","Costume Detail"],"2x2":["Front Neutral","Profile","Expression A","Costume Detail"]}},{id:"world-builder",label:"World Builder",desc:"Environment exploration — different zones, scales, and atmospheric states",defaultRows:3,defaultCols:3,panelRoles:["Exterior Wide","Entry Zone","Interior A","Interior B","Detail A","Detail B","Atmosphere","Scale Ref","Signature Element"],template:`Create a {rows}x{cols} world-building reference grid.

TASK: Document {count} aspects of the world environment. Together these panels establish the complete visual language of this location — its scale, atmosphere, texture, and identity.

PANEL FUNCTIONS:
{panelLines}

LAYOUT: {rows}x{cols} grid. Consistent atmospheric conditions across all panels. Same time of day, same weather, same world physics.

QUALITY: Epic environmental rendering. Volumetric atmosphere. Rich material specificity. Architectural or natural detail at professional level.

FORBIDDEN: No inconsistent world physics. No empty panels. No generic stock environments.`,panelRoleDefaults:{"3x3":["Exterior Wide","Entry Zone","Interior A","Interior B","Detail A","Detail B","Atmosphere","Scale Ref","Signature Element"],"2x3":["Exterior Wide","Entry Zone","Interior","Detail A","Atmosphere","Signature"],"2x2":["Exterior Wide","Interior Key","Atmosphere","Detail Close"]}}],N=[xe,Fe,Ke,nt,ut,Tt,kt,Zt,cn,Sn,Pn,Mn,aa,ma,Ca,ja,Qa,co];function F(n){const u=n.rows*n.cols,i=n.panelRoles||[];return Array.from({length:u},(r,m)=>i[m]||`Panel ${m+1}`)}function uo(){const{t:n}=G(),u=[{id:"even",label:"Even",desc:n("grid.layout_even_desc")},{id:"letterbox",label:"Letterbox",desc:n("grid.layout_letterbox_desc")},{id:"seamless",label:"Seamless",desc:n("grid.layout_seamless_desc")},{id:"framed",label:"Framed",desc:n("grid.layout_framed_desc")},{id:"storyboard",label:"Storyboard",desc:n("grid.layout_storyboard_desc")},{id:"polaroid",label:"Polaroid",desc:n("grid.layout_polaroid_desc")}],i=[{id:"seengrid",label:"SeenGrid Optimized",star:!0,desc:n("grid.mode_seengrid_desc")},{id:"core",label:"Core",star:!1,desc:n("grid.mode_core_desc")},{id:"custom",label:"Custom Grid",star:!1,desc:n("grid.mode_custom_desc")}],[r,m]=c.useState("seengrid"),[d,b]=c.useState(3),[l,x]=c.useState(3),[g,w]=c.useState("even"),[p,P]=c.useState(N[0]),[S,v]=c.useState(()=>F(N[0])),[f,D]=c.useState(O[0]),[E,B]=c.useState(""),[y,L]=c.useState(""),[T,_]=c.useState(""),[k,C]=c.useState(!1);c.useEffect(()=>{var t;b(p.rows),x(p.cols),w(((t=p.layout)==null?void 0:t.toLowerCase())||"even"),v(F(p))},[p]),c.useEffect(()=>{var s;if(r!=="core")return;const t=`${d}x${l}`,o=((s=f.panelRoleDefaults)==null?void 0:s[t])||f.panelRoles||[];o.length&&v(o)},[f]),c.useEffect(()=>{if(r!=="core"&&r!=="custom")return;const t=d*l;v(o=>o.length===t?o:o.length<t?[...o,...Array.from({length:t-o.length},(s,h)=>`Panel ${o.length+h+1}`)]:o.slice(0,t))},[d,l,r]);function A(t){const o=u.find(s=>s.id===t);return o?`${o.label} — ${o.desc}`:t}function j(){const t=d*l;if(r==="seengrid"){const h=[p.prompt];return h.push(`LAYOUT: ${d}×${l} grid. ${A(g)}.`),y&&h.push(`STYLE OVERRIDE: Apply ${y}.`),h.join(`

`)}if(r==="custom")return T;const o=S.slice(0,t).map((h,Y)=>`  Panel ${Y+1} [${h}]:`).join(`
`);let s=f.template.replace(/\{rows\}/g,d).replace(/\{cols\}/g,l).replace(/\{count\}/g,t).replace(/\{panelLines\}/g,o).replace(/\{layout\}/g,A(g));return E&&(s=`SUBJECT: ${E}

`+s),y&&(s+=`

STYLE: ${y}`),s}const $=j(),R=d*l;async function z(){try{await navigator.clipboard.writeText($),C(!0),setTimeout(()=>C(!1),2200)}catch{}}function U(t,o){v(s=>{const h=[...s];return h[t]=o,h})}const I=t=>({fontFamily:"var(--sg-font-mono)",fontSize:"var(--sg-text-sm)",padding:"4px 10px",borderRadius:"var(--sg-radius-sm)",border:`1px solid ${t?"var(--sg-gold-dim)":"var(--sg-border-subtle)"}`,background:t?"var(--sg-chip-bg-active)":"var(--sg-bg-surface-0)",color:t?"var(--sg-gold-text)":"var(--sg-text-tertiary)",cursor:"pointer",transition:"all 120ms ease"});return e.jsxs("div",{className:a.container,children:[e.jsxs("div",{className:a.controlsColumn,children:[e.jsx("div",{className:a.modeToggle,children:i.map(t=>e.jsxs("button",{className:[a.modeToggleBtn,r===t.id&&a.active].filter(Boolean).join(" "),onClick:()=>m(t.id),title:t.desc,children:[t.star&&"★ ",t.label]},t.id))}),r==="seengrid"&&e.jsxs("div",{className:a.section,children:[e.jsx("p",{className:a.sectionTitle,children:n("grid.preset_label")}),e.jsx("div",{className:a.presetList,children:N.map(t=>e.jsxs("button",{className:[a.presetItem,p.id===t.id&&a.active].filter(Boolean).join(" "),onClick:()=>P(t),title:t.desc,children:[e.jsxs("div",{children:[e.jsx("div",{className:a.presetName,children:t.label}),e.jsx("div",{className:a.presetDesc,children:t.desc})]}),e.jsxs("span",{className:a.presetBadge,children:[t.rows,"×",t.cols]})]},t.id))})]}),r==="core"&&e.jsxs("div",{className:a.section,children:[e.jsx("p",{className:a.sectionTitle,children:n("grid.core_template")}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:6},children:O.map(t=>e.jsx("button",{className:`chip${f.id===t.id?" active":""}`,onClick:()=>D(t),title:t.desc,children:t.label},t.id))}),e.jsx("p",{style:{marginTop:10,fontSize:"var(--sg-text-xs)",color:"var(--sg-text-tertiary)",fontFamily:"var(--sg-font-mono)"},children:f.desc})]}),e.jsxs("div",{className:a.section,children:[e.jsx("p",{className:a.sectionTitle,children:n("grid.grid_size")}),r==="seengrid"?e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsxs("span",{className:a.gridSize,children:[d,"×",l]}),e.jsx("span",{className:a.gridSizeNote,children:n("grid.dim_locked")})]}):e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"var(--sg-text-xs)",fontFamily:"var(--sg-font-mono)",color:"var(--sg-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6},children:"Rows"}),e.jsx("div",{style:{display:"flex",gap:4},children:[1,2,3,4,5].map(t=>e.jsx("button",{style:I(d===t),onClick:()=>b(t),children:t},t))})]}),e.jsx("span",{style:{fontSize:"var(--sg-text-xl)",color:"var(--sg-text-disabled)",fontFamily:"var(--sg-font-mono)"},children:"×"}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"var(--sg-text-xs)",fontFamily:"var(--sg-font-mono)",color:"var(--sg-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6},children:"Cols"}),e.jsx("div",{style:{display:"flex",gap:4},children:[1,2,3,4,5].map(t=>e.jsx("button",{style:I(l===t),onClick:()=>x(t),children:t},t))})]}),e.jsxs("span",{style:{fontSize:"var(--sg-text-xs)",fontFamily:"var(--sg-font-mono)",color:"var(--sg-text-tertiary)"},children:[R," ",n("grid.panels")]})]})]}),e.jsxs("div",{className:a.section,children:[e.jsx("p",{className:a.sectionTitle,children:n("grid.layout")}),e.jsx("div",{className:a.layoutChips,children:u.map(t=>e.jsx("button",{className:`chip${g===t.id?" active":""}`,onClick:()=>w(t.id),title:t.desc,children:t.label},t.id))})]}),r==="seengrid"&&e.jsxs("div",{className:a.section,children:[e.jsx("p",{className:a.sectionTitle,children:n("grid.ref_images")}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:6},children:[e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[e.jsx("span",{style:{fontFamily:"var(--sg-font-mono)",fontSize:"var(--sg-text-xs)",color:"var(--sg-gold)",background:"rgba(212,149,42,0.12)",border:"1px solid rgba(212,149,42,0.25)",borderRadius:3,padding:"1px 6px"},children:"A"}),e.jsx("span",{style:{fontSize:"var(--sg-text-xs)",color:"var(--sg-text-tertiary)"},children:n("grid.ref_char")})]}),e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[e.jsx("span",{style:{fontFamily:"var(--sg-font-mono)",fontSize:"var(--sg-text-xs)",color:"var(--sg-gold)",background:"rgba(212,149,42,0.12)",border:"1px solid rgba(212,149,42,0.25)",borderRadius:3,padding:"1px 6px"},children:"B"}),e.jsx("span",{style:{fontSize:"var(--sg-text-xs)",color:"var(--sg-text-tertiary)"},children:n("grid.ref_style")})]}),e.jsx("p",{style:{fontSize:"var(--sg-text-xs)",color:"var(--sg-text-disabled)",fontFamily:"var(--sg-font-mono)",marginTop:4},children:n("grid.ref_hint")})]})]}),r!=="custom"&&e.jsxs("div",{className:a.section,children:[e.jsxs("p",{className:a.sectionTitle,children:[n("grid.style_override")," ",e.jsx("span",{style:{color:"var(--sg-text-disabled)",fontWeight:400},children:n("common.optional")})]}),e.jsx("input",{type:"text",value:y,onChange:t=>L(t.target.value),placeholder:n(r==="seengrid"?"grid.style_ph_sg":"grid.style_ph_core")})]}),r==="core"&&e.jsxs("div",{className:a.section,children:[e.jsx("p",{className:a.sectionTitle,children:n("grid.core_subject")}),e.jsx("textarea",{rows:2,value:E,onChange:t=>B(t.target.value),placeholder:n("grid.core_subject_ph")})]}),e.jsxs("div",{className:a.section,children:[e.jsx("p",{className:a.sectionTitle,children:n("grid.panel_roles")}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${l}, 1fr)`,gap:6},children:S.slice(0,R).map((t,o)=>e.jsx("input",{type:"text",value:t,onChange:s=>U(o,s.target.value),title:`Panel ${o+1}`,style:{fontSize:"var(--sg-text-xs)",padding:"6px 8px"}},o))})]})]}),e.jsxs("div",{className:a.previewColumn,children:[e.jsxs("div",{className:a.previewPanel,children:[e.jsx("p",{className:a.previewTitle,children:n("grid.grid_preview")}),e.jsx(po,{rows:d,cols:l,layout:g,panelRoles:S})]}),e.jsxs("div",{className:a.gridOutput,children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8},children:[e.jsx("span",{style:{fontFamily:"var(--sg-font-mono)",fontSize:"var(--sg-text-xs)",textTransform:"uppercase",letterSpacing:"0.14em",color:"var(--sg-text-tertiary)"},children:n(r==="custom"?"grid.free_prompt":"grid.generated_prompt")}),r==="seengrid"&&e.jsx("span",{style:{fontFamily:"var(--sg-font-mono)",fontSize:"var(--sg-text-xs)",color:"var(--sg-gold)",letterSpacing:"0.04em"},children:"★ SeenGrid Optimized"})]}),r==="custom"?e.jsx("textarea",{value:T,onChange:t=>_(t.target.value),placeholder:`${d}×${l} Grid — ${R} ${n("grid.panels")}. ${n("grid.custom_ph_suffix")}`,spellCheck:!1,style:{minHeight:200}}):e.jsx("div",{style:{background:"var(--sg-bg-surface-0)",border:"1px solid var(--sg-gold-dim)",borderRadius:"var(--sg-radius-lg)",padding:"var(--sg-space-xl)",minHeight:200,fontFamily:"var(--sg-font-mono)",fontSize:"var(--sg-text-sm)",lineHeight:1.7,color:"var(--sg-text-primary)",boxShadow:"0 0 16px rgba(212,149,42,0.08)",whiteSpace:"pre-wrap",cursor:"text"},onClick:t=>{const o=document.createRange();o.selectNodeContents(t.currentTarget);const s=window.getSelection();s.removeAllRanges(),s.addRange(o)},children:$}),e.jsxs("button",{className:"sg-btn-primary",style:{width:"100%",marginTop:12},onClick:z,children:[e.jsx(ho,{})," ",n(k?"common.copied":"grid.copy_btn")]}),r==="seengrid"&&e.jsxs("div",{style:{marginTop:16,padding:"var(--sg-space-lg)",background:"var(--sg-bg-surface-1)",border:"1px solid var(--sg-border-subtle)",borderRadius:"var(--sg-radius-lg)"},children:[e.jsx("p",{style:{fontFamily:"var(--sg-font-mono)",fontSize:"var(--sg-text-xs)",color:"var(--sg-gold)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4},children:p.label}),e.jsx("p",{style:{fontSize:"var(--sg-text-sm)",color:"var(--sg-text-tertiary)"},children:p.desc}),e.jsxs("p",{style:{fontFamily:"var(--sg-font-mono)",fontSize:"var(--sg-text-xs)",color:"var(--sg-text-disabled)",marginTop:6},children:["Source: ",p.source]})]})]})]})]})}function po({rows:n,cols:u,layout:i,panelRoles:r}){const m=i==="seamless"?0:i==="framed"?3:2,d=i==="polaroid"?6:0,b=i==="polaroid"?"#f0ece4":i==="framed"?"#000":"var(--sg-bg-surface-1)",l=i==="storyboard"?"repeating-linear-gradient(45deg, var(--sg-bg-surface-2), var(--sg-bg-surface-2) 2px, var(--sg-bg-surface-3) 2px, var(--sg-bg-surface-3) 8px)":"var(--sg-bg-surface-2)";return e.jsx("div",{style:{background:b,padding:d,borderRadius:"var(--sg-radius-md)",border:"1px solid var(--sg-border-subtle)"},children:e.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${u}, 1fr)`,gap:m},children:Array.from({length:n*u},(x,g)=>e.jsx("div",{style:{background:l,border:i==="framed"?"none":"1px solid var(--sg-border-subtle)",padding:i==="polaroid"?"0 0 18px 0":0,borderRadius:i==="polaroid"?"1px":"2px",aspectRatio:i==="letterbox"?"16/9":"1/1",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx("span",{style:{fontSize:7,fontFamily:"var(--sg-font-mono)",color:i==="polaroid"?"#777":"var(--sg-text-disabled)",letterSpacing:"0.3px",textAlign:"center",padding:"0 4px",lineHeight:1.3},children:r[g]||`P${g+1}`})},g))})})}const ho=()=>e.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"currentColor",style:{display:"inline",verticalAlign:"middle"},children:[e.jsx("path",{d:"M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"}),e.jsx("path",{d:"M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z"})]});export{uo as default};
