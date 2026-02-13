# Fit Check — Master Tables Reference

This document contains all measurement algorithms, categories, and garment-specific callouts for Fit Check v1. Verified against codebase as of Feb 2026.

---

## 1. CHEST

### Equation
```
TotalChest = GarmentP2P × 2
Ease = TotalChest − UserChest
```
*Flat vs circumference auto-detected — see Auto-Detection section at bottom.*

### Description

**What this means**
Chest describes how much space the garment provides around your upper torso relative to your body. This measurement is important because it directly affects comfort, mobility, layering potential, and how the garment's upper-body volume is distributed. Chest is one of the primary drivers of overall fit perception in tops. Too little chest space can restrict movement or create visible tension, while more chest space allows the garment to hang away from the torso and accommodate different styling intentions. Fit Check evaluates chest by comparing the garment's total chest circumference to your chest measurement to determine the amount of extra room, or ease, present.

**How this shows up in wear**
- Chest ease influences how freely the upper body can move, especially during reaching, sitting, or layering
- Lower chest ease can result in pulling, compression, or visible stress around the chest and armholes
- Higher chest ease allows more airflow and layering and shifts the garment's visual weight outward from the torso
- Increased chest ease is commonly used in contemporary and streetwear-oriented garments to create a boxier or more relaxed upper-body silhouette

**Context**
Chest interpretation is affected by body proportions, garment structure, and styling intent. The same amount of chest ease may read differently on different body sizes, and garments designed with dropped shoulders or heavier fabrics may visually emphasize chest volume more than lighter or more structured pieces. Chest is best interpreted alongside shoulder placement and front length to understand how upper-body volume is distributed vertically and horizontally.

### Categories
| Ease Range | Category | Universal Meaning |
|---|---|---|
| < 0" | Restrictive / Non-Viable | Garment chest is smaller than body. Unlikely to fit comfortably at rest; may restrict movement. |
| 0"–2" | Ultra Close Fit | Fabric sits against chest and ribs with minimal air space; chest shape clearly visible. Raising arms overhead creates pulling across chest and shoulders. |
| 2"–4" | Close Fit | Fabric drapes near chest and ribs with slight air space; contours visible but not outlined. Arm movement feels controlled; a thin base layer fits underneath. |
| 4"–6" | Neutral Fit | Fabric hangs near chest without touching ribs when standing; chest shape softened rather than defined. Room for a standard base layer or light sweater. |
| 6"–8" | Relaxed Fit | Fabric hangs away from chest and ribs creating visible air space; garment billows slightly when moving. Room for a sweatshirt or moderate layering. |
| 8"–12" | Oversized Fit | Fabric hangs well away from chest and ribs; garment creates boxy shape extending beyond natural shoulder width. Room for heavy layering. |
| > 12" | Extreme Oversized | Fabric extends significantly beyond chest, ribs, and shoulders; garment width dominates upper body proportions. Substantial room for extensive layering. |

### Per-Garment Descriptions

| Category | T-Shirt | Polo | Button-Up | Sweatshirt/Hoodie | Sweater | Light Jacket | Heavy Jacket |
|---|---|---|---|---|---|---|---|
| Restrictive / Non-Viable | Must stretch to fit; sits under constant tension across the chest. | Pulls across the chest and placket; restrictive during movement. | Chest is smaller than body; buttoning comfortably is unlikely. | Tight through the chest with little room for movement or layering. | Stretches tightly across the chest; drape is reduced. | Restrictive across the chest; limited comfort and mobility. | Structure prevents stretch; closure and layering are difficult. |
| Ultra Close Fit | Body-hugging tee; chest contours clearly visible. | Very fitted through chest and shoulders. | Tight across chest; movement creates visible tension. | Snug upper body; little room underneath. | Clings depending on knit; little drape. | Tight fit; limited mobility. | Atypical; restricts layering and movement. |
| Close Fit | Clean, fitted tee with minimal excess fabric. | Sharp, structured polo fit. | Slim shirt silhouette; chest stays close. | Fitted hoodie with reduced volume. | Close knit fit with restrained drape. | Close jacket fit; layering limited. | Close coat fit; light layering only. |
| Neutral Fit | Standard modern tee fit. | Standard polo fit. | Classic shirt silhouette; easy movement. | Typical hoodie shape; natural volume. | Standard sweater fit with modest drape. | Standard jacket fit; normal layering. | Typical coat fit with light layering. |
| Relaxed Fit | Relaxed tee with visible drape. | Relaxed polo with easy shape. | Casual shirt with clear chest ease. | Relaxed hoodie; fuller upper-body volume. | Soft, relaxed knit drape. | Relaxed jacket or overshirt fit. | Relaxed coat with added space. |
| Oversized Fit | Oversized tee with pronounced width. | Fashion-forward oversized polo. | Oversized shirt with broad chest. | Oversized hoodie with strong volume. | Roomy, expressive knit silhouette. | Oversized jacket with broad shape. | Oversized outerwear silhouette. |
| Extreme Oversized | Very oversized tee; dramatic width. | Rare; intentionally extreme. | Highly oversized shirt with heavy drape. | Streetwear-scale oversized hoodie. | Dramatic knit volume. | Very oversized jacket. | Wide, expressive oversized coat. |

