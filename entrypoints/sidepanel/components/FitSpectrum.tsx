/**
 * Horizontal spectrum bar showing where a measurement falls on its range.
 * Evenly spaced categories, full labels, endpoint labels, hover segments.
 */

interface CategoryStop {
  label: string;
  boundaryValue: number;
}

interface SpectrumConfig {
  leftLabel: string;
  rightLabel: string;
  referenceLabel?: string;
  referencePosition?: number;
  minValue: number;
  maxValue: number;
  categories: CategoryStop[];
}

const SPECTRUM_CONFIGS: Record<string, SpectrumConfig> = {
  Chest: {
    leftLabel: 'Smaller than body',
    rightLabel: 'Extreme oversized',
    minValue: -2,
    maxValue: 14,
    categories: [
      { label: 'Restrictive', boundaryValue: Number.NEGATIVE_INFINITY },
      { label: 'Ultra Close', boundaryValue: 0 },
      { label: 'Close', boundaryValue: 2 },
      { label: 'Neutral', boundaryValue: 4 },
      { label: 'Relaxed', boundaryValue: 6 },
      { label: 'Oversized', boundaryValue: 8 },
      { label: 'Extreme', boundaryValue: 12 },
    ],
  },
  Shoulder: {
    leftLabel: 'Narrow',
    rightLabel: 'Heavily dropped',
    referenceLabel: 'Your shoulder edge',
    referencePosition: 41.67,
    minValue: -2,
    maxValue: 3.5,
    categories: [
      { label: 'Narrow', boundaryValue: Number.NEGATIVE_INFINITY },
      { label: 'Slightly Narrow', boundaryValue: -1.0 },
      { label: 'Aligned', boundaryValue: -0.5 },
      { label: 'Slightly Dropped', boundaryValue: 0.5 },
      { label: 'Dropped', boundaryValue: 1.25 },
      { label: 'Heavily Dropped', boundaryValue: 2.0 },
    ],
  },
  'Sleeve Length': {
    leftLabel: 'Forearm exposed',
    rightLabel: 'Covers hand',
    referenceLabel: 'Your wrist',
    referencePosition: 41.67,
    minValue: -2,
    maxValue: 3,
    categories: [
      { label: 'Noticeably Short', boundaryValue: Number.NEGATIVE_INFINITY },
      { label: 'Slightly Short', boundaryValue: -1.0 },
      { label: 'Aligned', boundaryValue: -0.5 },
      { label: 'Slightly Long', boundaryValue: 0.5 },
      { label: 'Long', boundaryValue: 1.25 },
      { label: 'Very Long', boundaryValue: 2.0 },
    ],
  },
  'Front Length': {
    leftLabel: 'Above waistband',
    rightLabel: 'Mid-thigh',
    referenceLabel: 'Your waistband',
    referencePosition: 44.44,
    minValue: -0.18,
    maxValue: 0.35,
    categories: [
      { label: 'High-Cropped', boundaryValue: Number.NEGATIVE_INFINITY },
      { label: 'Cropped', boundaryValue: -0.14 },
      { label: 'Aligned', boundaryValue: -0.08 },
      { label: 'Extended', boundaryValue: 0.04 },
      { label: 'Longline', boundaryValue: 0.14 },
      { label: 'Extra-Long', boundaryValue: 0.28 },
    ],
  },
  Waist: {
    leftLabel: 'Smaller than body',
    rightLabel: 'Oversized',
    referenceLabel: 'Your waist',
    referencePosition: 40,
    minValue: -2,
    maxValue: 4,
    categories: [
      { label: 'Restrictive', boundaryValue: Number.NEGATIVE_INFINITY },
      { label: 'Snug', boundaryValue: -1.0 },
      { label: 'Aligned', boundaryValue: 0 },
      { label: 'Relaxed', boundaryValue: 1.0 },
      { label: 'Oversized', boundaryValue: 2.5 },
    ],
  },
  Thigh: {
    leftLabel: 'Smaller than body',
    rightLabel: 'Oversized',
    minValue: -2,
    maxValue: 8,
    categories: [
      { label: 'Restrictive', boundaryValue: Number.NEGATIVE_INFINITY },
      { label: 'Close', boundaryValue: 0 },
      { label: 'Regular', boundaryValue: 3 },
      { label: 'Oversized', boundaryValue: 5 },
    ],
  },
  Rise: {
    leftLabel: 'Short',
    rightLabel: 'Very long',
    minValue: 7.5,
    maxValue: 13,
    categories: [
      { label: 'Short', boundaryValue: Number.NEGATIVE_INFINITY },
      { label: 'Moderate', boundaryValue: 9.0 },
      { label: 'Extended', boundaryValue: 10.0 },
      { label: 'Very Long', boundaryValue: 11.25 },
    ],
  },
  Inseam: {
    leftLabel: 'Well above ankle',
    rightLabel: 'Pools on floor',
    referenceLabel: 'Your ankle',
    referencePosition: 41.67,
    minValue: -2,
    maxValue: 3,
    categories: [
      { label: 'Cropped', boundaryValue: Number.NEGATIVE_INFINITY },
      { label: 'Short', boundaryValue: -1.0 },
      { label: 'Aligned', boundaryValue: -0.5 },
      { label: 'Long', boundaryValue: 0.5 },
      { label: 'Extended', boundaryValue: 1.0 },
      { label: 'Pooled', boundaryValue: 2.0 },
    ],
  },
};

