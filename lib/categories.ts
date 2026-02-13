/**
 * Category lookup functions — translate calculated values to FitCategory.
 * Matches docs/Fit_Check_Master_Tables.md exactly. Lower-bound inclusive.
 */
import type { FitCategory } from './types';

/** Master Tables §1 CHEST */
export function getChestCategory(ease: number): FitCategory {
  if (ease < 0)
    return {
      category: 'Restrictive / Non-Viable',
      universalMeaning:
        'Garment chest is smaller than body. Unlikely to fit comfortably at rest; may restrict movement.',
    };
  if (ease < 2)
    return {
      category: 'Ultra Close Fit',
      universalMeaning:
        'Fabric sits against chest and ribs with minimal air space; chest shape clearly visible. Raising arms overhead creates pulling across chest and shoulders.',
    };
  if (ease < 4)
    return {
      category: 'Close Fit',
      universalMeaning:
        'Fabric drapes near chest and ribs with slight air space; contours visible but not outlined. Arm movement feels controlled; a thin base layer fits underneath.',
    };
  if (ease < 6)
    return {
      category: 'Neutral Fit',
      universalMeaning:
        'Fabric hangs near chest without touching ribs when standing; chest shape softened rather than defined. Room for a standard base layer or light sweater.',
    };
  if (ease < 8)
    return {
      category: 'Relaxed Fit',
      universalMeaning:
        'Fabric hangs away from chest and ribs creating visible air space; garment billows slightly when moving. Room for a sweatshirt or moderate layering.',
    };
  if (ease <= 12)
    return {
      category: 'Oversized Fit',
      universalMeaning:
        'Fabric hangs well away from chest and ribs; garment creates boxy shape extending beyond natural shoulder width. Room for heavy layering.',
    };
  return {
    category: 'Extreme Oversized',
    universalMeaning:
      'Fabric extends significantly beyond chest, ribs, and shoulders; garment width dominates upper body proportions. Substantial room for extensive layering.',
  };
}

/** Master Tables §2 FRONT LENGTH */
export function getFrontLengthCategory(
  normalizedDiff: number
): FitCategory {
  if (normalizedDiff < -0.14)
    return {
      category: 'High-Cropped',
      universalMeaning:
        'Hem sits well above waistband. Lower stomach and belt area visible. Hem does not reach top of front pockets.',
    };
  if (normalizedDiff < -0.08)
    return {
      category: 'Cropped',
      universalMeaning:
        'Hem sits just above waistband. Belt line and upper pant fly visible. Hem does not cover top of front pockets.',
    };
  if (normalizedDiff <= 0.04)
    return {
      category: 'Aligned',
      universalMeaning:
        'Hem meets waistband or upper hip. Belt mostly covered; top of front pockets may be visible. Stomach covered at rest.',
    };
  if (normalizedDiff <= 0.12)
    return {
      category: 'Extended',
      universalMeaning:
        'Hem sits below waistband onto hip. Belt line and pocket openings covered. Hem reaches toward lower half of front pockets.',
    };
  if (normalizedDiff < 0.22)
    return {
      category: 'Longline',
      universalMeaning:
        'Hem falls below hip past bottom of front pockets, approaching upper thigh. Torso appears visually elongated.',
    };
  return {
    category: 'Extra-Long',
    universalMeaning:
      'Hem extends clearly onto thigh, below pocket level. Garment length becomes dominant visual feature.',
  };
}

/** Master Tables §3 SLEEVE LENGTH */
export function getSleeveCategory(perceivedDiff: number): FitCategory {
  if (perceivedDiff < -1.0)
    return {
      category: 'Noticeably Short',
      universalMeaning:
        'Cuff rests well above wrist bone; wrist and part of forearm exposed. Sleeve appears cropped relative to arm length.',
    };
  if (perceivedDiff < -0.5)
    return {
      category: 'Slightly Short',
      universalMeaning:
        'Cuff rests just above wrist bone; wrist visible, no forearm exposure. Sleeve reads slightly short.',
    };
  if (perceivedDiff <= 0.5)
    return {
      category: 'Aligned',
      universalMeaning:
        'Cuff meets wrist bone directly; neither wrist nor hand visibly covered. Neutral sleeve position.',
    };
  if (perceivedDiff <= 1.25)
    return {
      category: 'Slightly Long',
      universalMeaning:
        'Cuff rests past wrist bone onto top of hand. Hand coverage begins slightly.',
    };
  if (perceivedDiff <= 2.0)
    return {
      category: 'Long',
      universalMeaning:
        'Cuff covers base of thumb; noticeable hand coverage. Sleeve clearly extends below wrist.',
    };
  return {
    category: 'Very Long',
    universalMeaning:
      'Cuff covers significant part of hand — reaching thumb joint or knuckles. Strongly extended appearance.',
  };
}

