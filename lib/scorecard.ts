/**
 * Scorecard orchestrator — connects extraction → calculations → categories → callouts.
 * Pure function: extraction + userMeasurements + size → ScorecardResult.
 */

import {
  applyHipShelfRiseAdjustment,
  calculateChestEase,
  calculateFrontLength,
  calculateInseam,
  calculateLegOpeningRatio,
  calculateShoulder,
  calculateShoulderAdjustment,
  calculateSleeveFromCenterBack,
  calculateSleeveFromShoulder,
  calculateThighEase,
  calculateWaistElastic,
  calculateWaistFixed,
  convertOutseamToInseam,
  detectFlatOrCircumference,
} from './calculations';
import {
  getChestCategory,
  getFrontLengthCategory,
  getInseamCategory,
  getLegOpeningCategory,
  getRiseCategory,
  getShoulderCategory,
  getSleeveCategory,
  getThighCategory,
  getWaistElasticCategory,
  getWaistFixedCategory,
} from './categories';
import {
  getChestCallouts,
  getFrontLengthCallouts,
  getHipShelfCallout,
  getInseamCallouts,
  getLegOpeningCallouts,
  getOutseamConversionCallout,
  getRiseCallouts,
  getShoulderCallouts,
  getSleeveCallouts,
  getThighCallouts,
} from './callouts';
import type {
  BottomMeasurements,
  ExtractionResult,
  MeasurementResult,
  ScorecardResult,
  TopMeasurements,
  UserMeasurements,
} from './types';

const MISSING_IMPACTS: Record<string, string> = {
  Chest: 'Chest fit and ease cannot be determined.',
  Shoulder:
    'Shoulder placement and its effect on sleeve perception cannot be determined.',
  'Sleeve Length': 'Sleeve landing point cannot be determined.',
  'Front Length': 'Hem placement cannot be determined.',
  Waist: 'Waist fit cannot be determined.',
  Thigh: 'Thigh fit and ease cannot be determined.',
  Inseam: 'Hem landing point and stacking cannot be determined.',
  Rise: 'Seat room and upper block fit cannot be determined.',
  'Leg Opening': 'Leg silhouette (taper vs straight) cannot be determined.',
};

export function getAvailableSizes(extraction: ExtractionResult): string[] {
  return Object.keys(extraction.sizes);
}

function collectValues<K extends keyof TopMeasurements | keyof BottomMeasurements>(
  sizes: Record<string, TopMeasurements | BottomMeasurements>,
  key: K
): number[] {
  const values: number[] = [];
  for (const sizeData of Object.values(sizes)) {
    const v = sizeData[key];
    if (typeof v === 'number' && !Number.isNaN(v)) values.push(v);
  }
  return values;
}

