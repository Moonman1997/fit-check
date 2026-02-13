/**
 * Per-garment-type category descriptions for Fit Check.
 * Phase 4C — content from product master table PDFs.
 */

export type GarmentType =
  | 't-shirt'
  | 'polo'
  | 'button-up'
  | 'sweatshirt-hoodie'
  | 'sweater'
  | 'light-jacket'
  | 'heavy-jacket'
  | 'jeans'
  | 'chinos'
  | 'trousers'
  | 'sweatpants'
  | 'joggers'
  | 'shorts'
  | 'cargos';

export interface GarmentCategoryDescription {
  [garmentType: string]: string;
}

type GarmentDescriptionMap = Record<
  string,
  Record<string, GarmentCategoryDescription>
>;

function normalizeToGarmentType(subType: string): GarmentType | null {
  const lower = subType.toLowerCase();
  if (
    lower.includes('t-shirt') ||
    lower.includes('tee') ||
    lower.includes('long sleeve')
  )
    return 't-shirt';
  if (lower.includes('polo')) return 'polo';
  if (
    lower.includes('button-up') ||
    lower.includes('button up') ||
    lower.includes('oxford') ||
    lower.includes('flannel') ||
    lower.includes('dress shirt')
  )
    return 'button-up';
  if (
    lower.includes('sweatshirt') ||
    lower.includes('hoodie') ||
    lower.includes('hoody')
  )
    return 'sweatshirt-hoodie';
  if (
    lower.includes('sweater') ||
    lower.includes('knit') ||
    lower.includes('cardigan')
  )
    return 'sweater';
  if (
    lower.includes('light jacket') ||
    lower.includes('lightweight') ||
    lower.includes('bomber') ||
    lower.includes('windbreaker') ||
    lower.includes('overshirt') ||
    lower.includes('shacket')
  )
    return 'light-jacket';
  if (
    lower.includes('heavy jacket') ||
    lower.includes('coat') ||
    lower.includes('parka') ||
    lower.includes('overcoat') ||
    lower.includes('puffer') ||
    lower.includes('down jacket')
  )
    return 'heavy-jacket';
  if (lower.includes('jeans') || lower.includes('denim')) return 'jeans';
  if (lower.includes('chinos') || lower.includes('chino')) return 'chinos';
  if (
    lower.includes('trousers') ||
    lower.includes('trouser') ||
    lower.includes('dress pants') ||
    lower.includes('slacks')
  )
    return 'trousers';
  if (lower.includes('sweatpants') || lower.includes('sweatpant'))
    return 'sweatpants';
  if (lower.includes('joggers') || lower.includes('jogger')) return 'joggers';
  if (lower.includes('shorts') || lower.includes('short')) return 'shorts';
  if (lower.includes('cargos') || lower.includes('cargo pants') || lower.includes('cargo'))
    return 'cargos';
  return null;
}

