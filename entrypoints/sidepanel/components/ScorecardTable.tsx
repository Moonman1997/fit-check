import { useState } from 'react';
import { getGarmentDescription } from '@/lib/garment-descriptions';
import type { MeasurementResult, ScorecardResult } from '@/lib/types';
import MeasurementTooltip from './MeasurementTooltip';

const MEASUREMENT_NAME_TO_KEY: Record<string, string> = {
  Chest: 'chest',
  Shoulder: 'shoulder',
  'Sleeve Length': 'sleeve',
  'Front Length': 'frontLength',
  Waist: 'waistFixed',
  Thigh: 'thigh',
  Inseam: 'inseam',
  Rise: 'rise',
  'Leg Opening': 'legOpening',
};

function formatDelta(
  m: MeasurementResult
): string {
  if (m.measurementName === 'Front Length') {
    if (m.delta === null) return `${m.garmentValue}"`;
    if (m.delta === 0) return 'Matches body';
    const pct = Math.round(m.delta * 100);
    return pct > 0
      ? `~${pct}% extended past waistband`
      : `~${Math.abs(pct)}% shorter than waistband`;
  }
  if (m.delta === null) {
    if (m.measurementName === 'Rise')
      return `${m.garmentValue}" front rise`;
    if (m.measurementName === 'Leg Opening')
      return `${m.garmentValue.toFixed(2)} ratio`;
    return `${m.garmentValue}"`;
  }
  if (m.delta === 0) return 'Matches body';
  if (m.delta > 0)
    return `+${m.delta.toFixed(1)}" more than body`;
  return `${Math.abs(m.delta).toFixed(1)}" less than body`;
}

interface ScorecardTableProps {
  result: ScorecardResult;
}

function ScorecardTable({ result }: ScorecardTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleExpanded(name: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div className="space-y-2">
      {result.measurements.map((m) => {
        const descKey = MEASUREMENT_NAME_TO_KEY[m.measurementName] ?? '';
        const garmentDesc = getGarmentDescription(
          descKey,
          m.fitCategory.category,
          result.garmentSubType
        );
        const primaryText = garmentDesc ?? m.fitCategory.universalMeaning;
        const isExpanded = expanded.has(m.measurementName);

        return (
          <div
            key={m.measurementName}
            className="rounded border border-gray-200 bg-white p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-0.5">
                  <span className="font-medium text-gray-900">
                    {m.measurementName}
                  </span>
                  {descKey && <MeasurementTooltip measurementKey={descKey} />}
                </div>
                <p className="mt-1 text-sm text-gray-700">{primaryText}</p>
                {isExpanded && (
                  <p className="mt-2 border-t border-gray-100 pt-2 text-xs text-gray-500">
                    {m.fitCategory.universalMeaning}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right text-xs text-gray-500">
                {formatDelta(m)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleExpanded(m.measurementName)}
              className="mt-2 flex items-center gap-0.5 text-xs text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? (
                <>
                  <span className="text-gray-400">▼</span> Less
                </>
              ) : (
                <>
                  <span className="text-gray-400">▶</span> More
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ScorecardTable;