### Key Garment Callouts
- **Hoodies/Sweatshirts:** Heavier knit fabrics amplify chest volume perception. Lower ease limits layering.
- **Jackets/Coats:** Chest ease affects silhouette and layering more than drape due to structure and lining.

---

## 2. FRONT LENGTH

### Equation
```
IdealFrontLength = (Height − Inseam) × 0.65 − 2.0
RawDiff = GarmentFrontLength − IdealFrontLength
NormalizedFrontDiff = RawDiff / IdealFrontLength
```
*Torso proportion is captured directly by (Height − Inseam). The −2.0 accounts for head/neck. No separate torso adjustment table needed.*

### Description

**What this means**
Front length describes where the front hem of a top will land on your body when the garment is worn naturally. This affects how much of the waistband, pockets, and upper leg are covered and how long the torso appears visually. Front length is evaluated relative to where most people wear pants today—around the hip rather than the anatomical natural waist. Many modern casual tops are designed with longer front lengths that extend below the waistband. Because of this, front lengths categorized as Extended or Longline are common in everyday wear, while Aligned lengths may feel shorter than what some people are used to, even though they are not cropped.

**How this shows up in wear**
- Shorter front lengths expose more of the waistband and upper pockets
- Longer front lengths extend past the waistband and may cover the pockets or reach toward the upper thigh
- Front length can appear shorter in wear if the garment fits closely through the chest or stomach, as fabric is pulled over the body rather than hanging straight down

**Context**
Front length perception depends on both body proportions and garment construction. Torso length varies by person, and garments with ribbed hems or structured fabrics may sit higher or bunch rather than hanging straight. Because of this, front length is interpreted as a visual placement guide rather than an exact on-body endpoint. Fit Check v1 evaluates top length using front length only. Back length is not interpreted because it is measured inconsistently across brands and does not reliably predict on-body fit for most casual garments.

### Categories
| NormalizedFrontDiff | Category | Universal Meaning |
|---|---|---|
| < −0.14 | High-Cropped | Hem sits well above waistband. Lower stomach and belt area visible. Hem does not reach top of front pockets. |
| −0.14 to −0.08 | Cropped | Hem sits just above waistband. Belt line and upper pant fly visible. Hem does not cover top of front pockets. |
| −0.08 to +0.04 | Aligned | Hem meets waistband or upper hip. Belt mostly covered; top of front pockets may be visible. Stomach covered at rest. |
| +0.04 to +0.12 | Extended | Hem sits below waistband onto hip. Belt line and pocket openings covered. Hem reaches toward lower half of front pockets. |
| +0.12 to +0.22 | Longline | Hem falls below hip past bottom of front pockets, approaching upper thigh. Torso appears visually elongated. |
| ≥ +0.22 | Extra-Long | Hem extends clearly onto thigh, below pocket level. Garment length becomes dominant visual feature. |

### Per-Garment Descriptions

| Category | T-Shirt | Polo | Button-Up | Sweatshirt/Hoodie | Sweater | Light Jacket | Heavy Jacket |
|---|---|---|---|---|---|---|---|
| High-Cropped | High-cropped tee | High-cropped polo | High-cropped shirt | Cropped sweatshirt body | Cropped knit | Short jacket body above waist | Minimal torso coverage |
| Cropped | Cropped tee | Cropped polo | Cropped shirt | Slightly cropped hoodie | Cropped sweater | Ends near waistband | Ends near waist |
| Aligned | Tee hem meets waistband | Polo hem meets waistband | Shirt hem meets waistband | Hoodie body meets waistband | Knit hem meets waistband | Jacket ends at waistband | Upper-hip coverage |
| Extended | Extended-length tee | Extended polo | Extended shirt body | Longer hoodie body | Extended knit drape | Hip-length jacket | Hip-length outerwear |
| Longline | Longline tee | Long polo | Long shirt body | Long hoodie body | Long sweater silhouette | Upper-thigh jacket | Thigh-level coverage |
| Extra-Long | Extra-long / tunic tee | Extra-long polo | Tunic-length shirt | Very long hoodie | Extra-long knit | Mid-thigh or lower | Parka-like length |

### Key Garment Callouts
- **Ribbed/elastic hems (hoodies, sweaters):** May bunch rather than hang straight at longer lengths.
- **Curved/split hems (tees, button-ups):** Center front may sit higher than sides.
- **Heavier fabrics:** Can pull garment downward, increasing perceived length.

---

## 3. SLEEVE LENGTH

### Equation — Shoulder-to-Cuff Measurement
```
CasualSleeveEquivalent = UserDressSleeve − (UserShoulderWidth × 0.5) − 1.0"
RawSleeveDiff = GarmentSleeve − CasualSleeveEquivalent
PerceivedSleeveDiff = RawSleeveDiff + ShoulderAdjustment
```