const chest: Record<string, GarmentCategoryDescription> = {
  'Restrictive / Non-Viable': {
    't-shirt': 'Must stretch to fit; sits under constant tension across the chest.',
    polo: 'Pulls across the chest and placket; restrictive during movement.',
    'button-up': 'Chest is smaller than body; buttoning comfortably is unlikely.',
    'sweatshirt-hoodie':
      'Tight through the chest with little room for movement or layering.',
    sweater: 'Stretches tightly across the chest; drape is reduced.',
    'light-jacket': 'Restrictive across the chest; limited comfort and mobility.',
    'heavy-jacket':
      'Structure prevents stretch; closure and layering are difficult.',
  },
  'Ultra Close Fit': {
    't-shirt': 'Body-hugging tee; chest contours clearly visible.',
    polo: 'Very fitted through chest and shoulders.',
    'button-up': 'Tight across chest; movement creates visible tension.',
    'sweatshirt-hoodie': 'Snug upper body; little room underneath.',
    sweater: 'Clings depending on knit; little drape.',
    'light-jacket': 'Tight fit; limited mobility.',
    'heavy-jacket': 'Atypical; restricts layering and movement.',
  },
  'Close Fit': {
    't-shirt': 'Clean, fitted tee with minimal excess fabric.',
    polo: 'Sharp, structured polo fit.',
    'button-up': 'Slim shirt silhouette; chest stays close.',
    'sweatshirt-hoodie': 'Fitted hoodie with reduced volume.',
    sweater: 'Close knit fit with restrained drape.',
    'light-jacket': 'Close jacket fit; layering limited.',
    'heavy-jacket': 'Close coat fit; light layering only.',
  },
  'Neutral Fit': {
    't-shirt': 'Standard modern tee fit.',
    polo: 'Standard polo fit.',
    'button-up': 'Classic shirt silhouette; easy movement.',
    'sweatshirt-hoodie': 'Typical hoodie shape; natural volume.',
    sweater: 'Standard sweater fit with modest drape.',
    'light-jacket': 'Standard jacket fit; normal layering.',
    'heavy-jacket': 'Typical coat fit with light layering.',
  },
  'Relaxed Fit': {
    't-shirt': 'Relaxed tee with visible drape.',
    polo: 'Relaxed polo with easy shape.',
    'button-up': 'Casual shirt with clear chest ease.',
    'sweatshirt-hoodie': 'Relaxed hoodie; fuller upper-body volume.',
    sweater: 'Soft, relaxed knit drape.',
    'light-jacket': 'Relaxed jacket or overshirt fit.',
    'heavy-jacket': 'Relaxed coat with added space.',
  },
  'Oversized Fit': {
    't-shirt': 'Oversized tee with pronounced width.',
    polo: 'Fashion-forward oversized polo.',
    'button-up': 'Oversized shirt with broad chest.',
    'sweatshirt-hoodie': 'Oversized hoodie with strong volume.',
    sweater: 'Roomy, expressive knit silhouette.',
    'light-jacket': 'Oversized jacket with broad shape.',
    'heavy-jacket': 'Oversized outerwear silhouette.',
  },
  'Extreme Oversized': {
    't-shirt': 'Very oversized tee; dramatic width.',
    polo: 'Rare; intentionally extreme.',
    'button-up': 'Highly oversized shirt with heavy drape.',
    'sweatshirt-hoodie': 'Streetwear-scale oversized hoodie.',
    sweater: 'Dramatic knit volume.',
    'light-jacket': 'Very oversized jacket.',
    'heavy-jacket': 'Wide, expressive oversized coat.',
  },
};

const frontLength: Record<string, GarmentCategoryDescription> = {
  'High-Cropped': {
    't-shirt': 'High-cropped tee',
    polo: 'High-cropped polo',
    'button-up': 'High-cropped shirt',
    'sweatshirt-hoodie': 'Cropped sweatshirt body',
    sweater: 'Cropped knit',
    'light-jacket': 'Short jacket body above waist',
    'heavy-jacket': 'Minimal torso coverage',
  },
  Cropped: {
    't-shirt': 'Cropped tee',
    polo: 'Cropped polo',
    'button-up': 'Cropped shirt',
    'sweatshirt-hoodie': 'Slightly cropped hoodie',
    sweater: 'Cropped sweater',
    'light-jacket': 'Ends near waistband',
    'heavy-jacket': 'Ends near waist',
  },
  Aligned: {
    't-shirt': 'Tee hem meets waistband',
    polo: 'Polo hem meets waistband',
    'button-up': 'Shirt hem meets waistband',
    'sweatshirt-hoodie': 'Hoodie body meets waistband',
    sweater: 'Knit hem meets waistband',
    'light-jacket': 'Jacket ends at waistband',
    'heavy-jacket': 'Upper-hip coverage',
  },
  Extended: {
    't-shirt': 'Extended-length tee',
    polo: 'Extended polo',
    'button-up': 'Extended shirt body',
    'sweatshirt-hoodie': 'Longer hoodie body',
    sweater: 'Extended knit drape',
    'light-jacket': 'Hip-length jacket',
    'heavy-jacket': 'Hip-length outerwear',
  },
  Longline: {
    't-shirt': 'Longline tee',
    polo: 'Long polo',
    'button-up': 'Long shirt body',
    'sweatshirt-hoodie': 'Long hoodie body',
    sweater: 'Long sweater silhouette',
    'light-jacket': 'Upper-thigh jacket',
    'heavy-jacket': 'Thigh-level coverage',
  },
  'Extra-Long': {
    't-shirt': 'Extra-long / tunic tee',
    polo: 'Extra-long polo',
    'button-up': 'Tunic-length shirt',
    'sweatshirt-hoodie': 'Very long hoodie',
    sweater: 'Extra-long knit',
    'light-jacket': 'Mid-thigh or lower',
    'heavy-jacket': 'Parka-like length',
  },
};

