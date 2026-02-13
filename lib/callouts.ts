/**
 * Garment-specific callout strings. Matches docs/Fit_Check_Master_Tables.md.
 * Returns contextual notes based on garment sub-type.
 */

function matches(subType: string, ...keywords: string[]): boolean {
  const lower = subType.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

/** Master Tables §1 CHEST — Key Garment Callouts */
export function getChestCallouts(garmentSubType: string): string[] {
  const callouts: string[] = [];
  if (matches(garmentSubType, 'hoodie', 'sweatshirt')) {
    callouts.push(
      'Heavier knit fabrics amplify chest volume perception. Lower ease limits layering.'
    );
  }
  if (matches(garmentSubType, 'jacket', 'coat')) {
    callouts.push(
      'Chest ease affects silhouette and layering more than drape due to structure and lining.'
    );
  }
  return callouts;
}

/** Master Tables §2 FRONT LENGTH — Key Garment Callouts */
export function getFrontLengthCallouts(garmentSubType: string): string[] {
  const callouts: string[] = [];
  if (matches(garmentSubType, 'hoodie', 'sweater', 'sweatshirt')) {
    callouts.push(
      'Ribbed/elastic hems (hoodies, sweaters): May bunch rather than hang straight at longer lengths.'
    );
  }
  if (matches(garmentSubType, 'tee', 't-shirt', 'button-up', 'button up')) {
    callouts.push(
      'Curved/split hems (tees, button-ups): Center front may sit higher than sides.'
    );
  }
  return callouts;
}

/** Master Tables §3 SLEEVE LENGTH — Key Garment Callouts */
export function getSleeveCallouts(
  garmentSubType: string,
  shoulderCategory?: string
): string[] {
  const callouts: string[] = [];
  if (matches(garmentSubType, 'button-up', 'button up')) {
    callouts.push(
      'Fixed cuffs create stable landing point. Extra length folds/stacks at cuff.'
    );
  }
  if (matches(garmentSubType, 'sweater', 'knit')) {
    callouts.push(
      'Longer sleeves drape softly. Ribbed cuffs allow gradual extension.'
    );
  }
  if (matches(garmentSubType, 'hoodie')) {
    callouts.push(
      'Ribbed cuffs grip wrist, prevent hand coverage. Extra length pools above cuff.'
    );
  }
  if (
    matches(garmentSubType, 'light jacket', 'lightweight jacket', 'unstructured')
  ) {
    callouts.push('Sleeve moves more freely over wrist/hand.');
  }
  if (matches(garmentSubType, 'coat')) {
    callouts.push('Wider cuffs allow sleeve to drop over hand.');
  }
  if (shoulderCategory === 'Heavily Dropped') {
    callouts.push(
      'Sleeve may still reach wrist even if measured length appears shorter.'
    );
  }
  return callouts;
}

/** Master Tables §4 SHOULDER — Key Garment Callouts */
export function getShoulderCallouts(garmentSubType: string): string[] {
  if (matches(garmentSubType, 'hoodie', 'sweatshirt')) {
    return [
      'Dropped shoulders are common and increase visual sleeve length. Narrow shoulders may be less noticeable due to relaxed knit structure.',
    ];
  }
  return [];
}

/** Master Tables §7 THIGH — Key Garment Callouts */
export function getThighCallouts(garmentSubType: string): string[] {
  if (matches(garmentSubType, 'trouser')) {
    return [
      'Thigh fit is more precise and less forgiving. Small differences more noticeable.',
    ];
  }
  return [];
}

/** Master Tables §8 INSEAM — Key Garment Callouts */
export function getInseamCallouts(
  garmentSubType: string,
  hasElasticHem?: boolean
): string[] {
  const callouts: string[] = [];
  if (
    hasElasticHem ||
    matches(garmentSubType, 'sweatpant', 'jogger', 'cargo')
  ) {
    callouts.push(
      'Hem anchors at ankle regardless of inseam. Excess or missing length absorbed above ankle rather than changing visual endpoint.'
    );
  }
  callouts.push(
    'Longer rise places crotch seam lower, making same inseam feel longer. Shorter rise makes it feel shorter. Interpret together.'
  );
  return callouts;
}

/** Master Tables §9 RISE — Key Garment Callouts */
export function getRiseCallouts(garmentSubType: string): string[] {
  const callouts: string[] = [];
  if (matches(garmentSubType, 'trouser')) {
    callouts.push(
      'Rise has greater impact on seat comfort and drape. Small differences more noticeable.'
    );
  }
  callouts.push(
    'Rise does not dictate wearing position. Describes garment geometry, not user behavior.'
  );
  return callouts;
}

/** Master Tables §10 LEG OPENING — Key Garment Callouts */
export function getLegOpeningCallouts(garmentSubType: string): string[] {
  if (matches(garmentSubType, 'sweatpant', 'jogger')) {
    return [
      'Elastic or cinched hems visually constrain leg opening at ankle regardless of measured opening.',
    ];
  }
  return [];
}

/** Master Tables — Hip Shelf Rise Adjustment callout */
export function getHipShelfCallout(wasAdjusted: boolean): string[] {
  if (wasAdjusted) {
    return [
      'This inseam accounts for a longer rise placing the crotch seam lower on the body. The hem will land lower than the raw inseam suggests. This assumes the pant is worn at the hip shelf.',
    ];
  }
  return [];
}

/** Master Tables — Outseam to Inseam Conversion callout */
export function getOutseamConversionCallout(wasConverted: boolean): string[] {
  if (wasConverted) {
    return [
      'Inseam was estimated from outseam. This is an approximation and may differ slightly from a directly measured inseam.',
    ];
  }
  return [];
}
