import{u as U,r as u,j as e}from"./index-CtJISUEm.js";const Y="_container_uwu73_6",K="_controlsColumn_uwu73_18",H="_modeToggle_uwu73_33",M="_modeToggleBtn_uwu73_41",q="_active_uwu73_61",V="_starIcon_uwu73_67",W="_section_uwu73_73",Z="_sectionTitle_uwu73_80",Q="_optionalLabel_uwu73_90",J="_presetList_uwu73_96",X="_presetGroup_uwu73_102",ee="_presetGroupHeader_uwu73_108",te="_presetGroupLabel_uwu73_116",ne="_presetGroupCount_uwu73_124",ae="_presetItem_uwu73_133",oe="_presetName_uwu73_154",se="_presetDesc_uwu73_165",re="_presetOptBadge_uwu73_172",ie="_presetBadge_uwu73_180",le="_templateDesc_uwu73_195",ce="_chipGrid_uwu73_203",de="_chip_uwu73_203",ue="_chipPulse_uwu73_1",pe="_layoutChips_uwu73_248",he="_gridSizeDisplay_uwu73_255",me="_gridSize_uwu73_255",ge="_gridSizeNote_uwu73_269",fe="_dimControls_uwu73_278",be="_dimLabel_uwu73_285",ye="_dimButtons_uwu73_294",we="_dimBtn_uwu73_299",ve="_dimX_uwu73_316",Se="_dimTotal_uwu73_322",Ne="_refList_uwu73_329",Ee="_refItem_uwu73_335",Re="_refBadge_uwu73_341",xe="_refText_uwu73_351",Ce="_refHint_uwu73_357",Te="_textInput_uwu73_365",_e="_panelGrid_uwu73_384",Ae="_panelInput_uwu73_389",$e="_previewColumn_uwu73_405",Ie="_previewPanel_uwu73_410",Oe="_previewTitle_uwu73_418",Be="_gridCell_uwu73_429",De="_gridCellLabel_uwu73_443",Pe="_gridOutput_uwu73_455",Le="_outputHeader_uwu73_459",Fe="_outputLabel_uwu73_466",je="_sgBadge_uwu73_474",ke="_outputBox_uwu73_481",Ge="_copyButton_uwu73_496",ze="_presetInfo_uwu73_523",Ue="_presetInfoTitle_uwu73_531",Ye="_presetInfoDesc_uwu73_540",Ke="_presetInfoSource_uwu73_546",t={container:Y,controlsColumn:K,modeToggle:H,modeToggleBtn:M,active:q,starIcon:V,section:W,sectionTitle:Z,optionalLabel:Q,presetList:J,presetGroup:X,presetGroupHeader:ee,presetGroupLabel:te,presetGroupCount:ne,presetItem:ae,presetName:oe,presetDesc:se,presetOptBadge:re,presetBadge:ie,templateDesc:le,chipGrid:ce,chip:de,chipPulse:ue,layoutChips:pe,gridSizeDisplay:he,gridSize:me,gridSizeNote:ge,dimControls:fe,dimLabel:be,dimButtons:ye,dimBtn:we,dimX:ve,dimTotal:Se,refList:Ne,refItem:Ee,refBadge:Re,refText:xe,refHint:Ce,textInput:Te,panelGrid:_e,panelInput:Ae,previewColumn:$e,previewPanel:Ie,previewTitle:Oe,gridCell:Be,gridCellLabel:De,gridOutput:Pe,outputHeader:Le,outputLabel:Fe,sgBadge:je,outputBox:ke,copyButton:Ge,presetInfo:ze,presetInfoTitle:Ue,presetInfoDesc:Ye,presetInfoSource:Ke},He="world-zone-board-3x3",Me="World Zone Board",qe="SeenGrid Optimized",Ve=3,We=3,Ze="9 räumlich verbundene Zonen eines Filmschauplatzes. Jede Zone = begehbarer Bereich.",Qe="Even",Je="DeepSeek1.txt — 3x3GRIDS.txt PROMPT 1",Xe=`World Zone Builder 3x3
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
No disconnected zones. No architecture or geology drift. No random fantasy clutter without spatial logic. No quality downgrade.`,et=["Entrance","Narrow Passage","Threshold","Main Locus","Observation Point","Hidden Depth","Side Alley","Elevated Vantage","Aftermath Area"],tt=[{id:"location",label:"Location / Reference",placeholder:'z.B. "abandoned Soviet factory, winter, blue dusk" oder Referenzbild-Beschreibung',required:!0}],nt={id:He,label:Me,badge:qe,rows:Ve,cols:We,desc:Ze,layout:Qe,source:Je,prompt:Xe,panelRoles:et,inputFields:tt},at="multishot-3x3-single-zone",ot="3x3 Multi-Shot (Single Zone)",st="SeenGrid Optimized",rt=3,it=3,lt="9 aufeinanderfolgende Film-Beats in einer Zone. Storyboard, keine Variations-Tabelle.",ct="Even",dt="DeepSeek1.txt — 3x3GRIDS.txt PROMPT 2A",ut=`3x3 Multi-Shot Grid — Single-Zone Version
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
No face or outfit drift. No zone changes within the sequence. No duplicated or near-identical shots. No pasted-in character feeling. No quality drop.`,pt=["Establishing Shot","Atmospheric Insert","Character Introduction","Tension Build","Emotional Beat","Escalation","Peak / Reveal","Consequence / Payoff","Lingering Aftermath"],ht=[{id:"charRef",label:"Reference A — Character",placeholder:"Charakter-Beschreibung oder Referenzbild",required:!0},{id:"zoneRef",label:"Reference B — Zone/Scene",placeholder:"Zone aus World Zone Board oder Szenenbeschreibung",required:!0}],mt={id:at,label:ot,badge:st,rows:rt,cols:it,desc:lt,layout:ct,source:dt,prompt:ut,panelRoles:pt,inputFields:ht},gt="multishot-3x3-cross-zone",ft="3x3 Multi-Shot (Cross Zone)",bt="SeenGrid Optimized",yt=3,wt=3,vt="Mini-Story: Bewegung durch 3 Zonen. Location Journey, räumliche Progression.",St="Even",Nt="DeepSeek1.txt — 3x3GRIDS.txt PROMPT 2B",Et=`3x3 Multi-Shot Grid — Cross-Zone Version
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
No face or outfit drift. No disconnected location jumps. No duplicated shots. No pasted-in character feeling.`,Rt=["Arrival","First Contact","Outer Zone","Transition","Threshold / Passage","Rising Tension","Core Confrontation","Hidden Depth","Aftermath"],xt=[{id:"charRef",label:"Reference A — Character",placeholder:"Charakter-Beschreibung",required:!0},{id:"boardRef",label:"Reference B — World Zone Board",placeholder:"Beschreibung des 3x3 Zone Boards",required:!0}],Ct={id:gt,label:ft,badge:bt,rows:yt,cols:wt,desc:vt,layout:St,source:Nt,prompt:Et,panelRoles:Rt,inputFields:xt},Tt="character-angle-3x3",_t="Character Storyboard 3x3",At="SeenGrid Optimized",$t=3,It=3,Ot="Gleicher Charakter in 9 Kameraperspektiven. Keine technische Tabelle — 9 Filmaufnahmen.",Bt="Even",Dt="DeepSeek1.txt — 3x3GRIDS.txt PROMPT 3",Pt=`Cinematic 3x3 Character Grid
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
No face drift, no outfit change, no flat rendering, no neutral studio background, no quality downgrade.`,Lt=["ECU Face","CU Shoulders","Medium Shot","Full Body Front","Low Angle Heroic","High Angle","True Side Profile","Over-the-Shoulder","Three-Quarter Rear"],Ft=[{id:"charFull",label:"Reference A — Full Body",placeholder:"Charakter-Beschreibung (Ganzkörper)",required:!0},{id:"faceCrop",label:"Reference B — Face Crop",placeholder:"Face Crop Beschreibung (höchste Autorität)",required:!1}],jt={id:Tt,label:_t,badge:At,rows:$t,cols:It,desc:Ot,layout:Bt,source:Dt,prompt:Pt,panelRoles:Lt,inputFields:Ft},kt="character-angle-study-2x2",Gt="Character Angle Study",zt="SeenGrid Optimized",Ut=2,Yt=2,Kt="4 Kameraperspektiven Ganzkörper. Nicht 'Turnaround' — 4 Filmaufnahmen.",Ht="Even",Mt="DeepSeek1.txt — Angle Study and Detail Anchor.txt",qt=`Character Angle Study

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
No quality downgrade from the source image.`,Vt=["Front View","True Right Profile","True Left Profile","Back View"],Wt=[{id:"charFull",label:"Reference A — Full Body",placeholder:"Charakter-Ganzkörper Beschreibung",required:!0},{id:"faceCrop",label:"Reference B — Face Crop",placeholder:"Face Crop (höchste Autorität für Gesicht)",required:!1}],Zt={id:kt,label:Gt,badge:zt,rows:Ut,cols:Yt,desc:Kt,layout:Ht,source:Mt,prompt:qt,panelRoles:Vt,inputFields:Wt},Qt="detail-anchor-strip",Jt="Detail Anchor Strip",Xt="SeenGrid Optimized",en=1,tn=4,nn="3-5 Detail-Crops der wichtigsten Identity-Anker. Verhindert Drift in späteren Generierungen.",an="Even",on="DeepSeek1.txt — Angle Study and Detail Anchor.txt STEP 6",sn=`Detail Anchor Strip

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
No quality drop.`,rn=["Detail 1","Detail 2","Detail 3","Detail 4"],ln=[{id:"charDesc",label:"Character Angle Study",placeholder:"Beschreibung des Charakters und der wichtigsten Details",required:!0}],cn={id:Qt,label:Jt,badge:Xt,rows:en,cols:tn,desc:nn,layout:an,source:on,prompt:sn,panelRoles:rn,inputFields:ln},dn="two-character-integration",un="Two Character Integration",pn="SeenGrid Optimized",hn=1,mn=1,gn="Place two separate character references into one coherent cinematic scene with locked individual identities.",fn="Even",bn="MISSING_PRESETS.txt — Item 1",yn=`Two Character Integration

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
No mismatched scale or perspective.`,wn=["Scene — Character A + B"],vn=[{id:"scene",label:"Scene Description",placeholder:"Describe the cinematic scene...",required:!0},{id:"action",label:"Action / Interaction",placeholder:"What are the characters doing?",required:!0}],Sn={id:dn,label:un,badge:pn,rows:hn,cols:mn,desc:gn,layout:fn,source:bn,prompt:yn,panelRoles:wn,inputFields:vn},Nn="outfit-swap",En="Outfit Swap",Rn="SeenGrid Optimized",xn=1,Cn=1,Tn="Change only the outfit on an existing character reference sheet — face, body, pose, and layout stay identical.",_n="Even",An="MISSING_PRESETS.txt — Item 2",$n=`Outfit Swap — Identity Locked

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
No face, body, hairstyle, pose, camera, layout, or background changes.`,In=["Outfit Swap — Updated Grid"],On=[{id:"outfit",label:"New Outfit Description",placeholder:"Describe the new outfit in detail...",required:!0}],Bn={id:Nn,label:En,badge:Rn,rows:xn,cols:Cn,desc:Tn,layout:_n,source:An,prompt:$n,panelRoles:In,inputFields:On},Dn="environment-continuity-2x3",Pn="Environment Continuity",Ln="SeenGrid Optimized",Fn=2,jn=3,kn="Show the same location from 6 camera positions to establish spatial consistency for video generation.",Gn="Even",zn="MISSING_PRESETS.txt — Item 3",Un=`Environment Continuity

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
No lighting direction change.`,Yn=["Wide Establishing Shot","Low Angle — Vertical Element","Ground-Level POV","Reverse Angle","Tight Detail — Texture","Overhead / Elevated"],Kn=[],Hn={id:Dn,label:Pn,badge:Ln,rows:Fn,cols:jn,desc:kn,layout:Gn,source:zn,prompt:Un,panelRoles:Yn,inputFields:Kn},Mn="expression-target-2x3",qn="Expression Target",Vn="SeenGrid Optimized",Wn=2,Zn=3,Qn="6 controlled expression variants of the same character — neutral to exhausted — without identity drift.",Jn="Even",Xn="MISSING_PRESETS.txt — Item 7",ea=`Expression Target

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
No exaggerated cartoon distortion.`,ta=["Neutral","Restrained Subtle Smile","Soft Laughter","Confused / Uncertain","Angry — Controlled","Sad / Exhausted"],na=[],aa={id:Mn,label:qn,badge:Vn,rows:Wn,cols:Zn,desc:Qn,layout:Jn,source:Xn,prompt:ea,panelRoles:ta,inputFields:na},oa="lighting-test-2x2",sa="Lighting Test Matrix",ra="SeenGrid Optimized",ia=2,la=2,ca="Same character under 4 different lighting conditions — identity, pose, and background locked.",da="Even",ua="MISSING_PRESETS.txt — Item 8",pa=`Lighting Test Matrix

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
No face, pose, framing, or background drift.`,ha=["Soft Diffuse Front","Hard Top Lighting","Side Lighting","Underlighting"],ma=[],ga={id:oa,label:sa,badge:ra,rows:ia,cols:la,desc:ca,layout:da,source:ua,prompt:pa,panelRoles:ha,inputFields:ma},fa="progression-1x4",ba="Progression Array",ya="SeenGrid Optimized",wa=1,va=4,Sa="Same character across a gradual state change in 4 horizontal panels — transformation, damage, aging.",Na="Even",Ea="MISSING_PRESETS.txt — Item 9",Ra=`Progression Array

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
No camera or framing drift.`,xa=["Base State — Calm, Intact","Lightly Altered","Clearly Affected","Fully Transformed"],Ca=[{id:"stateType",label:"State Change Type",placeholder:"e.g. aging, battle damage, corruption, illness...",required:!1}],Ta={id:fa,label:ba,badge:ya,rows:wa,cols:va,desc:Sa,layout:Na,source:Ea,prompt:Ra,panelRoles:xa,inputFields:Ca},_a="cutaway-worldbuilding",Aa="Cutaway Worldbuilding",$a="SeenGrid Optimized",Ia=1,Oa=1,Ba="Reveal multiple connected layers of one location in a single cross-section composition with spatial logic.",Da="Even",Pa="MISSING_PRESETS.txt — Item 10",La=`Cross-Section / Cutaway Worldbuilding

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
No repeated copied rooms. No chaotic overlap.`,Fa=["Cross-Section Cutaway"],ja=[{id:"location",label:"Location",placeholder:"Describe the location and its layers...",required:!0}],ka={id:_a,label:Aa,badge:$a,rows:Ia,cols:Oa,desc:Ba,layout:Da,source:Pa,prompt:La,panelRoles:Fa,inputFields:ja},Ga="knolling-layout",za="Knolling / Inventory Layout",Ua="SeenGrid Optimized",Ya=1,Ka=1,Ha="Break down an outfit or prop set into clean flat-lay components for asset reference and consistency.",Ma="Even",qa="MISSING_PRESETS.txt — Item 11",Va=`Knolling / Inventory Layout

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
No cluttered composition.`,Wa=["Knolling Inventory"],Za=[{id:"subject",label:"Subject (Outfit / Prop Set)",placeholder:"Describe the outfit or prop set to break down...",required:!0}],Qa={id:Ga,label:za,badge:Ua,rows:Ya,cols:Ka,desc:Ha,layout:Ma,source:qa,prompt:Va,panelRoles:Wa,inputFields:Za},Ja="2shot-keyframe-2x2",Xa="2-Shot Keyframe Pairs",eo="SeenGrid Optimized",to=2,no=2,ao="Start + End frames for two consecutive independent shots — direct input for Kling/Seedance video generation.",oo="Even",so="MISSING_PRESETS.txt — 2-SHOT INDEPENDENT KEYFRAME PAIRS",ro=`2-Shot Independent Keyframe Pairs

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
No forced identical frame between Panel 2 and Panel 3.`,io=["Shot 1 — Start Frame","Shot 1 — End Frame","Shot 2 — Start Frame","Shot 2 — End Frame"],lo=[{id:"shot1",label:"Shot 1 — Motion / Action",placeholder:"Describe the motion or action for Shot 1...",required:!0},{id:"shot2",label:"Shot 2 — Motion / Action",placeholder:"Describe the motion or action for Shot 2...",required:!0}],co={id:Ja,label:Xa,badge:eo,rows:to,cols:no,desc:ao,layout:oo,source:so,prompt:ro,panelRoles:io,inputFields:lo},uo="architectural-blueprint-2x2",po="Architectural Blueprint",ho="SeenGrid Optimized",mo=2,go=2,fo="Technical 4-view floor plan and elevation diagram of a cinematic scene — hard spatial reference for Kling/Seedance.",bo="Even",yo="MISSING_PRESETS.txt — ARCHITEKTONISCHER 3D BAUPLAN",wo=`Architectural 3D Blueprint

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
No color, no artistic rendering, no mood, no characters, no atmosphere. No creative interpretation.`,vo=["Top-Down Floor Plan","Front Elevation","Side Elevation","Isometric 3D Overview"],So=[],No={id:uo,label:po,badge:ho,rows:mo,cols:go,desc:fo,layout:bo,source:yo,prompt:wo,panelRoles:vo,inputFields:So},Eo="scene-spatial-layout-2x2",Ro="Scene Spatial Layout Guide",xo="SeenGrid Optimized",Co=2,To=2,_o="Production-ready 4-view spatial diagram of a scene — geometry reference for Kling/Seedance, with camera positions marked.",Ao="Even",$o="MISSING_PRESETS.txt — SCENE SPATIAL LAYOUT GUIDE",Io=`Scene Spatial Layout Guide

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
Keep it strictly technical and accurate.`,Oo=["Top-Down Floor Plan","Main Camera Elevation","Side Elevation (90°)","Isometric 3D Overview"],Bo=[],Do={id:Eo,label:Ro,badge:xo,rows:Co,cols:To,desc:_o,layout:Ao,source:$o,prompt:Io,panelRoles:Oo,inputFields:Bo},Po="character-sheet-8view",Lo="8-View Character Sheet",Fo="SeenGrid Optimized",jo=2,ko=4,Go="Professional 8-view character turnaround — 4 portrait views + 4 full-body views for consistent multi-angle generation.",zo="Even",Uo="MISSING_PRESETS.txt — 8-view character sheet",Yo=`8-View Character Sheet

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
No identity drift. No hairstyle or outfit changes between panels. No artistic stylization.`,Ko=["Portrait — Front","Portrait — Right","Portrait — Left","Portrait — Back","Full Body — Front","Full Body — Right","Full Body — Left","Full Body — Back"],Ho=[],Mo={id:Po,label:Lo,badge:Fo,rows:jo,cols:ko,desc:Go,layout:zo,source:Uo,prompt:Yo,panelRoles:Ko,inputFields:Ho},I=[{id:"angle-study",label:"Angle Study",desc:"Multiple camera angles on the same subject — explores spatial relationships and POV variety",defaultRows:2,defaultCols:2,panelRoles:["Front Wide","Profile Close","High Angle","Low Angle"],template:`Create a {rows}x{cols} grid of camera angle studies.

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

FORBIDDEN: No inconsistent world physics. No empty panels. No generic stock environments.`,panelRoleDefaults:{"3x3":["Exterior Wide","Entry Zone","Interior A","Interior B","Detail A","Detail B","Atmosphere","Scale Ref","Signature Element"],"2x3":["Exterior Wide","Entry Zone","Interior","Detail A","Atmosphere","Signature"],"2x2":["Exterior Wide","Interior Key","Atmosphere","Detail Close"]}}],x=[nt,mt,Ct,jt,Zt,cn,Sn,Bn,Hn,aa,ga,Ta,ka,Qa,co,No,Do,Mo];function qo(a){const d={};a.forEach(r=>{const l=`${r.rows}×${r.cols}`;d[l]||(d[l]=[]),d[l].push(r)});const i=["3×3","2×2","2×3","1×4","1×1","4×2"],s=[];return i.forEach(r=>{d[r]&&s.push({key:r,presets:d[r]})}),Object.keys(d).forEach(r=>{i.includes(r)||s.push({key:r,presets:d[r]})}),s}const Vo=qo(x);function O(a){const d=a.rows*a.cols,i=a.panelRoles||[];return Array.from({length:d},(s,r)=>i[r]||`Panel ${r+1}`)}function Jo(){const{t:a}=U(),d=[{id:"even",label:"Even",desc:a("grid.layout_even_desc")},{id:"letterbox",label:"Letterbox",desc:a("grid.layout_letterbox_desc")},{id:"seamless",label:"Seamless",desc:a("grid.layout_seamless_desc")},{id:"framed",label:"Framed",desc:a("grid.layout_framed_desc")},{id:"storyboard",label:"Storyboard",desc:a("grid.layout_storyboard_desc")},{id:"polaroid",label:"Polaroid",desc:a("grid.layout_polaroid_desc")}],i=[{id:"seengrid",label:"SeenGrid Optimized",star:!0,desc:a("grid.mode_seengrid_desc")},{id:"core",label:"Core",star:!1,desc:a("grid.mode_core_desc")},{id:"custom",label:"Custom Grid",star:!1,desc:a("grid.mode_custom_desc")}],[s,r]=u.useState("seengrid"),[l,w]=u.useState(3),[p,v]=u.useState(3),[b,g]=u.useState("even"),[h,B]=u.useState(x[0]),[N,S]=u.useState(()=>O(x[0])),[f,D]=u.useState(I[0]),[E,P]=u.useState(""),[y,L]=u.useState(""),[C,F]=u.useState(""),[j,T]=u.useState(!1);u.useEffect(()=>{var n;w(h.rows),v(h.cols),g(((n=h.layout)==null?void 0:n.toLowerCase())||"even"),S(O(h))},[h]),u.useEffect(()=>{var c;if(s!=="core")return;const n=`${l}x${p}`,o=((c=f.panelRoleDefaults)==null?void 0:c[n])||f.panelRoles||[];o.length&&S(o)},[f]),u.useEffect(()=>{if(s!=="core"&&s!=="custom")return;const n=l*p;S(o=>o.length===n?o:o.length<n?[...o,...Array.from({length:n-o.length},(c,m)=>`Panel ${o.length+m+1}`)]:o.slice(0,n))},[l,p,s]);function _(n){const o=d.find(c=>c.id===n);return o?`${o.label} — ${o.desc}`:n}function k(){const n=l*p;if(s==="seengrid"){const m=[h.prompt];return m.push(`LAYOUT: ${l}×${p} grid. ${_(b)}.`),y&&m.push(`STYLE OVERRIDE: Apply ${y}.`),m.join(`

`)}if(s==="custom")return C;const o=N.slice(0,n).map((m,z)=>`  Panel ${z+1} [${m}]:`).join(`
`);let c=f.template.replace(/\{rows\}/g,l).replace(/\{cols\}/g,p).replace(/\{count\}/g,n).replace(/\{panelLines\}/g,o).replace(/\{layout\}/g,_(b));return E&&(c=`SUBJECT: ${E}

`+c),y&&(c+=`

STYLE: ${y}`),c}const A=k(),R=l*p;async function $(){try{await navigator.clipboard.writeText(A),T(!0),setTimeout(()=>T(!1),2200)}catch{}}function G(n,o){S(c=>{const m=[...c];return m[n]=o,m})}return u.useEffect(()=>{function n(o){(o.metaKey||o.ctrlKey)&&o.shiftKey&&o.key==="C"&&(o.preventDefault(),$())}return window.addEventListener("keydown",n),()=>window.removeEventListener("keydown",n)}),e.jsxs("div",{className:t.container,children:[e.jsxs("div",{className:t.controlsColumn,children:[e.jsx("div",{className:t.modeToggle,children:i.map(n=>e.jsxs("button",{className:[t.modeToggleBtn,s===n.id&&t.active].filter(Boolean).join(" "),onClick:()=>r(n.id),title:n.desc,children:[n.star&&e.jsx("span",{className:t.starIcon,children:"★"}),n.label]},n.id))}),s==="seengrid"&&e.jsxs("div",{className:t.section,children:[e.jsx("p",{className:t.sectionTitle,children:a("grid.preset_label")}),e.jsx("div",{className:t.presetList,children:Vo.map(n=>e.jsxs("div",{className:t.presetGroup,children:[e.jsxs("div",{className:t.presetGroupHeader,children:[e.jsx("span",{className:t.presetGroupLabel,children:n.key}),e.jsx("span",{className:t.presetGroupCount,children:n.presets.length})]}),n.presets.map(o=>e.jsxs("button",{className:[t.presetItem,h.id===o.id&&t.active].filter(Boolean).join(" "),onClick:()=>B(o),title:o.desc,children:[e.jsxs("div",{children:[e.jsx("div",{className:t.presetName,children:o.label}),e.jsx("div",{className:t.presetDesc,children:o.desc})]}),o.optimized&&e.jsx("span",{className:t.presetOptBadge,children:"★"})]},o.id))]},n.key))})]}),s==="core"&&e.jsxs("div",{className:t.section,children:[e.jsx("p",{className:t.sectionTitle,children:a("grid.core_template")}),e.jsx("div",{className:t.chipGrid,children:I.map(n=>e.jsx("button",{className:[t.chip,f.id===n.id&&t.active].filter(Boolean).join(" "),onClick:()=>D(n),title:n.desc,children:n.label},n.id))}),e.jsx("p",{className:t.templateDesc,children:f.desc})]}),e.jsxs("div",{className:t.section,children:[e.jsx("p",{className:t.sectionTitle,children:a("grid.grid_size")}),s==="seengrid"?e.jsxs("div",{className:t.gridSizeDisplay,children:[e.jsxs("span",{className:t.gridSize,children:[l,"×",p]}),e.jsx("span",{className:t.gridSizeNote,children:a("grid.dim_locked")})]}):e.jsxs("div",{className:t.dimControls,children:[e.jsxs("div",{children:[e.jsx("div",{className:t.dimLabel,children:"Rows"}),e.jsx("div",{className:t.dimButtons,children:[1,2,3,4,5].map(n=>e.jsx("button",{className:[t.dimBtn,l===n&&t.active].filter(Boolean).join(" "),onClick:()=>w(n),children:n},n))})]}),e.jsx("span",{className:t.dimX,children:"×"}),e.jsxs("div",{children:[e.jsx("div",{className:t.dimLabel,children:"Cols"}),e.jsx("div",{className:t.dimButtons,children:[1,2,3,4,5].map(n=>e.jsx("button",{className:[t.dimBtn,p===n&&t.active].filter(Boolean).join(" "),onClick:()=>v(n),children:n},n))})]}),e.jsxs("span",{className:t.dimTotal,children:[R," ",a("grid.panels")]})]})]}),e.jsxs("div",{className:t.section,children:[e.jsx("p",{className:t.sectionTitle,children:a("grid.layout")}),e.jsx("div",{className:t.layoutChips,children:d.map(n=>e.jsx("button",{className:[t.chip,b===n.id&&t.active].filter(Boolean).join(" "),onClick:()=>g(n.id),title:n.desc,children:n.label},n.id))})]}),s==="seengrid"&&e.jsxs("div",{className:t.section,children:[e.jsx("p",{className:t.sectionTitle,children:a("grid.ref_images")}),e.jsxs("div",{className:t.refList,children:[e.jsxs("div",{className:t.refItem,children:[e.jsx("span",{className:t.refBadge,children:"A"}),e.jsx("span",{className:t.refText,children:a("grid.ref_char")})]}),e.jsxs("div",{className:t.refItem,children:[e.jsx("span",{className:t.refBadge,children:"B"}),e.jsx("span",{className:t.refText,children:a("grid.ref_style")})]}),e.jsx("p",{className:t.refHint,children:a("grid.ref_hint")})]})]}),s!=="custom"&&e.jsxs("div",{className:t.section,children:[e.jsxs("p",{className:t.sectionTitle,children:[a("grid.style_override")," ",e.jsx("span",{className:t.optionalLabel,children:a("common.optional")})]}),e.jsx("input",{type:"text",className:t.textInput,value:y,onChange:n=>L(n.target.value),placeholder:a(s==="seengrid"?"grid.style_ph_sg":"grid.style_ph_core")})]}),s==="core"&&e.jsxs("div",{className:t.section,children:[e.jsx("p",{className:t.sectionTitle,children:a("grid.core_subject")}),e.jsx("textarea",{className:t.textInput,rows:2,value:E,onChange:n=>P(n.target.value),placeholder:a("grid.core_subject_ph")})]}),e.jsxs("div",{className:t.section,children:[e.jsx("p",{className:t.sectionTitle,children:a("grid.panel_roles")}),e.jsx("div",{className:t.panelGrid,style:{gridTemplateColumns:`repeat(${p}, 1fr)`},children:N.slice(0,R).map((n,o)=>e.jsx("input",{type:"text",className:t.panelInput,value:n,onChange:c=>G(o,c.target.value),title:`Panel ${o+1}`},o))})]})]}),e.jsxs("div",{className:t.previewColumn,children:[e.jsxs("div",{className:t.previewPanel,children:[e.jsx("p",{className:t.previewTitle,children:a("grid.grid_preview")}),e.jsx(Wo,{rows:l,cols:p,layout:b,panelRoles:N,styles:t})]}),e.jsxs("div",{className:t.gridOutput,children:[e.jsxs("div",{className:t.outputHeader,children:[e.jsx("span",{className:t.outputLabel,children:a(s==="custom"?"grid.free_prompt":"grid.generated_prompt")}),s==="seengrid"&&e.jsx("span",{className:t.sgBadge,children:"★ SeenGrid Optimized"})]}),s==="custom"?e.jsx("textarea",{className:t.textInput,value:C,onChange:n=>F(n.target.value),placeholder:`${l}×${p} Grid — ${R} ${a("grid.panels")}. ${a("grid.custom_ph_suffix")}`,spellCheck:!1,style:{minHeight:200}}):e.jsx("div",{className:t.outputBox,onClick:n=>{const o=document.createRange();o.selectNodeContents(n.currentTarget);const c=window.getSelection();c.removeAllRanges(),c.addRange(o)},children:A}),e.jsxs("button",{className:t.copyButton,onClick:$,title:"⌘⇧C",children:[e.jsx(Zo,{})," ",a(j?"common.copied":"grid.copy_btn")]}),s==="seengrid"&&e.jsxs("div",{className:t.presetInfo,children:[e.jsx("p",{className:t.presetInfoTitle,children:h.label}),e.jsx("p",{className:t.presetInfoDesc,children:h.desc}),e.jsxs("p",{className:t.presetInfoSource,children:["Source: ",h.source]})]})]})]})]})}function Wo({rows:a,cols:d,layout:i,panelRoles:s,styles:r}){const l=i==="seamless"?0:i==="framed"?3:2,w=i==="polaroid"?6:0,p=i==="polaroid"?"#f0ece4":i==="framed"?"#000":"var(--sg-bg-surface-1)",v=i==="storyboard"?"repeating-linear-gradient(45deg, var(--sg-bg-surface-2), var(--sg-bg-surface-2) 2px, var(--sg-bg-surface-3) 2px, var(--sg-bg-surface-3) 8px)":"var(--sg-bg-surface-2)";return e.jsx("div",{style:{background:p,padding:w,borderRadius:"var(--sg-radius-md)",border:"1px solid var(--sg-border-subtle)"},children:e.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${d}, 1fr)`,gap:l},children:Array.from({length:a*d},(b,g)=>e.jsx("div",{className:r.gridCell,style:{background:v,border:i==="framed"?"none":void 0,padding:i==="polaroid"?"0 0 18px 0":0,borderRadius:i==="polaroid"?"1px":"2px",aspectRatio:i==="letterbox"?"16/9":"1/1"},children:e.jsx("span",{className:r.gridCellLabel,children:s[g]||`P${g+1}`})},g))})})}const Zo=()=>e.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"currentColor",style:{display:"inline",verticalAlign:"middle"},children:[e.jsx("path",{d:"M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"}),e.jsx("path",{d:"M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z"})]});export{Jo as default};
