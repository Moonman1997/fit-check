# Fit Check — Backlog

Items captured during development. Bring these to the CTO Project when ready to scope.

## Format
```
### [Short title]
- **Type:** bug | feature | improvement | question
- **Priority:** high | medium | low
- **Notes:** [context]
- **Date added:** [date]
```

---

### API key management for public release
- **Type:** feature
- **Priority:** high
- **Notes:** Current approach embeds API key for testing with friends. Not sustainable for Chrome Web Store. Need auth flow or proxy server. This is a v1 blocker before public release.
- **Date added:** 2026-02-11

### Sleeve adjustment calibration for oversized/streetwear
- **Type:** improvement
- **Priority:** medium
- **Notes:** The 0.6x multiplier for heavily dropped shoulders may still under-adjust. Test with real hoodies once build is running and adjust factor.
- **Date added:** 2026-02-11

### Thigh measurement not collected from user
- **Type:** bug
- **Priority:** high
- **Notes:** Thigh evaluation exists in fit engine but user input for thigh circumference is not captured. Must be added to measurement collection UI.
- **Date added:** 2026-02-11

### Feedback channel for testers
- **Type:** improvement
- **Priority:** medium
- **Notes:** Replace [placeholder email] in landing page instructions with actual feedback method (email, Google Form, or shared doc). Needed before Phase 9 (test-ready build).
- **Date added:** 2026-02-12

### Reconcile PDF master tables with markdown master tables
- **Type:** improvement
- **Priority:** medium
- **Notes:** Original PDF master tables contain some equation/range differences from the current markdown master tables (front length formula, heavily dropped sleeve adjustment, elastic waist ranges). PDFs were created earlier with a different Claude chat. Markdown is source of truth for v1. PDFs should be updated to match after v1 ships to avoid future confusion.
- **Date added:** 2026-02-13

### Update .cursorrules paths to match actual project structure
- **Type:** improvement
- **Priority:** low
- **Notes:** .cursorrules references src/lib/fit-engine/, src/, src/types/ which don't exist. Actual structure uses lib/ and entrypoints/ at project root. Update after v1.
- **Date added:** 2026-02-12

### Override 200-line rule for static data files
- **Type:** improvement
- **Priority:** low
- **Notes:** lib/garment-descriptions.ts and lib/categories.ts exceed 200 lines but are pure static data lookups. Splitting adds complexity without benefit. Add header comments explaining the exception.
- **Date added:** 2026-02-12


### Fabric callouts: detect "preshrunk" and suppress shrinkage note
- **Type:** improvement
- **Priority:** low
- **Notes:** When fabric info or brand notes include "preshrunk" or "pre-shrunk", the cotton shrinkage callout (3-5% after first wash) should be suppressed or replaced with a note that the garment has been preshrunk. Current system doesn't distinguish. Low priority — brand fit notes already surface "preshrunk" text to the user.
- **Date added:** 2026-02-13


### Evaluate Claude Sonnet 5 for extraction
- **Type:** improvement
- **Priority:** medium
- **Notes:** Sonnet 5 (claude-sonnet-5@20260203) launched Feb 3, 2026 at same $3/$15 pricing. May offer better vision/extraction than Sonnet 4.5. Test after v1 ships — swap model ID in lib/extraction.ts and compare extraction quality on test retailers. One-line change.
- **Date added:** 2026-02-13


### Cache extraction results by URL
- **Type:** improvement  
- **Priority:** high
- **Notes:** Cache Claude API extraction results in Chrome storage keyed by page URL. If user analyzes the same product page again, return cached result instead of making another API call. Add a "Re-analyze" button to force a fresh extraction. Saves significant API cost during testing. Consider TTL (e.g., 24hr expiry) so stale data doesn't persist forever.
- **Date added:** 2026-02-13

### Reference garment system
- **Type:** feature
- **Priority:** high (v2)
- **Notes:** Allow users to save garment measurements from items they own as reference points. Scorecard can then show comparisons like "this has 2" more chest ease than your [saved garment]." More intuitive than abstract body-relative numbers. Aligns with interpretation-not-recommendation philosophy.
- **Date added:** 2026-02-17

### Fit viability indicators (tier system)
- **Type:** feature
- **Priority:** medium (v2)
- **Notes:** User raised idea of tiering sizes by viability — e.g., chest too tight = disqualified. This crosses into recommendation territory which conflicts with v1 philosophy. Revisit for v2 with careful framing — could be opt-in "flags" rather than judgments. Needs user research on what thresholds matter.
- **Date added:** 2026-02-17

### Front length calibration for longer torsos
- **Type:** investigation
- **Priority:** medium
- **Notes:** User (76.5" height, 34" inseam = 42.5" torso) reports front length descriptions feel consistently aggressive/short across multiple garments. The equation may need a torso-length-specific adjustment or the category boundaries may need widening. Need more data points from testers with different torso proportions.
- **Date added:** 2026-02-17


### Smart HTML extraction in content script
- **Type:** improvement
- **Priority:** high
- **Notes:** Instead of sending full page HTML (60k chars, ~15-20k tokens), have the content script pre-extract likely size chart containers (tables, elements with size/chart/measurement classes) and product description. Would reduce token usage by 80%+ and ensure size chart data isn't truncated. Also reduces API cost significantly.
- **Date added:** 2026-03-05

### Logo / brand icon
- **Type:** design
- **Priority:** high
- **Notes:** Replace the generic Chrome extension icon with a Fit Check logo. Needed for popup, side panel header, and Chrome Web Store listing.
- **Date added:** 2026-03-11

### Measurement guide page
- **Type:** feature
- **Priority:** high
- **Notes:** Dedicated page or section with visual instructions on how to obtain each body measurement (height, inseam, chest, waist, thigh, shoulder width, sleeve length). Could include diagrams or photos. Critical for tester onboarding accuracy.
- **Date added:** 2026-03-11

### Body scanning integration
- **Type:** investigation
- **Priority:** low
- **Notes:** Research if there's a simple out-of-the-box solution for users to scan their body measurements instead of manual entry. Likely no viable option for v1 but worth investigating.
- **Date added:** 2026-03-11

### Account management (Gmail auth)
- **Type:** feature
- **Priority:** medium (v2)
- **Notes:** User accounts with Gmail sign-in. Enables cloud sync of measurements, saved garments, and history across devices.
- **Date added:** 2026-03-11

### Favorite / reference garments
- **Type:** feature
- **Priority:** high (v2)
- **Notes:** Allow users to save garment measurements from items they own as reference points. Scorecard could show comparisons like "this has 2" more chest ease than your saved hoodie." More intuitive than abstract body-relative numbers. Aligns with interpretation-not-recommendation philosophy.
- **Date added:** 2026-03-11

### Recent queries / analysis history
- **Type:** feature
- **Priority:** medium (v2)
- **Notes:** Show recently analyzed garments so users can reference past results without re-analyzing. Store extraction results and scorecard data locally.
- **Date added:** 2026-03-11

### Wool fabric care callout
- **Type:** content
- **Priority:** low
- **Notes:** Add fabric callout for wool: can felt/shrink if exposed to hot water or agitation, recommend air dry only. Currently only cotton shrinkage is called out.
- **Date added:** 2026-03-18

### Stale side panel data on re-analysis
- **Type:** bug
- **Priority:** medium
- **Notes:** When side panel is already open from a previous analysis and user clicks Analyze again, the old scorecard may briefly show before loading state appears. May need to force loading state when analyzePage message is received regardless of current state.
- **Date added:** 2026-03-18