const sleeve: Record<string, GarmentCategoryDescription> = {
  'Noticeably Short': {
    't-shirt': 'Wrist and upper forearm visible; cropped visual line.',
    polo: 'Wrist exposed; sleeve ends high.',
    'button-up': 'Wrist + some forearm visible while arm is lowered.',
    'sweatshirt-hoodie': 'Wrist exposed; sleeve line sits high on arm.',
    sweater: 'Wrist exposed; sleeve ends visibly above wrist.',
    'light-jacket': 'Wrist exposed; sleeve does not meet glove/hand area.',
    'heavy-jacket':
      'Wrist exposed; sleeve sits above outerwear coverage level.',
  },
  'Slightly Short': {
    't-shirt': 'Wrist visible; minor gap between cuff and wrist bone.',
    polo: 'Wrist clearly visible.',
    'button-up': 'Wrist visible; sleeve ends slightly above wrist.',
    'sweatshirt-hoodie': 'Wrist visible; sleeve sits just short of wrist.',
    sweater: 'Wrist visible; subtle short appearance.',
    'light-jacket': 'Wrist visible; does not reach hand.',
    'heavy-jacket': 'Wrist visible; outerwear sleeve sits above wrist line.',
  },
  Aligned: {
    't-shirt': 'Cuff meets wrist; no coverage.',
    polo: 'Wrist line fully matched.',
    'button-up': 'Standard wrist-level sleeve position.',
    'sweatshirt-hoodie': 'Sleeve meets wrist; no pooling.',
    sweater: 'Sleeve meets wrist; no extension onto hand.',
    'light-jacket': 'Sleeve sits at wrist; stable visual line.',
    'heavy-jacket': 'Sleeve reaches wrist bone; hand uncovered.',
  },
  'Slightly Long': {
    't-shirt': 'Cuff touches top of hand; relaxed appearance.',
    polo: 'Light hand contact.',
    'button-up': 'Sleeve contacts top of hand; slight folding at cuff.',
    'sweatshirt-hoodie': 'Cuff extends onto hand; small pooling or bunching.',
    sweater: 'Cuff overlaps hand slightly; soft drape.',
    'light-jacket': 'Cuff overlaps hand; creates a longer sleeve line.',
    'heavy-jacket': 'Sleeve overlaps top of hand; increases coverage.',
  },
  Long: {
    't-shirt': 'Cuff covers thumb base; elongated silhouette.',
    polo: 'Hand partially covered.',
    'button-up': 'Hand partially covered; visible stacking.',
    'sweatshirt-hoodie': 'Cuff covers thumb base; pooling increases.',
    sweater: 'Cuff covers thumb base; more pronounced drape.',
    'light-jacket': 'Cuff extends onto hand; elongated sleeve profile.',
    'heavy-jacket': 'Additional hand coverage; extended sleeve line.',
  },
  'Very Long': {
    't-shirt': 'Sleeve covers thumb joint/knuckles; extended silhouette.',
    polo: 'Cuff sits deep on hand.',
    'button-up': 'Sleeve covers part of hand entirely; strong oversized effect.',
    'sweatshirt-hoodie': 'Sleeve covers thumb joint; heavy pooling possible.',
    sweater: 'Sleeve extends well onto hand; long-drape silhouette.',
    'light-jacket': 'Sleeve covers hand significantly; extended sleeve shape.',
    'heavy-jacket': 'Sleeve extends across hand; maximum coverage.',
  },
};

