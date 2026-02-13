interface MissingMeasurementsProps {
  missingMeasurements: { name: string; impact: string }[];
}

function MissingMeasurements({ missingMeasurements }: MissingMeasurementsProps) {
  if (missingMeasurements.length === 0) return null;

  return (
    <div className="rounded border border-gray-200 bg-gray-50 p-3">
      <div className="text-xs font-medium text-gray-600">
        Measurements not provided by brand
      </div>
      <ul className="mt-1.5 space-y-1 text-xs text-gray-500">
        {missingMeasurements.map((mm) => (
          <li key={mm.name}>
            <span className="font-medium">{mm.name}:</span> {mm.impact}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MissingMeasurements;
