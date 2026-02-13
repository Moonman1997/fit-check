/**
 * Measurement-level descriptions for Fit Check.
 * Phase 4C — content from product master table PDFs.
 */

export interface MeasurementDescription {
  whatThisMeans: string;
  howThisShowsUpInWear: string[];
  context: string;
}

export const measurementDescriptions: Record<
  string,
  MeasurementDescription
> = {
  chest: {
    whatThisMeans:
      'Chest describes how much space the garment provides around your upper torso relative to your body. This measurement is important because it directly affects comfort, mobility, layering potential, and how the garment\'s upper-body volume is distributed. Chest is one of the primary drivers of overall fit perception in tops. Too little chest space can restrict movement or create visible tension, while more chest space allows the garment to hang away from the torso and accommodate different styling intentions. Fit Check evaluates chest by comparing the garment\'s total chest circumference to your chest measurement to determine the amount of extra room, or ease, present.',
    howThisShowsUpInWear: [
      'Chest ease influences how freely the upper body can move, especially during reaching, sitting, or layering',
      'Lower chest ease can result in pulling, compression, or visible stress around the chest and armholes',
      'Higher chest ease allows more airflow and layering and shifts the garment\'s visual weight outward from the torso',
      'Increased chest ease is commonly used in contemporary and streetwear-oriented garments to create a boxier or more relaxed upper-body silhouette',
    ],
    context:
      'Chest interpretation is affected by body proportions, garment structure, and styling intent. The same amount of chest ease may read differently on different body sizes, and garments designed with dropped shoulders or heavier fabrics may visually emphasize chest volume more than lighter or more structured pieces. Chest should be interpreted alongside shoulder placement and front length to understand how upper-body volume is distributed vertically and horizontally.',
  },
  frontLength: {
    whatThisMeans:
      'Front length describes where the front hem of a top will land on your body when the garment is worn naturally. This affects how much of the waistband, pockets, and upper leg are covered and how long the torso appears visually. Front length is evaluated relative to where most people wear pants today—around the hip rather than the anatomical natural waist. Many modern casual tops are designed with longer front lengths that extend below the waistband. Because of this, front lengths categorized as Extended or Longline are common in everyday wear, while Aligned lengths may feel shorter than what some people are used to, even though they are not cropped.',
    howThisShowsUpInWear: [
      'Shorter front lengths expose more of the waistband and upper pockets',
      'Longer front lengths extend past the waistband and may cover the pockets or reach toward the upper thigh',
      'Front length can appear shorter in wear if the garment fits closely through the chest or stomach, as fabric is pulled over the body rather than hanging straight down',
    ],
    context:
      'Front length perception depends on both body proportions and garment construction. Torso length varies by person, and garments with ribbed hems or structured fabrics may sit higher or bunch rather than hanging straight. Because of this, front length is interpreted as a visual placement guide rather than an exact on-body endpoint. Fit Check v1 evaluates top length using front length only. Back length is not interpreted because it is measured inconsistently across brands and does not reliably predict on-body fit for most casual garments.',
  },
  sleeve: {
    whatThisMeans:
      'Sleeve length describes where the sleeve cuff will land on your arm when the garment is worn naturally. This affects how much of your wrist or hand is covered and how long the sleeve appears when standing still or moving. Brands measure sleeve length in different ways. Some casual garments measure from the shoulder seam to the cuff, while others—especially button-ups—measure from the center of the back of the neck to the wrist or cuff. Fit Check accounts for these differences so sleeve length can be interpreted consistently.',
    howThisShowsUpInWear: [
      'Shorter sleeves expose more of the wrist or forearm',
      'Longer sleeves may rest at the wrist, extend onto the hand, or pool slightly at the cuff',
      'Sleeve length may appear longer or shorter depending on where the sleeve begins on the shoulder',
    ],
    context:
      'Sleeve length perception is influenced by shoulder placement. A dropped shoulder lowers the sleeve\'s starting point and makes sleeves appear longer, while a narrower shoulder raises the starting point and makes sleeves appear shorter. Because of this, sleeve length is evaluated alongside shoulder width rather than in isolation.',
  },
  shoulder: {
    whatThisMeans:
      'Shoulder width describes how far apart the garment\'s shoulder seams sit across the upper back. It affects where the sleeve begins, how the garment hangs through the shoulders, and how structured or relaxed the upper body appears. Most brands measure shoulder width by laying the garment flat and measuring straight across the back from one shoulder seam to the other. Some garments are constructed in ways that make shoulder measurement less exact (such as dropped shoulders, yoke seams, or seamless knits). In these cases, the measurement still indicates where the garment will sit and how it will drape, but it should be read as an approximation of shoulder placement rather than a precise anatomical match.',
    howThisShowsUpInWear: [
      'Shoulder placement affects where the sleeve starts on the arm',
      'Narrower shoulders create a more structured, compact upper body',
      'Wider/dropped shoulders create a more relaxed, casual upper body',
      'Shoulder width is taken into account as part of sleeve length perception',
    ],
    context:
      'Shoulder should be interpreted alongside sleeve length and chest to understand how the upper body is structured overall.',
  },
  waistFixed: {
    whatThisMeans:
      'Waist describes how much space the garment provides around the waistband relative to your body. This measurement is important because it directly affects comfort, stability, and where the garment sits during wear. Waist refers to the garment\'s waistband measurement, not the anatomical natural waist. Most modern pants are designed to sit around the high-hip area rather than at the natural waist, so waist fit describes how the waistband will feel at your typical wearing height.',
    howThisShowsUpInWear: [
      'Waist ease affects how secure or relaxed the waistband feels when standing, sitting, or moving',
      'Higher waist ease allows the garment to sit more loosely or rely more on belts, drawstrings, or elastic for stability',
    ],
    context:
      'Waist interpretation is influenced by intended wearing position and garment construction. Fixed waists behave more predictably, while elastic or adjustable waists can accommodate a range of body sizes and preferences. Waist should be interpreted alongside rise to understand how the pants feel through the seat and upper thigh, and why the same inseam can look or feel different across garments.',
  },
  waistElastic: {
    whatThisMeans:
      'Some garments—most commonly sweatpants, joggers, and certain casual shorts—do not provide a single fixed waistband measurement. Instead, they publish a waist range to reflect elastic stretch and drawstring adjustment. This measurement is important because it determines how securely the waistband can accommodate different body sizes and wearing preferences. For these garments, waist refers to the garment\'s usable waistband range, not a single resting circumference.',
    howThisShowsUpInWear: [
      'Waist fit is evaluated based on where your waist falls within the garment\'s published range',
      'Fit can vary depending on how the waistband is worn and adjusted',
    ],
    context:
      'Elastic and adjustable waistbands do not behave like fixed-waist garments and should be interpreted differently to avoid false precision. Instead of a single waist difference, Fit Check interprets these garments positionally within the published range. Waist should be interpreted alongside rise to understand how the pants feel through the seat and upper thigh.',
  },
  thigh: {
    whatThisMeans:
      'Thigh describes how much space the garment provides around the upper leg relative to your body. This measurement is important because it directly affects mobility, comfort during movement, and how the pant leg fits through the upper thigh. Garment thigh measurements are typically taken flat across the leg and must be doubled to estimate total thigh circumference. Fit Check compares this garment thigh circumference to your thigh circumference to determine how much room, or ease, is present.',
    howThisShowsUpInWear: [
      'Thigh ease influences freedom of movement when walking, sitting, or bending',
    ],
    context:
      'Thigh measurements are not fully standardized across brands, and small differences in where the widest point is measured are common. Thigh should be interpreted alongside rise and leg opening to understand how the pant leg accommodates the upper leg and how volume transitions through the lower body.',
  },
  inseam: {
    whatThisMeans:
      'Inseam describes the distance from the crotch seam to the hem along the inside of the leg. This measurement is important because it determines how long the pant leg is below the crotch and where the hem will land relative to your leg. Inseam does not represent the garment\'s total length from the waistband to the hem. Instead, it reflects the length of the leg portion of the pant once worn.',
    howThisShowsUpInWear: [
      'Longer inseams allow the hem to reach lower and interact with footwear, creating either a break or stacking',
      'Excess length may also be worn cuffed, which changes how the hem lands without altering the inseam measurement',
      'Two garments with the same inseam can appear different in length depending on how the upper portion of the pant fits',
    ],
    context:
      'Perceived inseam length is influenced by rise and top-block construction. A longer rise places the crotch seam lower on the body, which can make the same inseam feel longer in wear, while a shorter rise can make the same inseam feel shorter. Inseam and rise should be interpreted together rather than adjusted numerically.',
  },
  rise: {
    whatThisMeans:
      'Rise describes how much vertical room the garment provides above the inseam through the seat and crotch. This measurement is important because it affects comfort, mobility, and how the pant accommodates the body through the hips and upper thighs. Rise does not determine how high or low most modern pants are worn. Many wearers tend to wear different pants at a similar height regardless of rise. Instead, rise affects how the garment fits once worn, specifically how much room exists through the seat, how the crotch feels during movement, and how the upper portion of the pant drapes or pulls.',
    howThisShowsUpInWear: [
      'A longer rise may allow the waistband to be worn higher if desired, but does not require or imply a higher wearing position',
      'If a garment is worn higher or lower than the wearer\'s typical position, the waistband may feel looser or tighter due to natural changes in body circumference at different heights',
    ],
    context:
      'Rise interpretation is influenced by body shape and how the garment is styled, but it should not be read as a directive for where pants must sit on the body. Rise should be interpreted alongside waist and thigh to understand how the upper block of the pant accommodates the body and why garments with similar waist and inseam measurements can feel very different in wear.',
  },
  legOpening: {
    whatThisMeans:
      'Leg opening describes the width of the pant at the hem relative to the width of the thigh. This measurement is used to understand how the leg narrows, stays straight, or opens as it moves downward, which defines the lower-leg silhouette. Leg opening reflects shape only, not how loose or fitted the pant is overall. A garment can have a narrow or wide leg opening regardless of how much room it has through the thigh or seat.',
    howThisShowsUpInWear: [
      'Narrower leg openings create a tapered lower-leg shape, while wider openings create a straighter or more open silhouette',
      'Two garments with the same thigh fit can appear very different below the knee depending on leg opening',
      'Leg opening affects how the pant visually balances with footwear and how fabric gathers or hangs near the hem',
    ],
    context:
      'Leg opening should be interpreted alongside thigh to understand how volume is distributed through the leg. A pant may feel relaxed through the thigh but appear narrow at the hem, or feel trim above the knee while appearing wide below it. Because leg opening describes shape rather than fit, it should not be used alone to infer comfort or tightness.',
  },
};
