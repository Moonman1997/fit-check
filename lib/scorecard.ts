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
  MeasurementTier,
  ScorecardResult,
  TopMeasurements,
  UserMeasurements,
} from './types';

const BODY_MEASUREMENT_IMPACT =
  'Body measurements were found but cannot be used for fit analysis. Garment measurements are required.';

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
  'Pant Silhouette': 'Pant silhouette (taper vs straight) cannot be determined.',
};

export function getAvailableSizes(extraction: ExtractionResult): string[] {
  if (extraction.sizingFormat === 'waist-length') return ['default'];
  return Object.keys(extraction.sizes);
}

const MEASUREMENT_NAME_TO_TIER_KEY: Record<string, string> = {
  Chest: 'chest',
  Shoulder: 'shoulder',
  'Sleeve Length': 'sleeveLength',
  'Front Length': 'frontLength',
  Waist: 'waist',
  Thigh: 'thigh',
  Inseam: 'inseam',
  Rise: 'frontRise',
  'Pant Silhouette': 'legOpening',
};

function getTier(
  extraction: ExtractionResult,
  measurementName: string
): MeasurementTier {
  const key = MEASUREMENT_NAME_TO_TIER_KEY[measurementName];
  const tier = key ? extraction.measurementTiers?.[key] : undefined;
  return tier ?? 'garment';
}

function addTier(
  m: Omit<MeasurementResult, 'tier'>,
  extraction: ExtractionResult,
  measurementName: string
): MeasurementResult {
  return { ...m, tier: getTier(extraction, measurementName) };
}

function isTierBody(
  extraction: ExtractionResult,
  measurementKey: string
): boolean {
  return extraction.measurementTiers?.[measurementKey] === 'body';
}

function collectValues<K extends keyof TopMeasurements | keyof BottomMeasurements>(
  sizes: Record<string, TopMeasurements | BottomMeasurements>,
  key: K
): number[] {
  const values: number[] = [];
  for (const sizeData of Object.values(sizes)) {
    const v = (sizeData as Record<string, unknown>)[key];
    if (typeof v === 'number' && !Number.isNaN(v)) values.push(v);
  }
  return values;
}

