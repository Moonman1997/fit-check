/**
 * Fit calculation functions — pure functions matching docs/Fit_Check_Master_Tables.md
 * No side effects, no storage, no API calls.
 */

/** Master Tables §1 CHEST */
export function calculateChestEase(
  garmentChest: number,
  userChest: number,
  isFlat: boolean
): number {
  const totalChest = isFlat ? garmentChest * 2 : garmentChest;
  return totalChest - userChest;
}

/** Master Tables §2 FRONT LENGTH */
export function calculateFrontLength(
  garmentFrontLength: number,
  userHeight: number,
  userInseam: number
): { idealFrontLength: number; rawDiff: number; normalizedDiff: number } {
  const idealFrontLength = (userHeight - userInseam) * 0.65 - 2.0;
  const rawDiff = garmentFrontLength - idealFrontLength;
  const normalizedDiff =
    idealFrontLength !== 0 ? rawDiff / idealFrontLength : 0;
  return { idealFrontLength, rawDiff, normalizedDiff };
}

/** Master Tables §3 SLEEVE — Shoulder-to-Cuff measurement */
export function calculateSleeveFromShoulder(
  garmentSleeve: number,
  userSleeveLength: number,
  userShoulderWidth: number,
  shoulderAdjustment: number
): { casualSleeveEquivalent: number; rawDiff: number; perceivedDiff: number } {
  const casualSleeveEquivalent =
    userSleeveLength - userShoulderWidth * 0.5 - 1.0;
  const rawDiff = garmentSleeve - casualSleeveEquivalent;
  const perceivedDiff = rawDiff + shoulderAdjustment;
  return { casualSleeveEquivalent, rawDiff, perceivedDiff };
}

/** Master Tables §3 SLEEVE — Center-Back-to-Cuff measurement */
export function calculateSleeveFromCenterBack(
  garmentCBSleeve: number,
  userSleeveLength: number
): { effectiveGarmentCB: number; perceivedDiff: number } {
  const effectiveGarmentCB = garmentCBSleeve - 0.75;
  const perceivedDiff = effectiveGarmentCB - userSleeveLength;
  return { effectiveGarmentCB, perceivedDiff };
}

/** Master Tables §3 SLEEVE — Shoulder Adjustment lookup (helper for sleeve calc) */
export function calculateShoulderAdjustment(
  garmentShoulder: number,
  userShoulderWidth: number
): { shoulderDiff: number; adjustment: number } {
  const shoulderDiff = garmentShoulder - userShoulderWidth;

  if (shoulderDiff < -1.0) return { shoulderDiff, adjustment: -0.5 };
  if (shoulderDiff < -0.5) return { shoulderDiff, adjustment: -0.25 };
  if (shoulderDiff <= 0.5) return { shoulderDiff, adjustment: 0 };
  if (shoulderDiff <= 1.25) return { shoulderDiff, adjustment: 0.25 };
  if (shoulderDiff <= 2.0) return { shoulderDiff, adjustment: 0.5 };
  return { shoulderDiff, adjustment: shoulderDiff * 0.6 };
}

/** Master Tables §4 SHOULDER */
export function calculateShoulder(
  garmentShoulder: number,
  userShoulderWidth: number
): number {
  return garmentShoulder - userShoulderWidth;
}

/** Master Tables §5 WAIST (Fixed Waistband) */
export function calculateWaistFixed(
  garmentWaist: number,
  userWaist: number,
  isFlat: boolean
): number {
  const effectiveWaist = isFlat ? garmentWaist * 2 : garmentWaist;
  return effectiveWaist - userWaist;
}

/** Master Tables §6 WAIST (Elastic/Range Waistband) */
export function calculateWaistElastic(
  userWaist: number,
  rangeMin: number,
  rangeMax: number
): { position: number | null; belowRange: boolean; aboveRange: boolean } {
  if (userWaist < rangeMin) {
    return { position: null, belowRange: true, aboveRange: false };
  }
  if (userWaist > rangeMax) {
    return { position: null, belowRange: false, aboveRange: true };
  }
  const rangeSpan = rangeMax - rangeMin;
  const position = rangeSpan !== 0 ? (userWaist - rangeMin) / rangeSpan : 0;
  return { position, belowRange: false, aboveRange: false };
}

/** Master Tables §7 THIGH */
export function calculateThighEase(
  garmentThigh: number,
  userThigh: number,
  isFlat: boolean
): number {
  const garmentThighCirc = isFlat ? garmentThigh * 2 : garmentThigh;
  return garmentThighCirc - userThigh;
}

/** Master Tables §8 INSEAM */
export function calculateInseam(
  garmentInseam: number,
  userInseam: number
): number {
  return garmentInseam - userInseam;
}

/** Master Tables §10 LEG OPENING (Silhouette) */
export function calculateLegOpeningRatio(
  garmentLegOpening: number,
  garmentThigh: number
): number {
  if (garmentThigh === 0) return NaN;
  return garmentLegOpening / garmentThigh;
}

/** Master Tables — Outseam to Inseam Conversion (when inseam not provided) */
export function convertOutseamToInseam(
  outseam: number,
  frontRise: number
): number {
  return outseam - frontRise - 2.0;
}

/** Master Tables — Hip Shelf Rise Adjustment */
export function applyHipShelfRiseAdjustment(
  garmentInseam: number,
  frontRise: number
): number {
  const BASELINE_RISE = 11.0;
  const RISE_ADJUSTMENT_FACTOR = 0.7;

  if (frontRise > BASELINE_RISE) {
    const riseDiff = frontRise - BASELINE_RISE;
    const adjustment = riseDiff * RISE_ADJUSTMENT_FACTOR;
    return garmentInseam + adjustment;
  }
  return garmentInseam;
}

/** Master Tables — Flat vs Circumference Auto-Detection */
export function detectFlatOrCircumference(
  values: number[],
  measurementType: 'waist' | 'thigh' | 'legOpening' | 'chest'
): 'flat' | 'circumference' {
  if (values.length === 0) return 'flat';

  const average =
    values.reduce((sum, v) => sum + v, 0) / values.length;

  const thresholds: Record<
    typeof measurementType,
    { flatMax: number; circMin: number }
  > = {
    waist: { flatMax: 22, circMin: 28 },
    thigh: { flatMax: 14, circMin: 20 },
    legOpening: { flatMax: 10, circMin: 12 },
    chest: { flatMax: 26, circMin: 36 },
  };

  const { flatMax, circMin } = thresholds[measurementType];

  if (average <= flatMax) return 'flat';
  if (average >= circMin) return 'circumference';

  const distToFlatMax = Math.abs(average - flatMax);
  const distToCircMin = Math.abs(average - circMin);
  return distToFlatMax <= distToCircMin ? 'flat' : 'circumference';
}
