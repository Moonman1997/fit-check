# Fit Check — Product Brief

## What It Is
Chrome extension that helps menswear shoppers understand how a specific garment will fit relative to their body using published garment measurements and user-provided body measurements.

## What It Is NOT
- Does not recommend sizes, styles, or silhouettes
- Does not judge fit as "good," "bad," or "ideal"
- Does not account for tailoring or alterations
- Does not label body types or use weight/BMI
- Does not guarantee comfort, mobility, or aesthetic outcomes

## Core Philosophy
- **Interpretation, not recommendation.** Describes what measurements mean in physical terms. User decides.
- **Visual clarity over prescriptive language.** Anchored to body landmarks (waistband, wrist, pockets), not abstract fashion terms. Words like "ideal," "correct," "proper," or "should" are never used.
- **Modern wearing behavior as reference.** Front length anchored to modern waistband/hip shelf, not anatomical natural waist.
- **Minimal inputs, maximum explainability.** Every calculation is deterministic, explainable, and traceable. No speculation.
- **Explicit handling of uncertainty.** Surfaced via callouts, not modeled numerically.
- **Movement context is descriptive only.** The system may include callouts about how fit changes during common movements (e.g., "raising arms may expose the wrist at this sleeve length"), but these are observational descriptions — not calculations or predictions.

## Target User
Menswear shoppers interested in elevating their style who value precision and clarity over styling advice. Frustrated by vague size labels (S/M/L) without context. Comfortable interpreting descriptive fit information.

## V1 Scope

### User Flow
1. User enters their body measurements once (stored locally in Chrome storage)
2. User navigates to a product page on any retailer
3. User activates the extension
4. Extension captures a screenshot of the page AND parses the page HTML to extract measurement data (hybrid approach — screenshot catches visual size charts, HTML parse catches measurements in product details, tabs, or accordions)
5. Claude API processes both inputs to extract garment measurements across all available sizes
6. If any expected measurements are missing, the user is informed which measurements could not be found and which scorecard sections will be affected
7. If fabric/material information is available on the page, it is captured and surfaced as contextual notes alongside the scorecard (fabric info does NOT affect calculations)
8. Extension runs deterministic fit evaluation against user measurements
9. User sees a scorecard for their selected size with the ability to switch between available sizes

### User Inputs (collected once, stored locally)
- Height (in)
- Inseam (in)
- Chest circumference (in)
- Waist circumference (in)
- Thigh circumference (in)
- Shoulder width (in) — point to point across back
- Sleeve length (in) — tailor measurement, center-back neck to wrist bone

### Garment Inputs (extracted per garment via hybrid screenshot + HTML parsing)

**Tops (per size):**
- Chest width (flat, pit-to-pit)
- Shoulder width (flat)
- Sleeve length (flat) — need to detect if shoulder-to-cuff or CB-to-cuff
- Front length (HPS to hem)

**Bottoms (per size):**
- Waist width (flat)
- Front rise
- Thigh width (flat)
- Inseam
- Leg opening (optional)

**Contextual (non-calculation, if available):**
- Fabric composition
- Material weight or description
- Any brand-provided fit notes

### Scorecard Output (to be workshopped — current direction below)
- Size selector: buttons or dropdown corresponding to available sizes
- One table displayed per selected size
- Table structure: rows = measurement types, columns = category label, universal fit meaning, delta value
- Garment-specific callouts and movement-related callouts shown contextually
- Fabric/material info shown as a contextual note when available
- Missing measurements labeled clearly with explanation of impact
- This design is not final and should be iterated on during development

### Missing Data Rules
- Missing measurement → "Measurement not provided by brand" — no category generated
- Missing measurement communicated to user with context on what scorecard sections are affected
- Missing dependent measurement → result still shown with precision note
- System never infers or estimates missing values
- Partial scorecards are valid

## System Assumptions
- Garments evaluated at rest (laid flat). Movement-related effects are described via callouts, not modeled.
- Published measurements treated as accurate
- Differences interpreted relatively, not absolutely (no S/M/L labels)
- Modern waistband/hip shelf is the vertical reference
- Shoulder placement affects sleeve perception (built into sleeve logic)
- Torso length is proportional (inferred from inseam relative to height)
- Body fullness acknowledged descriptively but does not alter baseline calculations
- Designed for common off-the-rack garments only

## V2 Considerations (explicitly out of v1 scope)
- Body silhouette graphic showing where hems, sleeves, and key dimensions land on a visual body outline
- Advanced page parsing without screenshot fallback
- Cross-brand measurement normalization

## Success Criteria
V1 is successful if test users can accurately describe how a garment will fit them before wearing it, and report increased confidence in evaluating size charts.

## Garment Types Supported (V1)
**Tops:** T-shirts, polos, button-ups, sweaters, sweatshirts, hoodies, light jackets, heavy jackets/coats
**Bottoms:** Jeans, chinos, trousers, sweatpants, joggers, shorts, cargos