/** Master Tables §4 SHOULDER */
export function getShoulderCategory(diff: number): FitCategory {
  if (diff < -1.0)
    return {
      category: 'Narrow',
      universalMeaning:
        'Sleeve starts closer to neck than shoulder edge, creating structured upper body and compact silhouette. Shoulder movement may feel slightly restricted.',
    };
  if (diff < -0.5)
    return {
      category: 'Slightly Narrow',
      universalMeaning:
        'Sleeve starts just inside shoulder edge, creating cleaner shaped upper body without feeling tight. Sleeves sit slightly higher; movement mostly natural.',
    };
  if (diff <= 0.5)
    return {
      category: 'Aligned',
      universalMeaning:
        'Sleeve starts at or near natural shoulder edge. Balanced upper-body shape. Sleeves fall naturally; movement unrestricted.',
    };
  if (diff <= 1.25)
    return {
      category: 'Slightly Dropped',
      universalMeaning:
        'Sleeve starts slightly below shoulder edge, softening upper body without excessive size. Sleeves begin lower and may appear slightly longer.',
    };
  if (diff <= 2.0)
    return {
      category: 'Dropped',
      universalMeaning:
        'Sleeve starts clearly below shoulder edge. Relaxed, looser upper-body shape. Sleeves appear longer; shoulder line softened.',
    };
  return {
    category: 'Heavily Dropped',
    universalMeaning:
      'Sleeve starts well below shoulder edge. Pronounced oversized or boxy silhouette. Sleeves appear significantly longer; shoulder definition reduced.',
  };
}

/** Master Tables §5 WAIST (Fixed Waistband) */
export function getWaistFixedCategory(diff: number): FitCategory {
  if (diff < -1.0)
    return {
      category: 'Restrictive / Non-Viable',
      universalMeaning:
        'Waistband smaller than body; buttoning or zipping difficult or impossible. Seated comfort unlikely.',
    };
  if (diff < 0)
    return {
      category: 'Snug Waist',
      universalMeaning:
        'Waistband sits firmly against body; fastening feels secure but creates pressure when sitting or bending. Little to no room between waistband and body.',
    };
  if (diff <= 1.0)
    return {
      category: 'Aligned Waist',
      universalMeaning:
        'Waistband matches body circumference with minimal air space; closure fastens comfortably without pulling or gaping. Stays in position without belt; breathing and sitting unrestricted.',
    };
  if (diff <= 2.5)
    return {
      category: 'Relaxed Waist',
      universalMeaning:
        'Waistband sits loosely with noticeable air space; you can easily slide fingers between waistband and body. Belt likely needed to prevent sliding or rotating.',
    };
  return {
    category: 'Oversized Waist',
    universalMeaning:
      'Substantial air space; waistband slides downward or rotates during movement. Belt required.',
  };
}

/** Master Tables §6 WAIST (Elastic/Range Waistband) */
export function getWaistElasticCategory(
  position: number | null,
  belowRange: boolean,
  aboveRange: boolean
): FitCategory {
  if (belowRange)
    return {
      category: 'Below Range',
      universalMeaning:
        'Waistband may not stretch enough to fit comfortably.',
    };
  if (aboveRange)
    return {
      category: 'Outside Range',
      universalMeaning:
        "Above garment's published waistband range; elastic or drawstrings may or may not accommodate.",
    };
  if (position === null)
    return {
      category: 'Below Range',
      universalMeaning:
        'Waistband may not stretch enough to fit comfortably.',
    };
  if (position <= 0.25)
    return {
      category: 'Very Secure',
      universalMeaning: 'Elastic sits firmly with minimal slack.',
    };
  if (position <= 0.6)
    return {
      category: 'Comfortable',
      universalMeaning: 'Natural elastic comfort zone.',
    };
  return {
    category: 'Relaxed',
    universalMeaning: 'Relies more on drawstring or slouch.',
  };
}

