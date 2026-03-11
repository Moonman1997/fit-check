import type { MeasurementResult } from '@/lib/types';

interface CalloutsSectionProps {
  measurements: MeasurementResult[];
  garmentSubType: string;
}

function CalloutsSection({
  measurements,
  garmentSubType,
}: CalloutsSectionProps) {
  const allCallouts: string[] = [];
  const approximationNotes: string[] = [];

  for (const m of measurements) {
    allCallouts.push(...m.callouts);
    if (m.isApproximation && m.approximationNote) {
      approximationNotes.push(m.approximationNote);
    }
  }

  const hasContent =
    allCallouts.length > 0 || approximationNotes.length > 0;
  if (!hasContent) return null;

  return (
    <div className="p-3.5 bg-[#EDF1F5] rounded-lg border border-[#D8E2EA]">
      <div className="text-[12px] uppercase tracking-[0.05em] text-[#5B7B94] font-medium mb-2">
        Things to know
      </div>
      <ul className="space-y-1.5">
        {allCallouts.map((c, i) => (
          <li
            key={i}
            className="text-[12.5px] text-[#6B7280] leading-relaxed pl-3 relative"
            style={{
              listStyle: 'none',
            }}
          >
            <span className="absolute left-0 text-[#5B7B94]">·</span>
            {c}
          </li>
        ))}
        {approximationNotes.map((n, i) => (
          <li
            key={`approx-${i}`}
            className="text-[12.5px] text-[#6B7280] leading-relaxed pl-3 relative italic mb-1.5"
            style={{
              listStyle: 'none',
            }}
          >
            <span className="absolute left-0 text-[#5B7B94]">·</span>
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CalloutsSection;