### Equation — Center-Back-to-Cuff Measurement
```
EffectiveGarmentCB = GarmentCBtoCuff − 0.75"
PerceivedSleeveDiff = EffectiveGarmentCB − UserDressSleeve
```

### Description

**What this means**
Sleeve length describes where the sleeve cuff will land on your arm when the garment is worn naturally. This affects how much of your wrist or hand is covered and how long the sleeve appears when standing still or moving. Brands measure sleeve length in different ways. Some casual garments measure from the shoulder seam to the cuff, while others—especially button-ups—measure from the center of the back of the neck to the wrist or cuff. Fit Check accounts for these differences so sleeve length can be interpreted consistently.

**How this shows up in wear**
- Shorter sleeves expose more of the wrist or forearm
- Longer sleeves may rest at the wrist, extend onto the hand, or pool slightly at the cuff
- Sleeve length may appear longer or shorter depending on where the sleeve begins on the shoulder

**Context**
Sleeve length perception is influenced by shoulder placement. A dropped shoulder lowers the sleeve's starting point and makes sleeves appear longer, while a narrower shoulder raises the starting point and makes sleeves appear shorter. Because of this, sleeve length is evaluated alongside shoulder width rather than in isolation.

### Shoulder Adjustment
| Shoulder Category | ShoulderDiff Range | Adjustment |
|---|---|---|
| Narrow | < −1.0" | −0.50" |
| Slightly Narrow | −1.0" to −0.5" | −0.25" |
| Aligned | −0.5" to +0.5" | 0.00" |
| Slightly Dropped | +0.5" to +1.25" | +0.25" |
| Dropped | +1.25" to +2.0" | +0.50" |
| Heavily Dropped | > +2.0" | `ShoulderDiff × 0.6` (scales proportionally) |

**⚠️ Calibration note:** The heavily dropped adjustment (× 0.6 multiplier) may still under-adjust for streetwear/oversized garments where sleeves appear shorter than expected. Needs real-world testing and possible recalibration.

### Categories
| PerceivedSleeveDiff | Category | Universal Meaning |
|---|---|---|
| < −1.0" | Noticeably Short | Cuff rests well above wrist bone; wrist and part of forearm exposed. Sleeve appears cropped relative to arm length. |
| −1.0" to −0.5" | Slightly Short | Cuff rests just above wrist bone; wrist visible, no forearm exposure. Sleeve reads slightly short. |
| −0.5" to +0.5" | Aligned | Cuff meets wrist bone directly; neither wrist nor hand visibly covered. Neutral sleeve position. |
| +0.5" to +1.25" | Slightly Long | Cuff rests past wrist bone onto top of hand. Hand coverage begins slightly. |
| +1.25" to +2.0" | Long | Cuff covers base of thumb; noticeable hand coverage. Sleeve clearly extends below wrist. |
| > +2.0" | Very Long | Cuff covers significant part of hand — reaching thumb joint or knuckles. Strongly extended appearance. |

### Per-Garment Descriptions

| Category | T-Shirt | Polo | Button-Up | Sweatshirt/Hoodie | Sweater | Light Jacket | Heavy Jacket |
|---|---|---|---|---|---|---|---|
| Noticeably Short | Wrist and upper forearm visible; cropped visual line. | Wrist exposed; sleeve ends high. | Wrist + some forearm visible while arm is lowered. | Wrist exposed; sleeve line sits high on arm. | Wrist exposed; sleeve ends visibly above wrist. | Wrist exposed; sleeve does not meet glove/hand area. | Wrist exposed; sleeve sits above outerwear coverage level. |
| Slightly Short | Wrist visible; minor gap between cuff and wrist bone. | Wrist clearly visible. | Wrist visible; sleeve ends slightly above wrist. | Wrist visible; sleeve sits just short of wrist. | Wrist visible; subtle short appearance. | Wrist visible; does not reach hand. | Wrist visible; outerwear sleeve sits above wrist line. |
| Aligned | Cuff meets wrist; no coverage. | Wrist line fully matched. | Standard wrist-level sleeve position. | Sleeve meets wrist; no pooling. | Sleeve meets wrist; no extension onto hand. | Sleeve sits at wrist; stable visual line. | Sleeve reaches wrist bone; hand uncovered. |
| Slightly Long | Cuff touches top of hand; relaxed appearance. | Light hand contact. | Sleeve contacts top of hand; slight folding at cuff. | Cuff extends onto hand; small pooling or bunching. | Cuff overlaps hand slightly; soft drape. | Cuff overlaps hand; creates a longer sleeve line. | Sleeve overlaps top of hand; increases coverage. |
| Long | Cuff covers thumb base; elongated silhouette. | Hand partially covered. | Hand partially covered; visible stacking. | Cuff covers thumb base; pooling increases. | Cuff covers thumb base; more pronounced drape. | Cuff extends onto hand; elongated sleeve profile. | Additional hand coverage; extended sleeve line. |
| Very Long | Sleeve covers thumb joint/knuckles; extended silhouette. | Cuff sits deep on hand. | Sleeve covers part of hand entirely; strong oversized effect. | Sleeve covers thumb joint; heavy pooling possible. | Sleeve extends well onto hand; long-drape silhouette. | Sleeve covers hand significantly; extended sleeve shape. | Sleeve extends across hand; maximum coverage. |

