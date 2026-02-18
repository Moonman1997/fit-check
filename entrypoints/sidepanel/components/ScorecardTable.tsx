import { useState } from 'react';
import { measurementDescriptions } from '@/lib/descriptions';
import { getGarmentDescription } from '@/lib/garment-descriptions';
import type { MeasurementResult, ScorecardResult } from '@/lib/types';

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

const EXPECTED_TOP_ORDER = [
  'Chest',
  'Shoulder',
  'Sleeve Length',
  'Front Length',
] as const;

const EXPECTED_BOTTOM_ORDER = [
  'Waist',
  'Thigh',
  'Rise',
  'Inseam',
  'Leg Opening',
] as const;

type MeasurementRow =
  | { isMissing: false; data: MeasurementResult }
  | { isMissing: true; name: string; impact: string };

function buildOrderedRows(result: ScorecardResult): MeasurementRow[] {
  const expected =
    result.garmentType === 'top' ? EXPECTED_TOP_ORDER : EXPECTED_BOTTOM_ORDER;
  const presentMap = new Map(
    result.measurements.map((m) => [m.measurementName, m])
  );
  const missingMap = new Map(
    result.missingMeasurements.map((mm) => [mm.name, mm.impact])
  );

  return expected.map((name) => {
    const present = presentMap.get(name);
    if (present) return { isMissing: false as const, data: present };
    const impact = missingMap.get(name) ?? '';
    return { isMissing: true as const, name, impact };
  });
}

function formatDelta(m: MeasurementResult): string {
  if (m.measurementName === 'Front Length') {
    if (m.delta === null) return `${m.garmentValue}"`;
    if (m.delta === 0) return 'Matches body';
    const pct = Math.round(m.delta * 100);
    return pct > 0
      ? `~${pct}% extended past waistband`
      : `~${Math.abs(pct)}% shorter than waistband`;
  }
  if (m.measurementName === 'Leg Opening' && m.delta !== null) {
    return `${m.delta.toFixed(2)} leg-to-thigh ratio`;
  }
  if (m.delta === null) {
    if (m.measurementName === 'Rise') return `${m.garmentValue}" front rise`;
    if (m.measurementName === 'Leg Opening')
      return `${m.garmentValue.toFixed(2)} ratio`;
    return `${m.garmentValue}"`;
  }
  if (m.delta === 0) return 'Matches body';
  if (m.delta > 0) return `+${m.delta.toFixed(1)}" more than body`;
  return `${Math.abs(m.delta).toFixed(1)}" less than body`;
}

interface InfoIconProps {
  measurementKey: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function InfoIcon({ measurementKey, isExpanded, onToggle }: InfoIconProps) {
  const description = measurementDescriptions[measurementKey];
  if (!description) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] transition-colors ${
        isExpanded
          ? 'border-gray-500 bg-gray-500 text-white'
          : 'border border-gray-300 bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
      aria-label="Measurement info"
      aria-expanded={isExpanded}
    >
      ⓘ
    </button>
  );
}

interface DescriptionExpandProps {
  measurementKey: string;
}

function DescriptionExpand({ measurementKey }: DescriptionExpandProps) {
  const description = measurementDescriptions[measurementKey];
  if (!description) return null;

  return (
    <div className="mt-2 space-y-2 border-t border-gray-100 pt-2 text-xs">
      <div>
        <div className="font-medium text-gray-700">What this means</div>
        <p className="mt-0.5 text-gray-600">{description.whatThisMeans}</p>
      </div>
      <div>
        <div className="font-medium text-gray-700">
          How this shows up in wear
        </div>
        <ul className="mt-0.5 list-inside list-disc space-y-0.5 text-gray-600">
          {description.howThisShowsUpInWear.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <div className="font-medium text-gray-700">Context</div>
        <p className="mt-0.5 text-gray-600">{description.context}</p>
      </div>
    </div>
  );
}

interface ScorecardTableProps {
  result: ScorecardResult;
}

function ScorecardTable({ result }: ScorecardTableProps) {
  const [expandedUniversal, setExpandedUniversal] = useState<Set<string>>(
    new Set()
  );
  const [expandedDescription, setExpandedDescription] = useState<Set<string>>(
    new Set()
  );

  const rows = buildOrderedRows(result);

  function toggleUniversal(name: string) {
    setExpandedUniversal((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function toggleDescription(name: string) {
    setExpandedDescription((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div className="space-y-2">
      {rows.map((row) => {
        const name = row.isMissing ? row.name : row.data.measurementName;
        const descKey = MEASUREMENT_NAME_TO_KEY[name] ?? '';
        const isDescExpanded = expandedDescription.has(name);
        const isUniversalExpanded = expandedUniversal.has(name);

        if (row.isMissing) {
          return (
            <div
              key={name}
              className="rounded border border-gray-200 bg-white p-3"
            >
              <div className="flex items-center gap-0.5">
                <span className="font-medium text-gray-900">{name}</span>
                {descKey && (
                  <InfoIcon
                    measurementKey={descKey}
                    isExpanded={isDescExpanded}
                    onToggle={() => toggleDescription(name)}
                  />
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Not provided by brand
              </p>
              {row.impact && (
                <p className="mt-0.5 text-xs text-gray-400">{row.impact}</p>
              )}
              {isDescExpanded && descKey && (
                <DescriptionExpand measurementKey={descKey} />
              )}
            </div>
          );
        }

        const m = row.data;
        const garmentDesc = getGarmentDescription(
          descKey,
          m.fitCategory.category,
          result.garmentSubType
        );
        const primaryText = garmentDesc ?? m.fitCategory.universalMeaning;

        return (
          <div
            key={name}
            className="rounded border border-gray-200 bg-white p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-0.5">
                  <span className="font-medium text-gray-900">{name}</span>
                  {descKey && (
                    <InfoIcon
                      measurementKey={descKey}
                      isExpanded={isDescExpanded}
                      onToggle={() => toggleDescription(name)}
                    />
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-700">{primaryText}</p>
                {isDescExpanded && descKey && (
                  <DescriptionExpand measurementKey={descKey} />
                )}
                {isUniversalExpanded && (
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
              onClick={() => toggleUniversal(name)}
              className="mt-2 flex items-center gap-0.5 text-xs text-gray-500 hover:text-gray-700"
            >
              {isUniversalExpanded ? (
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
