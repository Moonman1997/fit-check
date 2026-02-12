# Fit Check — V1 Implementation Plan

**Last updated:** Feb 11, 2026
**Current phase:** Not started
**Target:** Sideloadable Chrome extension for friend testing

---

## Architecture Overview

```
fit-check/
├── docs/
│   ├── Fit_Check_Product_Brief.md
│   ├── Fit_Check_Master_Tables.md
│   ├── implementation-plan.md
│   └── backlog.md
├── entrypoints/
│   ├── popup/                    ← small dropdown (icon click)
│   │   ├── index.html
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── style.css
│   ├── landing/                  ← full-page tab (profile + instructions)
│   │   ├── index.html
│   │   ├── main.tsx
│   │   ├── style.css
│   │   ├── Landing.tsx
│   │   └── components/
│   │       └── MeasurementForm.tsx
│   ├── background.ts             ← service worker
│   └── content.ts                ← injected into retailer pages
├── lib/
│   ├── storage.ts                ← Chrome storage helpers
│   ├── types.ts                  ← shared TypeScript types
│   ├── extraction.ts             ← Claude API call (Phase 6)
│   ├── calculations.ts           ← fit math (Phase 4)
│   ├── categories.ts             ← category lookup tables (Phase 4)
│   └── callouts.ts               ← garment-specific callouts (Phase 4)
├── wxt.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env                          ← API key (gitignored)
```

**Key architectural decisions:**
- **WXT framework** handles Chrome extension boilerplate. Entrypoints live in `entrypoints/` (WXT convention). Shared code lives in `lib/` at the project root.
- **All fit math in `calculations.ts`** — pure functions, no side effects, easily testable
- **Category tables in `categories.ts`** — direct translation of master-tables.md, separated from calculation logic
- **Chrome side panel API** for scorecard display — stays alongside product page

---

## Test Retailers
1. **3sixteen** — measurements in product page HTML (table format, flat measurements)
2. **Uniqlo** — measurements behind "Check my size" button/tab (hidden content)
3. **Abercrombie** — body-based size charts only (tests missing data handling)
4. **J.Crew** — measurements in product details (less structured format)

---

## Phase 0: Project Scaffolding
**Goal:** Empty WXT + React + TypeScript + Tailwind project that loads as a Chrome extension
**Files touched:** wxt.config.ts, package.json, tsconfig.json, tailwind.config.ts, src/popup/Popup.tsx

**What to build:**
- Initialize WXT project with React template
- Configure Tailwind CSS
- Create minimal popup that says "Fit Check" when you click the extension icon
- Verify it loads in Chrome via `chrome://extensions` → Load unpacked

**What this does (in plain English):**
After this phase, you can load the extension in Chrome. When you click the extension icon, a small popup appears that says "Fit Check." Nothing else works yet — this just proves the build pipeline is set up correctly.

**Verify by:** Load unpacked extension in Chrome → click icon → see "Fit Check" text in popup.

**Status:** Not started

---

## Phase 1: Storage Layer + Types
**Goal:** Define all TypeScript types and build Chrome storage helpers
**Files touched:** src/lib/types.ts, src/lib/storage.ts

**What to build:**
- `types.ts`: UserMeasurements interface (7 fields), GarmentMeasurements interface (tops + bottoms), ExtractionResult, ScorecardResult, FitCategory types
- `storage.ts`: `getUserMeasurements()`, `saveUserMeasurements()`, `hasMeasurements()` — all using Chrome storage.local API

**What this does (in plain English):**
No visible change yet. This creates the data definitions and storage functions everything else will use. Think of it as building the foundation before the walls.

**Verify by:** Open browser console on extension page → run `chrome.storage.local.get(null, console.log)` → confirm data structure is correct after saving test data.

**Status:** Not started

---

## Phase 2: Landing Page (Profile + Instructions)
**Goal:** Full-page tab with measurement entry form and instructions
**Files touched:** src/landing/Landing.tsx, src/landing/components/MeasurementForm.tsx, src/landing/components/Instructions.tsx