### Key Garment Callouts
- **Button-ups:** Fixed cuffs create stable landing point. Extra length folds/stacks at cuff.
- **Sweaters/knits:** Longer sleeves drape softly. Ribbed cuffs allow gradual extension.
- **Hoodies:** Ribbed cuffs grip wrist, prevent hand coverage. Extra length pools above cuff.
- **Light jackets (unstructured cuffs):** Sleeve moves more freely over wrist/hand.
- **Coats (wide/open cuffs):** Wider cuffs allow sleeve to drop over hand.
- **Heavily dropped shoulders:** Sleeve may still reach wrist even if measured length appears shorter.

### User Selection Required
User must indicate whether garment sleeve is measured "from shoulder seam" or "from center back."

---

## 4. SHOULDER

### Equation
```
ShoulderDiff = GarmentShoulder − UserShoulder
```

### Description

**What this means**
Shoulder width describes how far apart the garment's shoulder seams sit across the upper back. It affects where the sleeve begins, how the garment hangs through the shoulders, and how structured or relaxed the upper body appears. Most brands measure shoulder width by laying the garment flat and measuring straight across the back from one shoulder seam to the other. Some garments are constructed in ways that make shoulder measurement less exact (such as dropped shoulders, yoke seams, or seamless knits). In these cases, the measurement still indicates where the garment will sit and how it will drape, but it is best read as an approximation of shoulder placement rather than a precise anatomical match.

**How this shows up in wear**
- Shoulder placement affects where the sleeve starts on the arm
- Narrower shoulders create a more structured, compact upper body
- Wider/dropped shoulders create a more relaxed, casual upper body
- Shoulder width is taken into account as part of sleeve length perception

**Context**
Shoulder is best interpreted alongside sleeve length and chest to understand how the upper body is structured overall.

### Categories
| Diff Range | Category | Universal Meaning |
|---|---|---|
| < −1.0" | Narrow | Sleeve starts closer to neck than shoulder edge, creating structured upper body and compact silhouette. Shoulder movement may feel slightly restricted. |
| −1.0" to −0.5" | Slightly Narrow | Sleeve starts just inside shoulder edge, creating cleaner shaped upper body without feeling tight. Sleeves sit slightly higher; movement mostly natural. |
| −0.5" to +0.5" | Aligned | Sleeve starts at or near natural shoulder edge. Balanced upper-body shape. Sleeves fall naturally; movement unrestricted. |
| +0.5" to +1.25" | Slightly Dropped | Sleeve starts slightly below shoulder edge, softening upper body without excessive size. Sleeves begin lower and may appear slightly longer. |
| +1.25" to +2.0" | Dropped | Sleeve starts clearly below shoulder edge. Relaxed, looser upper-body shape. Sleeves appear longer; shoulder line softened. |
| > +2.0" | Heavily Dropped | Sleeve starts well below shoulder edge. Pronounced oversized or boxy silhouette. Sleeves appear significantly longer; shoulder definition reduced. |

### Per-Garment Descriptions

| Category | T-Shirt | Polo | Button-Up | Sweatshirt/Hoodie | Sweater | Light Jacket | Heavy Jacket |
|---|---|---|---|---|---|---|---|
| Narrow | Produces a closer tee silhouette with a defined shoulder line; less relaxed drape. | Neat, close shoulder; minimal drape. | Feels fitted through the shoulders; reaching forward may feel more limited. | Creates a more structured upper fit through the shoulders, with less natural slouch than typical hoodies. | Produces a more controlled drape through the shoulders, with the effect varying by knit density. | Reduces layering room and may limit shoulder mobility, depending on construction. | Can feel structured and restrictive through the shoulders, especially when layered underneath. |
| Slightly Narrow | Cleaner tee silhouette with subtle shoulder definition; still relaxed in wear. | Neat, shaped shoulder; controlled but comfortable drape. | Clean, tailored shoulder line; movement remains comfortable. | Slightly more structured than typical hoodies; reduced slouch without tightness. | More controlled drape through the shoulders; effect varies by knit weight. | Cleaner shoulder shape; light reduction in layering room. | Structured shoulder presence; still wearable for layering with care. |
| Aligned | Standard tee silhouette with natural shoulder drape. | Balanced polo shape with clean, comfortable lines. | Classic shirt shoulder alignment with natural movement. | Typical hoodie drape with a natural amount of slouch. | Even knit drape without added tension or looseness. | Standard jacket shoulder with normal layering capacity. | Traditional coat shoulder structure with predictable movement and layering. |
| Slightly Dropped | Relaxed tee shape with softer shoulder slope; still proportional. | Slightly more casual polo silhouette with added ease. | Casual shirt shoulder with visible softness; less formal structure. | Common hoodie fit; relaxed shoulder line without oversizing. | Softer knit drape through the shoulders; relaxed appearance. | Casual jacket shape with easier movement and mild looseness. | Relaxed outerwear shoulder; increased ease without a boxy feel. |
| Dropped | Boxier tee silhouette with a visible shoulder drop and relaxed drape. | Rare but produces a very casual, relaxed polo shape. | Casual, oversized shirt appearance with softened structure. | Common relaxed hoodie fit with pronounced shoulder drop. | Relaxed knit silhouette with noticeable shoulder drape. | Casual jacket shape with a looser, less structured upper body. | Relaxed outerwear silhouette with added room and softer shoulder definition. |
| Heavily Dropped | Very oversized tee with a pronounced shoulder drop and wide silhouette. | Extremely rare; produces an intentionally oversized polo shape. | Fashion-forward oversized shirt with dramatic looseness. | Common in oversized hoodies; strong shoulder drop with long-appearing sleeves. | Dramatic knit drape with a wide, relaxed upper body. | Oversized jacket silhouette with minimal shoulder structure. | Very oversized outerwear with a broad, relaxed shoulder profile. |