const shoulder: Record<string, GarmentCategoryDescription> = {
  Narrow: {
    't-shirt':
      'Produces a closer tee silhouette with a defined shoulder line; less relaxed drape.',
    polo: 'Neat, close shoulder; minimal drape.',
    'button-up':
      'Feels fitted through the shoulders; reaching forward may feel more limited.',
    'sweatshirt-hoodie':
      'Creates a more structured upper fit through the shoulders, with less natural slouch than typical hoodies.',
    sweater:
      'Produces a more controlled drape through the shoulders, with the effect varying by knit density.',
    'light-jacket':
      'Reduces layering room and may limit shoulder mobility, depending on construction.',
    'heavy-jacket':
      'Can feel structured and restrictive through the shoulders, especially when layered underneath.',
  },
  'Slightly Narrow': {
    't-shirt':
      'Cleaner tee silhouette with subtle shoulder definition; still relaxed in wear.',
    polo: 'Neat, shaped shoulder; controlled but comfortable drape.',
    'button-up': 'Clean, tailored shoulder line; movement remains comfortable.',
    'sweatshirt-hoodie':
      'Slightly more structured than typical hoodies; reduced slouch without tightness.',
    sweater:
      'More controlled drape through the shoulders; effect varies by knit weight.',
    'light-jacket': 'Cleaner shoulder shape; light reduction in layering room.',
    'heavy-jacket':
      'Structured shoulder presence; still wearable for layering with care.',
  },
  Aligned: {
    't-shirt': 'Standard tee silhouette with natural shoulder drape.',
    polo: 'Balanced polo shape with clean, comfortable lines.',
    'button-up': 'Classic shirt shoulder alignment with natural movement.',
    'sweatshirt-hoodie': 'Typical hoodie drape with a natural amount of slouch.',
    sweater: 'Even knit drape without added tension or looseness.',
    'light-jacket': 'Standard jacket shoulder with normal layering capacity.',
    'heavy-jacket':
      'Traditional coat shoulder structure with predictable movement and layering.',
  },
  'Slightly Dropped': {
    't-shirt': 'Relaxed tee shape with softer shoulder slope; still proportional.',
    polo: 'Slightly more casual polo silhouette with added ease.',
    'button-up':
      'Casual shirt shoulder with visible softness; less formal structure.',
    'sweatshirt-hoodie':
      'Common hoodie fit; relaxed shoulder line without oversizing.',
    sweater: 'Softer knit drape through the shoulders; relaxed appearance.',
    'light-jacket':
      'Casual jacket shape with easier movement and mild looseness.',
    'heavy-jacket':
      'Relaxed outerwear shoulder; increased ease without a boxy feel.',
  },
  Dropped: {
    't-shirt': 'Boxier tee silhouette with a visible shoulder drop and relaxed drape.',
    polo: 'Rare but produces a very casual, relaxed polo shape.',
    'button-up': 'Casual, oversized shirt appearance with softened structure.',
    'sweatshirt-hoodie':
      'Common relaxed hoodie fit with pronounced shoulder drop.',
    sweater: 'Relaxed knit silhouette with noticeable shoulder drape.',
    'light-jacket':
      'Casual jacket shape with a looser, less structured upper body.',
    'heavy-jacket':
      'Relaxed outerwear silhouette with added room and softer shoulder definition.',
  },
  'Heavily Dropped': {
    't-shirt':
      'Very oversized tee with a pronounced shoulder drop and wide silhouette.',
    polo: 'Extremely rare; produces an intentionally oversized polo shape.',
    'button-up': 'Fashion-forward oversized shirt with dramatic looseness.',
    'sweatshirt-hoodie':
      'Common in oversized hoodies; strong shoulder drop with long-appearing sleeves.',
    sweater: 'Dramatic knit drape with a wide, relaxed upper body.',
    'light-jacket': 'Oversized jacket silhouette with minimal shoulder structure.',
    'heavy-jacket':
      'Very oversized outerwear with a broad, relaxed shoulder profile.',
  },
};

