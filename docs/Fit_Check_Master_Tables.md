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

### Categories
| NormalizedFrontDiff | Category | Universal Meaning |
|---|---|---|
| < −0.14 | High-Cropped | Hem sits well above waistband. Lower stomach and belt area visible. Hem does not reach top of front pockets. |
| −0.14 to −0.08 | Cropped | Hem sits just above waistband. Belt line and upper pant fly visible. Hem does not cover top of front pockets. |
| −0.08 to +0.04 | Aligned | Hem meets waistband or upper hip. Belt mostly covered; top of front pockets may be visible. Stomach covered at rest. |
| +0.04 to +0.12 | Extended | Hem sits below waistband onto hip. Belt line and pocket openings covered. Hem reaches toward lower half of front pockets. |
| +0.12 to +0.22 | Longline | Hem falls below hip past bottom of front pockets, approaching upper thigh. Torso appears visually elongated. |
| ≥ +0.22 | Extra-Long | Hem extends clearly onto thigh, below pocket level. Garment length becomes dominant visual feature. |

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

### Categories
| Diff Range | Category | Universal Meaning |
|---|---|---|
| < −1.0" | Narrow | Sleeve starts closer to neck than shoulder edge, creating structured upper body and compact silhouette. Shoulder movement may feel slightly restricted. |
| −1.0" to −0.5" | Slightly Narrow | Sleeve starts just inside shoulder edge, creating cleaner shaped upper body without feeling tight. Sleeves sit slightly higher; movement mostly natural. |
| −0.5" to +0.5" | Aligned | Sleeve starts at or near natural shoulder edge. Balanced upper-body shape. Sleeves fall naturally; movement unrestricted. |
| +0.5" to +1.25" | Slightly Dropped | Sleeve starts slightly below shoulder edge, softening upper body without excessive size. Sleeves begin lower and may appear slightly longer. |
| +1.25" to +2.0" | Dropped | Sleeve starts clearly below shoulder edge. Relaxed, looser upper-body shape. Sleeves appear longer; shoulder line softened. |
| > +2.0" | Heavily Dropped | Sleeve starts well below shoulder edge. Pronounced oversized or boxy silhouette. Sleeves appear significantly longer; shoulder definition reduced. |

### Key Garment Callouts
- **Hoodies/Sweatshirts:** Dropped shoulders are common and increase visual sleeve length. Narrow shoulders may be less noticeable due to relaxed knit structure.

---

## 5. WAIST (Fixed Waistband)

### Equation
```
WaistDiff = GarmentWaist − UserWaist
```
*GarmentWaist auto-detected as flat or circumference — see Auto-Detection section. Flat values doubled.*

### Categories
| WaistDiff Range | Category | Universal Meaning |
|---|---|---|
| < −1.0" | Restrictive / Non-Viable | Waistband smaller than body; buttoning or zipping difficult or impossible. Seated comfort unlikely. |
| −1.0" to 0" | Snug Waist | Waistband sits firmly against body; fastening feels secure but creates pressure when sitting or bending. Little to no room between waistband and body. |
| 0" to +1.0" | Aligned Waist | Waistband matches body circumference with minimal air space; closure fastens comfortably without pulling or gaping. Stays in position without belt; breathing and sitting unrestricted. |
| +1.0" to +2.5" | Relaxed Waist | Waistband sits loosely with noticeable air space; you can easily slide fingers between waistband and body. Belt likely needed to prevent sliding or rotating. |
| > +2.5" | Oversized Waist | Substantial air space; waistband slides downward or rotates during movement. Belt required. |

---

## 6. WAIST (Elastic/Range Waistband)

### Equation
```
RangePosition = (UserWaist − RangeMin) / (RangeMax − RangeMin)
```
*No numeric delta displayed. Position-based interpretation only.*

### Categories
| User Position | Category | Universal Meaning |
|---|---|---|
| UserWaist < RangeMin | Below Range | Waistband may not stretch enough to fit comfortably. |
| 0.00–0.25 | Very Secure | Elastic sits firmly with minimal slack. |
| 0.25–0.60 | Comfortable | Natural elastic comfort zone. |
| > 0.60 | Relaxed | Relies more on drawstring or slouch. |
| UserWaist > RangeMax | Outside Range | Above garment's published waistband range; elastic or drawstrings may or may not accommodate. |

---

## 7. THIGH

### Equation
```
GarmentThighCirc = GarmentThigh × 2
ThighEase = GarmentThighCirc − UserThigh
```
*Flat vs circumference auto-detected — see Auto-Detection section.*

**⚠️ Bug note:** User thigh measurement is NOT currently collected by the extension. Must be added to user input collection in the new build.

### Categories
| ThighEase Range | Category | Universal Meaning |
|---|---|---|
| < 0" | Restrictive / Non-Viable | Garment thigh smaller than body. Movement restricted; wear unlikely to feel workable. |
| 0"–3" | Close Thigh | Fits close to leg with limited extra room. Movement feels firm and controlled. |
| 3"–5" | Regular Thigh | Balanced room allowing natural movement without excess fabric. |
| > 5" | Oversized Thigh | Substantial extra room. Relaxed or oversized leg shape. |

### Key Garment Callouts
- **Trousers:** Thigh fit is more precise and less forgiving. Small differences more noticeable.

---

## 8. INSEAM

### Equation
```
InseamDiff = GarmentInseam − UserInseam
```

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

### Key Garment Callouts
- **Sweatpants/Joggers/Cargos with elastic hems:** Hem anchors at ankle regardless of inseam. Excess or missing length absorbed above ankle rather than changing visual endpoint.
- **Rise interaction:** Longer rise places crotch seam lower, making same inseam feel longer. Shorter rise makes it feel shorter. Interpret together.

---

## 9. RISE

### Equation
```
No calculation. Raw garment measurement interpreted directly.
```

### Categories
| Rise Range | Category | Universal Meaning |
|---|---|---|
| < 9.0" | Short Rise | Less vertical distance between crotch seam and waistband; seat and top block fit closer to body. Sitting or bending may pull waistband downward more noticeably. Less flexibility in wearing position. |
| 9.0"–10.0" | Moderate Rise | Balanced room through seat and upper thighs. Comfortable during sitting and bending. Some flexibility to wear slightly higher or lower. |
| 10.0"–11.25" | Extended Rise | Substantial room through seat, hips, and upper thighs. Comfortable at typical hip height with flexibility to wear higher if desired. Note: wearing higher may change waist fit due to body circumference variation. |
| > 11.25" | Very Long Rise | Extensive room through seat, hips, and upper thighs. Significant flexibility in wearing position; can be worn higher on torso, though waist fit will feel different at varying heights. |

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

### Categories
| LTR Ratio | Category | Universal Meaning |
|---|---|---|
| < 0.50 | Strong Taper | Leg narrows sharply from thigh to hem. Skinny/aggressive taper. |
| 0.50–0.65 | Tapered | Gradual narrowing toward hem. Slim/modern taper. |
| 0.65–0.80 | Straight | Consistent width below thigh. Neutral, straight silhouette. |
| > 0.80 | Open / Wide | Hem opens noticeably. Relaxed, wide, or flared lower leg. |

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