### Key Garment Callouts
- **Hoodies/Sweatshirts:** Dropped shoulders are common and increase visual sleeve length. Narrow shoulders may be less noticeable due to relaxed knit structure.

---

## 5. WAIST (Fixed Waistband)

### Equation
```
WaistDiff = GarmentWaist − UserWaist
```
*GarmentWaist auto-detected as flat or circumference — see Auto-Detection section. Flat values doubled.*

### Description

**What this means**
Waist describes how much space the garment provides around the waistband relative to your body. This measurement is important because it directly affects comfort, stability, and where the garment sits during wear. Waist refers to the garment's waistband measurement, not the anatomical natural waist. Most modern pants are designed to sit around the high-hip area rather than at the natural waist, so waist fit describes how the waistband will feel at your typical wearing height.

**How this shows up in wear**
- Waist ease affects how secure or relaxed the waistband feels when standing, sitting, or moving
- Higher waist ease allows the garment to sit more loosely or rely more on belts, drawstrings, or elastic for stability

**Context**
Waist interpretation is influenced by intended wearing position and garment construction. Fixed waists behave more predictably, while elastic or adjustable waists can accommodate a range of body sizes and preferences. Waist is best interpreted alongside rise to understand how the pants feel through the seat and upper thigh, and why the same inseam can look or feel different across garments.

### Categories
| WaistDiff Range | Category | Universal Meaning |
|---|---|---|
| < −1.0" | Restrictive / Non-Viable | Waistband smaller than body; buttoning or zipping difficult or impossible. Seated comfort unlikely. |
| −1.0" to 0" | Snug Waist | Waistband sits firmly against body; fastening feels secure but creates pressure when sitting or bending. Little to no room between waistband and body. |
| 0" to +1.0" | Aligned Waist | Waistband matches body circumference with minimal air space; closure fastens comfortably without pulling or gaping. Stays in position without belt; breathing and sitting unrestricted. |
| +1.0" to +2.5" | Relaxed Waist | Waistband sits loosely with noticeable air space; you can easily slide fingers between waistband and body. Belt likely needed to prevent sliding or rotating. |
| > +2.5" | Oversized Waist | Substantial air space; waistband slides downward or rotates during movement. Belt required. |

### Per-Garment Descriptions

| Category | Jeans | Chinos | Trousers | Sweatpants | Joggers | Shorts | Cargos |
|---|---|---|---|---|---|---|---|
| Restrictive / Non-Viable | Too small | Too small | Too small | Elastic may still stretch, but feels overly tight | Restrictive | Too small | Too small |
| Snug Waist | Snug | Snug | Tailored-snug | Firm hold | Athletic-snug | Snug | Snug |
| Aligned Waist | Standard fit | Standard fit | Classic waist fit | Comfortable hold | Typical jogger fit | Standard | Standard |
| Relaxed Waist | Relaxed | Relaxed | Relaxed waist | Easy fit | Loose | Relaxed | Relaxed |
| Oversized Waist | Oversized | Oversized | Oversized | May sag despite elastic | Oversized | Oversized | Oversized |

---

## 6. WAIST (Elastic/Range Waistband)

### Equation
```
RangePosition = (UserWaist − RangeMin) / (RangeMax − RangeMin)
```
*No numeric delta displayed. Position-based interpretation only.*

### Description

**What this means**
Some garments—most commonly sweatpants, joggers, and certain casual shorts—do not provide a single fixed waistband measurement. Instead, they publish a waist range to reflect elastic stretch and drawstring adjustment. This measurement is important because it determines how securely the waistband can accommodate different body sizes and wearing preferences. For these garments, waist refers to the garment's usable waistband range, not a single resting circumference.