/** Master Tables §7 THIGH */
export function getThighCategory(ease: number): FitCategory {
  if (ease < 0)
    return {
      category: 'Restrictive / Non-Viable',
      universalMeaning:
        'Garment thigh smaller than body. Movement restricted; wear unlikely to feel workable.',
    };
  if (ease < 3)
    return {
      category: 'Close Thigh',
      universalMeaning:
        'Fits close to leg with limited extra room. Movement feels firm and controlled.',
    };
  if (ease <= 5)
    return {
      category: 'Regular Thigh',
      universalMeaning:
        'Balanced room allowing natural movement without excess fabric.',
    };
  return {
    category: 'Oversized Thigh',
    universalMeaning:
      'Substantial extra room. Relaxed or oversized leg shape.',
  };
}

/** Master Tables §8 INSEAM */
export function getInseamCategory(diff: number): FitCategory {
  if (diff < -1.0)
    return {
      category: 'Very Short / Cropped',
      universalMeaning:
        'Hem sits well above ankle bone; lower leg and ankle fully visible. Cropped appearance is distinct and intentional.',
    };
  if (diff < -0.5)
    return {
      category: 'Short Length',
      universalMeaning:
        'Hem sits above ankle bone; lower ankle and top of footwear visible. Minimal to no stacking.',
    };
  if (diff <= 0.5)
    return {
      category: 'Aligned Length',
      universalMeaning:
        'Hem lands at or just below ankle bone; rests lightly on footwear with minimal stacking. Slight break may form depending on shoe height.',
    };
  if (diff <= 1.0)
    return {
      category: 'Long Length',
      universalMeaning:
        'Hem extends past ankle bone onto footwear; gentle stacking creates light break at vamp or laces. Hem partially covers shoe.',
    };
  if (diff <= 2.0)
    return {
      category: 'Extended Length',
      universalMeaning:
        'Hem extends well past ankle bone; noticeable stacking creates full break. Multiple horizontal folds form above hem.',
    };
  return {
    category: 'Very Long / Pooled',
    universalMeaning:
      'Heavy stacking pools on footwear and floor. Multiple prominent folds; shoe largely obscured. Excess length is dominant visual feature.',
  };
}

/** Master Tables §9 RISE */
export function getRiseCategory(frontRise: number): FitCategory {
  if (frontRise < 9.0)
    return {
      category: 'Short Rise',
      universalMeaning:
        'Less vertical distance between crotch seam and waistband; seat and top block fit closer to body. Sitting or bending may pull waistband downward more noticeably. Less flexibility in wearing position.',
    };
  if (frontRise < 10.0)
    return {
      category: 'Moderate Rise',
      universalMeaning:
        'Balanced room through seat and upper thighs. Comfortable during sitting and bending. Some flexibility to wear slightly higher or lower.',
    };
  if (frontRise <= 11.25)
    return {
      category: 'Extended Rise',
      universalMeaning:
        'Substantial room through seat, hips, and upper thighs. Comfortable at typical hip height with flexibility to wear higher if desired. Note: wearing higher may change waist fit due to body circumference variation.',
    };
  return {
    category: 'Very Long Rise',
    universalMeaning:
      'Extensive room through seat, hips, and upper thighs. Significant flexibility in wearing position; can be worn higher on torso, though waist fit will feel different at varying heights.',
  };
}

/** Master Tables §10 LEG OPENING */
export function getLegOpeningCategory(ltr: number): FitCategory {
  if (ltr < 0.5)
    return {
      category: 'Strong Taper',
      universalMeaning:
        'Leg narrows sharply from thigh to hem. Skinny/aggressive taper.',
    };
  if (ltr <= 0.65)
    return {
      category: 'Tapered',
      universalMeaning:
        'Gradual narrowing toward hem. Slim/modern taper.',
    };
  if (ltr <= 0.8)
    return {
      category: 'Straight',
      universalMeaning:
        'Consistent width below thigh. Neutral, straight silhouette.',
    };
  return {
    category: 'Open / Wide',
    universalMeaning:
      'Hem opens noticeably. Relaxed, wide, or flared lower leg.',
  };
}
