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
    <div className="rounded border border-gray-200 bg-gray-50 p-3">
      <div className="text-xs font-medium text-gray-700">Things to know</div>
      <ul className="mt-1.5 space-y-1 text-xs text-gray-600">
        {allCallouts.map((c, i) => (
          <li key={i} className="list-inside list-disc">
            {c}
          </li>
        ))}
        {approximationNotes.map((n, i) => (
          <li key={`approx-${i}`} className="list-inside list-disc italic">
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CalloutsSection;