**How this shows up in wear**
- Waist fit is evaluated based on where your waist falls within the garment's published range
- Fit can vary depending on how the waistband is worn and adjusted

**Context**
Elastic and adjustable waistbands do not behave like fixed-waist garments and are best interpreted differently to avoid false precision. Instead of a single waist difference, Fit Check interprets these garments positionally within the published range. Waist is best interpreted alongside rise to understand how the pants feel through the seat and upper thigh.

### Categories
| User Position | Category | Universal Meaning |
|---|---|---|
| UserWaist < RangeMin | Below Range | Waistband may not stretch enough to fit comfortably. |
| 0.00–0.25 | Very Secure | Elastic sits firmly with minimal slack. |
| 0.25–0.60 | Comfortable | Natural elastic comfort zone. |
| > 0.60 | Relaxed | Relies more on drawstring or slouch. |
| UserWaist > RangeMax | Outside Range | Above garment's published waistband range; elastic or drawstrings may or may not accommodate. |

### Per-Garment Descriptions

No entries for `waistElastic` exist in `lib/garment-descriptions.ts`.

---

## 7. THIGH

### Equation
```
GarmentThighCirc = GarmentThigh × 2
ThighEase = GarmentThighCirc − UserThigh
```
*Flat vs circumference auto-detected — see Auto-Detection section.*

### Description

**What this means**
Thigh describes how much space the garment provides around the upper leg relative to your body. This measurement is important because it directly affects mobility, comfort during movement, and how the pant leg fits through the upper thigh. Garment thigh measurements are typically taken flat across the leg and must be doubled to estimate total thigh circumference. Fit Check compares this garment thigh circumference to your thigh circumference to determine how much room, or ease, is present.

**How this shows up in wear**
- Thigh ease influences freedom of movement when walking, sitting, or bending

**Context**
Thigh measurements are not fully standardized across brands, and small differences in where the widest point is measured are common. Thigh is best interpreted alongside rise and leg opening to understand how the pant leg accommodates the upper leg and how volume transitions through the lower body.

**⚠️ Bug note:** User thigh measurement is NOT currently collected by the extension. Must be added to user input collection in the new build.

### Categories
| ThighEase Range | Category | Universal Meaning |
|---|---|---|
| < 0" | Restrictive / Non-Viable | Garment thigh smaller than body. Movement restricted; wear unlikely to feel workable. |
| 0"–3" | Close Thigh | Fits close to leg with limited extra room. Movement feels firm and controlled. |
| 3"–5" | Regular Thigh | Balanced room allowing natural movement without excess fabric. |
| > 5" | Oversized Thigh | Substantial extra room. Relaxed or oversized leg shape. |

### Per-Garment Descriptions

| Category | Jeans | Chinos | Trousers | Sweatpants | Joggers | Shorts | Cargos |
|---|---|---|---|---|---|---|---|
| Restrictive / Non-Viable | Restrictive | Restrictive | Restrictive | Restrictive despite stretch | Restrictive | Restrictive | Restrictive |
| Close Thigh | Close fit | Close fit | Tailored-close | Close through thigh | Athletic-close | Close fit | Close fit |
| Regular Thigh | Standard | Standard | Regular | Standard sweatpant fit | Athletic regular | Standard | Regular utility |
| Oversized Thigh | Oversized | Oversized | Wide / oversized | Oversized sweatpant | Oversized jogger | Wide | Oversized cargo |

### Key Garment Callouts
- **Trousers:** Thigh fit is more precise and less forgiving. Small differences more noticeable.

---

## 8. INSEAM

### Equation
```
InseamDiff = GarmentInseam − UserInseam
```

### Description

**What this means**
Inseam describes the distance from the crotch seam to the hem along the inside of the leg. This measurement is important because it determines how long the pant leg is below the crotch and where the hem will land relative to your leg. Inseam does not represent the garment's total length from the waistband to the hem. Instead, it reflects the length of the leg portion of the pant once worn.

**How this shows up in wear**
- Longer inseams allow the hem to reach lower and interact with footwear, creating either a break or stacking
- Excess length may also be worn cuffed, which changes how the hem lands without altering the inseam measurement
- Two garments with the same inseam can appear different in length depending on how the upper portion of the pant fits

**Context**
Perceived inseam length is influenced by rise and top-block construction. A longer rise places the crotch seam lower on the body, which can make the same inseam feel longer in wear, while a shorter rise can make the same inseam feel shorter. Inseam and rise are best interpreted together rather than adjusted numerically.

### Outseam Conversion (when inseam not provided)
```
Inseam = Outseam − FrontRise − 2.0
```
*The 2.0" accounts for waistband. This is an approximation.*
**Callout to user:** "Inseam was estimated from outseam. This is an approximation and may differ slightly from a directly measured inseam."

