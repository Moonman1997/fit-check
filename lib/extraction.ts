import type {
  BottomMeasurements,
  ExtractionResult,
  MeasurementTier,
  TopMeasurements,
} from './types';

const MAX_HTML_LENGTH = 60_000;
const TRUNCATION_NOTE = '[HTML truncated at 60,000 characters]';

export function truncateHTML(html: string): string {
  let result = html;

  result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  result = result.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
  result = result.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  result = result.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');
  result = result.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');
  result = result.replace(/<!--[\s\S]*?-->/g, '');
  result = result.replace(/\s+/g, ' ');

  if (result.length > MAX_HTML_LENGTH) {
    result = result.slice(0, MAX_HTML_LENGTH) + ' ' + TRUNCATION_NOTE;
  }

  return result;
}

const SYSTEM_PROMPT = `You are a garment measurement extraction system. Your job is to find and extract garment measurements from a product page.
You are given:

A screenshot of the product page (which may show a size chart modal or table)
The HTML of the product page (which may contain measurements in product details, tables, or hidden elements)

DATA SOURCE PRIORITY:

ALWAYS prefer structured HTML data over the screenshot image for extracting measurements.
HTML tables and structured elements provide unambiguous column-to-header mapping, while screenshots require visual parsing that can lead to column confusion.
Use the screenshot primarily for: confirming garment type, reading visual-only size charts (images), and cross-checking HTML data.
When you find a size chart in the HTML (look for table elements, div grids with row/col structure, or repeated measurement patterns), extract measurements from the HTML.
Pay close attention to units embedded in values (e.g., "43.2in", "37.7cm") — these tell you exactly what unit each value is in.

MEASUREMENT SOURCING TIERS:
For each measurement you extract, determine where it came from:

Tier 1 - GARMENT MEASUREMENT: An actual garment measurement from a size chart or product details.
These are measurements of the physical garment (e.g., "Chest: 22 inches flat", "Inseam: 32 inches").
This is the gold standard — use these whenever available.

Tier 2 - BODY MEASUREMENT: A measurement describing the person the garment is designed to fit, NOT the garment itself.
Examples: "Designed for chest 38-40 inches", "Waist: 32-34" in a "Size Guide" that maps sizes to body dimensions.
Do NOT extract body measurements as garment measurements. Instead, note them in the bodyMeasurementNote field.

Tier 3 - LABELED SELECTOR: When no size chart exists but the product page has size selectors like "35W", "34L", "32x30".
The number in the selector label can be used as an approximate measurement.
Only use this when NO garment measurement chart and NO body measurement chart provides the value.

Tier 4 - UNAVAILABLE: The measurement cannot be determined from any source on the page.

IMPORTANT: Tiers are assigned PER MEASUREMENT, not per page. A single page might have:
- Garment measurements for rise and leg opening (Tier 1)
- Body measurements for waist (Tier 2 — do not extract, just note it)
- Labeled selectors for waist and inseam (Tier 3 — use as approximate)
- No thigh data at all (Tier 4)

JEANS AND WAIST × LENGTH PRODUCTS:
Some products (especially jeans) use a dual sizing system: waist number × length number (e.g., 35W × 34L, or "32 x 30").
When you detect this pattern:
- Set sizingFormat to "waist-length"
- Extract all available waist options as labeledWaistOptions (just the numbers, e.g., [28, 29, 30, 31, 32])
- Extract all available length options as labeledLengthOptions (just the numbers, e.g., [28, 30, 32, 34])
- For the sizes object: create ONE entry called "default" with any shared garment measurements (rise, leg opening, thigh if available)
- The waist and inseam values will come from the user's selector choice, not from the sizes object

How to detect waist × length format:
- Product page has separate waist and length/inseam selectors
- Size options look like "32W", "34W" or "28L", "30L", "32L"
- Size options look like "32x30", "34x32"
- Product is jeans/denim with numeric sizing

BODY MEASUREMENT DETECTION:
If you find a size chart that contains body measurements instead of garment measurements, report this:
- Set bodyMeasurementNote to a clear explanation, e.g.: "This brand provides body measurements (the body size each garment size is designed to fit) rather than garment measurements (the actual dimensions of the garment). Fit analysis requires garment measurements for full accuracy."
- Do NOT extract body measurements into the sizes object
- Still extract any actual garment measurements found elsewhere on the page (e.g., in "Size & fit" text)

Extract the following information:
GARMENT TYPE:

Determine if this is a "top" or "bottom"
Determine the specific garment sub-type (e.g., "t-shirt", "hoodie", "jeans", "chinos", "sweatpants")

MEASUREMENTS:
For tops, extract these measurements PER SIZE when available:

chest: pit-to-pit width (flat measurement, in inches)
shoulder: shoulder seam to shoulder seam (flat, in inches)
sleeveLength: sleeve length (flat, in inches)
frontLength: front length / body length from HPS to hem (flat, in inches)

IMPORTANT: Only extract this as frontLength if the brand labels it as "front length", "body length", or just "length" without qualifier.
If the brand specifically labels it as "back length" or "length (back)", do NOT extract it as frontLength. Back length and front length are different measurements and are not interchangeable.
If only back length is available, omit frontLength entirely (the system will mark it as a missing measurement).

For bottoms, extract these measurements PER SIZE when available:

waist: waistband width (flat measurement, in inches)
frontRise: front rise (in inches)
thigh: thigh width at widest point (flat, in inches)
inseam: inseam length (in inches)
legOpening: leg/hem opening width (flat, in inches)

Also determine for bottoms:

waistType: "fixed" or "elastic" (if the waistband has elastic or drawstring, use "elastic")
waistMin and waistMax: if elastic, extract the waist range if provided
If only inseam is not available but outseam is, extract outseam instead

BOTTOMS MEASUREMENT VALIDATION:
Before returning your response, validate each measurement against these typical ranges (in inches):

waist: 26-50 inches (flat: 13-25 inches)
frontRise: 8-14 inches. If your extracted rise value is above 15 inches, you likely grabbed the wrong column or didn't convert from cm.
thigh: 9-16 inches (flat). If above 20, check if the value is in cm and needs conversion.
inseam: 28-36 inches for full-length pants. If above 40 inches, this is likely an OUTSEAM (total length from waistband to hem), not an inseam. Extract it as "outseam" instead.
legOpening: 5-12 inches (flat) for most pants. If above 15, check if the value is in cm and needs conversion.
outseam: 38-48 inches typically.

OUTSEAM vs INSEAM:

If a size chart column is labeled "Length", "Total Length", or "Outseam", this is the outseam — NOT the inseam.
If the value in a "Length" column is above 38 inches, it is almost certainly outseam.
Extract outseam values in the "outseam" field. The system will convert to inseam automatically.
Do NOT put outseam values in the "inseam" field.

MIXED UNITS (CM AND INCHES):

Some size charts mix cm and inches in different columns.
Check EACH column independently — do not assume the whole chart uses the same unit.
If a column header says "cm" or values are typically 2.54x larger than expected, convert to inches.
Common giveaways: waist values above 60 are in cm, rise values above 20 are in cm, leg opening above 15 is likely cm.

SIZE VARIANTS (TALL, SHORT, LONG):

If a size chart includes variants like "S-TALL", "M-TALL", "L-TALL" or "Short", "Regular", "Long" options:
Extract EACH variant as a separate size with its own measurements.
Do NOT copy measurements from one variant to another — read each row individually.
TALL variants typically differ in inseam/outseam length from regular sizes.

SAME MEASUREMENTS ACROSS SIZES:

Some brands publish garment measurements for only one size (e.g., "Taken from size M").
If measurements like inseam, rise, and leg opening are identical across all sizes, this is likely correct — these dimensions often don't vary by size for casual pants.
However, waist and thigh SHOULD vary by size. If they don't, something may be wrong.

INSEAM LENGTH OPTIONS:

Some brands offer multiple inseam lengths (e.g., "Short: 26 inches, Regular: 28 inches, Long: 30 inches").
Extract the REGULAR inseam as the default inseam value.
Note the other options in brandFitNotes (e.g., "Also available in Short (26 inch) and Long (30 inch) inseam").

COLUMN IDENTIFICATION:

When a size chart has multiple columns, carefully match each column header to the correct measurement field.
"Opening" or "Hem" or "Leg Opening" = legOpening
"Rise" or "Front Rise" = frontRise
"Length" or "Outseam" = outseam (not inseam, unless explicitly labeled "Inseam")
"Half Waist" = half of waist circumference (multiply by 2 for waist, or ignore if full waist is also provided)
Do NOT confuse adjacent columns — read each header and its values independently.

DO NOT FABRICATE MEASUREMENTS:

Only extract a measurement if there is a clearly labeled column or field for it.
If a size chart does not have a column for "thigh" or "upper thigh" or "thigh width", do NOT extract thigh. Leave it out entirely — the system will mark it as missing.
Do NOT repurpose values from other columns to fill in missing measurements. For example:

"Half Waist" is NOT thigh
"Opening" is NOT rise (unless explicitly labeled as rise)
"Length" is NOT inseam (it is outseam)


It is always better to omit a measurement than to extract the wrong value. Missing measurements are handled gracefully by the system. Wrong measurements damage user trust.

For sleeves, determine the measurement type:
sleeveMeasurementType: "shoulder-to-cuff" or "center-back-to-cuff"

Look at all sleeve values across all sizes and classify by majority:
- If most sleeve values are 28 inches or under → set "shoulder-to-cuff"
  for every size
- If most sleeve values are 32 inches or over → set "center-back-to-cuff"
  for every size
- If no clear majority (most values fall between 28-32", or values are
  split) → default to "shoulder-to-cuff" and note the ambiguity in
  rawConfidence

Secondary label signals (only use when majority rule produces no clear
result):
- "center back", "CB", "centre back", "from center", "from neck" →
  center-back-to-cuff
- Label says only "sleeve length" with no qualifier → use majority rule
  above

Set the same sleeveMeasurementType for every size — do not vary it
per size.

CONTEXTUAL INFO:

fabricInfo: fabric/material composition if available (e.g., "100% Cotton", "80% Cotton, 20% Polyester")
brandFitNotes: any brand-provided fit description (e.g., "Relaxed fit", "Slim fit", "Oversized")

IMPORTANT RULES:

Only extract GARMENT measurements (flat/laid-flat measurements of the clothing itself). Do NOT extract body measurements (measurements of the human body used for size recommendation).
If a brand provides both garment measurements and body measurements, extract ONLY the garment measurements.
All measurements must be in inches. If measurements are in centimeters, convert to inches (divide by 2.54).
Extract measurements for ALL available sizes, not just one size.
If a measurement is not available for any size, omit it entirely rather than guessing.
Flat measurements should stay as flat values (do not double them). The system handles flat-to-circumference conversion.
Look for measurements in: size chart tables, product description text, technical details sections, and the screenshot image.

CRITICAL: For tops, you MUST include the "sleeveMeasurementType" field in EVERY size object. This field is required, not optional. Set it to "shoulder-to-cuff" or "center-back-to-cuff" based on your analysis.

Respond with ONLY a valid JSON object matching this structure (no markdown, no explanation, no code fences):

For STANDARD products (most tops, pants with garment measurement charts):
{
"garmentType": "top" or "bottom",
"garmentSubType": "string",
"sizingFormat": "standard",
"sizes": {
"SIZE_LABEL": {
// For tops: chest, shoulder, sleeveLength, sleeveMeasurementType, frontLength
// For bottoms: waist, frontRise, thigh, inseam, outseam, legOpening, waistType, waistMin, waistMax
}
},
"measurementTiers": {
"chest": "garment",
"shoulder": "garment",
"sleeveLength": "garment",
"frontLength": "garment"
},
"fabricInfo": "string or null",
"brandFitNotes": "string or null",
"bodyMeasurementNote": "string or null",
"rawConfidence": "string"
}

For JEANS / WAIST × LENGTH products:
{
"garmentType": "bottom",
"garmentSubType": "jeans",
"sizingFormat": "waist-length",
"sizes": {
"default": {
"frontRise": 12.75,
"legOpening": 15.5
}
},
"labeledWaistOptions": [28, 29, 30, 31, 32, 33, 34, 36, 38, 40, 42],
"labeledLengthOptions": [28, 30, 32, 34],
"measurementTiers": {
"waist": "labeled",
"inseam": "labeled",
"frontRise": "garment",
"legOpening": "garment",
"thigh": "unavailable"
},
"fabricInfo": "string or null",
"brandFitNotes": "string or null",
"bodyMeasurementNote": "This brand provides body measurements rather than garment measurements in the size chart. Fit analysis uses garment data from the product description where available.",
"rawConfidence": "string"
}

If no garment measurements can be found on this page, respond with:
{"error": "No garment measurements found", "reason": "brief explanation"}`;

