import type {
  BottomMeasurements,
  ExtractionResult,
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

For sleeves, determine:

sleeveMeasurementType: "shoulder-to-cuff" or "center-back-to-cuff" based on how the brand labels it

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

Respond with ONLY a valid JSON object matching this exact structure (no markdown, no explanation, no code fences):
{
"garmentType": "top" or "bottom",
"garmentSubType": "string — e.g. t-shirt, polo, button-up, hoodie, sweatshirt, sweater, light-jacket, heavy-jacket, jeans, chinos, trousers, sweatpants, joggers, shorts, cargos",
"sizes": {
"SIZE_LABEL": {
...measurements as numbers (inches)
}
},
"fabricInfo": "string or null",
"brandFitNotes": "string or null",
"rawConfidence": "string — brief note about extraction quality, e.g. 'All measurements found in HTML table' or 'Some measurements extracted from screenshot image, may be less precise'"
}
If no garment measurements can be found on this page, respond with:
{
"error": "No garment measurements found",
"reason": "brief explanation"
}`;

const HTML_INSTRUCTION_PREFIX =
  'Here is the HTML from this product page. Look for garment measurements in tables, product details, and any structured data:\n\n';

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
      typeof (parsed as { reason?: string }).reason === 'string'
        ? (parsed as { reason: string }).reason
        : 'Unknown reason';
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