### Categories
| InseamDiff Range | Category | Universal Meaning |
|---|---|---|
| < −1.0" | Very Short / Cropped | Hem sits well above ankle bone; lower leg and ankle fully visible. Cropped appearance is distinct and intentional. |
| −1.0" to −0.5" | Short Length | Hem sits above ankle bone; lower ankle and top of footwear visible. Minimal to no stacking. |
| −0.5" to +0.5" | Aligned Length | Hem lands at or just below ankle bone; rests lightly on footwear with minimal stacking. Slight break may form depending on shoe height. |
| +0.5" to +1.0" | Long Length | Hem extends past ankle bone onto footwear; gentle stacking creates light break at vamp or laces. Hem partially covers shoe. |
| +1.0" to +2.0" | Extended Length | Hem extends well past ankle bone; noticeable stacking creates full break. Multiple horizontal folds form above hem. |
| > +2.0" | Very Long / Pooled | Heavy stacking pools on footwear and floor. Multiple prominent folds; shoe largely obscured. Excess length is dominant visual feature. |

### Per-Garment Descriptions

| Category | Jeans | Chinos | Trousers | Sweatpants | Joggers | Shorts | Cargos |
|---|---|---|---|---|---|---|---|
| Very Short / Cropped | Cropped | Cropped | Short Trouser Length | Cropped | High-Ankle | N/A | Cropped |
| Short Length | Slight Crop | Slight Crop | Subtle Short Length | Slight Crop | Slight Crop | N/A | Slight Crop |
| Aligned Length | True Length | True Length | Clean Trouser Length | Standard | Standard | N/A | Aligned |
| Long Length | Light Stack | Light Break | Light Trouser Break | Light Stack | Light Stack | N/A | Light Stack |
| Extended Length | Stacked | Pronounced Break | Pronounced Trouser Break | Stacked | Stacked | N/A | Stacked |
| Very Long / Pooled | Heavy Stack | Extended Length | Extended Trouser Length | Heavy Pooling | Heavy Pooling | N/A | Heavy Stack |

### Key Garment Callouts
- **Sweatpants/Joggers/Cargos with elastic hems:** Hem anchors at ankle regardless of inseam. Excess or missing length absorbed above ankle rather than changing visual endpoint.
- **Rise interaction:** Longer rise places crotch seam lower, making same inseam feel longer. Shorter rise makes it feel shorter. Interpret together.

---

## 9. RISE

### Equation
```
No calculation. Raw garment measurement interpreted directly.
```

### Description

**What this means**
Rise describes how much vertical room the garment provides above the inseam through the seat and crotch. This measurement is important because it affects comfort, mobility, and how the pant accommodates the body through the hips and upper thighs. Rise does not determine how high or low most modern pants are worn. Many wearers tend to wear different pants at a similar height regardless of rise. Instead, rise affects how the garment fits once worn, specifically how much room exists through the seat, how the crotch feels during movement, and how the upper portion of the pant drapes or pulls.

**How this shows up in wear**
- A longer rise may allow the waistband to be worn higher if desired, but does not require or imply a higher wearing position
- If a garment is worn higher or lower than the wearer's typical position, the waistband may feel looser or tighter due to natural changes in body circumference at different heights

**Context**
Rise interpretation is influenced by body shape and how the garment is styled, but it is not intended to be read as a directive for where pants must sit on the body. Rise is best interpreted alongside waist and thigh to understand how the upper block of the pant accommodates the body and why garments with similar waist and inseam measurements can feel very different in wear.

### Categories
| Rise Range | Category | Universal Meaning |
|---|---|---|
| < 9.0" | Short Rise | Less vertical distance between crotch seam and waistband; seat and top block fit closer to body. Sitting or bending may pull waistband downward more noticeably. Less flexibility in wearing position. |
| 9.0"–10.0" | Moderate Rise | Balanced room through seat and upper thighs. Comfortable during sitting and bending. Some flexibility to wear slightly higher or lower. |
| 10.0"–11.25" | Extended Rise | Substantial room through seat, hips, and upper thighs. Comfortable at typical hip height with flexibility to wear higher if desired. Note: wearing higher may change waist fit due to body circumference variation. |
| > 11.25" | Very Long Rise | Extensive room through seat, hips, and upper thighs. Significant flexibility in wearing position; can be worn higher on torso, though waist fit will feel different at varying heights. |

### Per-Garment Descriptions

| Category | Jeans | Chinos | Trousers | Sweatpants | Joggers | Shorts | Cargos |
|---|---|---|---|---|---|---|---|
| Short Rise | Short Rise | Short Rise | Low Depth | Short Rise | Short Rise | Short Rise | Short Rise |
| Moderate Rise | Moderate Rise | Moderate Rise | Standard Depth | Standard Rise | Standard Rise | Moderate Rise | Moderate Rise |
| Extended Rise | Extended Rise | Extended Rise | Extended Depth | Extended Rise | Extended Rise | Extended Rise | Extended Rise |
| Very Long Rise | Very Long Rise | Very Long Rise | Deep Depth | Very Long Rise | Very Long Rise | Very Long Rise | Very Long Rise |

### Key Garment Callouts
- **Trousers:** Rise has greater impact on seat comfort and drape. Small differences more noticeable.
- Rise does not dictate wearing position. Describes garment geometry, not user behavior.

