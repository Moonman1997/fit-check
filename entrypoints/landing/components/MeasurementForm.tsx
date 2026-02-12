import { useState, useEffect } from 'react';
import { getUserMeasurements, saveUserMeasurements } from '@/lib/storage';
import type { UserMeasurements } from '@/lib/types';

const FIELDS: {
  key: keyof UserMeasurements;
  label: string;
  helperText: string;
}[] = [
  {
    key: 'height',
    label: 'Height',
    helperText: 'Your total height in inches (e.g., 70 for 5\'10")',
  },
  {
    key: 'inseam',
    label: 'Inseam',
    helperText: 'Crotch seam to ankle bone along inner leg',
  },
  {
    key: 'chest',
    label: 'Chest',
    helperText: 'Around the fullest part of your chest, under arms',
  },
  {
    key: 'waist',
    label: 'Waist',
    helperText: 'Around your natural waist at the navel',
  },
  {
    key: 'thigh',
    label: 'Thigh',
    helperText: 'Around the fullest part of one thigh',
  },
  {
    key: 'shoulderWidth',
    label: 'Shoulder Width',
    helperText:
      'Point to point across your back, from one shoulder edge to the other',
  },
  {
    key: 'sleeveLength',
    label: 'Sleeve Length',
    helperText:
      'Center-back of neck to wrist bone (tailor measurement)',
  },
];

const initialValues: UserMeasurements = {
  height: 0,
  inseam: 0,
  chest: 0,
  waist: 0,
  thigh: 0,
  shoulderWidth: 0,
  sleeveLength: 0,
};

function MeasurementForm() {
  const [values, setValues] = useState<UserMeasurements>(initialValues);
  const [loaded, setLoaded] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getUserMeasurements().then((stored) => {
      if (stored) {
        setValues(stored);
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(false), 2500);
    return () => clearTimeout(timer);
  }, [successMessage]);

  function handleChange(key: keyof UserMeasurements, value: string) {
    const num = parseFloat(value);
    setValues((prev) => ({ ...prev, [key]: num || 0 }));
    setErrorMessage(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const allPositive = FIELDS.every(
      (field) => values[field.key] > 0
    );

    if (!allPositive) {
      setErrorMessage('All fields must be filled with positive numbers.');
      return;
    }

    saveUserMeasurements(values).then(() => {
      setSuccessMessage(true);
    });
  }

  if (!loaded) {
    return (
      <div className="text-gray-500">Loading...</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {FIELDS.map(({ key, label, helperText }) => (
          <div key={key}>
            <label
              htmlFor={key}
              className="mb-1 block text-sm font-medium"
            >
              {label}
            </label>
            <input
              id={key}
              type="number"
              step="0.1"
              min="0"
              value={values[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">{helperText}</p>
          </div>
        ))}
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      {successMessage && (
        <p className="text-sm text-green-600">Measurements saved!</p>
      )}

      <button
        type="submit"
        className="w-full rounded bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
      >
        Save Measurements
      </button>
    </form>
  );
}

export default MeasurementForm;
