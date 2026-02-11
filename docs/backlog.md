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