function findCategoryIndex(value: number, categories: CategoryStop[]): number {
  for (let i = categories.length - 1; i >= 0; i--) {
    if (value >= categories[i].boundaryValue) return i;
  }
  return 0;
}

interface FitSpectrumProps {
  measurementName: string;
  delta: number | null;
  category: string;
  rangePosition?: number | null;
  isRange?: boolean;
  rawValue?: number;
}

function FitSpectrum({
  measurementName,
  delta,
  category,
  rangePosition,
  isRange,
  rawValue,
}: FitSpectrumProps) {
  const config = SPECTRUM_CONFIGS[measurementName];
  if (!config) return null;

  const categories = config.categories;
  const N = categories.length;
  const segmentWidth = 100 / N;

  let value: number;
  if (isRange && rangePosition != null) {
    value = rangePosition;
  } else if (delta !== null) {
    value = delta;
  } else if (rawValue != null && measurementName === 'Rise') {
    value = rawValue;
  } else {
    return null;
  }

  const catIndex = findCategoryIndex(value, categories);
  const catStart = categories[catIndex].boundaryValue;
  const catEnd =
    catIndex < categories.length - 1
      ? categories[catIndex + 1].boundaryValue
      : config.maxValue;

  let withinRatio: number;
  if (catStart === Number.NEGATIVE_INFINITY) {
    withinRatio = 0.5;
  } else {
    const span = catEnd - catStart;
    withinRatio =
      span !== 0
        ? Math.min(1, Math.max(0, (value - catStart) / span))
        : 0.5;
  }

  const dotPosition = Math.max(2, Math.min(98, (catIndex + withinRatio) * segmentWidth));
  const idx = catIndex;

  const tickPositions = Array.from({ length: N + 1 }, (_, i) => i * segmentWidth);
  const refPosition = config.referencePosition ?? 50;

  return (
    <div className="mt-2 mb-6">
      <div
        className="relative mb-1"
        style={{ minHeight: 22 }}
      >
        <span
          className="absolute left-0 bottom-0 text-[7.5px] text-[#B8B6B0] text-left leading-[1.3]"
          style={{
            maxWidth: 55,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word',
          }}
        >
          {config.leftLabel}
        </span>
        <span
          className="absolute right-0 bottom-0 text-[7.5px] text-[#B8B6B0] text-right leading-[1.3]"
          style={{
            maxWidth: 55,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word',
          }}
        >
          {config.rightLabel}
        </span>
        {config.referenceLabel != null && config.referencePosition != null && (
          <span
            className="absolute bottom-0 text-[7.5px] text-[#A8A6A1] text-center leading-[1.3] -translate-x-1/2"
            style={{
              left: `${refPosition}%`,
              maxWidth: 55,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            {config.referenceLabel}
          </span>
        )}
      </div>

      <div className="relative h-1.5 bg-[#EDECEA] rounded-full overflow-visible">
        {config.referenceLabel != null && config.referencePosition != null && (
          <div
            className="absolute bg-[#5B7B94] z-[1] -translate-x-1/2"
            style={{ left: `${refPosition}%`, top: 0, width: 1.5, height: 'calc(100% + 6px)' }}
          />
        )}
        {tickPositions.map((tickPos, i) => {
          const isAtRefPosition =
            config.referencePosition != null &&
            Math.abs(tickPos - refPosition) < 2;
          if (isAtRefPosition) return null;
          return (
            <div
              key={`tick-${i}`}
              className="absolute w-px bg-[#D4D2CD] z-[1]"
              style={{
                left: `${tickPos}%`,
                top: '-5px',
                height: 'calc(100% + 10px)',
              }}
            />
          );
        })}

        {categories.map((stop, i) => {
          const segLeft = i * segmentWidth;
          const segWidth = segmentWidth;
          const isCurrentSegment = i === idx;
          return (
            <div
              key={`segment-${i}`}
              className="absolute cursor-pointer group/seg"
              style={{
                left: `${segLeft}%`,
                width: `${segWidth}%`,
                top: '-4px',
                height: 'calc(100% + 8px)',
              }}
            >
              <div className="absolute inset-x-0 top-1 h-1.5 rounded-sm opacity-0 group-hover/seg:opacity-100 bg-[#5B7B94]/10 transition-opacity" />
              <div
                className={`absolute pointer-events-none text-center ${
                  isCurrentSegment ? 'opacity-100' : 'opacity-0 group-hover/seg:opacity-100 transition-opacity'
                }`}
                style={{
                  top: 'calc(100% + 4px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  maxWidth: 'calc(100% - 8px)',
                }}
              >
                <span
                  className={`text-[8px] leading-[1.1] ${
                    isCurrentSegment ? 'text-[#5B7B94] font-medium' : 'text-[#6B7280]'
                  }`}
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {stop.label}
                </span>
              </div>
            </div>
          );
        })}

        {isRange && rangePosition != null ? (
          <div
            className="absolute top-1/2 -translate-y-1/2 h-full bg-[#5B7B94] rounded-full opacity-60 z-[5]"
            style={{
              left: `${Math.max(0, dotPosition - 8)}%`,
              width: `${Math.min(16, dotPosition * 2, (100 - dotPosition) * 2)}%`,
            }}
          />
        ) : (
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-[0_0_0_0.5px_rgba(0,0,0,0.15)] z-[2] pointer-events-none"
            style={{
              left: `${dotPosition}%`,
              backgroundColor: '#5B7B94',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default FitSpectrum;
