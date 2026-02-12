/** User body measurements stored in Chrome storage. All values in inches. */
export interface UserMeasurements {
  height: number;
  inseam: number;
  chest: number;
  waist: number;
  thigh: number;
  shoulderWidth: number;
  sleeveLength: number;
}

/** Top garment measurements per size. Flat measurements unless noted. */
export interface TopMeasurements {
  chest?: number;
  shoulder?: number;
  sleeveLength?: number;
  sleeveMeasurementType?: 'shoulder-to-cuff' | 'center-back-to-cuff';
  frontLength?: number;
}

/** Bottom garment measurements per size. */
export interface BottomMeasurements {
  waist?: number;
  frontRise?: number;
  thigh?: number;
  inseam?: number;
  outseam?: number;
  legOpening?: number;
  waistType?: 'fixed' | 'elastic';
  waistMin?: number;
  waistMax?: number;
}

/** Garment measurements extracted from product page, keyed by size. */
export interface GarmentMeasurements {
  type: 'top' | 'bottom';
  sizes: Record<string, TopMeasurements | BottomMeasurements>;
}

/** Result from Claude API extraction. */
export interface ExtractionResult {
  garmentType: 'top' | 'bottom';
  garmentSubType: string;
  sizes: Record<string, TopMeasurements | BottomMeasurements>;
  fabricInfo?: string;
  brandFitNotes?: string;
  rawConfidence?: string;
}

/** Fit category with universal meaning from master tables. */
export interface FitCategory {
  category: string;
  universalMeaning: string;
}

/** One row in the scorecard for a measurement. */
export interface MeasurementResult {
  measurementName: string;
  garmentValue: number;
  delta: number | null;
  fitCategory: FitCategory;
  callouts: string[];
  isApproximation: boolean;
  approximationNote?: string;
}

/** Full scorecard for one size. */
export interface ScorecardResult {
  size: string;
  garmentType: 'top' | 'bottom';
  garmentSubType: string;
  measurements: MeasurementResult[];
  fabricInfo?: string;
  brandFitNotes?: string;
  missingMeasurements: { name: string; impact: string }[];
}

/** Measurement interpretation for flat vs circumference auto-detection. */
export type MeasurementType = 'flat' | 'circumference';