**What to build:**
- Full-page tab that opens when navigating to the extension's landing URL
- Measurement form with 7 fields: Height, Inseam, Chest, Waist, Thigh, Shoulder Width, Sleeve Length
- Each field has helper text explaining how to measure (brief, inline)
- Form saves to Chrome storage on submit
- Form pre-fills if measurements already exist (edit mode)
- Instructions section: how to use, how to give feedback
- Simple, clean layout with Tailwind
- No API key field — key is embedded at build time (see API Key Strategy section)

**What this does (in plain English):**
After this phase, you can open the landing page tab and enter your body measurements. When you click Save, the measurements are stored locally in Chrome. If you come back, the form shows your saved values. Below the form are instructions on how to use the extension.

**Verify by:** Open landing page → enter measurements → click Save → close tab → reopen → measurements are still there.

**Status:** Not started

---

## Phase 3: Popup Router (Conditional UI)
**Goal:** Extension icon popup shows different content based on whether measurements exist
**Files touched:** src/popup/Popup.tsx, src/popup/popup.css, src/background/index.ts

**What to build:**
- **State 1 (no measurements):** Message "Add your measurements to use Fit Check" + CTA button that opens landing page tab
- **State 2 (has measurements):** Two CTA buttons — "Analyze This Page" and "My Profile"
- "My Profile" opens landing page tab
- "Analyze This Page" sends message to background service worker (actual analysis built in later phases)
- Background service worker registered and listening for messages

**What this does (in plain English):**
After this phase, clicking the extension icon shows one of two views. If you haven't entered measurements yet, you see a prompt to add them. If you have measurements, you see two buttons. "My Profile" opens the settings page. "Analyze This Page" doesn't do anything useful yet — it just sends a message behind the scenes. We'll wire it up to the actual analysis in Phase 6.

**Verify by:** 
1. Clear storage → click icon → see "Add measurements" prompt → click CTA → landing page opens
2. Save measurements → click icon → see two buttons → "My Profile" opens landing page

**Status:** Not started

---

## Phase 4: Fit Calculation Engine
**Goal:** Implement all deterministic fit math from master-tables.md as pure functions
**Files touched:** src/lib/calculations.ts, src/lib/categories.ts, src/lib/callouts.ts

**What to build:**
- `calculations.ts`: Pure functions for each measurement:
  - `calculateChestEase(garmentP2P, userChest)` → ease value
  - `calculateFrontLength(garmentFL, userHeight, userInseam)` → normalized diff
  - `calculateSleeveLength(garmentSleeve, userSleeve, userShoulder, garmentShoulder, measurementType)` → perceived diff
  - `calculateShoulder(garmentShoulder, userShoulder)` → diff
  - `calculateWaistFixed(garmentWaist, userWaist)` → diff
  - `calculateWaistElastic(userWaist, rangeMin, rangeMax)` → position
  - `calculateThigh(garmentThigh, userThigh)` → ease
  - `calculateInseam(garmentInseam, userInseam)` → diff
  - `calculateLegOpening(garmentLegOpening, garmentThigh)` → LTR ratio
  - `convertOutseamToInseam(outseam, frontRise)` → inseam
  - `applyHipShelfRiseAdjustment(garmentInseam, frontRise)` → effective inseam
  - `detectFlatOrCircumference(values, measurementType)` → 'flat' | 'circumference'
- `categories.ts`: Lookup functions that take a numeric value and return { category, universalMeaning }
  - One function per measurement type, using exact ranges from master-tables.md
- `callouts.ts`: Functions that return garment-specific callouts based on garment type
  - `getChestCallouts(garmentType)` → string[]
  - etc.

**What this does (in plain English):**
No visible change to the extension. This builds all the math that turns garment measurements + your body measurements into fit descriptions. Every equation and category table from master-tables.md gets translated into code. We're building the brain — it just doesn't have eyes (extraction) or a mouth (scorecard UI) yet.

**Verify by:** We'll write a small test script that runs calculations with known inputs and checks outputs match master-tables.md. You paste test inputs, see if categories come back correctly.

**Status:** Not started

---

## Phase 5: Side Panel Shell + Scorecard UI
**Goal:** Chrome side panel opens and displays a scorecard (using hardcoded test data initially)
**Files touched:** src/sidepanel/SidePanel.tsx, src/sidepanel/components/SizeSelector.tsx, src/sidepanel/components/ScorecardTable.tsx, src/sidepanel/components/FabricNote.tsx