export function generateScorecard(
  extraction: ExtractionResult,
  userMeasurements: UserMeasurements,
  selectedSize: string,
  selectedWaist?: number,
  selectedLength?: number
): ScorecardResult {
  const measurements: MeasurementResult[] = [];
  const isWaistLength = extraction.sizingFormat === 'waist-length';
  const sizeData = isWaistLength
    ? extraction.sizes['default']
    : extraction.sizes[selectedSize];

  if (!sizeData) {
    const expected =
      extraction.garmentType === 'top'
        ? ['Chest', 'Shoulder', 'Sleeve Length', 'Front Length']
        : ['Waist', 'Thigh', 'Inseam', 'Rise', 'Pant Silhouette'];
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

    if (sizeMeasurements.chest != null && !isTierBody(extraction, 'chest')) {
      const chestValues = collectValues(extraction.sizes, 'chest');
      const isFlat =
        detectFlatOrCircumference(chestValues, 'chest') === 'flat';
      const ease = calculateChestEase(
        sizeMeasurements.chest,
        userMeasurements.chest,
        isFlat
      );
      measurements.push(
        addTier(
          {
            measurementName: 'Chest',
            garmentValue: sizeMeasurements.chest,
            delta: ease,
            fitCategory: getChestCategory(ease),
            callouts: getChestCallouts(extraction.garmentSubType),
            isApproximation: false,
          },
          extraction,
          'Chest'
        )
      );
    }

    if (sizeMeasurements.shoulder != null && !isTierBody(extraction, 'shoulder')) {
      const shoulderDiff = calculateShoulder(
        sizeMeasurements.shoulder,
        userMeasurements.shoulderWidth
      );
      measurements.push(
        addTier(
          {
            measurementName: 'Shoulder',
            garmentValue: sizeMeasurements.shoulder,
            delta: shoulderDiff,
            fitCategory: getShoulderCategory(shoulderDiff),
            callouts: getShoulderCallouts(extraction.garmentSubType),
            isApproximation: false,
          },
          extraction,
          'Shoulder'
        )
      );
    }

    if (sizeMeasurements.sleeveLength != null && !isTierBody(extraction, 'sleeveLength')) {
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
      measurements.push(
        addTier(
          {
            measurementName: 'Sleeve Length',
            garmentValue: sizeMeasurements.sleeveLength,
            delta: perceivedSleeveDiff,
            fitCategory: getSleeveCategory(perceivedSleeveDiff),
            callouts: getSleeveCallouts(
              extraction.garmentSubType,
              shoulderCategory
            ),
            isApproximation: false,
          },
          extraction,
          'Sleeve Length'
        )
      );
    }

    if (sizeMeasurements.frontLength != null && !isTierBody(extraction, 'frontLength')) {
      const { normalizedDiff } = calculateFrontLength(
        sizeMeasurements.frontLength,
        userMeasurements.height,
        userMeasurements.inseam
      );
      measurements.push(
        addTier(
          {
            measurementName: 'Front Length',
            garmentValue: sizeMeasurements.frontLength,
            delta: normalizedDiff,
            fitCategory: getFrontLengthCategory(normalizedDiff),
            callouts: getFrontLengthCallouts(extraction.garmentSubType),
            isApproximation: false,
          },
          extraction,
          'Front Length'
        )
      );
    }
  } else if (isWaistLength) {
    const defaultMeasurements = sizeData as BottomMeasurements;

    if (selectedWaist != null) {
      const waistDiff = calculateWaistFixed(
        selectedWaist,
        userMeasurements.waist,
        false
      );
      measurements.push(
        addTier(
          {
            measurementName: 'Waist',
            garmentValue: selectedWaist,
            delta: waistDiff,
            fitCategory: getWaistFixedCategory(waistDiff),
            callouts: [],
            isApproximation: true,
            approximationNote:
              'Waist is based on the labeled size, not a direct garment measurement. Actual garment waist may vary.',
          },
          extraction,
          'Waist'
        )
      );
    }

    if (
      defaultMeasurements.thigh != null &&
      !isTierBody(extraction, 'thigh')
    ) {
      const thighValues = collectValues(extraction.sizes, 'thigh');
      const thighIsFlat =
        detectFlatOrCircumference(thighValues, 'thigh') === 'flat';
      const thighEase = calculateThighEase(
        defaultMeasurements.thigh,
        userMeasurements.thigh,
        thighIsFlat
      );
      measurements.push(
        addTier(
          {
            measurementName: 'Thigh',
            garmentValue: defaultMeasurements.thigh,
            delta: thighEase,
            fitCategory: getThighCategory(thighEase),
            callouts: getThighCallouts(extraction.garmentSubType),
            isApproximation: false,
          },
          extraction,
          'Thigh'
        )
      );
    }

    if (selectedLength != null) {
      const effectiveInseam =
        defaultMeasurements.frontRise != null
          ? applyHipShelfRiseAdjustment(
              selectedLength,
              defaultMeasurements.frontRise
            )
          : selectedLength;
      const inseamDiff = calculateInseam(
        effectiveInseam,
        userMeasurements.inseam
      );
      const frontRise = defaultMeasurements.frontRise ?? 0;
      const hipShelfCallouts = getHipShelfCallout(frontRise > 11.0);
      measurements.push(
        addTier(
          {
            measurementName: 'Inseam',
            garmentValue: selectedLength,
            delta: inseamDiff,
            fitCategory: getInseamCategory(inseamDiff),
            callouts: [
              ...getInseamCallouts(extraction.garmentSubType),
              ...hipShelfCallouts,
            ],
            isApproximation: true,
            approximationNote:
              'Inseam is based on the labeled length, not a direct garment measurement.',
          },
          extraction,
          'Inseam'
        )
      );
    }

    if (
      defaultMeasurements.frontRise != null &&
      !isTierBody(extraction, 'frontRise')
    ) {
      measurements.push(
        addTier(
          {
            measurementName: 'Rise',
            garmentValue: defaultMeasurements.frontRise,
            delta: null,
            fitCategory: getRiseCategory(defaultMeasurements.frontRise),
            callouts: getRiseCallouts(extraction.garmentSubType),
            isApproximation: false,
          },
          extraction,
          'Rise'
        )
      );
    }

    if (
      defaultMeasurements.legOpening != null &&
      defaultMeasurements.thigh != null &&
      !isTierBody(extraction, 'legOpening') &&
      !isTierBody(extraction, 'thigh')
    ) {
      const ltr = calculateLegOpeningRatio(
        defaultMeasurements.legOpening,
        defaultMeasurements.thigh
      );
      if (!Number.isNaN(ltr)) {
        measurements.push(
          addTier(
            {
              measurementName: 'Pant Silhouette',
              garmentValue: defaultMeasurements.legOpening,
              delta: ltr,
              fitCategory: getLegOpeningCategory(ltr),
              callouts: getLegOpeningCallouts(extraction.garmentSubType),
              isApproximation: false,
            },
            extraction,
            'Pant Silhouette'
          )
        );
      }
    }
  } else {
    const sizeMeasurements = sizeData as BottomMeasurements;

    const hasElasticWaist =
      sizeMeasurements.waistType === 'elastic' &&
      sizeMeasurements.waistMin != null &&
      sizeMeasurements.waistMax != null;

    if (hasElasticWaist && !isTierBody(extraction, 'waist')) {
      const { position, belowRange, aboveRange } = calculateWaistElastic(
        userMeasurements.waist,
        sizeMeasurements.waistMin!,
        sizeMeasurements.waistMax!
      );
      measurements.push(
        addTier(
          {
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
          },
          extraction,
          'Waist'
        )
      );
    } else if (sizeMeasurements.waist != null && !isTierBody(extraction, 'waist')) {
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
      measurements.push(
        addTier(
          {
            measurementName: 'Waist',
            garmentValue: sizeMeasurements.waist,
            delta: waistDiff,
            fitCategory: getWaistFixedCategory(waistDiff),
            callouts: [],
            isApproximation: false,
          },
          extraction,
          'Waist'
        )
      );
    }

    if (sizeMeasurements.thigh != null && !isTierBody(extraction, 'thigh')) {
      const thighValues = collectValues(extraction.sizes, 'thigh');
      const isFlat =
        detectFlatOrCircumference(thighValues, 'thigh') === 'flat';
      const thighEase = calculateThighEase(
        sizeMeasurements.thigh,
        userMeasurements.thigh,
        isFlat
      );
      measurements.push(
        addTier(
          {
            measurementName: 'Thigh',
            garmentValue: sizeMeasurements.thigh,
            delta: thighEase,
            fitCategory: getThighCategory(thighEase),
            callouts: getThighCallouts(extraction.garmentSubType),
            isApproximation: false,
          },
          extraction,
          'Thigh'
        )
      );
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

    if (inseamValue != null && !isTierBody(extraction, 'inseam')) {
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
      measurements.push(
        addTier(
          {
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
          },
          extraction,
          'Inseam'
        )
      );
    }

    if (sizeMeasurements.frontRise != null && !isTierBody(extraction, 'frontRise')) {
      measurements.push(
        addTier(
          {
            measurementName: 'Rise',
            garmentValue: sizeMeasurements.frontRise,
            delta: null,
            fitCategory: getRiseCategory(sizeMeasurements.frontRise),
            callouts: getRiseCallouts(extraction.garmentSubType),
            isApproximation: false,
          },
          extraction,
          'Rise'
        )
      );
    }

    if (
      sizeMeasurements.legOpening != null &&
      sizeMeasurements.thigh != null &&
      !isTierBody(extraction, 'legOpening') &&
      !isTierBody(extraction, 'thigh')
    ) {
      const ltr = calculateLegOpeningRatio(
        sizeMeasurements.legOpening,
        sizeMeasurements.thigh
      );
      if (!Number.isNaN(ltr)) {
        measurements.push(
          addTier(
            {
              measurementName: 'Pant Silhouette',
              garmentValue: sizeMeasurements.legOpening,
              delta: ltr,
              fitCategory: getLegOpeningCategory(ltr),
              callouts: getLegOpeningCallouts(extraction.garmentSubType),
              isApproximation: false,
            },
            extraction,
            'Pant Silhouette'
          )
        );
      }
    }
  }

  const expectedTop = ['Chest', 'Shoulder', 'Sleeve Length', 'Front Length'];
  const expectedBottom = ['Waist', 'Thigh', 'Inseam', 'Rise', 'Pant Silhouette'];
  const expected =
    extraction.garmentType === 'top' ? expectedTop : expectedBottom;
  const presentNames = new Set(measurements.map((m) => m.measurementName));

  const tierKeyByMeasurementName: Record<string, string> = {
    Waist: 'waist',
    Thigh: 'thigh',
    Inseam: 'inseam',
    Rise: 'frontRise',
    'Pant Silhouette': 'legOpening',
  };

  let missingCandidates = expected.filter((name) => !presentNames.has(name));

  if (isWaistLength) {
    if (selectedWaist != null) missingCandidates = missingCandidates.filter((n) => n !== 'Waist');
    if (selectedLength != null) missingCandidates = missingCandidates.filter((n) => n !== 'Inseam');
  }

  const missingMeasurements = missingCandidates.map((name) => {
    const tierKey = tierKeyByMeasurementName[name];
    const tier = tierKey ? extraction.measurementTiers?.[tierKey] : undefined;
    const impact =
      tier === 'body' ? BODY_MEASUREMENT_IMPACT : MISSING_IMPACTS[name] ?? '';
    return { name, impact };
  });

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