const waistFixed: Record<string, GarmentCategoryDescription> = {
  'Restrictive / Non-Viable': {
    jeans: 'Too small',
    chinos: 'Too small',
    trousers: 'Too small',
    sweatpants: 'Elastic may still stretch, but feels overly tight',
    joggers: 'Restrictive',
    shorts: 'Too small',
    cargos: 'Too small',
  },
  'Snug Waist': {
    jeans: 'Snug',
    chinos: 'Snug',
    trousers: 'Tailored-snug',
    sweatpants: 'Firm hold',
    joggers: 'Athletic-snug',
    shorts: 'Snug',
    cargos: 'Snug',
  },
  'Aligned Waist': {
    jeans: 'Standard fit',
    chinos: 'Standard fit',
    trousers: 'Classic waist fit',
    sweatpants: 'Comfortable hold',
    joggers: 'Typical jogger fit',
    shorts: 'Standard',
    cargos: 'Standard',
  },
  'Relaxed Waist': {
    jeans: 'Relaxed',
    chinos: 'Relaxed',
    trousers: 'Relaxed waist',
    sweatpants: 'Easy fit',
    joggers: 'Loose',
    shorts: 'Relaxed',
    cargos: 'Relaxed',
  },
  'Oversized Waist': {
    jeans: 'Oversized',
    chinos: 'Oversized',
    trousers: 'Oversized',
    sweatpants: 'May sag despite elastic',
    joggers: 'Oversized',
    shorts: 'Oversized',
    cargos: 'Oversized',
  },
};

const thigh: Record<string, GarmentCategoryDescription> = {
  'Restrictive / Non-Viable': {
    jeans: 'Restrictive',
    chinos: 'Restrictive',
    trousers: 'Restrictive',
    sweatpants: 'Restrictive despite stretch',
    joggers: 'Restrictive',
    shorts: 'Restrictive',
    cargos: 'Restrictive',
  },
  'Close Thigh': {
    jeans: 'Close fit',
    chinos: 'Close fit',
    trousers: 'Tailored-close',
    sweatpants: 'Close through thigh',
    joggers: 'Athletic-close',
    shorts: 'Close fit',
    cargos: 'Close fit',
  },
  'Regular Thigh': {
    jeans: 'Standard',
    chinos: 'Standard',
    trousers: 'Regular',
    sweatpants: 'Standard sweatpant fit',
    joggers: 'Athletic regular',
    shorts: 'Standard',
    cargos: 'Regular utility',
  },
  'Oversized Thigh': {
    jeans: 'Oversized',
    chinos: 'Oversized',
    trousers: 'Wide / oversized',
    sweatpants: 'Oversized sweatpant',
    joggers: 'Oversized jogger',
    shorts: 'Wide',
    cargos: 'Oversized cargo',
  },
};

const inseam: Record<string, GarmentCategoryDescription> = {
  'Very Short / Cropped': {
    jeans: 'Cropped',
    chinos: 'Cropped',
    trousers: 'Short Trouser Length',
    sweatpants: 'Cropped',
    joggers: 'High-Ankle',
    shorts: 'N/A',
    cargos: 'Cropped',
  },
  'Short Length': {
    jeans: 'Slight Crop',
    chinos: 'Slight Crop',
    trousers: 'Subtle Short Length',
    sweatpants: 'Slight Crop',
    joggers: 'Slight Crop',
    shorts: 'N/A',
    cargos: 'Slight Crop',
  },
  'Aligned Length': {
    jeans: 'True Length',
    chinos: 'True Length',
    trousers: 'Clean Trouser Length',
    sweatpants: 'Standard',
    joggers: 'Standard',
    shorts: 'N/A',
    cargos: 'Aligned',
  },
  'Long Length': {
    jeans: 'Light Stack',
    chinos: 'Light Break',
    trousers: 'Light Trouser Break',
    sweatpants: 'Light Stack',
    joggers: 'Light Stack',
    shorts: 'N/A',
    cargos: 'Light Stack',
  },
  'Extended Length': {
    jeans: 'Stacked',
    chinos: 'Pronounced Break',
    trousers: 'Pronounced Trouser Break',
    sweatpants: 'Stacked',
    joggers: 'Stacked',
    shorts: 'N/A',
    cargos: 'Stacked',
  },
  'Very Long / Pooled': {
    jeans: 'Heavy Stack',
    chinos: 'Extended Length',
    trousers: 'Extended Trouser Length',
    sweatpants: 'Heavy Pooling',
    joggers: 'Heavy Pooling',
    shorts: 'N/A',
    cargos: 'Heavy Stack',
  },
};