**What to build:**
- Register side panel in WXT config
- Side panel UI with:
  - Size selector (buttons for each available size)
  - Scorecard table: rows = measurement types, columns = Category, Universal Meaning, Delta
  - Missing measurement rows show "Measurement not provided by brand" with explanation
  - Garment callouts displayed contextually per measurement
  - Fabric/material note section (when available)
  - Loading state
  - Error state ("No garment measurements found on this page")
- Initially renders with hardcoded test data so we can validate the layout

**What this does (in plain English):**
After this phase, you can manually trigger the side panel and see a full scorecard layout with fake data. You can click between sizes and see the table update. This lets us validate the scorecard design before wiring it to real data. The layout, spacing, and information hierarchy are all visible and reviewable.

**Verify by:** Open side panel → see scorecard with test data → click different size buttons → table updates → missing measurement rows display correctly.

**Status:** Not started

---

## Phase 6: Page Capture + Claude API Extraction
**Goal:** Capture screenshot + HTML from current tab, send to Claude API, get structured measurements back
**Files touched:** src/content/index.ts, src/background/index.ts, src/lib/extraction.ts

**What to build:**
- `content/index.ts`: Content script that captures page HTML (full DOM including hidden elements where possible) and sends to background
- `background/index.ts`: 
  - Receives "analyze" message from popup
  - Captures visible tab screenshot via `chrome.tabs.captureVisibleTab()`
  - Requests HTML from content script
  - Calls Claude API via `extraction.ts`
  - Sends results to side panel
- `extraction.ts`:
  - Constructs Claude API prompt with screenshot (base64) + HTML
  - Prompt instructs Claude to extract: garment type (top/bottom), all available sizes, measurements per size, fabric info, sleeve measurement type
  - Defines expected JSON response schema
  - Parses response, validates structure
  - Returns typed ExtractionResult

**Claude API configuration:**
- Model: `claude-sonnet-4-5-20250929`
- Max tokens: 4096
- System prompt: detailed instructions for measurement extraction (to be crafted)
- User message: screenshot image + truncated HTML

**What this does (in plain English):**
After this phase, clicking "Analyze This Page" on a product page will: capture a screenshot, grab the page HTML, send both to Claude, and get back structured garment measurements. The side panel will open and show a loading state, then display the raw extraction results (not yet run through fit calculations). This is the first time you see real data from a real product page.

**Verify by:** Navigate to 3sixteen product page → click "Analyze This Page" → side panel opens → loading spinner → extracted measurements appear (raw, not yet scored).

**Status:** Not started

---

## Phase 7: Wire Everything Together
**Goal:** Connect extraction → calculations → scorecard display as a complete end-to-end flow
**Files touched:** src/background/index.ts, src/sidepanel/SidePanel.tsx

**What to build:**
- Background service worker: after extraction returns, run all applicable calculations against user measurements
- Package results into ScorecardResult type
- Send to side panel for display
- Side panel: replace hardcoded data with real results
- Handle all states: loading, error (no measurements found), partial scorecard (some measurements missing)
- Size selector wired to re-run calculations for selected size

**What this does (in plain English):**
This is the moment of truth. After this phase, the full flow works: you click "Analyze This Page" on a product page, and the side panel shows your personalized fit scorecard with real data. You can switch between sizes. Missing measurements are clearly labeled. Garment callouts appear. Fabric notes show if available. The entire product works end to end.

**Verify by:** 
1. Navigate to 3sixteen top → Analyze → see full tops scorecard (chest, shoulder, sleeve, front length)
2. Navigate to 3sixteen bottom → Analyze → see full bottoms scorecard (waist, thigh, inseam, rise, leg opening)
3. Navigate to Abercrombie → Analyze → see error or partial scorecard with missing data messages
4. Switch sizes on any scorecard → values update

**Status:** Not started

---

## Phase 8: Extraction Prompt Tuning + Edge Cases
**Goal:** Test across all 4 retailers, tune Claude prompt, handle edge cases
**Files touched:** src/lib/extraction.ts (prompt text), src/lib/calculations.ts (edge cases)