const HTML_INSTRUCTION_PREFIX =
  'Here is the HTML from this product page. Look for garment measurements in tables, product details, and any structured data:\n\n';

const VALID_TIERS: MeasurementTier[] = [
  'garment',
  'body',
  'labeled',
  'unavailable',
];

function parseMeasurementTiers(
  raw: unknown
): Record<string, MeasurementTier> | undefined {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw))
    return undefined;
  const obj = raw as Record<string, unknown>;
  const result: Record<string, MeasurementTier> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string' && VALID_TIERS.includes(val as MeasurementTier))
      result[key] = val as MeasurementTier;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function stripMarkdownFences(text: string): string {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) return jsonMatch[1].trim();
  return text.trim();
}

function parseAndValidateResponse(
  text: string
): ExtractionResult {
  const raw = stripMarkdownFences(text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Failed to parse Claude response as JSON: ${raw.slice(0, 200)}`);
  }

  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    'error' in parsed &&
    typeof (parsed as { error: string }).error === 'string'
  ) {
    const reason =
      (parsed as Record<string, string>).reason || 'Unknown reason';
    throw new Error(`Extraction failed: ${reason}`);
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('garmentType' in parsed) ||
    !('garmentSubType' in parsed) ||
    !('sizes' in parsed)
  ) {
    throw new Error(
      'Claude response missing required fields: garmentType, garmentSubType, sizes'
    );
  }

  const p = parsed as Record<string, unknown>;
  const garmentType = p.garmentType;
  const garmentSubType = p.garmentSubType;
  const sizes = p.sizes;

  if (garmentType !== 'top' && garmentType !== 'bottom') {
    throw new Error(`Invalid garmentType: ${garmentType}`);
  }
  if (typeof garmentSubType !== 'string') {
    throw new Error('garmentSubType must be a string');
  }
  if (typeof sizes !== 'object' || sizes === null || Array.isArray(sizes)) {
    throw new Error('sizes must be an object');
  }

  const result: ExtractionResult = {
    garmentType,
    garmentSubType,
    sizes: sizes as Record<string, TopMeasurements | BottomMeasurements>,
    fabricInfo:
      typeof p.fabricInfo === 'string' && p.fabricInfo
        ? p.fabricInfo
        : undefined,
    brandFitNotes:
      typeof p.brandFitNotes === 'string' && p.brandFitNotes
        ? p.brandFitNotes
        : undefined,
    rawConfidence:
      typeof p.rawConfidence === 'string' && p.rawConfidence
        ? p.rawConfidence
        : undefined,
    sizingFormat:
      p.sizingFormat === 'waist-length'
        ? 'waist-length'
        : p.sizingFormat === 'standard'
          ? 'standard'
          : undefined,
    labeledWaistOptions: Array.isArray(p.labeledWaistOptions)
      ? (p.labeledWaistOptions as number[]).filter(
          (n): n is number => typeof n === 'number' && !Number.isNaN(n)
        )
      : undefined,
    labeledLengthOptions: Array.isArray(p.labeledLengthOptions)
      ? (p.labeledLengthOptions as number[]).filter(
          (n): n is number => typeof n === 'number' && !Number.isNaN(n)
        )
      : undefined,
    measurementTiers: parseMeasurementTiers(p.measurementTiers),
    bodyMeasurementNote:
      typeof p.bodyMeasurementNote === 'string' && p.bodyMeasurementNote
        ? p.bodyMeasurementNote
        : undefined,
  };

  return result;
}

export async function extractMeasurements(
  screenshotBase64: string,
  pageHTML: string
): Promise<ExtractionResult> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error('Claude API key not configured');
  }

  const truncatedHTML = truncateHTML(pageHTML);
  const textBlock = HTML_INSTRUCTION_PREFIX + truncatedHTML;

  const body = {
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user' as const,
        content: [
          {
            type: 'image' as const,
            source: {
              type: 'base64' as const,
              media_type: 'image/png' as const,
              data: screenshotBase64,
            },
          },
          {
            type: 'text' as const,
            text: textBlock,
          },
        ],
      },
    ],
  };

  let response: Response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Claude API request failed: ${msg}`);
  }

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Claude API returned ${response.status}: ${responseText.slice(0, 500)}`
    );
  }

  let responseJson: { content?: { type: string; text?: string }[] };
  try {
    responseJson = JSON.parse(responseText);
  } catch {
    throw new Error(`Invalid Claude API response: ${responseText.slice(0, 200)}`);
  }

  const content = responseJson.content;
  if (!Array.isArray(content) || content.length === 0) {
    throw new Error('Claude API response has no content');
  }

  const textBlockResponse = content.find(
    (c): c is { type: 'text'; text: string } =>
      c.type === 'text' && typeof c.text === 'string'
  );
  if (!textBlockResponse) {
    throw new Error('Claude API response has no text content');
  }

  return parseAndValidateResponse(textBlockResponse.text);
}
