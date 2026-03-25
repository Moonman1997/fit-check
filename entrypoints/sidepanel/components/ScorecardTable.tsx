import { useState } from 'react';
import { measurementDescriptions } from '@/lib/descriptions';
import { getGarmentDescription } from '@/lib/garment-descriptions';
import type { MeasurementResult, ScorecardResult } from '@/lib/types';
import FitSpectrum from './FitSpectrum.tsx';

const MEASUREMENT_NAME_TO_KEY: Record<string, string> = {
  Chest: 'chest',
  Shoulder: 'shoulder',
  'Sleeve Length': 'sleeve',
  'Front Length': 'frontLength',
  Waist: 'waistFixed',
  Thigh: 'thigh',
  Inseam: 'inseam',
  Rise: 'rise',
  'Pant Silhouette': 'legOpening',
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
  'Pant Silhouette',
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
  const prefix = m.tier === 'labeled' ? '~' : '';
  if (m.measurementName === 'Front Length') {
    if (m.delta === null) return `${prefix}${m.garmentValue}"`;
    if (m.delta === 0) return `${prefix}Matches body`;
    const pct = Math.round(m.delta * 100);
    return pct > 0
      ? `~${pct}% extended past waistband`
      : `~${Math.abs(pct)}% shorter than waistband`;
  }
  if (m.measurementName === 'Pant Silhouette' && m.delta !== null) {
    return `${prefix}${m.delta.toFixed(2)} leg-to-thigh ratio`;
  }
  if (m.delta === null) {
    if (m.measurementName === 'Rise')
      return `${prefix}${m.garmentValue}" front rise`;
    if (m.measurementName === 'Pant Silhouette')
      return `${prefix}${m.garmentValue.toFixed(2)} ratio`;
    return `${prefix}${m.garmentValue}"`;
  }
  if (m.delta === 0) return `${prefix}Matches body`;
  if (m.delta > 0) return `${prefix}+${m.delta.toFixed(1)}" more than body`;
  return `${prefix}${Math.abs(m.delta).toFixed(1)}" less than body`;
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
      className={`ml-1 w-[15px] h-[15px] rounded-full inline-flex items-center justify-center text-[9px] transition-colors cursor-pointer ${
        isExpanded
          ? 'bg-[#5B7B94] text-white border border-[#5B7B94]'
          : 'border border-[#E8E6E3] text-[#9CA3AF] hover:border-[#5B7B94] hover:text-[#5B7B94]'
      }`}
      aria-label="Measurement info"
      aria-expanded={isExpanded}
    >
      {isExpanded ? '×' : 'ⓘ'}
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
    <div className="mt-3 pt-3 border-t border-[#E8E6E3]">
      <div className="text-[11px] uppercase tracking-[0.06em] text-[#5B7B94] font-medium mb-1">
        What this means
      </div>
      <p className="text-[12.5px] text-[#6B7280] leading-relaxed">
        {description.whatThisMeans}
      </p>
      <div className="text-[11px] uppercase tracking-[0.06em] text-[#5B7B94] font-medium mb-1 mt-3">
        How this shows up in wear
      </div>
      <ul className="list-disc list-inside space-y-0.5 text-[12.5px] text-[#6B7280] leading-relaxed">
        {description.howThisShowsUpInWear.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <div className="text-[11px] uppercase tracking-[0.06em] text-[#5B7B94] font-medium mb-1 mt-3">
        Context
      </div>
      <p className="text-[12.5px] text-[#6B7280] leading-relaxed">
        {description.context}
      </p>
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
              className="bg-[#FCFCFB] border border-dashed border-[#E8E6E3] rounded-lg p-3.5 mb-2 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center gap-0.5">
                <span className="text-[13px] font-medium text-[#1A1A1A]">
                  {name}
                </span>
                {descKey && (
                  <InfoIcon
                    measurementKey={descKey}
                    isExpanded={isDescExpanded}
                    onToggle={() => toggleDescription(name)}
                  />
                )}
              </div>
              <p className="text-[13px] text-[#9CA3AF] italic">
                Not provided by brand
              </p>
              {row.impact && (
                <p className="text-[11.5px] text-[#9CA3AF] mt-0.5">{row.impact}</p>
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
            className="bg-white border border-[#E8E6E3] rounded-lg p-3.5 mb-2 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-0.5">
                <span className="text-[13px] font-medium text-[#1A1A1A]">
                  {name}
                </span>
                {descKey && (
                  <InfoIcon
                    measurementKey={descKey}
                    isExpanded={isDescExpanded}
                    onToggle={() => toggleDescription(name)}
                  />
                )}
              </div>
              <div className="shrink-0 text-right text-[12px] text-[#6B7280]">
                {formatDelta(m)}
              </div>
            </div>
            <p className="text-[14px] text-[#1A1A1A] leading-[1.45]">
              {primaryText}
            </p>
            {m.tier === 'labeled' && m.approximationNote && (
              <p className="text-[11.5px] text-[#9CA3AF] mt-1">
                {m.approximationNote}
              </p>
            )}
            {name === 'Front Length' && (
              <p className="text-[11.5px] text-[#9CA3AF] mt-1">
                Front length is measured relative to the waistband. Most
                modern casual tops fall in the Extended or Longline range.
              </p>
            )}
            <FitSpectrum
              measurementName={name}
              delta={m.delta}
              category={m.fitCategory.category}
              rawValue={m.garmentValue}
            />
            <button
              type="button"
              onClick={() => toggleUniversal(name)}
              className="text-[12px] text-[#5B7B94] cursor-pointer hover:underline mt-1.5"
            >
              {isUniversalExpanded ? 'Less' : 'More'}
            </button>
            {isUniversalExpanded && (
              <p className="text-[13px] text-[#6B7280] leading-relaxed mt-2 pt-2 border-t border-[#E8E6E3]">
                {m.fitCategory.universalMeaning}
              </p>
            )}
            {isDescExpanded && descKey && (
              <DescriptionExpand measurementKey={descKey} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ScorecardTable;