export function generateScorecard(
  extraction: ExtractionResult,
  userMeasurements: UserMeasurements,
  selectedSize: string
): ScorecardResult {
  const measurements: MeasurementResult[] = [];
  const sizeData = extraction.sizes[selectedSize];
  if (!sizeData) {
    const expected =
      extraction.garmentType === 'top'
        ? ['Chest', 'Shoulder', 'Sleeve Length', 'Front Length']
        : ['Waist', 'Thigh', 'Inseam', 'Rise', 'Leg Opening'];
    return {
      size: selectedSize,
      garmentType: extraction.garmentType,
      garmentSubType: extraction.garmentSubType,
      measurements: [],
      fabricInfo: extraction.fabricInfo,
      brandFitNotes: extraction.brandFitNotes,
      missingMeasurements: expected.map((name) => ({
        name,
        impact: MISSING_IMPACTS[name],
      })),
    };
  }

  if (extraction.garmentType === 'top') {
    const sizeMeasurements = sizeData as TopMeasurements;

    if (sizeMeasurements.chest != null) {
      const chestValues = collectValues(extraction.sizes, 'chest');
      const isFlat =
        detectFlatOrCircumference(chestValues, 'chest') === 'flat';
      const ease = calculateChestEase(
        sizeMeasurements.chest,
        userMeasurements.chest,
        isFlat
      );
      measurements.push({
        measurementName: 'Chest',
        garmentValue: sizeMeasurements.chest,
        delta: ease,
        fitCategory: getChestCategory(ease),
        callouts: getChestCallouts(extraction.garmentSubType),
        isApproximation: false,
      });
    }

    if (sizeMeasurements.shoulder != null) {
      const shoulderDiff = calculateShoulder(
        sizeMeasurements.shoulder,
        userMeasurements.shoulderWidth
      );
      measurements.push({
        measurementName: 'Shoulder',
        garmentValue: sizeMeasurements.shoulder,
        delta: shoulderDiff,
        fitCategory: getShoulderCategory(shoulderDiff),
        callouts: getShoulderCallouts(extraction.garmentSubType),
        isApproximation: false,
      });
    }

    if (sizeMeasurements.sleeveLength != null) {
      const garmentShoulder =
        sizeMeasurements.shoulder ?? userMeasurements.shoulderWidth;
      const shoulderAdjustment = calculateShoulderAdjustment(
        garmentShoulder,
        userMeasurements.shoulderWidth
      );
      let perceivedSleeveDiff: number;
      if (sizeMeasurements.sleeveMeasurementType === 'center-back-to-cuff') {
        const result = calculateSleeveFromCenterBack(
          sizeMeasurements.sleeveLength,
          userMeasurements.sleeveLength
        );
        perceivedSleeveDiff = result.perceivedDiff;
      } else {
        const result = calculateSleeveFromShoulder(
          sizeMeasurements.sleeveLength,
          userMeasurements.sleeveLength,
          userMeasurements.shoulderWidth,
          shoulderAdjustment.adjustment
        );
        perceivedSleeveDiff = result.perceivedDiff;
      }
      const shoulderCategory = getShoulderCategory(
        shoulderAdjustment.shoulderDiff
      ).category;
      measurements.push({
        measurementName: 'Sleeve Length',
        garmentValue: sizeMeasurements.sleeveLength,
        delta: perceivedSleeveDiff,
        fitCategory: getSleeveCategory(perceivedSleeveDiff),
        callouts: getSleeveCallouts(
          extraction.garmentSubType,
          shoulderCategory
        ),
        isApproximation: false,
      });
    }

    if (sizeMeasurements.frontLength != null) {
      const { normalizedDiff } = calculateFrontLength(
        sizeMeasurements.frontLength,
        userMeasurements.height,
        userMeasurements.inseam
      );
      measurements.push({
        measurementName: 'Front Length',
        garmentValue: sizeMeasurements.frontLength,
        delta: normalizedDiff,
        fitCategory: getFrontLengthCategory(normalizedDiff),
        callouts: getFrontLengthCallouts(extraction.garmentSubType),
        isApproximation: false,
      });
    }
  } else {
    const sizeMeasurements = sizeData as BottomMeasurements;

    const hasElasticWaist =
      sizeMeasurements.waistType === 'elastic' &&
      sizeMeasurements.waistMin != null &&
      sizeMeasurements.waistMax != null;

    if (hasElasticWaist) {
      const { position, belowRange, aboveRange } = calculateWaistElastic(
        userMeasurements.waist,
        sizeMeasurements.waistMin!,
        sizeMeasurements.waistMax!
      );
      measurements.push({
        measurementName: 'Waist',
        garmentValue:
          (sizeMeasurements.waistMin! + sizeMeasurements.waistMax!) / 2,
        delta: null,
        fitCategory: getWaistElasticCategory(
          position,
          belowRange,
          aboveRange
        ),
        callouts: [],
        isApproximation: false,
      });
    } else if (sizeMeasurements.waist != null) {
      const waistValues = collectValues(extraction.sizes, 'waist');
      const isFlat =
        detectFlatOrCircumference(waistValues, 'waist') === 'flat';
      const garmentWaistCirc = isFlat
        ? sizeMeasurements.waist * 2
        : sizeMeasurements.waist;
      const waistDiff = calculateWaistFixed(
        garmentWaistCirc,
        userMeasurements.waist,
        false
      );
      measurements.push({
        measurementName: 'Waist',
        garmentValue: sizeMeasurements.waist,
        delta: waistDiff,
        fitCategory: getWaistFixedCategory(waistDiff),
        callouts: [],
        isApproximation: false,
      });
    }

    if (sizeMeasurements.thigh != null) {
      const thighValues = collectValues(extraction.sizes, 'thigh');
      const isFlat =
        detectFlatOrCircumference(thighValues, 'thigh') === 'flat';
      const thighEase = calculateThighEase(
        sizeMeasurements.thigh,
        userMeasurements.thigh,
        isFlat
      );
      measurements.push({
        measurementName: 'Thigh',
        garmentValue: sizeMeasurements.thigh,
        delta: thighEase,
        fitCategory: getThighCategory(thighEase),
        callouts: getThighCallouts(extraction.garmentSubType),
        isApproximation: false,
      });
    }

    let inseamValue: number | undefined;
    let inseamIsApproximation = false;
    if (sizeMeasurements.inseam != null) {
      inseamValue = sizeMeasurements.inseam;
    } else if (
      sizeMeasurements.outseam != null &&
      sizeMeasurements.frontRise != null
    ) {
      inseamValue = convertOutseamToInseam(
        sizeMeasurements.outseam,
        sizeMeasurements.frontRise
      );
      inseamIsApproximation = true;
    }

    if (inseamValue != null) {
      const effectiveInseam =
        sizeMeasurements.frontRise != null
          ? applyHipShelfRiseAdjustment(inseamValue, sizeMeasurements.frontRise)
          : inseamValue;
      const inseamDiff = calculateInseam(
        effectiveInseam,
        userMeasurements.inseam
      );
      const frontRise = sizeMeasurements.frontRise ?? 0;
      const hipShelfCallouts = getHipShelfCallout(frontRise > 11.0);
      const outseamCallouts = getOutseamConversionCallout(inseamIsApproximation);
      const inseamCallouts = getInseamCallouts(extraction.garmentSubType);
      measurements.push({
        measurementName: 'Inseam',
        garmentValue: inseamValue,
        delta: inseamDiff,
        fitCategory: getInseamCategory(inseamDiff),
        callouts: [
          ...inseamCallouts,
          ...hipShelfCallouts,
          ...outseamCallouts,
        ],
        isApproximation: inseamIsApproximation,
        approximationNote: inseamIsApproximation
          ? getOutseamConversionCallout(true)[0]
          : undefined,
      });
    }

    if (sizeMeasurements.frontRise != null) {
      measurements.push({
        measurementName: 'Rise',
        garmentValue: sizeMeasurements.frontRise,
        delta: null,
        fitCategory: getRiseCategory(sizeMeasurements.frontRise),
        callouts: getRiseCallouts(extraction.garmentSubType),
        isApproximation: false,
      });
    }

    if (
      sizeMeasurements.legOpening != null &&
      sizeMeasurements.thigh != null
    ) {
      const ltr = calculateLegOpeningRatio(
        sizeMeasurements.legOpening,
        sizeMeasurements.thigh
      );
      if (!Number.isNaN(ltr)) {
        measurements.push({
          measurementName: 'Leg Opening',
          garmentValue: sizeMeasurements.legOpening,
          delta: ltr,
          fitCategory: getLegOpeningCategory(ltr),
          callouts: getLegOpeningCallouts(extraction.garmentSubType),
          isApproximation: false,
        });
      }
    }
  }

  const expectedTop = ['Chest', 'Shoulder', 'Sleeve Length', 'Front Length'];
  const expectedBottom = ['Waist', 'Thigh', 'Inseam', 'Rise', 'Leg Opening'];
  const expected =
    extraction.garmentType === 'top' ? expectedTop : expectedBottom;
  const presentNames = new Set(measurements.map((m) => m.measurementName));
  const missingMeasurements = expected
    .filter((name) => !presentNames.has(name))
    .map((name) => ({ name, impact: MISSING_IMPACTS[name] }));

  return {
    size: selectedSize,
    garmentType: extraction.garmentType,
    garmentSubType: extraction.garmentSubType,
    measurements,
    fabricInfo: extraction.fabricInfo,
    brandFitNotes: extraction.brandFitNotes,
    missingMeasurements,
  };
}