const rise: Record<string, GarmentCategoryDescription> = {
  'Short Rise': {
    jeans: 'Short Rise',
    chinos: 'Short Rise',
    trousers: 'Low Depth',
    sweatpants: 'Short Rise',
    joggers: 'Short Rise',
    shorts: 'Short Rise',
    cargos: 'Short Rise',
  },
  'Moderate Rise': {
    jeans: 'Moderate Rise',
    chinos: 'Moderate Rise',
    trousers: 'Standard Depth',
    sweatpants: 'Standard Rise',
    joggers: 'Standard Rise',
    shorts: 'Moderate Rise',
    cargos: 'Moderate Rise',
  },
  'Extended Rise': {
    jeans: 'Extended Rise',
    chinos: 'Extended Rise',
    trousers: 'Extended Depth',
    sweatpants: 'Extended Rise',
    joggers: 'Extended Rise',
    shorts: 'Extended Rise',
    cargos: 'Extended Rise',
  },
  'Very Long Rise': {
    jeans: 'Very Long Rise',
    chinos: 'Very Long Rise',
    trousers: 'Deep Depth',
    sweatpants: 'Very Long Rise',
    joggers: 'Very Long Rise',
    shorts: 'Very Long Rise',
    cargos: 'Very Long Rise',
  },
};

const legOpening: Record<string, GarmentCategoryDescription> = {
  'Strong Taper': {
    jeans: 'Strong taper',
    chinos: 'Strong taper',
    trousers: 'Strong taper',
    sweatpants: 'Narrow hem',
    joggers: 'Narrow jogger',
    cargos: 'Narrow taper',
  },
  Tapered: {
    jeans: 'Tapered',
    chinos: 'Tapered',
    trousers: 'Tapered',
    sweatpants: 'Standard hem',
    joggers: 'Athletic taper',
    cargos: 'Tapered',
  },
  Straight: {
    jeans: 'Straight',
    chinos: 'Straight',
    trousers: 'Straight',
    sweatpants: 'Straight',
    joggers: 'Straight',
    cargos: 'Straight',
  },
  'Open / Wide': {
    jeans: 'Open',
    chinos: 'Open',
    trousers: 'Open',
    sweatpants: 'Open',
    joggers: 'Open',
    cargos: 'Open',
  },
};

const garmentDescriptions: GarmentDescriptionMap = {
  chest,
  frontLength,
  sleeve,
  shoulder,
  waistFixed,
  thigh,
  inseam,
  rise,
  legOpening,
};

/**
 * Returns the per-garment-type description for a measurement + category + garment.
 * Returns null if no match found.
 */
export function getGarmentDescription(
  measurement: string,
  category: string,
  garmentSubType: string
): string | null {
  const garmentType = normalizeToGarmentType(garmentSubType);
  if (garmentType === null) return null;

  const measurementData = garmentDescriptions[measurement];
  if (!measurementData) return null;

  const categoryData = measurementData[category];
  if (!categoryData) return null;

  const description = categoryData[garmentType];
  if (!description) return null;

  if (description === 'N/A') return null;

  return description;
}