---

## 10. LEG OPENING (Silhouette)

### Equation
```
LTR = GarmentLegOpening / GarmentThigh
```
*Garment-to-garment ratio. No user body measurement involved.*

### Description

**What this means**
Leg opening describes the width of the pant at the hem relative to the width of the thigh. This measurement is used to understand how the leg narrows, stays straight, or opens as it moves downward, which defines the lower-leg silhouette. Leg opening reflects shape only, not how loose or fitted the pant is overall. A garment can have a narrow or wide leg opening regardless of how much room it has through the thigh or seat.

**How this shows up in wear**
- Narrower leg openings create a tapered lower-leg shape, while wider openings create a straighter or more open silhouette
- Two garments with the same thigh fit can appear very different below the knee depending on leg opening
- Leg opening affects how the pant visually balances with footwear and how fabric gathers or hangs near the hem

**Context**
Leg opening is best interpreted alongside thigh to understand how volume is distributed through the leg. A pant may feel relaxed through the thigh but appear narrow at the hem, or feel trim above the knee while appearing wide below it. Because leg opening describes shape rather than fit, it is not intended to be used alone to infer comfort or tightness.

### Categories
| LTR Ratio | Category | Universal Meaning |
|---|---|---|
| < 0.50 | Strong Taper | Leg narrows sharply from thigh to hem. Skinny/aggressive taper. |
| 0.50–0.65 | Tapered | Gradual narrowing toward hem. Slim/modern taper. |
| 0.65–0.80 | Straight | Consistent width below thigh. Neutral, straight silhouette. |
| > 0.80 | Open / Wide | Hem opens noticeably. Relaxed, wide, or flared lower leg. |

### Per-Garment Descriptions

| Category | Jeans | Chinos | Trousers | Sweatpants | Joggers | Shorts | Cargos |
|---|---|---|---|---|---|---|---|
| Strong Taper | Strong taper | Strong taper | Strong taper | Narrow hem | Narrow jogger | N/A | Narrow taper |
| Tapered | Tapered | Tapered | Tapered | Standard hem | Athletic taper | N/A | Tapered |
| Straight | Straight | Straight | Straight | Straight | Straight | N/A | Straight |
| Open / Wide | Open | Open | Open | Open | Open | N/A | Open |

### Key Garment Callouts
- **Sweatpants/Joggers:** Elastic or cinched hems visually constrain leg opening at ankle regardless of measured opening.

---

## SPECIAL PROCESSING LOGIC

### Hip Shelf Rise Adjustment
Applied when user indicates they wear pants at their hip shelf AND garment is a bottom.

When a garment has a longer rise than baseline, the crotch point sits lower on the body. This means the inseam effectively acts longer — the hem will land lower than the raw inseam number suggests.

```
BASELINE_RISE = 11.0
RISE_ADJUSTMENT_FACTOR = 0.7

If FrontRise > BASELINE_RISE:
  RiseDiff = FrontRise − BASELINE_RISE
  Adjustment = RiseDiff × RISE_ADJUSTMENT_FACTOR
  EffectiveInseam = GarmentInseam + Adjustment
```

*Example: Garment rise 12.0" → diff 1.0" → adjustment 0.7" → 32.0" inseam becomes 32.7" effective inseam.*

### Flat vs Circumference Auto-Detection
Applied to: waist, thigh, legOpening, chest

The system automatically detects whether scraped measurements are flat (half) or circumference (full) based on average values across sizes.

| Measurement | Flat Max | Circ Min |
|---|---|---|
| Waist | 22" | 28" |
| Thigh | 14" | 20" |
| Leg Opening | 10" | 12" |
| Chest | 26" | 36" |

Logic: If average ≤ flatMax → flat (multiply by 2). If average ≥ circMin → circumference. If between → treat as flat if closer to flatMax.

### Outseam to Inseam Conversion
Applied when garment provides outseam but no inseam.

```
Inseam = Outseam − FrontRise − 2.0
```
*Approximation. User is informed: "Inseam was estimated from outseam. This is an approximation and may differ slightly from a directly measured inseam."*

---

## FABRIC CONTEXT (Non-Calculation)

Fabric information is captured from the product page when available and surfaced as contextual notes. It does NOT affect any calculations.

### General Fabric Behaviors
- **Cotton (100%):** Typically shrinks 3–5% after first wash, primarily in length. Softens with repeated washing.
- **Polyester:** Maintains dimensional stability. Minimal shrinkage. Resists wrinkles.
- **Spandex/Elastane (typically 2–5% of blend):** Provides stretch and recovery. Elastic fibers may lose tension over time.
- **Wool:** Naturally regulates temperature. Can felt (shrink and tighten) if exposed to hot water or agitation.

### Measurement-Specific Callouts
The system generates measurement-specific fabric callouts based on fabric composition, weight, and construction (knit vs woven). These are available for: chest, waist, sleeve, inseam, frontLength, thigh.