**What to build:**
- Test extraction on 3sixteen, Uniqlo, J.Crew, Abercrombie — document successes and failures
- Tune Claude system prompt based on failures:
  - Distinguish body measurements from garment measurements
  - Handle measurement tables in images vs HTML
  - Handle cm vs inches
  - Handle flat vs circumference labeling by brand
- Add edge case handling:
  - Outseam-to-inseam conversion when inseam not provided
  - Elastic waistband detection
  - Sleeve measurement type detection (shoulder-to-cuff vs CB-to-cuff)
- Add user-facing callouts for approximations

**What this does (in plain English):**
No new features — this phase makes the existing features work reliably across different retailers. After this phase, the extraction should succeed on 3sixteen and J.Crew consistently, handle Uniqlo's hidden data where possible, and gracefully report missing data for Abercrombie.

**Verify by:** Test each retailer 3+ times with different products. Document success rate. Scorecard should be accurate when data is found, and clearly communicate when data is missing.

**Status:** Not started

---

## Phase 9: Polish + Test-Ready Build
**Goal:** Visual polish, error handling, and packaged build for friend testing
**Files touched:** Various UI files, manifest/icons

**What to build:**
- Extension icon (simple, clean — can be placeholder for v1)
- Visual polish on popup, landing page, side panel (spacing, typography, color)
- Error handling: network failures, API errors, malformed extraction results
- Build and package for sideloading (zip of dist/ folder)
- Write brief README for testers: how to install, how to get API key, how to test, how to report bugs

**What this does (in plain English):**
After this phase, you have a zip file you can send to friends. They install it, enter their API key and measurements, and start testing on real product pages. The extension looks clean (not beautiful — that's v2), handles errors gracefully, and gives clear feedback at every step.

**Verify by:** Fresh Chrome profile → install from zip → enter measurements → analyze a product page → see scorecard. Have someone who's never seen the extension do this.

**Status:** Not started

---

## API Key Strategy (v1 Testing)

Your Claude API key is embedded at build time via an environment variable. Friends never see or enter a key — it's baked into the build you send them.

**How it works:**
- API key stored in a `.env` file in the repo (gitignored, never committed)
- At build time, Vite injects it into the bundled code
- Friends install the built extension — it just works
- Key is extractable by someone inspecting the JS bundle, but acceptable risk for trusted testers

**Safety net:** Set a monthly spend limit on your Anthropic account dashboard (e.g., $20). Estimated cost for testing: ~$0.01-0.03 per analysis. 10 friends × 20 analyses = ~$3-6 total.

**For production (Chrome Web Store):** Must switch to a backend proxy server (Cloudflare Worker or similar) so the key is never in client code. This is a v2 concern.

---

## Known Issues / Decisions to Revisit
- **Sleeve measurement type:** Master tables require user to indicate shoulder-to-cuff vs CB-to-cuff. For v1, Claude should attempt to detect this from the page. If ambiguous, we surface a callout.
- **Heavily dropped shoulder calibration:** Master tables flag this may under-adjust. Track during testing.
- **Thigh measurement:** Bug note in master tables — must be collected in user inputs. Included in Phase 2 form.
- **Uniqlo hidden data:** Content script may not be able to access data behind interactive elements. Screenshot fallback is critical here.
- **HTML truncation:** Full page HTML may exceed Claude's context. Need truncation strategy in Phase 6 — strip scripts, styles, nav, footer; keep product-relevant DOM.

---

## Phase Tracking

| Phase | Description | Status | Files Changed |
|-------|-------------|--------|---------------|
| 0 | Project Scaffolding | Not started | 5 |
| 1 | Storage Layer + Types | Not started | 2 |
| 2 | Landing Page | Not started | 3 |
| 3 | Popup Router | Not started | 3 |
| 4 | Fit Calculation Engine | Not started | 3 |
| 5 | Side Panel Shell + Scorecard UI | Not started | 4-5 |
| 6 | Page Capture + Claude API Extraction | Not started | 3 |
| 7 | Wire Everything Together | Not started | 2 |
| 8 | Extraction Prompt Tuning | Not started | 2 |
| 9 | Polish + Test-Ready Build | Not started | Various |
